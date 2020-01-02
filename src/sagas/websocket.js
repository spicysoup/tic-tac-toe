import { eventChannel } from 'redux-saga';
import {
  call, fork, put, take,
} from 'redux-saga/effects';
import { GAME } from 'actions/types';
import { gameJoined, serverConnected } from 'actions';

let ws;
let savedSessionInfo;

function sendMessage(action) {
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

function saveSessionInfo({ sessionID, player }) {
  sessionStorage.setItem('sessionID', sessionID);
  sessionStorage.setItem('player', player);
}

function retrieveSessionInfo() {
  return {
    sessionID: sessionStorage.getItem('sessionID'),
    player: sessionStorage.getItem('player'),
  };
}

export function* watchInboundWSMessages() {
  const channel = yield call(initWebsocket);
  while (true) {
    const action = yield take(channel);
    console.log('==================================');
    console.log(action);
    switch (action.type) {
      case GAME.GAME_JOINED: {
        const session = {
          ...action,
          sessionID: parseInt(action.sessionID, 10),
          player: parseInt(action.player, 10),
        };
        yield call(saveSessionInfo, session);
        yield put(gameJoined(session));
        break;
      }
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
    const action = yield take([GAME.JOIN_GAME, GAME.RESET_BOARD, GAME.NEW_MOVE]);
    console.log(action);

    if (action.type === GAME.JOIN_GAME) {
      savedSessionInfo = yield call(retrieveSessionInfo);
    }

    yield fork(sendMessage, { ...action, ...savedSessionInfo });

    // switch (action.type) {
    //   case GAME.JOIN_GAME: {
    //     savedSessionInfo = yield call(retrieveSessionInfo);
    //     yield fork(joinGame, { ...action, ...savedSessionInfo });
    //     break;
    //   }
    //   case GAME.NEW_MOVE:
    //     yield fork(sendNewMove, { ...action, ...savedSessionInfo });
    //     break;
    //   default:
    // }
  }
}
