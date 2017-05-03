package com.reactnativemap;

import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import com.baidu.mapapi.map.BitmapDescriptor;
import com.baidu.mapapi.map.BitmapDescriptorFactory;
import com.baidu.mapapi.map.InfoWindow;
import com.baidu.mapapi.map.MapView;
import com.baidu.mapapi.map.Marker;
import com.baidu.mapapi.map.MarkerOptions;
import com.baidu.mapapi.map.OverlayOptions;
import com.baidu.mapapi.model.LatLng;
import com.facebook.react.bridge.ReadableMap;

/**
 * Created by lovebing on Sept 28, 2016.
 */
public class MarkerUtil {
//    private static TextView mMarkerText;
//    public  static  InfoWindow infoWindow;


    public static void updateMaker(Marker maker, ReadableMap option) {
        LatLng position = getLatLngFromOption(option);
        maker.setPosition(position);

//        maker.setTitle(option.getString("title"));
    }

    public static Marker addMarker(MapView mapView, ReadableMap option) {

        BitmapDescriptor bitmap = null;
        Boolean startOrEnd = option.getBoolean("startOrEnd");
        if(startOrEnd){
             bitmap = BitmapDescriptorFactory.fromResource(R.mipmap.running);
        }else{
             bitmap = BitmapDescriptorFactory.fromResource(R.mipmap.marker_end);
        }

        LatLng position = getLatLngFromOption(option);
        OverlayOptions overlayOptions = new MarkerOptions()
                .icon(bitmap)
                .position(position)
                .title(option.getString("title"));

//        //文字
//        if(mMarkerText == null) {
//            mMarkerText = new TextView(mapView.getContext());
//            mMarkerText.setBackgroundResource(R.mipmap.popup);
//            mMarkerText.setGravity(Gravity.CENTER_HORIZONTAL);
//            mMarkerText.setPadding(32, 32, 32, 32);
//        }
//
//        mMarkerText.setText(option.getString("title"));
//        infoWindow = new InfoWindow(mMarkerText, position, -80);
//        mMarkerText.setVisibility(View.GONE);
//        mapView.getMap().showInfoWindow(infoWindow);


        //设置marker
        Marker marker = (Marker)mapView.getMap().addOverlay(overlayOptions);
        return marker;
    }


    private static LatLng getLatLngFromOption(ReadableMap option) {
        double latitude = option.getDouble("latitude");
        double longitude = option.getDouble("longitude");
        return new LatLng(latitude, longitude);

    }
}
