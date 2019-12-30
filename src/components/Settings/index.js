import React from 'react';
import * as PropTypes from 'prop-types';
import './style.css';
import * as actionCreators from 'actions';
import { connect } from 'react-redux';

const Spinner = (props) => {
  const { value, onChange } = props;

  const useSpinner = (initialNum, [min, max]) => {
    const num = { value: initialNum };

    const change = (dir) => {
      num.value += dir;
      if (num.value > max) {
        num.value = min;
      }
      if (num.value < min) {
        num.value = max;
      }
    };

    return [num, change];
  };

  const [number, changeNumber] = useSpinner(value, [3, 8]);

  const onChangeNumber = (direction) => () => {
    changeNumber(direction);
    onChange(number.value);
  };

  return (
    <div className="setting-field">
      <div>Dimension:</div>
      <div className="spinner">
        {/* eslint-disable-next-line max-len */}
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
        <span onClick={onChangeNumber(-1)}>-</span>
        <span className="dimension">{value}</span>
        {/* eslint-disable-next-line max-len */}
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
        <span onClick={onChangeNumber(+1)}>+</span>
      </div>
    </div>
  );
};

Spinner.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.number.isRequired,
};

const Settings = (props) => {
  const { dimension, setDimension } = props;
  const onChangeDimension = (number) => {
    setDimension(number);
  };
  return (
    <div className="settings">
      <Spinner
        onChange={onChangeDimension}
        value={dimension}
      />
    </div>
  );
};

Settings.propTypes = {
  dimension: PropTypes.number.isRequired,
  setDimension: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  dimension: state.game.dimension,
});

export default connect(mapStateToProps, actionCreators)(Settings);
