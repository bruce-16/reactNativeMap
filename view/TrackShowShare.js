import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid
} from 'react-native';
import utils from './utils';
import fetchOperator from '../server/fetchOperators.api';
import Dimensions from 'Dimensions';
import * as WeChat from 'react-native-wechat';
//设备的宽高
const {height, width} = Dimensions.get('window');

class TrackShowShare extends Component {
  static navigationOptions = {
    title: '分享',
    header: (navigation, defaultHeader) => ({
      ...defaultHeader,  // 默认预设
      headerVisible: true  // 覆盖预设中的此项
    })
  }
  constructor(props){
    super(props);
    this.state = {
      uploaded: false
    }
  }

  async _shareWX() {
    // 分享网页
    try {
      let result = await WeChat.shareToTimeline({
        type: 'text',
        description: `小伙伴们，我跑了${this.props.navigation.state.params.historyTracks.distance.toFixed(2)}米,用时${utils.second2hms(this.props.navigation.state.params.time)}大家都来吧#Running#`
      });
      console.log('share text message to time line successful:', result);
    } catch (e) {
      console.error('share text message to time line failed with:', e);
    }
  }

  _uploading(){
    let that = this;
    (async () => {
      //禁止再点击上传按钮
      that.setState({
        uploaded: true
      });
      let data =await fetchOperator('/insertMap', 'POST',{
        ...that.props.navigation.state.params.historyTracks,
        time: that.props.navigation.state.params.time
      });
      if(data.status === 0){
        ToastAndroid.showWithGravity('上传成功！', ToastAndroid.LONG, ToastAndroid.CENTER);
      }else{
        //上传失败再开启上传按钮
        that.setState({
          uploaded: false
        });
      }
    })();
  }

  render() {
    let {navigate, state} = this.props.navigation;
    let {params} = state;
    return (
      <View style={styles.container}>
        <View style={styles.info}>
          <Text style={styles.time}>
            <Text>{'时间: '}</Text>
            {utils.second2hms(params.time)}
          </Text>
          <Text style={styles.diatance}>
            <Text>{'距离: '}</Text>
            {params.historyTracks.distance.toFixed(2)}
          <Text>{' 米'}</Text></Text>
        </View>
        <View style={styles.btns}>
          <TouchableOpacity
            disabled={this.state.uploaded}
            style={styles.button}
            onPress={this._uploading.bind(this)}>
              <Text style={styles.buttonText}>{'同步'}</Text>
          </TouchableOpacity>
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
        </View>
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  info: {
    height: height*0.5,
    width: width,
    justifyContent: 'center',
    alignItems: 'center'
  },
  time: {
    fontSize: 30,
    color: '#787878',
    marginBottom: 20
  },
  diatance: {
    fontSize: 40,
    color: '#575757',
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
  }
});

export default TrackShowShare;