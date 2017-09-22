import React, { Component, PropTypes } from 'react';
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

    this.handleMouseOver = this.handleMouseOver.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // assuming either 'text' or 'styleGuide' changed, so let's recreate
    // our phraseMap
    this.setState({
      phraseMap: colorizer.getPhraseMap(nextProps.text, nextProps.styleGuide),
    });
  }

  handleMouseOver(evt) {
    const hoverKey = evt.target.id;

    // probably doesn't happen
    if (this.state.hoverKey === hoverKey) return;

    if (evt.target.id && evt.target.id.includes('_')) {
      const [phraseMapIdx, phraseStart] = evt.target.id.split('_');
      this.setState({
        hoverKey,
        hoveredPhraseMap: colorizer.filterPhraseMap(
          this.state.phraseMap,
          phraseMapIdx,
          phraseStart,
        ),
      });
    } else {
      this.setState({
        hoverKey: null,
      });
    }
  }

  render() {
    const phraseMap = this.state.hoverKey
      ? this.state.hoveredPhraseMap
      : this.state.phraseMap;
    const jsx = colorizer.colorize(this.props.text, phraseMap, this.props.styleGuide);
    return (<p onMouseOver={this.handleMouseOver} className={styles.default}>
      { jsx }
    </p>);
  }
}

DocDisplay.defaultProps = {
  text: 'hello world',
  styleGuide,
};

DocDisplay.propTypes = {
  text: PropTypes.string,
  styleGuide: PropTypes.array,
};

export default DocDisplay;
