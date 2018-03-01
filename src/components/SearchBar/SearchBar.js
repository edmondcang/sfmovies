import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import Input from '../Input';

import history from '../../history';
import s from './SearchBar.css';

const validate = value => {
  if (value.constructor !== String) {
    return '';
  }
  return value.trim().replace(/\s+/g, ' ');
};

const defaultState = {
  value: '',
  lastSearched: '',
  suggestList: [],
};

class SearchBar extends React.Component {
  static contextTypes = {
    query: PropTypes.shape().isRequired,
  };

  static propTypes = {
    onChange: PropTypes.func,
    keywordList: PropTypes.arrayOf(PropTypes.string),
    placeholder: PropTypes.string,
  };

  static defaultProps = {
    onChange: null,
    keywordList: [],
    placeholder: 'search something',
  };

  state = { ...defaultState };

  componentDidMount() {
    this.init();
  }

  init = () => {
    const { query: { search } } = this.context;
    this.setState({ value: search });
  };

  search = str => () => {
    const value = validate(str);
    history.push(`/?search=${value}`);
    this.setState({ lastSearched: value, suggestList: [], value });
  };

  handleKeyUp = e => {
    if (e.keyCode !== 13) return;

    const { value, lastSearched, suggestList } = this.state;
    if (value === lastSearched) return;

    this.search(suggestList[0])();
  };

  handleInputChange = e => {
    let { value } = e.target;

    const { onChange } = this.props;

    this.setState({ value });

    value = validate(value).toLocaleLowerCase();

    const suggestList = [];
    if (value.length) {
      const keywordList = [...this.props.keywordList];

      let j = 20;
      for (let i = 0; i < keywordList.length; i += 1) {
        const item = keywordList[i].toLocaleLowerCase();
        if (item.indexOf(value) === 0) {
          suggestList.push(keywordList[i]);
          keywordList.splice(i, 1);
          i -= 1; // move one back since one is removed
          j -= 1;
        }
        if (!j) {
          break;
        }
      }

      for (let i = 0; i < keywordList.length; i += 1) {
        if (!j) {
          break;
        }
        const item = keywordList[i].toLocaleLowerCase();
        if (item.indexOf(value) >= 0) {
          suggestList.push(keywordList[i]);
          j -= 1;
        }
      }
    }

    this.setState({ suggestList });

    if (onChange) {
      onChange(e);
    }
  };

  render() {
    const { value, suggestList } = this.state;
    return (
      <div className={s.root}>
        <div className={s.container}>
          <Input
            rtclsn={s.txtInput}
            onChange={this.handleInputChange}
            onKeyUp={this.handleKeyUp}
            placeholder={this.props.placeholder}
            value={value}
          />
        </div>
        {suggestList ? (
          <div className={s.autoComp}>
            {suggestList.map(item => (
              <div
                key={item}
                tabIndex="0"
                role="button"
                className={s.autoCompItem}
                onClick={this.search(item)}
                onKeyDown={null}
              >
                {item}
              </div>
            ))}
          </div>
        ) : (
          ''
        )}
      </div>
    );
  }
}

export default withStyles(s)(SearchBar);
