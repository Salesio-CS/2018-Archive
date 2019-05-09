package com.salesio.urinalmap

import com.google.android.gms.maps.model.LatLng
import java.util.*

class toiletData(iId: Int,iName: String,iAddress: String,iLatitude: Double,iLongitude: Double) {
    var id:Int = -1
    lateinit var name:String
    lateinit var address:String
    var latitude:Double = 0.0
    var longitude:Double = 0.0
    lateinit var latlng:LatLng

    init{
        this.id = iId
        this.name = iName
        this.address = iAddress
        this.latitude = iLatitude
        this.longitude = iLongitude
        this.latlng = LatLng(latitude,longitude)
    }

    /*toiletData[] returnToiletList(){

    }*/
}
