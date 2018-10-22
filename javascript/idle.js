var interval;

;(function($){
    // your code
    clearTimeout(interval);
    //do any process and then call the function again
    settimeout();
$(document).on('mousemove keyup keypress',function(){
	clearTimeout(interval);
  //do any process and then call the function again
	settimeout();
});

function settimeout(){
	interval=setTimeout(function(){


    var x = document.getElementById("js-overlay");
    var z = document.getElementById("js-clock");
    var y = document.getElementById("js-search-form");
    var k = document.getElementById("js-search-input");

    x.setAttribute('data-toggled', true);
    z.setAttribute('data-toggled', true);
    y.setAttribute('data-toggled', true);
    k.setAttribute('data-toggled', true);


  },20000);
}
})(jQuery);



/*
var interval;

;(function($){
    // your code
    clearTimeout(interval);
    //do any process and then call the function again
    settimeout();
$(document).on('mousemove keyup keypress',function(){
	clearTimeout(interval);
  //do any process and then call the function again
	settimeout();
})

function settimeout(){
	interval=setTimeout(function(){

    var x = document.getElementById("js-overlay");
    var z = document.getElementById("js-clock");
    var y = document.getElementById("js-search-form");
    var k = document.getElementById("js-search-input");
      if (x.style.visibility === "hidden") {

      } else {
          x.style.visibility = "hidden";
          x.style.opacity = "0";
      }
    //clock
        if (z.style.visibility === "hidden") {

            } else {
            //z.style.right = "calc(50% - 104.5px)";
            z.style.visibility = "hidden";
            z.style.opacity = "0";
            z.style.right = "50%";
            z.style.bottom = "50%";
            z.style.transform = "translate(50%,30%)";

        }


        if (y.style.left === "50%") {

            } else {
            y.style.transform = "translateX(-50%)";
            y.style.left = "calc(50% + 2px)";
            y.style.bottom = "45%";
            k.style.textAlign = "center";

        }
  },20000)
}
})(jQuery);


*/
