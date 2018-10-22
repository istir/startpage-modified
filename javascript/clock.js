     function startTime() {
    var today = new Date();
    var h = today.getHours();                          //24h
    var m = today.getMinutes();
    m = (m < 10) ? "0" + m : m;
    h = (h < 10) ? "0" + h : h;
    document.getElementById("clockh").innerHTML = h + '&nbsp';
    var t = setTimeout(startTime, 60000);
}
startTime()
