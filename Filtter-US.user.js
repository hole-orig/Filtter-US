// ==UserScript==
// @name         Filtter-US
// @namespace    https://x.com/hole_orig
// @version      2.4.9.8
// @description  Filter for X/Twitter
// @author       hole_orig
// @match        https://twitter.com/*
// @match        https://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @grant        none
// ==/UserScript==

(function() {
//20240603　フラグを"なんだかわからない"数字　から文字列へ

'use strict';
let showflag = new String();
let relflag = new String();
let sumflag = new String();
let srelflag = new String();
const noactE = ["/explore","/settings","/messages","/notifications","/timeline","/lists","/verified-choose","/communities"]
const noactI = ["/compose/post","/status/","/i/premium_sign_up"]

function initFiltter(){
  showflag = "show1";
  relflag = "rel2";
  sumflag ="sum1";
  srelflag ="srel2";
  setTimeout(updateIT,1000);
  setTimeout(showchange,1000);
  setTimeout(createmenu,2000)
  setTimeout(sumctrl,1000)
}

//メニュー作成本体ここから
let oldloc;
let oldsize;
let navElD;
function checknavElD(){
   //↓は非モバイル
 if(document.querySelector('div[data-testid="TopNavBar"]') ==null && document.querySelector('div[role="progressbar"]') !=null){
    navElD= document.body.querySelector('div[class="css-175oi2r r-aqfbo4 r-gtdqiz r-1gn8etr r-1g40b8q"]');
   }
  if(document.querySelector('div[data-testid="TopNavBar"]') !=null || document.querySelector('div[role="progressbar"]') ==null){
   navElD = document.querySelector('div[data-testid="BottomBar"]');
  }
   if(document.querySelector('div[data-testid="TopNavBar"]') ==null && document.querySelector('div[role="progressbar"]') ==null){
     navElD= null;
    }
}

function startcreate(){
  navElD = null
  if(navElD==null){
     //execcreate();
      checknavElD();
  }
  if(navElD !=null){
   createnavmenuelm();
  }
   function createnavmenuelm(){
  let navmenu;
  navmenu = document.createElement("div");
  navmenu.id = "navmenudiv"
   if(location.pathname.endsWith("/home")){
      navmenu.innerHTML= '<div><select id="filtnav" style="display:inline-block;background-color:#102030; color:white;text-align:right; height:22px; width:70%; padding:0; margin:0; font-size:18px; border:1px solid;" title="フィルター"><option value="All">全て表示</option><option value="ExRP">リポスト非表示</option><option value="Media">メディアのみ</option><option value="ExRP_Media">リポスト非表示/メディアのみ</option></select><select id="relselect" name="homeselect" style="display:inline-block;background-color:#102030; color:white;text-align:right; height:22px; width:30%; padding:0; margin:0; font-size:18px; border:1px solid;"><option value="manurel">手動更新</option><option value="autorel" title="更新">自動更新</option></select></div>';
     }
    if(location.pathname.includes("/i/lists")){
          navmenu.innerHTML= '<div><select id="filtnav" style="display:inline-block;background-color:#102030; color:white;text-align:right; height:22px; width:70%; padding:0; margin:0; font-size:18px; border:1px solid;" title="フィルター"><option value="All">全て表示</option><option value="ExRP">リポスト非表示</option><option value="Media">メディアのみ</option><option value="ExRP_Media">リポスト非表示/メディアのみ</option></select><select id="sumselect" name="listselect" style="display:inline-block;background-color:#102030; color:white;text-align:right; height:22px; width:30%; padding:0; margin:0; font-size:18px; border:1px solid;"><option value="showsum" title="詳細">詳細表示</option><option value="hidesum">詳細非表示</option></select></div>';
     }
    if(!location.pathname.includes("/i/lists/") && !location.pathname.endsWith("/home")){
          navmenu.innerHTML= '<div><select id="filtnav" style="display:inline-block;background-color:#102030; color:white;text-align:right; height:22px; width:70%; padding:0; margin:0; font-size:18px; border:1px solid;" title="フィルター"><option value="All">全て表示</option><option value="ExRP">リポスト非表示</option><option value="Media">メディアのみ</option><option value="ExRP_Media">リポスト非表示/メディアのみ</option></select><select id="noselect" name="notwork" style="display:inline-block;background-color:#102030; color:white;text-align:center; height:22px; width:30%; padding:0; margin:0; font-size:18px; border:1px solid;"><option value="showsum" title="無し">-</option></select></div>';
     }
     if(noactE.some(ne =>location.pathname.endsWith(ne)) || noactI.some(ni =>location.pathname.includes(ni))){
       navmenu.style.display="none";
//       //  navmenu.style.display ="none";使わない方がいい
      }
    navElD.prepend(navmenu);
    menuact();
    //メニューが作成されたときのURLを格納
    oldloc= location.href;
    oldsize = window.innerWidth;
  }
}

//メニュー作成本体ここまで
//メニュー動作ここから(これらは同時に発生させたいのでひとくくりに)
//フィルタメニュー動作ここから
function menuact(){
  if(document.getElementById("filtnav") !=null){
   const filtternav = document.getElementById("filtnav");
   filtternav.addEventListener('change',setFilt);
    function setFilt(){
      let flaga = filtternav.value;
     if(flaga =="All"){
     showflag ="show1";
     }
     if(flaga =="ExRP"){
        showflag ="show2";
     }
     if(flaga =="Media"){
       showflag ="show3";
     }
     if(flaga =="ExRP_Media"){
      showflag ="show4";
     }
  }
  if(showflag =="show1"){
    filtternav.options[0].selected = true;
    }
  if(showflag =="show2"){
    filtternav.options[1].selected = true;
                        }
 if(showflag =="show3"){
    filtternav.options[2].selected = true;
   }
  if(showflag =="show4"){
    filtternav.options[3].selected = true;
  }

 //フィルタメニュー動作ここまで
 //リロードメニュー動作ここから
  if(document.getElementById("relselect")!=null){
  const relnav = document.getElementById("relselect");
  relnav.addEventListener('change',setRel);
    function setRel(){
      let flagra = relnav.value;
     if(flagra =="autorel"){
     srelflag="srel1";
     updatectrl();
     }
     if(flagra =="manurel"){
      srelflag="srel2";
      updatectrl();
     }
   }
    if(relflag =="rel1"){
     document.getElementById("relselect").options[1].selected = true;
     }
    if(relflag =="rel2"){
     document.getElementById("relselect").options[0].selected = true;
     }
  }
  //リロードメニュー動作ここまで
  //詳細表示メニュー動作ここから
  if(document.getElementById("sumselect")!=null){
  const sumnav = document.getElementById("sumselect");
  sumnav.addEventListener('change',setSum);
    function setSum(){
      let flagsum = sumnav.value;
     if(flagsum =="showsum"){
     sumflag="sum1";
     }
     if(flagsum =="hidesum"){
      sumflag="sum2";
     }
   }
    if(sumflag =="sum2"){
     document.getElementById("sumselect").options[1].selected = true;
     }
    if(sumflag =="sum1"){
     document.getElementById("sumselect").options[0].selected = true;
     }
  }
  //詳細表示メニュー動作ここまで
  //displaymenu();
 }
}
//}
//メニュー作成ここまで
//メニュー作成実行
  function createmenu(){
    const navElm = document.getElementById("navmenudiv");
      if(navElm ==null){
          startcreate();
       }
      if(navElm != null){
        if(location.href!=oldloc)
        {
          navElm.remove();
        }
      //↓委任アカウント変更→戻り時に動作しなくなってしまう 20231225イベント駆動にしたら改善？
        if(location.href==oldloc){
        //表示、これを実行するのは作成が終わった後であることが保証されないといけないためここ
            if(window.innerWidth != oldsize){
              navElm.remove();
            }
            if(navElm.style.display=!"block"){
            navElm.style.display="block"
            }
        }
       }
 //↓ないとnullかnonnullかの判定がかからない…けど今は要らないかも？
      setTimeout(createmenu,2000);
}


//詳細メニュー動作
function sumctrl(){
     function sumflagctrl(){
         if(location.pathname.includes("/i/lists/")&&!location.pathname.endsWith("/add_member")){
             let sumtarget = document.querySelector('main[role="main"]')
             //詳細の表示が委任アカウントか否か
             let summary1 = sumtarget.querySelector('div[class="css-175oi2r r-1awozwy r-18u37iz r-1777fci r-6gpygo r-13qz1uu"]');
             let summary2 = sumtarget.querySelector('div[class="css-175oi2r r-1awozwy r-18u37iz r-1777fci r-1a8r3js r-13qz1uu"]');
             if(summary1 !=null){
               if (sumflag =="sum1"){
                summary1.parentNode.parentNode.style.display ="block";
               }
               if (sumflag =="sum2"){
                summary1.parentNode.parentNode.style.display ="none";
               }
              }
             if(summary2 !=null){
              if (sumflag =="sum1"){
               summary2.parentNode.parentNode.style.display ="block";
               }
              if (sumflag =="sum2"){
                summary2.parentNode.parentNode.style.display ="none";
              }
           }
         }
         setTimeout(sumflagctrl,500)
     }
     sumflagctrl();
}

const intervalForEach = (callback, array, intervalTime) => {
  let length = array.length;
  let index = 0;
  let settest
   function intfe(){
      if (index > (length - 1)) {
          clearTimeout(settest);
      }
     else {
          settest = setTimeout(() =>{callback(array[index], index);
          index += 1;
          intfe()
          },intervalTime)
      }
   }
   intfe();
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
  let get_target_parent = node => node.closest("article").parentNode.parentNode;
  let set_article_state_1 = node => void(get_target_parent(node).style.display = "block");
  let set_article_state_2 = node => void(get_target_parent(node).style.display = !has_ret(node) ? "block" : "none" );
  let set_article_state_3 = node => void(get_target_parent(node).style.display = has_media(node) ? "block" : "none" );
  let set_article_state_4 = node => void(get_target_parent(node).style.display = has_media(node) && !has_ret(node) ? "block" : "none" );
  let for_each_article = func => void intervalForEach(func,Array.from(document.body.querySelectorAll("article")),10);
  let set_all_article_states;
  let start_process = function(){
   if(noactE.some(ne =>location.pathname.endsWith(ne)) || noactI.some(ni =>location.pathname.includes(ni))){
      set_all_article_states = () => void function(){return};
   }
else{
    if (showflag =="show1"){
        set_all_article_states = () => void for_each_article(set_article_state_1);
    }
    if (showflag =="show2"){
        set_all_article_states = () => void for_each_article(set_article_state_2);
    }
    if (showflag =="show3"){
       set_all_article_states = () => void for_each_article(set_article_state_3);
    }
    if (showflag =="show4"){
       set_all_article_states = () => void for_each_article(set_article_state_4);
    }
   }
     setTimeout(function(){
     set_all_article_states();
     start_process();}
    ,10);
    };
  start_process();
 };

//以下自動更新関連
 //自動更新スクロール時の挙動
 function updatectrl(){
  const relnav = document.getElementById("relselect");
     if(location.pathname.endsWith("/home")&&relnav!=null){
      if(srelflag=="srel1"){
        if(window.scrollY>=100){
          relflag = "rel2";
          relnav.options[0].selected = true;
         };
       if(window.scrollY<50){
          relflag = "rel1";
         relnav.options[1].selected = true;
        }
      }
     if(srelflag=="srel2"){
         relflag = "rel2";
     }
    }
 }
document.addEventListener('scroll',updatectrl);

 function updateIT(){
  let HomeTLW;
  let HomeTLM;
  let ClickTL;
   function checkTL(){
      if (location.pathname.endsWith("/home")){
      HomeTLW = document.querySelector('div[data-testid="primaryColumn"]'); //デスクトップ
      HomeTLM = document.querySelector('div[data-testid="TopNavBar"]'); //モバイル
        if(HomeTLW != null || HomeTLM != null){
            ClickTL= document.querySelector('a[data-testid="AppTabBar_Home_Link"]');
        }
    //読み込み完了かの判定
        if(HomeTLW == null && HomeTLM == null){
           ClickTL= null;
        }
      }
   }
   if (!location.pathname.endsWith("/home")) {
       ClickTL= null;
   }
   function execupdateIT(){
//    checkTL(); //OK
    //↓次の処理任せになるので、異常発生時は55行目とともに見直し
    ClickTL = null;
    if (!location.pathname.endsWith("/home")) {
   relflag = "rel0";
   }
    if (location.pathname.endsWith("/home")){
      if(ClickTL == null){
        checkTL();
      }
      if(ClickTL != null){
           if(relflag == "rel0"){
             relflag = "rel0";
           }
            if(relflag == "rel1"){
             relflag = "rel1";
             ClickTL.click();
           }
           if(relflag =="rel2"){
              relflag = "rel2";
           }
       }
     }
//    setTimeout(execupdateIT,180000)//120secOK20240415
   }
//   setTimeout(execupdateIT,10000)
    setInterval(execupdateIT,120000)//120secOK20240415
 }

initFiltter();
 })();


