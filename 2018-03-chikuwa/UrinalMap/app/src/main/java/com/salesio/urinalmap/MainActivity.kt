package com.salesio.urinalmap
//package com.amazonaws.models.nosql

import android.content.Intent
import android.graphics.Point
import android.os.Bundle
import android.support.v4.app.FragmentActivity
import android.view.MotionEvent
import com.google.android.gms.maps.*
import com.google.android.gms.maps.model.*
import kotlinx.android.synthetic.main.activity_main.*
import com.amazonaws.mobile.client.AWSMobileClient
import com.amazonaws.mobileconnectors.dynamodbv2.dynamodbmapper.DynamoDBMapper
import com.amazonaws.mobileconnectors.dynamodbv2.dynamodbmapper.DynamoDBQueryExpression
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClient
import com.amazonaws.services.dynamodbv2.model.AttributeValue
import com.amazonaws.services.dynamodbv2.model.ComparisonOperator
import com.salesio.urinalmap.amazonaws.models.nosql.ObenkiDetailDO
import kotlin.concurrent.thread


class MainActivity : FragmentActivity(), OnMapReadyCallback{
    private val START_POSITION = LatLng(35.6026535,139.3464083)
    private lateinit var camera: CameraUpdate
    private lateinit var mMap:GoogleMap
    private var isMove: Boolean = true
    private val vc = ViewController(START_POSITION)
    private var dynamoDBMapper: DynamoDBMapper? = null
    private var toilet:ObenkiDetailDO? = null

    companion object {
        private val TAG: String = this::class.java.simpleName
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        AWSMobileClient.getInstance().initialize(this) {
            //Log.d(TAG, "AWSMobileClient is initialized")
        }.execute()

        val credentialsProvider = AWSMobileClient.getInstance().credentialsProvider
        val configuration = AWSMobileClient.getInstance().configuration

        val client = AmazonDynamoDBClient(credentialsProvider)
        dynamoDBMapper = DynamoDBMapper.builder()
                .dynamoDBClient(client)
                .awsConfiguration(AWSMobileClient.getInstance().configuration)
                .build()

        fun readNews(userId: Double, callback: (ObenkiDetailDO?) -> Unit) {
            thread(start = true) {
                var Toilet = dynamoDBMapper?.load(ObenkiDetailDO::class.java,
                        userId)
                runOnUiThread { callback(Toilet) }
            }
        }

        //readNews(2.0,{toilet2 -> toilet = toilet2})

        if(toilet != null) {
           // Log.d("AWSstat", toilet?.address)
        }
        setContentView(R.layout.activity_main)

        val mapFragment: SupportMapFragment = supportFragmentManager.findFragmentById(R.id.map) as SupportMapFragment
        tou.setOnTouchListener { v, event ->
            when (event?.action) {
                MotionEvent.ACTION_DOWN ->
                    if (!isMove) {
                        onTouchDown(event)
                    }
                MotionEvent.ACTION_MOVE ->
                    if (!isMove) {
                        onTouchMove(event)
                    }
                MotionEvent.ACTION_UP ->
                    if (!isMove) {
                        onTouchUP(event)
                    }
            }

            v?.onTouchEvent(event) ?: true
        }

        button.setOnClickListener {
            isMove = !isMove
            buttonClickable(isMove)
        }
        mapFragment.getMapAsync(this)
    }

    override fun onMapReady(map: GoogleMap) {
        // マーカーをつけるなどの処理を記述する？ところなのかな
        mMap = map
        val pos = CameraPosition(START_POSITION, 18.toFloat(), 0.toFloat(), 0.toFloat())
        camera = CameraUpdateFactory.newCameraPosition(pos)
        mMap.moveCamera(camera)
        mMap.setOnMarkerClickListener {
            val intent = Intent(this, ToiletStatusActivity::class.java)
            intent.putExtra("PLACE_NAME", it.title)
            startActivity(intent)
            return@setOnMarkerClickListener true
        }
    }

    private fun onTouchDown(event: MotionEvent) {
        vc.setCenterPoint(mMap, Point(event.x.toInt(), event.y.toInt()))
    }

    private fun onTouchMove(event: MotionEvent) {
        vc.updateCircle(mMap, Point(event.x.toInt(), event.y.toInt()))
    }

    private fun onTouchUP(event: MotionEvent) {
        vc.removeMarker()
        for (i in vc.updateCircle(mMap, Point(event.x.toInt(), event.y.toInt()), true)) {
            vc.addMarker(mMap, i)
        }
        isMove = !isMove
        buttonClickable(isMove)
    }

    private fun buttonClickable(isMove: Boolean) {
        if (isMove) {
            button.text = getString(R.string.move)
            tou.isClickable = false
        } else {
            button.text = getString(R.string.search)
            tou.isClickable = true
        }
    }
}
