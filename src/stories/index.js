import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import { setOptions } from '@kadira/storybook-addon-options';
import { withKnobs, text, object } from '@kadira/storybook-addon-knobs';
import DocDisplay from '../components/docdisplay';
import ipsum from '../components/ipsum.txt';
import styleGuide from '../components/styleGuide';

const stories = storiesOf('DocDisplay', module);
stories.addDecorator(withKnobs);
setOptions({ downPanelInRight: true });

const textLabel = 'input text';
const stylesLabel = 'style guide';

stories.add('simple display', () => (
    <DocDisplay text={text(textLabel, 'hello world')}
    styleGuide={object(stylesLabel, styleGuide)} />
  ))
  .add('overlapping phrases', () => (
    <DocDisplay text={text(textLabel, 'very unlikely to leave a mess')}
    styleGuide={object(stylesLabel, styleGuide)} />
  ))
  .add('paragraphs of text', () => (
    <div>{
    text(textLabel, ipsum).split('\n').map((paragraph, idx) =>
      <DocDisplay key={idx} text={paragraph}
      styleGuide={object(stylesLabel, styleGuide)} />
    )
  }</div>
  ));
