package com.reactnativemap;


import com.baidu.mapapi.model.LatLng;


/**
 * Created by baidu on 17/2/9.
 */

public class MapUtil {

    public static LatLng convertTrace2Map(com.baidu.trace.model.LatLng traceLatLng) {
        return new LatLng(traceLatLng.latitude, traceLatLng.longitude);
    }
}

