'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isServerSide = isServerSide;
exports.isSelectAction = isSelectAction;

function isServerSide() {
  if (typeof SERVERSIDE === 'boolean') {
    return SERVERSIDE;
  }

  if (typeof window === 'undefined' || !window || !window.document || !window.document.createElement) {
    return true;
  }

  return false;
}

function isSelectAction(actionType) {
  if (actionType && typeof actionType === 'string') {
    return ['selection', 'multiselect'].indexOf(actionType) >= 0;
  }

  return false;
}