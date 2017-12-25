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

$(document).ready(function() {  
  if (location.pathname == "/") {  // promo
    initCalculator();
    initFloatingBlock();
    modalPadding();
    initCallbackPopup();
    initForms();
  }
  else { // category    
    var anchorIndex = location.href.indexOf('#');
    if (anchorIndex >=0) {
      var anchor = location.href.substr(anchorIndex + 1);
      var elem = $('[name="' + anchor + '"]');
      elem.addClass('active');
    }
    else {
      $($('li[name]')[0]).addClass('active');
    }
    $('li[name]').click(function(){
      $('li[name]').removeClass('active');
      $(this).addClass('active');
    });
  }
});

// Calculator
function initCalculator() {
  var selectedTariff = 1;
  var selectedMonthIndex = 3;
  var cellClassNames = ['js-column-pterodactyl','js-column-mastodon','js-column-tyrannosaurus'];
  var buttonClassNames = ['js-button-pterodactyl','js-button-mastodon','js-button-tyrannosaurus'];
  var description = ['Тариф для тех, кому не приходится <br>сталкиваться с бумажной <br> волокитой ежедневно. Доступ <br> ко всей базе юридических <br> документов Doczilla без <br> ' + 
  'абонентской платы, платите <br> только за нужные вам документы.',
  'Ежедневная  подготовка документов больше не будет <br> вас удручать. Получите неограниченный доступ ко всем документам стандартного типа <br> с тарифом «Мастодонт».', 
  'Ультимативное решение всех проблем с оформлением юридических документов любого уровня. Безграничный доступ <br> ко всей базе сервиса Doczilla.'];  
  var taxPerMonth = [[0, 0, 0, 0], [1700, 1200, 1100, 1000], [2100, 1500, 1400, 1300]]; 
  var monthAmounts = [1, 3, 6, 12];
  var monthCellElements = $('.js-month');

  for (var i = 0; i < cellClassNames.length; i++) {
    (function(n){
      $('.' + buttonClassNames[i]).click(function(){
        selectTariff(n);
      });
      $('.' + cellClassNames[i]).click(function(){
        selectTariff(n);
      });
    })(i); 
  }    

  for (var i = 0; i < monthCellElements.length; i++) {
    (function(n){
      $(monthCellElements[n]).click(function(){
        $(monthCellElements[selectedMonthIndex]).removeClass('month--active');
        selectedMonthIndex = n;
        $(monthCellElements[selectedMonthIndex]).addClass('month--active');
        updatePrice();   
      });
    })(i);
  }

  function selectTariff (index) {
    if (index == selectedTariff) {
      return;
    }      
    $('.' + cellClassNames[selectedTariff]).removeClass('column--active');
    $('.' + cellClassNames[index]).addClass('column--active');

    $('.' + buttonClassNames[selectedTariff]).removeClass('button--green');
    $('.' + buttonClassNames[selectedTariff]).addClass('button--white');
    $('.' + buttonClassNames[index]).removeClass('button--white');
    $('.' + buttonClassNames[index]).addClass('button--green');

    $('.js-tariff-description').html(description[index]);
    if (index == 0) {
      $('.js-months-area').addClass('select-date--mute');
      $('.js-mastodon-tyrannosaurus-selected').hide();
      $('.js-pterodactyl-selected').show();
    }
    else {
      $('.js-months-area').removeClass('select-date--mute');
      $('.js-pterodactyl-selected').hide();
      $('.js-mastodon-tyrannosaurus-selected').show();
    }
    selectedTariff = index; 
    updatePrice();     
  } 

  function updatePrice() {
    var pricePerMonth = taxPerMonth[selectedTariff][selectedMonthIndex];
    var monthsAmount = monthAmounts[selectedMonthIndex];
    var price = pricePerMonth * monthsAmount;
    var economy = taxPerMonth[selectedTariff][0] * monthsAmount - price;
    $('.js-price-per-month').text('Цена за 1 месяц: ' + pricePerMonth.toLocaleString() + ' руб.');
    if (selectedTariff > 0) {
      var href = $('.js-mastodon-tyrannosaurus-selected').attr('href');     
      var newHref = href.substr(0, href.indexOf('?')) + '?tariff=' + (3-selectedTariff) + '&months=' + monthsAmount;      
      $('.js-mastodon-tyrannosaurus-selected').attr('href', newHref);
    }
    if (economy > 0 || selectedTariff == 0) {
      $('.js-economy-big').show();
      $('.js-economy-big').text('Экономия: ' + economy.toLocaleString() + ' руб.');
      $('.js-economy-small').hide(); 
    }
    else {
      $('.js-economy-big').hide();
      $('.js-economy-small').show();
    }
    $('.js-price').text('Итого: ' + price.toLocaleString() + ' руб.');
  }
};
// End calculator

// Floating block
var initFloatingBlock;
initFloatingBlock = function() {
  var bottomPosition, firstBlock, floatingBlock, lastBlock, topPosition, updatePosition;
  floatingBlock = $($('.js-float-block')[0]);
  firstBlock = $('#promo')[0];
  lastBlock = $('#start')[0];
  if(!firstBlock || !lastBlock){
    return;
  }
  topPosition = $(firstBlock).offset().top + $(firstBlock).outerHeight();
  bottomPosition = $(lastBlock).offset().top;
  updatePosition = function() {
    var currentScrollPosition;
    currentScrollPosition = $(document).scrollTop() + $(window).height();
    if (currentScrollPosition >= bottomPosition) {
      floatingBlock.removeClass('js-float-block__fixed');
      floatingBlock.css({
        position: 'static'
      });
    }
    if (currentScrollPosition > topPosition && currentScrollPosition < bottomPosition) {
      floatingBlock.addClass('js-float-block__fixed');
      floatingBlock.css({
        position: 'fixed',
        bottom: '0'
      });
    }
    if (currentScrollPosition - topPosition <= floatingBlock.height()) {
      return floatingBlock.css({
        position: 'fixed',
        bottom: (currentScrollPosition - topPosition - floatingBlock.height()) + 'px'
      });
    }
  };
  updatePosition();
  return $(document).on('scroll', function() {
    return updatePosition();
  }); 
};
// End floating block

// Modal dialog event
var modalPadding = function() {
  $('.uk-modal').on({
    'show.uk.modal': function(){      
     $('.js-float-block__fixed').children().addClass('modal-padding');
   }, 
   'hide.uk.modal': function(){ 
     $('.js-float-block__fixed').children().removeClass('modal-padding');
   }
 });
}
// End modal dialog event

// Callback popup
function initCallbackPopup() {
  var callbackPopup = $('#js-form-callback');
  $('#js-callback-toggle').click(function(event) {
    event.preventDefault();
    callbackPopup.toggleClass('navigate__callback--active');    
  });
  $('.js-callback-toggle--open').click(function(event) {
    event.preventDefault();
    callbackPopup.addClass('navigate__callback--active');    
  });
  $('main').click(function(e){
    if (!$(e.target).hasClass('js-callback-toggle--open')) {
      callbackPopup.removeClass('navigate__callback--active');
    }
  });
  $('.footer').click(function(e){
    if (!$(e.target).hasClass('js-callback-toggle--open')) {
      callbackPopup.removeClass('navigate__callback--active');
    }
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
    $('.error-message').text('');
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

  var phoneInputs = document.querySelectorAll(".phone-mask"); 
  $(phoneInputs).mask("+7 (999) 999-9999", {
    placeholder: "+7 (000) 000-0000"
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