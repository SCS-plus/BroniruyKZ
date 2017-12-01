Template7.registerHelper('stringify', function(context) {
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
var networkState = navigator.connection.type;

// Enable/Disable development mode
const devMode = false;

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    getFilters();
    getPullId();
    getPushNotify();
    showPopupRegistration();
    document.addEventListener('backbutton', onBackKeyDown, false);
});

// Add view
var mainView = bankaKZ.addView('.view-main'),
    sidebarView = bankaKZ.addView('.view-sidebar');

// Back to main
$$(document).on('click', '.backtomain', function(e) {
    getFilters();
});

// Get product page
$$(document).on('click', '.getitempage', function(e) {
    var id = $$(this).data('id');
    var scrollid = $$(this).data('scroll');
    var url = "https://www.xn--90aodoeldy.kz/mobile_api/pageInit/detail.php?productId=" + id + "&subproductId=" + scrollid;
    $$.ajax({
        dataType: 'json',
        url: url,
        beforeSend: function(xhr) {
            bankaKZ.showIndicator();
        },
        complete: function(resp) {
            bankaKZ.hideIndicator();
            if ((resp.status == 200) && (networkState !== Connection.NONE)) {
                var data = JSON.parse(resp.response);

                mainView.router.load({
                    template: Template7.templates.itemTemplate,
                    context: data
                });
            } else {
                noConnection();
            }
        },
        error: function(xhr) {
            console.log("Error on ajax call " + xhr);
            if (devMode) alert(JSON.parse(xhr));
        }
    });
})

// Get panel left
$$(document).on('click', '.open-panel', function(e) {
    getSidebar();
});

// Get login form
$$(document).on('click', '#login', function(e) {
    mainView.router.loadContent($$('#loginPage').html());
    bankaKZ.closePanel();
});

//Get registration form
$$(document).on('click', '#registration', function(e) {
    getRegisterData();
    bankaKZ.closePanel();
});

//Get recovery password form
$$(document).on('click', '.get-rec-pass', function(e) {
    mainView.router.loadContent($$('#recoveryPassPage').html());
});

//Submit recovery form
$$(document).on('click', '.sbt-rec-pass', function(e) {
    sendPassword();
});

//Send phone code
$$(document).on('click', '.send-code', function(e) {
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
        beforeSend: function(xhr) {
            bankaKZ.showIndicator();
        },
        complete: function(resp) {
            bankaKZ.hideIndicator();
            if ((resp.status == 200) && (networkState !== Connection.NONE)) {
                var data = JSON.parse(resp.response);

                if (data.status == "OK") {
                    bankaKZ.alert(data.message);
                    $$("#register-form #code").attr('data-value', data.code);
                } else if (data.status == "ERROR") {
                    bankaKZ.alert(data.message);
                }
            } else {
                noConnection();
            }
        },
        error: function(xhr) {
            console.log("Error on ajax call " + xhr);
            if (devMode) alert(JSON.parse(xhr));
        }
    });
});

//Search button submit
$$(document).on('click', '#btnSearch', function(e) {
    var city = $$("#city").val(),
        type = $$("#type").val(),
        service = $$("#service").val(),
        datasearch = $$("#data-search").val(),
        time = $$("#time").val(),
        rating = $$("#rating").val(),
        lowerprice = $$("#lower-price").val(),
        upperprice = $$("#upper-price").val();

    var url = "https://www.xn--90aodoeldy.kz/mobile_api/pageInit/list.php?city=" + city + "&type=" +
        type + "&service=" + service + "&datasearch=" + datasearch + "&time=" +
        time + "&rating=" + rating + "&lowerprice=" + lowerprice + "&upperprice=" + upperprice;

    $$.ajax({
        dataType: 'json',
        url: url,
        beforeSend: function(xhr) {
            bankaKZ.showIndicator();
        },
        complete: function(resp) {
            bankaKZ.hideIndicator();
            if ((resp.status == 200) && (networkState !== Connection.NONE)) {
                var data = JSON.parse(resp.response);
                if (data.status == 'ERROR') {
                    bankaKZ.alert(data.message);
                } else {
                    if (data.products == null) {
                        var ctx = { 'empty': true };
                    } else {
                        var ctx = data.products;
                        storage.setItem('products', JSON.stringify(ctx));
                    }
                    mainView.router.load({
                        template: Template7.templates.listTemplate,
                        context: ctx
                    });
                }
            } else {
                noConnection();
            }
        },
        error: function(xhr) {
            console.log("Error on ajax call " + xhr);
            if (devMode) alert(JSON.parse(xhr));
        }
    });
});

//Get user halls
$$(document).on('click', '#my-halls', function(e) {
    bankaKZ.closePanel();
    var url = "https://www.xn--90aodoeldy.kz/mobile_api/pageInit/owner_list.php";

    $$.ajax({
        dataType: 'json',
        url: url,
        beforeSend: function(xhr) {
            bankaKZ.showIndicator();
        },
        complete: function(resp) {
            bankaKZ.hideIndicator();
            if ((resp.status == 200) && (networkState !== Connection.NONE)) {
                var data = JSON.parse(resp.response);
                if (data.status == 'ERROR') {
                    bankaKZ.alert(data.message);
                } else {
                    if (data.products == null) {
                        var ctx = { 'empty': true };
                    } else {
                        var ctx = data.products;
                        storage.setItem('products', JSON.stringify(ctx));
                    }
                    mainView.router.load({
                        template: Template7.templates.listTemplate,
                        context: ctx
                    });
                }
            } else {
                noConnection();
            }
        },
        error: function(xhr) {
            console.log("Error on ajax call " + xhr);
            if (devMode) alert(JSON.parse(xhr));
        }
    });
});

