import colorizer from '../utils/colorizer';
import { expect } from 'chai';

describe('restOfPhraseMatcher', () => {
  it('should handle one-word phrases', () => {
    const text = "one two three four".split(' ');
    const idx = 1;
    const wordsInPhrase = "two".split(' ');
    expect(colorizer.restOfPhraseMatcher(text, idx, wordsInPhrase)).to.be.equal(true);
  });
  it('should handle two word phrases', () => {
    const text = "one two three four".split(' ');
    let idx = 1;
    let wordsInPhrase = "two three".split(' ');
    expect(colorizer.restOfPhraseMatcher(text, idx, wordsInPhrase)).to.be.equal(true);

    idx = 2;
    wordsInPhrase = "three four".split(' ');
    expect(colorizer.restOfPhraseMatcher(text, idx, wordsInPhrase)).to.be.equal(true);

    idx = 2;
    wordsInPhrase = "three five".split(' ');
    expect(colorizer.restOfPhraseMatcher(text, idx, wordsInPhrase)).to.be.equal(false);
  });
  it('should handle end of phrases', () => {
    const text = "one two three four".split(' ');
    const idx = 1;
    const wordsInPhrase = "four five".split(' ');
    expect(colorizer.restOfPhraseMatcher(text, idx, wordsInPhrase)).to.be.equal(false);
  });
});

describe('phraseMatcher', () => {
  it('should create a stylesheet with my phrase', () => {
    const text = "one two three four".split(' ');
    const id = "red";
    const phrase = "two three";
    const stylesheet = colorizer.phraseMatcher(text, id, phrase);
    expect(stylesheet[1].start[0]).to.be.equal(id);
    expect(stylesheet[2].end[0]).to.be.equal(id);
  });
  it('should find two phrases', () => {
    const text = "one two three four one two three four".split(' ');
    const id = "red";
    const phrase = "two three";
    const stylesheet = colorizer.phraseMatcher(text, id, phrase);
    console.log(stylesheet);
    expect(stylesheet[1].start[0]).to.be.equal(id);
    expect(stylesheet[2].end[0]).to.be.equal(id);
    expect(stylesheet[5].start[0]).to.be.equal(id);
    expect(stylesheet[6].end[0]).to.be.equal(id);
  });
});
