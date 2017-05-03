import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableOpacity,
  Button,
  ToastAndroid,
  RefreshControl
} from 'react-native';
import {StackNavigator} from 'react-navigation';
import Details from './Details';
import TrackShowShare from './TrackShowShare';
import fo from '../server/fetchOperators.api';
import fetchOperators from '../server/fetchOperators.api';
import utils from './utils';

class RecordList extends Component {

  static async _emptyData(setParams){
    let data = await fetchOperators('/removeAllMapRecords', 'POST');
    if(data.status === 0){
      ToastAndroid.showWithGravity('删除成功！', ToastAndroid.LONG, ToastAndroid.CENTER);
      setParams({reload: true});
    }
  }

  static navigationOptions = {
    header: ({state, setParams}) => {
      let right = (
        <View style={{marginRight: 30}}> 
          <Button
            title={`清空`}
            onPress={() => {
             RecordList._emptyData(setParams);
            }}
          />
        </View>
      );
      return { right };
    }
  };

  constructor(props){
    super(props);
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      ds,
      dataSource : ds,
      historyTracks: ''
    }
  }

  _getdata(){
     (async () => {
      let data = await fo('/getMapRecords', 'GET');
      if(data.info.length === 0){
        this.setState({
          dataSource: this.state.ds.cloneWithRows([]),
          historyTracks: data.info
        });
      }
      this.setState({
        dataSource: this.state.ds.cloneWithRows(data.info),
        historyTracks: data.info
      });
      // console.log(JSON.stringify(data));
    })();
  }

  componentDidMount() {
    this._getdata();
  }

  shouldComponentUpdate(nextPorps, nextState){
    if(nextPorps.navigation.state.params.reload){
      nextPorps.navigation.state.params.reload=false;
      this._getdata();
      return false;
    }else{
      return true;
    }
  }

  _handleItemClick(data){
    let {navigate} = this.props.navigation;
    navigate('Details',{historyTracks: data, time: data.time, getData: this._getdata.bind(this)});
  }

  _renderItem = (rowData) => {
    let {distance, date, time} = rowData;
    time = utils.second2hms(time);
    distance = distance.toFixed(2);
    date = utils.formatDateTime(date);
    return (
      <TouchableOpacity
        onPress={this._handleItemClick.bind(this, rowData)}
        style={styles.item}
        key={rowData._id}
      >
        <View style={styles.itemContainer}>
          <Text style={{flex: 2, fontSize:25, color: '#2a2a2a',marginLeft: 10}}>{distance}<Text style={{fontSize:20}}>米</Text></Text>
          <View style={{flex: 3, flexDirection: 'column'}}>
            <Text style={{fontSize:20, color: '#2a2a2a',marginLeft: 10}}><Text style={{fontSize: 15}}>时长: </Text>{time}</Text>
            <Text style={{fontSize:20, color: '#2a2a2a',marginLeft: 10}}><Text style={{fontSize: 15}}>上传时间: </Text>{date}</Text>
          </View>
        </View>
      </TouchableOpacity>        
     
    );
  }

  render() {
    // if(this.props.navigation.state.params.reload){
    //   this._getdata();
    //   this.props.navigation.state.params.reload = false;
    // }
    return (
      <View>
        <ListView
          initialListSize={8}
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={this._getdata.bind(this)}
              tintColor="#ff0000"
              title="Loading..."
              titleColor="#00ff00"
              colors={['#ff0000', '#00ff00', '#0000ff']}
              progressBackgroundColor="#ffff00"
            />
          }
          dataSource={this.state.dataSource}
          renderRow={this._renderItem}
        />
      </View>
      
    );
  }
}


const styles = StyleSheet.create({
  icon: {
    width: 32,
    height: 32
  },
  item: {
    backgroundColor: '#ccc',
    marginBottom: 5,
    height: 80
  },
  itemContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center'
  }
});


const List = StackNavigator({
  RecordList: {
    screen: RecordList,
    navigationOptions: {
      title: '记录',
    }
  },
  Details: {
    screen: Details,
    navigationOptions: {
      title: '详情',
    }
  },
  TrackShowShare: {
    screen: TrackShowShare,
    navigationOptions: {
      title: '分享',
    }
  }
},{
  initialRouteName: 'RecordList',
  mode: 'card',
  headerMode: 'screen',
  initialRouteParams: {
    reload: true
  }
});

export default List;