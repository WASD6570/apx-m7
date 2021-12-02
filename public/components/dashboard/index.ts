import { goTo } from "../../router";
import { state } from "../../state";
class Dashboard extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.render();
  }
  async render() {
    const container = document.createElement("section");
    container.innerHTML =
      /*html*/
      `
      <div class="menu">
      <p class="menu-label">
        General
      </p>
      <ul class="menu-list">
        <li><a id="mis-datos">Mis Datos</a></li>
        <li><a id="mis-mascotas-reportadas">Mis Mascotas <br> reportadas</a></li>
        <li><a id="reportar-mascota">Reportar <br> mascota</a></li>
      </ul>
    </div>
    `;
    const { data } = await state.getState();
    const email = data.email;

    document.querySelector("custom-dashboard").appendChild(container);
    const footer = document.querySelector(".modal-card-foot");
    const footerContent = document.createElement("div");
    footerContent.setAttribute("class", "container has-text-centered");
    footerContent.setAttribute("id", "footer-container");

    footerContent.innerHTML =
      /*html*/
      `
      <h2>${email}</h2>
      <a class="end-session">cerrar sesion</a>
    `;
    footer.appendChild(footerContent);

    document.querySelector("#mis-datos").addEventListener("click", () => {
      goTo("/mis-datos");
    });

    document
      .querySelector("#mis-mascotas-reportadas")
      .addEventListener("click", () => {
        goTo("/mis-mascotas-reportadas");
      });

    document
      .querySelector("#reportar-mascota")
      .addEventListener("click", () => {
        goTo("/reportar-mascota");
      });

    const cerrarSesion = document.querySelector(".end-session");
    cerrarSesion.addEventListener("click", () => {
      localStorage.removeItem("localData");
      location.reload();
    });
  }
}

customElements.define("custom-dashboard", Dashboard);
