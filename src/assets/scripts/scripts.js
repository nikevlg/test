var mql, needShowLoginCaptcha, orientationPortrait, userDeviceInfo;

mql = window.matchMedia("(orientation: portrait)");

needShowLoginCaptcha = void 0;
userDeviceInfo = void 0;
orientationPortrait = mql.matches;

window.onresize = function(event) {
  if (!mql.matches) {
    $('.video-js').addClass('video__mobile--albom');
    //return $('.play-btn-js').addClass('video__mobile__play-btn');
  } else {
    $('.video-js').removeClass('video__mobile--albom');
   // return $('.play-btn-js').removeClass('video__mobile__play-btn');
  }
};


//  Youtube player
var firstScriptTag, onPlayerReady, player, tag;

player = null;
tag = document.createElement('script');
tag.src = "//www.youtube.com/player_api";
firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
window.onYouTubePlayerAPIReady = function() {
  return player = new YT.Player('video', {
    events: {
      'onReady': onPlayerReady
    }
  });
};

onPlayerReady = function() {
  var playButton;
  playButton = document.getElementsByClassName('play-js')[0];
  return playButton.addEventListener('click', function() {
    playButton.classList.add('in-play');
    return player.playVideo();
  });
};

//  End youtube player

