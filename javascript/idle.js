var interval;

;
(function($) {
  clearTimeout(interval);
  settimeout();
  $(document).on('mousemove keyup keypress', function() {
    clearTimeout(interval);
    settimeout();
  });

  function settimeout() {
    interval = setTimeout(function() {
      var x = document.getElementById('js-overlay');
      var z = document.getElementById('js-clock');
      var y = document.getElementById('js-search-form');
      var k = document.getElementById('js-search-input');
      x.setAttribute('data-toggled', true);
      z.setAttribute('data-toggled', true);
      y.setAttribute('data-toggled', true);
      k.setAttribute('data-toggled', true);
    }, 20000);
  }
})(jQuery);
