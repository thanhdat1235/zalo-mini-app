import moment from "moment";
export const DATE_FORMAT_DDMMYYYY = "DD/MM/YYYY";
export const DATE_FORMAT_YYYYMMDD = "YYYY-MM-DD";
export const DATE_FORMAT_DDMMYYYYTHHMMSS = "YYYY-MM-DD'T'HH:mm:ss";
export const DATE_FORMAT_DDMMYYYYTHHMMSS_DAY_FILTER = "YYYY-MM-DDTHH:mm:ss";
export const DATE_FORMAT_DDMMYYYYTHHMM = "DD-MM-YYYY HH:mm";
export const DATE_FORMAT_DDMMYYYYTHHMMSS_DISPLAY = "DD/MM/YYYY HH:mm:ss";

export const isToday = (date: Date) => {
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
};

export const displayTime = (date: Date) => {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}h${minutes}`;
};

export const displayHalfAnHourTimeRange = (date: Date) => {
  const endTime = new Date(date);
  endTime.setMinutes(endTime.getMinutes() + 30);
  return `${displayTime(date)} - ${displayTime(endTime)}`;
};

export const displayDate = (date: Date, hint?: boolean) => {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString();
  if (hint && isToday(date)) {
    return `Hôm nay - ${day}/${month}/${year}`;
  }
  return `${day}/${month}/${year}`;
};

export const addDays = (date: Date, days: number): Date => {
  date.setDate(date.getDate() + days);
  return date;
};

export const formatDate = (date: Date | string, format: string): string => {
  return moment(date).format(format);
};

export const calculateTimeRemaining = (targetTime: string) => {
  let currentTime = new Date();

  // Thời gian cần tính (dựa trên định dạng ngày/tháng/năm giờ:phút:giây)
  let targetDateTime = new Date(targetTime);

  if (targetDateTime <= currentTime) {
    return {
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  // Tính số milliseconds còn lại
  let timeDifference = targetDateTime.getTime() - currentTime.getTime();

  // Chuyển đổi sang số giờ, số phút và số giây
  let secondsRemaining = Math.floor(timeDifference / 1000);
  let minutesRemaining = Math.floor(secondsRemaining / 60);
  let hoursRemaining = Math.floor(minutesRemaining / 60);

  // Tính số phút và số giây còn lại sau khi tính số giờ
  minutesRemaining %= 60;
  secondsRemaining %= 60;

  // Trả về kết quả
  return {
    hours: hoursRemaining,
    minutes: minutesRemaining,
    seconds: secondsRemaining,
  };
};
