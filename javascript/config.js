var CONFIG = {
  categories: [{
    name: 'Work',
    commands: [{
      key: 'g',
      name: 'Gmail',
      url: 'https://mail.google.com/mail/u/0/',
      search: '/search/{}',
    },
    {
      key: 'c',
      name: 'Google Class',
      url: 'https://classroom.google.com/',
      search: false,
    },
    {
      key: 'o',
      name: 'Outlook',
      url: 'http://outlook.live.com/',
      search: false,
    },
    ],
  },
  {
    name: 'Lurk',
    commands: [{
      key: 'f',
      name: 'Facebook',
      url: 'https://www.facebook.com',
      search: false,
    },
    {
      key: 'r',
      name: 'Reddit',
      url: 'https://www.reddit.com',
      search: '/search?q={}',
    },
    {
      key: 'y',
      name: 'YouTube',
      url: 'https://youtube.com/feed/subscriptions',
      search: '/results?search_query={}',
    },

    ],
  },
  {
    name: 'Anime',
    commands: [{
      key: 'ny',
      name: 'nyaa',
      url: 'https://nyaa.si',
      search: '/?f=0&c=1_2&q={}',
    },
    {
      key: 'm',
      name: 'MyAnimeList',
      url: 'https://myanimelist.net/',
      search: false,
    },
    {
      key: 'a',
      name: '/r/anime',
      url: 'https://www.reddit.com/r/anime/',
      search: '/search?q=subreddit%3Aanime+{}&sort=new&restrict_sr=&t=all',
    },
    ],
  },
  {
    name: 'Random',
    commands: [{
      key: 'w',
      name: 'Wikipedia',
      url: 'https://pl.wikipedia.org/',
      search: '/w/index.php?search={}',
    },
    {
      key: 'd',
      name: 'Diki',
      url: 'https://www.diki.pl/',
      search: '/slownik-angielskiego?q={}',
    },
    {
      key: 's',
      name: 'SoundCloud',
      url: 'https://soundcloud.com/',
      search: '/search?q={}',
    },
    ],
  },

  ],

  // if none of the keys are matched, this is used for searching.
  defaultSearch: 'https://google.com/search?q={}',

  // the delimiter between the key and your search query.
  // e.g. to search GitHub for potatoes you'd type "g:potatoes".
  searchDelimiter: ':',

  // the delimiter between the key and a path.
  // e.g. type "r/r/unixporn" to go to "reddit.com/r/unixporn".
  pathDelimiter: '/',

  // instantly redirect when a key is matched.
  // put a space before any other queries to prevent unwanted redirects.
  instantRedirect: false,

  // give suggestions as you type.
  suggestions: false,

  // max amount of suggestions that will ever be displayed.
  suggestionsLimit: 4,

  // the order and limit for each suggestion influencer.
  // the following would give you 1 suggestion from your search history
  // and 4 suggestions from Duck Duck Go.
  influencers: [{
    name: 'History',
    limit: 1,
  },
  {
    name: 'DuckDuckGo',
    limit: 4,
  },
  ],

  // open queries in a new tab.
  newTab: false,

  // the delimiter between the hours and minutes in the clock.
  clockDelimiter: '&nbsp;',

  // used for determining when to redirect directly to a url.
  urlRegex: /^(?:(http|https)?:\/\/)?(?:[\w-]+\.)+([a-z]|[A-Z]|[0-9]){2,6}/i,

  // if "urlRegex" matches but this doesn't, "http://" will be
  // prepended to the beginning of the query before redirecting.
  protocolRegex: /^[a-zA-Z]+:\/\//i,
};