//Open detail Service page
$$(document).on('click', '#tab-service .open-detail-service', function(e) {
    var id = $$(this).attr('data-id');
    getDetailServicePage(id, false);
});

// Refresh Detail Service page
$$('body').on('click', '.refresh-service-detail', function(e) {
    var id = $$('#serviceid').val();
    getDetailServicePage(id, true);
});

// Refresh Personal page
$$('body').on('click', '.refresh-personal', function(e) {
    getPersonalData(true);
});

//Logout event
$$(document).on('click', '#btnLogout', function(e) {
    $$.get("https://www.xn--90aodoeldy.kz/mobile_api/forms/logout.php");
    window.plugins.OneSignal.deleteTag("bitrixid");
    bankaKZ.closePanel();
});

//Get about page
$$(document).on('click', '#about', function(e) {
    var url = "https://www.xn--90aodoeldy.kz/mobile_api/pageInit/about.php";

    $$.ajax({
        dataType: 'json',
        url: url,
        beforeSend: function(xhr) {
            bankaKZ.showIndicator();
        },
        complete: function(resp) {
            bankaKZ.hideIndicator();
            if ((resp.status == 200) && (networkState !== Connection.NONE)) {
                var data = JSON.parse(resp.response);
                mainView.router.load({
                    template: Template7.templates.aboutTemplate,
                    context: data.about
                });
                bankaKZ.closePanel();
            } else {
                noConnection();
            }
        },
        error: function(xhr) {
            console.log("Error on ajax call " + xhr);
            if (devMode) alert(JSON.parse(xhr));
        }
    });
});

//Get help page
$$(document).on('click', '#help', function(e) {
    var url = "https://www.xn--90aodoeldy.kz/mobile_api/pageInit/help.php";

    $$.ajax({
        dataType: 'json',
        url: url,
        beforeSend: function(xhr) {
            bankaKZ.showIndicator();
        },
        complete: function(resp) {
            bankaKZ.hideIndicator();
            if ((resp.status == 200) && (networkState !== Connection.NONE)) {
                var data = JSON.parse(resp.response);
                mainView.router.load({
                    template: Template7.templates.helpTemplate,
                    context: data.help
                });
                bankaKZ.closePanel();
            } else {
                noConnection();
            }
        },
        error: function(xhr) {
            console.log("Error on ajax call " + xhr);
            if (devMode) alert(JSON.parse(xhr));
        }
    });
});

//Get page How to add
$$(document).on('click', '#howadd', function(e) {
    var url = "https://www.xn--90aodoeldy.kz/mobile_api/pageInit/howadd.php";
    $$.ajax({
        dataType: 'json',
        url: url,
        beforeSend: function(xhr) {
            bankaKZ.showIndicator();
        },
        complete: function(resp) {
            bankaKZ.hideIndicator();
            if ((resp.status == 200) && (networkState !== Connection.NONE)) {
                var data = JSON.parse(resp.response);
                mainView.router.load({
                    template: Template7.templates.howaddTemplate,
                    context: data.howadd
                });
                bankaKZ.closePanel();
            } else {
                noConnection();
            }
        },
        error: function(xhr) {
            console.log("Error on ajax call " + xhr);
            if (devMode) alert(JSON.parse(xhr));
        }
    });
});

//Get page Instruction
$$(document).on('click', '#get-instruction', function(e) {
    var url = "https://www.xn--90aodoeldy.kz/mobile_api/pageInit/instructions.php";
    $$.ajax({
        dataType: 'json',
        url: url,
        beforeSend: function(xhr) {
            bankaKZ.showIndicator();
        },
        complete: function(resp) {
            bankaKZ.hideIndicator();
            if ((resp.status == 200) && (networkState !== Connection.NONE)) {
                var data = JSON.parse(resp.response);
                mainView.router.load({
                    template: Template7.templates.instructionTemplate,
                    context: data.instructions
                });
                bankaKZ.closeModal('.modal');
            } else {
                noConnection();
            }
        },
        error: function(xhr) {
            console.log("Error on ajax call " + xhr);
            if (devMode) alert(JSON.parse(xhr));
        }
    });
});

// Get login form with popup
$$(document).on('click', '#get-login', function(e) {
    mainView.router.loadContent($$('#loginPage').html());
    bankaKZ.closeModal('.modal');
});

//Get page Website Rights
$$(document).on('click', '#rules', function(e) {
    var url = "https://www.xn--90aodoeldy.kz/mobile_api/pageInit/rules.php";
    $$.ajax({
        dataType: 'json',
        url: url,
        beforeSend: function(xhr) {
            bankaKZ.showIndicator();
        },
        complete: function(resp) {
            bankaKZ.hideIndicator();
            if ((resp.status == 200) && (networkState !== Connection.NONE)) {
                var data = JSON.parse(resp.response);
                mainView.router.load({
                    template: Template7.templates.siteRulesTemplate,
                    context: data.rules
                });
            } else {
                noConnection();
            }
        },
        error: function(xhr) {
            console.log("Error on ajax call " + xhr);
            if (devMode) alert(JSON.parse(xhr));
        }
    });
});

