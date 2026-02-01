
export const formatTime = (timeInSeconds: number) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  if (minutes === 0 && seconds !== 0) {
    return `${seconds} sec`;
  }
  return `${minutes} min`;
};


const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  
  export const validatePassword = (password: string) => {
  if (password.length < 6) return "Password must be at least 6 characters";
  if (!/[A-Z]/.test(password)) return "Password must contain at least 1 uppercase letter";
  if (!/[a-z]/.test(password)) return "Password must contain at least 1 lowercase letter";
  if (!/[0-9]/.test(password)) return "Password must contain at least 1 number";
  return null; // valid
};
