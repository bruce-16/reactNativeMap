package com.reactnativemap;

import android.app.Activity;
import android.content.Context;
import android.support.annotation.Nullable;
import android.util.Log;

import com.baidu.mapapi.SDKInitializer;
import com.baidu.mapapi.map.BaiduMap;
import com.baidu.mapapi.map.MapStatus;
import com.baidu.mapapi.map.MapStatusUpdate;
import com.baidu.mapapi.map.MapStatusUpdateFactory;
import com.baidu.mapapi.map.MapView;
import com.baidu.mapapi.map.Marker;
import com.baidu.mapapi.model.LatLng;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by zachrey on 2017/4/18.
 */

public class BaiduMapViewManager extends SimpleViewManager<MapView> implements BaiduMap.OnMapLoadedCallback {
    public static final String RCT_CLASS = "RCTBaiduMap";
    public static final String TAG = "RCTBaiduMap";
    private ThemedReactContext mReactContext;
    public static  final int ruler = 16;
    private static Activity mActivity;
    private HashMap<String, Marker> mMarkerMap = new HashMap<>();
    private HashMap<String, List<Marker>> mMarkersMap = new HashMap<>();
    private BaiduMap baiduMap;
    private DrawTrackModule drawTrackModule;
    private Context context;
    private ReactApplicationContext mreactContext;
    @Override
    public String getName() {
        return RCT_CLASS;
    }

    public static void  initSDK(Context context) {
//        this.context = context;
        SDKInitializer.initialize(context);
    }
    public BaiduMapViewManager(ReactApplicationContext reactContext){
        this.mreactContext = reactContext;
    }
    @Override
    protected MapView createViewInstance(ThemedReactContext reactContext) {
        this.mReactContext = reactContext;

        return getMap(reactContext);
    }

    private MapView getMap(ThemedReactContext reactContext) {
        MapView mMapView = new MapView(reactContext);
        mMapView.showZoomControls(false);
        baiduMap = mMapView.getMap();
        baiduMap.animateMapStatus(MapStatusUpdateFactory.zoomTo(ruler), 1 * 1000);
        baiduMap.setOnMapLoadedCallback(this);
        return mMapView;
    }

    /**
     * 地图模式
     *
     * @param mapView
     * @param type
     *  1. 普通
     *  2. 卫星
     */
    @ReactProp(name="mode", defaultInt = 1)
    public void setMode(MapView mapView, int type) {
        Log.i(TAG, "mode:" + type);
        mapView.getMap().setMapType(type);
    }

    /**
     * 实时交通图
     *
     * @param mapView
     * @param isEnabled
     */
    @ReactProp(name="trafficEnabled", defaultBoolean = false)
    public void setTrafficEnabled(MapView mapView, boolean isEnabled) {
        Log.d(TAG, "trafficEnabled:" + isEnabled);
        mapView.getMap().setTrafficEnabled(isEnabled);
    }

    /**
     * 实时道路热力图
     *
     * @param mapView
     * @param isEnabled
     */
    @ReactProp(name="heatMapEnabled", defaultBoolean = false)
    public void setHeatMapEnabled(MapView mapView, boolean isEnabled) {
        Log.d(TAG, "heatMapEnabled" + isEnabled);
        mapView.getMap().setBaiduHeatMapEnabled(isEnabled);
    }

    /**
     * 中心点
     *
     * @param mapView
     * @param position
     */
    @ReactProp(name="center")
    public void setCenter(MapView mapView, ReadableMap position) {
        if(position != null) {
            double latitude = position.getDouble("latitude");
            double longitude = position.getDouble("longitude");
            LatLng point = new LatLng(latitude, longitude);
            MapStatus mapStatus = new MapStatus.Builder()
                    .target(point)
                    .build();
            MapStatusUpdate mapStatusUpdate = MapStatusUpdateFactory.newMapStatus(mapStatus);
            mapView.getMap().setMapStatus(mapStatusUpdate);
        }
    }

