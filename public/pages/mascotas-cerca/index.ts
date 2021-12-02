import { goTo } from "../../router";
import { state } from "../../state";
export function initMCT(containerEl: Element) {
  const div = document.createElement("div");
  div.setAttribute("class", "container");
  const style = document.createElement("style");
  style.setAttribute("class", "style");
  style.innerHTML = ``;
  div.innerHTML =
    /*html*/
    `
    <custom-header></custom-header>
    <section class="mct-page-body">
      <div class="container has-text-centered" id="card-container">
        <h1 class="title is-2">Mascotas cerca tuyo</h1>
        
      </div>
    </section>
  `;
  containerEl.appendChild(div);
  containerEl.appendChild(style);
  const divContainer = document.querySelector("#card-container");
}
