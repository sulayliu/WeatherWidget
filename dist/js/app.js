"use strict";function _createForOfIteratorHelper(t){if("undefined"==typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(t=_unsupportedIterableToArray(t))){var e=0,n=function(){};return{s:n,n:function(){return e>=t.length?{done:!0}:{done:!1,value:t[e++]}},e:function(t){throw t},f:n}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var r,a,o=!0,i=!1;return{s:function(){r=t[Symbol.iterator]()},n:function(){var t=r.next();return o=t.done,t},e:function(t){i=!0,a=t},f:function(){try{o||null==r.return||r.return()}finally{if(i)throw a}}}}function _unsupportedIterableToArray(t,e){if(t){if("string"==typeof t)return _arrayLikeToArray(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?_arrayLikeToArray(t,e):void 0}}function _arrayLikeToArray(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}var apikey="eeebbc3ed4485cdb52855a486de349b2",weekday=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];function success(t){var e=t.coords;getWeather(e.latitude,e.longitude),getForcast(e.latitude,e.longitude)}function getWeather(t,e){fetch("http://api.openweathermap.org/data/2.5/weather?lat=".concat(t,"&lon=").concat(e,"&appid=").concat(apikey,"&units=metric")).then(function(t){if(t.ok)return t.json();throw new Error("There is an error on getting weather.")}).then(function(t){currentWeather(t)})}function currentWeather(t){document.querySelector(".current-conditions").innerHTML='<h2>Current Conditions</h2>\n    <img src="http://openweathermap.org/img/wn/'.concat(t.weather[0].icon,'@2x.png" />\n    <div class="current">\n      <div class="temp">').concat(t.main.temp.toFixed(0),'℃</div>\n      <div class="condition">').concat(t.weather[0].description,"</div>")}function getForcast(t,e){fetch("http://api.openweathermap.org/data/2.5/forecast?lat=".concat(t,"&lon=").concat(e,"&appid=").concat(apikey,"&units=metric")).then(function(t){if(t.ok)return t.json();throw new Error("There is an error on getting forcast.")}).then(function(t){forecast(t.list)})}function forecast(t){var e=document.querySelector(".forecast"),n={},r=new Date,a="";e.textContent="";var o,i=_createForOfIteratorHelper(t);try{for(i.s();!(o=i.n()).done;){var c=o.value;new Date(c.dt_txt).getDay()!==r.getDay()&&(void 0===n[weekday[new Date(c.dt_txt).getDay()]]?n[weekday[new Date(c.dt_txt).getDay()]]=[c]:n[weekday[new Date(c.dt_txt).getDay()]].push(c))}}catch(t){i.e(t)}finally{i.f()}Object.entries(n).sort(function(t,e){return new Date(t[1].dt_txt)>new Date(e[1].dt_txt)?-1:1}).forEach(function(t){t[1].sort(function(t,e){return e.main.temp_max-t.main.temp_max});var e=t[1][0].main.temp_max;t[1].sort(function(t,e){return t.main.temp_min-e.main.temp_min});var n=t[1][0].main.temp_min,r=t[1].find(function(t){return 12==new Date(t.dt_txt).getHours()});void 0!==r&&(a+='<div class="day">\n      <h3>'.concat(t[0],'</h3>\n      <img src="http://openweathermap.org/img/wn/').concat(r.weather[0].icon,'@2x.png">\n      <div class="description">').concat(r.weather[0].description,'</div>\n      <div class="temp">\n        <span class="high">').concat(e.toFixed(0),'℃</span>/<span class="low">').concat(n.toFixed(0),"℃</span>\n      </div>\n    </div>"))}),e.insertAdjacentHTML("beforeend",a)}navigator.geolocation.getCurrentPosition(success);