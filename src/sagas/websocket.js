import { eventChannel } from 'redux-saga';
import {
  call, fork, put, take,
} from 'redux-saga/effects';
import { GAME } from 'actions/types';
import { gameJoined, serverConnected } from 'actions';

let ws;

function joinGame(action) {
  ws.send(JSON.stringify(action));
}

function initWebsocket() {
  return eventChannel((emitter) => {
    ws = new WebSocket('wss://waratah.knach.us:8443/');

    ws.onopen = () => {
      console.log('Connection to server opened.');
      emitter(serverConnected());
    };

    ws.onerror = (error) => {
      console.log('WebSocket error.', error);
      emitter(serverConnected(false));
    };

    ws.onmessage = (message) => {
      console.log(message);
      try {
        const payload = JSON.parse(message.data);
        if (payload.type === GAME.GAME_JOINED) {
          emitter(payload);
        }
      } catch (e) {
        console.error(e);
      }
    };

    ws.onclose = (event) => {
      console.log('Connection closed.', event);
      emitter(serverConnected(false));
    };

    // unsubscribe function
    return () => {
      ws.terminate();
    };
  });
}

export function* watchInboundWSMessages() {
  const channel = yield call(initWebsocket);
  while (true) {
    const action = yield take(channel);
    console.log('==================================');
    console.log(action);
    switch (action.type) {
      case GAME.GAME_JOINED:
        yield put(gameJoined(action));
        break;
      case GAME.CONNECTED:
        console.log('Connection state changed.');
        yield put(serverConnected(action.connected));
        break;
      default:
    }
  }
}

export function* watchOutboundWSMessages() {
  while (true) {
    const action = yield take([GAME.JOIN_GAME, GAME.RESET_BOARD]);
    console.log(action);

    switch (action.type) {
      case GAME.JOIN_GAME:
        yield fork(joinGame, action);
        break;
      default:
    }
  }
}
