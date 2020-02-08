import * as PropTypes from 'prop-types';
import React from 'react';

import './style.scss';

export const Banner = (props) => {
  const {
    players, player, nextPlayer, draw, sessionID, peerReady, winningPath,
  } = props;

  const promptText = () => {
    if (!peerReady) {
      return 'Waiting for peer to join...';
    }
    console.log('winningPath', winningPath);
    if (winningPath && winningPath.length > 0) {
      const [, , winner] = winningPath[0];
      return winner === player ? 'Congrats! You won.' : 'Sorry. You lost.';
    }
    if (player === nextPlayer) {
      return 'Your move.';
    } else {
      return 'Waiting for peer...';
    }
  };

  return (
    <div className="banner-pane">
      <div className="info">Session {sessionID} - Player {players[player]}</div>
      <div className="banner">
        <div className={nextPlayer === 0
          ? 'active-player'
          : ''}
        >{players[0]}
        </div>
        <div className="info">
          <div className={draw ? 'text hide' : 'text'}>{promptText()}</div>
          <div className={draw ? 'draw active' : 'draw'}>DRAW</div>
        </div>
        <div className={nextPlayer === 1
          ? 'active-player'
          : ''}
        >{players[1]}
        </div>
      </div>
    </div>
  );
};

Banner.propTypes = {
  nextPlayer: PropTypes.number.isRequired,
  players: PropTypes.arrayOf(PropTypes.string).isRequired,
  player: PropTypes.number.isRequired,
  draw: PropTypes.bool.isRequired,
  sessionID: PropTypes.number.isRequired,
  peerReady: PropTypes.bool.isRequired,
  winningPath: PropTypes.arrayOf(PropTypes.array).isRequired,
};