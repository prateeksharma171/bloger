export const validateRequiredFields = (body: any, fields: any) => {
  const missing = fields.filter((field: any) => !body[field]);

  if (missing.length > 0) {
    return {
      isValid: false,
      missing,
    };
  }

  return { isValid: true };
}
