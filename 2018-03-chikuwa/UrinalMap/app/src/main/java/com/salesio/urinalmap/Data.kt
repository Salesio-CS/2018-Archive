package com.salesio.urinalmap

import com.google.android.gms.maps.model.LatLng

class Data(latLng: LatLng, name: String) {
    val mLatLng: LatLng
    val mName: String

    init {
        mLatLng = latLng
        mName = name
    }
}