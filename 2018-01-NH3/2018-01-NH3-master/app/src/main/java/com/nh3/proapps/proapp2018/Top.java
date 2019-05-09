package com.nh3.proapps.proapp2018;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.HandlerThread;
import android.os.Looper;
import android.os.StrictMode;
import android.support.design.widget.Snackbar;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.TextView;

import com.github.chrisbanes.photoview.PhotoView;
import com.squareup.picasso.Callback;
import com.squareup.picasso.Picasso;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URL;

public class Top extends AppCompatActivity {

    private ProgressBar progressBar;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_top);

        ImageView go_detail = findViewById(R.id.pin);


        go_detail.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent detail = new Intent(getApplication(), Map_view.class);
                startActivity(detail);
            }
        });

        //load_map();

        new Handler(Looper.getMainLooper()).post(new Runnable() {
            @Override
            public void run() {
                progressBar = findViewById(R.id.progressbar);
                progressBar.setVisibility(ProgressBar.VISIBLE);
                final PhotoView map_view = findViewById(R.id.map);
                /*
                Picasso.with(Top.this)
                        .load("file:///android_asset/map.png")
                        .centerInside()
                        .fit()
                        .into(map_view, new Callback() {
                            @Override
                            public void onSuccess() {
                                progressBar.setVisibility(ProgressBar.INVISIBLE);
                            }

                            @Override
                            public void onError() {
                                progressBar.setVisibility(ProgressBar.INVISIBLE);
                                Snackbar.make(map_view, "ERROR. Can't load map.", Snackbar.LENGTH_SHORT).show();
                            }
                        });
                        */
            }
        });



    }

}

