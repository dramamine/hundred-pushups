
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

const getStylesheet = (text, styleGuide) => {
  const textWords = text.split(' ');
  let styles = [];
  styleGuide.forEach(({ phrases }, idx) => {
    phrases.forEach((phrase) => {
      styles = phraseMatcher(textWords, idx, phrase, styles);
    });
  });
  return styles;
};

const applyStyles = (text, stylesheet, styleGuide) => {
  let activeStyle = null;

  let activeStyles = [];

  const result = [];
  let output = '';
  for (let i = 0; i < text.length; i++) {
    output = text[i];
    console.log('now on index', i, ' with styles:', stylesheet[i]);
    if (stylesheet[i] && stylesheet[i].start) {
      activeStyle = activeStyles[0]; // if it's not already.
      activeStyles = activeStyles.concat(stylesheet[i].start).sort();
      console.log('now activeStyles is:', activeStyles);
      const useThisStyle = activeStyles[0];
      // null, undefined
      if (activeStyle === undefined) {
        output = `<span className="${styleGuide[useThisStyle].style}">${output}`;
      } else {
        if (useThisStyle < activeStyle) {
          // kill the old style and start applying the new
          output = `</span><span className="${styleGuide[useThisStyle].style}">${output}`;
        }
      }
    }

    if (stylesheet[i] && stylesheet[i].end) {
      activeStyle = activeStyles[0]; // if it's not already.

      console.log('removing ', stylesheet[i].end, ' from ', activeStyles);
      activeStyles = activeStyles.filter(x => !stylesheet[i].end.includes(x));
      console.log('result: ', activeStyles, 'while activeStyle is:', activeStyle);

      if (activeStyles.length > 0) {
        const useThisStyle = activeStyles[0];
        if (activeStyle !== activeStyles[0]) {
          output = `${output}</span><span className="${styleGuide[useThisStyle].style}">`;
        }
      } else {
        output = `${output}</span>`;
      }
    }

    result.push(output);
  }
  return result;
}

export default {
  phraseMatcher,
  restOfPhraseMatcher,
  getStylesheet,
  applyStyles,
};
