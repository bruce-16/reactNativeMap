/**
 * 详情页，使用地图显示轨迹。
 */
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
import Dimensions from 'Dimensions';
import ulits from './utils';
import * as WeChat from 'react-native-wechat';
import fetchOperator from '../server/fetchOperators.api';
//设备的宽高
const {height, width} = Dimensions.get('window');

export default class Details extends Component {
  constructor(props){
    super(props);
  }

  async _shareWX() {
    // 分享网页
    try {
      let result = await WeChat.shareToTimeline({
        type: 'text',
        description: `小伙伴们，我跑了${this.props.navigation.state.params.historyTracks.distance.toFixed(2)}米,用时${ulits.second2hms(this.props.navigation.state.params.time)}大家都来吧#Running#`
      });
      console.log('share text message to time line successful:', result);
    } catch (e) {
      console.error('share text message to time line failed with:', e);
    }
  }

  componentDidMount(){
    WeChat.registerApp('wx6575737601f069e8');
  }

  //删除数据
  _deleteData(){
    (async () => {
      let {historyTracks,getData} = this.props.navigation.state.params;
      let {goBack} = this.props.navigation;
      let data = await fetchOperator('/removeMapRecord', 'POST', {"_id": historyTracks._id});
      if(data.status === 0){
        ToastAndroid.showWithGravity('删除成功！', ToastAndroid.LONG, ToastAndroid.CENTER);
        setTimeout(()=>{
          getData();
          goBack();
        }, ToastAndroid.LONG);
      }
    })();
  }

  render() {
    let {navigate, state} = this.props.navigation;
    let {historyTracks} = state.params;
    return (
      <View style={styles.container}>
        <BaiduMap
          style={styles.map}
          mode={1}
          center={{latitude: historyTracks.centerLat,longitude:historyTracks.centerLng}}
          zoom={20}
          trafficEnabled={true}
          heatMapEnabled={false}
          historyTracks={historyTracks.TrackPoints}
        />
        <View style={styles.textContent}>
          <Text style={{flex: 2, fontSize:25, color: '#2a2a2a'}}>{historyTracks.distance.toFixed(2)}<Text style={{fontSize:20}}>米</Text></Text>
          <Text style={{flex: 2, fontSize:25, color: '#2a2a2a'}}>{ulits.second2hms(historyTracks.time)}</Text>
        </View>
        <View style={styles.btns}>
            {/*<TouchableOpacity
            style={styles.button}
            onPress={() => {}}>
              <Text style={styles.buttonText}>{'QQ'}</Text>
          </TouchableOpacity>*/}
          <TouchableOpacity
            style={styles.button}
            onPress={this._shareWX.bind(this)}>
              <Text style={styles.buttonText}>{'微信'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={this._deleteData.bind(this)}>
              <Text style={styles.buttonText}>{'删除'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    height: height * 0.55,
    width: width,
  },
  textContent: {
    height: height*0.15, 
    width: width, 
    flexDirection: 'column', 
    justifyContent: 'center', 
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5,
  },
  btns: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  button: {
    width: 100,
    height: 100,
    borderRadius : 50,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center'
  },
});