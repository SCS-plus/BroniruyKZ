Template7.registerHelper('stringify', function (context){
    var str = JSON.stringify(context);
    return str.split("'").join('&#39;');
});

// Initialize your app
var bankaKZ = new Framework7({
    precompileTemplates: true,
    template7Pages: true,
    modalTitle: "Бронируй KZ",
    material: true
});

var $$ = Dom7;

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");
    initApp();
});

// Add view
var mainView = bankaKZ.addView('.view-main', {
    // dynamicNavbar: true
});

// Get login form
$$(document).on('click', '#login', function (e) {
    mainView.router.loadContent($$('#loginPage').html());
    bankaKZ.closePanel();
});

//Get registration form
$$(document).on('click', '#registration', function (e) {
    mainView.router.loadContent($$('#registrationPage').html());
    bankaKZ.closePanel();
});

//Get recovery password form
$$(document).on('click', '.get-rec-pass', function (e) {
    mainView.router.loadContent($$('#recoveryPassPage').html());
});

//Get add review form
$$(document).on('click', '#btnAddReview', function (e) {
    mainView.router.loadContent($$('#addReviewPage').html());
    initAddRating();
});

//Submit register form
$$(document).on('click', '.sbt-register', function (e) {
    var formData = bankaKZ.formToJSON('#register-form');
    console.log(JSON.stringify(formData));
});

//Submit recovery form
$$(document).on('click', '.sbt-rec-pass', function (e) {
    mainView.router.loadContent($$('#loginPage').html());
});

$$(document).on('click', '#btnSearch', function (e) {
    var city = $$("#city").val(),
        type = $$("#type").val(),
        service = $$("#service").val(),
        datasearch = $$("#data-search").val(),
        time = $$("#time").val(),
        rating = $$("#rating").val(),
        lowerprice = $$("#lower-price").val(),
        upperprice = $$("#upper-price").val();

    var url = "http://www.markup.romanshkabko.ru/bankadata/test-data.json";

    $$.ajax({
        dataType: 'json',
        url: url,
        success: function (resp) {
            mainView.router.load({
                template: Template7.templates.listTemplate,
                context: resp.products
            });
        },
        error: function (xhr) {
            console.log("Error on ajax call " + xhr);
        }
    });

});

$$(document).on('click', '#about', function (e) {
    var url = "http://www.markup.romanshkabko.ru/bankadata/test-data.json";
    $$.ajax({
        dataType: 'json',
        url: url,
        success: function (resp) {
            mainView.router.load({
                template: Template7.templates.aboutTemplate,
                context: resp.about
            });
            bankaKZ.closePanel();
        },
        error: function (xhr) {
            console.log("Error on ajax call " + xhr);
        }
    });
});

$$(document).on('click', '#help', function (e) {
    var url = "http://www.markup.romanshkabko.ru/bankadata/test-data.json";
    $$.ajax({
        dataType: 'json',
        url: url,
        success: function (resp) {
            mainView.router.load({
                template: Template7.templates.helpTemplate,
                context: resp.help
            });
            bankaKZ.closePanel();
        },
        error: function (xhr) {
            console.log("Error on ajax call " + xhr);
        }
    });
});

$$(document).on('click', '#howadd', function (e) {
    var url = "http://www.markup.romanshkabko.ru/bankadata/test-data.json";
    $$.ajax({
        dataType: 'json',
        url: url,
        success: function (resp) {
            mainView.router.load({
                template: Template7.templates.howaddTemplate,
                context: resp.howadd
            });
            bankaKZ.closePanel();
        },
        error: function (xhr) {
            console.log("Error on ajax call " + xhr);
        }
    });
});

bankaKZ.onPageInit('product', function (page) {
    var lat = $$('.map').attr('data-lat'),
        lan = $$('.map').attr('data-lan');

    $$('.product-service-slider').each(function () {
        var id = $$(this).attr('id');
        initProductServiceSlider(id);
    });

    $$('.reviews .c-rating').each(function () {
        var id = $$(this).attr('id'),
            value = $$(this).attr('data-rating');
        listRating(id, value);
    });

    initProductMainSlider();
    initMap(lat, lan);
});

// Init APP
function initApp() {
    initRangeSlider();
    initCalendarPicker();
}

// Main Page Range Slider
function initRangeSlider() {
    var priceSlider = document.getElementById('price-slider');

    noUiSlider.create(priceSlider, {
        connect: true,
        start: [ 0, 10000 ],
        behaviour: 'drag',
        step: 1000,
        range: {
            'min': 0,
            'max': 10000
        },
        format: ({
            to: function ( value ) {
                return value;
            },
            from: function ( value ) {
                return value;
            }
        })
    });

    function leftValue ( handle ) {
        return handle.parentElement.style.left;
    }

    var lowerValue = document.getElementById('lower-value'),
        upperValue = document.getElementById('upper-value'),
        lowerPrice = document.getElementById('lower-price'),
        upperPrice = document.getElementById('upper-price'),
        handles = priceSlider.getElementsByClassName('noUi-handle');

    priceSlider.noUiSlider.on('update', function ( values, handle ) {
        if ( !handle ) {
            lowerValue.innerHTML = values[handle];
            lowerPrice.setAttribute('value', values[handle]);
        } else {
            upperValue.innerHTML = values[handle];
            upperPrice.setAttribute('value', values[handle]);
        }
    });
}

//Main Page init calendar picker
function initCalendarPicker() {
    var today = new Date();
    var dataSearch = bankaKZ.calendar({
        input: '#data-search',
        dateFormat: 'dd.mm.yyyy',
        monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август' , 'Сентябрь' , 'Октябрь', 'Ноябрь', 'Декабрь'],
        dayNamesShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        closeOnSelect: true,
        disabled: {
            from: new Date(2010, 9, 1),
            to: today
        },
        toolbarCloseText: 'Готово'
    });
}

// Product page Main Slider
function initProductMainSlider() {
    var swiperTop = bankaKZ.swiper('.product-slider-top', {
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        pagination:'.swiper-pagination',
        preloadImages: false,
        lazyLoading: true,
        spaceBetween: 10
    });
}

// Product page Service Slider
function initProductServiceSlider(id) {
    var swiperTop = bankaKZ.swiper('#'+id, {
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        preloadImages: false,
        lazyLoading: true,
        spaceBetween: 10,
        slidesPerView: 3,
        loopAdditionalSlides: 1,
        loop: true
    });
}

// Product page set map
var map;
function initMap(lat, lan) {
    var lating = new google.maps.LatLng(lat, lan),
        icon = '../img/map-marker.png';

    map = new GMaps({
        disableDefaultUI: true,
        el: '.map',
        zoom: 14,
        center: lating,
        streetViewControl: false
    });

    map.addMarker({
        position: lating,
        icon: icon
    });
}

// Output list rating
function listRating(id, value) {
    var el = document.querySelector('#' + id);
    var currentRating = 0;
    var maxRating= 5;
    var myRating = rating(el, currentRating, maxRating);
    myRating.setRating(value);
}

//Add Rating Form
function initAddRating() {
    var el = document.querySelector('#add-star'),
        currentRating = 0,
        maxRating= 5,
        myRating = rating(el, currentRating, maxRating);

    myRating.setRating();
}