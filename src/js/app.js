const apikey = `eeebbc3ed4485cdb52855a486de349b2`;
const weekday = [`Sunday`, `Monday`, `Tuesday`, `Wednesday`, `Thursday`, `Friday`, `Saturday`];

navigator.geolocation.getCurrentPosition(success);

function success(pos) {
  const crd = pos.coords;
  getWeather(crd.latitude, crd.longitude);
  getForcast(crd.latitude, crd.longitude);
}

// Get current weather through the location.
function getWeather(lat, lon) {
  fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}&units=metric`)
  .then((resp) => {
    if (resp.ok) {
      return resp.json();
    } else {
      throw new Error("There is an error on getting weather.");
    }
  })
  .then((json) => {
    currentWeather(json);
  })
}

// Fill the page through current weater data.
function currentWeather(json) {
  const currentCondition = document.querySelector(`.current-conditions`);
  currentCondition.innerHTML = `<h2>Current Conditions</h2>
    <img src="http://openweathermap.org/img/wn/${json.weather[0].icon}@2x.png" />
    <div class="current">
      <div class="temp">${json.main.temp.toFixed(0)}℃</div>
      <div class="condition">${json.weather[0].description}</div>`
}

// Get the list of 5 days' weather from forcast API.
function getForcast(lat, lon) {
  fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apikey}&units=metric`)
  .then((resp) => {
    if (resp.ok) {
      return resp.json();
    } else {
      throw new Error("There is an error on getting forcast.");
    }
  })
  .then((json) => {
    forecast(json.list)
  })
}

function forecast(array) {
  const forecastEle = document.querySelector(`.forecast`);
  const weatherObj = {};
  const date = new Date();
  let html = ``;

  forecastEle.textContent = ``;
  
  // Classify the weather list by the date and store them in an object.
  // The keys name is weekday and the value is an array contains weather data.
  for(let list of array) {
    if (new Date(list.dt_txt).getDay() !== date.getDay()) {
      if (weatherObj[weekday[new Date(list.dt_txt).getDay()]] === undefined) {
        weatherObj[weekday[new Date(list.dt_txt).getDay()]] = [list];
      } else {
        weatherObj[weekday[new Date(list.dt_txt).getDay()]].push(list);
      }
    }
  }

  // Translate the object to an array and sort the array by date order.
  const newArray = Object.entries(weatherObj).sort((a, b) => new Date(a[1].dt_txt) > new Date(b[1].dt_txt) ? -1 : 1 );

  // Get each day's weather data and insert into HTML.
  newArray.forEach(ele => {
    // Get the day's max temp.
    ele[1].sort((a, b) => b.main.temp_max - a.main.temp_max);
    let maxTemp = ele[1][0].main.temp_max;
    
    // Get the day's min temp.
    ele[1].sort((a, b) => a.main.temp_min - b.main.temp_min);
    let minTemp = ele[1][0].main.temp_min;

    // Get the noon's weather data to show.
    let showWeather = ele[1].find(weather => new Date(weather.dt_txt).getHours() == 12);

    // The reason why use 6:00 data is that when we query at midnight between 0:00 AM to 3:00 AM,
    // the 5th weather list do not have the 12 o'clock data, 
    // so I use the 6:00 AM weather data.
    if (showWeather === undefined) {
      showWeather = ele[1].find(weather => new Date(weather.dt_txt).getHours() == 6);
    }

    // Insert the HTML with the weather data, except the last day that only have 0:00 AM weather.
    if (showWeather !== undefined) {
      html += `<div class="day">
      <h3>${ele[0]}</h3>
      <img src="http://openweathermap.org/img/wn/${showWeather.weather[0].icon}@2x.png">
      <div class="description">${showWeather.weather[0].description}</div>
      <div class="temp">
        <span class="high">${maxTemp.toFixed(0)}℃</span>/<span class="low">${minTemp.toFixed(0)}℃</span>
      </div>
    </div>`
    }
  });

  forecastEle.insertAdjacentHTML(`beforeend`, html);
}