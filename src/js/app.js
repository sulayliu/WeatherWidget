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
      <div class="condition">${json.weather[0].main}</div>`
}



function getForcast(lat, lon) {
  fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apikey}&units=metric`)
  .then((resp) => {
    if (resp.ok) {
      return resp.json();
    } else {
      throw new Error("There is an error on getting weather.");
    }
  })
  .then((json) => {
    console.log(json.list);
    forecast(json.list)
  })
}

function forecast(array) {
  let date = new Date();
  let html = ``;
  const forecastEle = document.querySelector(`.forecast`);
  forecastEle.textContent = ``;
  for(let i = 0; i < 5; i++) {
    let newArray = [];
    date.setDate(date.getDate() + 1);
    for(let ele of array) {
      if (new Date(ele.dt_txt).getDate() === date.getDate()) {
        newArray.push(ele);
      }
    }
    newArray.sort((a, b) => b.main.temp_max - a.main.temp_max);
    let maxTemp = newArray[0].main.temp_max;
    console.log(maxTemp);
    newArray.sort((a, b) => a.main.temp_min - b.main.temp_min);
    let minTemp = newArray[0].main.temp_min
    console.log(minTemp);
    let noonWeater = newArray.find(ele => new Date(ele.dt_txt).getHours() == 12);
    console.log(noonWeater);
    html += `<div class="day">
        <h3>${weekday[date.getDay()]}</h3>
        <img src="http://openweathermap.org/img/wn/${noonWeater.weather[0].icon}@2x.png">
        <div class="description">${noonWeater.weather[0].description}</div>
        <div class="temp">
          <span class="high">${maxTemp.toFixed(0)}℃</span>/<span class="low">${minTemp.toFixed(0)}℃</span>
        </div>
      </div>`
  }

  forecastEle.insertAdjacentHTML(`beforeend`, html)
}

