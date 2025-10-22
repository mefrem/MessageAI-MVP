export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validateDisplayName = (name: string): boolean => {
  return name.length >= 2 && name.length <= 50;
};

export const validateGroupName = (name: string): boolean => {
  return name.length >= 1 && name.length <= 50;
};

export const getEmailError = (email: string): string | null => {
  if (!email) return "Email is required";
  if (!validateEmail(email)) return "Please enter a valid email";
  return null;
};

export const getPasswordError = (password: string): string | null => {
  if (!password) return "Password is required";
  if (!validatePassword(password))
    return "Password must be at least 6 characters";
  return null;
};

export const getDisplayNameError = (name: string): string | null => {
  if (!name) return "Display name is required";
  if (!validateDisplayName(name)) return "Display name must be 2-50 characters";
  return null;
};

export const getGroupNameError = (name: string): string | null => {
  if (!name) return "Group name is required";
  if (!validateGroupName(name)) return "Group name must be 1-50 characters";
  return null;
};

