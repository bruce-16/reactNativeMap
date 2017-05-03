/**
 * 地图页面的导航器设置，包含地图，分享页
 */
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image
} from 'react-native';
import {StackNavigator} from 'react-navigation';

import BaiduMap from './BaiduMap';
import TrackShowShare from './TrackShowShare';

const MainPage = StackNavigator({
  BaiduMap: {
    screen: BaiduMap,
    navigationOptions: {
      title: '地图',
    }

  },
  TrackShowShare: {
    screen: TrackShowShare
  }
},{
  initialRouteName: 'BaiduMap',
  mode: 'card',
  headerMode: 'screen',
  headerVisible: false,
  headerTitle: '地图',
  headerStyle: {
    backGroundColor: 'red'
  }
});

export default MainPage;