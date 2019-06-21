# Tweets-loader.js

Tweets-loader.js is a JavaScript library that loads tweets of [Twitter Publish](https://publish.twitter.com).

> **CAUTION: Due to the [declaration of Twitter](https://twittercommunity.com/t/deprecating-widget-settings/102295), Tweets-loader.js is no longer support for widget ID. Instead, Tweets-loader.js now supports for embeded contents of Tweet Publish.**

## Demo

### Twitter Cards

Append publish code encoded with `encodeURIComponent(...)` as query string to the URL: `https://lf2com.github.io/tweets-loader.js/demo/cards.html`

- [Collection](https://lf2com.github.io/tweets-loader.js/demo/cards.html?%3Ca%20class%3D%22twitter-timeline%22%20href%3D%22https%3A%2F%2Ftwitter.com%2FTwitterDev%2Ftimelines%2F539487832448843776%3Fref_src%3Dtwsrc%255Etfw%22%3ENational%20Park%20Tweets%20-%20Curated%20tweets%20by%20TwitterDev%3C%2Fa%3E%20%3Cscript%20async%20src%3D%22https%3A%2F%2Fplatform.twitter.com%2Fwidgets.js%22%20charset%3D%22utf-8%22%3E%3C%2Fscript%3E)
- [List](%3Ca%20class%3D%22twitter-timeline%22%20href%3D%22https%3A%2F%2Ftwitter.com%2FTwitterDev%2Flists%2Fnational-parks%3Fref_src%3Dtwsrc%255Etfw%22%3EA%20Twitter%20List%20by%20TwitterDev%3C%2Fa%3E%20%3Cscript%20async%20src%3D%22https%3A%2F%2Fplatform.twitter.com%2Fwidgets.js%22%20charset%3D%22utf-8%22%3E%3C%2Fscript%3E)
- [Tweet](https://lf2com.github.io/tweets-loader.js/demo/cards.html?%3Cblockquote%20class%3D%22twitter-tweet%22%3E%3Cp%20lang%3D%22en%22%20dir%3D%22ltr%22%3ESunsets%20don%26%2339%3Bt%20get%20much%20better%20than%20this%20one%20over%20%3Ca%20href%3D%22https%3A%2F%2Ftwitter.com%2FGrandTetonNPS%3Fref_src%3Dtwsrc%255Etfw%22%3E%40GrandTetonNPS%3C%2Fa%3E.%20%3Ca%20href%3D%22https%3A%2F%2Ftwitter.com%2Fhashtag%2Fnature%3Fsrc%3Dhash%26amp%3Bref_src%3Dtwsrc%255Etfw%22%3E%23nature%3C%2Fa%3E%20%3Ca%20href%3D%22https%3A%2F%2Ftwitter.com%2Fhashtag%2Fsunset%3Fsrc%3Dhash%26amp%3Bref_src%3Dtwsrc%255Etfw%22%3E%23sunset%3C%2Fa%3E%20%3Ca%20href%3D%22http%3A%2F%2Ft.co%2FYuKy2rcjyU%22%3Epic.twitter.com%2FYuKy2rcjyU%3C%2Fa%3E%3C%2Fp%3E%26mdash%3B%20US%20Department%20of%20the%20Interior%20(%40Interior)%20%3Ca%20href%3D%22https%3A%2F%2Ftwitter.com%2FInterior%2Fstatus%2F463440424141459456%3Fref_src%3Dtwsrc%255Etfw%22%3EMay%205%2C%202014%3C%2Fa%3E%3C%2Fblockquote%3E%20%3Cscript%20async%20src%3D%22https%3A%2F%2Fplatform.twitter.com%2Fwidgets.js%22%20charset%3D%22utf-8%22%3E%3C%2Fscript%3E)
- [Moment](https://lf2com.github.io/tweets-loader.js/demo/cards.html?%3Ca%20class%3D%22twitter-moment%22%20href%3D%22https%3A%2F%2Ftwitter.com%2Fi%2Fmoments%2F625792726546558977%3Fref_src%3Dtwsrc%255Etfw%22%3EMichelle%20Obama%20Opens%20Special%20Olympics%3C%2Fa%3E%20%3Cscript%20async%20src%3D%22https%3A%2F%2Fplatform.twitter.com%2Fwidgets.js%22%20charset%3D%22utf-8%22%3E%3C%2Fscript%3E)
- [Likes Timeline](https://lf2com.github.io/tweets-loader.js/demo/cards.html?%3Ca%20class%3D%22twitter-timeline%22%20href%3D%22https%3A%2F%2Ftwitter.com%2FTwitterDev%2Flikes%3Fref_src%3Dtwsrc%255Etfw%22%3ETweets%20Liked%20by%20%40TwitterDev%3C%2Fa%3E%20%3Cscript%20async%20src%3D%22https%3A%2F%2Fplatform.twitter.com%2Fwidgets.js%22%20charset%3D%22utf-8%22%3E%3C%2Fscript%3E)

## Install

### Git

```sh
git clone https://github.com/lf2com/tweets-loader.js.git
cd tweets-loader.js
npm install .
```

#### Build

Build `./tweets-loader.min.js`

```sh
npm run build
```

> ##### Debug Build
>
> ```sh
> npm run build-debug
> ```

#### Browser

Download from this repository or use your own built: [**`tweets-loader.min.js`**](https://lf2com.github.io/tweets-loader.js/tweets-loader.min.js)

```html
<!-- include script -->
<script src="PATH/TO/tweets-loader.min.js"></script>

<script>
  console.log(window.TweetsLoader); // here it is
</script>
```

## Usage of Tweets Loader

### Parse Tweets

Parse tweets by assigning one of the following sources:

- DOM element of tweet
- DOM element containing tweets
- Code generated with [Twitter Publish](https://publish.twitter.com)

#### TweetsLoader(source)

> **DOM element of tweet**
>
> The same as [TweetsLoader.parseTweet(DOM)](#TweetsLoaderparseTweetDOM)
>
> ```js
> let tweets = TweetsLoader(singleTweetDom); // input a single DOM of tweet
> console.log(tweets); // get array of tweets (length: 1)
> ```
>
> **DOM element containing tweets**
>
>> **NOTICE: Remember to escape special chars such as `/` in the code**
>
> The same as [TweetsLoader.parseTweets(DOM)](#TweetsLoaderparseTweetsDOM)
>
> ```js
> let tweets = TweetsLoader(embededDom); // input embeded DOM
> console.log(tweets); // get array of tweets
> ```
>
> **Code generated with [Twitter Publish](https://publish.twitter.com)**
>
> The same as [TweetsLoader.parseCode]
>
> ```js
> let collection = `<a class="twitter-timeline" href="https://twitter.com/TwitterDev/timelines/539487832448843776?ref_src=twsrc%5Etfw">National Park Tweets - Curated tweets by TwitterDev</a> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"><\/script>`; // code generated with twitter publish
>
> TweetsLoader(collection) // input HTML text
>   .then((tweets) => {
>   console.log(tweets); // get array of tweets
>   });
> ```

#### TweetsLoader.parseTweet(DOM)

Parse a single tweet of HTML element

```js
let tweet = TweetsLoader.parseTweet(singleTweetDom); // input a single DOM of tweet
console.log(tweet); // get a tweet
```

#### TweetsLoader.parseTweets(DOM)

Parse multiple tweets of HTML element

```js
let tweets = TweetsLoader.parseTweets(embededDom); // input embeded DOM
console.log(tweets); // get array of tweets
```

#### TweetsLoader.parsePublish(code)

Parse tweets from the code generated with Twitter Publish

```js
let moment = `<a class="twitter-moment" href="https://twitter.com/i/moments/625792726546558977?ref_src=twsrc%5Etfw">Michelle Obama Opens Special Olympics</a> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"><\/script>`; // code generated with twitter publish

TweetsLoader(moment) // input HTML text
  .then((tweets) => {
  console.log(tweets); // get array of tweets
  });
```

## Object Properties

### Tweet Object

| _Property_ | _Type_ | _Description_ | _Default_ |
| :-: | :-: | :- | :-: |
| id | _String_ | Id of tweet | `null` |
| url | _String_ | URL of tweet | `null` |
| author | _Object_ | [User object](#User-Object) | |
| reply | _Object_ | [Tweet object](#Tweet-Object) of response target | `null` |
| medias | _Array_ | Array of [media object](#Media-Object) contained in the tweet | `[]` |
| like | _Object_ | [Like object](#Like-Object) | |
| date | _Date_ | Date of tweet | `null` |
| mentions | _Array_ | Array of [mention object](#Mention-Object) | `[]` |
| hashtags | _Array_ | Array of [hashtag obejct](#Hashtag-Obejct) | `[]` |
| urls | _Array_ | Array of [url object](#URL-Object) | `[]` |
| share | _Array_ | Array of [share object](#Share-Object) | `[]` |
| text | _Object_ | [Text object](#Text-Object) | |

### User Object

| _Property_ | _Type_ | _Description_ | _Default_ |
| :-: | :-: | :- | :-: |
| account | _String_ | Screen name of user | `null` |
| name | _String_ | Display name of user | `null` |
| url | _String_ | URL of user | `null` |
| avatar | _Array_ | Array of [avatar object](#Avatar-Object) | `[]` |
| verified | _Boolean_ | Verification of user | `false` |

### Avatar Object

Avatar of user

| _Property_ | _Type_ | _Description_ |
| :-: | :-: | :- |
| type | _String_ | `1x` for normal size; `2x` for large side |
| url | _String_ | URL of avatar |

### Media Object

Media object must  might be any of the belows:

#### Image Media Object

| _Property_ | _Type_ | _Description_ |
| :-: | :-: | :- |
| type | _String_ | Always be `image` |
| name | _String_ | Title of image |
| image | _Object_ | See the image object below |

> **Image Object**
>
> | _Property_ | _Type_ | _Description_ |
> | :-: | :-: | :- |
> | width | _Integer_ | Width of image |
> | height | _Integer_ | Height of image |
> | ref | _String_ | Raw image URL |
> | url | _String_ | Thumbnail of image |

#### Video Media Object

| _Property_ | _Type_ | _Description_ |
| :-: | :-: | :- |
| type | _String_ | Always be `video` |
| name | _String_ | Title of video |
| image | _Object_ | See the image object below |

> **Image Object**
>
> | _Property_ | _Type_ | _Description_ |
> | :-: | :-: | :- |
> | ref | _String_ | Raw image URL |
> | url | _String_ | Thumbnail of image |

#### URL Media Object

| _Property_ | _Type_ | _Description_ |
| :-: | :-: | :- |
| type | _String_ | Always be `url` |
| name | _String_ | Title of URL |
| description | _String_ | Description of URL. `null` if no info |
| domain | _String_ | Domain of URL |
| image | _Object_ | See the image object below |

> **Image Object**
>
> | _Property_ | _Type_ | _Description_ |
> | :-: | :-: | :- |
> | url | _String_ | Thumbnail of image |

#### Tweet Media Object

The same as [tweet object](#Tweet-Object)

### Like Object

| _Property_ | _Type_ | _Description_ | _Default_ |
| :-: | :-: | :- | :-: |
| url | _String_ | URL to like | `null` |
| count | _Integer_ | Count of likes | `null` if no info |

### Mention Object

| _Property_ | _Type_ | _Description_ |
| :-: | :-: | :- |
| id | _String_ | Id of mention user |
| url | _String_ | URL of mention user |
| account | _String_ | Screen name of user |
| display | _String_ | `@account` |

### Hashtag Obejct

| _Property_ | _Type_ | _Description_ |
| :-: | :-: | :- |
| url | _String_ | URL of mention user |
| name | _String_ | Name of hash tag |
| display | _String_ | `#hashtag` |

### URL Object

| _Property_ | _Type_ | _Description_ |
| :-: | :-: | :- |
| url | _String_ | URL converted by twitter |
| raw | _String_ | Raw URL |
| display | _String_ | URL without protocol such as `https://` |

### Share Object

| _Property_ | _Type_ | _Description_ |
| :-: | :-: | :- |
| type | _String_ | One of `twitter`, `facebook`, `linkedin`, or `tumblr` |
| url | _String_ | URL to share |

### Text Object

| _Property_ | _Type_ | _Description_ |
| :-: | :-: | :- |
| html | _String_ | HTML code of text |
| text | _String_ | Text of display without hidden elements such as `https://` of URLs |
| raw | _String_ | Full pure text |
| split | _Array_ | Text classify by pure text and special element with property `type` of: ([**url**](#URL-Object), [**mention**](#Mention-Object), or [**hashtag**](#Hashtag-Obejct) )

## License

[MIT](https://github.com/lf2com/tweets-loader.js/blob/master/LICENSE) Copyright @ Wan Wan
