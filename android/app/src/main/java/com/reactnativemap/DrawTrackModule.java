package com.reactnativemap;

import android.content.Context;
import android.graphics.Color;
import android.os.Looper;
import android.support.annotation.Nullable;
import android.util.Log;
import android.widget.Toast;

import com.baidu.mapapi.map.BaiduMap;
import com.baidu.mapapi.map.BitmapDescriptor;
import com.baidu.mapapi.map.BitmapDescriptorFactory;
import com.baidu.mapapi.map.MapStatusUpdate;
import com.baidu.mapapi.map.MapStatusUpdateFactory;
import com.baidu.mapapi.map.MapView;
import com.baidu.mapapi.map.MarkerOptions;
import com.baidu.mapapi.map.PolylineOptions;
import com.baidu.mapapi.model.LatLng;
import com.baidu.mapapi.model.LatLngBounds;
import com.baidu.trace.LBSTraceClient;
import com.baidu.trace.Trace;
import com.baidu.trace.api.track.HistoryTrackRequest;
import com.baidu.trace.api.track.HistoryTrackResponse;
import com.baidu.trace.api.track.OnTrackListener;
import com.baidu.trace.api.track.TrackPoint;
import com.baidu.trace.model.OnTraceListener;
import com.baidu.trace.model.PushMessage;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static com.baidu.trace.api.fence.FenceShape.polyline;

/**
 * Created by zachrey on 2017/4/21.
 */

public class DrawTrackModule{
    private static final String RCT_CLASS = "DrawTrackModule";
    private OnTrackListener trackListener;
    private Trace mTrace;
    private LBSTraceClient mTraceClient;
    private OnTraceListener mTraceListener;
    private BaiduMap mBaiduMap;
    private MapStatusUpdate msUpdate;
    private BitmapDescriptor bmStart;
    private BitmapDescriptor bmEnd;
    private MarkerOptions startMarker;
    private MarkerOptions endMarker;
    private PolylineOptions polyline;
    private Context context;
    private MapView mapView;
    private ReactContext mtReactContext;
    public DrawTrackModule(ReactApplicationContext reactContext,BaiduMap mBaiduMap, MapView mapView,ReactContext tReactContext) {
        context = reactContext;
        this.mBaiduMap = mBaiduMap;
        this.mapView =  mapView;
        this.mtReactContext = tReactContext;
    }

    /**
     * 初始化鹰眼服务
     */
    public void initTraceService(){
        // 轨迹服务ID
        long serviceId = 138750;
        // 设备标识
        String entityName = "reactNativeMap";
        // 是否需要对象存储服务，默认为：false，关闭对象存储服务。注：鹰眼 Android SDK v3.0以上版本支持随轨迹上传图像等对象数据，若需使用此功能，该参数需设为 true，且需导入bos-android-sdk-1.0.2.jar。
        boolean isNeedObjectStorage = false;
        if(mTrace == null){
            // 初始化轨迹服务
            mTrace = new Trace(serviceId, entityName, isNeedObjectStorage);
        }
        if(mTraceClient == null){
            // 初始化轨迹服务客户端
            mTraceClient = new LBSTraceClient(context);
            setListener();
        }
        // 定位周期(单位:秒)
        int gatherInterval = 5;
        // 打包回传周期(单位:秒)
        int packInterval = 10;
        // 设置定位和打包周期
        mTraceClient.setInterval(gatherInterval, packInterval);

    }

    /**
     * 设置状态监听
     */
    private void setListener(){
        if(mTraceListener == null){
            // 初始化轨迹服务监听器
            mTraceListener = new OnTraceListener() {
                // 开启服务回调
                @Override
                public void onStartTraceCallback(int status, String message) {
                    Log.i("status", "status:"+status);
                }
                // 停止服务回调
                @Override
                public void onStopTraceCallback(int status, String message) {
                    Log.i("status", "status:"+status);
                }
                // 开启采集回调
                @Override
                public void onStartGatherCallback(int status, String message) {
                    Log.i("status", "status:"+status);
                }
                // 停止采集回调
                @Override
                public void onStopGatherCallback(int status, String message) {
                    Log.i("status", "status:"+status);
                }
                // 推送回调
                @Override
                public void onPushCallback(byte messageNo, PushMessage message) {
                    Log.i("status", "status:"+message);
                }
            };
        }
    }

    //开始鹰眼服务
    public void startTrace(){

        // 开启服务
        mTraceClient.startTrace(mTrace, mTraceListener);
        // 开启采集
        mTraceClient.startGather(mTraceListener);

    }
    //停止鹰眼服务
    public void stopTrace(){
        // 停止服务
        if(mTrace != null && mTraceListener != null){
            mTraceClient.stopTrace(mTrace, mTraceListener);
            mTrace = null;
            // 停止采集
            mTraceClient.stopGather(mTraceListener);
            mTraceListener = null;
        }

    }


