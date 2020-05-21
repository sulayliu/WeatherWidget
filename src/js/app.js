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
    forecast(json.list);
  })
}

function forecast(array) {
  const forecastEle = document.querySelector(`.forecast`);
  let date = new Date();
  let html = ``;
  forecastEle.textContent = ``;
  
  for (let i = 0; i < 5; i++) {
    let weatherLists = [];
    date.setDate(date.getDate() + 1);

    // Get the weater list of array on each day.
    for (let ele of array) {
      if (new Date(ele.dt_txt).getDate() === date.getDate()) {
        weatherLists.push(ele);
      }
    }
    // Sort the weather list and get the max temp.
    weatherLists.sort((a, b) => b.main.temp_max - a.main.temp_max);
    let maxTemp = weatherLists[0].main.temp_max;

    // Sort the weather list and get the min temp.
    weatherLists.sort((a, b) => a.main.temp_min - b.main.temp_min);
    let minTemp = weatherLists[0].main.temp_min;

    // Use the 12 o'clock weather data to show the icon.
    let showWeather = weatherLists.find(ele => new Date(ele.dt_txt).getHours() == 12);

    // When we query at midnight between 0:00 AM to 3:00 AM, the 5th weather list do not have the 12 o'clock data, 
    // so I use the 0:00 AM weather data.
    if (showWeather === undefined) {
      showWeather = weatherLists.find(ele => new Date(ele.dt_txt).getHours() == 0);
    }

    html += `<div class="day">
        <h3>${weekday[date.getDay()]}</h3>
        <img src="http://openweathermap.org/img/wn/${showWeather.weather[0].icon}@2x.png">
        <div class="description">${showWeather.weather[0].description}</div>
        <div class="temp">
          <span class="high">${maxTemp.toFixed(0)}℃</span>/<span class="low">${minTemp.toFixed(0)}℃</span>
        </div>
      </div>`
  }

  forecastEle.insertAdjacentHTML(`beforeend`, html);
}
