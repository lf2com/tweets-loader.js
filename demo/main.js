(() => {
  const qs = location.search.substr(1);
  qs = encodeURIComponent(qs);
  if (!qs.length) {
    return alert('No query string of code');
  }

  const createDomTweet = (() => {
    const createDomAuthor = ({ avatar, name, account, url, verified }) => {
      const domAuthor = document.createElement('div');
      const domAvatar = document.createElement('span');
      const domName = document.createElement('a');
      domAuthor.classList.add('author');
      domAuthor.setAttribute('title', `@${account}`);
      domAvatar.classList.add('avatar');
      domAvatar.style.backgroundImage = `url('${avatar.find(({ type }) => ('2x'===type)).url}')`;
      domName.classList.add('name');
      domName.setAttribute('href', url);
      domName.setAttribute('target', '_blank');
      domName.innerHTML = name;
      if (verified) {
        domAuthor.classList.add('verified');
      }
      domAuthor.appendChild(domAvatar);
      domAuthor.appendChild(domName);
      return domAuthor;
    };

    const createDomText = (({ split }) => {
      const domText = document.createElement('div');
      domText.classList.add('text');
      split.forEach((ref) => {
        if ('string'===typeof ref) {
          return domText.insertAdjacentText('beforeend', ref);
        }
        switch (ref.type) {
          case 'url':
          {
            const domUrl = document.createElement('a');
            const domHidden = document.createElement('span');
            domUrl.classList.add('url');
            domUrl.setAttribute('title', ref.raw);
            domUrl.setAttribute('href', ref.raw);
            domUrl.setAttribute('target', '_blank');
            domHidden.classList.add('hidden');
            domHidden.innerHTML = ref.raw;
            domText.appendChild(domUrl);
            domText.appendChild(domHidden);
          }
          return;

          case 'mention':
          {
            const domMention = document.createElement('a');
            const domHidden = document.createElement('span');
            domMention.classList.add('mention');
            domMention.setAttribute('title', ref.account);
            domMention.setAttribute('href', ref.url);
            domMention.setAttribute('target', '_blank');
            domHidden.classList.add('hidden');
            domHidden.innerHTML = ref.display;
            domText.appendChild(domMention);
            domText.appendChild(domHidden);
          }
          return;

          case 'hashtag':
          {
            const domHashtag = document.createElement('a');
            const domHidden = document.createElement('span');
            domHashtag.classList.add('hashtag');
            domHashtag.setAttribute('title', ref.name);
            domHashtag.setAttribute('href', ref.url);
            domHashtag.setAttribute('target', '_blank');
            domHidden.classList.add('hidden');
            domHidden.innerHTML = ref.display;
            domText.appendChild(domHashtag);
            domText.appendChild(domHidden);
          }
          return;
        }
      });
      return domText;
    });

    const createDomDate = (() => {
      const ms_sec = 1000;
      const ms_min = (60*ms_sec);
      const ms_hour = (60*ms_min);
      const ms_day = (24*ms_hour);
      const ms_year = (365.25*ms_day);
      const arrMs = [
        { limit: ms_min, text: () => `< 1m` },
        { limit: ms_hour, text: (diff) => `${(diff/ms_min)|0}m ago` },
        { limit: ms_day, text: (diff) => `${(diff/ms_hour)|0}h ago` },
        { limit: ms_year, text: (diff) => `${(diff/ms_day)|0}d ago` },
        { limit: Infinity, text: () => `> 1y` },
      ];
      const dateToString = (d = new Date()) => [
        [
          d.getFullYear(),
          `0${d.getMonth()+1}`.substr(-2),
          `0${d.getDate()}`.substr(-2),
        ].join('-'),
        [
          `0${d.getHours()}`.substr(-2),
          `0${d.getMinutes()}`.substr(-2),
          `0${d.getSeconds()}`.substr(-2),
        ].join(':'),
      ].join(' ');
      return (date) => {
        const domDate = document.createElement('div');
        const diff = (Date.now()-date.getTime());
        domDate.classList.add('date');
        domDate.setAttribute('title', dateToString(date));
        domDate.innerHTML = arrMs.find(({ limit }) => (diff<=limit)).text(diff);
        return domDate;
      };
    })();

    const createMedia = (medias) => {
      const domMedia = document.createElement('div');
      domMedia.classList.add('media');
      medias.forEach((media) => {
        const domLink = document.createElement('a');
        const dom = document.createElement('div');
        const { url, type } = media;
        domLink.setAttribute('href', url);
        domLink.setAttribute('target', '_blank');
        dom.classList.add(type);
        switch (type) {
          case 'url':
          {
            const { name, description, domain } = media;
            const domTitle = document.createElement('span');
            const domRef = document.createElement('span');
            domTitle.classList.add('title');
            domTitle.innerHTML = name;
            domRef.classList.add('ref');
            domRef.innerHTML = domain;
            dom.appendChild(domTitle);
            if (description) {
              const domDesc = document.createElement('span');
              domDesc.classList.add('desc');
              domDesc.innerHTML = description;
              dom.appendChild(domDesc);
            }
            dom.appendChild(domRef);
          }
          case 'image':
          case 'video':
          {
            const image = media.image;
            dom.style.backgroundImage = `url('${image.url}')`;
          }
          break;

          case 'tweet':
          dom.appendChild(createDomTweet(media));
          break;
        }
        domLink.appendChild(dom);
        domMedia.appendChild(domLink);
      });
      return domMedia;
    };

    return ({ url, author, text, date, medias }) => {
      const domTweet = document.createElement('div');
      const domBar = document.createElement('div');
      const domContent = document.createElement('div');
      const domText = createDomText(text);
      const domLink = document.createElement('a');
      domTweet.classList.add('tweet');
      domBar.classList.add('bar');
      domBar.appendChild(createDomAuthor(author))
      domBar.appendChild(createDomDate(date));
      domLink.classList.add('link');
      domLink.setAttribute('href', url);
      domLink.setAttribute('target', '_blank');
      domContent.classList.add('content');
      domContent.appendChild(domText);
      domContent.appendChild(createMedia(medias));
      domContent.appendChild(domLink);
      domTweet.appendChild(domBar);
      domTweet.appendChild(domContent);
      return domTweet;
    };
  })();

  const domMain = document.createElement('div');
  domMain.setAttribute('id', 'main');
  domMain.setAttribute('data-message', 'LOADING');
  domMain.setAttribute('data-shining', '');
  document.body.appendChild(domMain);
  TweetsLoader(decodeURIComponent(qs)).then((tweets) => {
    const _delay = 100;
    tweets.map((tweet, index) => {
      setTimeout(() => domMain.appendChild(createDomTweet(tweet)), (index*_delay));
    });
    domMain.removeAttribute('data-message');
    domMain.removeAttribute('data-shining');
  }).catch((err) => {
    console.warn(err.stack);
    domMain.removeAttribute('data-shining');
    domMain.setAttribute('data-message', err.message);
  });
})();