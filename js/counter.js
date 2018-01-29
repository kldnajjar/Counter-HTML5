var counterObj = {};
counterObj.scripts = ["countdown.js",
                      "requestAnimationFrame.js",
                      "timezonedb.min.js"]

counterObj.tomorrow = "غداً";
counterObj.twoDays = "يومان";
counterObj.oneDay = "يوم";
counterObj.days = "أيام";
counterObj.watchNow = "تابعونا الآن";
counterObj.hour = "ساعه";
counterObj.seconds = "دقيقه";
counterObj.minutes = "ثانيه";
counterObj.showCountDown = "الليله";


counterObj.debug = false;
counterObj.startDateObj;
counterObj.EndDateObj;

/*** GMT Time ***/
var year = 0,
    month = 0,
    day = 0,
    hour =0,
    minute =0,
    second = 0;

var showCountDown = true;
var serverDate = null;

function drawDaysCounter(days){
    switch(days) {
        case 1:
            showDaysContainers();
            jQuery(".daysDiff").html(counterObj.tomorrow);
            break;
        case 2:
            showDaysContainers();
            jQuery(".daysDiff").html(counterObj.twoDays);
            break;
        case 3,4,5,6,7,8,9,10:
            showDaysWithNumbers();
            jQuery(".daysDiffWithCounter .counter-days").html(counterObj.oneDay);
            jQuery(".daysDiffWithCounter .counter-numbers").html(days);
            break;
        default:
            showDaysWithNumbers();
            jQuery(".daysDiffWithCounter .counter-days").html(counterObj.days);
            jQuery(".daysDiffWithCounter .counter-numbers").html(days);
    }
}

function showNow(){
    showPlayingNow();
    jQuery(".showPlaying").html(counterObj.watchNow);
}

function drawCounter(timespan){
    var counter;
    if (isCounterEnd(timespan)){
        showNow();
    }else{
        hideDaysContainers();
        jQuery(".counterDiff-labels .counterHours").html(counterObj.hour);
        jQuery(".counterDiff-numbers .counterHours").html(timespan.hours);

        jQuery(".counterDiff-labels .counterMinutes").html(counterObj.seconds);
        jQuery(".counterDiff-numbers .counterMinutes").html(timespan.minutes);

        jQuery(".counterDiff-labels .counterSeconds").html(counterObj.minutes);
        jQuery(".counterDiff-numbers .counterSeconds").html(timespan.seconds);
    }
}

function counterGenerator(){
    serverTime();
    var obj = setTimeout(function(){counterGenerator()}, 1000);
    if (!counterObj.debug){
      if (serverDate == undefined){return;}
    }


    var startDate;
    var endDate;
    if (counterObj.debug){
      if (counterObj.startDateObj === undefined || counterObj.EndDateObj === undefined){return;}
      startDate = counterObj.startDateObj;
      endDate = calculateLocalizationDiff(counterObj.EndDateObj);
    }else{
      startDate = serverDate;
      endDate = calculateLocalizationDiff(new Date(year, month-1, day, hour, minute, second));
    }

    if(startDate > endDate){showNow();clearTimeout(obj);return;}
    var days = diff(endDate, startDate);
    if (days == 0) {
        var timespan = countdown(startDate, endDate);
        if (showCountDown){
          drawCounter(timespan);
        }else{
          showDaysContainers();
          jQuery(".daysDiff").html(counterObj.showCountDown);
        }
        if (isCounterEnd(timespan)){
            clearTimeout(obj);
        }
    } else {
        drawDaysCounter(days);
    }
}

function isCounterEnd(timespan){
    return (timespan.hours == 0 && timespan.minutes == 0 && timespan.seconds == 0);
}

function showDaysContainers(){
    jQuery(".daysDiff").show();
    jQuery(".showPlaying").hide();
    jQuery(".counterDiff").hide();
    jQuery(".daysDiffWithCounter").hide();
}

function hideDaysContainers(){
    jQuery(".daysDiff").hide();
    jQuery(".showPlaying").hide();
    jQuery(".counterDiff").show();
    jQuery(".daysDiffWithCounter").hide();
}

function showPlayingNow(){
    jQuery(".daysDiff").hide();
    jQuery(".showPlaying").show();
    jQuery(".counterDiff").hide();
    jQuery(".daysDiffWithCounter").hide();
}

function showDaysWithNumbers(){
    jQuery(".daysDiff").hide();
    jQuery(".showPlaying").hide();
    jQuery(".counterDiff").hide();
    jQuery(".daysDiffWithCounter").show();
}

