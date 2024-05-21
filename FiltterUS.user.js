// ==UserScript==
// @name         Filtter USLiteF
// @namespace    https://x.com/hole_orig
// @version      1.0.6
// @description  Filter for X/Twitter
// @author       hom_hole
// @match        https://twitter.com/*
// @match        https://x.com/*
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
 //   actflag=1;
    showflag =1;
    relflag = 2;
    sumflag =1;
    srelflag =2;
    setTimeout(updateIT,100);
    setTimeout(showchange,100);
    setTimeout(createmenu,2000)
    setTimeout(sumctrl,500)
  }

 let oldloc;
 let oldwidth;
  //メニュー作成実行ここから
 //  function execcreate(){
  //   let navElD =null;
 let navElD;
 //   startcreate();
 function checknavElD(){
     //↓は非モバイル
   if(document.querySelector('div[data-testid="TopNavBar"]') ==null && document.querySelector('div[data-testid="primaryColumn"]') !=null){
      navElD= document.body.querySelector('div[class="css-175oi2r r-aqfbo4 r-gtdqiz r-1gn8etr r-1g40b8q"]');
     }
    //モバイルではTopNavBarの存在するまでに遅延があるので、まず非モバイルか判断し、それ以外はモバイルという判定に
     //以前から気になっていたが、&&条件でのざっくりしたelse文は先に判定がかかってしまうらしい（ifと同時に判定が下れば、要素が確立されるまでにelseに入ってしまう？）
    if(document.querySelector('div[data-testid="TopNavBar"]') !=null || document.querySelector('div[data-testid="primaryColumn"]') ==null){
     navElD = document.querySelector('div[data-testid="BottomBar"]');
    }
     if(document.querySelector('div[data-testid="TopNavBar"]') ==null && document.querySelector('div[data-testid="primaryColumn"]') ==null){
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
 //   createnavmenuelm()}
 //   function createnavmenuelm(){
    let navmenu;
    navmenu = document.createElement("div");
    navmenu.id = "navmenudiv"
     if(location.pathname.endsWith("/home")){
        navmenu.innerHTML= '<div><select id="filtnav" style="display:inline-block;background-color:#102030; color:white;text-align:right; height:22px; width:70%; padding:0; margin:0; font-size:18px; border:1px solid;" title="フィルター"><option value="All">全て表示</option><option value="ExRP">リポスト非表示</option><option value="Media">メディアのみ</option><option value="ExRP_Media">リポスト非表示/メディアのみ</option></select><select id="relselect" name="homeselect" style="display:inline-block;background-color:#102030; color:white;text-align:right; height:22px; width:30%; padding:0; margin:0; font-size:18px; border:1px solid;"><option value="autorel" title="更新">自動更新</option><option value="manurel">手動更新</option></select></div>';
       }
      if(location.pathname.includes("/i/lists")){
            navmenu.innerHTML= '<div><select id="filtnav" style="display:inline-block;background-color:#102030; color:white;text-align:right; height:22px; width:70%; padding:0; margin:0; font-size:18px; border:1px solid;" title="フィルター"><option value="All">全て表示</option><option value="ExRP">リポスト非表示</option><option value="Media">メディアのみ</option><option value="ExRP_Media">リポスト非表示/メディアのみ</option></select><select id="sumselect" name="listselect" style="display:inline-block;background-color:#102030; color:white;text-align:right; height:22px; width:30%; padding:0; margin:0; font-size:18px; border:1px solid;"><option value="showsum" title="詳細">詳細表示</option><option value="hidesum">詳細非表示</option></select></div>';
       }
      if(!location.pathname.includes("/i/lists/") && !location.pathname.endsWith("/home")){
            navmenu.innerHTML= '<div><select id="filtnav" style="display:inline-block;background-color:#102030; color:white;text-align:right; height:22px; width:70%; padding:0; margin:0; font-size:18px; border:1px solid;" title="フィルター"><option value="All">全て表示</option><option value="ExRP">リポスト非表示</option><option value="Media">メディアのみ</option><option value="ExRP_Media">リポスト非表示/メディアのみ</option></select><select id="noselect" name="notwork" style="display:inline-block;background-color:#102030; color:white;text-align:center; height:22px; width:30%; padding:0; margin:0; font-size:18px; border:1px solid;"><option value="showsum" title="無し">-</option></select></div>';
       }
        if(location.pathname.endsWith("/explore") || location.pathname.endsWith("/settings") || location.pathname.endsWith("/messages") || location.pathname.includes("/compose/post") || location.pathname.includes("/status/") || location.pathname.endsWith("/notifications")|| location.pathname.endsWith("/timeline") ||location.pathname.endsWith("/lists")||location.pathname.endsWith("/verified-choose")||location.pathname.endsWith("/verified-choose")||location.pathname.endsWith("/communities")){
        navmenu.innerHTML="";
        }
      navElD.prepend(navmenu);
      menuact();
      //メニューが作成されたときのURLを格納
      oldloc= location.href;
      oldwidth = window.innerWidth;
    }
 }
  //メニュー作成ここまで
  //メニュー動作ここから(これらは同時に発生させたいのでひとくくりに)
  //フィルタメニュー動作ここから
 function menuact(){
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

   //フィルタメニュー動作ここまで
   //リロードメニュー動作ここから
    if(document.getElementById("relselect")!=null){
    const relnav = document.getElementById("relselect");
    relnav.addEventListener('change',setRel);
      function setRel(){
        let flagra = relnav.value;
       if(flagra =="autorel"){
       srelflag=1;
       updatectrl();
       }
       if(flagra =="manurel"){
        srelflag=2;
        updatectrl();
       }
     }
      if(relflag =="1"){
       document.getElementById("relselect").options[0].selected = true;
       }
      if(relflag =="2"){
       document.getElementById("relselect").options[1].selected = true;
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
       sumflag=1;
       }
       if(flagsum =="hidesum"){
        sumflag=2;
       }
     }
      if(sumflag =="1"){
       document.getElementById("sumselect").options[0].selected = true;
       }
      if(sumflag =="2"){
       document.getElementById("sumselect").options[1].selected = true;
       }
    }
    //詳細表示メニュー動作ここまで
    //displaymenu();
  }
 }
 //}
 //メニュー作成実行ここまで
 //メニュー表示ここから
