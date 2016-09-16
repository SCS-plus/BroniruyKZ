Template7.registerHelper('stringify', function (context){
    var str = JSON.stringify(context);
    return str.split("'").join('&#39;');
});

// Initialize your app
var bankaKZ = new Framework7({
    precompileTemplates: true,
    template7Pages: true,
    modalTitle: "Booking KZ",
    material: true
});

var $$ = Dom7;

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");
    getFilters();
});

// Add view
var mainView = bankaKZ.addView('.view-main'),
    sidebarView = bankaKZ.addView('.view-sidebar');

// Get panel left
$$(document).on('click', '.open-panel', function (e) {
    getSidebar();
});

// Get login form
$$(document).on('click', '#login', function (e) {
    mainView.router.loadContent($$('#loginPage').html());
    bankaKZ.closePanel();
});

//Get registration form
$$(document).on('click', '#registration', function (e) {
    getRegisterData();
    bankaKZ.closePanel();
});

//Get recovery password form
$$(document).on('click', '.get-rec-pass', function (e) {
    mainView.router.loadContent($$('#recoveryPassPage').html());
});

//Submit recovery form
$$(document).on('click', '.sbt-rec-pass', function (e) {
    sendPassword();
});

//Search button submit
$$(document).on('click', '#btnSearch', function (e) {
    var city = $$("#city").val(),
        type = $$("#type").val(),
        service = $$("#service").val(),
        datasearch = $$("#data-search").val(),
        time = $$("#time").val(),
        rating = $$("#rating").val(),
        lowerprice = $$("#lower-price").val(),
        upperprice = $$("#upper-price").val();

    var url = "http://xn--90aodoeldy.kz/mobile_api/pageInit/list.php?city=" + city + "&type="
        + type + "&service=" + service + "&datasearch=" + datasearch + "&time="
        + time + "&rating=" + rating + "&lowerprice=" + lowerprice + "&upperprice=" + upperprice;

    $$.ajax({
        dataType: 'json',
        url: url,
        success: function (resp) {
            if(resp.products == null){
                var ctx = {'empty': true};
            } else {
                var ctx = resp.products;
            }
            mainView.router.load({
                template: Template7.templates.listTemplate,
                context: ctx
            });
        },
        error: function (xhr) {
            console.log("Error on ajax call " + xhr);
        }
    });
});

//Logout event
$$(document).on('click', '#btnLogout', function (e) {
    $$.get('http://xn--90aodoeldy.kz/mobile_api/forms/logout.php');
    bankaKZ.closePanel();
});

