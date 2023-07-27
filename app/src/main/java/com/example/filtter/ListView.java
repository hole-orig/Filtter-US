

package com.example.filtter;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.ClipData;
import android.content.Context;
import android.content.Intent;
import android.content.res.Configuration;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.view.*;
import android.webkit.*;
import android.widget.CompoundButton;
import android.widget.Switch;
import android.widget.Toast;
import androidx.activity.result.ActivityResult;
import androidx.activity.result.ActivityResultCallback;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;
import org.jetbrains.annotations.NotNull;

import static android.webkit.WebSettings.LOAD_NO_CACHE;
import static android.webkit.WebSettings.MIXED_CONTENT_ALWAYS_ALLOW;

//20230508：解決部分は削除
public class ListView extends AppCompatActivity {

    private WebView FtLwv;
    @SuppressLint("UseSwitchCompatOrMaterialCode")
    private Switch sw_sum;
    @SuppressLint("SetJavaScriptEnabled")
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_list);
        Intent FtLi = getIntent();
        String FtLu = FtLi.getStringExtra("FtSdata");
        FtLwv = findViewById(R.id.ListView);
        FtLwv.getSettings().setDomStorageEnabled(true);
        FtLwv.getSettings().setJavaScriptEnabled(true);
        FtLwv.getSettings().setCacheMode(LOAD_NO_CACHE);
        FtLwv.getSettings().setMixedContentMode(MIXED_CONTENT_ALWAYS_ALLOW);
        FtLwv.loadUrl(FtLu);
        FtLwv.setWebViewClient(new Listwait());
        FtLwv.setWebChromeClient(new FtLfuwcc());
        registerForContextMenu(FtLwv);
        FtLwv.addJavascriptInterface(new FltListJsInterface(), "Filtter_L");
        sw_sum = findViewById(R.id.switch_summary);
        sw_sum.setOnCheckedChangeListener(sum_buttonView);
    }

    private final CompoundButton.OnCheckedChangeListener sum_buttonView = new CompoundButton.OnCheckedChangeListener() {
        @Override
        public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
            if (isChecked) {
                FtLwv.postWebMessage(new WebMessage("hide_sum"),Uri.parse("https://twitter.com"));
            } else {
                FtLwv.postWebMessage(new WebMessage("show_sum"),Uri.parse("https://twitter.com"));
            }
        }
    };

    //20230428
    public class FltListJsInterface {
        @JavascriptInterface
        public void initFltL(String FltLtoast) {
            Toast Ftatoast = Toast.makeText(getApplicationContext(), FltLtoast,Toast.LENGTH_LONG);
            Ftatoast.setGravity(Gravity.CENTER, 0, 0);
            Ftatoast.show();
        }
    }

    private class Listwait extends WebViewClient {
        @Override
            public void onPageFinished(WebView jswvl, String jsul) {
            String asuri = "js/Listwait.js";
            String jsStringl = AS.getAString(getApplicationContext(), asuri);
            jswvl.evaluateJavascript(jsStringl, null);
            jswvl.setWebViewClient(new Ftsjswvc());
            sw_sum.setChecked(false);
        }
    }

     private class Ftsjswvc extends WebViewClient {
         @Override
         public void onLoadResource(WebView jswvld, String jsuld) {
            String asuri = "js/deleteback.js";
            String jsStringld = AS.getAString(getApplicationContext(), asuri);
            jswvld.evaluateJavascript(jsStringld, null);
            if(jswvld.getUrl().endsWith("/lists")) {
                 System.gc();
            }
         }
           public boolean shouldOverrideUrlLoading(WebView Ftuswv, WebResourceRequest Ftuswrr) {
             switch (Ftuswrr.getUrl().getHost()) {
                 // T内
                 case "mobile.twitter.com":
                 case "twitter.com":
                     Ftuswv.setWebViewClient(new Listwait());
                     return false;
                 // 他
                 default:
                     Intent Ftui = new Intent(Intent.ACTION_VIEW, Ftuswrr.getUrl());
                     startActivity(Ftui);
                     return true;
             }
         }
     }

    private ValueCallback<Uri[]> FtLfuvc;
    //ファイル表示
    private class FtLfuwcc extends WebChromeClient {
        ActivityResultLauncher<Intent> FtFCLauncher = registerForActivityResult(new ActivityResultContracts.StartActivityForResult(), new Ftfuarcb());
        @Override
        public boolean onShowFileChooser(WebView FtMfuwccwv,ValueCallback<Uri[]> FtMfpc,FileChooserParams FtMfufcp) {
            FtLfuvc = FtMfpc;
            Intent Ftui = new Intent(Intent.ACTION_GET_CONTENT);
            Ftui.setType("*/*");
            String[] FtMime = {"image/jpeg","image/png","image/gif","video/mp4"};
            Ftui.putExtra(Intent.EXTRA_MIME_TYPES, FtMime);
            Ftui.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true);
            Ftui.addCategory(Intent.CATEGORY_OPENABLE);
            FtFCLauncher.launch(Ftui);
            return true;
        }
    }
    //ファイル取得
    private class Ftfuarcb implements ActivityResultCallback<ActivityResult> {
        @Override
        public void onActivityResult(ActivityResult Ftar) {
            // リザルトのチェック
            Uri[] Ftresults = new Uri[0];
            if (Ftar.getResultCode() == RESULT_OK) {
                Intent Ftid = Ftar.getData();
                if (Ftid != null) {
                    ClipData Ftclp = Ftid.getClipData();
                    if (Ftclp == null) {
                        String Ftids = Ftid.getDataString();
                        Ftresults = new Uri[]{Uri.parse(Ftids)};
                    }
                    if (Ftclp != null) {
                        Ftresults = new Uri[Ftclp.getItemCount()];
                        for (int i = 0; i < Ftclp.getItemCount(); i++) {
                            ClipData.Item item = Ftclp.getItemAt(i);
                            Ftresults[i] = item.getUri();
                        }
                    }
                }
            }
            FtLfuvc.onReceiveValue(Ftresults);

        }
    }


