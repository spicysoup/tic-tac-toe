import React from 'react';
import { NavLink } from 'react-router-dom';
import './style.css';

const Home = () => (
  <div className="home">
    <h1>Welcome to Tic-Tac-Toe Plus</h1>
    <div>
      <ul>
        <li>This is an extended version of the <a
          href="https://en.wikipedia.org/wiki/Tic-tac-toe"
        >tic-tac-toe
        </a> game.
        </li>
        <li>
          The player who succeeds in placing all of their marks in a horizontal,
          vertical, or diagonal row wins.
        </li>
        <li>
          Bu default, the size of the game board is 4x4 but it can be changed <NavLink to="/board">here</NavLink>.
        </li>
      </ul>
    </div>
  </div>
);

Home.propTypes = {};

export default Home;
