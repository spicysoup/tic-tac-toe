import { all, fork } from 'redux-saga/effects';

import {
  watchInboundWSMessages,
  watchOutboundWSMessages,
} from 'sagas/websocket';

export default function* root() {
  yield all([
    fork(watchInboundWSMessages),
    fork(watchOutboundWSMessages),
  ]);
}
