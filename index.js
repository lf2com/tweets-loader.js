'use strict';

import TweetsLoader, { parseTweet, parseTweets, parseCode } from './libs/tweets-loader';

export default TweetsLoader;
if (self && self instanceof Object && self === self.self) {
  const TL = (...args) => TweetsLoader(...args);
  TL.parseTweet = parseTweet;
  TL.parseTweets = parseTweets;
  TL.parseCode = parseCode;
  self.TweetsLoader = TL;
}