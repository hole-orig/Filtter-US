//20230508：解決部分は削除
//フラグ
let sum_flag;
let showflag;

function listwait(){
//    setTimeout(sendinitFltL("初期化完了"),4000);
    showflag = 0;
    sum_flag = 0;
    window.onmessage = function(event) {
        if (event.data == "hide_sum") {
            sum_flag = 1;
            show_sum();
        }
        else if (event.data == "show_sum") {
            sum_flag = 2 ;
            show_sum();
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
    sendinitFltL("初期化完了");
}

function sendinitFltL(str){
        if (Filtter_L.initFltL){
             try{
             Filtter_L.initFltL(str);
               return;
             }catch(e){
              console.log("クラスがないよ～");
              return;
             }
        }
    return;
}

//function delad(){
//   const target = document.body.querySelector('section[role="region"]');//f
//   const badad = node => node.querySelectorAll('div[data-testid="placementTracking"]');
//   if(target){
//   badad(target).forEach((delbadad) => {delbadad.remove();})
//   }
//}


function delback(){
    if(!location.pathname.startsWith("/home") &&!location.pathname.startsWith("/notifications")){
        let buckbutton = document.body.querySelector('[data-testid="app-bar-back"]');
            if(buckbutton == null){
                return;
            }
             try{
                buckbutton.parentNode.style.display =　"none";
             }
             catch(e){
                console.log("No Button");
            return;
             }
    }
        let btmbar =document.body.querySelectorAll('[data-testid="BottomBar"]');
             if(btmbar == null){
              return;
              console.log("BottomBar not exist.");
             }
             try{
                btmbar.forEach((btmbarALL) => {
                btmbarALL.parentNode.parentNode.style.display =　"none";
                });
              }catch(e){
               console.log("BottomBar can't delete.");
               return;
              }

}

function delad(){
//   const target = document.body.querySelector('div[aria-label="ホームタイムライン"]');//e
   const target = document.body.querySelector('section[role="region"]');//f
   const badad = node => node.querySelectorAll('div[data-testid="placementTracking"]');
   if(target){
   badad(target).forEach((delbadad) => {delbadad.remove();})
   }
}

function show_sum(){
                let show_sum_timer = setTimeout(() => {
                let summaryA;
                const summaryM = document.querySelector('div[class="css-1dbjc4n r-1adg3ll r-1udh08x"]');
                const summaryW = document.querySelector('div[class="css-1dbjc4n r-j5o65s r-qklmqi r-1phboty"]');
//                    if(sum_flag != 2){
//                    clearTimeout(show_sum_timer);
//                    return;
//                    }
                    if (summaryW == null && summaryM == null){
                     console.log("Summary null");
                     return;
                     }
                    if(summaryW == null && summaryM != null){
                    summaryA = summaryM.parentNode.parentNode;
                    }
                    if(summaryM == null && summaryW != null){
                    summaryA = summaryW.parentNode.parentNode;
                    }
                    if(summaryM != null && summaryW != null){
                    summaryA = summaryM.parentNode.parentNode;
                    }
                    navigator.locks.request('show_sum_lock', async lock => {
                    if (sum_flag == 1 && location.pathname.includes("/i/lists/")){
                    summaryA.style.display =　"none";
                    }
                    if (sum_flag == 2 && location.pathname.includes("/i/lists/")){
                    summaryA.style.display =　"block";
                    }
                    });
                 }, 2000);
}

        //↓nullらしい
        let has_photo = node => node.querySelector('[data-testid="tweetPhoto"]');
        let has_video = node => node.querySelector('[data-testid="videoPlayer"]');
        let has_card_media = node => node.querySelector('[data-testid*="media"]');
        let has_media = node => [has_photo, has_video, has_card_media].some(f => f(node));
        let has_ret1 = node => node.querySelector('div[class="css-1dbjc4n r-obd0qt r-1hwvwag r-18kxxzh r-1777fci r-1b7u577"]');
   　　  let has_ret2 = node => node.querySelector('div[class="css-1dbjc4n r-1iusvr4 r-16y2uox"]');
        let has_ret = node => [has_ret1, has_ret2].some(f => f(node));
        let badad = document.querySelector('[data-testid="placementTracking"]');
        let get_target_parent = node => node.parentNode.parentNode.parentNode;
        let set_article_state1 = node => void(get_target_parent(node).style.display = "block");
        let set_article_state2 = node => void(get_target_parent(node).style.display = has_media(node) ? "block" : "none" );
        let set_article_state3 = node => void(get_target_parent(node).style.display = has_ret(node) ? "none" : "block" );
        let set_article_state4 = node => void(get_target_parent(node).style.display = has_media(node) && !has_ret(node) ? "block" : "none" );
        let for_each_article = func => void document.body.querySelectorAll("article").forEach(func);


function showchange(){
    let start_process = function(){
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
        start_process();
       }, 250);

    };

 start_process();
};


//sendinitFltL("初期化中…");
//setTimeout(listwait,4000);
listwait();