//Get Personal Page
$$(document).on('click', '#account', function(e) {
    getPersonalData(false);
    bankaKZ.closePanel();
});

//Send status Personal Page
$$(document).on('click', '.sbt-status', function(e) {
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
        beforeSend: function(xhr) {
            bankaKZ.showIndicator();
        },
        complete: function(resp) {
            bankaKZ.hideIndicator();
            if ((resp.status == 200) && (networkState !== Connection.NONE)) {
                var data = JSON.parse(resp.response);
                if (data.status == "OK") {
                    bankaKZ.alert(data.message);
                    mainView.router.back();
                    getPersonalData(false);
                } else if (data.status == "ERROR") {
                    bankaKZ.alert(data.message);
                }
            } else {
                noConnection();
            }
        },
        error: function(xhr) {
            console.log("Error on ajax call " + xhr);
            if (devMode) alert(JSON.parse(xhr));
        }
    });
});

//Send booking form
$$(document).on('click', '.sbt-booking', function(e) {
    var formData = bankaKZ.formToJSON('#booking-form');
    var url = "https://www.xn--90aodoeldy.kz/mobile_api/forms/reserve_add.php";

    if (formData.totalPrice == 0) {
        bankaKZ.alert("Выбор дополнительных сервисов обязателен!");
    } else {
        $$.ajax({
            dataType: 'json',
            url: url,
            method: 'POST',
            data: formData,
            beforeSend: function(xhr) {
                bankaKZ.showIndicator();
            },
            complete: function(resp) {
                bankaKZ.hideIndicator();
                if ((resp.status == 200) && (networkState !== Connection.NONE)) {
                    var data = JSON.parse(resp.response);
                    if (data.status == "OK") {
                        bankaKZ.alert(data.message);
                        mainView.router.back();
                    } else if (data.status == "ERROR") {
                        bankaKZ.alert(data.message);
                    }
                } else {
                    noConnection();
                }
            },
            error: function(xhr) {
                console.log("Error on ajax call " + xhr);
                if (devMode) alert(JSON.parse(xhr));
            }
        });
    }
});

//Send comment with service page
$$(document).on('click', '.sbt-comment', function(e) {
    var id = $$('#serviceid').val();
    var text = $$('#commenttext').val();
    var url = 'https://www.xn--90aodoeldy.kz/mobile_api/forms/serviceCommentAdd.php?ELEMENT_ID=' + id + '&comment=' +
        text + '&comment_add=Y';

    $$.ajax({
        dataType: 'json',
        url: url,
        method: 'POST',
        beforeSend: function(xhr) {
            bankaKZ.showIndicator();
        },
        complete: function(resp) {
            bankaKZ.hideIndicator();
            if ((resp.status == 200) && (networkState !== Connection.NONE)) {
                var data = JSON.parse(resp.response);
                if (data.status == "OK") {
                    $$('#commenttext').val('');
                    $$('#addcomment-form .status').show().text(data.message);
                    $$('.comments').append(
                        '<div class="comment-item item-' + data.newComment.commentSender + '">' +
                        '<div class="comment-sender">' + data.newComment.commentSenderName + '</div>' +
                        '<div class="comment-date">' + data.newComment.commentDate + '</div>' +
                        '<div class="comment-text">' + data.newComment.commentText + '</div>' +
                        '</div>');
                } else if (data.status == "ERROR") {
                    $$('#addcomment-form .status').show().text(data.message);
                }
                setTimeout(function() {
                    $$('#addcomment-form .status').hide().empty();
                }, 3000);
            } else {
                noConnection();
            }
        },
        error: function(xhr) {
            console.log("Error on ajax call " + xhr);
            if (devMode) alert(JSON.parse(xhr));
        }
    })
});

//Open payment link
$$(document).on('click', '#payment', function(e) {
    var userID = $$(this).find('.item-title').attr('data-id');
    var hash = CryptoJS.MD5("booking" + userID);
    var link = 'https://www.xn--90aodoeldy.kz/account/pay/?id=' + userID + '&hash=' + hash;
    var os = bankaKZ.device.os;

    window.open = cordova.InAppBrowser.open;
    if (os == 'ios') {
        window.open(link);
    } else {
        window.open(link, '_system', 'location=no,closebuttoncaption=Cerrar,enableViewportScale=yes');
    }
});

