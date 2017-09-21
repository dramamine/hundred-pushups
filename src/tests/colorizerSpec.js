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

describe('applyStyles', () => {
  it('should work ok', () => {
    const text = "one two three four".split(' ');
    const stylesheet = [
      null,
      {start: [0]},
      {end: [0]},
      null
    ];
    const styleGuide = [
      {style: 'red'}
    ];
    const res = colorizer.applyStyles(text, stylesheet, styleGuide);
    console.log(res);
    expect(res[0]).to.be.equal('one');
    expect(res[1]).to.be.equal('<span className="red">two');
    expect(res[2]).to.be.equal('three</span>');
    expect(res[3]).to.be.equal('four');
  });

  it('should handle overlapping styles, priority up front', () => {
    const text = "one two three four".split(' ');
    const stylesheet = [
      {start: [0]},
      {start: [1], end: [0]},
      {end: [1]}
    ];
    const styleGuide = [
      {style: 'red'},
      {style: 'blue'}
    ];
    const res = colorizer.applyStyles(text, stylesheet, styleGuide);
    console.log(res);
    expect(res[0]).to.be.equal('<span className="red">one');
    expect(res[1]).to.be.equal('two</span><span className="blue">');
    expect(res[2]).to.be.equal('three</span>');
    expect(res[3]).to.be.equal('four');
  });
  it('should handle overlapping styles, priority in back', () => {
    const text = "one two three four".split(' ');
    const stylesheet = [
      {start: [1]},
      {start: [0], end: [1]},
      {end: [0]}
    ];
    const styleGuide = [
      {style: 'red'},
      {style: 'blue'}
    ];
    const res = colorizer.applyStyles(text, stylesheet, styleGuide);
    console.log(res);
    expect(res[0]).to.be.equal('<span className="blue">one');
    expect(res[1]).to.be.equal('</span><span className="red">two');
    expect(res[2]).to.be.equal('three</span>');
    expect(res[3]).to.be.equal('four');
  });
});