    /**
     * 查询历史轨迹
     */
    public void queryHistoryTrack(double startTraceTime) {

        // 请求标识
        int tag = 1;
        // 轨迹服务ID
        long serviceId = 138750;
        // 设备标识
        String entityName = "reactNativeMap";
        // 创建历史轨迹请求实例
        HistoryTrackRequest historyTrackRequest = new HistoryTrackRequest(tag, serviceId, entityName);

        // 开始时间(单位：秒)
        long startTime = (long) startTraceTime / 1000;
        // 结束时间(单位：秒)
        long endTime = System.currentTimeMillis() / 1000;
        // 设置开始时间
        historyTrackRequest.setStartTime(startTime);
        // 设置结束时间
        historyTrackRequest.setEndTime(endTime);

        trackListener = new OnTrackListener() {
            @Override
            public void onHistoryTrackCallback(HistoryTrackResponse historyTrackResponse) {
                super.onHistoryTrackCallback(historyTrackResponse);
                List<TrackPoint> data = historyTrackResponse.getTrackPoints();
                double distance = historyTrackResponse.getDistance();
                showHistoryTrack(data, distance);
            }
        };

        mTraceClient.queryHistoryTrack(historyTrackRequest, trackListener);
    }

    /**
     * 显示历史轨迹
     */
    public void showHistoryTrack(List<TrackPoint> TrackPoints, double distance) {
        /**
         * 将List<LatLng>转换为json对象，返回给js。
         */
        WritableMap writableMap = Arguments.createMap();
        writableMap.putDouble("distance", distance);
        WritableArray positions = Arguments.createArray();
        //同时加入到List中，做绘制
        List<LatLng> latLngList = new ArrayList<>();
        if(TrackPoints != null){
            for (TrackPoint trackPoint : TrackPoints) {
                double latitude = trackPoint.getLocation().latitude;
                double longitude = trackPoint.getLocation().longitude;
                LatLng latlng = new LatLng(latitude, longitude);
                latLngList.add(latlng);

                WritableMap position = Arguments.createMap();
                position.putDouble("latitude", latitude);
                position.putDouble("longitude", longitude);

                positions.pushMap(position);
            }
        }
        //中心点
        if(positions.size() == 0){
            //没有轨迹
            writableMap.putString("status", "10");
        }else{
            writableMap.putDouble("centerLat", positions.getMap(0).getDouble("latitude"));
            writableMap.putDouble("centerLng", positions.getMap(0).getDouble("longitude"));
            String str = positions.toString();
            writableMap.putString("TrackPoints", str);
            writableMap.putString("status", "0");
            // 绘制历史轨迹
//            drawHistoryTrack(latLngList);
        }

        //发送事件
        sendEvent(mapView, "onHistoryTrack", writableMap);
    }

    /**
     * 绘制历史轨迹
     *
     * @param points
     */
    public void drawHistoryTrack(final List<LatLng> points) {
        // 绘制新覆盖物前，清空之前的覆盖物
        mBaiduMap.clear();

        if (points == null || points.size() == 0) {
            Looper.prepare();
            Toast.makeText(context, "当前查询无轨迹点", Toast.LENGTH_SHORT).show();
            Looper.loop();
//            resetMarker();
        } else {
            if (points.size() > 1) {

                LatLng llC = points.get(0);
                LatLng llD = points.get(points.size() - 1);
                LatLngBounds bounds = new LatLngBounds.Builder()
                        .include(llC).include(llD).build();

                msUpdate = MapStatusUpdateFactory.newLatLngBounds(bounds);

                bmStart = BitmapDescriptorFactory.fromResource(R.mipmap.marker_start);
                bmEnd = BitmapDescriptorFactory.fromResource(R.mipmap.marker_end);

                // 添加起点图标
                startMarker = new MarkerOptions()
                        .position(points.get(points.size() - 1)).icon(bmStart)
                        .zIndex(9).draggable(true);

                // 添加终点图标
                endMarker = new MarkerOptions().position(points.get(0))
                        .icon(bmEnd).zIndex(9).draggable(true);

                // 添加路线（轨迹）
                polyline = new PolylineOptions();
                polyline.width(10);
                polyline.color(Color.RED);
                polyline.points(points);

                addMarker();

            }
        }

    }

    /**
     * 添加覆盖物
     */
    public void addMarker() {

        if (null != msUpdate) {
            mBaiduMap.setMapStatus(msUpdate);
        }

        if (null != startMarker) {
            mBaiduMap.addOverlay(startMarker);
        }

        if (null != endMarker) {
            mBaiduMap.addOverlay(endMarker);
        }

        if (null != polyline) {
            mBaiduMap.addOverlay(polyline);
        }

    }

    private void sendEvent(MapView mapView, String eventName, @Nullable WritableMap params) {
        WritableMap event = Arguments.createMap();
        event.putMap(eventName, params);
//        event.putString(eventName, "hahahha");
        mtReactContext
                .getJSModule(RCTEventEmitter.class)
                .receiveEvent(mapView.getId(),
                        "topChange",
                        event);
    }
}
