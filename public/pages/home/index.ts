import { goTo } from "../../router";
import { state } from "../../state";
export function initHomePage(containerEl: Element) {
  const div = document.createElement("div");
  div.setAttribute("class", "container");
  const style = document.createElement("style");
  style.setAttribute("class", "style");
  style.innerHTML = ``;
  div.innerHTML =
    /*html*/
    `
    <custom-header></custom-header>
    <section class="home-page-body">
      <div class="container has-text-centered">
        <h1 class="title is-2">Bienvenido a la app para reportar mascotas</h1>
        <h3 class="title is-4">para poder reportar tu mascota perdida o ayudar a encontrar <br> 
        otras mascotas perdidas necesitamos conocer tu ubicacion
        </h3>
        <button class="geobutton button is-success is-large">Dar mi ubicacion</button>
      </div>
    </section>
  `;
  containerEl.appendChild(div);
  containerEl.appendChild(style);
  const { data } = state.getState();
  if (data.lat != null && data.lng != null) {
    goTo("/mascotas-cerca-tuyo");
  }
  const geoBttn = document.querySelector(".geobutton");
  geoBttn.addEventListener("click", () => {
    geoBttn.textContent = "Listo!";
    navigator.geolocation.getCurrentPosition(
      (location) => {
        let { data } = state.getState();
        data.lat = location.coords.latitude;
        data.lng = location.coords.longitude;
        state.setState(data);
        goTo("/mascotas-cerca-tuyo");
      },
      (error) => {
        console.log(error);
        window.alert("no pudimos obtener tu ubicacion");
      }
    );
  });
}
