import { DUMMY } from './types';

export const saveDummy = (dummy) => ({
  type: DUMMY.SAVE_DUMMY,
  dummy,
});

export const deleteDummy = (dummyId) => ({
  type: DUMMY.DELETE_DUMMY,
  dummyId,
});

export const retrieveDummies = () => ({
  type: DUMMY.LOAD_DUMMIES,
});
