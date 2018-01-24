(() => { 'user strict';

  const _eventUpdate = 'update';
  const _twttrScriptUrl = 'https://platform.twitter.com/widgets.js?omit_script=true';

  const EventHandler = require('./lib/event-handler');
  const MutationObserver = (window.MutationObserver||window.WebKitMutationObserver);
  const tweetQueue = [];
  let isReady = false;
  let isDocReady = false;

  const isset = (o) => ('undefined'!==typeof o);
  const checkLoad = () => {
    if (TweetsLoader.isReady()) {
      while (tweetQueue.length) {
        tweetInit(tweetQueue.shift());
      }
    }
  };

  (() => {
    if (document.getElementById('twttr-script')) {
      return;
    }
    let script = document.querySelector('script');
    let twttrScript = document.createElement('script');
    twttrScript.id = 'twttr-script';
    twttrScript.setAttribute('async', '');
    twttrScript.src = _twttrScriptUrl;
    twttrScript.setAttribute('onload', 'twttrLoad()');
    self.twttrLoad = () => {
      isReady = true;
      checkLoad()
    };
    script.parentNode.insertBefore(twttrScript, script);
  })();

  (() => {
    if (document.attachEvent ?'complete'===document.readyState :'loading'!==document.readyState) {
      isDocReady = true;
      checkLoad();
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        isDocReady = true;
        checkLoad();
      });
    }
  })();

  function TweetsLoader(id) {
    Object.defineProperty(this, '_event', { value: new EventHandler(this), enumerable: false, writable: false });
    Object.defineProperty(this, 'tweets', { value: [], writable: false });
    this.id(id);
  }
  TweetsLoader.isReady = () => (isReady&&isDocReady);

  TweetsLoader.prototype.on = function() {
    this._event.on.apply(this._event, arguments);
    return this;
  };

  TweetsLoader.prototype.off = function() {
    this._event.off.apply(this._event, arguments);
    return this;
  };

  TweetsLoader.prototype.remove = function() {
    if (this._dom) {
      this._dom.parentNode.removeChild(this._dom);
    }
    this.id = undefined;
    this._dom = undefined;
    this.tweets.splice(0, this.tweets.length);
    return this;
  };

  TweetsLoader.prototype.clear = function() {
    this.remove();
    this._event.off(_eventUpdate);
    return this;
  };

  TweetsLoader.prototype.id = function(id) {
    if (isset(id) && this.id !== id) {
      this.remove();
      Object.defineProperty(this, 'id', { value: id, enumerable: false });
      Object.defineProperty(this, '_dom', { value: document.createElement('twttr'), enumerable: false });
      this._dom.style.display = 'none';
      this._dom.style.pointerEvents = 'none';
      if (TweetsLoader.isReady()) {
        tweetInit(this);
      } else {
        tweetQueue.push(this);
      }
      return this;
    } else {
      return this.id;
    }
  };

  function Tweet(params = {}) {
    this.id = params.id;
    this.url = params.url;
    params.author = (params.author||{});
    params.author.thumbnails = (params.author.thumbnails||{});
    this.author = {
      name: params.author.name,
      status: params.author.status,
      thumbnails: {
        small: params.author.thumbnails.small,
        large: params.author.thumbnails.large
      },
      url: params.author.url
    };
    this.date = params.date;
    this.hashtags = params.hashtags;
    this.mentions = params.mentions;
    this.text = params.text;
    this.medias = (params.medias||[]).map((ref) => {
      let media = {
        type: ref.type,
        url: ref.url
      };
      if (ref.image) {
        media.image = ref.image;
      }
      return media;
    });
    this.older = params.older;
    this.newer = params.newer;
  }

  function tweetInit(me) {
    document.body.appendChild(me._dom);
    twttr.widgets.createTimeline(me.id, me._dom).then(() => {
      let domList = me._dom.querySelector('iframe').contentDocument.querySelector('.timeline-TweetList');
      let afterFunc = (()=>{});
      let addTweets = (doms) => {
        let tweets = Array.prototype.map.call(doms, (dom) => {
          let domAuthor = dom.querySelector('.timeline-Tweet-author');
          let domAuthorIcon = domAuthor.querySelector('.Avatar');
          let domText = dom.querySelector('.timeline-Tweet-text');
          let domMedia = dom.querySelector('.timeline-Tweet-media');
          let domMetadata = dom.querySelector('.timeline-Tweet-metadata');
          let tweet = new Tweet({
            id: dom.querySelector('.timeline-Tweet').getAttribute('data-tweet-id'),
            url: domMetadata.querySelector('a').getAttribute('href'),
            author: {
              name: domAuthor.querySelector('.TweetAuthor-name').innerHTML.replace(/\<[^\>]+\>/g, (s) => (s.match(/\balt\=[\"\']([^\'\"]*)[\'\"]/)||[])[1]||''),
              status: domAuthor.querySelector('.TweetAuthor-screenName').innerHTML.slice(1),
              thumbnails: {
                small: domAuthorIcon.getAttribute('data-src-1x'),
                large: domAuthorIcon.getAttribute('src')
              },
              url: domAuthor.querySelector('.TweetAuthor-link').getAttribute('href')
            },
            date: new Date(domMetadata.querySelector('time').getAttribute('datetime')),
            hashtags: Array.prototype.map.call(domText.querySelectorAll('.hashtag .PrettyLink-value'), (elm) => elm.innerHTML),
            mentions: Array.prototype.map.call(domText.querySelectorAll('.profile .PrettyLink-value'), (elm) => elm.innerHTML),
            text: domText.innerHTML.replace(/<[^\>]+\>/g, '').trim(),
            medias: (domMedia ?Array.prototype.map.call(domMedia.querySelectorAll('a:not(.Interstitial-link)'), (elm) => {
              let img = elm.querySelector('img');
              let media = {
                url: elm.getAttribute('href')
              };
              if (img) {
                if (elm.querySelector('.PlayButton')) {
                  media.type = 'video';
                } else if (elm.querySelector('.SummaryCard-content')) {
                  media.type = 'url';
                } else {
                  media.type = 'image';
                }
                media.image = img.getAttribute('src').replace(/name\=[^\&$]+/, ('name=900x900'));
              }
              return media;
            }) :[]),
            older: undefined,
            newer: undefined
          });

          let newer = me.tweets[0];
          if (isset(newer)) {
            tweet.newer = newer;
            newer.older = tweet;
          }
          me.tweets.unshift(tweet);
          return tweet;
        }).reverse();
        me._event.trigger(_eventUpdate, tweets);
        afterFunc();
      };
      if (MutationObserver) {
        let observer = new MutationObserver((e) => addTweets(e[0].addedNodes));
        observer.observe(domList, { childList: true });
      } else {
        afterFunc = () => {
          me._timeoutId = setTimeout(() => {
            let tweetIds = me.tweets.map((tweet) => tweet.id);
            addTweets(Array.prototype.filter.call(domList.querySelectorAll('.timeline-TweetList-tweet .timeline-Tweet'), (dom) => (-1===tweetIds.indexOf(dom.getAttribute('data-tweet-id')))));
          }, _refreshMsec);
        };
      }
      addTweets(domList.querySelectorAll('.timeline-TweetList-tweet'));
    });
  }

  module.exports = TweetsLoader;
  if (self && (self instanceof Object) && (self.self === self)) {
    self.TweetsLoader = TweetsLoader;
  }

})();