//-
 //メニュー表示ここまで
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
          if(location.href==oldloc){
            if(window.innerWidth != oldwidth){
              navElm.remove();
            }
            if(navElm.style.display=!"block"){
              navElm.style.display="block"
            }
         }
    //↓ないとnullかnonnullかの判定がかからない         
        setTimeout(createmenu,2000);
         }
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
                 if (sumflag =="1"){
                  summary1.parentNode.parentNode.style.display ="block";
                 }
                 if (sumflag =="2"){
                  summary1.parentNode.parentNode.style.display ="none";
                 }
                }
               if(summary2 !=null){
                if (sumflag =="1"){
                 summary2.parentNode.parentNode.style.display ="block";
                 }
                if (sumflag =="2"){
                  summary2.parentNode.parentNode.style.display ="none";
                }
             }
           }
           setTimeout(sumflagctrl,500)
       }
       sumflagctrl();
 }

 //フィルター
  let target = document.querySelector('[data-testid="primaryColumn"]');
  let has_photo = node => node.querySelector('[data-testid="tweetPhoto"]');
  let has_video = node => node.querySelector('[data-testid="videoPlayer"]');
  let has_card_media = node => node.querySelector('[data-testid*="media"]');
  let has_media = node => [has_photo, has_video, has_card_media].some(f => f(node));
  let has_ret1 = node => node.querySelector('div[class="css-175oi2r r-1iusvr4 r-16y2uox"]');
  let has_ret0 = node => node.querySelector('span[data-testid="socialContext"]');
  let has_ret = node => [has_ret0,has_ret1].every(f => f(node));
  let get_target_parent = node => node.parentNode.parentNode;
 // let get_target_parent = node => node.parentNode;
  let set_article_state1 = node => void(get_target_parent(node).style.display = "block");
  let set_article_state2 = node => void(get_target_parent(node).style.display = has_media(node) ? "block" : "none" );
  let set_article_state3 = node => void(get_target_parent(node).style.display = !has_ret(node) ? "block" : "none" );
  let set_article_state4 = node => void(get_target_parent(node).style.display = has_media(node) && !has_ret(node) ? "block" : "none" );
  let for_each_article = func => void document.body.querySelectorAll("article").forEach(func);
  let set_all_article_states;


   function showchange(){
    let start_process = function(target){
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
      if( !location.pathname.includes("/explore") &&!location.pathname.includes("/messages") &&!location.pathname.includes("/compose/tweet") && !location.pathname.includes("/status/") && !location.pathname.endsWith("/notifications")&& !location.pathname.endsWith("/timeline") && !location.pathname.endsWith("/lists")||location.pathname.endsWith("/communities")){
 //       navigator.locks.request('show_lock', async lock => {
         set_all_article_states(target);
 //       })
        }
      clearTimeout(timemonr)
      start_process();
     }, 250);
    };
   start_process();
  };

   //自動更新スクロール時の挙動
   function updatectrl(){
    const relnav = document.getElementById("relselect");
       if(location.pathname.endsWith("/home")&&relnav!=null){
        if(srelflag=="1"){
          if(window.scrollY>=150){
            relflag = 2;
            relnav.options[1].selected = true;
           };
         if(window.scrollY<100){
            relflag = 1;
           relnav.options[0].selected = true;
          }
        }
       if(srelflag=="2"){
           relflag = 2;
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
     ;
     }
      if (location.pathname.endsWith("/home")){
        if(ClickTL == null){
          checkTL();
        }
        if(ClickTL != null){
              if(relflag == 1){
               relflag = 1;
               ClickTL.click();
             }
             if(relflag == 2){
                relflag = 2;
             }
        }
     }
     setTimeout(execupdateIT,180000)//120secOK20240415
    }
   setTimeout(execupdateIT,10000)
 }

 initFiltter();

 })();



