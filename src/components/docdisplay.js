import React, {Component, PropTypes} from 'react';
import colorizer from '../utils/colorizer';
import styleGuide from './styleGuide';
import styles from '../styles/colorize.css';

class DocDisplay extends Component {
  constructor(props) {
    // save our initial styleMap
    super(props);
    this.state = {
      styleMap: colorizer.getStyleMap(props.text, props.styleGuide),
      hoverKey: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    // assuming either 'text' or 'styleGuide' changed, so let's recreate
    // our styleMap
    this.setState({
      styleMap: colorizer.getStyleMap(nextProps.text, nextProps.styleGuide),
    });
  }

  render() {
    const styleMap = this.state.styleMap;
    const html = colorizer.applyStyles(this.props.text.split(' '), styleMap, this.props.styleGuide)
      .join(' ');
    return (<p className={styles.default}>
      { html }
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
