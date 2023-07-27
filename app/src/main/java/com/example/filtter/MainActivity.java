package com.example.filtter;

import android.annotation.SuppressLint;
import android.content.ClipData;
import android.content.Context;
import android.content.Intent;
import android.content.res.Configuration;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.provider.Settings;
import android.util.Log;
import android.view.*;
import android.webkit.*;
import android.widget.CompoundButton;
import android.widget.Switch;
import android.widget.Toast;
import android.widget.ToggleButton;
import androidx.activity.result.ActivityResult;
import androidx.activity.result.ActivityResultCallback;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;
import android.webkit.WebMessage;
import org.jetbrains.annotations.NotNull;

import java.util.Objects;

import static android.view.WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY;
import static android.webkit.WebSettings.*;
import static androidx.constraintlayout.helper.widget.MotionEffect.TAG;

//20230508：解決部分は削除（課題ありはメモのみ）
public class MainActivity extends AppCompatActivity {

    private WebView FtMwv;
    @SuppressLint("UseSwitchCompatOrMaterialCode")
    private Switch sw_rel ;
    @SuppressLint({"SetJavaScriptEnabled", "JavascriptInterface"})
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        CookieManager FtMCookieManager = CookieManager.getInstance();
        FtMCookieManager.setAcceptCookie(true);
        FtMwv = findViewById(R.id.MainView);
        FtMwv.getSettings().setDomStorageEnabled(true);
        FtMwv.getSettings().setJavaScriptEnabled(true);
        FtMwv.getSettings().setCacheMode(LOAD_NO_CACHE);
        FtMwv.getSettings().setMixedContentMode(MIXED_CONTENT_ALWAYS_ALLOW);
        FtMwv.loadUrl("https://mobile.twitter.com");
        FtMwv.setDownloadListener(new Ftvdl());
        FtMwv.setWebViewClient(new Homewait());
//        FtMwv.setWebViewClient(new FltMwvc());
        FtMwv.setWebChromeClient(new FtMfuwcc());
        FtMwv.addJavascriptInterface(new FltMainJsInterface(), "Filtter_M");
        registerForContextMenu(FtMwv);
        sw_rel = findViewById(R.id.switch_reload);
        sw_rel.setOnCheckedChangeListener(relbuttonView);
    }


    //ボタンの動作
    private final CompoundButton.OnCheckedChangeListener relbuttonView = new CompoundButton.OnCheckedChangeListener() {
        @Override
        public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
            if (isChecked) {
                FtMwv.postWebMessage(new WebMessage("auto_rel"),Uri.parse("https://twitter.com"));
            } else {
                FtMwv.postWebMessage(new WebMessage("manu_rel"),Uri.parse("https://twitter.com"));
                System.gc();
            }
        }
    };

    public class FltMainJsInterface {
        @JavascriptInterface
        public void initFltM(String FltMtoast) {
            Toast Ftatoast = Toast.makeText(getApplicationContext(), FltMtoast,Toast.LENGTH_LONG);
            Ftatoast.setGravity(Gravity.CENTER, 0, 0);
            Ftatoast.show();
        }
    }


    private class Homewait extends WebViewClient {
        @Override
        public void onPageFinished(WebView jswv, String jsu) {
            //
                String asuri = "js/Homewait.js";
                String jsString = AS.getAString(getApplicationContext(), asuri);
                jswv.evaluateJavascript(jsString, null);
                jswv.setWebViewClient(new FltMwvc());
                sw_rel.setChecked(false);
        }
    }


