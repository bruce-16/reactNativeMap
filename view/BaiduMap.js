import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid
} from 'react-native';

import BaiduMap from '../AndroidView/BaiduMap';
import Geolocation from '../AndroidView/Geolocation';
import * as WeChat from 'react-native-wechat';
import Dimensions from 'Dimensions';
//设备的宽高
const {height, width} = Dimensions.get('window');

class BaiduMapView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      init: false,
      time: null,
      //中心点
      center: {
        latitude: 30.5420481175,
        longitude: 114.3193136847
      },
      //缩放比列
      zoom: 20,
      currentLoc: {
        latitude: 30.5420481175,
        longitude: 114.3193136847,
        title: '起点',
        startOrEnd: true
      },
      //开始时间
      startServiceTime: (new Date()).getTime(),
      endServiceTime: (new Date()).getTime(),
      //鹰眼服务开始或者停止
      // -1 为 未开启
        // 0 为 开启服务
        // 1 为 停止服务
      startOrStopTrace: -1,
      //开始绘制地图
      dreaTrackStartTime: {
        //是否开始绘制
        start: false,
        //鹰眼服务开始时间
        startTime: this.startServiceTime
      },
      //清除所有标记
      clearMarkers: false,
      markers:[{
        latitude: 30.5420481175,
        longitude: 114.3193136847,
        title: '起点',
        startOrEnd: true
      }],
      //开始按钮
      //0 显示：开跑
      //1 显示：重新开始
      startBtn: 0,
      //结束按钮
      //0 显示： 结束
      //1 显示： 分享
      endBtn: 0
    }
  }


  componentDidMount() {
    WeChat.registerApp('wx6575737601f069e8');
    //获取当前位置
    this._setLocation();
  }

  componentWillUnmount(){
    clearInterval(this.state.time);
  }

  //设置定时器
  _setLocation(){
    this._getCurrentPosition();
    this.state.time = setInterval(() => {
      this._getCurrentPosition();
    }, 2000);
  }

  //获取当前位置
  async _getCurrentPosition(){
    try {
      var {latitude, longitude} = await Geolocation.getCurrentPosition();
      // console.warn(latitude, longitude);
      if(!this.state.init){
        this.setState({
          init: true,
          center: {
            latitude,
            longitude
          },
          markers:[{
            latitude,
            longitude,
            title: '起点',
            startOrEnd: true
          }]
        });
        return;
      }

      this.setState({
        markers:[{
          latitude,
          longitude,
          title: '起点',
          startOrEnd: true
        }]
      });

    } catch (error) {
      console.warn(error, 'error');
    }
  }

  _reload(){
    this.setState({
      init: false,
      //中心点
      center: {
        latitude: 30.5420481175,
        longitude: 114.3193136847
      },
      //缩放比列
      zoom: 20,
      currentLoc: {
        latitude: 30.5420481175,
        longitude: 114.3193136847,
        title: '起点',
        startOrEnd: true
      },
      startServiceTime: (new Date()).getTime(),
      startOrStopTrace: -1,
      dreaTrackStartTime: {
        start: false,
        startTime: this.startServiceTime
      },
      markers:[{
        latitude: 30.5420481175,
        longitude: 114.3193136847,
        title: '起点',
        startOrEnd: true
      }],
      clearMarkers: true,
      startBtn: 0,
      endBtn: 0
    });
    this._setLocation();
  }

  _handleStartPress(){
    if(this.state.startBtn === 0) {
      ToastAndroid.showWithGravity('路程开始记录！', ToastAndroid.LONG, ToastAndroid.CENTER);
      this.setState({
        startOrStopTrace: 0,
        startServiceTime: (new Date()).getTime(),
        startBtn: 1
      });
    }else if(this.state.startBtn === 1){
      //重载当前页面
      this._reload();
    }
    
  }

  _handleEndPress(){
    let {navigate} = this.props.navigation;
    if(this.state.startBtn === 0){
      ToastAndroid.showWithGravity('请先点击开始按钮！', ToastAndroid.LONG, ToastAndroid.CENTER);
      return;
    }
    //打开另一个页面
    if(this.state.endBtn === 1){
      let time = this.state.endServiceTime - this.state.startServiceTime;
      navigate('TrackShowShare', {historyTracks: this.state.historyTracks, time});
      return;
    }
    this.setState({
      dreaTrackStartTime:{
          start: true,
          startTime: this.state.startServiceTime
      },
      //停止鹰眼服务
      startOrStopTrace: 1,
    });
    this.state.endServiceTime = (new Date()).getTime();
    //清除定时器
    clearInterval(this.state.time);
  }

  _sendHistoryTrack(e){
    if(e.status  == 0){
      let str2json = JSON.parse(e.TrackPoints);
      e.TrackPoints = str2json;
      //跳转到另一个页面
      //展现页面
      this.setState({
        historyTracks: e,
        endBtn: 1,
        start: 1
      })
      console.log(JSON.stringify(e));
    }else{
      ToastAndroid.showWithGravity('路程太短，无法捕获，请重新开始。', ToastAndroid.LONG, ToastAndroid.CENTER);
    }
  }
  render(){
    let {state} = this;
    return (
      <View style={styles.container}>
        <BaiduMap style={{flex: 1}}
          mode={1}
          center={state.center}
          zoom={state.zoom}
          trafficEnabled={true}
          heatMapEnabled={false}
          markers={state.markers}
          startOrStopTrace={state.startOrStopTrace}
          historyTracks={state.historyTracks ? state.historyTracks.TrackPoints : []}
          clearMarkers = {state.clearMarkers}
          onHistoryTrack={this._sendHistoryTrack.bind(this)}
          dreaTrackStartTime = {state.dreaTrackStartTime}
        ></BaiduMap>

        <View style={styles.btnArea}>
          <TouchableOpacity
            style={styles.button}
            onPress={this._handleStartPress.bind(this)}>
              <Text style={styles.buttonText}>{state.startBtn === 0 ? '开跑' : '重新开始'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={this._handleEndPress.bind(this)}>
              <Text style={styles.buttonText}>{state.endBtn === 0 ? '结束' : '分享'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position : 'relative'
  },
  btnArea: {
    flexDirection: 'row',
    width: width,
    height: height * 0.16,
    position: 'absolute',
    bottom: 0,
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 5
  },
  button: {
    width: 100,
    height: 100,
    borderRadius : 50,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    fontSize: 20,
    color: 'white'
  }
});

export default BaiduMapView;