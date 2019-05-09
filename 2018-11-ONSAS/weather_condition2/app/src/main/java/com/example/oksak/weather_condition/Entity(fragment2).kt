package com.example.oksak.weather_condition

class `Entity` {
    var base: String? = null
    var weather: List<Weather>? = null
    var main : Main? = null

    inner class Weather {
        var id: Int = 0
        var main: String? = null
        var description: String? = null
        var icon: String? = null
    }
    inner class Main{
        var temp: Float? = null
        var pressure: Int = 0
        var humidity: Int = 0
        var temp_min: Float? = null
        var temp_max: Float? = null
    }
}
