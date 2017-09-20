import React, {Component, PropTypes} from 'react';
import colorizer from '../utils/colorizer';
import styles from '../styles/colorize.css';

class DocDisplay extends Component {
  render() {
    return (<span className={styles.default}>{this.props.text}</span>);
  }
}

DocDisplay.propTypes = {
  text: PropTypes.string
}

export default DocDisplay;
