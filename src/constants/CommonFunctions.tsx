
export const formatTime = (timeInSeconds: number) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  if (minutes === 0 && seconds !== 0) {
    return `${seconds} sec`;
  }
  return `${minutes} min`;
};
