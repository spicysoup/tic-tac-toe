import React, { useCallback, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import * as PropTypes from 'prop-types';
import { SVG } from '@svgdotjs/svg.js';
import { isEqual } from 'lodash';
import './style.css';
import { Layer, Stage } from 'konva';
import * as actionCreators from 'actions';
import { checkWin, isDraw } from 'libs/gameKeeper';

const Banner = (props) => {
  const {
    players, player, nextPlayer, draw, sessionID,
  } = props;
  return (
    <div>
      <div className="info">Session {sessionID} - Player {players[player]}</div>
      <div className="banner">
        <div className={players[0] === nextPlayer
          ? 'active-player'
          : ''}
        >{players[0]}
        </div>
        <div className={draw ? 'draw active' : 'draw'}>DRAW</div>
        <div className={players[1] === nextPlayer
          ? 'active-player'
          : ''}
        >{players[1]}
        </div>
      </div>
    </div>
  );
};

Banner.propTypes = {
  nextPlayer: PropTypes.string.isRequired,
  players: PropTypes.arrayOf(PropTypes.string).isRequired,
  player: PropTypes.number.isRequired,
  draw: PropTypes.bool.isRequired,
  sessionID: PropTypes.number.isRequired,
};

const Board = (props) => {
  const {
    dimension, matrix, sessionID, winningPath, players, nextPlayer, draw,
    newMove, setWinningPath, setDraw, joinGame, connected, round, player,
  } = props;

  const boardDataRef = useRef({ matrix, winningPath });
  const gridElement = useRef(null);
  const canvasContainerElement = useRef(null);

  const lineColor = 'rgba(27,31,35,.70)';
  const boardColor = 'rgba(221, 227, 225, 0.3)';
  const highlightBackgroundColor = 'rgba(221, 227, 225, 0)';
  const winningColor = 'gold';
  const winningStrokeColor = '#80321B';
  const cellTextColor = 'black';

  const coordinatesToCellIndex = (mouseX, mouseY) => {
    const {
      columnWidth, rowHeight, padding, left, top,
    } = boardDataRef.current;

    const x = Math.floor(mouseX - left - padding); // x position within the board boundary.
    const y = Math.floor(mouseY - top - padding); // y position within the board boundary.

    const row = Math.ceil(y / rowHeight) - 1;
    const column = Math.ceil(x / columnWidth) - 1;
    return { row, column };
  };

  const mouseMoveHandler = (event) => {
    if (event.target.tagName !== 'rect'
      || event.target.getAttribute('class') === 'highlight') {
      return;
    }

    const {
      svg, columnWidth, rowHeight, padding,
    } = boardDataRef.current;

    const { row, column } = coordinatesToCellIndex(
      event.clientX,
      event.clientY,
    );

    if (row < 0 || row >= dimension || column < 0 || column >= dimension) {
      if (document.querySelector('.highlight')) {
        SVG('.highlight').hide();
      }
      return;
    }

    if (!document.querySelector('.highlight')) {
      svg.rect(rowHeight, columnWidth).addClass('highlight').hide();
    }

    SVG('.highlight')
      .show()
      .x(padding + column * columnWidth)
      .y(padding + row * rowHeight)
      .stroke({ color: 'red', width: 2 })
      .fill(highlightBackgroundColor);

    document.querySelector('.highlight')
      .setAttribute('data-index', `${row},${column}`);
  };

  const drawSymbolInCell = (row, column, symbol, color, strokeColor) => {
    const {
      left, top, padding, columnWidth, rowHeight,
    } = boardDataRef.current;

    const cellLeft = left + padding + column * columnWidth;
    const cellTop = top + padding + row * rowHeight;
    const x = Math.floor(cellLeft - left); // x position within the element.
    const y = Math.floor(cellTop - top);

    const ctx = document.querySelector('canvas')
      .getContext('2d');

    ctx.font = `bold ${rowHeight}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    if (color) {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 4;
      ctx.fillStyle = color;
    } else {
      ctx.strokeStyle = cellTextColor;
      ctx.lineWidth = 1;
      ctx.fillStyle = cellTextColor;
    }

    const { actualBoundingBoxAscent, actualBoundingBoxDescent } = ctx.measureText(
      symbol,
    );
    const offset = (actualBoundingBoxAscent + actualBoundingBoxDescent) / 2
      - actualBoundingBoxDescent;
    ctx
      .fillText(symbol, x + columnWidth / 2, y + rowHeight / 2 + offset);

    if (color) {
      ctx
        .strokeText(symbol, x + columnWidth / 2, y + rowHeight / 2 + offset);
    }
  };

  const clickHandler = (event) => {
    if (draw || winningPath.length > 0) {
      return;
    }

    const cell = event.target;
    const dataIndex = cell.getAttribute('data-index');
    if (!dataIndex) {
      return;
    }

    const [row, column] = dataIndex.split(',').map((n) => parseInt(n, 0));
    if (matrix[row][column] !== '') {
      return;
    }

    const { nextPlayer: symbol } = props;

    drawSymbolInCell(row, column, symbol);

    newMove([row, column, symbol]);

    if (isDraw()) {
      setDraw(true);
    } else {
      const winningCells = checkWin(row, column);
      if (winningCells) {
        setWinningPath(winningCells);
        boardDataRef.current.winningPath = winningCells;
        winningCells.forEach(
          (c) => {
            drawSymbolInCell(c[0], c[1], c[2], winningColor,
              winningStrokeColor);
          },
        );
      }
    }
  };

  const refillBoard = useCallback(() => {
    boardDataRef.current.matrix.forEach((row, r) => {
      row.forEach((column, c) => {
        if (column !== '') {
          const winningCell = boardDataRef.current.winningPath.findIndex(
            (v) => isEqual([v[0], v[1]], [r, c]),
          );
          if (winningCell !== -1) {
            drawSymbolInCell(r, c, column, winningColor, winningStrokeColor);
          } else {
            drawSymbolInCell(r, c, column);
          }
        }
      });
    });
  }, []);

  const drawBoard = useCallback(() => {
    clearTimeout(boardDataRef.current.timeoutHandle);

    console.log('Drawing board...');
    let svg = document.querySelector('svg');
    if (svg) {
      svg.remove();
    }

    const { clientWidth } = document.querySelector('.board');
    const clientHeight = window.innerHeight
      - document.querySelector('.App-header').clientHeight - 120;

    const width = Math.min(clientWidth, clientHeight) - 60;
    const height = width;

    const banner = document.querySelector('.banner');
    banner.style.width = `${width}px`;
    banner.style.fontSize = `${Math.floor(width / 15)}px`;

    gridElement.current.style.left = `${(clientWidth - width) / 2}px`;
    // gridElement.current.style.width = `${width}px`;
    // canvasContainerElement.current.style.left = `${(clientWidth - width)
    // / 2}px`;
    canvasContainerElement.current.style.width = `${width}px`;

    svg = SVG().addTo('#grid').size(width, height);
    const { left, top } = document.querySelector('svg').getBoundingClientRect();
    svg.rect(width, height).attr({
      fill: boardColor,
      stroke: lineColor,
      'stroke-width': 6,
    });

    const columnWidth = Math.ceil((width - 20) / dimension);
    const rowHeight = Math.ceil((height - 20) / dimension);
    const padding = (width - columnWidth * dimension) / 2;

    for (let i = 0; i < dimension + 1; i++) {
      const strokeStyle = {
        color: lineColor,
        width: 1,
        // dasharray: '1,1',
      };
      svg.line(padding, rowHeight * i + padding, width - padding,
        rowHeight * i + padding).stroke(strokeStyle);

      svg.line(columnWidth * i + padding, padding, columnWidth * i + padding,
        height - padding).stroke(strokeStyle);
    }

    const stage = new Stage({
      container: '#canvas-container',
      width,
      height,
    });

    if (document.querySelector('canvas')) {
      document.querySelector('canvas').remove();
    }
    const canvas = new Layer();
    stage.add(canvas);

    boardDataRef.current = {
      ...boardDataRef.current,
      stage,
      canvas,
      svg,
      left,
      top,
      columnWidth,
      rowHeight,
      padding,
    };

    refillBoard();
  }, [dimension, refillBoard]);

  useEffect(() => {
    // boardDataRef.current.timeoutHandle = setTimeout(drawBoard, 0);
    const listener = () => {
      clearTimeout(boardDataRef.current.timeoutHandle);
      boardDataRef.current.timeoutHandle = setTimeout(drawBoard, 500);
    };
    window.addEventListener('resize', listener);
    return () => {
      window.removeEventListener('resize', listener);
    };
  }, [drawBoard]);

  useEffect(() => {
    // if (sessionID === 0) {
    //   return;
    // }
    console.log(`Session [${sessionID}] round [${round}]`);
    if (connected && sessionID === 0) {
      joinGame();
    }
    drawBoard();
  }, [sessionID, drawBoard, joinGame, connected, round]);

  return (
    <div className="board">
      <Banner player={player} players={players} nextPlayer={nextPlayer} draw={draw} sessionID={sessionID} />
      <div className="grid-container" onMouseMove={mouseMoveHandler}>
        <div ref={canvasContainerElement} id="canvas-container" />
        {/* eslint-disable-next-line max-len */}
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events */}
        <div
          ref={gridElement}
          className={!connected || draw || winningPath.length > 0 ? 'locked' : ''}
          id="grid"
          onClick={clickHandler}
        />
      </div>
    </div>
  );
};

Board.propTypes = {
  dimension: PropTypes.number.isRequired,
  newMove: PropTypes.func.isRequired,
  nextPlayer: PropTypes.string.isRequired,
  players: PropTypes.arrayOf(PropTypes.string).isRequired,
  player: PropTypes.number.isRequired,
  matrix: PropTypes.arrayOf(PropTypes.array).isRequired,
  sessionID: PropTypes.number.isRequired,
  round: PropTypes.number.isRequired,
  winningPath: PropTypes.arrayOf(PropTypes.array).isRequired,
  setWinningPath: PropTypes.func.isRequired,
  setDraw: PropTypes.func.isRequired,
  joinGame: PropTypes.func.isRequired,
  draw: PropTypes.bool.isRequired,
  connected: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  nextPlayer: state.game.nextPlayer,
  players: state.game.players,
  player: state.game.player,
  matrix: state.game.matrix,
  sessionID: state.game.sessionID,
  round: state.game.round,
  winningPath: state.game.winningPath,
  draw: state.game.draw,
  connected: state.game.connected,
});

export default connect(mapStateToProps, actionCreators)(Board);
