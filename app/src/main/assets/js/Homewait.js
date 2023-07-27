//20230508：解決部分は削除
//ListWaitと共通で、参考になりそうなものは残し
//フラグ
let relflag;
let showflag;

function homewait(){
//    setTimeout(initMain("初期化完了"),4000);
    showflag = 0;
    relflag = 0;
    window.onmessage = function(event) {
        if (event.data == "auto_rel") {
        relflag = 1;
    	 }
        else if (event.data == "manu_rel") {
        relflag = 2;
        }
        else if (event.data == "show_all") {
        showflag = 1;
	    }
        else if (event.data == "media_only") {
        showflag = 2;
         }
        else if (event.data == "exclude_retweet") {
        showflag = 3;
        }
        else if (event.data == "media_noret_only") {
        showflag = 4;
        }

    }
    showchange();
    initMain("初期化中");
    UpdateIT();
//    delback();
//    delad();
}

function initMain(str){
    if (Filtter_M.initFltM){
        try{
            Filtter_M.initFltM(str);
            return;
        }catch(e){
             console.log("クラスがないよ～");
            return;
        }
    }
    return;
}

//function delback(){
//    if(location.pathname.endsWith("/switch")){
//        let buckbutton = document.body.querySelector('[data-testid="app-bar-back"]');
//            if(buckbutton == null){
//                return;
//            }
//             try{
//                buckbutton.parentNode.style.display =　"none";
//             }
//             catch(e){
//                console.log("No Button");
//            return;
//             }
//    }
//}

function delad(){
//   const target = document.body.querySelector('div[aria-label="ホームタイムライン"]');//e
   const target = document.body.querySelector('section[role="region"]');//f
   const badad = node => node.querySelectorAll('div[data-testid="placementTracking"]');
   if(target){
   badad(target).forEach((delbadad) => {delbadad.remove();})
   }
}

function UpdateIT(){
//var ClickTL;
setTimeout(function(){
    if (location.pathname != "/home") {
    console.log("not home")
    };
   if (location.pathname == "/home") {
     let HomeTLW = document.querySelector('div[aria-label="ホームタイムライン"]');
     let HomeTLM = document.querySelector('div[data-testid="TopNavBar"]');
     let UpdateTL;
     if(HomeTLW == null && HomeTLM == null){
     console.log("HomeTL null");
              }
     if(HomeTLW != null && HomeTLM == null){
        UpdateTL= document.querySelector('div[class="css-1dbjc4n r-16y2uox r-1wbh5a2 r-1pi2tsx r-1777fci"]');
        console.log("M_null")
     }
     if(HomeTLM != null){
        UpdateTL = document.querySelector('div[class="css-1dbjc4n r-1awozwy r-16y2uox r-1wbh5a2 r-1pi2tsx r-1777fci"]');
     }
//     if(ClickTL!= null){
//       let UpdateTL = ClickTL;
//     }
     if(UpdateTL == null){
     console.log("UpdateTL null");
     }
     navigator.locks.request('ClickLock', async lock => {
     if(relflag == 0){
        if(relflag =!0){
           console.log(relflag);
           relflag = 0;
        }
        relflag = 0;
//        console.log("relflag "+relflag);
      }

     if(relflag == 1){
        if(relflag =!1){
        console.log(relflag);
         }
         relflag = 1;
         console.log("relflag "+relflag);
         UpdateTL.click();
     }

     if(relflag == 2){
        if(relflag =!2){
        console.log(relflag);
        }
        relflag = 2;
        console.log("relflag "+relflag);
        }
    console.log("showflagH "+showflag);
     })
     }
     UpdateIT();
    },30000)
}

   let has_photo = node => node.querySelector('[data-testid="tweetPhoto"]');
   let has_video = node => node.querySelector('[data-testid="videoPlayer"]');
   let has_card_media = node => node.querySelector('[data-testid*="media"]');
   let has_media = node => [has_photo, has_video, has_card_media].some(f => f(node));
   let has_ret1 = node => node.querySelector('div[class="css-1dbjc4n r-obd0qt r-1hwvwag r-18kxxzh r-1777fci r-1b7u577"]');
   let has_ret2 = node => node.querySelector('div[class="css-1dbjc4n r-1iusvr4 r-16y2uox"]');
   let has_ret = node => [has_ret1, has_ret2].some(f => f(node));
   let get_target_parent = node => node.parentNode.parentNode.parentNode;
   let set_article_state1 = node => void(get_target_parent(node).style.display =  "block" );
   let set_article_state2 = node => void(get_target_parent(node).style.display = has_media(node)  ? "block" : "none" );
   let set_article_state3 = node => void(get_target_parent(node).style.display = !has_ret(node)  ? "block" : "none" );
   let set_article_state4 = node => void(get_target_parent(node).style.display = has_media(node) && !has_ret(node)   ? "block" : "none" );
   let for_each_article = func => void document.body.querySelectorAll("article").forEach(func);



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
      if( !location.pathname.includes("/compose/tweet") && !location.pathname.includes("/status/") && !location.pathname.endsWith("/notifications")&& !location.pathname.endsWith("/timeline") && !location.pathname.endsWith("/lists")){
        navigator.locks.request('show_lock', async lock => {
         set_all_article_states();
        delad();
        })
        }
      clearTimeout(timemonr)
      start_process();
     }, 200);

    };
 start_process();
};
//----



//initMain("初期化中…");
//setTimeout(homewait,500);
homewait();
//setInterval(UpdateIT,30000);