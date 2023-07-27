package com.example.filtter;

import android.content.Context;
import androidx.appcompat.app.AppCompatActivity;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;

public class AS extends AppCompatActivity {
    public static String getAString(Context ascontext, String asuri) {
        InputStream asis;
        BufferedReader asbr;
        String asstr;
        StringBuilder assb = null;
        try {
            asis = ascontext.getAssets().open(asuri);
            asbr = new BufferedReader(new InputStreamReader(asis));
            assb = new StringBuilder();
            while ((asstr = asbr.readLine()) != null) {
                assb.append(asstr);
                assb.append("\n");
            }
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        if (assb !=null) {
            return assb.toString();
        }
        else {
            return "";
        }
    }
}