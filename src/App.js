import React from 'react';
import {
  NavLink, Route, Switch, withRouter,
} from 'react-router-dom';
import Dummy from 'components/Dummy';
import Board from 'components/Board';
import './App.css';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actionCreators from 'actions';
// import logo from './logo.svg';
import logo from './tic-tac-toe-svgrepo-com.svg';

function App(props) {
  const { dimension, resetBoard } = props;

  const { location: { pathname } } = props;
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          <strong>Tic-Tac-Toe</strong>
        </p>
        <nav>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn the Rules
          </a>
          <NavLink className="App-link" to="/board">Start playing</NavLink>
          {pathname === '/board'
          && (
            // eslint-disable-next-line max-len
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/interactive-supports-focus
            <div
              role="link"
              className="App-link"
              onClick={resetBoard}
            >
              Reset
            </div>
          )}

        </nav>
      </header>
      <Switch>
        <Route exact path="/">
          <Dummy />
        </Route>
        <Route path="/board">
          <Board dimension={dimension} />
        </Route>
      </Switch>
    </div>
  );
}

App.propTypes = {
  dimension: PropTypes.number.isRequired,
  resetBoard: PropTypes.func.isRequired,
  location: PropTypes.instanceOf(Object).isRequired,
};

const mapStateToProps = (state) => ({
  dimension: state.game.dimension,
});

export default withRouter(connect(mapStateToProps, actionCreators)(App));
