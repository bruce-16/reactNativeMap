package com.reactnativemap;

import android.support.annotation.Nullable;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

/**
 * Created by zachrey on 2017/4/18.
 */

public class ReactWebViewManager  extends SimpleViewManager<WebView> {
    public  static  final  String REACT_Class = "RCTWebView";
    @Override
    public String getName() {
        return REACT_Class;
    }

    @Override
    protected WebView createViewInstance(ThemedReactContext reactContext) {
        WebView webView= new WebView(reactContext);
        webView.setWebViewClient(new WebViewClient(){
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                view.loadUrl(url);
                return true;
            }
        });
        return webView;
    }

    @ReactProp(name="url")
    public  void setUrl(WebView view, @Nullable String url) {
        view.loadUrl(url);
    }

    @ReactProp(name="html")
    public  void setHtml(WebView view, @Nullable String html) {
        view.loadData(html,"text/html; charset=utf-8", "UTF-8");
    }
}
