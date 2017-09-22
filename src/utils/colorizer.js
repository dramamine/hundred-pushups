import React from 'react';
// assuming the first word matches; check the rest of the words in the phrase
const restOfPhraseMatcher = (text, idx, wordsInPhrase) => {
  for (let i = 1; i < wordsInPhrase.length; i++) { // eslint-disable no-plusplus
    if (text[idx + i] !== wordsInPhrase[i]) return false;
  }
  return true;
};

const findPhrases = (text, id, phrase, phrases = []) => {
  const wordsInPhrase = phrase.split(' ');
  if (wordsInPhrase.length < 1) return phrases;
  let phrasePointers;
  let cursor = text.indexOf(wordsInPhrase[0]);
  while (cursor >= 0) {
    if (restOfPhraseMatcher(text, cursor, wordsInPhrase)) {
      // @TODO es6 array functions here?
      const endOfPhrase = cursor + wordsInPhrase.length;
      phrasePointers = [];
      for (let i = cursor; i < endOfPhrase; i++) {
        phrasePointers.push(i);
      }
      phrases.push({
        id,
        pointers: phrasePointers,
      });
    }
    cursor = text.indexOf(wordsInPhrase[0], cursor + 1);
  }
  return phrases;
}

const getPhraseMap = (text, styleGuide) => {
  const textWords = text.split(' ');
  const phraseMap = [];
  styleGuide.forEach(({ phrases }, idx) => {
    phrases.forEach((phrase) => {
      findPhrases(textWords, idx, phrase, phraseMap);
    });
  });
  return phraseMap;
};

const makeSpanByIndexes = (text, start, end, className = '') => {
  const wordsToAdd = [];
  for (let i = start; i <= end; i++) {
    wordsToAdd.push(text[i]);
  }
  const phrase = wordsToAdd.join(' ');
  return ([<span className={className}>
    { phrase }
  </span>, <span>&nbsp;</span>]);
};


const applyStyles = (text, phraseMap, styleGuide) => {
  // let activePhrase = null;
  const result = [];

  // sort by its location in the text, then by id (phrase priority)
  phraseMap.sort((a, b) => {
    if (a.pointers[0] !== b.pointers[0]) {
      return a.pointers[0] - b.pointers[0];
    }
    return a.id - b.id;
  });

  let textCursor = 0;
  let phraseStart;
  let phraseEnd;

  phraseMap.forEach(({ id, pointers }) => {
    phraseStart = pointers[0];
    phraseEnd = pointers[pointers.length - 1];

    if (textCursor < phraseStart) {
      // make a span with any non-phrase words prior to the start of this phrase
      result.push(...makeSpanByIndexes(
        text, textCursor, phraseStart - textCursor - 1
      ));
    } else if (textCursor > phraseStart) {
      // this phrase is lower priority than the previous one, and got cut off.
      // in this case, pretend the phrase starts at textCursor instead of phraseStart
      phraseStart = textCursor;
    }

    // figure out how long this phrase should be, by checking for competing
    // priorities.

    // we can trust that the first one we find here will interrupt our phrase
    // because we know phraseMap has been sorted.
    const interruptingPhrase = phraseMap.find(({ id: compareId, pointers: comparePointers }) => {
      if (compareId >= id) return false;
      const compareStart = comparePointers[0];
      if (compareStart > phraseStart && compareStart <= phraseEnd) {
        return true;
      }
      return false;
    });

    if (interruptingPhrase) {
      phraseEnd = interruptingPhrase.pointers[0] - 1;
    }

    // create our phrase
    result.push(...makeSpanByIndexes(
      text, phraseStart, phraseEnd, styleGuide[id].style
    ));

    textCursor = phraseEnd + 1;
  });

  // any last words?...heh heh
  if (textCursor <= text.length) {
    result.push(...makeSpanByIndexes(
      text, textCursor, text.length - 1
    ));
  }

  return result;
};

const colorize = (text, phraseMap, styleGuide) => {
  return (<p> {
    applyStyles(text.split(' '), phraseMap, styleGuide)}
  </p>);
};

export default {
  restOfPhraseMatcher,
  getPhraseMap,
  applyStyles,
  colorize,
  findPhrases,
};
