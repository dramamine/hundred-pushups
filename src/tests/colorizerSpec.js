import colorizer from '../utils/colorizer';
import { expect } from 'chai';

describe('restOfPhraseMatcher', () => {
  it('should handle one-word phrases', () => {
    const text = 'one two three four'.split(' ');
    const idx = 1;
    const wordsInPhrase = 'two'.split(' ');
    expect(colorizer.restOfPhraseMatcher(text, idx, wordsInPhrase)).to.be.equal(true);
  });
  it('should handle two word phrases', () => {
    const text = 'one two three four'.split(' ');
    let idx = 1;
    let wordsInPhrase = 'two three'.split(' ');
    expect(colorizer.restOfPhraseMatcher(text, idx, wordsInPhrase)).to.be.equal(true);

    idx = 2;
    wordsInPhrase = 'three four'.split(' ');
    expect(colorizer.restOfPhraseMatcher(text, idx, wordsInPhrase)).to.be.equal(true);

    idx = 2;
    wordsInPhrase = 'three five'.split(' ');
    expect(colorizer.restOfPhraseMatcher(text, idx, wordsInPhrase)).to.be.equal(false);
  });
  it('should handle end of phrases', () => {
    const text = 'one two three four'.split(' ');
    const idx = 1;
    const wordsInPhrase = 'four five'.split(' ');
    expect(colorizer.restOfPhraseMatcher(text, idx, wordsInPhrase)).to.be.equal(false);
  });
});

describe('findPhrases', () => {
  it('should create a phrase map with my phrase', () => {
    const text = 'one two three four'.split(' ');
    const id = 4;
    const phrase = 'two three';
    const phraseMap = colorizer.findPhrases(text, id, phrase);

    expect(phraseMap[0].id).to.be.equal(id);
    expect(phraseMap[0].pointers[0]).to.be.equal(1);
    expect(phraseMap[0].pointers.length).to.be.equal(2);
  });
  it('should find two phrases', () => {
    const text = 'one two three four one two three four'.split(' ');
    const id = 'red';
    const phrase = 'two three';
    const phraseMap = colorizer.findPhrases(text, id, phrase);

    expect(phraseMap[0].id).to.be.equal(id);
    expect(phraseMap[0].pointers[0]).to.be.equal(1);
    expect(phraseMap[0].pointers[1]).to.be.equal(2);
    expect(phraseMap[0].pointers.length).to.be.equal(2);

    expect(phraseMap[1].id).to.be.equal(id);
    expect(phraseMap[1].pointers[0]).to.be.equal(5);
    expect(phraseMap[1].pointers[1]).to.be.equal(6);
    expect(phraseMap[1].pointers.length).to.be.equal(2);
  });
  it('should handle overlapping phrases', () => {
    const text = 'one two three four'.split(' ');
    const phraseMap = [];
    phraseMap.push(...colorizer.findPhrases(text, 'first', 'two three'));
    phraseMap.push(...colorizer.findPhrases(text, 'second', 'three four'));

    expect(phraseMap[0].id).to.be.equal('first');
    expect(phraseMap[0].pointers[0]).to.be.equal(1);
    expect(phraseMap[0].pointers[1]).to.be.equal(2);
    expect(phraseMap[0].pointers.length).to.be.equal(2);

    expect(phraseMap[1].id).to.be.equal('second');
    expect(phraseMap[1].pointers[0]).to.be.equal(2);
    expect(phraseMap[1].pointers[1]).to.be.equal(3);
    expect(phraseMap[1].pointers.length).to.be.equal(2);
  });
});

