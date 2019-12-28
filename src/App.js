import React from 'react';
import { NavLink, Route, Switch } from 'react-router-dom';
import Dummy from 'components/Dummy';
import Board from 'components/Board';
import './App.css';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actionCreators from 'actions';
import logo from './logo.svg';

function App(props) {
  const { dimension, resetBoard } = props;

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Tic-Tac-Toe
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
          <div className="App-link" onClick={resetBoard}>Reset</div>
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
};

const mapStateToProps = (state) => ({
  dimension: state.game.dimension,
});

export default connect(mapStateToProps, actionCreators)(App);
