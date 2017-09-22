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
};

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

const filterPhraseMap = (phraseMap, phraseMapIdx, phraseStart) => {
  // need a deep copy here, otherwise 'hidden' property persists
  let updatedMap = JSON.parse(JSON.stringify(phraseMap));
  const matchingPhrase = updatedMap[phraseMapIdx];
  if (!matchingPhrase) {
    throw new Error('Hover element id didn\'t match any phrases');
  }
  matchingPhrase.pointers.forEach((pointer) => {
    updatedMap = updatedMap.map((phrase) => {
      // never need to filter out phrases with the same highlight
      if (!phrase.hidden &&
          matchingPhrase !== phrase &&
          phrase.pointers.includes(pointer)) {
        return {
          id: phrase.id,
          pointers: phrase.pointers,
          hidden: true,
        };
      }
      return phrase;
    });
  });
  return updatedMap;
};

const makeSpanByIndexes = (spanKey, text, start, end, className = '') => {
  const wordsToAdd = [];
  for (let i = start; i <= end; i++) {
    wordsToAdd.push(text[i]);
  }
  const phrase = wordsToAdd.join(' ');
  return ([<span key={spanKey} id={spanKey} className={className}>
    { phrase }
  </span>, <span key={`sp_${spanKey}`}>&nbsp;</span>]);
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

  let spanKey = 1;

  phraseMap.forEach(({ id, pointers, hidden = false }, phraseMapIdx) => {
    // hidden by hover state. by skipping this phrase, it will be treated as
    // normal text (i.e. text not in a phrase)
    if (hidden) return;

    phraseStart = pointers[0];
    phraseEnd = pointers[pointers.length - 1];

    if (textCursor < phraseStart) {
      // make a span with any non-phrase words prior to the start of this phrase
      result.push(...makeSpanByIndexes(
        spanKey++, text, textCursor, phraseStart - 1
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
    const interruptingPhrase = phraseMap.find(({
      id: compareId,
      pointers: comparePointers,
      hidden: compareHidden,
    }) => {
      // should be hidden by hover
      if (compareHidden) return false;
      // is lower priority
      if (compareId >= id) return false;

      const compareStart = comparePointers[0];
      if (compareStart > phraseStart && compareStart <= phraseEnd) {
        // starts before our previous phrase ends
        return true;
      }
      return false;
    });

    if (interruptingPhrase) {
      phraseEnd = interruptingPhrase.pointers[0] - 1;
    }

    // create our phrase.
    // here we need to use a special key for our phrase, so that we can find
    // hover overlaps later. this key lets us figure out the start of the phrase
    // and its phraseMap index.
    result.push(...makeSpanByIndexes(
      `${phraseMapIdx}_${phraseStart}`, text, phraseStart, phraseEnd, styleGuide[id].style
    ));

    textCursor = phraseEnd + 1;
  });

  // any last words?...heh heh
  if (textCursor <= text.length) {
    result.push(...makeSpanByIndexes(
      spanKey++, text, textCursor, text.length - 1
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
  filterPhraseMap,
};
