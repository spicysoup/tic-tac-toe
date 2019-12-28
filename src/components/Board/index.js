import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { connect } from 'react-redux';
import * as PropTypes from 'prop-types';
import { SVG } from '@svgdotjs/svg.js';
import './style.css';
import { Layer, Stage } from 'konva';
import * as actionCreators from 'actions';
import { isDraw } from 'libs/gameKeeper';

const Banner = (props) => {
  const { players, nextPlayer, draw } = props;
  return (
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
  );
};

Banner.propTypes = {
  nextPlayer: PropTypes.string.isRequired,
  players: PropTypes.arrayOf(PropTypes.string).isRequired,
  draw: PropTypes.bool.isRequired,
};

const Board = (props) => {
  const { dimension, matrix } = props;

  const boardDataRef = useRef({ matrix });
  const gridElement = useRef(null);
  const canvasContainerElement = useRef(null);
  const [draw, setDraw] = useState(false);

  const lineColor = 'rgba(27,31,35,.70)';
  const boardColor = 'rgba(221, 227, 225, 0.3)';
  const highlightBackgroundColor = 'rgba(221, 227, 225, 0)';

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

  const drawSymbolInCell = (row, column, symbol) => {
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
    const { actualBoundingBoxAscent, actualBoundingBoxDescent } = ctx.measureText(
      symbol,
    );
    const offset = (actualBoundingBoxAscent + actualBoundingBoxDescent) / 2
      - actualBoundingBoxDescent;
    ctx
      .fillText(symbol, x + columnWidth / 2, y + rowHeight / 2 + offset);
  };

  const clickHandler = (event) => {
    if (draw) {
      return;
    }

    const cell = event.target;
    const dataIndex = cell.getAttribute('data-index');
    if (!dataIndex) {
      return;
    }

    const [row, column] = dataIndex.split(',');
    // const { matrix } = props;
    if (matrix[row][column] !== '') {
      return;
    }

    const { nextPlayer: symbol } = props;

    drawSymbolInCell(row, column, symbol);

    const { newMove } = props;
    newMove([row, column, symbol]);

    // const matrix1 = getMatrix();
    // console.log(matrix1[row][column]);

    setDraw(isDraw());
  };

  const refillBoard = useCallback(() => {
    boardDataRef.current.matrix.forEach((row, r) => {
      row.forEach((column, c) => {
        if (column !== '') {
          drawSymbolInCell(r, c, column);
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
      - document.querySelector('.App-header').clientHeight - 100;

    const width = Math.min(clientWidth, clientHeight) - 60;
    const height = width;

    const banner = document.querySelector('.banner');
    banner.style.width = `${width}px`;
    banner.style.fontSize = `${Math.floor(width / 15)}px`;

    gridElement.current.style.left = `${(clientWidth - width) / 2}px`;
    canvasContainerElement.current.style.left = `${(clientWidth - width)
    / 2}px`;

    svg = SVG().addTo('#grid').size(width, height);
    const { left, top } = document.querySelector('svg').getBoundingClientRect();
    svg.rect(width, height).fill(boardColor); // .cx(clientWidth / 2);

    const columnWidth = Math.ceil((width - 40) / dimension);
    const rowHeight = Math.ceil((height - 40) / dimension);
    const padding = (width - columnWidth * dimension) / 2;

    for (let i = 0; i < dimension + 1; i++) {
      const strokeStyle = {
        color: lineColor,
        width: (i === 0 || i === dimension) ? 3 : 1,
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
    boardDataRef.current.timeoutHandle = setTimeout(drawBoard, 0);
    window.addEventListener('resize', () => {
      clearTimeout(boardDataRef.current.timeoutHandle);
      boardDataRef.current.timeoutHandle = setTimeout(drawBoard, 500);
    });
  }, [drawBoard]);

  const { players, nextPlayer } = props;
  return (
    <div className="board">
      <Banner players={players} nextPlayer={nextPlayer} draw={draw} />
      <div ref={canvasContainerElement} id="canvas-container" />
      {/* eslint-disable-next-line max-len */}
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events */}
      <div
        ref={gridElement}
        className={draw ? 'locked' : ''}
        id="grid"
        onClick={clickHandler}
        onMouseMove={mouseMoveHandler}
      />
    </div>
  );
};

Board.propTypes = {
  dimension: PropTypes.number.isRequired,
  newMove: PropTypes.func.isRequired,
  nextPlayer: PropTypes.string.isRequired,
  players: PropTypes.arrayOf(PropTypes.string).isRequired,
  matrix: PropTypes.arrayOf(PropTypes.array).isRequired,
};

const mapStateToProps = (state) => ({
  nextPlayer: state.game.nextPlayer,
  players: state.game.players,
  matrix: state.game.matrix,
});

export default connect(mapStateToProps, actionCreators)(Board);
