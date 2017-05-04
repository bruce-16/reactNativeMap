# reactNativeMap
基于react-native，百度地图开发的记录运动轨迹的app

## start
在根目录执行npm install

### 依赖项：
	"react": "16.0.0-alpha.6",
    "react-native": "0.43.3",
    "react-native-wechat": "^1.9.2",
    "react-navigation": "^1.0.0-beta.7"
由于我在写的时候，0.43刚出来，本着尝鲜的冲动，用了它，导致react-navigation不兼容，会报错。这里的解决办法就是注释掉

    node_modules\react-navigation\src\views\Header.js

里面的第12行， 如下

    // import ReactComponentWithPureRenderMixin from 'react/lib/ReactComponentWithPureRenderMixin';

#### 百度地图依赖：

由于我所使用的百度地图功能，包括定位，地图，鹰眼，所以申请百度key的时候需要选择这三个，一般默认是包涵的。

百度地图的key修改位置：

	android\app\src\main\AndroidManifest.xml

里面的： 

	<meta-data
            android:name="com.baidu.lbsapi.API_KEY"
            android:value="你的百度密钥" />

#### 微信依赖：

使用的是react-native-wechat，它的注册是在componentDidMount生命周期方法里面注册，例如：
	
	componentDidMount() {
	    WeChat.registerApp('你的微信key');
	}


#### 运行
	
	react-native run-android

这里说明， 使用android模拟器运行，会闪退，所以建议在真机上运行。