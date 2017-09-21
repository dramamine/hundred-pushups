
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
const updateStylesWithPhrase = (text, id, phrase, styleMap = []) => {
  const wordsInPhrase = phrase.split(' ');
  if (wordsInPhrase.length < 1) return styleMap;

  let cursor = text.indexOf(wordsInPhrase[0]);
  while (cursor >= 0) {
    if (restOfPhraseMatcher(text, cursor, wordsInPhrase)) {
      // @TODO es6 array functions here?
      const endOfPhrase = cursor + wordsInPhrase.length;
      for (let i = cursor; i < endOfPhrase; i++) {
        if (!styleMap[i]) {
          styleMap[i] = [];
        }
        styleMap[i].push(id);
      }
    }
    cursor = text.indexOf(wordsInPhrase[0], cursor + 1);
  }
  return styleMap;
};

const getStyleMap = (text, styleGuide) => {
  const textWords = text.split(' ');
  const styleMap = [];
  styleGuide.forEach(({ phrases }, idx) => {
    phrases.forEach((phrase) => {
      updateStylesWithPhrase(textWords, idx, phrase, styleMap);
    });
  });
  return styleMap;
};

const applyStyles = (text, styleMap, styleGuide) => {
  let activeStyle = null;

  const result = [];
  let tags = '';
  for (let i = 0; i < text.length; i++) {
    tags = '';
    // console.log('considering:', i, activeStyle, styleMap[i]);
    // check for ending styles first.
    // apply a close span if:
    // * there is an active style
    // * the style for the word we're checking is empty, or different from
    //   the active style.
    if (activeStyle !== null &&
      !(styleMap[i] && styleMap[i].length > 0 && activeStyle === styleMap[i][0])) {
      tags += '</span>';
      activeStyle = null;
    }

    if (activeStyle === null && styleMap[i]) {
      // assuming these are sorted with 0-index being the highest priority
      activeStyle = styleMap[i][0];
      tags = `${tags}<span className="${styleGuide[activeStyle].style}">`;
    }

    result.push(`${tags}${text[i]}`);
  }
  // close final span if text ends with a phrase
  if (activeStyle !== null) {
    result[result.length - 1] += '</span>';
  }
  return result;
}

const colorize = (text, styleGuide) => {
  const paragraphs = text.split('\n');
  let stylesheet;
  paragraphs.map(paragraph => {
    stylesheet = getStylesheet()
  });
}

export default {
  updateStylesWithPhrase,
  restOfPhraseMatcher,
  getStyleMap,
  applyStyles,
};
