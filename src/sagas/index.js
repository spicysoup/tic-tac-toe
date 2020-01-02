import { all, fork } from 'redux-saga/effects';
import {
  watchDeleteDummy,
  watchLoadDummies,
  watchSaveDummy,
} from 'sagas/dummy';

import { watchInboundWSMessages, watchOutboundWSMessages } from 'sagas/websocket';

export default function* root() {
  yield all([
    fork(watchLoadDummies),
    fork(watchSaveDummy),
    fork(watchDeleteDummy),
    fork(watchInboundWSMessages),
    fork(watchOutboundWSMessages),
  ]);
}
