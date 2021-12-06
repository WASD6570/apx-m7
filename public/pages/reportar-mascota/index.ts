import { goTo } from "../../router";
import { state } from "../../state";
import { initMap, initSearchForm, mapboxgl } from "../../lib/mapbox";
import Dropzone from "dropzone";
import { Header } from "../../components/header";

export async function initReportPet(containerEl: Element) {
  const div = document.createElement("div");
  div.setAttribute("class", "container");
  const style = document.createElement("style");
  style.setAttribute("class", "style");
  style.innerHTML = ``;

  const { data } = await state.getState();
  if (data.token == null) {
    Header.showUpAuthModal();
  }

  if (await state.isGeolocAvailable()) {
    div.innerHTML =
      /*html*/
      `
    <custom-header></custom-header>
    <custom-editpet from-edit="false" id="report,b0"></custom-editpet>
    `;
    containerEl.appendChild(div);
    containerEl.appendChild(style);
  } else {
    div.innerHTML =
      /*html*/
      `
    <custom-header></custom-header>
    <section class="home-page-body">
      <div class="container has-text-centered">
        <h3 class="title is-4">para poder reportar tu mascota perdida o ayudar a encontrar <br> 
        otras mascotas perdidas necesitamos conocer tu ubicacion
        </h3>
        <button class="geobutton button is-success is-large">Dar mi ubicacion</button>
      </div>
    </section>
  `;
    containerEl.appendChild(div);
    containerEl.appendChild(style);
    const geoBttn = document.querySelector(".geobutton");
    geoBttn.addEventListener("click", () => {
      geoBttn.textContent = "Listo!";
      navigator.geolocation.getCurrentPosition(
        async (geolocation) => {
          let { data } = await state.getState();
          data.lat = geolocation.coords.latitude;
          data.lng = geolocation.coords.longitude;
          await state.setState(data);
          location.reload();
        },
        (error) => {
          console.log(error);
          window.alert("no pudimos obtener tu ubicacion");
        }
      );
    });
  }
}
