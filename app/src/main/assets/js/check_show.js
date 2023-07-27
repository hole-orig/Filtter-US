//OnResourceLoadedでの発火するパターン
function check_show(){
        if(showflag == 1){
        showchange1();
        }
        if(showflag == 2){
        showchange2();
        }
        if(showflag == 3){
        showchange3();
        }
        if(showflag == 4){
        showchange4();
        }
    return;
}

check_show();