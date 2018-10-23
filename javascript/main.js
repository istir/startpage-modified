function hide() {

  var x = document.getElementById("js-overlay");
  var z = document.getElementById("js-clock");
  var y = document.getElementById("js-search-form");
  var k = document.getElementById("js-search-input");

  const toggle = (typeof show !== 'undefined') ? show :
    x.getAttribute('data-toggled') !== 'true';

  x.setAttribute('data-toggled', toggle);
  z.setAttribute('data-toggled', toggle);
  y.setAttribute('data-toggled', toggle);
  k.setAttribute('data-toggled', toggle);

}

  const $ = {
    el: s => document.querySelector(s),
    els: s => [].slice.call(document.querySelectorAll(s) || []),

    jsonp: url => {
      let script = document.createElement('script');
      script.src = url;
      $.el('head').appendChild(script);
    },
  };
  class Clock1 {
    constructor() {
      this._clockEl = $.el('#clockh');
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
      this._clockEl.innerHTML = `${hours}${CONFIG.clockDelimiter}`;
    }

    _start() {
      this._setTime();
      setInterval(this._setTime, 1000);
    }
  }
  class Clock {
    constructor() {
      this._clockEl = $.el('#js-clock');
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

  class Help {
    constructor() {
      this._overlayEl = $.el('#js-overlay');
      this._clockEl = $.el('#js-clock');
      this._listsEl = $.el('#js-lists');
      this._searchEl = $.el('#js-search-form');
      this._handleKeydown = this._handleKeydown.bind(this);
      this._buildAndAppendLists();
      this._registerEvents();
    }

    toggle(show) {
         const toggle = (typeof show !== 'undefined') ? show :
           this._overlayEl.getAttribute('data-toggled') !== 'true';

         this._overlayEl.setAttribute('data-toggled', toggle);
         this._clockEl.setAttribute('data-toggled', toggle);
         this._searchEl.setAttribute('data-toggled', toggle);
       }

    _buildAndAppendLists() {
      CONFIG.categories.forEach(category => {
        this._listsEl.insertAdjacentHTML(
          'beforeend',
          `<li class="category">
            <h2 class="category-name">${category.name}</h2>
            <ul>${this._buildListCommands(category)}</ul>
          </li>`
        );
      });
    }

    _buildListCommands(category) {
      return category.commands.map(({ url, key, name }) => (
        `<li class="command">
          <a href="${url}" target="${CONFIG.newTab ? '_blank' : '_self'}">
            <span class="command-key">${key}</span>
            <span class="command-name">${name}</span>
          </a>
        </li>`
      )).join('');
    }

    _handleKeydown(event) {
      const isEsc = event.which === 27;
      if (isEsc) this.$(false);
    }

    _registerEvents() {
      document.addEventListener('keydown', this._handleKeydown);
    }
  }

  class History {
    constructor(suggestionsLimit = 0) {
      this._suggestionsLimit = suggestionsLimit;
      this._history = this._getFromStorage('history');
    }

    addItem(query) {
      if (query.length < 2) return;
      this._updateHistory(query);
      this._sortHistory();
      this._saveToStorage('history', this._history);
    }

    getSuggestionsPromise(query) {
      return new Promise(resolve => {
        const suggestions = this._history
          .filter(item => this._itemContainsQuery(query, item[0]))
          .slice(0, this._suggestionsLimit)
          .map(item => item[0]);

        resolve(suggestions);
      });
    }

    _getFromStorage(name) {
      return JSON.parse(localStorage.getItem(name)) || [];
    }

    _itemContainsQuery(query, item) {
      return query && item.indexOf(query) !== -1;
    }

    _saveToStorage(name, data) {
      localStorage.setItem(name, JSON.stringify(data));
    }

    _sortHistory() {
      this._history = this._history
        .sort((current, next) => current[1] - next[1])
        .reverse();
    }

    _updateHistory(query) {
      let exists = false;

      this._history = this._history.map(item => {
        if (item[0] === query) {
          item[1]++;
          exists = true;
        }

        return item
      });

      if (!exists) this._history.push([query, 1]);
    }
  }

  class DuckDuckGo {
    constructor(suggestionsLimit = 0) {
      this._endpoint = 'https://duckduckgo.com/ac';
      this._callback = 'autocompleteCallback';
      this._suggestionsLimit = suggestionsLimit;
    }

    addItem() {}

    getSuggestionsPromise(query) {
      return new Promise(resolve => {
        this._resolve = resolve;
        window[this._callback] = this._handleResponse.bind(this);
        $.jsonp(`${this._endpoint}?callback=${this._callback}&q=${query}`);
      });
    }

    _handleResponse(res) {
      const suggestions = res.slice(0, this._suggestionsLimit)
        .map(i => i.phrase);

      this._resolve(suggestions);
    }
  }

  class Suggester {
    constructor(influencers) {
      this._inputEl = $.el('#js-search-input');
      this._suggestionsEl = $.el('#js-search-suggestions');
      this._totalSuggestions = 0;
      this._suggestionEls = [];
      this._influencers = influencers;
      this._handleKeydown = this._handleKeydown.bind(this);
      document.addEventListener('keydown', this._handleKeydown);
    }

    add(query) {
      this._influencers.forEach(i => i.addItem(query));
    }

    suggest(input, clickCallback = () => {}) {
      input = input.trim();

      if (!input) {
        this._clearSuggestions();
        return;
      }

      this._handleClick = clickCallback;
      this._suggest(input);
    }

    _appendSuggestion(suggestion) {
      this._suggestionsEl.insertAdjacentHTML(
        'beforeend',
        `<li>
          <input
            class="js-search-suggestion search-suggestion"
            type="button"
            value="${suggestion}"
          >
        </li>`
      );

      this._inputEl.classList.add('bottom-no-radius');
      return ++this._totalSuggestions === CONFIG.suggestionsLimit;
    }

    _clearClickEvents() {
      this._suggestionEls.forEach(el => {
        const callback = this._handleClick.bind(null, el.value);
        el.removeEventListener('click', callback);
      });
    }

    _clearSuggestions() {
      this._totalSuggestions = 0;
      this._clearClickEvents();
      this._suggestionsEl.innerHTML = '';
      this._inputEl.classList.remove('bottom-no-radius');
    }

    // [[1, 2], [1, 2, 3, 4]] -> [1, 2, 3, 4]
    _flattenAndUnique(array) {
      return [...new Set([].concat.apply([], array))];
    }

    _focusNext() {
      if (this._suggestionEls.length) {
        const active = document.activeElement;

        if (active.classList.contains('js-search-suggestion')) {
          this._suggestionEls.forEach((el, index) => {
            const nextSuggestion = this._suggestionEls[index + 1];
            if (el === active && nextSuggestion) nextSuggestion.focus();
          });
        } else {
          this._suggestionEls[0].focus();
        }
      }
    }

    _focusPrevious() {
      if (this._suggestionEls.length) {
        const active = document.activeElement;

        if (active.classList.contains('js-search-suggestion')) {
          this._suggestionEls.forEach((el, index) => {
            if (el === active) {
              const previousSuggestion = this._suggestionEls[index - 1];
              if (previousSuggestion) previousSuggestion.focus();
              else this._inputEl.focus();
            }
          });
        }
      }
    }

    _gatherInfluencers(input) {
      return this._influencers
        .map(influencer => influencer.getSuggestionsPromise(input));
    }

    _handleKeydown(event) {
      const isDown = event.which === 40;
      const isUp = event.which === 38;
      const isCtrlN = event.which === 78 && event.ctrlKey;
      const isCtrlP = event.which === 80 && event.ctrlKey;
      if (isDown || isDown || isCtrlN || isCtrlP) event.preventDefault();
      if (isDown || isCtrlN) this._focusNext();
      if (isUp || isCtrlP) this._focusPrevious();
    }

    _registerClickEvents() {
      this._suggestionEls.forEach(el => {
        el.addEventListener('click', this._handleClick.bind(null, el.value));
      });
    }

    _suggest(input) {
      Promise.all(this._gatherInfluencers(input)).then(res => {
        this._clearSuggestions();

        this._flattenAndUnique(res)
          .some(item => this._appendSuggestion(item));

        this._suggestionEls = $.els('.js-search-suggestion');
        this._registerClickEvents();
      });
    }
  }

  class QueryParser {
    generateRedirect(query) {
      const encodedQuery = encodeURIComponent(query);
      let redirectUrl = CONFIG.defaultSearch.replace('{}', encodedQuery);

      if (query.match(CONFIG.urlRegex)) {
        const hasProtocol = query.match(CONFIG.protocolRegex);
        redirectUrl = hasProtocol ? query : 'http://' + query;
      } else {
        const splitSearch = query.split(CONFIG.searchDelimiter);
        const splitPath = query.split(CONFIG.pathDelimiter);

        this._loopThroughCommands(command => {
          const isSearch = splitSearch[0] === command.key;
          const isPath = splitPath[0] === command.key;

          if (isSearch || isPath) {
            if (splitSearch[1] && command.search) {
              redirectUrl = this._prepSearch(command, splitSearch);
            } else if (splitPath[1]) {
              redirectUrl = this._prepPath(command, splitPath);
            } else {
              redirectUrl = command.url;
            }

            return true;
          }
        });
      }

      return redirectUrl;
    }

    instantRedirect(keypressEvent, query, callback) {
      this._loopThroughCommands(command => {
        if (command.key === query) {
          keypressEvent.preventDefault();
          callback(command.url);
        }
      });
    }

    _loopThroughCommands(callback) {
      CONFIG.categories
        .map(category => category.commands)
        .forEach(commands => commands.forEach(command => {
          if (callback(command)) return;
        }));
    }

    _prepPath(command, query) {
      const baseUrl = this._stripUrlPath(command.url);
      const path = this._shiftAndTrim(query, CONFIG.pathDelimiter);
      return `${baseUrl}/${path}`;
    }

    _prepSearch(command, query) {
      if (!command.search) return command.url;
      const baseUrl = this._stripUrlPath(command.url);
      const search = this._shiftAndTrimAndEncode(query);
      const searchPath = command.search.replace('{}', search);
      return `${baseUrl}${searchPath}`;
    }

    _shiftAndTrim(arr, delimiter) {
      arr.shift();
      return arr.join(delimiter).trim();
    }

    _shiftAndTrimAndEncode(arr) {
      const clean = this._shiftAndTrim(arr, CONFIG.searchDelimiter);
      return encodeURIComponent(clean);
    }

    _stripUrlPath(url) {
      const parser = document.createElement('a');
      parser.href = url;
      return `${parser.protocol}//${parser.hostname}`;
    }
  }

  class Form {
    constructor(help, suggester, queryParser) {
      this._help = help;
      this._suggester = suggester;
      this._queryParser = queryParser;
      this._formEl = $.el('#js-search-form');
      this._inputEl = $.el('#js-search-input');
      this._inputElVal = '';
      this._bindMethods();
      this._registerEvents();
    }

    _bindMethods() {
      this._handleKeypress = this._handleKeypress.bind(this);
      this._submitForm = this._submitForm.bind(this);
      this._handleKeyup = this._handleKeyup.bind(this);
      this._submitWithValue = this._submitWithValue.bind(this);
    }

    _handleKeypress(event) {
      const newChar = String.fromCharCode(event.which);
      const isNotEmpty = newChar.length;
      const isEnterKey = event.which !== 13;

      if (isNotEmpty && isEnterKey) {
        this._help.toggle(false);
        this._inputEl.focus();
      }

      if (CONFIG.instantRedirect) {
        this._queryParser.instantRedirect(
          event,
          this._inputEl.value + newChar,
          this._submitWithValue
        );
      }
    }

    _handleKeyup(event) {
      if (
        CONFIG.suggestions &&
        this._inputElVal.trim() !== this._inputEl.value.trim()
      ) {
        this._suggester.suggest(this._inputEl.value, this._submitWithValue);
        this._inputElVal = this._inputEl.value;
      }
    }

    _redirect(redirect) {
      if (CONFIG.newTab) window.open(redirect, '_blank');
      else window.location.href = redirect;
    }

    _registerEvents() {
      document.addEventListener('keypress', this._handleKeypress);
      this._inputEl.addEventListener('keyup', this._handleKeyup);
      this._formEl.addEventListener('submit', this._submitForm, false);
    }

    _submitForm(event) {
      if (event) event.preventDefault();
      const query = this._inputEl.value.trim();

      if (!query || query === '?') {
        this._inputEl.value = '';
        this._help.toggle();
      } else {
        this._suggester.add(query);
        this._suggester.suggest('');
        this._inputEl.value = '';
        this._redirect(this._queryParser.generateRedirect(query));
      }
    }

    _submitWithValue(value) {
      this._inputEl.value = value;
      this._submitForm();
    }
  }
