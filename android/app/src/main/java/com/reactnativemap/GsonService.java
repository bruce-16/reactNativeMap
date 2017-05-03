package com.reactnativemap;

import com.google.gson.Gson;

public class GsonService {

    public static <T> T parseJson(String jsonString, Class<T> clazz) {
        T t = null;
        try {
            Gson gson = new Gson();
            t = gson.fromJson(jsonString, clazz);
        } catch (Exception e) {
            // TODO: handle exception
            System.out.println("解析json失败");
        }
        return t;

    }
}
