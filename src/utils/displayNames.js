// Very hacky function to convert camelCase variable names to more readable display names
const convertDisplayName = (camelCaseName) => {
  if (camelCaseName === 'startJD') return 'Start Julian Date';
  if (camelCaseName === 'pythonSrc') return 'Python Source';
  if (camelCaseName === 'dataRate(MB/s)' || camelCaseName === 'DataRate(MB/s)') return 'Data Rate (MB/s)';
  if (camelCaseName === 'ECI_Pointing_Vector(XYZ)') {
    // replace 'ECI_Pointing_Vector(XYZ)' with 'ECI Pointing Vector'
    const words = camelCaseName.split('_');
    words[2] = words[2].slice(0, -5)
    return words.join(' ');
  }

  // Split on capital letters or underscores or parentheses
  const words = camelCaseName.split(/(?=[A-Z])|_|(?=\()/);
  const firstWord = words[0];
  words[0] = firstWord[0].toUpperCase() + firstWord.slice(1);


  const lowercaseWords = ['of', 'to', 'in', 'at', 'for', 'by', 'with', 'and', 'the', 'a', 'an', 'on', 'from', 'into', 'over'];
  for (let i = 0; i < words.length - 1; i++) {
    // If the word is in the lowercaseWords array, make it lowercase
    if (lowercaseWords.includes(words[i].toLowerCase())) {
      words[i] = words[i].toLowerCase();
      // If word and next word are both uppercase, combine them
    } else if (words[i] === words[i].toUpperCase() && words[i + 1] === words[i + 1].toUpperCase()) {
      words[i] = words[i] + words[i + 1];
      words.splice(i + 1, 1);
      i--;
    }
  }
  return words.join(' ');
}

export { convertDisplayName };