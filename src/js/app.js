const apikey = `eeebbc3ed4485cdb52855a486de349b2`;
const weekday = [`Monday`, `Tuesday`, `Wednesday`, `Thursday`, `Friday`, `Saturday`, `Sunday`]

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

  for(let i = 0; i < 5; i++) {
    let newArray = [];
    date.setDate(date.getDate() + 1);
    console.log(date.getDate());
    for(let ele of array) {
      if (new Date(ele.dt_txt).getDate() === date.getDate()) {
        newArray.push(ele);
      }
    }
    //  newArray = array.filter(ele => {new Date(ele.dt_txt).getDate() == date.getDate()});
    newArray.sort((a, b) => b.main.temp_max - a.main.temp_max);
    let maxTemp = [...newArray]
    console.log(maxTemp);
    let minTemp = newArray.sort((a, b) => a.main.temp_min - b.main.temp_min);
    console.log(minTemp);
  }
}