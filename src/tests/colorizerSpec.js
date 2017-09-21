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
    const id = 4;
    const phrase = "two three";
    const stylesheet = colorizer.updateStylesWithPhrase(text, id, phrase);
    expect(stylesheet[1][0]).to.be.equal(id);
    expect(stylesheet[2][0]).to.be.equal(id);
  });
  it('should find two phrases', () => {
    const text = "one two three four one two three four".split(' ');
    const id = "red";
    const phrase = "two three";
    const stylesheet = colorizer.updateStylesWithPhrase(text, id, phrase);
    expect(stylesheet[1][0]).to.be.equal(id);
    expect(stylesheet[2][0]).to.be.equal(id);
    expect(stylesheet[5][0]).to.be.equal(id);
    expect(stylesheet[6][0]).to.be.equal(id);
  });
  it('should handle overlapping phrases and passing by reference', () => {
    const text = "one two three four".split(' ');
    const stylesheet = [];
    colorizer.updateStylesWithPhrase(text, 'first', 'two three', stylesheet);
    colorizer.updateStylesWithPhrase(text, 'second', 'three four', stylesheet);
    expect(stylesheet[1][0]).to.be.equal('first');
    expect(stylesheet[2][0]).to.be.equal('first');
    expect(stylesheet[2][1]).to.be.equal('second');
    expect(stylesheet[3][0]).to.be.equal('second');
  })
});

describe('applyStyles', () => {
  it('should work ok', () => {
    const text = "one two three four".split(' ');
    const styleMap = [
      null,
      [0],
      [0],
      null
    ];
    const styleGuide = [
      {style: 'red'}
    ];
    const res = colorizer.applyStyles(text, styleMap, styleGuide);
    console.log(res);

    expect(res[0].props.children).to.be.equal('one');
    expect(res[1].props.children).to.be.equal('two three');
    expect(res[2].props.children).to.be.equal('four');

    expect(res[0].props.className).to.be.equal('');
    expect(res[1].props.className).to.be.equal('red');
    expect(res[2].props.className).to.be.equal('');
  });

  it('should handle overlapping styles, priority up front', () => {
    const text = "one two three four".split(' ');
    const styleMap = [
      [0],
      [0, 1],
      [1],
    ];
    const styleGuide = [
      {style: 'red'},
      {style: 'blue'}
    ];
    const res = colorizer.applyStyles(text, styleMap, styleGuide);
    console.log(res);
    expect(res[0].props.children).to.be.equal('one two');
    expect(res[1].props.children).to.be.equal('three');
    expect(res[2].props.children).to.be.equal('four');

    expect(res[0].props.className).to.be.equal('red');
    expect(res[1].props.className).to.be.equal('blue');
    expect(res[2].props.className).to.be.equal('');
  });
  it('should handle overlapping styles, priority in back', () => {
    const text = "one two three four".split(' ');
    const stylesheet = [
      [1],
      [0, 1],
      [0]
    ];
    const styleGuide = [
      {style: 'red'},
      {style: 'blue'}
    ];
    const res = colorizer.applyStyles(text, stylesheet, styleGuide);
    expect(res[0].props.children).to.be.equal('one');
    expect(res[1].props.children).to.be.equal('two three');
    expect(res[2].props.children).to.be.equal('four');

    expect(res[0].props.className).to.be.equal('blue');
    expect(res[1].props.className).to.be.equal('red');
    expect(res[2].props.className).to.be.equal('');
  });
  it('should handle a phrase at the end of the block', () => {
    const text = "one two three".split(' ');
    const stylesheet = [
      [0],
      [0],
      [0]
    ];
    const styleGuide = [
      {style: 'red'},
    ];
    const res = colorizer.applyStyles(text, stylesheet, styleGuide);

    expect(res[0].props.children).to.be.equal('one two three');

    expect(res[0].props.className).to.be.equal('red');
  });
});
