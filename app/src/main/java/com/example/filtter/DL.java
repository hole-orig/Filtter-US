package com.example.filtter;

import android.app.DownloadManager;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.webkit.CookieManager;
import androidx.appcompat.app.AppCompatActivity;

public class DL extends AppCompatActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        //ちょっとアレな「レイアウトを持たないアクティビティ」
        super.onCreate(savedInstanceState);
        CookieManager DLCookieManager = CookieManager.getInstance();
        DLCookieManager.setAcceptCookie(true);
        Intent DLi = getIntent();
        //MTDdldataは渡す(Main)側でnullチェックしてるのでこのまま
        String DLsu = DLi.getStringExtra("Ftdldata");
        Uri DLuri = Uri.parse(DLsu);
        String FtiN = DLuri.getLastPathSegment();
        String FtiNfn;
        //ファイルを判定して拡張子を追加
        if (DLuri.getQueryParameter("format").equals("jpg")){
            FtiNfn = FtiN+".jpg";
        }
        else if (DLuri.getQueryParameter("format").equals("png")) {
            FtiNfn = FtiN + ".png";
        }
        else if (DLuri.getQueryParameter("format").equals("png")) {
            FtiNfn = FtiN + ".png";
        }
        else{
            FtiNfn = FtiN;
        }
        DownloadManager.Request DLr = new DownloadManager.Request(DLuri);
        DLr.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
        DLr.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS,FtiNfn);
//        DLr.setVisibleInDownloadsUi(false);
        DownloadManager DLm = (DownloadManager) getSystemService(DOWNLOAD_SERVICE);
        DLm.enqueue(DLr);
        finish();
    }
}
