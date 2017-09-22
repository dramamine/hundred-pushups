import React, {Component, PropTypes} from 'react';
import colorizer from '../utils/colorizer';
import styleGuide from './styleGuide';
import styles from '../styles/colorize.css';

class DocDisplay extends Component {
  constructor(props) {
    // save our initial phraseMap
    super(props);
    this.state = {
      phraseMap: colorizer.getPhraseMap(props.text, props.styleGuide),
      hoverKey: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    // assuming either 'text' or 'styleGuide' changed, so let's recreate
    // our phraseMap
    this.setState({
      phraseMap: colorizer.getPhraseMap(nextProps.text, nextProps.styleGuide),
    });
  }

  render() {
    const phraseMap = this.state.phraseMap;
    const jsx = colorizer.colorize(this.props.text, phraseMap, this.props.styleGuide);
    return (<p className={styles.default}>
      { jsx }
    </p>);
  }
}

DocDisplay.defaultProps = {
  text: 'hello world',
  styleGuide
};

DocDisplay.propTypes = {
  text: PropTypes.string,
  styleGuide: PropTypes.object
};

export default DocDisplay;
