export const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed, so add 1
  const day = String(today.getDate()).padStart(2, '0');

  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
};

export const isOneMonthAfter = (date1: string, date2: string): boolean => {
  // Parse the input dates
  const parsedDate1 = new Date(date1);
  const parsedDate2 = new Date(date2);

  // Check if either date is invalid
  if (isNaN(parsedDate1.getTime()) || isNaN(parsedDate2.getTime())) {
    throw new Error('Invalid date format');
  }

  // Calculate the difference in months
  const diffInMonths =
    (parsedDate1.getFullYear() - parsedDate2.getFullYear()) * 12 + (parsedDate1.getMonth() - parsedDate2.getMonth());

  // Check if the difference is exactly 1 month
  return diffInMonths >= 1;
};
