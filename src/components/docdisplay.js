import React, { Component, PropTypes } from 'react';
import colorizer from '../utils/colorizer';
import styleGuide from './styleguide';
import styles from '../styles/colorize.css';

/**
 * DocDisplay component
 */
class DocDisplay extends Component {
  constructor(props) {
    // save our initial phraseMap
    super(props);
    this.state = {
      phraseMap: colorizer.getPhraseMap(props.text, props.styleGuide),
      hoverKey: null,
    };

    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // assuming either 'text' or 'styleGuide' changed, so let's recreate
    // our phraseMap.
    // resetting hoverKey in case someone changes props while hovering...HEY IT COULD HAPPEN
    this.setState({
      phraseMap: colorizer.getPhraseMap(nextProps.text, nextProps.styleGuide),
      hoverKey: null,
    });
  }

  /**
   * Set our hover state.
   * Basically we have the state var hoveredPhraseMap, that we're not storing
   * in state.phraseMap, because we want phraseMap to be saved in memory so
   * that we don't have to re-calculate it every time hover state ends.
   *
   * @param  {Event} evt The mouse event
   */
  handleMouseOver(evt) {
    const hoverKey = evt.target.id;

    // probably doesn't happen
    if (this.state.hoverKey === hoverKey) return;

    if (evt.target.id && evt.target.id.includes('_')) {
      const [phraseMapIdx] = evt.target.id.split('_');
      this.setState({
        hoverKey,
        hoveredPhraseMap: colorizer.filterPhraseMap(
          this.state.phraseMap,
          phraseMapIdx,
        ),
      });
    } else {
      this.setState({
        hoverKey: null,
      });
    }
  }

  /**
   * Handle the mouse leaving its hover state
   * @param  {Event} evt  The mouse event
   */
  handleMouseOut(evt) {
    if (this.state.hoverKey === evt.target.id) {
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
    return (<div
      onMouseOver={this.handleMouseOver}
      onMouseOut={this.handleMouseOut}
      className={styles.default}
    >
      { jsx }
    </div>);
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
