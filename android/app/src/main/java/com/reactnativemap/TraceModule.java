package com.reactnativemap;

import android.util.Log;

import com.baidu.trace.LBSTraceClient;
import com.baidu.trace.Trace;
import com.baidu.trace.api.track.HistoryTrackRequest;
import com.baidu.trace.api.track.HistoryTrackResponse;
import com.baidu.trace.api.track.OnTrackListener;
import com.baidu.trace.api.track.QueryCacheTrackResponse;
import com.baidu.trace.model.OnTraceListener;
import com.baidu.trace.model.PushMessage;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;

/**
 * Created by zachrey on 2017/4/20.
 */

public class TraceModule extends BaseModule {
    private static final String RCT_CLASS = "TraceModule";
    private Trace mTrace;
    private LBSTraceClient mTraceClient;
    private OnTraceListener mTraceListener;

    public TraceModule(ReactApplicationContext reactContext) {
        super(reactContext);
        //Base里面的context
        context = reactContext;
    }

    @Override
    public String getName() {
        return RCT_CLASS;
    }

    /**
     * 初始化鹰眼服务
     */
    private void initTraceService(){
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

    /**
     * 初始化服务
     */
    @ReactMethod
    public void init(){
        initTraceService();
    }
    /**
     * 开始鹰眼追踪服务
     */
    @ReactMethod
    public void startTrace(){

        // 开启服务
        mTraceClient.startTrace(mTrace, mTraceListener);
        // 开启采集
        mTraceClient.startGather(mTraceListener);

    }

    /**
     * 停止鹰眼追踪服务
     */
    @ReactMethod
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
     * 查询轨迹
     */
    @ReactMethod
    public void getTraces(double startTraceTime){
        // 请求标识
        int tag = 1;
        // 轨迹服务ID
        long serviceId = 138750;
        // 设备标识
        String entityName = "reactNativeMap";
        // 创建历史轨迹请求实例
        HistoryTrackRequest historyTrackRequest = new HistoryTrackRequest(tag, serviceId, entityName);

        //设置轨迹查询起止时间/   这里的时间应该由js传入过来
        // 开始时间(单位：秒)
        long startTime = (long)startTraceTime / 1000 - 12 * 60 * 60;
        // 结束时间(单位：秒)
        long endTime = System.currentTimeMillis() / 1000;
        // 设置开始时间
        historyTrackRequest.setStartTime(startTime);
        // 设置结束时间
        historyTrackRequest.setEndTime(endTime);


        // 初始化轨迹监听器
        OnTrackListener mTrackListener = new OnTrackListener() {
            // 历史轨迹回调
            @Override
            public void onHistoryTrackCallback(HistoryTrackResponse response) {
                //这里将数据，返回给js，然后由js传入地图做展示？
                WritableMap params = Arguments.createMap();
                params.putDouble("distance", response.getDistance());
                params.putDouble("speed", response.getEndPoint().getSpeed());
                sendEvent("onHistoryTrackCallback", params);
            }

            public void onQueryHistoryTrackCallback(String message) {
                Log.i("Tag", message);
                // 解析并保存轨迹信息
            }
        };

        // 查询历史轨迹
        mTraceClient.queryHistoryTrack(historyTrackRequest, mTrackListener);

    }

}