//スイッチスクリプト
    private class FltMwvc extends WebViewClient {
        @Override
            public void onLoadResource (WebView lnwv, String lnu){
////            if (!lnwv.getUrl().contains("/compose/tweet") && !lnwv.getUrl().contains("/status/") && !lnwv.getUrl().endsWith("/notifications")&& !lnwv.getUrl().endsWith("/timeline") && !lnwv.getUrl().endsWith("/lists")) {
//             if (!lnwv.getUrl().endsWith("/lists")) {
//                String asuri = "js/check_show.js";
//                String jsStringld = AS.getAString(getApplicationContext(), asuri);
//                lnwv.evaluateJavascript(jsStringld, null);
//                //↓Homeのflag設定記憶機構積んだときに使用
////            if(!lnwv.getUrl().endsWith("/home")){
//
//             }
//             if (!lnwv.getUrl().contains("/home") && !lnwv.getUrl().contains("/status/") && !lnwv.getUrl().endsWith("/notifications")&& !lnwv.getUrl().endsWith("/timeline")&& !lnwv.getUrl().endsWith("/message")) {
             if (lnwv.getUrl().endsWith("/lists")) {
                Intent Ftsvui = new Intent(getApplication(), ListView.class);
                Ftsvui.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
                String Ftusvuis = String.valueOf(lnwv.getUrl());
                Ftsvui.putExtra("FtSdata", Ftusvuis);
                startActivity(Ftsvui);
                System.gc();
                FtMwv.goBack();
             }
             //操作方法を変更するだけでクソみたいな挙動するので対策不能、運用でカバー
//            if (lnwv.getUrl().contains("/account/switch")) {
//                String asuri = "js/dlbackaccount.js";
//                String jsStringld = AS.getAString(getApplicationContext(), asuri);
//                FtMwv.evaluateJavascript(jsStringld, null);
//            }
//            if(lnwv.getUrl().contains("/i/delegate/")){
//                FtMwv.goBack();
//            }
            }

        public boolean shouldOverrideUrlLoading(WebView Fltuwv, WebResourceRequest Fltuwrr) {
            switch (Fltuwrr.getUrl().getHost()) {
                //jsあて
                case "mobile.twitter.com":
                case "twitter.com":
//                    if(Fltuwrr.getUrl().getPath().endsWith("/notifications") || Fltuwrr.getUrl().getPath().contains("/delegate/")){
//                        return false;
//                    }
                    Fltuwv.setWebViewClient(new Homewait());
                    return false;
                default:
                    Intent Fltuiui = new Intent(Intent.ACTION_VIEW,Uri.parse(String.valueOf(Fltuwrr.getUrl())));
                    startActivity(Fltuiui);
                    return true;
            }
        }

    }

    //Chromium標準の動画ダウンロード対応
    class Ftvdl implements DownloadListener {
        @Override
        public void onDownloadStart(String Ftvdlurl, String FtvdluA,
                                    String FtvdlcD, String Ftvdlmimetype, long contentLength) {
            Intent Ftvdli = new Intent(getApplication(), DL.class);
            String Ftvdlius = String.valueOf(Ftvdlurl);
            Ftvdli.putExtra("Ftdldata", Ftvdlius);
            startActivity(Ftvdli);
        }
    }

    //ファイルアップ用の処理

    private ValueCallback<Uri[]> FtMfuvc;
    //ファイル表示
    private class FtMfuwcc extends WebChromeClient {
        ActivityResultLauncher<Intent> FtFCLauncher = registerForActivityResult(new ActivityResultContracts.StartActivityForResult(), new Ftfuarcb());
        @Override
        public boolean onShowFileChooser(WebView FtMfuwccwv,ValueCallback<Uri[]> FtMfpc,FileChooserParams FtMfufcp) {
            FtMfuvc = FtMfpc;
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
            FtMfuvc.onReceiveValue(Ftresults);
        }
    }


    //コンテキストメニュー作成
    private String FtMcmurl;
    @Override
    public void onCreateContextMenu(ContextMenu FtMcmcm, View FtMcmlv, ContextMenu.ContextMenuInfo FtMcminfo) {
        super.onCreateContextMenu(FtMcmcm, FtMcmlv, FtMcminfo);
        FtMwv = (WebView) FtMcmlv;
        WebView.HitTestResult imgHR = FtMwv.getHitTestResult();
        FtMcmurl = imgHR.getExtra();
        MenuInflater inflater = getMenuInflater();
        if (FtMcmurl != null) {
            //元画像取得可能なURL
            if (FtMcmurl.contains("https://pbs.twimg.com/")) {
                inflater.inflate(R.menu.context1, FtMcmcm);
            }
            else if (FtMcmurl.contains("https://video.twimg.com/")) {
                inflater.inflate(R.menu.context1, FtMcmcm);
            }
            else {
                //元画像以外のURL
                inflater.inflate(R.menu.context2, FtMcmcm);
            }
        }
//        else{
//            //有効なURLでない
//            inflater.inflate(R.menu.context3, FtMcmcm);
//            FtMcmurl = "";
//        }
    }

    //コンテキストメニュー処理
    @SuppressLint("NonConstantResourceId")
    @Override
    public boolean onContextItemSelected(MenuItem Ftcmitem) {
        String Ftcmilurl = FtMcmurl
                .replaceAll("&name=[a-z,0-9]*", "&name=orig");
        switch (Ftcmitem.getItemId()) {
            //DL
            case R.id.context_d:
                Intent Ftidlip = new Intent(getApplication(), DL.class);
                Ftidlip.putExtra("Ftdldata", Ftcmilurl);
                startActivity(Ftidlip);
                return true;

            case R.id.context_o:
                Intent Ftiiip = new Intent(Intent.ACTION_VIEW, Uri.parse(FtMcmurl));
                                startActivity(Ftiiip);
                return true;

            case R.id.context_c:
                return true;

            default:
                return super.onContextItemSelected(Ftcmitem);
        }

    }

    //メニュー作成
    @Override
    public boolean onCreateOptionsMenu(Menu FtMmenu) {
        // 参照するリソースは上でリソースファイルに付けた名前と同じもの
        getMenuInflater().inflate(R.menu.main, FtMmenu);
        return true;
    }
    //メニュー処理
    @SuppressLint("NonConstantResourceId")
    @Override
    public boolean onOptionsItemSelected(MenuItem FtMmitem) {
        switch (FtMmitem.getItemId()) {

            case R.id.menuitemm1:
                String FtSlu2 = "file:///android_asset/html/help.html";
                Intent imlu2 = new Intent(getApplication(), SubView.class);
                imlu2.putExtra("Ftsivdata",FtSlu2);
                startActivity(imlu2);
                return true;

            case R.id.menuitemm2:
                Context FtMcontext = getApplicationContext();
                CharSequence FtMmtext = "Filtter V0.99f";
                int FtMduration = Toast.LENGTH_LONG;
                Toast Ftatoast = Toast.makeText(FtMcontext, FtMmtext,FtMduration);
                Ftatoast.setGravity(Gravity.CENTER, 0, 0);
                Ftatoast.show();
                return true;

            case R.id.menuitemm3:
                this.finish();
                return true;

            case R.id.menuitemm4:
                FtMwv.postWebMessage(new WebMessage("show_all"),Uri.parse("https://twitter.com"));
                return true;
            case R.id.menuitemm5:
                FtMwv.postWebMessage(new WebMessage("media_only"),Uri.parse("https://twitter.com"));
                return true;
            case R.id.menuitemm6:
                FtMwv.postWebMessage(new WebMessage("exclude_retweet"),Uri.parse("https://twitter.com"));
                return true;
            case R.id.menuitemm7:
                FtMwv.postWebMessage(new WebMessage("media_noret_only"),Uri.parse("https://twitter.com"));
                return true;
            case R.id.menuitemm8:
                FtMwv.reload();
                FtMwv.setWebViewClient(new Homewait());
                return true;

            default:
                return super.onOptionsItemSelected(FtMmitem);

        }
    }
    //戻るボタンで戻る
    @Override
    public void onBackPressed() {
        //移動後のページ
        if(FtMwv!= null && FtMwv.canGoBack()) {
            FtMwv.goBack();
        }
        //最初のページ
        else {
            super.onBackPressed();
        }
    }
}
