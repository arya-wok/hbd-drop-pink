// player.js — YouTube music player
(function () {
  'use strict';

  var VIDEO_ID = 'NZGHXy1IAHM';
  var START_TIME = 60;
  var player = null;
  var isPlaying = false;
  var unmuted = false;

  // Create hidden YouTube player container
  var playerDiv = document.createElement('div');
  playerDiv.id = 'ytPlayer';
  playerDiv.style.cssText = 'position:fixed;left:-9999px;top:0;width:200px;height:120px;opacity:0.01;pointer-events:none;';
  document.body.appendChild(playerDiv);

  // Create music button
  var btn = document.createElement('div');
  btn.id = 'musicBtn';
  btn.style.cssText =
    'position:fixed;bottom:28px;right:28px;z-index:100;' +
    'display:flex;align-items:center;gap:6px;' +
    'padding:7px 14px;border-radius:20px;' +
    'background:rgba(5,5,5,.72);' +
    'border:1px solid rgba(255,110,180,.4);' +
    'color:#ff6eb4;cursor:pointer;' +
    'font-family:Outfit,sans-serif;font-weight:200;font-size:10px;' +
    'letter-spacing:1px;' +
    'box-shadow:0 0 12px rgba(255,110,180,.25);' +
    'transition:background .3s,border-color .3s,box-shadow .3s,color .3s;';
  document.body.appendChild(btn);

  function updateButton() {
    var svg, label;
    if (isPlaying && unmuted) {
      svg = '<rect x="2" y="2" width="3" height="9" fill="#ff6eb4"/><rect x="8" y="2" width="3" height="9" fill="#ff6eb4"/>';
      label = 'Pause Music';
    } else if (isPlaying && !unmuted) {
      svg = '<rect x="2" y="2" width="3" height="9" fill="#ff6eb4"/><rect x="8" y="2" width="3" height="9" fill="#ff6eb4"/>';
      label = 'Unmute Music';
    } else {
      svg = '<path d="M2 2l9 4.5L2 11V2z" fill="#ff6eb4"/>';
      label = 'Play Music';
    }
    btn.innerHTML = '<svg width="13" height="13" viewBox="0 0 13 13" fill="none" id="musicSvg">' + svg + '</svg> <span id="musicLabel">' + label + '</span>';
  }

  updateButton();

  // Load YouTube IFrame API
  var script = document.createElement('script');
  script.src = 'https://www.youtube.com/iframe_api';
  var firstScript = document.getElementsByTagName('script')[0];
  firstScript.parentNode.insertBefore(script, firstScript);

  window.onYouTubeIframeAPIReady = function () {
    player = new YT.Player('ytPlayer', {
      videoId: VIDEO_ID,
      playerVars: {
        autoplay: 1,
        start: START_TIME,
        controls: 0,
        rel: 0,
        modestbranding: 1,
        loop: 1,
        playlist: VIDEO_ID,
        enablejsapi: 1,
        mute: 1
      },
      events: {
        onReady: function () {
          player.setVolume(80);
          player.seekTo(START_TIME, true);
        },
        onStateChange: function (e) {
          if (e.data === YT.PlayerState.PLAYING) { isPlaying = true; updateButton(); }
          else if (e.data === YT.PlayerState.PAUSED) { isPlaying = false; updateButton(); }
          else if (e.data === YT.PlayerState.ENDED) { player.seekTo(START_TIME, true); player.playVideo(); }
          else if (e.data === YT.PlayerState.UNSTARTED) { player.playVideo(); }
        }
      }
    });
  };

  // Button click handler
  btn.addEventListener('click', function () {
    if (!player) return;
    if (!unmuted) {
      player.unMute();
      player.setVolume(80);
      player.seekTo(START_TIME, true);
      player.playVideo();
      unmuted = true;
      return;
    }
    if (isPlaying) {
      player.pauseVideo();
    } else {
      player.seekTo(START_TIME, true);
      player.playVideo();
    }
  });

  // Hover effects
  btn.addEventListener('mouseenter', function () {
    btn.style.background = 'rgba(255,110,180,0.15)';
    btn.style.borderColor = 'rgba(255,110,180,0.7)';
    btn.style.boxShadow = '0 0 20px rgba(255,110,180,0.18)';
  });
  btn.addEventListener('mouseleave', function () {
    btn.style.background = 'rgba(5,5,5,0.72)';
    btn.style.borderColor = 'rgba(255,110,180,0.4)';
    btn.style.boxShadow = '0 0 12px rgba(255,110,180,0.25)';
  });

  // expose unmute for auto-unmute after loading
  window.unmuteMusic = function () {
    if (unmuted || !player) return;
    player.unMute();
    player.setVolume(80);
    player.seekTo(START_TIME, true);
    player.playVideo();
    unmuted = true;
    updateButton();
  };

})();
