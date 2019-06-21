'use strict';

let MS_TIMEOUT = 3000; // timeout for waiting loading tweets

const SCRIPT_TWEET = 'https://platform.twitter.com/widgets.js';

import { isint, isstr, isfunc } from './stdlib';

/**
 * Bind property into object
 * 
 * @param {Object} object reference
 * @param {String} keys of properties split with "."
 * @param {Any} value to assign
 * @return {Object} object reference
 */
const bindProp = (ref, keys, value) => {
  keys = keys.split('.');
  const key = keys.pop();
  const target = keys.reduce((ref, key) => ref[key] = (ref[key]||{}), ref);
  target[key] = (isfunc(value) ?value(target[key], ref) :value);
  return ref;
};

/**
 * Find matched parent node from element
 * 
 * @param {DOM} element reference
 * @param {String|Function} matches selector or function that returns Boolean for checking
 * @return {DOM} null if not found
 */
const findOuterFromSelf = (ref, matches) => {
  const check = (isfunc(matches) ?matches :(r)=>r.matches(matches));
  while (ref) {
    if (check(ref)) {
      return ref;
    }
    ref = ref.parentNode;
  }
  return null;
};

/**
 * Find matched child node from element
 * 
 * @param {DOM} element reference
 * @param {String} matches selector
 * @return {DOM} null if not found 
 */
const findInnerFromSelf = (ref, matches) => {
  return (ref.matches(matches) ?ref :ref.querySelector(matches));
};

/**
 * Get text element of tweet id
 * 
 * @param {DOM} ref element
 * @param {String} id of tweet
 * @return {DOM} null if not found
 */
const getTextDom = (ref, id) => {
  const doms = ref.querySelectorAll('[class*=text]');
  for (let i=0; i<doms.length; i++) {
    let dom = doms[i];
    let tweet = findOuterFromSelf(dom, '[data-tweet-id]');
    if (tweet && id === tweet.getAttribute('data-tweet-id')) {
      return dom;
    }
  }
  return null;
};

/**
 * Convert element to text
 * 
 * @param {DOM} element to convert
 * @param {Boolean} hide elements with class name hidden
 * @return {String} text of element
 */
const getText = (ref, hide = false) => Array.prototype.map.call(ref.childNodes, (node) => {
  if (Node.TEXT_NODE === node.nodeType) {
    return node.textContent;
  } else if (hide && node.matches('[class*=hidden]')) {
    return '';
  } else if (node.childNodes.length) {
    return getText(node, hide);
  } else if (/^img$/i.test(node.nodeName)) {
    return node.getAttribute('alt');
  } else if (/^element:url$/.test(node.getAttribute('data-scribe'))) {
    return Array.prototype.map.call(node.childNodes, (node) => node.textContent).join('').trim();
  } else {
    return node.textContent;
  }
}).join('');

/**
 * Check if the element belongs to reference element
 * 
 * @param {DOM} ref reference element
 * @param {DOM} dom target element
 * @return {Boolean} true if yes
 */
const checkIsSelfDom = (ref, dom) => {
  const tweet = findOuterFromSelf(dom, '[data-tweet-id]');
  return (tweet&&ref.getAttribute('data-tweet-id')===tweet.getAttribute('data-tweet-id'));
};

/**
 * Parse tweet of element
 * 
 * @param {DOM} dom contains a single tweet
 * @param {String} id of tweet (optional)
 * @return {Object} tweet
 */
