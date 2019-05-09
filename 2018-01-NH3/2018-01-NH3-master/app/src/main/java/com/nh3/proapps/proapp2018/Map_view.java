package com.nh3.proapps.proapp2018;

import android.Manifest;
import android.app.FragmentTransaction;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.os.StrictMode;
import android.support.design.widget.Snackbar;
import android.support.v4.app.ActivityCompat;
import android.support.v4.app.FragmentActivity;
import android.support.v4.content.ContextCompat;
import android.view.View;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.gms.common.api.PendingResult;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.MapFragment;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.model.BitmapDescriptorFactory;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;
import com.google.android.gms.maps.model.PolylineOptions;
import com.google.maps.DirectionsApi;
import com.google.maps.GeoApiContext;
import com.google.maps.model.DirectionsResult;
import com.google.maps.model.DirectionsRoute;
import com.google.maps.model.TravelMode;
import com.squareup.picasso.Callback;
import com.squareup.picasso.Picasso;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.Locale;
import java.util.Map;

public class Map_view extends FragmentActivity implements OnMapReadyCallback {

    private GoogleMap mMap;
    public String park_name, d_park_name;
    public int tap = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_map_view);


        // MapFragmentの生成
        MapFragment mapFragment = MapFragment.newInstance();

        // MapViewをMapFragmentに変更する
        FragmentTransaction fragmentTransaction =
                getFragmentManager().beginTransaction();
        fragmentTransaction.add(R.id.mapView, mapFragment);
        fragmentTransaction.commit();

        mapFragment.getMapAsync(this);
        StrictMode.setThreadPolicy(new StrictMode.ThreadPolicy.Builder().permitAll().build());


        Bitmap reload_bit, reload_bit_resize;
        reload_bit = BitmapFactory.decodeResource(getResources(), R.drawable.reload);
        reload_bit_resize = Bitmap.createScaledBitmap(reload_bit, 80, 80, false);
        ImageButton reload_weather =findViewById(R.id.reload_weather);
        reload_weather.setImageBitmap(reload_bit_resize);

        reload_weather.setOnClickListener(new View.OnClickListener() {
            public void onClick(View view) {
                get_weather();
            }
        });

        get_weather();

    }

    @Override
    public void onMapReady(GoogleMap googleMap) {
        mMap = googleMap;
        Bitmap pin_bit, pin_bit_resize;

        pin_bit = BitmapFactory.decodeResource(getResources(), R.drawable.pin_park);
        pin_bit_resize = Bitmap.createScaledBitmap(pin_bit, 100, 100, false);


        // Latitude / longitude specification of each pin
        LatLng pin_O_Haku = new LatLng(35.602263, 139.363947);
        LatLng pin_O_TabataShizen = new LatLng(35.603023, 139.360730);
        LatLng pin_O_Tamasakai = new LatLng(35.601364, 139.367188);
        LatLng pin_O_Kaminuma = new LatLng(35.599014, 139.379159);
        LatLng pin_Mitsumeyama = new LatLng(35.605698, 139.352989);
        LatLng default_point = new LatLng(35.602760, 139.364900);


        // Add each pin on the map
        mMap.addMarker(new MarkerOptions().position(pin_O_Haku).title("小山白山公園").icon(BitmapDescriptorFactory.fromBitmap(pin_bit_resize)));
        mMap.addMarker(new MarkerOptions().position(pin_O_TabataShizen).title("小山田端自然公園").icon(BitmapDescriptorFactory.fromBitmap(pin_bit_resize)));
        mMap.addMarker(new MarkerOptions().position(pin_O_Tamasakai).title("小山多摩境公園").icon(BitmapDescriptorFactory.fromBitmap(pin_bit_resize)));
        mMap.addMarker(new MarkerOptions().position(pin_O_Kaminuma).title("小山上沼公園").icon(BitmapDescriptorFactory.fromBitmap(pin_bit_resize)));
        mMap.addMarker(new MarkerOptions().position(pin_Mitsumeyama).title("三ツ目山公園").icon(BitmapDescriptorFactory.fromBitmap(pin_bit_resize)));
        mMap.moveCamera(CameraUpdateFactory.newLatLngZoom(default_point, 14));


        // Enable MyLocation Button
        //mMap.setMyLocationEnabled(true);


        //MarkerClickListener
        mMap.setOnMarkerClickListener(new GoogleMap.OnMarkerClickListener() {
            @Override
            public boolean onMarkerClick(Marker marker) {

                marker.showInfoWindow();

                if (tap == 0) {

                    park_name = marker.getTitle();
                    System.out.println("singletap = " + park_name);
                    tap++;

                } else if (tap == 1) {

                    d_park_name = marker.getTitle();

                    if (d_park_name.equals(park_name)) {

                        System.out.println("doubletap = " + d_park_name);
                        Intent show_detail = new Intent(getApplication(), Park_detail.class);
                        show_detail.putExtra("park_name", d_park_name);
                        startActivity(show_detail);

                    } else {

                        park_name = marker.getTitle();
                        System.out.println("singletap = " + park_name);
                        tap = 1;

                    }

                }

                return false;

            }
        });

    }

    private void get_weather(){
        try {

            //Get R.id
            TextView weather_area = findViewById(R.id.weather_view);
            TextView weather_de = findViewById(R.id.weather_de);
            TextView temp_now_area = findViewById(R.id.temp_now);
            TextView temp_now_de = findViewById(R.id.temp_now_de);
            TextView temp_area = findViewById(R.id.temp);
            TextView temp_de = findViewById(R.id.temp_de);
            final ImageView weather_icon = findViewById(R.id.weather_icon);


            //Get JSON Data
            String requestURL = "http://api.openweathermap.org/data/2.5/weather?id=1857871&units=metric&appid=77f12bc995d14170ac0ec272962381fe";
            URL url = new URL(requestURL);
            InputStream is = url.openConnection().getInputStream();


            //JSON to String
            BufferedReader reader = new BufferedReader(new InputStreamReader(is, "UTF-8"));
            StringBuilder sb = new StringBuilder();
            String line;
            while (null != (line = reader.readLine())) {
                sb.append(line);
            }
            String data = sb.toString();


            //Get JSONObject
            JSONObject weather_data = new JSONObject(data);


            //Get city name
            String city = weather_data.getString("name");


            //Get weather array
            JSONArray read_weather_data_array = weather_data.getJSONArray("weather");
            JSONObject weather_data_main = read_weather_data_array.getJSONObject(0);


            //Get temp
            JSONObject main = weather_data.getJSONObject("main");
            float temp = (float) main.getDouble("temp");
            float temp_min = (float) main.getDouble("temp_min");
            float temp_max = (float) main.getDouble("temp_max");


            //Get iconID
            String weather_main = weather_data_main.getString("main");
            String icon_type = weather_data_main.getString("icon");
            String icon_base = "http://openweathermap.org/img/w/";
            String icon_ex = ".png";


            //Create icon link
            StringBuffer icon_href_buf = new StringBuffer();
            icon_href_buf.append(icon_base);
            icon_href_buf.append(icon_type);
            icon_href_buf.append(icon_ex);
            String icon_href = icon_href_buf.toString();
            System.out.println(icon_href);

            //Show icon
            Picasso.with(Map_view.this)
                    .load(icon_href)
                    .resize(130, 130)
                    .into(weather_icon, new Callback() {
                        @Override
                        public void onSuccess() {

                        }

                        @Override
                        public void onError() {
                            Toast.makeText(Map_view.this, "天気アイコンが読み込めません", Toast.LENGTH_SHORT).show();
                        }
                    });


            //Create weather data
            StringBuffer weather_buf = new StringBuffer();
            weather_buf.append(" ");
            weather_buf.append(city);
            weather_buf.append(" ");
            weather_buf.append(weather_main);
            String weather_area_data = weather_buf.toString();


            //Create now temp data
            StringBuffer temp_now_buf = new StringBuffer();
            temp_now_buf.append("  ");
            temp_now_buf.append(temp);
            String temp_now_area_data = temp_now_buf.toString();


            //Create temp data
            StringBuffer temp_buf = new StringBuffer();
            temp_buf.append("  ");
            temp_buf.append(temp_max);
            temp_buf.append("/");
            temp_buf.append(temp_min);
            String temp_area_data = temp_buf.toString();


            //View city and weather
            weather_de.setText(" 天気");
            weather_area.setText(weather_area_data);


            //View now temp
            temp_now_de.setText("    現在");
            temp_now_area.setText(temp_now_area_data);

            //View Max,Min temp
            temp_de.setText("   最高/最低");
            temp_area.setText(temp_area_data);

        } catch (Exception e) {
            System.out.println(e);
            System.out.println("ERROR");
            Toast.makeText(Map_view.this, "天気情報を取得できませんでした", Toast.LENGTH_SHORT).show();
        }
    }
}
