import React from 'react';
import {
  NavLink, Route, Switch, withRouter,
} from 'react-router-dom';
import Board from 'components/Board';
import './App.css';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actionCreators from 'actions';
import Home from 'components/Home';
import Settings from 'components/Settings';
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
          <NavLink className="App-link" to="/">Learn the rules</NavLink>
          {pathname !== '/board'
          && <NavLink className="App-link" to="/board">Play</NavLink>}
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
          <NavLink className="App-link" to="/settings">Settings</NavLink>
        </nav>
      </header>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/board">
          <Board dimension={dimension} />
        </Route>
        <Route path="/settings">
          <Settings />
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
