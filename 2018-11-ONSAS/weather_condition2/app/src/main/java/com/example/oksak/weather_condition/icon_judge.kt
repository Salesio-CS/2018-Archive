package com.example.oksak.weather_condition

class icon_judge {
    var int:Int=R.drawable.clear

    inline fun <T> block(body: () -> T):T{
        return body()
    }

    fun icon_judger(name:String?): Int=block{
        when(name){
            "Clear" -> int = R.drawable.clear
            "Clouds" -> int = R.drawable.cloud
            "Rain" -> int = R.drawable.rain
            "Thunderstorm" -> int = R.drawable.thunderstorm
        }
        int
    }
}