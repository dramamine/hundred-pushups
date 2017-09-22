import React from 'react';

/**
 * assuming the first word matches; check the rest of the words in the phrase
 *
 * @param  {Array} text    Array of words
 * @param  {Int} idx  The index of the start of the phrase
 * @param  {Array} wordsInPhrase Array of words in the phrase we're matching
 *
 * @return {Boolean} True of the rest of the phrase matches; false otherwise
 */
const restOfPhraseMatcher = (text, idx, wordsInPhrase) => {
  for (let i = 1; i < wordsInPhrase.length; i++) {
    if (text[idx + i] !== wordsInPhrase[i]) return false;
  }
  return true;
};

/**
 * Find occurrences of this phrase in our text.
 * An occurrence has these properties:
 *   {String} id: the style id (use this as className when displaying)
 *   {Array} pointers: An array of indexes to 'text' for each word in the phrase
 *
 * @param  {Array} text    Array of words
 * @param  {String} id     The style id
 * @param  {String} phrase  The phrase to scan for
 * @return {Array}         An array of occurrences of this phrase
 */
const findPhrases = (text, id, phrase) => {
  const phrases = [];
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

/**
 * Generate a phrase map from the given text and style guide.
 *
 * @param  {String} text  The input text
 * @param  {Object} styleGuide  A style guide. This is an array of objects with
 * the following properties:
 *   {String} style: a style ID (import this from CSS modules)
 *   {Array} phrases: An array of strings (ex. "common phrase") to be highlighted
 *
 * @return {Array} An array of phrase occurrences. These are objects with the
 * following properties:
 *   {String} id: the style id (use this as className when displaying)
 *   {Array} pointers: An array of indexes to 'text' for each word in the phrase
 */
const getPhraseMap = (text, styleGuide) => {
  const textWords = text.split(' ');
  const phraseMap = [];
  styleGuide.forEach(({ phrases }, idx) => {
    phrases.forEach((phrase) => {
      phraseMap.push(...findPhrases(textWords, idx, phrase));
    });
  });
  return phraseMap;
};

/**
 * Take a phrase map, and return a phrase map without any highlighted phrases
 * that are adjacent to a given phrase.
 *
 * @param  {Array} phraseMap  An array of phrase occurrences.
 * @param  {Int} phraseMapIdx  The index of the 'important' phrase
 *
 * @return {Array}  The updated phraseMap. Occurrences will now have the property:
 *   {Boolean} hidden: true if we should hide this phrase highlighting,
 *                     undefined otherwise
 */
const filterPhraseMap = (phraseMap, phraseMapIdx) => {
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

/**
 * Make spans out of text.
 *
 * @param  {String} spanKey  The key and id that will be written to the span
 * @param  {String} text     An array of words
 * @param  {Int} start  The starting index of the phrase
 * @param  {Int} end    The ending index of the phrase
 * @param  {String} className  Written to the className property of the span
 * @return {Array}   An array of JSX. This includes a span for the phrase and
 *                   a span for a space (you need spaces between your words!)
 */
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

/**
 * Apply styles to your text. You provide locations of phrases and how to style
 * those phrases; you get JSX back.
 *
 * @param  {Array} text       An array of words
 * @param  {Object} phraseMap  A phrase map
 * @param  {Object} styleGuide A style guide
 *
 * @return {Array}  An array of JSX
 */
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

/**
 * Apply colors to your text.
 *
 * @param  {String} text  The text to colorize
 * @param  {Object} phraseMap  A phrase map
 * @param  {Object} styleGuide A style guide
 * @return {JSX}  A JSX object
 */
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
