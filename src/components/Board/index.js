import React, { useCallback, useEffect } from 'react';
import * as PropTypes from 'prop-types';
import { SVG } from '@svgdotjs/svg.js';
import './style.css';
import { Layer, Stage } from 'konva';

const Board = (props) => {
  const { dimension } = props;

  let draw;
  let rowHeight;
  let columnWidth;
  let padding;
  let stage;
  let canvas;

  const lineColor = 'rgba(27,31,35,.70)';
  const boardColor = 'rgba(221, 227, 225, 0.3)';
  const highlightBackgroundColor = 'rgba(221, 227, 225, 0)';

  const coordinatesToCellIndex = (rect, mouseX, mouseY) => {
    const x = Math.floor(mouseX - rect.left - padding); // x position within the element.
    const y = Math.floor(mouseY - rect.top - padding); // y position within the element.

    const row = Math.ceil(y / rowHeight) - 1;
    const column = Math.ceil(x / columnWidth) - 1;
    return { row, column };
  };

  const mouseMoveHandler = (event) => {
    if (event.target.tagName !== 'rect'
      || event.target.getAttribute('class') === 'highlight') {
      return;
    }

    const { row, column } = coordinatesToCellIndex(
      event.target.getBoundingClientRect(), event.clientX, event.clientY,
    );

    if (row < 0 || row >= dimension || column < 0 || column >= dimension) {
      if (document.querySelector('.highlight')) {
        SVG('.highlight').hide();
      }
      return;
    }

    if (!document.querySelector('.highlight')) {
      draw.rect(rowHeight, columnWidth).addClass('highlight').hide();
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

  const clickHandler = (event) => {
    const cell = event.target;
    const dataIndex = cell.getAttribute('data-index');
    if (!dataIndex) {
      return;
    }
    const [row, column] = dataIndex.split(',');
    const board = document.querySelector('rect');
    const { left: boardLeft, top: boardTop } = board.getBoundingClientRect();
    // const { left: cellLeft, top: cellTop } = cell.getBoundingClientRect();
    const cellLeft = boardLeft + padding + column * columnWidth;
    const cellTop = boardTop + padding + row * rowHeight;
    const x = Math.floor(cellLeft - boardLeft); // x position within the element.
    const y = Math.floor(cellTop - boardTop);

    const ctx = document.querySelector('canvas')
      .getContext('2d');

    ctx.font = `bold ${rowHeight}px sans-serif`;

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const { actualBoundingBoxAscent, actualBoundingBoxDescent } = ctx.measureText(
      'X',
    );
    const offset = (actualBoundingBoxAscent + actualBoundingBoxDescent) / 2
      - actualBoundingBoxDescent;
    ctx
      .fillText('X', x + columnWidth / 2, y + rowHeight / 2 + offset);
  };

  const drawBoard = useCallback(() => {
    console.log('Drawing board...');
    const svg = document.querySelector('svg');
    if (svg) {
      svg.remove();
    }

    const { clientWidth } = document.querySelector('.board');
    const clientHeight = window.innerHeight
      - document.querySelector('.App-header').clientHeight - 100;

    const width = Math.min(clientWidth, clientHeight) - 60;
    const height = width;

    document.querySelector('#grid').style.left = `${(clientWidth - width) / 2}px`;
    document.querySelector('#canvas').style.left = `${(clientWidth - width) / 2}px`;

    draw = SVG().addTo('#grid').size(width, height);
    draw.rect(width, height).fill(boardColor); // .cx(clientWidth / 2);

    columnWidth = Math.ceil((width - 40) / dimension);
    rowHeight = Math.ceil((height - 40) / dimension);
    padding = (width - columnWidth * dimension) / 2;

    console.log(columnWidth, rowHeight, padding);

    for (let i = 0; i < dimension + 1; i++) {
      const strokeStyle = {
        color: lineColor,
        width: (i === 0 || i === dimension) ? 3 : 1,
        // dasharray: '1,1',
      };
      draw.line(padding, rowHeight * i + padding, width - padding,
        rowHeight * i + padding).stroke(strokeStyle);

      draw.line(columnWidth * i + padding, padding, columnWidth * i + padding,
        height - padding).stroke(strokeStyle);
    }

    if (document.querySelector('svg')) {
      document.querySelector('svg')
        .addEventListener('mousemove', mouseMoveHandler);

      document.querySelector('svg').addEventListener('click', clickHandler);
    }

    stage = new Stage({
      container: '#canvas',
      width,
      height,
    });

    if (document.querySelector('canvas')) {
      document.querySelector('canvas').remove();
    }
    canvas = new Layer();
    stage.add(canvas);
  }, [dimension]);

  useEffect(() => {
    let handle = setTimeout(drawBoard, 0);
    window.addEventListener('resize', () => {
      clearTimeout(handle);
      handle = setTimeout(drawBoard, 500);
    });
  }, [drawBoard]);

  return (
    <div className="board">
      <h1>Test Board of {dimension} x {dimension}</h1>
      <div id="canvas" />
      <div id="grid" />
    </div>
  );
};

Board.propTypes = {
  dimension: PropTypes.number.isRequired,
};

export default Board;
