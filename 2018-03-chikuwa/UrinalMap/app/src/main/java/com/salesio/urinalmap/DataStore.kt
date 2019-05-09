package com.salesio.urinalmap

import android.util.Log
import com.google.android.gms.maps.model.LatLng
import java.util.*
import kotlin.collections.ArrayList

class DataStore(startPosition: LatLng) {
    private val Datas: ArrayList<toiletData> = ArrayList()
    private object Constant {
        const val LAT_ONE_METER = 0.000008983148616
        const val LNG_ONE_METER = 0.000010966382364
    }

    init {
        val lat: Double = startPosition.latitude
        val lng: Double = startPosition.longitude

        val latDistance = Constant.LAT_ONE_METER * 10
        val lngDistance = Constant.LNG_ONE_METER * 10

        /*for (i in 0..2) {
            val latLng = LatLng(random(lat - latDistance, lat + latDistance), random(lng - lngDistance, lng + lngDistance))
            val name = "トイレ: " + i.toString()
            data.add(Data(latLng, name))
        }*/

        val toile1:toiletData = toiletData(1,"ローソン＋スリーエフ町田相原駅前店","東京都町田市相原町1158-4",35.6065109,139.329721)
        val toile2:toiletData = toiletData(2,"ファミリーマート町田多摩境店","東京都町田市小山ヶ丘5-1-4",35.6027053,139.3627543)
        val toile3:toiletData = toiletData(3,"セブン-イレブン町田小山ヶ丘４丁目店","東京都町田市小山ヶ丘4-9-2",35.6047285,139.3557771)
        val toile4:toiletData = toiletData(4, "ローソン＋スリーエフ町田相原駅前店", "東京都町田市相原町1158-4", 35.6026535,139.3464083)

        Datas.add(toile1)
        Datas.add(toile2)
        Datas.add(toile3)
        Datas.add(toile4)
    }

    private fun random(min: Double, max: Double): Double {
        val random = Random()
        return min + (max - min) * random.nextDouble()
    }

    private fun isInsideCircle(center: LatLng, point: LatLng, radius: Double): Boolean {
        val cx = center.latitude / Constant.LAT_ONE_METER
        val cy = center.longitude / Constant.LNG_ONE_METER
        val px = point.latitude / Constant.LAT_ONE_METER
        val py = point.longitude / Constant.LNG_ONE_METER
        return (cx - px) * (cx - px) + (cy - py) * (cy - py) <= radius * radius
    }

    fun searchToilet(center: LatLng, radius: Double): ArrayList<toiletData> {
        val buf: ArrayList<toiletData> = ArrayList()
        for (i in Datas) {
            if (isInsideCircle(center, i.latlng, radius)) {
                buf.add(i)
            }
        }
        return buf
    }
}