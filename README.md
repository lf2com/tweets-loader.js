# Tweets-loader.js

Tweets-loader.js is a JavaScript library that loads tweets with your own Twitter widget. This library will load Twitter widget library. By feeding widget ID, it will ask Twitter widget to get tweets then pass these details to you.

# Demo
[#Corgi](https://lf2com.github.io/tweets-loader.js/demo/demo.html)

Show recent tweets with hashtag `#corgi`. Auto insert new tweets on the top.

# Install
### NodeJS
```nodejs
npm install https://github.com/lf2com/tweets-loader.js
```

### Browser
Download `tweets-loader.min.js` from this repository.
```html
<script src="PATH/TO/tweets-loader.min.js"></script>
```

# Preparation
Before using `tweets-loader`, we need a Twitter widget ID which targets to our interesting tweets. Here is a simple tutorial to create a Twitter widget ID
1. Go to Twitter and login
2. Click your avatar **(not the blue one)** on the top-right and click `Settings and privacy`
3. Click `Widgets` on the left menu
4. If you already have widget, make sure it's a `search widget` and `Edit` it. Or click `Create new` and choose `search widget`
5. Now we are at the configuration page. Configure these options and click `Create widget`/`Save changes`
6. Find an embed code on the middle-bottom. The widget ID is the value of `data-widget-id`.

Here is a sample embed code:
```html
<a class="twitter-timeline"  href="https://twitter.com/hashtag/Corgi" data-widget-id="950273051467300871">#Corgi Tweets</a>
<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+"://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>
```

# How to use
### Create tweets loader
```javascript
let tweetsLoader = new TweetsLoader();
```

### Assign widget ID
```javascript
tweetsLoader.id(WIDGET_ID);
```
Or assign widget ID when creating tweets loader
```javascript
let tweetsLoader = new TweetsLoader(WIDGET_ID);
```

### Event listener for tweets-loader
'''javascript
// triggered when tweets updated including the first tweets
tweetsLoader.on('update;m function(e) {
  console.log('update', e.detail); // detail info
});
tweetsLoader.off('update'); // remove event listener
```

### Remove Twitter widget and recorded tweets
```javascript
tweetsLoader.remove();
```

### Clear tweets loader
```javascript
tweetsLoader.clear();
```
Equals to
```javascript
tweetsLoader.remove().off('update');
```

# TweetsLoader methods
### Check module ready
```javascript
TweetsLoader.isReady(); // true if both document and twitter widget loaded
```

# Object properties
### Tweet
| property | type | description |
| - | - | - |
| id | _String_ | tweet ID |
| url | _String_ | tweet URL |
| author | _[Author Object](#author-object)_ | tweet author info |
| date | _Date_ | tweet date |
| hashtags | _Array_ | all hashtags in this tweet |
| mentions | _Array_ | all mentions in this tweet |
| text | _String_ | raw text of tweet |
| medias | _Array of [Media Object](#media-object)_ | tweet media info |
| older | _Tweet_ | the older tweet of this tweet |
| newer | _Tweet_ | the newer tweet of this tweet |

### Author object
| property | type | description |
| - | - | - |
| name | _String_ | author name |
| status | _String_ | author screen name without the 1st character '@' |
| thumbnails | _Object_ | `small` for small thumbnails; `large` for large thumbnails |
| url | _String_ | URL to author's Twitter |

### Media object
| property | type | description |
| - | - | - |
| type | _String_ | type of media. `url`, `image` or `video` |
| url | _String_ | URL to media |
| image | _String_ | preview URL of media |
