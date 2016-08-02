Handlebars.registerHelper('formatTime', function(time) {
  let minutes = parseInt(time / 60);
  let seconds = time - minutes * 60;

  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;

  return minutes + ':' + seconds;
});

let globalPlayer = document.createElement('audio');
let playingItem;

new Promise(function(resolve) {
  if (document.readyState === 'complete') {
    resolve();
  } else {
    window.onload = resolve;
  }
}).then(function() {
  return new Promise(function(resolve, reject) {
    VK.init({
      apiId: 5572480
    });

    VK.Auth.login(function(response) {
      if (response.session) {
        resolve(response);
      } else {
        reject(new Error('Не удалось авторизоваться'));
      }
    }, 8);
  });
}).then(function() {
  return new Promise(function(resolve, reject) {
    VK.api('users.get', {'name_case': 'gen'}, function(response) {
      if (response.error) {
        reject(new Error(response.error.error_msg));
      } else {
        headerInfo.textContent = `Музыка на странице ${response.response[0].first_name} ${response.response[0].last_name}`;

        resolve();
      }
    });
  })
}).then(function() {
  function onProgress(e) {
    let progressBar = playingItem.querySelector('[data-role=progressbar]');
    let duration = e.target.duration;
    let currentTime = e.target.currentTime;
    let progress = parseInt(100 / duration * currentTime);

    progressBar.style.width = progress + '%';
  }
  
  function playProgress(e, el, width) {
      let duration = el.querySelector('[data-role=duration]').innerText.split(":");
      duration = parseInt(duration[0])*60 + parseInt(duration[1]);
      globalPlayer.currentTime = duration / width * e.offsetX;
      if (!playingItem) {
        el.querySelector('[data-role=playback]').dispatchEvent(new CustomEvent('click'));
      }
  }

  function onPlay() {
    playingItem.querySelector('[data-role=playback]').className = 'glyphicon glyphicon-pause';
    mainPlaybackButton.querySelector('[data-role=playback]').className = 'glyphicon glyphicon-pause';
  }

  function onPause() {
    playingItem.querySelector('[data-role=playback]').className = 'glyphicon glyphicon-play';
    mainPlaybackButton.querySelector('[data-role=playback]').className = 'glyphicon glyphicon-play';
  }

  function toSong(to) {
    if (playingItem) {
      let nextPlayer = to === 'next' ? playingItem.nextElementSibling : playingItem.previousElementSibling;

      if (nextPlayer) {
        nextPlayer.querySelector('[data-role=playback]').dispatchEvent(new CustomEvent('click'));
      }
    }
  }

  function onEnd() {
    toSong('next');
  }

  prevSongButton.addEventListener('click', function() {
    toSong('prev')
  });

  mainPlaybackButton.addEventListener('click', function() {
    if (playingItem) {
      playingItem.querySelector('[data-role=playback]').dispatchEvent(new CustomEvent('click'));
    } else if (audioList) {
      let firstItem = audioList.querySelector('li');

      if (firstItem) {
        firstItem.querySelector('[data-role=playback]').dispatchEvent(new CustomEvent('click'));
      }
    }
  });

  nextSongButton.addEventListener('click', function() {
    toSong('next');
  });

  document.addEventListener('keydown', function(e) {
    // console.log(e);
    if (e.target.tagName !== 'INPUT') {
      switch (e.keyCode) {
        case 32: {
          e.preventDefault();
          mainPlaybackButton.dispatchEvent(new CustomEvent('click'));

          break;
        }
        case 37: {
          e.preventDefault();
          prevSongButton.dispatchEvent(new CustomEvent('click'));

          break;
        }
        case 39: {
          e.preventDefault();
          nextSongButton.dispatchEvent(new CustomEvent('click'));

          break;
        }
      }
    }
  }, true);

  globalPlayer.addEventListener('play', onPlay);
  globalPlayer.addEventListener('pause', onPause);
  globalPlayer.addEventListener('timeupdate', onProgress);
  globalPlayer.addEventListener('ended', onEnd);

  results.addEventListener('click', function(e) {
    if (e.target.getAttribute('data-role') === 'playback') {
      var currentItem = e.target.parentNode.parentNode.parentNode;

      if (currentItem === playingItem) {
        if (globalPlayer.paused) {
          globalPlayer.play();
        } else {
          globalPlayer.pause();
        }
      } else {
        if (!globalPlayer.paused) {
          onPause();
        }

        playingItem = currentItem;

        globalPlayer.src = e.target.getAttribute('data-src');
        globalPlayer.play();
      }
    }
    if (e.target.getAttribute('data-role') === 'progressbar-container') {
      playProgress(e, e.target.parentNode.parentNode.parentNode, e.target.offsetWidth);
    }
    if (e.target.getAttribute('data-role') === 'progressbar') {
      playProgress(e, e.target.parentNode.parentNode.parentNode.parentNode, e.target.parentNode.offsetWidth);
    }
  }, true);

  return new Promise(function(resolve, reject) {
    VK.api('audio.get', {}, function(response) {
      if (response.error) {
        reject(new Error(response.error.error_msg));
      } else {
        let source = document.getElementById('playerItemTemplate').innerHTML;
        let templateFn = Handlebars.compile(source);
        let template = templateFn({list: response.response});

        results.innerHTML = template;

        resolve();
      }
    });
  });
}).catch(function(e) {
  alert(`Ошибка: ${e.message}`);
});

