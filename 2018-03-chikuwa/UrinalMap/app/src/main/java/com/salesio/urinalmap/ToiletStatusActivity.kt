package com.salesio.urinalmap

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.os.Bundle
import android.support.v7.app.ActionBarActivity
import android.support.v7.app.AppCompatActivity
import android.util.AttributeSet
import android.view.MenuItem
import android.view.View
import com.github.mikephil.charting.animation.Easing
import com.github.mikephil.charting.components.Description
import com.github.mikephil.charting.components.XAxis
import com.github.mikephil.charting.interfaces.datasets.IBarDataSet
import com.github.mikephil.charting.utils.ColorTemplate
import kotlinx.android.synthetic.main.toilet_status.*
import com.github.mikephil.charting.components.YAxis
import com.github.mikephil.charting.formatter.IndexAxisValueFormatter
import java.lang.reflect.Array
import com.github.mikephil.charting.formatter.PercentFormatter
import java.util.Arrays.asList
import com.github.mikephil.charting.components.Legend
import com.github.mikephil.charting.data.*
import com.github.mikephil.charting.formatter.IValueFormatter
import com.github.mikephil.charting.interfaces.datasets.IPieDataSet
import java.util.*
import kotlin.collections.ArrayList


class ToiletStatusActivity: AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.toilet_status)

        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        supportActionBar?.title = "トイレ情報"

        place.text = intent.getStringExtra("PLACE_NAME")

        setupCongestion()
        setupClean()
        setupEquipment()

        do_eva.setOnClickListener {
            val intent = Intent(this, EnqueteActivity::class.java)
            startActivity(intent)
        }
    }

    fun setupCongestion() {
        val chart = bar_chart

        val left = chart.axisLeft
        left.axisMinimum = 0f
        left.axisMaximum = 250f
        left.labelCount = 5
        left.setDrawTopYLabelEntry(true)

        val right = chart.axisRight
        right.setDrawLabels(false)
        right.setDrawGridLines(false)
        right.setDrawZeroLine(true)
        right.setDrawTopYLabelEntry(true)

        val labels = arrayOf("", "5~10時", "10~18時", "18~23時", "23~5時")
        val bottomAxis: XAxis = chart.xAxis
        bottomAxis.position = XAxis.XAxisPosition.BOTTOM
        bottomAxis.setDrawLabels(true)
        bottomAxis.setDrawGridLines(false)
        bottomAxis.setDrawAxisLine(true)
        bottomAxis.granularity = 1f
        bottomAxis.valueFormatter = IndexAxisValueFormatter(labels)

        chart.setDrawValueAboveBar(true)
        chart.description.isEnabled = false
        chart.isClickable = false

        chart.legend.isEnabled = false
        chart.setScaleEnabled(false)

        chart.data = BarData(getBarData())
    }

    fun setupClean() {
        circle_clean.setUsePercentValues(true)

        circle_clean.description = Description().apply {
            text = "綺麗さについて"
        }

        circle_clean.isClickable = false

        circle_clean.legend.verticalAlignment = Legend.LegendVerticalAlignment.BOTTOM
        circle_clean.legend.horizontalAlignment = Legend.LegendHorizontalAlignment.CENTER
        circle_clean.setDrawSliceText(false)

        circle_clean.data = PieData(circleCleanData()).apply {
            this.setValueFormatter(PercentFormatter())
            this.setValueTextSize(15f)
            this.setValueTextColor(Color.BLACK)
        }
    }

    fun setupEquipment() {
        circle_equipment.setUsePercentValues(true)

        circle_equipment.description = Description().apply {
            text = "備品について"
        }
        circle_equipment.isClickable = false

        circle_equipment.legend.verticalAlignment = Legend.LegendVerticalAlignment.BOTTOM
        circle_equipment.legend.horizontalAlignment = Legend.LegendHorizontalAlignment.CENTER
        circle_equipment.setDrawSliceText(false)

        circle_equipment.data = PieData(circleEquipmentData()).apply {
            this.setValueFormatter(PercentFormatter())
            this.setValueTextSize(15f)
            this.setValueTextColor(Color.BLACK)
        }
    }

    fun getBarData(): ArrayList<IBarDataSet> {
        val entries = ArrayList<BarEntry>().apply {
            add(BarEntry(1f, 100f))
            add(BarEntry(2f, 20f))
            add(BarEntry(3f, 10f))
            add(BarEntry(4f, 120f))
        }

        val dataSet = BarDataSet(entries, "bar").apply {
            //ハイライトさせない
            isHighlightEnabled = false
            //Barの色をセット

            val color = intArrayOf(R.color.material_grey_850, R.color.material_grey_850, R.color.material_grey_850, R.color.material_grey_850)
            setColors(color, this@ToiletStatusActivity)
        }
        val bars = ArrayList<IBarDataSet>()
        bars.add(dataSet)
        return bars
    }

    fun circleCleanData(): IPieDataSet {
        val entries = ArrayList<PieEntry>().apply {
            add(PieEntry(1f, "綺麗"))
            add(PieEntry(2f, "汚い"))
        }
        val dataSet = PieDataSet(entries, "").apply {
            isHighlightEnabled = false
            val colors = ArrayList<Int>()
            for (c in ColorTemplate.COLORFUL_COLORS) {
                colors.add(c)
            }
            setColors(colors)
        }
        //dataSet.setDrawValues(true)

        return dataSet
    }

    fun circleEquipmentData(): PieDataSet {
        val entries = ArrayList<PieEntry>().apply {
            add(PieEntry(2f, "揃っている"))
            add(PieEntry(1f, "揃っていない"))
        }
        val dataSet = PieDataSet(entries, "").apply {
            isHighlightEnabled = false
            val colors = ArrayList<Int>()
            for (c in ColorTemplate.COLORFUL_COLORS) {
                colors.add(c)
            }
            setColors(colors)
        }
        //dataSet.setDrawValues(true)

        return dataSet
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        when (item.itemId) {
            android.R.id.home -> {
                finish()
                return true
            }
        }
        return super.onOptionsItemSelected(item)
    }
}