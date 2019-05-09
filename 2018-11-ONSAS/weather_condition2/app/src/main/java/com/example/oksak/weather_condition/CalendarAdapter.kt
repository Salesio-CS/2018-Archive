package com.example.oksak.weather_condition

import android.content.Context
import android.graphics.Color
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.AbsListView
import android.widget.BaseAdapter
import android.widget.LinearLayout
import android.widget.TextView

import java.text.SimpleDateFormat
import java.util.ArrayList
import java.util.Date
import java.util.Locale

class CalendarAdapter(private val mContext: Context) : BaseAdapter() {
    private var dateArray: List<Date> = ArrayList()
    private val mDateManager: DateManager
    private val mLayoutInflater: LayoutInflater

    //表示月を取得
    val title: String
        get() {
            val format = SimpleDateFormat("yyyy.MM", Locale.US)
            return format.format(mDateManager.mCalendar.time)
        }

    //カスタムセルを拡張したらここでWigetを定義
    private class ViewHolder {
        var dateText: TextView? = null
    }

    init {
        mLayoutInflater = LayoutInflater.from(mContext)
        mDateManager = DateManager()
        dateArray = mDateManager.days
    }

    override fun getCount(): Int {
        return dateArray.size
    }

    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
        var convertView = convertView
        val holder: ViewHolder
        if (convertView == null) {
            convertView = mLayoutInflater.inflate(R.layout.calendar_cell, null)
            holder = ViewHolder()
            holder.dateText = convertView!!.findViewById(R.id.dateText)
            convertView.tag = holder
        } else {
            holder = convertView.tag as ViewHolder
        }

        //セルのサイズを指定
        val dp = mContext.resources.displayMetrics.density
        val params = AbsListView.LayoutParams(parent.width / 7 - dp.toInt(), (parent.height - dp.toInt() * mDateManager.weeks) / mDateManager.weeks)
        convertView.layoutParams = params

        //日付のみ表示させる
        val dateFormat = SimpleDateFormat("d", Locale.US)
        holder.dateText!!.text = dateFormat.format(dateArray[position])

        //当月以外のセルをグレーアウト
        if (mDateManager.isCurrentMonth(dateArray[position])) {
            convertView.setBackgroundColor(Color.WHITE)
        } else {
            convertView.setBackgroundColor(Color.LTGRAY)
        }

        //日曜日を赤、土曜日を青に
        val colorId: Int
        when (mDateManager.getDayOfWeek(dateArray[position])) {
            1 -> colorId = Color.RED
            7 -> colorId = Color.BLUE

            else -> colorId = Color.BLACK
        }
        holder.dateText!!.setTextColor(colorId)

        return convertView
    }

    override fun getItemId(position: Int): Long {
        return 0
    }

    override fun getItem(position: Int): Any? {
        return null
    }

    //翌月表示
    fun nextMonth() {
        mDateManager.nextMonth()
        dateArray = mDateManager.days
        this.notifyDataSetChanged()
    }

    //前月表示
    fun prevMonth() {
        mDateManager.prevMonth()
        dateArray = mDateManager.days
        this.notifyDataSetChanged()
    }
}
