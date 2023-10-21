export const capitalizeWordsInArray = (arr: string[]) => {
  // Check if the input is an array
  if (!Array.isArray(arr)) {
    return [];
  }

  // Iterate through the array and capitalize each word in each string
  const capitalizedArray = arr.map((str) =>
    str
      .split(' ')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
  );

  return capitalizedArray;
};
