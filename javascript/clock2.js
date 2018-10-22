function startTime() {
var today = new Date();
var h = today.getHours();                          //24h
var m = today.getMinutes();
m = (m < 10) ? "0" + m : m;
h = (h < 10) ? "0" + h : h;
document.getElementById("clockm").innerHTML = '&nbsp' + m;
var t = setTimeout(startTime, 1000);
}
startTime()
