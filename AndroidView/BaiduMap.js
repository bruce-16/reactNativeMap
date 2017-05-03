import React,{ PropTypes, Component } from 'react';
import { requireNativeComponent, View } from 'react-native';

// var iface = {
//   name: 'BaiduMap',
//   propTypes: {
//     mode: PropTypes.number,
//     center: PropTypes.object,
//     zoom: PropTypes.number,
//     trafficEnabled: PropTypes.bool,
//     heatMapEnabled: PropTypes.bool,
//     marker: PropTypes.object,
//     markers: PropTypes.arrayOf(PropTypes.object),
//     startOrStopTrace: PropTypes.number,
//     dreaTrackStartTime: PropTypes.object,
//     ...View.propTypes // 包含默认的View的属性
//   },
// };

const RCTBaiduMap = requireNativeComponent('RCTBaiduMap', BaiduMap, {
  nativeOnly: {onChange: true}
});

export default class BaiduMap extends Component {
  static propTypes = {
    mode: PropTypes.number,
    center: PropTypes.object,
    zoom: PropTypes.number,
    trafficEnabled: PropTypes.bool,
    heatMapEnabled: PropTypes.bool,
    marker: PropTypes.object,
    markers: PropTypes.arrayOf(PropTypes.object),
    startOrStopTrace: PropTypes.number,
    dreaTrackStartTime: PropTypes.object,
    historyTracks: PropTypes.array,
    clearMarkers: PropTypes.bool,
    onHistoryTrack: PropTypes.func,
    ...View.propTypes // 包含默认的View的属性
  }

  static defaultProps = {
    mode: 1,
    center: null,
    zoom: 17,
    trafficEnabled: false,
    heatMapEnabled: false,
    startOrStopTrace: -1,
  }

  constructor() {
    super();
  }

  _onChange(event) {
    if(!this.props.onHistoryTrack){
      return;
    }
    this.props.onHistoryTrack(event.nativeEvent.onHistoryTrack);
  }

  render() {
    return <RCTBaiduMap {...this.props} onChange={this._onChange.bind(this)}/>;
  }
}


