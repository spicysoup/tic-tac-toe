import React, { useEffect } from 'react';
import * as PropTypes from 'prop-types';
import { SVG } from '@svgdotjs/svg.js';
import './style.css';

const Board = (props) => {
  const { dimension } = props;

  useEffect(() => {
    const drawBoard = () => {
      console.log('Drawing board...');
      const svg = document.querySelector('svg');
      if (svg) {
        svg.remove();
      }

      const paper = document.querySelector('.board');
      const { clientWidth } = paper;
      const clientHeight = window.innerHeight
        - document.querySelector('.App-header').clientHeight - 100;

      const width = Math.min(clientWidth, clientHeight) - 60;
      const height = Math.min(clientWidth, clientHeight) - 60;

      const draw = SVG().addTo('.board').size(width, height);
      draw.rect(width, height).fill('#dde3e1');

      const columnWidth = Math.ceil((width - 40) / dimension);
      const rowHeight = Math.ceil((height - 40) / dimension);
      const padding = (width - columnWidth * dimension) / 2;

      console.log(columnWidth, rowHeight, padding);

      for (let i = 0; i < dimension + 1; i++) {
        const strokeStyle = {
          color: 'rgba(27,31,35,.70)',
          width: (i === 0 || i === dimension) ? 3 : 1,
          // dasharray: '1,1',
        };
        draw.line(padding, rowHeight * i + padding, width - padding, rowHeight * i + padding)
          .stroke(strokeStyle);

        draw.line(columnWidth * i + padding, padding, columnWidth * i + padding, height - padding)
          .stroke(strokeStyle);
      }

      const mouseMoveHandler = (event) => {
        if (event.target.tagName !== 'rect' || event.target.getAttribute('class') === 'highlight') {
          return;
        }

        const rect = event.target.getBoundingClientRect();

        const x = Math.floor(event.clientX - rect.left - padding); // x position within the element.
        const y = Math.floor(event.clientY - rect.top - padding); // y position within the element.

        const row = Math.ceil(y / rowHeight) - 1;
        const column = Math.ceil(x / columnWidth) - 1;

        if (row < 0 || row >= dimension || column < 0 || column >= dimension) {
          return;
        }

        if (!document.querySelector('.highlight')) {
          draw.rect(rowHeight, columnWidth).addClass('highlight').hide();
        }

        SVG('.highlight').show()
          .x(padding + column * columnWidth)
          .y(padding + row * rowHeight)
          .stroke({ color: 'red', width: 2 })
          .fill('transparent');
      };

      if (document.querySelector('svg')) {
        document.querySelector('svg').addEventListener('mousemove', mouseMoveHandler);
      }
    };

    let handle = setTimeout(drawBoard, 500);
    window.addEventListener('resize', () => {
      clearTimeout(handle);
      handle = setTimeout(drawBoard, 500);
    });
  }, [dimension]);

  return (
    <div className="board">
      <h1>Test Board of {dimension} x {dimension}</h1>
    </div>
  );
};

Board.propTypes = {
  dimension: PropTypes.number.isRequired,
};

export default Board;
