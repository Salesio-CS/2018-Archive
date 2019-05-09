package com.nh3.proapps.proapp2018;

import android.content.Intent;
import android.content.res.AssetManager;
import android.content.res.Resources;
import android.media.Image;
import android.os.Environment;
import android.support.design.widget.Snackbar;
import android.support.v4.app.FragmentPagerAdapter;
import android.support.v4.view.ViewPager;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.CompoundButton;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import com.github.chrisbanes.photoview.PhotoView;
import com.squareup.picasso.Callback;
import com.squareup.picasso.Picasso;

import java.io.File;
import java.io.IOException;



public class Park_detail extends AppCompatActivity {


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_park_detail);


        Intent show_detail = getIntent();
        String park_name = show_detail.getStringExtra("park_name");
        Toast.makeText(Park_detail.this, park_name, Toast.LENGTH_SHORT).show();

        TextView park_name_area = findViewById(R.id.park_name_area);
        park_name_area.setText(park_name);

        String park_name_e = "a";

        switch (park_name) {
            case "小山白山公園":
                park_name_e = "O_Haku";
                System.out.println("小山白山公園");
                break;
            case "小山田端自然公園":
                park_name_e = "O_Tabatashizen";
                System.out.println("小山田端自然公園");
                break;
            case "小山多摩境公園":
                park_name_e = "O_Tamasakai";
                System.out.println("小山多摩境公園");
                break;
            case "小山上沼公園":
                park_name_e = "O_Kaminuma";
                System.out.println("小山上沼公園");
                break;
            case "三ツ目山公園":
                park_name_e = "Mitsumeyama";
                System.out.println("三ツ目山公園");
                break;
            default:
                break;
        }

        System.out.println(park_name_e);

        switch (park_name_e) {
            case "O_Haku":


                findViewById(R.id.TabataShizen).setVisibility(View.INVISIBLE);
                findViewById(R.id.Tamasakai).setVisibility(View.INVISIBLE);
                findViewById(R.id.Kaminuma).setVisibility(View.INVISIBLE);
                findViewById(R.id.Mitsume).setVisibility(View.INVISIBLE);
                break;
            case "O_Tabatashizen":

                findViewById(R.id.Haku).setVisibility(View.INVISIBLE);
                findViewById(R.id.Tamasakai).setVisibility(View.INVISIBLE);
                findViewById(R.id.Kaminuma).setVisibility(View.INVISIBLE);
                findViewById(R.id.Mitsume).setVisibility(View.INVISIBLE);
                break;
            case "O_Tamasakai":

                findViewById(R.id.Haku).setVisibility(View.INVISIBLE);
                findViewById(R.id.TabataShizen).setVisibility(View.INVISIBLE);
                findViewById(R.id.Kaminuma).setVisibility(View.INVISIBLE);
                findViewById(R.id.Mitsume).setVisibility(View.INVISIBLE);
                break;
            case "O_Kaminuma":

                findViewById(R.id.Haku).setVisibility(View.INVISIBLE);
                findViewById(R.id.TabataShizen).setVisibility(View.INVISIBLE);
                findViewById(R.id.Tamasakai).setVisibility(View.INVISIBLE);
                findViewById(R.id.Mitsume).setVisibility(View.INVISIBLE);
                break;
            case "Mitsumeyama":

                findViewById(R.id.Haku).setVisibility(View.INVISIBLE);
                findViewById(R.id.TabataShizen).setVisibility(View.INVISIBLE);
                findViewById(R.id.Tamasakai).setVisibility(View.INVISIBLE);
                findViewById(R.id.Kaminuma).setVisibility(View.INVISIBLE);
                break;
            default:
                break;
        }


        Toast.makeText(Park_detail.this, park_name, Toast.LENGTH_SHORT).show();

        AssetManager assetManager = getResources().getAssets();
        String[] fileList = null;
        try {
            fileList = assetManager.list(park_name_e);
        } catch (IOException e) {
            e.printStackTrace();
        }

        Resources res = getResources();

        for (int i = 0; i < 5; i++) {
            try {
                StringBuffer imgload_link_buf0 = new StringBuffer();
                imgload_link_buf0.append("file:///android_asset/");
                imgload_link_buf0.append(park_name_e);
                imgload_link_buf0.append("/");
                imgload_link_buf0.append(fileList[i]);
                String imgload_link = imgload_link_buf0.toString();

                System.out.println(imgload_link);

                String resViewName = "park_img" + i;
                int viewId = res.getIdentifier(resViewName, "id", getPackageName());

                ImageView img = findViewById(viewId);

                int return_code = load_img(img, imgload_link, i);
            } catch (Exception e) {
                System.out.println(e);
                break;
            }

        }



    }

    private int load_img(final ImageView img, String imgload_link, final int no) {

        Picasso.with(Park_detail.this)
                .load(imgload_link)
                .fit()
                .into(img, new Callback() {
                    @Override
                    public void onSuccess() {
                        System.out.println("ImageLoad Success. No " + no);
                    }

                    @Override
                    public void onError() {
                        System.out.println("ImageLoad Error. No " + no);
                    }
                });
        return 0;
    }
}