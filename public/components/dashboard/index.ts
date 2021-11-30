import { state } from "../../state";
class Dashboard extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.render();
  }
  render() {
    const container = document.createElement("section");
    container.innerHTML =
      /*html*/
      `
      <div class="menu">
      <p class="menu-label">
        General
      </p>
      <ul class="menu-list">
        <li><a>Mis Datos</a></li>
        <li><a>Mis Mascotas <br> reportadas</a></li>
        <li><a>Reportar <br> mascota</a></li>
      </ul>
    </div>
    `;
    const { data } = state.getState();
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

    const cerrarSesion = document.querySelector(".end-session");
    cerrarSesion.addEventListener("click", () => {
      localStorage.removeItem("localData");
      location.reload();
    });
  }
}

customElements.define("custom-dashboard", Dashboard);
