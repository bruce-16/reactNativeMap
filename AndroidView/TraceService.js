import {
  requireNativeComponent,
  NativeModules,
  Platform,
  DeviceEventEmitter
} from 'react-native';

import React, {
  Component,
  PropTypes
} from 'react';

const _module = NativeModules.TraceModule;

export default {
  init(){
    _module.init();
  },
  startTrace(){
    _module.startTrace();
  },
  stopTrace(){
    _module.stopTrace();
  },
  getTrack(startTraceTime){
    return new Promise((resolve, reject) => {
      try {
        _module.getTraces(startTraceTime);
      }
      catch (e) {
        reject(e);
        return;
      }
      DeviceEventEmitter.once('onHistoryTrackCallback', resp => {
        resolve(resp);
      });
    });
  }
}