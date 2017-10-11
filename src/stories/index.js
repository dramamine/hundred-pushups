import React from 'react';
import { storiesOf } from '@kadira/storybook';
import { withKnobs, text, object } from '@kadira/storybook-addon-knobs';

import Main from '../components/main';

const stories = storiesOf('DocDisplay', module);
// knobs let you change props from the front-end... cool!
stories.addDecorator(withKnobs);


stories.add('Main', () => (
  <Main />
  ))
