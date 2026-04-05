export const tryCatch = async <T>(promise: Promise<T>): Promise<T> => {
  try {
    return await promise;
  } catch (error) {
    console.error("❌ Error:", error);
    throw error;
  }
};
