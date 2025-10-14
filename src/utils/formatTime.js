export const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};
