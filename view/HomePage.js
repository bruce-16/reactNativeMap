import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert
} from 'react-native';
import Geolocation from '../AndroidView/Geolocation';
import TraceService from '../AndroidView/TraceService';
import Dimensions from 'Dimensions';
//设备的宽高
const {height, width} = Dimensions.get('window');


class HomePage extends Component {
  static navigationOptions = {
    title: '开始'
  };

  constructor(props){
    super(props);
    this.state = {
      startDate: '',
      startStatus: 'start'
    }
  }

  componentDidMount() {
      //获取当前位置
      
  }

  shouldComponentUpdate(nextProps, nextState){
    if(nextProps === this.props && nextState === this.state){
      return false;
    }else{
      return true;
    }
  }
  
  render() {
    let {state} = this;
    return (
      <View style={styles.container}>
        <View style={styles.btnArea}>
          <TouchableOpacity
            style={styles.button} 
            onPress={() => {
              let startStatus = state.startStatus === 'start' ? 'end' : 'start'; 
              this.setState({
                startStatus
              });
            }}>
              <Text>{state.startStatus}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button} 
            onPress={() => {}}>
              <Text>end</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  icon: {
    width: 32,
    height: 32
  },
  container: {
    flex: 1,
    backgroundColor: 'yellow',
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
  }
});


export default HomePage