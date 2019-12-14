import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import * as PropTypes from 'prop-types';
import * as actionCreators from 'actions';
import './style.css';

const Dummy = (props) => {
  const { dummies, retrieveDummies } = props;

  const [number, setNumber] = useState(
    -1,
  );

  useEffect(() => {
    retrieveDummies();
    setNumber(Math.floor(Math.random() * 10000));
  }, [retrieveDummies]);

  // eslint-disable-next-line func-names
  const keyGenerator = (function* () {
    let key = 0;
    while (true) {
      key += 1;
      yield key;
    }
  }());

  return (
    <main>
      <h1>
        Hello, dummy
        {' '}
        {number}
      </h1>
      {dummies.map((dummy) => (
        <div key={keyGenerator.next().value}>
          <span>{dummy.name}</span>
          <span>{dummy.email}</span>
          <span>{dummy.phone}</span>
        </div>
      ))}
    </main>
  );
};

Dummy.propTypes = {
  dummies: PropTypes.arrayOf(PropTypes.object).isRequired,
  retrieveDummies: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  dummies: state.dummies,
});

export default connect(mapStateToProps, actionCreators)(Dummy);
