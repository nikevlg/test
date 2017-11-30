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
    document.getElementsByClassName('js-price-per-month')[0].innerHTML = 'Цена за 1 месяц: ' + pricePerMonth.toLocaleString() + ' руб.';
    if (economy > 0 || this.selectedTariff == 0) {
      document.getElementsByClassName('js-economy-big')[0].innerHTML = 'Экономия: ' + economy.toLocaleString() + ' руб.';
      document.getElementsByClassName('js-economy-big')[0].style.display = 'block';
      document.getElementsByClassName('js-economy-small')[0].style.display = 'none';
    }
    else {
      document.getElementsByClassName('js-economy-small')[0].style.display = 'block';
      document.getElementsByClassName('js-economy-big')[0].style.display = 'none';
    }
    document.getElementsByClassName('js-price')[0].innerHTML = 'Итого: ' + price.toLocaleString() + ' руб.';
  }
};

document.addEventListener("DOMContentLoaded", function(event) { 
  calculatorData.init();
  initCallbackPopup();
  initForms();
});
// End calculator

// Callback popup
function initCallbackPopup() {
  var toggleElement = $('#js-callback-toggle');
  var callbackPopup = $('#js-form-callback');
  toggleElement.click(function(event) {
    event.preventDefault();
    callbackPopup.toggleClass('navigate__callback--active');    
  });
  $('main').click(function(){
    callbackPopup.removeClass('navigate__callback--active');
  });
  $('.footer').click(function(){
    callbackPopup.removeClass('navigate__callback--active');
  }); 
}
// End callback popup

// Forms
function initForms() {
  var emailTest = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  var phoneTest = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/;
  var loginTest = /^[a-zA-Z0-9_\-@\+\.]{3,30}$/;
  var nameTest = /^[a-zA-Zа-яА-ЯёЁ\-\s]{2,50}$/;

  $('.js-remove-error').click(function(e){
    e.preventDefault();
    $(this).removeClass('input-error');
    $('.error-message').removeClass('error-message');
    $('.success-message').removeClass('success-message');
  })

  $('#js-callback-name').click(function(e){
    e.preventDefault();
    $('#js-callback-name-error').text('');
    $('#js-callback-success-error').text('');
  });

  $('#js-callback-email').click(function(e){
    e.preventDefault();
    $('#js-callback-email-error').text('');
    $('#js-callback-success-error').text('');
  })

  $('#js-callback-phone').click(function(e){
    e.preventDefault();
    $('#js-callback-phone-error').text('');
    $('#js-callback-success-error').text('');
  })

  $('#js-form-callback').on('submit', function(event) {
    event.preventDefault();
    var name = $('#js-callback-name');
    var email = $('#js-callback-email');
    var phone = $('#js-callback-phone');
    var message = $('#js-callback-success-error');
    var allCorrect = true;
    if (!nameTest.test(name.val())) {
      allCorrect = false;
      $('#js-callback-name-error').text('Введите имя');
    }
    else {
      $('#js-callback-name-error').text('');
    }
    if (!emailTest.test(email.val())) {
      allCorrect = false;
      $('#js-callback-email-error').text('Введите корректный e-mail');
    }
    else {
      $('#js-callback-email-error').text('');
    }
    if (!phoneTest.test(phone.val())) {
      allCorrect = false;
      $('#js-callback-phone-error').text('Неверный формат');
    }
    else {
      $('#js-callback-phone-error').text('');
    }
    var recaptcha = grecaptcha.getResponse(callbackRecaptcha);
    if (recaptcha == '') {
      allCorrect = false;
      message.removeClass('success-message');
      message.text('Пройдите проверку');
    }
    else {
      message.text('');
    }
    if (allCorrect) {
      var xhr = new XMLHttpRequest();
      xhr.withCredentials = true 
      xhr.addEventListener('readystatechange', function() {
        if (this.readyState == 4) {       
          grecaptcha.reset(callbackRecaptcha);
          if (status == 200) {          
            name.val('');
            email.val('');
            phone.val('');
            message.addClass('success-message');
            message.innerText = 'Ваш звонок был успешно заказан';
          }
          else { 
            message.removeClass('success-message');
            message.innerText = 'Ошибка при заказе звонка';
          }
        }
      });
      xhr.open('POST', 'DYNAMIC_URL_REQUEST_API/api/promo/callback/order', true);
      xhr.setRequestHeader('content-type', 'application/json'); 
      xhr.send(JSON.stringify({
        name: name.val(),
        recaptcha: recaptcha,
        email: email.val(),
        phone: phone.val(),
        timeTo: 23,
        timeFrom: 0})
      );
    }
  });

  $('#js-form-questions').on('submit', function(event) {
    event.preventDefault();
    var name = $('#js-questions-name');
    var email = $('#js-questions-email');
    var text = $('#js-questions-text');
    var message = $('#js-questions-success-error');
    var allCorrect = true;
    if (!nameTest.test(name.val())) {
      allCorrect = false;
      name.addClass('input-error');
    }
    if (!emailTest.test(email.val())) {
      allCorrect = false;
      email.addClass('input-error');
    }
    var recaptcha = grecaptcha.getResponse(questionsRecaptcha);
    if (recaptcha == '') {
      allCorrect = false;
      message.removeClass('success-message');
      message.addClass('error-message');
      message.text('Пройдите проверку');
    }
    else {
      message.text('');
    }
    if (allCorrect) {
      var xhr = new XMLHttpRequest();
      xhr.withCredentials = true 
      xhr.addEventListener('readystatechange', function() {
        if (this.readyState == 4) {       
          grecaptcha.reset(questionsRecaptcha);
          if (status == 200) {          
            name.val('');
            email.val('');
            phone.val('');
            message.removeClass('error-message');
            message.addClass('success-message');
            message.innerText = 'Ваш звонок был успешно заказан';
          }
          else { 
            message.removeClass('success-message');
            message.addClass('error-message');
            message.innerText = 'Ошибка при заказе звонка';
          }
        }
      });
      xhr.open('POST', 'DYNAMIC_URL_REQUEST_API/api/promo/feedback/send', true);
      xhr.setRequestHeader('content-type', 'application/json'); 
      xhr.send(JSON.stringify({
        name: name.val(),
        recaptcha: recaptcha,
        email: email.val(),
        message: text.val()})
      );
    }
  });
}
// End forms


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

// Recapcha
var callbackRecaptcha, questionsRecaptcha;

myRecaptchaCallBack = function() {
  callbackRecaptcha = grecaptcha.render('callback-recaptcha', {
    'sitekey': '6Lezxx4UAAAAAEYE_GgthpGKn-qirqme8FbykCLf',
    'theme': 'light'
  });
  questionsRecaptcha = grecaptcha.render('questions-recaptcha', {
    'sitekey': '6Lezxx4UAAAAAEYE_GgthpGKn-qirqme8FbykCLf',
    'theme': 'light'
  });
};
//  End recapcha