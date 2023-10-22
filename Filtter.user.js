// ==UserScript==
// @name         Filtter B
// @namespace    https://twitter.com/hom_hole
// @version      0.9n
// @description  Filter for X/Twitter
// @author       hom_hole
// @match        https://twitter.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
  'use strict';
let showflag;
let relflag;
let sumflag;
let srelflag;
function initFiltter(){
showflag =1;
srelflag =2;
sumflag =1;
relflag = 2;
 setTimeout(updateIT,100);
 setTimeout(showchange,100);
 setTimeout(addmenu,500);
 setTimeout(sumctrl,500)
}

//フィルターメニュー
function addmenu(){
let navElD2;
let navmenu;
//追加
 function createmenu(){
 if(document.getElementById("filtnav") == null){
 //↓はモバイルかつ委任アカウントでない
  if(document.body.querySelector('div[class="css-1dbjc4n r-1e5uvyk r-ii8lfi r-1h3ijdo"]')==null &&　document.body.querySelector('div[class="css-1dbjc4n r-1e5uvyk r-ii8lfi"]')==null && document.querySelector('div[data-testid="TopNavBar"]') !=null){
   navElD2 = document.querySelector('div[data-testid="BottomBar"]');
   }
   else{
    navElD2 = document.body.querySelector('div[class="css-1dbjc4n r-aqfbo4 r-gtdqiz r-1gn8etr r-1g40b8q"]');
   }
 if(navElD2 !=null){
 navmenu = document.createElement("div");
 navmenu.innerHTML= '<select id="filtnav" style="display:inline-block;background-color:#102030; color:white;text-align:right; height:22px; width:80%; padding:0; margin:0; font-size:18px; border:1px solid;"><option value="All">全て表示</option><option value="ExRP">リポスト非表示</option><option value="Media">メディアのみ</option><option value="ExRP_Media">リポスト非表示/メディアのみ</option></select><select id="relselect"style="display:inline-block;background-color:#102030; color:white;text-align:right; height:22px; width:20%; padding:0; margin:0; font-size:18px; border:1px solid;"><option value="autorel">自動</option><option value="manurel">手動</option></select>';
 navElD2.prepend(navmenu);
 }
//動作（フラグ変更）
 if(document.getElementById("filtnav") !=null){
 const filtternav = document.getElementById("filtnav");
 filtternav.addEventListener('change',setFilt);
   function setFilt(){
     let flaga = filtternav.value;
    if(flaga =="All"){
    showflag =1;
    }
    if(flaga =="Media"){
      showflag =2;
    }
    if(flaga =="ExRP"){
       showflag =3;
    }
    if(flaga =="ExRP_Media"){
     showflag =4;
    }
 }
//表示補正
 if(showflag =="1"){
   filtternav.options[0].selected = true;
   }
 if(showflag =="3"){
   filtternav.options[1].selected = true;
                       }
 if(showflag =="2"){
   filtternav.options[2].selected = true;
  }
 if(showflag =="4"){
   filtternav.options[3].selected = true;
 }
  const relnav = document.getElementById("relselect");
 relnav.addEventListener('change',setRel);
   function setRel(){
     let flagra = relnav.value;
    if(flagra =="autorel"){
    srelflag =1;
    sumflag=2;
    }
    if(flagra =="manurel"){
     srelflag =2;
     sumflag=1;
    }
 }
 if(srelflag =="1"){
   relnav.options[0].selected = true;
   }
 if(srelflag =="2"){
   relnav.options[1].selected = true;
  }
 }
}
//表示調整
    if(document.getElementById("filtnav") != null){
        const filtternav = document.getElementById("filtnav");
        if(location.pathname.includes("/explore") ||location.pathname.includes("/messages") || location.pathname.includes("/compose/tweet") || location.pathname.includes("/status/") || location.pathname.endsWith("/notifications")|| location.pathname.endsWith("/timeline") ||location.pathname.endsWith("/lists")){
        filtternav.parentNode.style.display="none";
         }
        else{
            filtternav.parentNode.style.display="block";
         }
    }
 setTimeout(createmenu,500)
}
createmenu();
};

