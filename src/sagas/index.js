import { all, fork } from 'redux-saga/effects';
import {
  watchDeleteDummy,
  watchLoadDummies,
  watchSaveDummy,
} from 'sagas/dummy';

export default function* root() {
  yield all([
    fork(watchLoadDummies),
    fork(watchSaveDummy),
    fork(watchDeleteDummy),
  ]);
}
