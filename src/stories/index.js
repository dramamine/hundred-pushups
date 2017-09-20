import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import {
  withKnobs,
  text, boolean, number, object,
} from '@kadira/storybook-addon-knobs';
import Button from '../index';
import DocDisplay from '../components/docdisplay';
import ipsum from '../components/ipsum.txt';

const stories = storiesOf('DocDisplay', module);
stories.addDecorator(withKnobs);

stories.add('simple display', () => (
    <DocDisplay text={text('text', 'hello world')} />
  ))
  .add('paragraphs of text', () => (
    <DocDisplay text={text('text', ipsum)} />
  ));
