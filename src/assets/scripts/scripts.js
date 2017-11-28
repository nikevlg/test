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
  })
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

// Calculator
var calculatorData = {
  selectedTariff: 1,
  selectedMonthIndex: 3,
  cellClassNames: ['js-column-pterodactyl','js-column-mastodon','js-column-tyrannosaurus'],
  buttonClassNames: ['js-button-pterodactyl','js-button-mastodon','js-button-tyrannosaurus'],
  description:['Тариф для тех, кому не приходится <br>сталкиваться с бумажной <br> волокитой ежедневно. Доступ <br> ко всей базе юридических <br> документов Doczilla без <br> ' + 
                      'абонентской платы, платите <br> только за нужные вам документы.',
               'Ежедневная подготовка документов больше не будет вас удручать. Получите неограниченный доступ ко всем документам стандартного типа <br> с тарифом «Мастодонт».',
               'Ультимативное решение всех проблем с оформлением юридических документов любого уровня. Безграничный доступ <br> ко всей базе сервиса Doczilla.'],
  taxPerMonth: [[0, 0, 0, 0], [1700, 1200, 1100, 1000], [2100, 1500, 1400, 1300]],
  monthAmounts: [1, 3, 6, 12],  
  monthEnds: ['месяц', 'месяца', 'месяцев', 'месяцев'],
  monthCellElements: document.getElementsByClassName('js-month'),
  init: function() {
    for (var i = 0; i < this.cellClassNames.length; i++) {
      var button = document.getElementsByClassName(this.buttonClassNames[i])[0];
      (function(n){
        button.onclick = function() {calculatorData.selectTariff(n);};       
      })(i);
      var cells = document.getElementsByClassName(this.cellClassNames[i]);
      for (var j = 0; j < cells.length; j++) {
        (function(n,k){
          cells[k].onclick = function() {calculatorData.selectTariff(n);};       
        })(i,j);
      }
    }    
    for (var i = 0; i < this.monthCellElements.length; i++) {
      (function(n){
        calculatorData.monthCellElements[n].onclick = function() {
          calculatorData.monthCellElements[calculatorData.selectedMonthIndex].classList.remove('month--active');
          calculatorData.selectedMonthIndex = n;
          calculatorData.monthCellElements[calculatorData.selectedMonthIndex].classList.add('month--active');          
          calculatorData.updatePrice();
        };       
      })(i);
    }
  },
  selectTariff: function(index) {
    if (index == this.selectedTariff) {
      return;
    }      
    var currentActiveCells = document.getElementsByClassName(this.cellClassNames[this.selectedTariff]);
    var newActiveCells = document.getElementsByClassName(this.cellClassNames[index]);
    for (var i = 0; i < newActiveCells.length; i++) {
      currentActiveCells[i].classList.remove("column--active");
      newActiveCells[i].classList.add("column--active");
    }   
    var currentActiveButton = document.getElementsByClassName(this.buttonClassNames[this.selectedTariff])[0];
    var newActiveButton = document.getElementsByClassName(this.buttonClassNames[index])[0];
    currentActiveButton.classList.remove("button--green"); 
    currentActiveButton.classList.add("button--white");
    newActiveButton.classList.remove("button--white"); 
    newActiveButton.classList.add("button--green");
    document.getElementsByClassName('js-tariff-description')[0].innerHTML = this.description[index];
    var startWorkButton = document.getElementsByClassName('js-pterodactyl-selected')[0];
    var buyButton = document.getElementsByClassName('js-mastodon-tyrannosaurus-selected')[0];
    if (index == 0) {
      document.getElementsByClassName('js-months-area')[0].classList.add('select-date--mute');
      startWorkButton.style.display = 'inline-block';
      buyButton.style.display = 'none';
    }
    else {
      document.getElementsByClassName('js-months-area')[0].classList.remove('select-date--mute');
      startWorkButton.style.display = 'none';
      buyButton.style.display = 'inline-block';
    }

    this.selectedTariff = index; 
    this.updatePrice();     
  },
  updatePrice: function() {
    var pricePerMonth = this.taxPerMonth[this.selectedTariff][this.selectedMonthIndex];
    var monthsAmount = this.monthAmounts[this.selectedMonthIndex];
    var price = pricePerMonth * monthsAmount;
    var economy = this.taxPerMonth[this.selectedTariff][0] * monthsAmount - price;
    var monthEnd = this.monthEnds[this.selectedMonthIndex];
    document.getElementsByClassName('js-price-per-month')[0].innerHTML = 'Цена за ' + monthsAmount + ' ' + monthEnd + ': ' + pricePerMonth.toLocaleString() + ' руб.';
    if (economy > 0 || this.selectedTariff == 0) {
      document.getElementsByClassName('js-economy')[0].innerHTML = 'Экономия: ' + economy.toLocaleString() + ' руб.';
    }
    else {
      document.getElementsByClassName('js-economy')[0].innerHTML = 'Экономьте, выбирая <br> больший срок использования';
    }
    document.getElementsByClassName('js-price')[0].innerHTML = 'Итого: ' + price.toLocaleString() + ' руб.';
  }
};

document.addEventListener("DOMContentLoaded", function(event) { 
  calculatorData.init();
});
// End calculator