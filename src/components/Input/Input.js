import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';

import s from './Input.css';

const defaultState = {
  value: '',
};

class Input extends React.Component {
  state = { ...defaultState };

  render() {
    const { rtclsn, name, value, onChange, onKeyUp, placeholder } = this.props;
    return (
      <input
        className={cx(s.root, rtclsn)}
        onChange={onChange}
        onKeyUp={onKeyUp}
        placeholder={placeholder}
        name={name}
        value={value}
      />
    );
  }
}

Input.propTypes = {
  rtclsn: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  onKeyUp: PropTypes.func,
};
Input.defaultProps = {
  rtclsn: '',
  name: '',
  value: '',
  placeholder: '',
  onChange: null,
  onKeyUp: null,
};

export default withStyles(s)(Input);
