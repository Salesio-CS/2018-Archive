package com.example.oksak.weather_condition

class Japanese_changer {
    var str: String? =null

    inline fun <T> block(body: () -> T):T{
        return body()
    }


    fun main_weather(name: String?): String?=block{
        when (name) {
            "Clear" -> str = "晴れ"
            "Clouds" -> str = "曇り"
            "Rain" -> str = "雨"
            "Snow" -> str = "雪"
            "Thunderstorm" -> str = "雷"
            "Mist" -> str = "霧"
            else -> str = name
        }
        str
    }

    fun description(name: String?): String? = block {
        when (name) {
            "thunderstorm with light rain" -> str = "雷を伴った小雨"
            "thunderstorm with rain" -> str = "雷雨"
            "thunderstorm with heavy rain" -> str = "強い雷雨"
            "light thunderstorm" -> str = "弱い雷"
            "thunderstorm" -> str = "雷"
            "heavy thunderstorm" -> str = "強い雷"
            "ragged thunderstorm" -> str = "時々雷"
            "thunderstorm with light drizzle" -> str = "雷を伴った弱い霧雨"
            "thunderstorm with heavy drizzle" -> str = "雷を伴った強い霧雨"
            "light intensity drizzle" -> str = "弱い霧雨"
            "drizzle" -> str = "霧雨"
            "heavy intensity drizzle" -> str = "強い霧雨"
            "light intensity drizzle rain" -> str = "弱い雨と霧雨"
            "drizzle rain" -> str = "霧雨と雨"
            "heavy intensity drizzle rain" -> str = "強い雨と霧雨"
            "shower rain and drizzle" -> str = "にわか雨と霧雨"
            "heavy intensity rain and drizzle" -> str = "強いにわか雨と霧雨"
            "shower drizzle" -> str = "にわか霧雨"
            "light rain" -> str = "小雨"
            ",moderate rain" -> str = "雨"
            "heavy intensity rain" -> str = "強い雨"
            "very heavy rain" -> str = "非常に激しい雨"
            "extreme rain" -> str = "猛烈な雨"
            "freezing rain" -> str = "雨氷"
            "light intensity shower rain" -> str = "弱いにわか雨"
            "shower rain" -> str = "にわか雨"
            "heavy intensity shower rain" -> str = "強いにわか雨"
            "ragged shower rain" -> str = "時々にわか雨"
            "light snow" -> str = "小雪"
            "snow" -> str = "雪"
            "heavy snow" -> str = "強い雪"
            "sleet" -> str = "凍雨"
            "shower sleet" -> str = "にわか凍雨"
            "light rain and snow" -> str = "弱いみぞれ"
            "rain and snow" -> str = "みぞれ"
            "light shower snow" -> str = "弱いにわか雪"
            "shower snow" -> str = "にわか雪"
            "heavy shower snow" -> str = "強いにわか雪"
            "mist" -> str = "もや"
            "smoke" -> str = "煙"
            "haze" -> str = "煙霧"
            "sand,dust whirls" -> str = "砂塵旋風"
            "fog" -> str = "霧"
            "sand" -> str = "降砂"
            "dust" -> str = "降塵"
            "volcanic ash" -> str = "降灰"
            "squalls" -> str = "スコール"
            "tornado" -> str = "竜巻"
            "clear sky" -> str = "快晴"
            "few clouds" -> str = "多少の雲あり"
            "scattered clouds" -> str = "千切れ雲"
            "broken clouds" -> str = "雲がち"
            "overcast clouds" -> str = "曇り"
            else -> str = name
        }
        str
    }
}
