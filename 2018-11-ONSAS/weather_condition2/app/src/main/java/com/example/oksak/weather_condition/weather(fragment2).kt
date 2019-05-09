package com.example.oksak.weather_condition

import retrofit.http.GET
import retrofit.http.Path
import retrofit.http.Query
import rx.Observable

interface `weather` {
    @GET("/data/2.5/{name}")
    operator fun get(@Path("name") name: String, @Query("id") q: String, @Query("units") unit: String, @Query("appid") appid: String): Observable<`Entity`>
}