//Init Index Page
bankaKZ.onPageInit('index', function(page) {
    initApp();

    var service = $$('#service option');
    var Services = [];

    $$.each(service, function(i, item) {
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

    $$('body').on('change', '#type', function() {
        var type = $$(this).val();
        loadServices(type);
    });

    loadServices($$('#type').val());
});

//Init Product Page
bankaKZ.onPageInit('product', function(page) {
    var scrollId = $$('#tab-detail').data('scroll'),
        lat = $$('.map').attr('data-lat'),
        lan = $$('.map').attr('data-lan'),
        adress = $$('.map').attr('data-adress');

    var top = $$('#scroll-' + scrollId).offset().top - 165;

    setTimeout(function() { $$('#tab-detail').scrollTo(0, top, 1000); }, 1000);

    $$('.product-service-slider').each(function() {
        var id = $$(this).attr('id');
        initProductServiceSlider(id);
    });

    $$('.list-rating').each(function() {
        var id = $$(this).attr('id'),
            value = $$(this).attr('data-rating');
        listRating(id, value);
    });

    initProductMainSlider();
    initMap(lat, lan, adress);
});

//Init Registration Page
bankaKZ.onPageInit('registration-page', function(page) {
    initBirthPicker();

    VMasker(document.getElementById('phone')).maskPattern("+9 (999) 999-99-99");

    $$('.sbt-register').on('click', function(e) {
        var valid = true,
            code = $$("#register-form #code").attr('data-value'),
            code_value = $$("#register-form #code").val(),
            pattern = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+\.([a-z0-9]{1,6}\.)?[a-z]{2,6}$/i;

        if ($$("#email").val().search(pattern) !== 0) {
            valid = false;
            bankaKZ.alert('Вы ввели неправильный Email!');
        }

        if ($$("#siterights").prop('checked') == false && valid) {
            valid = false;
            bankaKZ.alert('Нужно согласиться с правилами сервиса.');
        }

        if (code && valid) {
            if (code != code_value) {
                valid = false;
                bankaKZ.alert('Неправильный код из СМС');
            }
        } else if (valid) {
            valid = false;
            bankaKZ.alert('Неправильный код из СМС');
        }

        if (valid) {
            var formData = bankaKZ.formToJSON('#register-form');
            var url = "https://www.xn--90aodoeldy.kz/mobile_api/forms/register.php";

            $$.ajax({
                dataType: 'json',
                url: url,
                method: 'POST',
                data: formData,
                beforeSend: function(xhr) {
                    bankaKZ.showIndicator();
                },
                complete: function(resp) {
                    bankaKZ.hideIndicator();
                    if ((resp.status == 200) && (networkState !== Connection.NONE)) {
                        var data = JSON.parse(resp.response);
                        if (data.status == "OK" || data.status == "ERROR") {
                            bankaKZ.alert(data.message);
                            getFilters();
                        }
                    } else {
                        noConnection();
                    }
                },
                error: function(xhr) {
                    console.log("Error on ajax call " + xhr);
                    if (devMode) alert(JSON.parse(xhr));
                }
            });
        }
    });
});

//Init Login Page
bankaKZ.onPageInit('login-page', function(page) {
    $$('.sbt-login').on('click', function(e) {
        var formData = bankaKZ.formToJSON("#login-form");
        var url = "https://www.xn--90aodoeldy.kz/mobile_api/forms/auth.php";

        $$.ajax({
            dataType: 'json',
            url: url,
            method: 'POST',
            data: formData,
            beforeSend: function(xhr) {
                bankaKZ.showIndicator();
            },
            complete: function(resp) {
                bankaKZ.hideIndicator();
                if ((resp.status == 200) && (networkState !== Connection.NONE)) {
                    var data = JSON.parse(resp.response);
                    if (data.status == "OK") {
                        getFilters();
                        getPushId();
                    } else if (data.status == "ERROR") {
                        bankaKZ.alert(data.message);
                    }
                } else {
                    noConnection();
                }
            },
            error: function(xhr) {
                console.log("Error on ajax call " + xhr);
                if (devMode) alert(JSON.parse(xhr));
            }
        });

    });
});

//Init Add Review Page
bankaKZ.onPageInit('addreview-page', function(page) {
    $$(document).on('click', '.sbt-review', function(e) {
        sendReview();
    });
});

//Init Booking Page
bankaKZ.onPageInit('booking-page', function(page) {
    var productId = $$('#productid').val();
    var serviceWrapperId = $$('.subradiowrapper li:first-child input').val();
    var dailyBooked = $$('.subradiowrapper li:first-child #subproductdaily-' + serviceWrapperId).val();

    // Сheck empty sub service 
    if ($$(".subproductservice ul li").length > 0) {
        $$('#service-' + serviceWrapperId).show();
    } else {
        $$('#service-' + serviceWrapperId).hide();
    }

    initCalendarRangeServicePicker(productId, serviceWrapperId, dailyBooked);

    $$('.subradiowrapper li:first-child input').prop("checked", true);

    if (dailyBooked == "Y") {
        $$('.time').hide();
    } else {
        $$('.time').show();
    }

    calcBooking();

    $$(document).on('change', '.sub-radio', function(e) {
        var id = $$(this).val();
        var tempdailyBooked = $$(this).parent().find('#subproductdaily-' + id).val();

        initCalendarRangeServicePicker(productId, id, tempdailyBooked);

        $$('.subproductservice').hide();
        $$('.subproductservice input').each(function() {
            $$(this).prop("checked", false);
        });
        $$('#service-' + id).show();

        if (tempdailyBooked == "Y") {
            $$('.time').hide();
        } else {
            $$('.time').show();
        }

        calcBooking();
    });

    $$(document).on('change', '.subproductservice input', function(e) {
        calcBooking();
    });

    $$(document).on('change', '#calendar-service-from', function(e) {
        var date = $$(this).val();
        var timesAlready = JSON.parse($$('.subradiowrapper li input:checked').parent().find('.timesalready').val());

        disableTimesAlredy(timesAlready, date);

        if (dailyBooked == "Y") {
            $$('#calendar-service-to').val(addOneDay(date));
        } else {
            $$('#calendar-service-to').val(date);
        }
    });

    $$(document).on('change', '#calendar-service-to', function(e) {
        var date = $$(this).val();
        var timesAlready = JSON.parse($$('.subradiowrapper li input:checked').parent().find('.timesalready').val());

        disableTimesAlredy(timesAlready, date);
    });

    $$(document).on('change', '#time-to', function(e) {
        calcBooking();
    });

    $$(document).on('change', '#time-from', function(e) {
        var time = parseInt($$(this).val()) + 1;

        $$("#time-to option[value='" + time + ":00']").prop('selected', 'true');
        $$("#time-to").siblings('.item-content').find('.item-after').html(time + ':00');
        calcBooking();
    });

    $$(document).on('change', '#allservice', function(e) {
        calcBooking();
    });

});

//Init Personal Page
bankaKZ.onPageInit('personal-userpage', function(page) {
    loadOwnerHistory($$('#institution').val());

    $$('.list-rating').each(function() {
        var id = $$(this).attr('id'),
            value = $$(this).attr('data-rating');
        listRating(id, value);
    });

    // Get user history
    $$(document).on('click', '#btnSearchBooking', function(e) {
        loadOwnerHistory($$('#institution').val());
    });

    $$('body').on('change', '#institution', function() {
        var saunaID = $$(this).val();
        loadPersonalHalls(saunaID);
    });

    var periodDataFrom = bankaKZ.calendar({
        input: '#period-data-from',
        dateFormat: 'dd.mm.yyyy',
        monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
        dayNamesShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        closeOnSelect: true,
        headerPlaceholder: "Дата от",
        toolbarCloseText: 'Готово'
    });

    var periodDataTo = bankaKZ.calendar({
        input: '#period-data-to',
        dateFormat: 'dd.mm.yyyy',
        monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
        dayNamesShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        closeOnSelect: true,
        headerPlaceholder: "Дата до",
        toolbarCloseText: 'Готово'
    });
});

// Init APP
function initApp() {
    initRangeSlider();
    initCalendarPicker();
}

// Owner history in personal page
function loadOwnerHistory(saunaID) {
    var formData = bankaKZ.formToJSON('#personal-filter');
    var url = "https://www.xn--90aodoeldy.kz/mobile_api/pageInit/account.php";

    $$.ajax({
        dataType: 'json',
        url: url,
        method: 'POST',
        data: formData,
        beforeSend: function(xhr) {
            bankaKZ.showIndicator();
        },
        complete: function(resp) {
            bankaKZ.hideIndicator();
            if ((resp.status == 200) && (networkState !== Connection.NONE)) {
                var dataServer = JSON.parse(resp.response);

                storage.setItem('ownerData', JSON.stringify(dataServer));
                changeHalls(dataServer.shallList, saunaID);

                if (dataServer.ownerHistory) {
                    var data = dataServer.ownerHistory;
                    var htmlMarkup = '';

                    data.forEach(function(item, i) {
                        var comment = item.comment;
                        var substatus = '';
                        var htmlButtons = '';

                        if (comment.length == 0) comment = 'Нет комментариев';
                        if (item.substatus) substatus = '<a href="#" class="button button-fill color-' + item.substatuscolor + '">' + item.substatus + '</a>';
                        if (item.buttons) {
                            var buttons = item.buttons;

                            $$.each(buttons, function(n, button) {
                                htmlButtons += '<input type="button" class="button button-fill color-' + button.color + ' sbt-status" value="' + button.title + '" data-action="' + n + '" data-id="' + item.id + '">';
                            });
                        }

                        htmlMarkup += '<div class="item"><div class="field"><span class="title">Название</span>';
                        htmlMarkup += '<span class="text">' + item.name + '</span></div>';
                        htmlMarkup += '<div class="field"><span class="title">Сумма</span>';
                        htmlMarkup += '<span class="text">' + item.summa + ' тг.</span></div>';
                        htmlMarkup += '<div class="field"><span class="title">Дата</span>';
                        htmlMarkup += '<span class="text">' + item.date + '</span></div>';
                        htmlMarkup += '<div class="field"><span class="title">Пользователь</span>';
                        htmlMarkup += '<span class="text">' + item.user + '</span></div>';
                        htmlMarkup += '<div class="field"><span class="title">Телефон</span>';
                        htmlMarkup += '<span class="text">' + item.phone + '</span></div>';
                        htmlMarkup += '<div class="field"><span class="title">Комментарий</span>';
                        htmlMarkup += '<span class="text">' + comment + '</span></div>';
                        htmlMarkup += '<div class="field"><span class="title">Статус</span><span class="text">';
                        htmlMarkup += '<p class="buttons-row">';
                        htmlMarkup += '<a href="#" class="button button-fill color-' + item.statuscolor + '">' + item.status + '</a>';
                        htmlMarkup += substatus;
                        htmlMarkup += '</p><p class="buttons-row">' + htmlButtons + '</p></span></div></div>';
                    });

                    $$('.owner-history').empty().append(htmlMarkup);
                } else {
                    $$('.owner-history').empty().append('<p>Нет данных за этот период.</p>');
                }
            } else {
                noConnection();
            }
        },
        error: function(xhr) {
            console.log("Error on ajax call " + xhr);
            if (devMode) alert(JSON.parse(xhr));
        }
    });
}

// Add +1 day in booking form
function addOneDay(date) {
    var tempData = date.split('.');
    var month = parseInt(tempData[1] - 1);
    var date_from = new Date(tempData[2], month, tempData[0]);
    var unix_from = date_from.getTime() / 1000;

    unix_from = unix_from + 24 * 60 * 60;

    var date_to_tmp = new Date(date_from.setTime(unix_from * 1000));

    var dd = date_to_tmp.getDate();
    if (dd < 10) dd = '0' + dd;

    var mm = date_to_tmp.getMonth() + 1;
    if (mm < 10) mm = '0' + mm;

    return dd + '.' + mm + '.' + date_to_tmp.getFullYear();
}

// Load services in filter Main Page
function loadPersonalHalls(saunaID) {
    var halls = $$('#halls option');
    var ownerData = JSON.parse(storage.getItem('ownerData'));

    halls.remove();
    changeHalls(ownerData.shallList, saunaID);
}

// Change halls in filter personal page
function changeHalls(dataHalls, saunaID) {
    $$.each(dataHalls, function(i, item) {
        if (saunaID == item.PARENT_ID) $$('#halls').append("<option value='" + item.ID + "'>" + item.NAME + "</option>");
    });

    var selectText = $$('#halls option:first-child').text();
    $$('.halls-select .item-after').text(selectText);
}

// Load services in filter Main Page
function loadServices(type) {
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
}

// Get detail page Service histor
function getDetailServicePage(id, loader) {
    var url = 'https://www.бронируй.kz/mobile_api/pageInit/serviceReserv.php?ELEMENT_ID=' + id;

    $$.ajax({
        dataType: 'json',
        url: url,
        beforeSend: function(xhr) {
            bankaKZ.showIndicator();
        },
        complete: function(resp) {
            bankaKZ.hideIndicator();
            if ((resp.status == 200) && (networkState !== Connection.NONE)) {
                var data = JSON.parse(resp.response);
                if (data.status == 'ERROR') {
                    bankaKZ.alert(data.message);
                } else {
                    var ctx = data.reserve;
                    mainView.router.load({
                        reload: loader,
                        template: Template7.templates.serviceHistoryTemplate,
                        context: ctx
                    });
                }
            } else {
                noConnection();
            }
        },
        error: function(xhr) {
            console.log("Error on ajax call " + xhr);
            if (devMode) alert(JSON.parse(xhr));
        }
    });
}

// Get filter data with JSON
function getFilters() {
    var url = "https://www.xn--90aodoeldy.kz/mobile_api/pageInit/filter.php";

    $$.ajax({
        dataType: 'json',
        url: url,
        beforeSend: function(xhr) {
            bankaKZ.showIndicator();
        },
        complete: function(resp) {
            bankaKZ.hideIndicator();
            if ((resp.status == 200) && (networkState !== Connection.NONE)) {
                var data = JSON.parse(resp.response);
                mainView.router.load({
                    template: Template7.templates.mainTemplate,
                    context: data.filters[0]
                });
            } else {
                noConnection();
            }
        },
        error: function(xhr) {
            console.log("Error on ajax call " + xhr);
            if (devMode) alert(JSON.parse(xhr));
        }
    });
}

//Get register data list
function getRegisterData() {
    var url = "https://www.xn--90aodoeldy.kz/mobile_api/pageInit/register.php";

    $$.ajax({
        dataType: 'json',
        url: url,
        beforeSend: function(xhr) {
            bankaKZ.showIndicator();
        },
        complete: function(resp) {
            bankaKZ.hideIndicator();
            if ((resp.status == 200) && (networkState !== Connection.NONE)) {
                var data = JSON.parse(resp.response);
                mainView.router.load({
                    template: Template7.templates.registrationTemplate,
                    context: data.register
                });
            } else {
                noConnection();
            }
        },
        error: function(xhr) {
            console.log("Error on ajax call " + xhr);
            if (devMode) alert(JSON.parse(xhr));
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
        beforeSend: function(xhr) {
            bankaKZ.showIndicator();
        },
        data: formData,
        complete: function(resp) {
            bankaKZ.hideIndicator();
            if ((resp.status == 200) && (networkState !== Connection.NONE)) {
                var data = JSON.parse(resp.response);
                if (data.status == "OK") {
                    bankaKZ.alert(data.message);
                    mainView.router.back();
                } else if (data.status == "ERROR") {
                    bankaKZ.alert(data.message);
                }
            } else {
                noConnection();
            }
        },
        error: function(xhr) {
            console.log("Error on ajax call " + xhr);
            if (devMode) alert(JSON.parse(xhr));
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
        beforeSend: function(xhr) {
            bankaKZ.showIndicator();
        },
        complete: function(resp) {
            bankaKZ.hideIndicator();
            if ((resp.status == 200) && (networkState !== Connection.NONE)) {
                var data = JSON.parse(resp.response);
                if (data.status == "OK") {
                    bankaKZ.alert(data.message);
                    mainView.router.back();
                } else if (data.status == "ERROR") {
                    bankaKZ.alert(data.message);
                }
            } else {
                noConnection();
            }
        },
        error: function(xhr) {
            console.log("Error on ajax call " + xhr);
            if (devMode) alert(JSON.parse(xhr));
        }
    })
}

//Get sidebar
function getSidebar() {
    var url = "https://www.xn--90aodoeldy.kz/mobile_api/pageInit/sidebar.php";

    $$.ajax({
        dataType: 'json',
        url: url,
        beforeSend: function(xhr) {
            bankaKZ.showIndicator();
        },
        complete: function(resp) {
            bankaKZ.hideIndicator();
            if ((resp.status == 200) && (networkState !== Connection.NONE)) {
                var data = JSON.parse(resp.response);
                sidebarView.router.load({
                    template: Template7.templates.sidebarTemplate,
                    context: data.sidebar
                });
            } else {
                noConnection();
            }
        },
        error: function(xhr) {
            console.log("Error on ajax call " + xhr);
            if (devMode) alert(JSON.parse(xhr));
        }
    });
}

// Get Personal data with JSON
function getPersonalData(loader) {
    var url = "https://www.xn--90aodoeldy.kz/mobile_api/pageInit/account.php";

    $$.ajax({
        dataType: 'json',
        url: url,
        beforeSend: function(xhr) {
            bankaKZ.showIndicator();
        },
        complete: function(resp) {
            bankaKZ.hideIndicator();
            if ((resp.status == 200) && (networkState !== Connection.NONE)) {
                var data = JSON.parse(resp.response);
                mainView.router.load({
                    reload: loader,
                    template: Template7.templates.personalTemplate,
                    context: data
                });
            } else {
                noConnection();
            }
        },
        error: function(xhr) {
            console.log("Error on ajax call " + xhr);
            if (devMode) alert(JSON.parse(xhr));
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
        start: [lowerprice, upperprice],
        behaviour: 'drag',
        step: 100,
        range: {
            'min': lowerprice,
            'max': upperprice
        },
        format: ({
            to: function(value) {
                return value;
            },
            from: function(value) {
                return value;
            }
        })
    });

    function leftValue(handle) {
        return handle.parentElement.style.left;
    }

    priceSlider.noUiSlider.on('update', function(values, handle) {
        if (!handle) {
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
        value: [new Date()],
        dateFormat: 'dd.mm.yyyy',
        monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
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
        monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
        dayNamesShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        headerPlaceholder: "Укажите дату рождения",
        closeOnSelect: true,
        toolbarCloseText: 'Готово'
    });
}

//Booking form init calendar picker
function initCalendarRangeServicePicker(productId, subproductId) {
    var disableDates = [];
    var products = JSON.parse(storage.getItem('products'));
    var disDate = [];

    $$.each(products, function(i, item) {
        if (item.productId == productId) {
            $$.each(item.subproducts, function(k, subitem) {
                if (subitem.subProductId == subproductId) disDate = subitem.subProductDatesAlready;
            });
        }
    });

    $$.each(disDate, function(i, arDate) {
        disableDates.push(new Date(arDate.y, arDate.m - 1, arDate.d));
    });

    var today = new Date();

    var dataFrom = bankaKZ.calendar({
        input: '#calendar-service-from',
        dateFormat: 'dd.mm.yyyy',
        monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
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
        monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
        dayNamesShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        closeOnSelect: true,
        headerPlaceholder: "Дата до",
        minDate: today.setDate(today.getDate()),
        events: disableDates,
        disabled: disableDates,
        toolbarCloseText: 'Готово'
    });
}

// Booking form disable already times
function disableTimesAlredy(timesData, date) {
    $$.each(timesData, function(i, item) {
        if (date == item.date) {
            $$("#time-from option").each(function() {
                if ($$(this).val() == item.h) {
                    $$(this).prop("disabled", true);
                }
            });
            $$("#time-to option").each(function() {
                if ($$(this).val() == item.h) {
                    $$(this).prop("disabled", true);
                }
            });
        } else {
            $$("#time-from option").each(function() {
                if ($$(this).val() == item.h) {
                    $$(this).prop("disabled", false);
                }
            });
            $$("#time-to option").each(function() {
                if ($$(this).val() == item.h) {
                    $$(this).prop("disabled", false);
                }
            });
        }
    });
}

// Product page Main Slider
function initProductMainSlider() {
    var swiperTop = bankaKZ.swiper('.product-slider-top', {
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        pagination: '.swiper-pagination',
        preloadImages: false,
        lazyLoading: true,
        spaceBetween: 10
    });

    $$('.product-slider-top .swiper-wrapper div').on('click', function() {
        var photos = $$('.product-slider-top .hidden-big').attr('data-big');
        var index = $$(this).attr('data-index');
        var MainBig = bankaKZ.photoBrowser({
            photos: JSON.parse(photos),
            initialSlide: index,
            theme: 'dark'
        });

        MainBig.open();
    });
}

// Product page Service Slider
function initProductServiceSlider(id) {
    var swiperTop = bankaKZ.swiper('#' + id, {
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        preloadImages: true,
        lazyLoading: true,
        spaceBetween: 10,
        slidesPerView: 3,
    });

    $$('#' + id + ' .swiper-wrapper div').on('click', function() {
        var photos = $$('#' + id + ' .hidden-big').attr('data-big');
        var index = $$(this).attr('data-index');
        var MainBigService = bankaKZ.photoBrowser({
            photos: JSON.parse(photos),
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

    if (lat && lan) {
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

    $$(el).each(function() {
        if ($$(this).val() == value) $$(this).attr("checked", "checked");
    });
}

//Booking total 
function calcBooking() {
    var price = parseInt($$('.sub-radio:checked').data('price'));

    if (price == 0) $$('#allservice').prop('checked', 'checked');

    if ($$('#allservice').prop('checked') == true) {

        var price_type = $$('.sub-radio:checked').data('pricetype');

        if (price_type == 'тг./час') {
            var time_to = parseInt($$('#time-to').val()),
                time_from = parseInt($$('#time-from').val());

            if (time_from < time_to) {
                var time = time_to - time_from
            } else {
                var time = 24 - time_from + time_to;
            }

            price = price * time;
        }

        $$('.subproductservice input').each(function() {
            if ($$(this).is(':checked')) {
                var price_type = $$(this).data('pricetype'),
                    serv_price = parseInt($$(this).data('price'));
                if (serv_price) {
                    if (price_type == 'тг./час') {
                        var time_to = parseInt($$('#time-to').val());
                        var time_from = parseInt($$('#time-from').val());

                        if (time_from < time_to) {
                            var time = time_to - time_from
                        } else {
                            var time = 24 - time_from + time_to;
                        }
                        price = price + (serv_price * time);
                    } else {
                        price = price + serv_price;
                    }
                }
            }
        });
    }

    $$('#result .total').text(price);
    $$('#totalprice').val(price);
}

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
    } else if (page.name == 'index') {
        bankaKZ.confirm('Хотите закрыть приложение?', 'Выход', function() {
            navigator.app.clearHistory();
            navigator.app.exitApp();
        }, function() {
            return false;
        });
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
        complete: function(resp) {
            if ((resp.status == 200) && (networkState !== Connection.NONE)) {
                var data = JSON.parse(resp.response);
                if (data.auth) window.plugins.OneSignal.sendTag("bitrixid", data.id);
            } else {
                noConnection();
            }
        },
        error: function(xhr) {
            console.log("Error on ajax call " + xhr);
            if (devMode) alert(JSON.parse(xhr));
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
            complete: function(resp) {
                if ((resp.status == 200) && (networkState !== Connection.NONE)) {
                    var data = JSON.parse(resp.response);
                    if (data.auth) getPersonalData(false);
                } else {
                    noConnection();
                }
            },
            error: function(xhr) {
                console.log("Error on ajax call " + xhr);
                if (devMode) alert(JSON.parse(xhr));
            }
        });
    }

    window.plugins.OneSignal.init("51d610ca-18aa-4e7f-9ccf-4c17d3ccab58", { googleProjectNumber: "598379907149" }, notificationOpenedCallback);

    window.plugins.OneSignal.getTags(function(tags) {
        var url = "https://www.xn--90aodoeldy.kz/mobile_api/push/setid.php";

        $$.ajax({
            dataType: 'json',
            url: url,
            data: tags,
            method: 'GET',
            complete: function(resp) {
                if (resp.status != 200) noConnection();
            },
            error: function(xhr) {
                console.log("Error on ajax call " + xhr)
                if (devMode) alert(JSON.parse(xhr));
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
        beforeSend: function(xhr) {
            bankaKZ.showIndicator();
        },
        complete: function(resp) {
            bankaKZ.hideIndicator();
            if ((resp.status == 200) && (networkState !== Connection.NONE)) {
                var data = JSON.parse(resp.response);
                var auth = data.sidebar.auth;
                if (!auth) {
                    setTimeout(function() {
                        bankaKZ.modal({
                            title: 'Пройдите регистрацию!',
                            text: 'Для полноценной работы на сайте и в приложении, необходимо пройти <a href="#" id="get-instruction">процедуру регистрации</a> и <a href="#" id="get-login">авторизоваться</a>.',
                            buttons: [{
                                text: 'Закрыть'
                            }]
                        });
                    }, 3000);
                }
            } else {
                noConnection();
            }
        },
        error: function(xhr) {
            console.log("Error on ajax call " + xhr);
            if (devMode) alert(JSON.parse(xhr));
        }
    });
}

//Show no connection popup
function noConnection() {
    bankaKZ.modal({
        title: 'Соединение утеряно!',
        text: 'Попробуйте вернуться на предыдущую страницу или закройте приложения.',
        buttons: [
            {
                text: 'Вернуться',
                onClick: function() {
                    var page = bankaKZ.getCurrentView().activePage;
                    if (page.name == 'index') {
                        bankaKZ.confirm('Хотите закрыть приложение?', 'Выход', function() {
                            navigator.app.clearHistory();
                            navigator.app.exitApp();
                        }, function() {
                            return false;
                        });
                    } else {
                        mainView.router.back();
                    }
                }
            }, {
                text: 'Закрыть',
                onClick: function() {
                    navigator.app.clearHistory();
                    navigator.app.exitApp();
                }
            }
        ]
    });
}