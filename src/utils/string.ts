export const capitalizeWordsInArray = (arr: string[]) => {
  // Check if the input is an array
  if (!Array.isArray(arr)) {
    return [];
  }

  // Iterate through the array and capitalize each word in each string
  const capitalizedArray = arr.map((str) => capitalizeWord(str));

  return capitalizedArray;
};

export const capitalizeWord = (word: string) => {
  return word
    .split(' ')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const jsxElementToStringWithWhitespace = (element: JSX.Element) => {
  if (typeof element === 'string') {
    return element;
  }

  if (!element || !element.props || !element.props.children) {
    return '';
  }

  if (Array.isArray(element.props.children)) {
    return element.props.children.map((child: JSX.Element) => jsxElementToStringWithWhitespace(child)).join(' ');
  }

  return element.props.children.toString();
};
