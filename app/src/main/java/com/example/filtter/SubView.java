package com.example.filtter;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.*;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;

import java.util.Objects;
//20230508：解決部分は削除
public class SubView
        extends AppCompatActivity {

        private WebView FtSwv;
        @SuppressLint("SetJavaScriptEnabled")
        @Override
        public void onCreate(Bundle savedInstanceState) {
            super.onCreate(savedInstanceState);
            setContentView(R.layout.activity_sub);
            Intent FtIi = getIntent();
            String FtIu = FtIi.getStringExtra("Ftsivdata");
            FtSwv = findViewById(R.id.imageview);
            FtSwv.getSettings().setJavaScriptEnabled(true);
            FtSwv.getSettings().setBuiltInZoomControls(true);
            FtSwv.getSettings().setDisplayZoomControls(true);
            FtSwv.getSettings().setAllowFileAccess(true);
            FtSwv.loadUrl(FtIu);
            FtSwv.setLongClickable(true);
            FtSwv.setWebViewClient(new WebViewClient());
            registerForContextMenu(FtSwv);
        }


    private String FtIcmurl;
    @Override
    public void onCreateContextMenu(ContextMenu FtMcmcm, View FtMcmlv, ContextMenu.ContextMenuInfo FtMcminfo) {
        super.onCreateContextMenu(FtMcmcm, FtMcmlv, FtMcminfo);
        FtSwv = (WebView) FtMcmlv;
        WebView.HitTestResult imgHR = FtSwv.getHitTestResult();
        FtIcmurl = imgHR.getExtra();
        MenuInflater inflater = getMenuInflater();
        //メニューを複数に分けタップ先によって表示
        if (FtIcmurl != null) {
            //元画像取得可能なURL
            if (FtIcmurl.contains("https://pbs.twimg.com/")) {
                inflater.inflate(R.menu.context0, FtMcmcm);
            }
            else if (FtIcmurl.contains("https://video.twimg.com/")) {
                inflater.inflate(R.menu.context1, FtMcmcm);
            }
            else {
                //元画像以外のURL
                inflater.inflate(R.menu.context2, FtMcmcm);
            }
        }
        else{
            //有効なURLでない
            inflater.inflate(R.menu.context3, FtMcmcm);
            FtIcmurl = "";
        }
    }

    //menu
    public boolean onCreateOptionsMenu(Menu FtSmenu) {
        // 参照するリソースは上でリソースファイルに付けた名前と同じもの
        getMenuInflater().inflate(R.menu.sub, FtSmenu);
        return true;
    }

    @SuppressLint("NonConstantResourceId")
    @Override
    public boolean onOptionsItemSelected(MenuItem FtMmitem) {
        switch (FtMmitem.getItemId()) {

            case R.id.menuitems1:
                this.finish();
                return true;

            case R.id.menuitems2:
                if(Objects.equals(Uri.parse(FtSwv.getUrl()).getScheme(), "https")){
                Intent Simlu2 = new Intent(Intent.ACTION_VIEW, Uri.parse(FtSwv.getUrl()));
                startActivity(Simlu2);
                return true;
                }
                return false;
            default:
                return super.onOptionsItemSelected(FtMmitem);

        }
    }

    //コンテキストメニュー処理
    @SuppressLint("NonConstantResourceId")
    @Override
    public boolean onContextItemSelected(MenuItem Ftcmitem) {
        String Ftcmilurl = FtIcmurl
                .replaceAll("&name=[a-z,0-9]*", "&name=orig");
        switch (Ftcmitem.getItemId()) {
            //DL
            case R.id.context_d:
                Intent Ftidlip = new Intent(getApplication(), DL.class);
                Ftidlip.putExtra("Ftdldata", Ftcmilurl);
                startActivity(Ftidlip);
                return true;

            case R.id.context_c:
                return true;

            default:
                return super.onContextItemSelected(Ftcmitem);
        }

    }


    //戻るボタンで戻る
        @Override
        public void onBackPressed() {
            //移動後のページ
            if(FtSwv!= null && FtSwv.canGoBack()) {
                FtSwv.goBack();
            }
            //最初のページ
            else {
                super.onBackPressed();
            }
        }

}

