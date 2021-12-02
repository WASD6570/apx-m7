import { state } from "../state";
import mapboxgl from "mapbox-gl";
const MAPBOX_TOKEN =
  "pk.eyJ1Ijoid2FzZDEyIiwiYSI6ImNrd2FvNmdrZjI1NjQycGxqZ29ldGEzaWYifQ.UDM7Ur0JGtFmJe3WPidyQQ";
//@ts-ignore
const mapboxClient = new MapboxClient(MAPBOX_TOKEN);

async function initMap() {
  const { data } = await state.getState();

  mapboxgl.accessToken = MAPBOX_TOKEN;
  return new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: [data.lng, data.lat],
    zoom: 11,
  });
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

export async function startMap() {
  const map = await initMap();

  initSearchForm(function (results) {
    try {
      const firstResult = results[0];

      if (firstResult == undefined) return console.log("no encontre nada");

      const [lng, lat] = firstResult.geometry.coordinates;

      const marker = new mapboxgl.Marker({
        anchor: "center",
        draggable: false,
      });
      marker.setLngLat([lng, lat]).addTo(map);

      map.on("click", (e) => {
        const coordinates = e.lngLat;
        console.log("Lng:", coordinates.lng, "Lat:", coordinates.lat);
        marker.setLngLat(coordinates).addTo(map);
      });
      map.setCenter(firstResult.geometry.coordinates);
      map.setZoom(14);
    } catch (error) {
      console.log(error.message);
    }
  });
}