//リストの詳細の表示/非表示切り替え(手動更新では表示/自動更新で非表示)
function sumctrl(){
    function sumflagctrl(){
        if(location.pathname.includes("/i/lists")){
            let sumtarget = document.querySelector('main[role="main"]')
            let summary = sumtarget.querySelector('div[class="r-1p0dtai r-1pi2tsx r-1d2f490 r-u8s1d r-ipm5af r-13qz1uu"]');
            if(summary !=null){
            if (sumflag =="1"){
              summary.parentNode.parentNode.style.display ="block";
             }
            if (sumflag =="2"){
               summary.parentNode.parentNode.style.display ="none";
            }
          }
        }
        setTimeout(sumflagctrl,500)
    }
    sumflagctrl();
}
/*メディア関連のフィルタリングはほぼCro様(https://greasyfork.org/ja/users/10865-cro)作成の
Twitter media-only filter toggle(https://greasyfork.org/ja/scripts/39130-twitter-media-only-filter-toggle)
からのコード
*/
     let target = document.body.querySelector('h2[data-testid="root"]');
     let has_photo = node => node.querySelector('[data-testid="tweetPhoto"]');
     let has_video = node => node.querySelector('[data-testid="videoPlayer"]');
     let has_card_media = node => node.querySelector('[data-testid*="media"]');
     let has_media = node => [has_photo, has_video, has_card_media].some(f => f(node));
     let has_ret1 = node => node.querySelector('div[class="css-1dbjc4n r-obd0qt r-1hwvwag r-18kxxzh r-1777fci r-1b7u577"]');
     let has_ret2 = node => node.querySelector('div[class="css-1dbjc4n r-1iusvr4 r-16y2uox"]');
     let has_ret = node => [has_ret1, has_ret2].some(f => f(node));
     let get_target_parent = node => node.parentNode.parentNode.parentNode;
     let set_article_state1 = node => void(get_target_parent(node).style.display = "block");
     let set_article_state2 = node => void(get_target_parent(node).style.display = has_media(node) ? "block" : "none" );
     let set_article_state3 = node => void(get_target_parent(node).style.display = has_ret(node) ? "none" : "block" );
     let set_article_state4 = node => void(get_target_parent(node).style.display = has_media(node) && !has_ret(node) ? "block" : "none" );
     let for_each_article = func => void document.body.querySelectorAll("article").forEach(func);
     let set_all_article_states;

function showchange(){
 let start_process = function(){
 if (showflag == 0){
     set_all_article_states = function(){return};
 }
 if (showflag ==1){
     set_all_article_states = () => void for_each_article(set_article_state1);
  }
 if (showflag ==2){
     set_all_article_states = () => void for_each_article(set_article_state2);
  }
 if (showflag ==3){
     set_all_article_states = () => void for_each_article(set_article_state3);
  }
 if (showflag ==4){
     set_all_article_states = () => void for_each_article(set_article_state4);
 }
  let timemonr = setTimeout(function(){
   let flagnow = showflag;
   if( !location.pathname.includes("/explore") &&!location.pathname.includes("/messages") &&!location.pathname.includes("/compose/tweet") && !location.pathname.includes("/status/") && !location.pathname.endsWith("/notifications")&& !location.pathname.endsWith("/timeline") && !location.pathname.endsWith("/lists")){
     navigator.locks.request('show_lock', async lock => {
      set_all_article_states();
     })
     }
   clearTimeout(timemonr)
   start_process();
  }, 200);

 };
start_process();
};

//下の自動更新のオン/オフ
document.addEventListener('scroll',function(){
 if(!location.pathname.includes("/explore") &&!location.pathname.includes("/messages") &&!location.pathname.includes("/compose/tweet") &&!location.pathname.includes("/status/") &&!location.pathname.includes("/notifications") &&!location.pathname.endsWith("/timeline") &&!location.pathname.endsWith("/lists")){
//自動更新選択時は スクロール位置による切り替え
   if(srelflag=="1"){
     if(window.scrollY>=150){
         relflag = 2;
     };
    if(window.scrollY<100){
         relflag = 1;
     }
  }
    if(srelflag=="2")
   {
        relflag = 2;
    }
}
})

//TL自動更新（ポスト自動"取得"ではない）
function updateIT(){
 let HomeTLW;
 let HomeTL;
 let ClickTL;
    if (!location.pathname.includes("/explore") &&!location.pathname.includes("/messages") &&!location.pathname.includes("/compose/tweet") && !location.pathname.includes("/status/") && !location.pathname.endsWith("/notifications")&& !location.pathname.endsWith("/timeline") && !location.pathname.endsWith("/lists")) {
      HomeTLW = document.querySelector('div[aria-label="ホームタイムライン"]');
      HomeTL = document.querySelector('div[data-testid="TopNavBar"]');
     if(HomeTLW != null && HomeTL == null){
         ClickTL= HomeTLW.querySelector('div[class="css-1dbjc4n r-16y2uox r-1wbh5a2 r-1pi2tsx r-1777fci"]');
     }
     if(HomeTL != null){
         if (location.pathname == "/home") {
         ClickTL = document.querySelector('div[class="css-1dbjc4n r-1awozwy r-16y2uox r-1wbh5a2 r-1pi2tsx r-1777fci"]');
         }
         else {
         ClickTL= document.querySelector('div[class="css-1dbjc4n r-16y2uox r-1wbh5a2 r-1pi2tsx r-1777fci"]');
         }
     }
     if(HomeTLW == null && HomeTL == null){
      setTimeout(updateIT,10000);
     }
        if(ClickTL != null){
            if(relflag == 0){
               relflag = 0;
             }
             if(relflag == 1){
               relflag = 1;
               ClickTL.click();
             }
             if(relflag == 2){
                relflag = 2;
             }
        }
     }
     setTimeout(updateIT,60000)
 }

initFiltter();

})();