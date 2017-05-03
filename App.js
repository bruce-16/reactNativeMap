import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image
} from 'react-native';
import {DrawerNavigator,DrawerView} from 'react-navigation';
import * as WeChat from 'react-native-wechat';
import HomePage from './view/HomePage';
import RecordList from './view/RecordList';
import BaiduMapView from './view/BaiduMap';
import MainPageNavi from './view/MainPage.navi';
import TrackShare from './view/TrackShowShare';
const MyApp = DrawerNavigator({
  /*'主页': {
    screen: HomePage,
  },*/
  'MainPage': {
    screen: MainPageNavi,
    navigationOptions: {
      title: 'Running'
    }
  },
  '记录': {
    screen: RecordList,
    navigationOptions: {
      title: '记录'
    }
  }
},{
  initialRouteName: 'MainPage',
  drawerWidth: 200,
  contentOptions: {
    activeTintColor: '#e91e63',
    inactiveTintColor: '#fff',
    style: {
      
    },
  },
  contentComponent: props => (
    <ScrollView style={styles.slider}>
      <Image
          source={require('./images/run.png')}
          style={[styles.icon]}
      />
      <DrawerView.Items {...props}/>
    </ScrollView>
    )
});

const styles = StyleSheet.create({
  icon: {
    width: 100,
    height: 100,
    margin: 20
  },
  slider: {
    backgroundColor: '#2c2c2c',
  }
});
export default MyApp;
