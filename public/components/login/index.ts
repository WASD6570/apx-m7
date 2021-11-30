import { state } from "../../state";
class Login extends HTMLElement {
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
      <div class="field is gruped">
        <p class="control">
          <input class="input" id="email" type="email" placeholder="Email" />
        </p>
      </div>
      <div class="field">
        <p class="control">
          <input class="input" id="password" type="password" placeholder="Password" />
        </p>
      </div>
      <div class="field">
        <p class="control">
          <button class="login-bttn button is-success">Ingresar</button>
        </p>
      </div>
    `;
    document.querySelector("custom-login").appendChild(container);
    document.querySelector(".modal-card-title").textContent = "Inicia sesion";

    const loginBttn = document.querySelector(".login-bttn");
    loginBttn.addEventListener("click", async () => {
      const email: any = document.querySelector("#email");
      const password: any = document.querySelector("#password");
      if (email.value == "" && password.value == "") {
        return window.alert("completa email y contraseña");
      }
      if (email.value == "") {
        return window.alert("email vacio");
      }
      if (password.value == "") {
        return window.alert("password vacio");
      }
      loginBttn.setAttribute(
        "class",
        "signin-bttn button is-success is-loading"
      );
      try {
        await state.logIn(email.value, password.value, false);
        document.querySelector(".modal-card-title").textContent =
          "Panel de control";
        document.querySelector("custom-login").remove();
        document
          .querySelector(".modal-card-body")
          .appendChild(document.createElement("custom-dashboard"));
      } catch (error) {
        email.value = "";
        password.value = "";
        loginBttn.setAttribute("class", "signin-bttn button is-success");
        window.alert(error.message);
      }
    });
  }
}

customElements.define("custom-login", Login);
