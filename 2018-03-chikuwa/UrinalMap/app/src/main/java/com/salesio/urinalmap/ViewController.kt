package com.salesio.urinalmap

import android.graphics.Point
import android.location.Location
import com.google.android.gms.maps.GoogleMap
import com.google.android.gms.maps.model.*

class ViewController(startPosition: LatLng) {
    private val mMarker: ArrayList<Marker> = ArrayList()
    private var beforeCircle: Circle? = null
    private lateinit var center: Location
    private val ds: DataStore = DataStore(startPosition)

    fun addMarker(map: GoogleMap, data: toiletData) {
        val marker = map.addMarker(MarkerOptions()
                .position(data.latlng)
                .title(data.name))
        mMarker.add(marker)
    }

    fun removeMarker() {
        mMarker.map { it.remove() }
        mMarker.removeAll(mMarker)
    }

    fun setCenterPoint(map: GoogleMap, point: Point) {
        val latLng = map.projection.fromScreenLocation(point)
        center = Location("center")
        center.latitude = latLng.latitude
        center.longitude = latLng.longitude
    }

    fun updateCircle(map: GoogleMap, point: Point, isSearch: Boolean = false): ArrayList<toiletData> {
        val latLng: LatLng = map.projection.fromScreenLocation(point)
        val location: Location = Location("this").apply {
            latitude = latLng.latitude
            longitude = latLng.longitude
        }
        addCircle(map, LatLng(center.latitude, center.longitude), center.distanceTo(location).toDouble())
        if (isSearch)
            return searchToilet(location)
        return ArrayList()
    }

    private fun searchToilet(location: Location): ArrayList<toiletData> {
        return ds.searchToilet(LatLng(center.latitude, center.longitude), center.distanceTo(location).toDouble())
    }

    private fun addCircle(map: GoogleMap, latLng: LatLng, radius:Double) {
        val option: CircleOptions = CircleOptions().center(latLng).radius(radius)
        if (beforeCircle != null) {
            beforeCircle!!.remove()
        }
        beforeCircle = map.addCircle(option)
    }
}