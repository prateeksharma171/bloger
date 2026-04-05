import jwt from "jsonwebtoken";
import { User } from "../models/users.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { validateRequiredFields } from "../utils/validatorsFun.js";
import { tryCatch } from "../utils/tryCatch.js";
import type { AuthRequest } from "../middleware/isAuth.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;
const ACCESS_TOKEN_MAX_AGE = 15 * 60 * 1000;
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000;
const isProduction = process.env.NODE_ENV === "production";

type JwtPayload = {
  userId: string;
  email?: string;
};

const ensureSecrets = (res: any) => {
  if (!JWT_SECRET || !REFRESH_SECRET) {
    res.status(500).json({
      message: "JWT_SECRET or REFRESH_SECRET is not defined",
    });
    return false;
  }

  return true;
};

const getSafeUser = (user: { _id: unknown; email: string; name: string }) => ({
  id: String(user._id),
  email: user.email,
  name: user.name,
});

const signAccessToken = (payload: JwtPayload) =>
  jwt.sign(payload, JWT_SECRET!, { expiresIn: "15m" });

const signRefreshToken = (userId: string) =>
  jwt.sign({ userId }, REFRESH_SECRET!, { expiresIn: "7d" });

const setAuthCookies = (
  res: any,
  accessToken: string,
  refreshTokenValue: string,
) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });

  res.cookie("refreshToken", refreshTokenValue, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });
};

const clearAuthCookies = (res: any) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
  });
};

const createSession = async (user: InstanceType<typeof User>) => {
  const accessToken = signAccessToken({
    userId: String(user._id),
    email: user.email,
  });
  const refreshTokenValue = signRefreshToken(String(user._id));

  user.refreshToken = refreshTokenValue;
  await user.save();

  return {
    accessToken,
    refreshToken: refreshTokenValue,
    user: getSafeUser(user),
  };
};

export const signupUser = tryCatch(async (req, res) => {
  const result = validateRequiredFields(req.body, ["name", "email", "password"]);

  if (!result.isValid) {
    return res.status(400).json({
      message: "Missing required fields",
      missingFields: result.missing,
    });
  }

  if (!ensureSecrets(res)) {
    return;
  }

  const { name, email, password } = req.body;
  const normalizedEmail = String(email).trim().toLowerCase();

  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    return res.status(409).json({
      message: "User already exists. Please log in instead.",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({
    name: String(name).trim(),
    email: normalizedEmail,
    password: hashedPassword,
  });

  const session = await createSession(user);
  setAuthCookies(res, session.accessToken, session.refreshToken);

  return res.status(201).json({
    message: "Account created successfully",
    accessToken: session.accessToken,
    user: session.user,
  });
});

export const loginUser = tryCatch(async (req, res) => {
  const result = validateRequiredFields(req.body, ["email", "password"]);

  if (!result.isValid) {
    return res.status(400).json({
      message: "Missing required fields",
      missingFields: result.missing,
    });
  }

  if (!ensureSecrets(res)) {
    return;
  }

  const { email, password } = req.body;
  const normalizedEmail = String(email).trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }

  const session = await createSession(user);
  setAuthCookies(res, session.accessToken, session.refreshToken);

  return res.status(200).json({
    message: "User logged in successfully",
    accessToken: session.accessToken,
    user: session.user,
  });
});

export const refreshUserToken = tryCatch(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;

  if (!incomingRefreshToken) {
    return res.status(401).json({
      message: "Refresh token missing",
    });
  }

  if (!ensureSecrets(res)) {
    return;
  }

  let decoded: string | jwt.JwtPayload;

  try {
    decoded = jwt.verify(incomingRefreshToken, REFRESH_SECRET!);
  } catch {
    clearAuthCookies(res);
    return res.status(403).json({
      message: "Invalid refresh token",
    });
  }

  if (typeof decoded === "string" || !decoded.userId) {
    clearAuthCookies(res);
    return res.status(403).json({ message: "Invalid token payload" });
  }

  const user = await User.findById(decoded.userId);

  if (!user) {
    clearAuthCookies(res);
    return res.status(403).json({
      message: "User not found",
    });
  }

  if (!user.refreshToken || user.refreshToken !== incomingRefreshToken) {
    user.refreshToken = "";
    await user.save();
    clearAuthCookies(res);
    return res.status(403).json({
      message: "Refresh token mismatch",
    });
  }

  const session = await createSession(user);
  setAuthCookies(res, session.accessToken, session.refreshToken);

  return res.status(200).json({
    message: "Session refreshed successfully",
    accessToken: session.accessToken,
    user: session.user,
  });
});

export const logoutUser = tryCatch<AuthRequest>(async (req, res) => {
  if (req.user?.userId) {
    await User.findByIdAndUpdate(req.user.userId, {
      $set: { refreshToken: "" },
    });
  } else {
    const incomingRefreshToken =
      req.cookies?.refreshToken || req.body?.refreshToken;

    if (incomingRefreshToken) {
      await User.findOneAndUpdate(
        { refreshToken: incomingRefreshToken },
        { $set: { refreshToken: "" } },
      );
    }
  }

  clearAuthCookies(res);

  return res.status(200).json({
    message: "Logged out successfully",
  });
});

export const getCurrentUser = tryCatch<AuthRequest>(async (req, res) => {
  if (!req.user?.userId) {
    return res.status(401).json({
      message: "Unauthorized Access",
    });
  }

  const user = await User.findById(req.user.userId);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  return res.status(200).json({
    user: getSafeUser(user),
  });
});

export const getUserById = tryCatch(async (req, res) => {
  const { id } = req.params;

  const result = validateRequiredFields(req.params, ["id"]);

  if (!result.isValid) {
    return res.status(400).json({
      message: "Missing required fields",
      missingFields: result.missing,
    });
  }

  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  return res.status(200).json({
    user,
  });
});

export const updateUserById = tryCatch<AuthRequest>(async (req, res) => {
  const { id } = req.params;
  const { name, email, avatar } = req.body;

  const idResult = validateRequiredFields(req.params, ["id"]);

  if (!idResult.isValid) {
    return res.status(400).json({
      message: "Missing required fields",
      missingFields: idResult.missing,
    });
  }

  if (!JWT_SECRET) {
    return res.status(500).json({
      message: "JWT_SECRET is not defined",
    });
  }

  const existingUser = await User.findById(id);

  if (!existingUser) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const user = await User.findByIdAndUpdate(
    id,
    { $set: { name, email, avatar } },
    {
      returnDocument: "after",
      runValidators: true,
    },
  );

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const token = jwt.sign(
    {
      userId: user._id,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: "10d" },
  );

  return res.status(200).json({
    message: "Profile updated successfully",
    user,
    token,
  });
});

export const updateUserPasswordById = tryCatch<AuthRequest>(
  async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const idResult = validateRequiredFields(req.params, ["id"]);

    if (!idResult.isValid) {
      return res.status(400).json({
        message: "Missing required fields",
        missingFields: idResult.missing,
      });
    }

    if (!JWT_SECRET) {
      return res.status(500).json({
        message: "JWT_SECRET is not defined",
      });
    }

    const existingUser = await User.findById(id);

    if (!existingUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { $set: { password: hashedPassword } },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: "10d" },
    );

    return res.status(200).json({
      message: "Password updated successfully",
      user,
      token,
    });
  },
);
