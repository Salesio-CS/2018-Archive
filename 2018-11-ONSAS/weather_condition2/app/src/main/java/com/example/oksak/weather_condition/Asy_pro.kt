package com.example.oksak.weather_condition

import android.support.v7.app.AppCompatActivity
import com.google.gson.FieldNamingPolicy
import com.google.gson.GsonBuilder
import com.google.gson.internal.bind.DateTypeAdapter
import retrofit.RestAdapter
import retrofit.android.AndroidLog
import retrofit.converter.GsonConverter
import java.util.*

class Asy_pro : AppCompatActivity() {
    var str: String? = null

    fun Asch_rest(): RestAdapter {
        // JSONのパーサー
        val gson = GsonBuilder()
                .setFieldNamingPolicy(FieldNamingPolicy.LOWER_CASE_WITH_UNDERSCORES)
                .registerTypeAdapter(Date::class.java, DateTypeAdapter())
                .create()

        // RestAdapterの生成
        return RestAdapter.Builder()
                .setEndpoint("http://api.openweathermap.org")
                .setConverter(GsonConverter(gson))
                .setLogLevel(RestAdapter.LogLevel.FULL)
                .setLog(AndroidLog("=NETWORK="))
                .build()
    }

    companion object {

        private val TAG = Asy_pro::class.java.simpleName
    }
}