Template7.registerHelper('stringify', function (context){
    var str = JSON.stringify(context);
    return str.split("'").join('&#39;');
});

// Initialize your app
var bankaKZ = new Framework7({
    precompileTemplates: true,
    template7Pages: true,
    modalTitle: "Бронируй.KZ",
    externalLinks: '.external, a[target="_system"]',
    material: true
});

var $$ = Dom7;
var storage = window.localStorage;

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");
    getPullId();
    getFilters();
    getPushNotify();
    showPopupRegistration();
    document.addEventListener('backbutton', onBackKeyDown, false);
});

// Add view
var mainView = bankaKZ.addView('.view-main'),
    sidebarView = bankaKZ.addView('.view-sidebar');

// Refresh Main Page
$$(document).on('refresh', '.pull-to-refresh-content', function (e) {
    setTimeout(function () {
        mainView.router.refreshPage();
        bankaKZ.pullToRefreshDone();
    }, 2000);
});

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

//Send phone code
$$(document).on('click', '.send-code', function (e) {
    var phone = $$("#register-form #phone").val().replace('(', '').replace(')', '').replace('+', '').replace(' ', '')
            .replace('-', '').replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', '');
    var url = "https://www.xn--90aodoeldy.kz/mobile_api/forms/reg_code_send.php";

    $$.ajax({
        dataType: 'json',
        url: url,
        method: 'GET',
        data: {
            'PHONE': phone
        },
        success: function (resp) {
            if(resp.status == "OK") {
                bankaKZ.alert(resp.message);
                $$("#register-form #code").attr('data-value', resp.code);
            }
            else if (resp.status == "ERROR") {
                bankaKZ.alert(resp.message);
            }
        },
        error: function (xhr) {
            console.log("Error on ajax call " + xhr);
        }
    })
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

    var url = "https://www.xn--90aodoeldy.kz/mobile_api/pageInit/list.php?city=" + city + "&type="
        + type + "&service=" + service + "&datasearch=" + datasearch + "&time="
        + time + "&rating=" + rating + "&lowerprice=" + lowerprice + "&upperprice=" + upperprice;

    $$.ajax({
        dataType: 'json',
        url: url,
        success: function (resp) {
            if(resp.status == 'ERROR') {
                bankaKZ.alert(resp.message);
            }
            else {
                if(resp.products == null){
                    var ctx = {'empty': true};
                } else {
                    var ctx = resp.products;
                    storage.setItem('products', JSON.stringify(ctx));
                }
                mainView.router.load({
                    template: Template7.templates.listTemplate,
                    context: ctx
                });
            }
        },
        error: function (xhr) {
            console.log("Error on ajax call " + xhr);
        }
    });
});

//Logout event
$$(document).on('click', '#btnLogout', function (e) {
    $$.get("https://www.xn--90aodoeldy.kz/mobile_api/forms/logout.php");
    window.plugins.OneSignal.deleteTag("bitrixid");
    bankaKZ.closePanel();
});

