import { goTo } from "../../router";
import { state } from "../../state";
export function initMMR(containerEl: Element) {
  const div = document.createElement("div");
  div.setAttribute("class", "container");
  const style = document.createElement("style");
  style.setAttribute("class", "style");
  style.innerHTML = ``;
  div.innerHTML =
    /*html*/
    `
    <custom-header></custom-header>
    <section class="mmr-page-body">
      <div class="container MMR-main-container">
        <div class="card has-text-centered">
          <div class="card-image">
            <figure class="image is-4by3">
              <img
                src="https://bulma.io/images/placeholders/1280x960.png"
                alt="Placeholder image"
              />
            </figure>
          </div>
          <div class="card-content">
            <div class="media">
              <div class="media-content">
                <p class="title is-4">John Smith</p>
              </div>
            </div>
            <div class="content">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
              nec iaculis mauris.
              <br />
              <time datetime="2016-1-1">11:09 PM - 1 Jan 2016</time>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
  containerEl.appendChild(div);
  const geoBttn = document.querySelector(".geobutton");
  geoBttn.addEventListener("click", () => {
    geoBttn.textContent = "Listo!";
    navigator.geolocation.getCurrentPosition(
      (location) => {
        let { data } = state.getState();
        data.lat = location.coords.latitude;
        data.lng = location.coords.longitude;
        state.setState(data);
        //goTo("/mis-mascotas-reportadas")
      },
      (error) => {
        console.log(error);
        window.alert("no pudimos obtener tu ubicacion");
      }
    );
  });
  containerEl.appendChild(style);
}
