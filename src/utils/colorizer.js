import React from 'react';
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

const writeWordsToSpan = (words, className = '') => {
  console.log('writing these words to span:', words, className);
  return (<span className={className}>
    { words.join(' ') }
  </span>);
}

const applyStyles = (text, styleMap, styleGuide) => {
  let activeStyle = null;

  const result = [];
  let wordsInCurrentElement = [];

  for (let i = 0; i < text.length; i++) {
    console.log('checking these:', i, styleMap[i], activeStyle);

    // end any styles that don't apply to this word
    if (activeStyle !== null) {
      // check current style
      if (!(styleMap[i] && styleMap[i].length > 0 && activeStyle === styleMap[i][0])) {
        // style is changing; write to our results
        result.push(writeWordsToSpan(
          wordsInCurrentElement, styleGuide[activeStyle].style
        ));

        activeStyle = null;
        wordsInCurrentElement = [];
      }
      else {
        // same style; write word and move on
        wordsInCurrentElement.push(text[i]);
        continue;
      }
    }


    if (styleMap[i]) {
      // active style is null but we have a new style to use
      if (wordsInCurrentElement.length > 0) {
        result.push(writeWordsToSpan(
          wordsInCurrentElement
        ));
        wordsInCurrentElement = [];
      }
      activeStyle = styleMap[i][0];
      wordsInCurrentElement.push(text[i]);
    } else {
      // activeStyle is null, and this word does not have a style.
      wordsInCurrentElement.push(text[i]);
    }
  }

  // any last words?... heh heh
  if (wordsInCurrentElement.length > 0) {
    const lastStyle = activeStyle !== null
        ? styleGuide[activeStyle].style
        : '';
    console.log('last words:', activeStyle, wordsInCurrentElement, lastStyle);
    result.push(writeWordsToSpan(
      wordsInCurrentElement, lastStyle
    ));
    wordsInCurrentElement = [];
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