//コンテキスト作成
    private String FtLcmurl;
    @Override
    public void onCreateContextMenu(ContextMenu FtLcmcm, View FtLcmlv, ContextMenu.ContextMenuInfo FtLcminfo) {
        super.onCreateContextMenu(FtLcmcm, FtLcmlv, FtLcminfo);
        FtLwv = (WebView) FtLcmlv;
        WebView.HitTestResult imgHR = FtLwv.getHitTestResult();
        FtLcmurl = imgHR.getExtra();
        MenuInflater inflater = getMenuInflater();
        //メニューを複数に分けタップ先によって表示
        if (FtLcmurl != null) {
            //元画像取得可能なURL
            if (FtLcmurl.contains("https://pbs.twimg.com/")) {
                inflater.inflate(R.menu.context1, FtLcmcm);
            }
            else if (FtLcmurl.contains("https://video.twimg.com/")) {
                inflater.inflate(R.menu.context1, FtLcmcm);
            }
            else {
                //元画像以外のURL
                inflater.inflate(R.menu.context2, FtLcmcm);
            }
        }
        else{
            //有効なURLでない
            inflater.inflate(R.menu.context3, FtLcmcm);
            FtLcmurl = "";
        }
    }


    //コンテキストメニュー処理
    @SuppressLint("NonConstantResourceId")
    @Override
    public boolean onContextItemSelected(MenuItem Ftcmitem) {
        String Ftcmilurl = FtLcmurl
                .replaceAll("&name=[a-z,0-9]*", "&name=orig");
        switch (Ftcmitem.getItemId()) {
            //DL
            case R.id.context_d:
                Intent Ftidlip = new Intent(getApplication(), DL.class);
                Ftidlip.putExtra("Ftdldata", Ftcmilurl);
                startActivity(Ftidlip);
                return true;

            case R.id.context_o:
                Intent Ftiiip = new Intent(Intent.ACTION_VIEW, Uri.parse(FtLcmurl));
                startActivity(Ftiiip);
                return true;

            case R.id.context_c:
                return true;

            default:
                return super.onContextItemSelected(Ftcmitem);
        }

    }

    public boolean onCreateOptionsMenu(Menu FtSmenu) {
        // 参照するリソースは上でリソースファイルに付けた名前と同じもの
        getMenuInflater().inflate(R.menu.list, FtSmenu);
        return true;
    }

    @SuppressLint("NonConstantResourceId")
    @Override
    public boolean onOptionsItemSelected(MenuItem FtLmitem) {
        switch (FtLmitem.getItemId()) {

            case R.id.menuiteml1:
                this.finish();
                return true;
            case R.id.menuiteml2:
                FtLwv.reload();
                FtLwv.setWebViewClient(new Listwait());
                return true;
            case R.id.menuiteml3:
                FtLwv.postWebMessage(new WebMessage("show_all"), Uri.parse("https://twitter.com"));
                return true;
            case R.id.menuiteml4:
                FtLwv.postWebMessage(new WebMessage("media_only"),Uri.parse("https://twitter.com"));
                return true;
            case R.id.menuiteml5:
                FtLwv.postWebMessage(new WebMessage("exclude_retweet"),Uri.parse("https://twitter.com"));
                return true;
            case R.id.menuiteml6:
                FtLwv.postWebMessage(new WebMessage("media_noret_only"),Uri.parse("https://twitter.com"));
                return true;

            default:
                return super.onOptionsItemSelected(FtLmitem);

        }
    }
    //戻るボタンで戻る
    @Override
    public void onBackPressed() {
        //移動後のページ
        if(FtLwv!= null && FtLwv.canGoBack()) {
            FtLwv.goBack();
        }
        //最初のページ
        else {
            super.onBackPressed();
        }
    }

}

