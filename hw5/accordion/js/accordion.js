function init(){
    hide_all(1);
}
function hide_all(init){
    var divs = document.getElementsByClassName("accordion__item");
    for (var i=0; i<divs.length; i++){
        console.log(init);
        if (init == 1){
            divs[i].getElementsByTagName("h2")[0].onclick = toggleItem;
        }
        divs[i].classList.remove("active");
    }
}
function toggleItem(){
    if (this.parentNode.classList.contains("active")) {
        hide_all();
        this.parentNode.classList.remove("active");
    } else {
        hide_all();
        this.parentNode.classList.add("active");
    }
}