describe('applyStyles', () => {
  it('should work ok', () => {
    const text = 'one two three four'.split(' ');
    const phraseMap = [
      {
        id: 0,
        pointers: [1, 2],
      },
    ];
    const styleGuide = [
      { style: 'red' },
    ];
    const res = colorizer.applyStyles(text, phraseMap, styleGuide)
      .filter(({ props }) => props.children.trim());

    expect(res[0].props.children).to.be.equal('one');
    expect(res[1].props.children).to.be.equal('two three');
    expect(res[2].props.children).to.be.equal('four');

    expect(res[0].props.className).to.be.equal('');
    expect(res[1].props.className).to.be.equal('red');
    expect(res[2].props.className).to.be.equal('');
  });

  it('should handle overlapping styles, priority up front', () => {
    const text = 'one two three four'.split(' ');
    const phraseMap = [
      {
        id: 0,
        pointers: [0, 1],
      },
      {
        id: 1,
        pointers: [1, 2],
      },
    ];
    const styleGuide = [
      { style: 'red' },
      { style: 'blue' },
    ];
    const res = colorizer.applyStyles(text, phraseMap, styleGuide)
      .filter(({ props }) => props.children.trim());
    expect(res[0].props.children).to.be.equal('one two');
    expect(res[1].props.children).to.be.equal('three');
    expect(res[2].props.children).to.be.equal('four');

    expect(res[0].props.className).to.be.equal('red');
    expect(res[1].props.className).to.be.equal('blue');
    expect(res[2].props.className).to.be.equal('');
  });

  it('should handle overlapping styles, priority in back', () => {
    const text = 'one two three four'.split(' ');
    const phraseMap = [
      {
        id: 1,
        pointers: [0, 1],
      },
      {
        id: 0,
        pointers: [1, 2],
      },
    ];
    const styleGuide = [
      { style: 'red' },
      { style: 'blue' },
    ];
    const res = colorizer.applyStyles(text, phraseMap, styleGuide)
      .filter(({ props }) => props.children.trim());
    expect(res[0].props.children).to.be.equal('one');
    expect(res[1].props.children).to.be.equal('two three');
    expect(res[2].props.children).to.be.equal('four');

    expect(res[0].props.className).to.be.equal('blue');
    expect(res[1].props.className).to.be.equal('red');
    expect(res[2].props.className).to.be.equal('');
  });

  it('should handle a phrase at the end of the block', () => {
    const text = 'one two three'.split(' ');
    const phraseMap = [
      {
        id: 0,
        pointers: [0, 1, 2],
      },
    ];
    const styleGuide = [
      { style: 'red' },
    ];
    const res = colorizer.applyStyles(text, phraseMap, styleGuide)
      .filter(({ props }) => props.children.trim());

    expect(res[0].props.children).to.be.equal('one two three');

    expect(res[0].props.className).to.be.equal('red');
  });
  it('shouldn\'t remove phrases from our text', () => {
    // this one was to fix a bug with disappearing non-phrase text.
    // text between two phrases wasn't getting written due to wrong mat.
    const text = 'fam 90\'s salvia whatever mustache. Put a bird on it do not want tattooed cornhole franzen tbh. Narwhal helvetica lyft offal green juice pinterest bitters sriracha irony heirloom action-oriented trust fund.';
    const styleGuide = [
      {
        style: 'red',
        phrases: [
          'do not want',
          'action-oriented',
        ],
      },
    ];
    const phraseMap = colorizer.getPhraseMap(text, styleGuide);
    const res = colorizer.applyStyles(text.split(' '), phraseMap, styleGuide)
      .filter(({ props }) => props.children.trim());
    expect(res[2].props.children).to.be.equal('tattooed cornhole franzen tbh. Narwhal helvetica lyft offal green juice pinterest bitters sriracha irony heirloom');
  });
  // it('should handle line breaks', () => {
    // @TODO not implemented
  // });
});

describe('filterPhraseMap', () => {
  it('should filter out overlapping phrases with different start/end points', () => {
    const phraseMap = [
      {
        id: 0,
        pointers: [0, 1],
      },
      {
        id: 1,
        pointers: [1, 2],
      },
      {
        id: 2,
        pointers: [2, 3],
      },
    ];
    const updates = colorizer.filterPhraseMap(phraseMap, 1, 1);
    expect(updates.length).to.be.equal(3);
    expect(updates[0].hidden).to.be.equal(true);
    expect(updates[2].hidden).to.be.equal(true);
  });
  it('should filter out overlapping phrases with the same start points', () => {
    const phraseMap = [
      {
        id: 0,
        pointers: [0, 1],
      },
      {
        id: 1,
        pointers: [0, 1, 2],
      },
    ];
    const updates = colorizer.filterPhraseMap(phraseMap, 1, 0);
    expect(updates.length).to.be.equal(2);
    expect(updates[0].hidden).to.be.equal(true);
  });
  it('should filter out overlapping phrases with the same end points', () => {
    const phraseMap = [
      {
        id: 0,
        pointers: [0, 1, 2],
      },
      {
        id: 1,
        pointers: [1, 2],
      },
    ];
    const updates = colorizer.filterPhraseMap(phraseMap, 1, 1);
    expect(updates.length).to.be.equal(2);
    expect(updates[0].hidden).to.be.equal(true);
  });
});
