// ==UserScript==
// @name         Filtter USLiteF_addoon2
// @namespace    https://x.com/hole_orig
// @version      2.5.17.1
// @description  Filter for X/Twitter
// @author       hole_orig
// @match        https://twitter.com/*
// @match        https://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @grant        none
// ==/UserScript==

(function() {
'use strict';
let showflag;
let relflag;
let sumflag;
let srelflag;
let isProcessing;
const Xlang = document.documentElement.lang
const noactE = ["/explore","/settings","/messages","/notifications","/timeline","/lists","/verified-choose","/communities"]
const noactI = ["/compose/post","/status/","/i/premium_sign_up"]
let hasFiltterRun;

function initFiltter(){
  const AppRoot = document.querySelector('main[role ="main"]')
  if(AppRoot == null){
    setTimeout(initFiltter,500)
  }
  if(AppRoot != null){
  showflag = "show1";
  relflag = "rel2";
  sumflag = "sum1";
  srelflag = "srel2";
  isProcessing = true;
  setTimeout(()=>{createmenu()},500)
  hasFiltterRun = true;
  }
}

//メニュー作成本体ここから
let oldloc;
let oldsize;
let navElD;
//メニューの表示場所抽出
function checknavElD(){
   //↓は非モバイル
  if(document.querySelector('div[data-testid="TopNavBar"]') == null && document.querySelector('div[data-testid="primaryColumn"]') != null){
    navElD = document.body.querySelector('div[class="css-175oi2r r-aqfbo4 r-gtdqiz r-1gn8etr r-4zbufd r-1g40b8q"]');
  } //↓はモバイル
  if(document.querySelector('div[data-testid="TopNavBar"]') != null && document.querySelector('div[data-testid="primaryColumn"]') != null){
    navElD = document.querySelector('div[data-testid="BottomBar"]');
  }//読み込み確認
  if(document.querySelector('div[data-testid="primaryColumn"]') ==null){
    navElD = null;
  }
}
//メニュー作成本体ここから
function startcreate(){
  navElD = null
  if(navElD == null){
//   for(let i = 0;i<5;i++){
    checknavElD();
//    }
   }
  if(navElD !=null){
    createnavmenuelm()
  }
  function createnavmenuelm(){
  let navmenu;
  navmenu = document.createElement("div");
  navmenu.id = "navmenudiv"
  if(Xlang == "ja"){
    if(location.pathname.endsWith("/home")){
       navmenu.innerHTML= '<select id="filtnav" style="display:inline-block;background-color:#102030; color:white;text-align:right; height:22px; width:70%; padding:0; margin:0; font-size:18px; border:1px solid;" title="フィルター"><option value="All">全て表示</option><option value="ExRP">リポスト非表示</option><option value="Media">メディアのみ</option><option value="ExRP_Media">リポスト非表示/メディアのみ</option></select><select id="relselect" name="homeselect" style="display:inline-block;background-color:#102030; color:white;text-align:right; height:22px; width:30%; padding:0; margin:0; font-size:18px; border:1px solid;"><option value="manurel">手動更新</option><option value="autorel" title="更新">自動更新</option></select>';
    }
    if(location.pathname.includes("/i/lists")){
       navmenu.innerHTML= '<select id="filtnav" style="display:inline-block;background-color:#102030; color:white;text-align:right; height:22px; width:70%; padding:0; margin:0; font-size:18px; border:1px solid;" title="フィルター"><option value="All">全て表示</option><option value="ExRP">リポスト非表示</option><option value="Media">メディアのみ</option><option value="ExRP_Media">リポスト非表示/メディアのみ</option></select><select id="sumselect" name="listselect" style="display:inline-block;background-color:#102030; color:white;text-align:right; height:22px; width:30%; padding:0; margin:0; font-size:18px; border:1px solid;"><option value="showsum" title="詳細">詳細表示</option><option value="hidesum">詳細非表示</option></select>';
    }
    if(!location.pathname.includes("/i/lists/") && !location.pathname.endsWith("/home")){
       navmenu.innerHTML= '<select id="filtnav" style="display:inline-block;background-color:#102030; color:white;text-align:right; height:22px; width:70%; padding:0; margin:0; font-size:18px; border:1px solid;" title="フィルター"><option value="All">全て表示</option><option value="ExRP">リポスト非表示</option><option value="Media">メディアのみ</option><option value="ExRP_Media">リポスト非表示/メディアのみ</option></select><select id="noselect" name="notwork" style="display:inline-block;background-color:#102030; color:white;text-align:center; height:22px; width:30%; padding:0; margin:0; font-size:18px; border:1px solid;"><option value="showsum" title="無し">-</option></select>';
    }
    if(noactE.some(ne =>location.pathname.endsWith(ne)) || noactI.some(ni =>location.pathname.includes(ni))){
       navmenu.style.display = "none";
    }
    }
  if(Xlang == "en"){
    if(location.pathname.endsWith("/home")){
       navmenu.innerHTML= '<div><select id="filtnav" style="display:inline-block;background-color:#102030; color:white;text-align:right; height:22px; width:60%; padding:0; margin:0; font-size:18px; border:1px solid;" title="フィルター"><option value="All">showAll</option><option value="ExRP">excludeRP</option><option value="Media">MediaOnly</option><option value="ExRP_Media">excludeRP/MediaOnly</option></select><select id="relselect" name="homeselect" style="display:inline-block;background-color:#102030; color:white;text-align:right; height:22px; width:40%; padding:0; margin:0; font-size:18px; border:1px solid;"><option value="manurel">ManualRenew</option><option value="autorel" title="更新">AutoRenew</option></select></div>';
     }
    if(location.pathname.includes("/i/lists")){
       navmenu.innerHTML= '<div><select id="filtnav" style="display:inline-block;background-color:#102030; color:white;text-align:right; height:22px; width:60%; padding:0; margin:0; font-size:18px; border:1px solid;" title="フィルター"><option value="All">showAll</option><option value="ExRP">excludeRP</option><option value="Media">MediaOnly</option><option value="ExRP_Media">excludeRP/MediaOnly</option></select><select id="sumselect" name="listselect" style="display:inline-block;background-color:#102030; color:white;text-align:right; height:22px; width:40%; padding:0; margin:0; font-size:18px; border:1px solid;"><option value="showsum" title="詳細">showSummary</option><option value="hidesum">hideSummary</option></select></div>';
     }
    if(!location.pathname.includes("/i/lists/") && !location.pathname.endsWith("/home")){
       navmenu.innerHTML= '<div><select id="filtnav" style="display:inline-block;background-color:#102030; color:white;text-align:right; height:22px; width:60%; padding:0; margin:0; font-size:18px; border:1px solid;" title="フィルター"><option value="All">showAll</option><option value="ExRP">excludeRP</option><option value="Media">MediaOnly</option><option value="ExRP_Media">excludeRP/MediaOnly</option></select><select id="noselect" name="notwork" style="display:inline-block;background-color:#102030; color:white;text-align:center; height:22px; width:40%; padding:0; margin:0; font-size:18px; border:1px solid;"><option value="showsum" title="無し">-</option></select></div>';
     }
    if(noactE.some(ne =>location.pathname.endsWith(ne)) || noactI.some(ni =>location.pathname.includes(ni))){
       navmenu.style.display = "none";
    }
  }
  navElD.prepend(navmenu);
  //フィルタメニュー動作適用へ
  menuact();
  //メニューが作成されたときのURLを格納
  oldloc = location.href;
  //メニューが作成されたときのサイズを格納
  oldsize = window.innerWidth;
  }
}
//メニュー作成本体ここまで

//メニュー動作ここから(これらは同時に発生させたいのでひとくくりに)
function menuact(){
    filtermenu();
    reloadmenu();
    summenu();
  //フィルタメニュー動作ここから
  function filtermenu(){
  if(document.getElementById("filtnav") !=null){
   const filtternav = document.getElementById("filtnav");
   filtternav.removeEventListener('change',setFilt);
    function setFilt(){
     let flaga = filtternav.value;
     if(flaga ==="All"){
        showflag ="show1";
     }
     if(flaga ==="ExRP"){
        showflag ="show2";
     }
     if(flaga ==="Media"){
        showflag ="show3";
     }
     if(flaga ==="ExRP_Media"){
        showflag ="show4";
     }
   }
   if(showflag === "show1"){
      filtternav.options[0].selected = true;
   }
   if(showflag === "show2"){
      filtternav.options[1].selected = true;
   }
   if(showflag === "show3"){
      filtternav.options[2].selected = true;
    }
   if(showflag === "show4"){
      filtternav.options[3].selected = true;
   }
   filtternav.addEventListener('change',setFilt);
  }
  showchange();
 }
 //フィルタメニュー動作ここまで
 //リロードメニュー動作ここから
 function reloadmenu(){
  if(document.getElementById("relselect")!=null){
  const relnav = document.getElementById("relselect");
 //スクロール時の挙動
  document.removeEventListener('scroll',updatectrl)
 function updatectrl(){
   const relnav = document.getElementById("relselect");
     if(location.pathname.endsWith("/home")&&relnav!=null){
      if(srelflag === "srel1"){
        if(window.scrollY>=300){
          relflag = "rel2";
          relnav.options[0].selected = true;
         };
       if(window.scrollY<300){
          relflag = "rel1";
         relnav.options[1].selected = true;
        }
      }
     if(srelflag === "srel2"){
         relflag = "rel2";
         relnav.options[0].selected = true;
     }
   }
 }
  document.addEventListener('scroll',updatectrl);
  relnav.removeEventListener('change',setRel);
    function setRel(){
     let flagra = relnav.value;
     if(flagra === "autorel"){
        srelflag = "srel1";
     }
     if(flagra === "manurel"){
        srelflag = "srel2";
     }
     updatectrl();
   }
     if(relflag === "rel1"){
     document.getElementById("relselect").options[1].selected = true;
     }
     if(relflag === "rel2"){
     document.getElementById("relselect").options[0].selected = true;
     }
   relnav.addEventListener('change',setRel);
  }
  updateIT();
 }
  //リロードメニュー動作ここまで
  //詳細表示メニュー動作ここから
  function summenu(){
  if(document.getElementById("sumselect")!=null){
  const sumnav = document.getElementById("sumselect");
  sumnav.removeEventListener('change',setSum);
  function setSum(){
      let flagsum = sumnav.value;
     if(flagsum === "showsum"){
     sumflag = "sum1";
     }
     if(flagsum === "hidesum"){
      sumflag = "sum2";
     }
   }
   sumnav.addEventListener('change',setSum);
   //表示と実動作合わせ
   if(sumflag === "sum2"){
     document.getElementById("sumselect").options[1].selected = true;
   }
   if(sumflag === "sum1"){
     document.getElementById("sumselect").options[0].selected = true;
   }
  }
  sumctrl();
 }
 //詳細表示メニュー動作ここまで
}
//メニュー動作ここまで

//メニュー作成実行
function createmenu(){
  let createloopctrl;
  const navElm = document.getElementById("navmenudiv");
  clearTimeout(createloopctrl);
    if(navElm == null){
       startcreate();
    }
    if(navElm != null){
        //↓処理の構成上一旦消して作り直しさせる
       if(location.href != oldloc){
          navElm.remove();
       }
       if(location.href == oldloc){
        //↓ウインドウサイズが変わると表示が悲惨になるのを防止
        //これも処理の構成上一旦消して作り直しさせる
       if(window.innerWidth != oldsize){
            navElm.remove();
       }
     }
   }//↓定期チェック
  createloopctrl = setTimeout(createmenu,1000);
}


//詳細メニュー動作
function sumctrl(){
  let sumloopctrl;
  clearTimeout(sumloopctrl);
  if(location.pathname.includes("/i/lists/")&&!location.pathname.endsWith("/add_member")){
    const sumtarget = document.querySelector('div[data-testid="primaryColumn"]')
    //↓まれにsumtarget構築以前に動作してエラーになるため
    if(sumtarget != null){
      const summary0 = sumtarget.querySelector('div[class="css-175oi2r r-1adg3ll r-1udh08x"]');
      //詳細の表示が委任アカウントか否か
      const summary1 = sumtarget.querySelector('div[class="css-175oi2r r-1awozwy r-1mmae3n r-3o4zer"]');
      const summary2 = sumtarget.querySelector('div[class="css-175oi2r r-1awozwy r-kritb0 r-1m1l54l"]');
      if(summary1 != null){
        if(sumflag === "sum1"){
           summary0.style.display ="flex";
           summary1.style.display ="flex";
        }
        if(sumflag === "sum2"){
           summary0.style.display ="none";
           summary1.style.display ="none";
        }
      }
      if(summary2 != null){
        if(sumflag === "sum1"){
           summary0.style.display ="flex";
           summary2.style.display ="flex";
        }
        if(sumflag === "sum2"){
           summary0.style.display ="none";
           summary2.style.display ="none";
        }
      }
    }else{
        sumctrl();
    }
  }
  sumloopctrl = setTimeout(sumctrl,500)
}

//intervalForEach：要素の削除が早すぎないための処置
const intervalForEach = (callback, array, intervalTime) => {
  let index = 0;
  let ifeloopctrl;
  function processNext() {
   //対象URL以外なら中断
   if (!isProcessing) {
    clearTimeout(ifeloopctrl);
 　 }
    if (index < array.length) {
        if(array[index]){
      callback(array[index]);
        }
      index++;
      ifeloopctrl = setTimeout(processNext, intervalTime);
    }
  }
  processNext();
};


//フィルター
function showchange(){
  let has_photo = node => node.querySelector('[data-testid="tweetPhoto"]');
  let has_video = node => node.querySelector('[data-testid="videoPlayer"]');
  let has_preview = node => node.querySelector('[data-testid="previewInterstitial"]');//予備（以前からあったらしい）
  let has_button = node => node.querySelector('[data-testid="playButton"]')
  let has_card_media = node => node.querySelector('[data-testid*="media"]');
  let has_media = node => [has_photo, has_video, has_button,has_preview,has_card_media].some(f => f(node));
  let has_ret1 = node => node.querySelector('div[class="css-175oi2r r-1iusvr4 r-16y2uox"]');
  let has_ret0 = node => node.querySelector('span[data-testid="socialContext"]');
  let has_ret = node => [has_ret0,has_ret1].every(f => f(node));
  let get_target_parent = node => node.closest("article");
  let set_article_state_1 = node => (get_target_parent(node).style.display = "flex");
  let set_article_state_2 = node => (get_target_parent(node).style.display = !has_ret(node) ? "flex" : "none" );
  let set_article_state_3 = node => (get_target_parent(node).style.display = has_media(node) ? "flex" : "none" );
  let set_article_state_4 = node => (get_target_parent(node).style.display = has_media(node) && !has_ret(node) ? "flex" : "none" );
  let for_each_article = func => intervalForEach(func,Array.from(document.body.querySelectorAll("article")),10);
  let set_all_article_states;
  let filterloopctrl;
  let start_process = async function(){
   clearTimeout(filterloopctrl)
   if(noactE.some(ne =>location.pathname.endsWith(ne)) || noactI.some(ni =>location.pathname.includes(ni))){
//	      set_all_article_states = set_article_state_1;
      isProcessing = false;
      return;
   }else{
      isProcessing = true;
      switch (showflag) {
        case "show1":
          set_all_article_states = set_article_state_1;
          break;
        case "show2":
          set_all_article_states = set_article_state_2;
          break;
        case "show3":
          set_all_article_states = set_article_state_3;
          break;
          case "show4":
          set_all_article_states = set_article_state_4;
          break;
        default:
          set_all_article_states = set_article_state_1;
      }
   }
   for_each_article(set_all_article_states);
   filterloopctrl = setTimeout(start_process,100);
  };
  start_process();
};



//以下自動更新関連

//自動更新本体
function updateIT(){
 let HomeTL
 let ClickTL;
 let reloadloopctrl
   function checkTL(){
      if (location.pathname.endsWith("/home")){
          if(Xlang == "ja"){
            HomeTL = document.querySelector('div[aria-label="ホームタイムライン"]'); //日本語
          }
           if(Xlang == "en"){
            HomeTL = document.querySelector('div[aria-label="Home timeline"]'); //English
          }
        if(HomeTL != null){
            ClickTL= document.querySelector('a[data-testid="AppTabBar_Home_Link"]');
        }
    //読み込み完了かの判定
        if(HomeTL == null){
           ClickTL= null;
        }
      }
   }
   if (!location.pathname.endsWith("/home")) {
       ClickTL= null;
   }
 function execupdateIT(){
    //↓次の処理任せになるので、異常発生時は55行目とともに見直し
    clearTimeout(reloadloopctrl);
    ClickTL = null;
    if (!location.pathname.endsWith("/home")&&!location.pathname.includes("/i/lists/")) {
        relflag = "rel2";
   }
    if (location.pathname.endsWith("/home")){
      if(ClickTL == null){
        checkTL();
      }
      if(ClickTL != null){
            if(relflag === "rel1"){
             relflag = "rel1";
             ClickTL.click();
           }
           if(relflag === "rel2"){
              relflag = "rel2";
           }
       }
     }
     reloadloopctrl= setTimeout(execupdateIT,180000)//120secOK20240415
   }
   setTimeout(execupdateIT,10000)
}


function checkact(){
 if (hasFiltterRun) {
  return; // すでに実行済み
 }else{
 initFiltter();
 }
}

checkact();


})();


