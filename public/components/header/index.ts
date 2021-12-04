import { state } from "../../state";
class Header extends HTMLElement {
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
      <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <a class="navbar-item" href="${state.apiURL}">
          <img src="https://res.cloudinary.com/dacvdoq3z/image/upload/v1638409090/paw-solid_aijjqv.svg" width="60" height="28" />
        </a>

        <a
          role="button"
          class="navbar-burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>
      <div id="navbarBasicExample" class="navbar-menu">
        <div class="navbar-start">
          <a class="navbar-item"> Home </a>
    
          <a class="navbar-item"> Mascotas perdidas </a>
    
          <div class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link"> Mas </a>
            <div class="navbar-dropdown">
              <a class="navbar-item"> About </a>
              <a class="navbar-item"> Other Services </a>
              <a class="navbar-item"> Contact </a>
              <hr class="navbar-divider" />
              <a class="navbar-item"> Report an issue </a>
            </div>
          </div>
        </div>
    
        <div class="navbar-end">
          <div class="navbar-item">
            <div class="buttons">
              <a class="button is-primary">
                <strong>Sign up</strong>
              </a>
              <a class="button is-light"> Log in </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
    `;
    const customHeader = document.querySelector("custom-header");
    customHeader.appendChild(container);
    const customModalCard = document.createElement("custom-modalcard");
    customModalCard.setAttribute("id", "a0");
    customHeader.appendChild(customModalCard);

    const modalDeploy = document.querySelector(".navbar-burger");
    const modal = document.querySelector(".modal");

    modalDeploy.addEventListener("click", async () => {
      if ((await state.isAuthenticated()) == false) {
        const container = document.querySelector(".modal-card-body");
        container.innerHTML =
          /*html*/
          `
           <div class="pre-auth-div box">
               <button class="signin-bttn button is-info">Crea una cuenta</button>
               <button class="login-bttn button is-success">Ya tengo cuenta</button>
           </div>
           `;
        const loginEl = document.querySelector(".login-bttn");
        const signinEl = document.querySelector(".signin-bttn");

        signinEl.addEventListener("click", () => {
          container.innerHTML = "";
          container.appendChild(document.createElement("custom-signin"));
        });
        loginEl.addEventListener("click", () => {
          container.innerHTML = "";
          container.appendChild(document.createElement("custom-login"));
        });
      } else {
        const dashboard = document.querySelector("custom-dashboard");
        const footer = document.querySelector("#footer-container");
        if (dashboard) {
          dashboard.remove();
          footer.remove();
        }
        const headerModalCardBody = document.querySelector(".modal-card-body");
        headerModalCardBody.setAttribute("id", "header-modal-card-body");
        headerModalCardBody.appendChild(
          document.createElement("custom-dashboard")
        );

        const headerModalCardTitle =
          document.querySelector(".modal-card-title");
        headerModalCardTitle.setAttribute("id", "header-modal-card-title");
        headerModalCardTitle.textContent = "Panel de control";
      }
      modal.setAttribute("class", "modal is-active");
    });
  }
}

customElements.define("custom-header", Header);