//Get about page
$$(document).on('click', '#about', function (e) {
    var url = "https://www.xn--90aodoeldy.kz/mobile_api/pageInit/about.php";

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
    var url = "https://www.xn--90aodoeldy.kz/mobile_api/pageInit/help.php";

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
    var url = "https://www.xn--90aodoeldy.kz/mobile_api/pageInit/howadd.php";
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

//Get page Instruction
$$(document).on('click', '#get-instruction', function (e) {
    var url = "https://www.xn--90aodoeldy.kz/mobile_api/pageInit/instructions.php";
    $$.ajax({
        dataType: 'json',
        url: url,
        success: function (resp) {
            mainView.router.load({
                template: Template7.templates.instructionTemplate,
                context: resp.instructions
            });
            bankaKZ.closeModal('.modal');
        },
        error: function (xhr) {
            console.log("Error on ajax call " + xhr);
        }
    });
});

// Get login form with popup
$$(document).on('click', '#get-login', function (e) {
    mainView.router.loadContent($$('#loginPage').html());
    bankaKZ.closeModal('.modal');
});

//Get page Website Rights
$$(document).on('click', '#rules', function (e) {
    var url = "https://www.xn--90aodoeldy.kz/mobile_api/pageInit/rules.php";
    $$.ajax({
        dataType: 'json',
        url: url,
        success: function (resp) {
            mainView.router.load({
                template: Template7.templates.siteRulesTemplate,
                context: resp.rules
            });
        },
        error: function (xhr) {
            console.log("Error on ajax call " + xhr);
        }
    });
});

//Get Personal Page
$$(document).on('click', '#account', function (e) {
    getPersonalData();
    bankaKZ.closePanel();
});

//Send status Personal Page
$$(document).on('click', '.sbt-status', function (e) {
    var id = $$(this).data('id');
    var action = $$(this).data('action');
    var url = "https://www.xn--90aodoeldy.kz/mobile_api/forms/reserve_action.php";

    $$.ajax({
        dataType: 'json',
        url: url,
        method: 'GET',
        data: {
            "ID": id,
            "ACTION": action
        },
        success: function (resp) {
            if(resp.status == "OK") {
                bankaKZ.alert(resp.message);
                mainView.router.back();
                getPersonalData();
            }
            else if (resp.status == "ERROR") {
                bankaKZ.alert(resp.message);
            }
        },
        error: function (xhr) {
            console.log("Error on ajax call " + xhr);
        }
    })
});

//Send booking form
$$(document).on('click', '.sbt-booking', function (e) {
    var formData = bankaKZ.formToJSON('#booking-form');
    var url = "https://www.xn--90aodoeldy.kz/mobile_api/forms/reserve_add.php";

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
});

//Init Index Page
bankaKZ.onPageInit('index', function (page) {
    initApp();

    var allServices = $$('#service option');
    var Services = [];

    $$.each(service, function(i, item){
        var name = $$(item).text();
        var value = $$(item).val();
        var types = $$(item).data('types');

        Services.push({
            "value": value,
            "name": name,
            "types": types
        });
    });
    storage.setItem('services', JSON.stringify(Services));

    $$('body').on('change', '#type', function(){
        var type = $$(this).val();
        var service = $$('#service option');
        var storageService = JSON.parse(storage.getItem('services'));

        service.remove();
        
        $$('#service').append('<option value="0" data-types="0">Не выбрано</option>');

        $$.each(storageService, function(i, item) {
            if (item.types.indexOf(type) != -1) {
                $$('#service').append("<option value='" + item.value + "' data-types='" + item.types + "'>" + item.name + "</option>");
            }
        });

        var selectText = $$('#service option:first-child').text();
        $$('.service-select .item-after').text(selectText);
    });
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
    initBirthPicker();

    VMasker(document.getElementById('phone')).maskPattern("+9 (999) 999-99-99");

    $$('.sbt-register').on('click', function (e) {
        var valid = true,
            code = $$("#register-form #code").attr('data-value'),
            code_value = $$("#register-form #code").val(),
            pattern = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+\.([a-z0-9]{1,6}\.)?[a-z]{2,6}$/i;

        if($$("#email").val().search(pattern) !== 0){
            valid = false;
            bankaKZ.alert('Вы ввели неправильный Email!');
        }

        if($$("#siterights").prop('checked') == false && valid){
            valid = false;
            bankaKZ.alert('Нужно согласиться с правилами сервиса.');
        }

        if(code && valid) {
            if (code != code_value) {
                valid = false;
                bankaKZ.alert('Неправильный код из СМС');
            }
        }
        else if (valid) {
            valid = false;
            bankaKZ.alert('Неправильный код из СМС');
        }

        if(valid) {
            var formData = bankaKZ.formToJSON('#register-form');
            var url = "https://www.xn--90aodoeldy.kz/mobile_api/forms/register.php";

            $$.ajax({
                dataType: 'json',
                url: url,
                method: 'POST',
                data: formData,
                success: function (resp) {
                    if(resp.status == "OK" || resp.status == "ERROR") {
                        bankaKZ.alert(resp.message);
                        getFilters();
                    }
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
        var formData = bankaKZ.formToJSON("#login-form");
        var url = "https://www.xn--90aodoeldy.kz/mobile_api/forms/auth.php";

        $$.ajax({
            dataType: 'json',
            url: url,
            method: 'POST',
            data: formData,
            success: function (resp) {
                if(resp.status == "OK") {
                    getFilters();
                    getPushId();
                }
                else if (resp.status == "ERROR") { bankaKZ.alert(resp.message); }
            },
            error: function (xhr) {
                console.log("Error on ajax call " + xhr);
            }
        });

    });
});

//Init Add Review Page
bankaKZ.onPageInit('addreview-page', function (page) {
    $$(document).on('click', '.sbt-review', function (e) {
        sendReview();
    });
});

//Init Booking Page
bankaKZ.onPageInit('booking-page', function (page) {
    var productId = $$('#productid').val();
    var serviceWrapperId = $$('.subradiowrapper li:first-child input').val();
    var dailyBooked = $$('.subradiowrapper li:first-child #subproductdaily-'+serviceWrapperId).val();

    initCalendarRangeServicePicker(productId, serviceWrapperId, dailyBooked);

    $$('.subradiowrapper li:first-child input').prop("checked", true);
    $$('#service-'+serviceWrapperId).show();

    if(dailyBooked == "Y") {
        $$('.time').hide();
    } else {
        $$('.time').show();
    }

    calcBooking();

    $$(document).on('change', '.sub-radio', function (e) {
        var id = $$(this).val();
        var tempdailyBooked = $$(this).parent().find('#subproductdaily-'+id).val();

        initCalendarRangeServicePicker(productId, id, tempdailyBooked);

        $$('.subproductservice').hide();
        $$('.subproductservice input').each(function () {
            $$(this).prop("checked", false);
        });
        $$('#service-'+id).show();

        if(tempdailyBooked == "Y") {
            $$('.time').hide();
        } else {
            $$('.time').show();
        }

        calcBooking();
    });

    $$(document).on('change', '.subproductservice input', function (e) {
        calcBooking();
    });

    $$(document).on('change', '#calendar-service-from', function (e) {
        var date = $$(this).val();

        if(dailyBooked == "Y") {
            $$('#calendar-service-to').val(addOneDay(date));
        } else {
            $$('#calendar-service-to').val(date);
        }
    });

    $$(document).on('change', '#time-to', function (e) {
        calcBooking();
    });

    $$(document).on('change', '#time-from', function (e) {
        var time = parseInt($$(this).val()) + 1;
        $$("#time-to option[value='"+ time +":00']").prop('selected', 'true');
        $$("#time-to").siblings('.item-content').find('.item-after').html(time +':00');
        calcBooking();
    });

    $$(document).on('change', '#allservice', function (e) {
        calcBooking();
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

// Add +1 day in booking form
function addOneDay(date) {
    var tempData = date.split('.');
    var month = parseInt(tempData[1]-1);
    var date_from = new Date(tempData[2], month, tempData[0]);
    var unix_from = date_from.getTime()/1000;

    unix_from = unix_from+24*60*60;

    var date_to_tmp = new Date(date_from.setTime(unix_from*1000));

    var dd = date_to_tmp.getDate();
    if (dd < 10) dd = '0' + dd;

    var mm = date_to_tmp.getMonth()+1;
    if (mm < 10) mm = '0' + mm;

    return  dd + '.' + mm + '.' + date_to_tmp.getFullYear();
}

// Get filter data with JSON
function getFilters() {
    var url = "https://www.xn--90aodoeldy.kz/mobile_api/pageInit/filter.php";

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
    var url = "https://www.xn--90aodoeldy.kz/mobile_api/pageInit/register.php";

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
    var formData = bankaKZ.formToJSON('#recovery-pass-form');
    var url = "https://www.xn--90aodoeldy.kz/mobile_api/forms/forgot.php";

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
    var formData = bankaKZ.formToJSON('#addreview-form');
    var url = "https://www.xn--90aodoeldy.kz/mobile_api/forms/review.php";

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
    var url = "https://www.xn--90aodoeldy.kz/mobile_api/pageInit/sidebar.php";

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
    var url = "https://www.xn--90aodoeldy.kz/mobile_api/pageInit/account.php";

    $$.ajax({
        dataType: 'json',
        url: url,
        success: function (resp) {
            mainView.router.load({
                template: Template7.templates.personalTemplate,
                context: resp
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
        headerPlaceholder: "Выберите дату",
        minDate: today.setDate(today.getDate() - 1),
        toolbarCloseText: 'Готово'
    });
}

//Registration Page init calendar picker
function initBirthPicker() {
    var dataSearch = bankaKZ.calendar({
        input: '#data-birth',
        dateFormat: 'dd.mm.yyyy',
        monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август' , 'Сентябрь' , 'Октябрь', 'Ноябрь', 'Декабрь'],
        dayNamesShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        headerPlaceholder: "Укажите дату рождения",
        closeOnSelect: true,
        toolbarCloseText: 'Готово'
    });
}

//Main Page init calendar picker
function initCalendarRangeServicePicker(productId, subproductId) {
    var disableDates = [];
    var products = JSON.parse(storage.getItem('products'));
    var disDate = [];

    $$.each(products, function(i, item) {
        if(item.productId == productId) {
            $$.each(item.subproducts, function(k, subitem) {
                if(subitem.subProductId == subproductId) {
                    disDate = subitem.subProductDatesAlready;
                }
            });
        }
    });

    $$.each(disDate, function(i, arDate){
        disableDates.push(new Date(arDate.y, arDate.m-1, arDate.d));
    });

    var today = new Date();

    var dataFrom = bankaKZ.calendar({
        input: '#calendar-service-from',
        dateFormat: 'dd.mm.yyyy',
        monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август' , 'Сентябрь' , 'Октябрь', 'Ноябрь', 'Декабрь'],
        dayNamesShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        closeOnSelect: true,
        headerPlaceholder: "Дата от",
        minDate: today.setDate(today.getDate() - 1),
        events: disableDates,
        disabled: disableDates,
        toolbarCloseText: 'Готово'
    });
    var dataTo = bankaKZ.calendar({
        input: '#calendar-service-to',
        dateFormat: 'dd.mm.yyyy',
        monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август' , 'Сентябрь' , 'Октябрь', 'Ноябрь', 'Декабрь'],
        dayNamesShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        closeOnSelect: true,
        headerPlaceholder: "Дата до",
        minDate: today.setDate(today.getDate() - 1),
        events: disableDates,
        disabled: disableDates, 
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

    $$('.product-slider-top .swiper-wrapper div').on('click', function () {
        var photos = $$('.product-slider-top .hidden-big').attr('data-big');
        var index = $$(this).attr('data-index');
        var MainBig = bankaKZ.photoBrowser({
            photos : JSON.parse(photos),
            initialSlide: index,
            theme: 'dark'
        });

        MainBig.open();
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
    });

    $$('#'+id+' .swiper-wrapper div').on('click', function () {
        var photos = $$('#'+id+' .hidden-big').attr('data-big');
        var index = $$(this).attr('data-index');
        var MainBigService = bankaKZ.photoBrowser({
            photos : JSON.parse(photos),
            initialSlide: index,
            theme: 'dark'
        });
        MainBigService.open();
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

//Booking total 
function calcBooking() {
    var price = parseInt($$('.sub-radio:checked').data('price'));

    if($$('#allservice').prop('checked') == true){

        var price_type = $$('.sub-radio:checked').data('pricetype');

        if(price_type == 'тг./час'){
            var time_to = parseInt($$('#time-to').val()),
                time_from = parseInt($$('#time-from').val());

            if(time_from < time_to){
                var time = time_to-time_from
            }else{
                var time = 24-time_from+time_to;
            }

            price = price*time;
        }

        $$('.subproductservice input').each(function () {
            if($$(this).is(':checked')){
                var price_type = $$(this).data('pricetype'),
                    serv_price = parseInt($$(this).data('price'));
                if(serv_price){
                    if(price_type == 'тг./час'){
                        var time_to = parseInt($$('#time-to').val());
                        var time_from = parseInt($$('#time-from').val());

                        if(time_from < time_to){
                            var time = time_to-time_from
                        }else{
                            var time = 24-time_from+time_to;
                        }
                        price = price+(serv_price*time);
                    }else{
                        price = price+serv_price;
                    }
                }
            }
        });
    }

    $$('#result .total').text(price);
    $$('#totalprice').val(price);
}

//Native function
//Press back button
function onBackKeyDown() {
    var page = bankaKZ.getCurrentView().activePage;

    if ($$('.smart-select-popup').css('display') == 'block') {
        $$('.smart-select-popup .close-popup').click();
    } else if ($$('.picker-modal').css('display') == 'block') {
        $$('.picker-modal .close-picker').click();
    } else if ($$('.photo-browser-in').css('display') == 'block') {
        $$('.photo-browser .photo-browser-close-link').click();
    } else if ($$('body').hasClass('with-panel-left-reveal')) {
        bankaKZ.closePanel();
    } else if(page.name=='index'){
        if(bankaKZ.confirm('Хотите закрыть приложение?', 'Выход'))
        {
            navigator.app.clearHistory();
            navigator.app.exitApp();
        }
    } else {
        mainView.router.back();
    }
}

//Notifications init
function getPushNotify() {
    getPushId();

    window.plugins.OneSignal.enableInAppAlertNotification(true);
    window.plugins.OneSignal.enableVibrate(true);
    window.plugins.OneSignal.enableSound(true);
}

//Notifications get user ID
function getPushId() {
    var url = "https://www.xn--90aodoeldy.kz/mobile_api/push/getid.php";

    $$.ajax({
        dataType: 'json',
        url: url,
        success: function (resp) {
            if(resp.auth){
                window.plugins.OneSignal.sendTag("bitrixid", resp.id);
            }
        },
        error: function (xhr) {
            console.log("Error on ajax call " + xhr);
        }
    });
}

//Notifications get pull user ID
function getPullId() {
    var notificationOpenedCallback = function(jsonData) {
        var url = "https://www.xn--90aodoeldy.kz/mobile_api/push/getid.php";
        $$.ajax({
            dataType: 'json',
            url: url,
            success: function (resp) {
                if(resp.auth){
                    getPersonalData();
                }
            },
            error: function (xhr) {
                console.log("Error on ajax call " + xhr);
            }
        });
    }

    window.plugins.OneSignal.init("51d610ca-18aa-4e7f-9ccf-4c17d3ccab58",
        {googleProjectNumber: "598379907149"}, notificationOpenedCallback);

    window.plugins.OneSignal.getTags(function(tags) {
        var url = "https://www.xn--90aodoeldy.kz/mobile_api/push/setid.php";

        $$.ajax({
            dataType: 'json',
            url: url,
            data: tags,
            method: 'GET',
            success: function (resp) {
                console.log("Success ajax call");
            },
            error: function (xhr) {
                console.log("Error on ajax call " + xhr);
            }
        });
    });
}

//Popup show when no auth user
function showPopupRegistration() {
    var url = "https://www.xn--90aodoeldy.kz/mobile_api/pageInit/sidebar.php";

    $$.ajax({
        dataType: 'json',
        url: url,
        success: function (resp) {
            var auth = resp.sidebar.auth;

            if(!auth) {
                setTimeout(function () {
                    bankaKZ.modal({
                        title: 'Пройдите регистрацию!',
                        text: 'Для полноценной работы на сайте и в приложении, необходимо пройти <a href="#" id="get-instruction">процедуру регистрации</a> и <a href="#" id="get-login">авторизоваться</a>.',
                        buttons: [{
                            text: 'Закрыть',
                            bold: true
                        }]                    
                    });
                }, 3000);
            }
        },
        error: function (xhr) {
            console.log("Error on ajax call " + xhr);
        }
    });
}