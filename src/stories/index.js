import React from 'react';
import { storiesOf } from '@kadira/storybook';
import { withKnobs, text, object } from '@kadira/storybook-addon-knobs';

import DocDisplay from '../components/docdisplay';
import styleGuide from '../components/styleGuide';
import ipsum from '../components/ipsum.txt';

const stories = storiesOf('DocDisplay', module);
// knobs let you change props from the front-end... cool!
stories.addDecorator(withKnobs);

const textLabel = 'input text';
const stylesLabel = 'style guide';

stories.add('simple display', () => (
  <DocDisplay
    text={text(textLabel, 'hello world')}
    styleGuide={object(stylesLabel, styleGuide)}
  />
  ))
  .add('overlapping phrases', () => (
    <DocDisplay
      text={text(textLabel, 'very unlikely to leave a mess')}
      styleGuide={object(stylesLabel, styleGuide)}
    />
  ))
  .add('paragraphs of text', () => (
    <div>{
    text(textLabel, ipsum).split('\n').map((paragraph, idx) =>
      <DocDisplay
        key={idx} text={paragraph}
        styleGuide={object(stylesLabel, styleGuide)}
      />
    )
  }</div>
  ));
