let localLng;
let localLat;


navigator.geolocation.getCurrentPosition(success);

function success(pos) {
  const crd = pos.coords;
  localLng = crd.longitude;
  localLat = crd.latitude;
  console.log(crd.longitude, crd.latitude);
}
