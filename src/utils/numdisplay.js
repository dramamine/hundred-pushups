

export const withCommas = (number) => {
  return number.toLocaleString('en', {maximumSignificantDigits : 21})
}