function diff(datex, datey) {
   if (datey.getFullYear() == datex.getFullYear() && datey.getMonth() == datex.getMonth() && datey.getDate() == datex.getDate()) {
     return 0;
   }
    var datexx = new Date(datex.getFullYear(), datex.getMonth() , datex.getDate(), 0, 0, 0, 0);
    var dateyy = new Date(datey.getFullYear(), datey.getMonth() , datey.getDate(), 0, 0, 0, 0);

    var timeDiff = Math.abs(datexx.getTime() - dateyy.getTime());
    days = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if (days == 1 && (datex.getHours() == 0 && datex.getMinutes() == 0)) {
      return 0;
      //var minutesDiff = datex.getMinutes - datey.getMinutes
      //if (days == 1 && (datex.getHours() == 0 && minutesDiff < 30)) {
    }
    return days;
}

function serverTime(){
    if (serverDate != null){
        caculateDate();
    }else{
        timeZoneDB();
    }
}

function caculateDate(){
    serverDate.setSeconds(serverDate.getSeconds()+1)
}

function getUserTimeZone(){
    return ((new Date().getTimezoneOffset()*60*1000));
}

function calculateLocalizationDiff(obj){
    return (new Date(obj - getUserTimeZone()));
}

function timeZoneDB(){
    var tz = new TimeZoneDB;
    tz.getJSON({
        key: "M6UJBI5J10C0",
        lat: "51.508751",
        lng: "-0.12616"
    }, function(data){
        var dateObj = new Date(data.timestamp * 1000);
        serverDate = new Date(dateObj.getFullYear(), dateObj.getMonth() , dateObj.getDate(), dateObj.getHours(), dateObj.getMinutes(), dateObj.getSeconds(), 0);
    });
}

function initScripts(){
    jQuery.each(counterObj.scripts, function( key, value ) {
        jQuery.getScript( counterObj.scripts[key] )
            .done(function( script, textStatus ) {
                console.log(counterObj.scripts[key] + " Script File Loaded");
            })
            .fail(function( jqxhr, settings, exception ) {
                console.log("Failure Loading Script File");
            });
    });
}

function draw(){
    var counterHref = jQuery("counter").attr("href");
    var stringBuffer = '<div class="html5-counter-container">';

    if (counterHref !== undefined){
      stringBuffer += '<a href="'+counterHref+'">';
    }

    stringBuffer += '<div class="counter-background">';
    stringBuffer += '<span class="background-source"></span>';
    stringBuffer += '</div>';
    stringBuffer += '<div class="counter-container">';
    stringBuffer += '<div class="daysDiff"></div>';
    stringBuffer += '<div class="daysDiffWithCounter">';
    stringBuffer += '<span class="counter-numbers"></span>';
    stringBuffer += '<span class="counter-days"></span>';
    stringBuffer += '</div>';
    stringBuffer += '<div class="showPlaying"></div>';
    stringBuffer += '<div class="counterDiff">';
    stringBuffer += '<div class="counterDiff-numbers">';
    stringBuffer += '<div class="counterSeconds"></div>';
    stringBuffer += '<div class="counterMinutes"></div>';
    stringBuffer += '<div class="counterHours"></div>';
    stringBuffer += '</div>';
    stringBuffer += '<div class="counterDiff-labels">';
    stringBuffer += '<div class="counterSeconds"></div>';
    stringBuffer += '<div class="counterMinutes"></div>';
    stringBuffer += '<div class="counterHours"></div>';
    stringBuffer += '</div>';
    stringBuffer += '</div>';
    stringBuffer += '</div>';

    if (counterHref !== undefined){
      stringBuffer += '</a>';
    }

    stringBuffer += '</div>';
    return stringBuffer;
}

function parseBoolean(string) {
  var bool;
  bool = (function() {
    switch (false) {
      case string.toLowerCase() !== 'true':
        return true;
      case string.toLowerCase() !== 'false':
        return false;
    }
  })();
  if (typeof bool === "boolean") {
    return bool;
  }
  return void 0;
}

function syncObjects(counter){
  var DateObj =  new Date();

  year = counter.attr("year") !== undefined? parseInt(counter.attr("year")) : DateObj.getFullYear();
  month = counter.attr("month") !== undefined? parseInt(counter.attr("month")) : DateObj.getMonth() + 1;
  day = counter.attr("day") !== undefined? parseInt(counter.attr("day")) : DateObj.getDay();
  hour = counter.attr("hour") !== undefined? parseInt(counter.attr("hour")) : 20;
  minute = counter.attr("minute") !== undefined? parseInt(counter.attr("minute")) : 0;
  second = counter.attr("second") !== undefined? parseInt(counter.attr("second")) : 0;
  showCountDown = counter.attr("showCountDown") !== undefined? parseBoolean(counter.attr("showCountDown")) : true;
}

jQuery(document).ready(function(){
    var counter = jQuery("counter");
    if (counter.length){
      initScripts();
      syncObjects(counter);
      counter.append(draw());
      setTimeout(function(){serverTime();}, 500);
      setTimeout(function(){counterGenerator();}, 500);
    }
});
