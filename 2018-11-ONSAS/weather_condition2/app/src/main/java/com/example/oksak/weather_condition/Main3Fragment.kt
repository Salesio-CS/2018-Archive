package com.example.oksak.weather_condition

import android.os.Bundle
import android.support.v4.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.support.v7.app.AppCompatActivity
import android.widget.Button
import android.widget.GridView
import android.widget.TextView
import android.app.Activity

class Main3Fragment : Fragment(){

    private var titleText: TextView? = null
    private var prevButton: Button? = null
    private var nextButton: Button? = null
    private var mCalendarAdapter: CalendarAdapter? = null
    private var calendarGridView: GridView? = null

    override fun onCreateView(inflater: LayoutInflater?, container: ViewGroup?, savedInstanceState: Bundle?): View? {

        val v = inflater!!.inflate(R.layout.fragment_main3, container, false)

        titleText = v.findViewById(R.id.titleText)
        prevButton = v.findViewById(R.id.prevButton)
        prevButton!!.setOnClickListener {
            mCalendarAdapter!!.prevMonth()
            titleText!!.text = mCalendarAdapter!!.title
        }
        nextButton = v.findViewById(R.id.nextButton)
        nextButton!!.setOnClickListener {
            mCalendarAdapter!!.nextMonth()
            titleText!!.text = mCalendarAdapter!!.title
        }
        calendarGridView = v.findViewById(R.id.calendarGridView)
        mCalendarAdapter = CalendarAdapter(activity)
        calendarGridView!!.adapter = mCalendarAdapter
        titleText!!.text = mCalendarAdapter!!.title
        return v
    }

    override fun onViewCreated(view: View?, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)


    }
}