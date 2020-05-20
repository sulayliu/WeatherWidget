const apikey = `eeebbc3ed4485cdb52855a486de349b2`;
const weekday = [`Monday`, `Tuesday`, `Wednesday`, `Thursday`, `Friday`, `Saturday`, `Sunday`];


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
  const temp = document.querySelector(`.temp`);
  const condition = document.querySelector(`.condition`);

  currentCondition.querySelector(`img`).src = `http://openweathermap.org/img/wn/${json.weather[0].icon}@2x.png`;
  temp.textContent = `${json.main.temp.toFixed(0)}℃`
  condition.textContent = json.weather[0].main;
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
    console.log(date.getDate());
    console.log(weekday[date.getDay()]);
    for(let ele of array) {
      if (new Date(ele.dt_txt).getDate() === date.getDate()) {
        newArray.push(ele);
      }
    }
    let maxTemp = [...newArray]
    maxTemp.sort((a, b) => b.main.temp_max - a.main.temp_max);
    console.log(maxTemp[0].main.temp_max);
    let minTemp = newArray.sort((a, b) => a.main.temp_min - b.main.temp_min);
    console.log(minTemp[0].main.temp_min);
    let noonWeater = newArray.find(ele => new Date(ele.dt_txt).getHours() == 12);
    console.log(noonWeater);
    html += `<div class="day">
        <h3>${weekday[date.getDay()]}</h3>
        <img src="http://openweathermap.org/img/wn/${noonWeater.weather[0].icon}@2x.png">
        <div class="description">${noonWeater.weather[0].description}</div>
        <div class="temp">
          <span class="high">${maxTemp[0].main.temp_max.toFixed(0)}℃</span>/<span class="low">${minTemp[0].main.temp_min.toFixed(0)}℃</span>
        </div>
      </div>`
  }

  forecastEle.insertAdjacentHTML(`beforeend`, html)
}