export const parseTweet = (domRef, id) => {
  if (!domRef) {
    throw new Error(`Not assign DOM to parse`);
  } else if (!domRef instanceof Element) {
    throw new Error(`Invalid DOM`);
  }
  const domTweet = (id||domRef.matches('[data-tweet-id]') ?domRef :findInnerFromSelf(domRef, '[data-tweet-id]'));
  return bindProp(Array.prototype.reduce.call(domTweet.querySelectorAll('[data-scribe]'), (props, dom) => {
    if (!checkIsSelfDom(domTweet, dom)) {
      return props;
    }
    const [major, minor] = dom.getAttribute('data-scribe').split(':');
    switch (major) {
      case 'section':
      switch (minor) {
        case 'subject': // whole tweet content
        break;
        
        case 'quote': // out link of tweet
        return bindProp(props, 'medias', (arr) => (arr||[]).concat({
          type: 'tweet',
          ...parseTweet(findInnerFromSelf(dom, '[data-tweet-id]')),
        }));

        case 'conversation': // reply to tweet
        return bindProp(props, 'reply', parseTweet(findInnerFromSelf(dom, '[data-tweet-id]')));
      }
      break;

      case 'component':
      switch (minor) {
        case 'author': // author name & screen name
        break;

        case 'tweet': // tweet content
        break;

        case 'actions': // like action OR share menu
        break;

        case 'card': // media card
        return bindProp(props, 'medias', Array.prototype.filter.call(dom.querySelectorAll('a'), (dom) => dom.querySelector('img')).map((dom) => {
          const domImg = dom.querySelector('img');
          return {
            url: dom.href,
            ...(dom.querySelector('[data-scribe="element:play_button"]') ?{
              type: 'video',
              name: domImg.alt,
              image: {
                ref: domImg.getAttribute('data-image'),
                url: domImg.src,
              },
            } :(domImg.title.length ?{
              type: 'image',
              name: domImg.title,
              image: {
                width: parseInt(domImg.getAttribute('width')),
                height: parseInt(domImg.getAttribute('height')),
                ref: domImg.getAttribute('data-image'),
                url: domImg.src,
              },
            } :{
              type: 'url',
              image: {
                url: domImg.src,
              },
              ...((doms) => {
                doms = Array.prototype.slice.call(doms);
                const domTitle = doms.shift();
                const domDomain = doms.pop();
                const domDesc = doms.pop();
                return {
                  name: getText(domTitle),
                  description: (domDesc ?getText(domDesc) :null),
                  domain: getText(domDomain),
                };
              })(dom.querySelectorAll('[dir]')),
            })),
          };
        }));

        case 'cookie-consent': // cookie consent for video media
        break;

        case 'share': // share
        break;
      }
      break;

      case 'element':
      switch (minor) {
        case 'user_link': // author link
        return bindProp(props, 'author.url', dom.href);
        
        case 'avatar': // author avatar
        return bindProp(props, 'author.avatar', dom.getAttributeNames().filter((attr) => /^data-src-/.test(attr)).map((attr) => ({
          type: attr.replace(/^data-src-/, ''),
          url: dom.getAttribute(attr),
        })));

        case 'name': // author name
        return bindProp(props, 'author.name', dom.title);

        case 'screen_name': // author screen name
        return bindProp(props, 'author.account', dom.title.substr(1));

        case 'logo': // twitter logo with tweet link
        break;

        case 'verified_badge': // verified author
        return bindProp(props, 'author.verified', true);

        case 'heart': // like icon OR like link
        return bindProp(props, 'like.url', findOuterFromSelf(dom, '[href]').href);

        case 'heart_count': // like count
        return bindProp(props, 'like.count', parseInt(getText(dom).replace(/[^\d]/g, '')));

        case 'full_timestamp': // full timestamp
        case 'mini_timestamp': // mini timestamp
        return bindProp(props, 'date', new Date(findInnerFromSelf(dom, 'time').getAttribute('datetime')));

        case 'mention': // mention (@)
        return bindProp(props, 'mentions', (arr) => {
          arr = (arr||[]);
          const index = arr.findIndex(({ url }) => (url===dom.href));
          return (-1!==index ?arr :arr.concat({
            ...((text) => ({
              display: text,
              account: text.substr(1),
            }))(getText(dom)),
            id: dom.getAttribute('data-mentioned-user-id'),
            url: dom.href,
          }));
        });

        case 'hashtag': // hash tag (#)
        return bindProp(props, 'hashtags', (arr) => {
          arr = (arr||[]);
          const index = arr.findIndex(({ url }) => (url===dom.href));
          return (-1!==index ?arr :arr.concat({
            ...((text) => ({
              display: text,
              name: text.substr(1),
            }))(getText(dom)),
            url: dom.href,
          }));
        });

        case 'url': // url
        return bindProp(props, 'urls', (arr) => (arr||[]).concat({
          raw: dom.title,
          display: getText(dom, true),
          url: dom.href,
        }));

        case 'play_button': // play button for video media
        break;

        case 'poster_image': // poster image for video media
        break;

        case 'twitter': // share to twitter
        case 'facebook': // share to facebook
        case 'linkedin': // share to linkedin
        case 'tumblr': // share to tumblr
        return bindProp(props, 'share', (arr) => (arr||[]).concat({
          type: minor,
          url: dom.href,
        }));

        default: // unknown cases
        break;
      }
      break;

      default: // unknown cases
      break;
    }
    return props;
  }, {
    id: (id||domTweet.getAttribute('data-tweet-id')||null),
    url: (domTweet.getAttribute('cite')||domTweet.getAttribute('data-click-to-open-target')||domTweet.href||null),
    author: {
      account: null,
      name: null,
      url: null,
      avatar: [],
      verified: false,
    },
    reply: null,
    medias: [],
    like: {
      count: null,
      url: null,
    },
    date: null,
    mentions: [],
    hashtags: [],
    urls: [],
    share: [],
  }), 'text', (_, { id, mentions, hashtags, urls }) => ((dom) => ({
    html: dom.innerHTML,
    text: getText(dom, true),
    raw: getText(dom),
    split: Array.prototype.map.call(dom.childNodes, (node) => {
      if (Node.TEXT_NODE === node.nodeType) {
        return node.textContent;
      } else if (node.matches('img')) {
        return node.alt;
      } else if (Node.ELEMENT_NODE === node.nodeType) {
        const attr = node.getAttribute('data-scribe');
        if (null === attr) {
          return '';
        }
        const [_, minor] = attr.split(':');
        return {
          ...(() => {
            switch (minor) {
              case 'url':
              return urls.find(({ url }) => (url===node.href));

              case 'hashtag':
              return hashtags.find(({ url }) => (url===node.href));

              case 'mention':
              return mentions.find(({ url }) => (url===node.href));

              default: // unknown cases
              return '';
            }
          })(),
          type: minor,
        };
      }
    }),
  }))(getTextDom(domTweet, id)));
};

