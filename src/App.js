import React from 'react';
import { NavLink, Route, Switch } from 'react-router-dom';
import Dummy from 'components/Dummy';
import Board from 'components/Board';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Welcome to Tic-Tac-Toe
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn the Rules
        </a>
        <button type="button">
          <NavLink to="/board">Go to the Game</NavLink>
        </button>
      </header>
      <Switch>
        <Route exact path="/">
          <Dummy />
        </Route>
        <Route path="/board">
          <Board dimension={3} />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
