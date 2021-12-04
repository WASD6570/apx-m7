import { state } from "../state";
import mapboxgl from "mapbox-gl";
//@ts-ignore
const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN;
//@ts-ignore
const mapboxClient = new MapboxClient(MAPBOX_TOKEN);

type coordinates = [lng: number, lat: number];

async function initMap(center?: coordinates) {
  const { data } = await state.getState();
  mapboxgl.accessToken = MAPBOX_TOKEN;
  if (center == undefined) {
    console.log("entre a este if");

    return new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [data.lng, data.lat],
      zoom: 11,
    });
  } else {
    console.log("entre al else");

    return new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [center[0], center[1]],
      zoom: 11,
    });
  }
}

function initSearchForm(callback) {
  const qButton = document.querySelector(".q-button");
  qButton.addEventListener("click", () => {
    const searchValue: any = document.querySelector(".q-input");
    mapboxClient.geocodeForward(
      searchValue.value,
      {
        country: "ar",
        autocomplete: true,
        language: "es",
      },
      function (err, data, res) {
        if (!err) callback(data.features);
      }
    );
  });
}

export { initMap, initSearchForm, mapboxgl };
