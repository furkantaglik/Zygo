export const timeAgo = (date: string | number | Date): string => {
  const now = new Date();
  const inputDate = new Date(date);
  const diffInSeconds = Math.floor(
    (now.getTime() - inputDate.getTime()) / 1000
  );

  const seconds = diffInSeconds;
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) {
    return `${seconds} saniye önce`;
  } else if (minutes < 60) {
    return `${minutes} dakika önce`;
  } else if (hours < 24) {
    return `${hours} saat önce`;
  } else if (days < 7) {
    return `${days} gün önce`;
  } else if (weeks < 4) {
    return `${weeks} hafta önce`;
  } else if (months < 12) {
    return `${months} ay önce`;
  } else {
    return `${years} yıl önce`;
  }
};
