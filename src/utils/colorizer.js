
// assuming the first word matches; check the rest of the words in the phrase
const restOfPhraseMatcher = (text, idx, wordsInPhrase) => {
  for (let i = 1; i < wordsInPhrase.length; i++) { // eslint-disable no-plusplus
    if (text[idx + i] !== wordsInPhrase[i]) return false;
  }
  return true;
};

/**
 * [description]
 * @param  {Array} text   [description]
 * @param  {[type]} id     [description]
 * @param  {[type]} phrase [description]
 * @return {[type]}        [description]
 */
const phraseMatcher = (text, id, phrase, stylesheet = []) => {
  const wordsInPhrase = phrase.split(' ');
  if (wordsInPhrase.length < 1) return stylesheet;

  let cursor = text.indexOf(wordsInPhrase[0]);
  while (cursor >= 0) {
    if (restOfPhraseMatcher(text, cursor, wordsInPhrase)) {
      // write to our "style sheet"
      if (!stylesheet[cursor]) {
        stylesheet[cursor] = {};
      }
      if (!stylesheet[cursor].start) {
        stylesheet[cursor].start = [];
      }
      stylesheet[cursor].start.push(id);

      const endOfPhrase = cursor + wordsInPhrase.length - 1;
      if (!stylesheet[endOfPhrase]) {
        stylesheet[endOfPhrase] = {};
      }
      if (!stylesheet[endOfPhrase].end) {
        stylesheet[endOfPhrase].end = [];
      }
      stylesheet[endOfPhrase].end.push(id);
    }
    cursor = text.indexOf(wordsInPhrase[0], cursor + 1);
  }
  return stylesheet;
};

export default {
  phraseMatcher,
  restOfPhraseMatcher,
};