// parse multiple tweets of DOM
/**
 * Parse multiple tweets inside the DOM
 * 
 * @param {DOM} element contains tweets
 * @return {Array} Array of tweets
 */
export const parseTweets = (dom) => {
  switch (dom.nodeName.toLowerCase()) {
    case 'twitter-widget':
    const domTweet = dom.shadowRoot.querySelector('[data-scribe="page:tweet"]');
    if (domTweet) {
      return [parseTweet(domTweet, dom.getAttribute('data-tweet-id'))];
    }
    break;

    case 'iframe':
    if (dom.contentWindow.document.body.children.length) {
      try {
        return Array.prototype.slice.call(dom.contentWindow.document.body.querySelectorAll('[data-scribe="component:tweet"]'))
          .map((dom) => parseTweet(dom))
          .sort((a, b) => (b.date-a.date));
      } catch (err) {
        console.warn(`Parsing error: ${err.stack}`);
      }
    }
    break;
  }
  throw new Error(`Invalid DOM`);
};

/**
 * Parse code of twitter publish
 * 
 * @param {String} code of twitter publish
 * @return {Promise} Array of tweets
 */
export const parseCode = (code) => {
  const domIframe = document.createElement('iframe');
  const onEnd = () => domIframe.parentNode.removeChild(domIframe);
  domIframe.style.position = 'fixed';
  domIframe.style.top = '100%';
  return new Promise((resolve, reject) => {
    let tryTimeoutId = -1;
    const failTimeoutId = setTimeout(() => {
      clearTimeout(tryTimeoutId);
      reject(new Error(`Failed`));
    }, MS_TIMEOUT);
    const checkIframe = () => {
      const dom = domIframe.contentDocument.body.children[0];
      if (dom) {
        try {
          const tweets = parseTweets(dom);
          clearTimeout(failTimeoutId);
          return resolve(tweets);
        } catch (e) {}
      }
      tryTimeoutId = setTimeout(checkIframe, 100);
    };
    document.body.appendChild(domIframe);
    const script = document.createElement('script');
    script.src = SCRIPT_TWEET;
    script.async = '';
    script.charset = 'utf-8';
    domIframe.contentDocument.body.appendChild(script);
    domIframe.contentDocument.body.innerHTML = code;
    checkIframe();
  }).then((tweets) => {
    onEnd();
    return tweets;
  }).catch((err) => {
    onEnd();
    throw err;
  });
};

const TweetsLoader = (ref) => {
  try {
    return (isstr(ref) ?parseCode(ref) :parseTweets(ref));
  } catch (e) {
    return parseTweet(ref);
  }
};

/**
 * Set/get timeout of loader
 * 
 * @param {Integer} ms to assign
 */
Object.defineProperty(TweetsLoader, 'MS_TIMEOUT', {
  get: () => MS_TIMEOUT,
  set: (ms) => {
    if (!isint(ms)) {
      throw new Error(`Invalid ms: ${ms}`);
    }
    MS_TIMEOUT = ms;
  },
});

export default TweetsLoader;