const apikey = `eeebbc3ed4485cdb52855a486de349b2`;
let localLng;
let localLat;


navigator.geolocation.getCurrentPosition(success);

function success(pos) {
  const crd = pos.coords;
  localLat = crd.latitude;
  localLng = crd.longitude;
  console.log(crd.longitude, crd.latitude);
  getWeather(crd.latitude, crd.longitude)
}

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
    console.log(json);
    currentWeather(json);
  })
}

function currentWeather(json) {
  const currentCondition = document.querySelector(`.current-conditions`);
  const temp = document.querySelector(`.temp`);
  const condition = document.querySelector(`.condition`);

  currentCondition.querySelector(`img`).src = `http://openweathermap.org/img/wn/${json.weather[0].icon}@2x.png`;
  temp.textContent = json.main.temp
  condition.textContent = json.weather[0].main;
}