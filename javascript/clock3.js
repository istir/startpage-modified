class Clock1 {
  constructor() {
    this._clockEl = $.el('#js-clock1');
    this._setTime = this._setTime.bind(this);
    this._start();
  }

  _pad(num) {
    return (`0${num.toString()}`).slice(-2);
  }

  _setTime() {
    const date = new Date();
    const hours = this._pad(date.getHours());
    const minutes = this._pad(date.getMinutes());
    this._clockEl.innerHTML = `${hours}${CONFIG.clockDelimiter}${minutes}`;
  }

  _start() {
    this._setTime();
    setInterval(this._setTime, 1000);
  }
}