//Get about page
$$(document).on('click', '#about', function (e) {
    var url = "http://xn--90aodoeldy.kz/mobile_api/pageInit/about.php";

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

//Get help page
$$(document).on('click', '#help', function (e) {
    var url = "http://xn--90aodoeldy.kz/mobile_api/pageInit/help.php";

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

//Get page How to add
$$(document).on('click', '#howadd', function (e) {
    var url = "http://xn--90aodoeldy.kz/mobile_api/pageInit/howadd.php";
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

//Get Personal Page
$$(document).on('click', '#account', function (e) {
    // getPersonalData();
});

//Init Index Page
bankaKZ.onPageInit('index', function (page) {
    initApp();
});

//Init Product Page
bankaKZ.onPageInit('product', function (page) {
    var lat = $$('.map').attr('data-lat'),
        lan = $$('.map').attr('data-lan'),
        adress = $$('.map').attr('data-adress');

    $$('.product-service-slider').each(function () {
        var id = $$(this).attr('id');
        initProductServiceSlider(id);
    });

    $$('.list-rating').each(function () {
        var id = $$(this).attr('id'),
            value = $$(this).attr('data-rating');
        listRating(id, value);
    });

    initProductMainSlider();
    initMap(lat, lan, adress);
});

//Init Registration Page
bankaKZ.onPageInit('registration-page', function (page) {

    $$('.sbt-register').on('click', function (e) {
        var valid = true,
            pattern = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+\.([a-z0-9]{1,6}\.)?[a-z]{2,6}$/i;

        if($$("#email").val().search(pattern) !== 0){
            valid = false;
            bankaKZ.alert('Вы ввели неправильный Email!');
        }

        if(valid) {
            var formData = bankaKZ.formToJSON('#register-form'),
                url = 'http://xn--90aodoeldy.kz/mobile_api/forms/register.php';

            $$.ajax({
                dataType: 'json',
                url: url,
                method: 'POST',
                data: formData,
                success: function (resp) {
                    if(resp.status == "OK" || resp.status == "ERROR") { bankaKZ.alert(resp.message); }
                },
                error: function (xhr) {
                    console.log("Error on ajax call " + xhr);
                }
            });
        }
    });
});

//Init Login Page
bankaKZ.onPageInit('login-page', function (page) {
    $$('.sbt-login').on('click', function (e) {
        var formData = bankaKZ.formToJSON('#login-form'),
            url = 'http://xn--90aodoeldy.kz/mobile_api/forms/auth.php';

        $$.ajax({
            dataType: 'json',
            url: url,
            method: 'POST',
            data: formData,
            success: function (resp) {
                if(resp.status == "OK") { getFilters(); }
                else if (resp.status == "ERROR") { bankaKZ.alert(resp.message); }
            },
            error: function (xhr) {
                console.log("Error on ajax call " + xhr);
            }
        });

    });
});

//Init Add Review PAge
bankaKZ.onPageInit('addreview-page', function (page) {
    $$(document).on('click', '.sbt-review', function (e) {
        sendReview();
    });
});

//Init Personal Page
bankaKZ.onPageInit('personal-userpage', function (page) {
    $$('.list-rating').each(function () {
        var id = $$(this).attr('id'),
            value = $$(this).attr('data-rating');
        listRating(id, value);
    });
});

// Init APP
function initApp() {
    initRangeSlider();
    initCalendarPicker();
}

// Get filter data with JSON
function getFilters() {
    var url = "http://xn--90aodoeldy.kz/mobile_api/pageInit/filter.php";

    $$.ajax({
        dataType: 'json',
        url: url,
        success: function (resp) {
            mainView.router.load({
                template: Template7.templates.mainTemplate,
                context: resp.filters[0]
            });
        },
        error: function (xhr) {
            console.log("Error on ajax call " + xhr);
        }
    });
}

//Get register data list
function getRegisterData() {
    var url = "http://xn--90aodoeldy.kz/mobile_api/pageInit/register.php";

    $$.ajax({
        dataType: 'json',
        url: url,
        success: function (resp) {
            mainView.router.load({
                template: Template7.templates.registrationTemplate,
                context: resp.register
            });
        },
        error: function (xhr) {
            console.log("Error on ajax call " + xhr);
        }
    });
}

//Send recovery password
function sendPassword() {
    var formData = bankaKZ.formToJSON('#recovery-pass-form'),
        url = "http://xn--90aodoeldy.kz/mobile_api/forms/forgot.php";

    $$.ajax({
        dataType: 'json',
        url: url,
        method: 'POST',
        data: formData,
        success: function (resp) {
            if(resp.status == "OK") {
                bankaKZ.alert(resp.message);
                mainView.router.back();
            }
            else if (resp.status == "ERROR") {
                bankaKZ.alert(resp.message);
            }
        },
        error: function (xhr) {
            console.log("Error on ajax call " + xhr);
        }
    })
}

//Send review
function sendReview() {
    var formData = bankaKZ.formToJSON('#addreview-form'),
        url = "http://xn--90aodoeldy.kz/mobile_api/forms/review.php";

    $$.ajax({
        dataType: 'json',
        url: url,
        method: 'POST',
        data: formData,
        success: function (resp) {
            if(resp.status == "OK") {
                bankaKZ.alert(resp.message);
                mainView.router.back();
            }
            else if (resp.status == "ERROR") {
                bankaKZ.alert(resp.message);
            }
        },
        error: function (xhr) {
            console.log("Error on ajax call " + xhr);
        }
    })
}

//Get sidebar
function getSidebar() {
    var url = "http://xn--90aodoeldy.kz/mobile_api/pageInit/sidebar.php";

    $$.ajax({
        dataType: 'json',
        url: url,
        success: function (resp) {
            sidebarView.router.load({
                template: Template7.templates.sidebarTemplate,
                context: resp.sidebar
            });
        },
        error: function (xhr) {
            console.log("Error on ajax call " + xhr);
        }
    });
}

// Get Personal data with JSON
function getPersonalData() {
    var url = "#";

    $$.ajax({
        dataType: 'json',
        url: url,
        success: function (resp) {
            mainView.router.load({
                template: Template7.templates.personalTemplate,
                context: resp.users[0]
            });
        },
        error: function (xhr) {
            console.log("Error on ajax call " + xhr);
        }
    });
}

// Main Page Range Slider
function initRangeSlider() {
    var lowerprice = parseInt($$('#lower-price').attr('data-price')),
        upperprice = parseInt($$('#upper-price').attr('data-price')),
        priceSlider = document.getElementById('price-slider'),
        lowerValue = document.getElementById('lower-value'),
        upperValue = document.getElementById('upper-value'),
        lowerPrice = document.getElementById('lower-price'),
        upperPrice = document.getElementById('upper-price');

    noUiSlider.create(priceSlider, {
        connect: true,
        start: [ lowerprice, upperprice ],
        behaviour: 'drag',
        step: 100,
        range: {
            'min': lowerprice,
            'max': upperprice
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

    priceSlider.noUiSlider.on('update', function ( values, handle ) {
        if ( !handle ) {
            lowerValue.innerHTML = parseInt(values[handle]);
            lowerPrice.setAttribute('value', values[handle]);
        } else {
            upperValue.innerHTML = parseInt(values[handle]);
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
            to: today.setDate(today.getDate() - 1)
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
        preloadImages: true,
        lazyLoading: true,
        spaceBetween: 10,
        slidesPerView: 3,
        loopAdditionalSlides: 1,
        loop: true
    });
}

// Product page set map
function initMap(lat, lan, adress) {
    var map,
        latlng = new google.maps.LatLng(lat, lan),
        icon = 'img/map-marker.png';

    if(lat && lan) {
        map = new GMaps({
            disableDefaultUI: true,
            el: '.map',
            zoom: 14,
            center: latlng,
            streetViewControl: false
        });

        map.addMarker({
            position: latlng,
            icon: icon
        });
    } else {
        GMaps.geocode({
            address: adress,
            callback: function(results, status) {
                if (status == 'OK') {
                    var latlng = results[0].geometry.location;
                    map = new GMaps({
                        disableDefaultUI: true,
                        el: '.map',
                        zoom: 14,
                        center: latlng,
                        streetViewControl: false
                    });
                    map.addMarker({
                        position: latlng,
                        icon: icon
                    });
                }
            }
        });
    }
}

// Output list rating
function listRating(id, value) {
    var el = $$('#' + id + ' input');

    $$(el).each(function () {
        if ($$(this).val() == value) {
            $$(this).attr( "checked", "checked" );
        }
    });
}
