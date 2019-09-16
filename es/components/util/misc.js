'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isServerSide = isServerSide;

function isServerSide() {
  if (typeof SERVERSIDE === 'boolean') {
    return SERVERSIDE;
  }

  if (typeof window === 'undefined' || !window || !window.document || !window.document.createElement) {
    return true;
  }

  return false;
}