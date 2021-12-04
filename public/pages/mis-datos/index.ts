import { state } from "../../state";
export async function initMisDatos(containerEl: Element) {
  const div = document.createElement("div");
  div.setAttribute("class", "container");
  const style = document.createElement("style");
  style.setAttribute("class", "style");
  style.innerHTML = ``;
  const { data } = await state.getState();
  div.innerHTML =
    /*html*/
    `
    <custom-header></custom-header>
    <section class="mis-datos-page-body">
      <div class="container has-text-centered" id="card-container">
        <h1 class="title is-2">Mis datos:</h1>
        <ul>
            <li>email: ${data.email} </li>
            <li>ubicacion: ${data.lng}, ${data.lat}</li>
        </ul>
        
      </div>
    </section>
  `;
  containerEl.appendChild(div);
  containerEl.appendChild(style);
}