    /**
     * 缩放
     *
     * @param mapView
     * @param zoom
     */
    @ReactProp(name="zoom")
    public void setZoom(MapView mapView, float zoom) {
        MapStatus mapStatus = new MapStatus.Builder().zoom(zoom).build();
        MapStatusUpdate mapStatusUpdate = MapStatusUpdateFactory.newMapStatus(mapStatus);
        mapView.getMap().setMapStatus(mapStatusUpdate);
    }

    /**
     * marker
     */

    @ReactProp(name="marker")
    public void setMarker(MapView mapView, ReadableMap option) {
        if(option != null) {
            String key = "marker_" + mapView.getId();
            Marker marker = mMarkerMap.get(key);
            if(marker != null) {
                MarkerUtil.updateMaker(marker, option);
            }
            else {
                marker = MarkerUtil.addMarker(mapView, option);
                mMarkerMap.put(key, marker);
            }
        }
    }



    @ReactProp(name="markers")
    public void setMarkers(MapView mapView, ReadableArray options) {
        String key = "markers_" + mapView.getId();
        List<Marker> markers = mMarkersMap.get(key);
        if(markers == null) {
            markers = new ArrayList<>();
        }
        for (int i = 0; i < options.size(); i++) {
            ReadableMap option = options.getMap(i);
            if(markers.size() > i + 1 && markers.get(i) != null) {
                MarkerUtil.updateMaker(markers.get(i), option);
            }
            else {
                markers.add(i, MarkerUtil.addMarker(mapView, option));
            }
        }
        if(options.size() < markers.size()) {
            int start = markers.size() - 1;
            int end = options.size();
            for (int i = start; i >= end; i--) {
                markers.get(i).remove();
                markers.remove(i);
            }
        }
        mMarkersMap.put(key, markers);
    }

    @ReactProp(name = "clearMarkers")
    public void  clearMarkers(MapView mapView, Boolean clear){
        if(clear){
            baiduMap.clear();
        }
    }

    @ReactProp(name = "startOrStopTrace")
    public void setStartService(MapView mapView,int status){
        if(status == 0){
            ReactContext reactContext = (ReactContext)mReactContext;
            drawTrackModule = new DrawTrackModule(mreactContext, baiduMap, mapView, reactContext);
            drawTrackModule.initTraceService();
            drawTrackModule.startTrace();
        }else if(status == 1){
            drawTrackModule.stopTrace();
        }

    }

    @ReactProp(name="dreaTrackStartTime")
    public void setDrawTrack(MapView mapView, ReadableMap start){
        if(start.getBoolean("start")){
            drawTrackModule.queryHistoryTrack(start.getDouble("startTime"));
        }
    }

    @ReactProp(name="historyTracks")
    public void setHistoryTracks(MapView mapView, ReadableArray historyTracks){
        //同时加入到List中，做绘制
        if(historyTracks.size() == 0){
            return;
        }
        List<LatLng> latLngList = new ArrayList<>();
        for(int i=0; i<historyTracks.size(); i++){
            ReadableMap map = historyTracks.getMap(i);
            double latitude = map.getDouble("latitude");
            double longitude = map.getDouble("longitude");
            LatLng latlng = new LatLng(latitude, longitude);
            latLngList.add(latlng);
        }
        ReactContext reactContext = (ReactContext)mReactContext;
        drawTrackModule = new DrawTrackModule(mreactContext, baiduMap, mapView, reactContext);
        drawTrackModule.drawHistoryTrack(latLngList);
    }

    @Override
    public void onMapLoaded() {

    }

    /**
     *
     * @param eventName
     * @param params
     */
    private void sendEvent(MapView mapView, String eventName, @Nullable WritableMap params) {
        WritableMap event = Arguments.createMap();
        event.putMap("params", params);
        event.putString("type", eventName);
        mReactContext
                .getJSModule(RCTEventEmitter.class)
                .receiveEvent(mapView.getId(),
                        "topChange",
                        event);
    }


}
