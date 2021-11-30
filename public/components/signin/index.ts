import { state } from "../../state";
class Signin extends HTMLElement {
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
          <input class="input" id="password-check" type="password" placeholder="Repeat password" />
        </p>
      </div>
      <div class="field">
        <p class="control">
          <button class="signin-bttn button is-info">Crear cuenta</button>
        </p>
      </div>
    `;
    document.querySelector("custom-signin").appendChild(container);

    document.querySelector(".modal-card-title").textContent = "Crea una cuenta";

    const signinBttn = document.querySelector(".signin-bttn");
    signinBttn.addEventListener("click", async () => {
      const email: any = document.querySelector("#email");
      const password: any = document.querySelector("#password");
      const passwordCheck: any = document.querySelector("#password-check");

      if (
        email.value == "" &&
        password.value == "" &&
        passwordCheck.value == ""
      ) {
        return window.alert("completa email y contraseña");
      }
      if (email.value == "") {
        return window.alert("email vacio");
      }
      if (password.value == "") {
        return window.alert("password vacio");
      }
      if (passwordCheck.value == "") {
        return window.alert("reingresa tu password");
      }
      if (passwordCheck.value !== password.value) {
        return window.alert("Las contraseñas no coinciden");
      }
      signinBttn.setAttribute("class", "signin-bttn button is-info is-loading");
      try {
        await state.logIn(email.value, password.value, true);
        document.querySelector(".modal-card-title").textContent =
          "Panel de control";
        document.querySelector("custom-signin").remove();
        document
          .querySelector(".modal-card-body")
          .appendChild(document.createElement("custom-dashboard"));
      } catch (error) {
        email.value = "";
        password.value = "";
        passwordCheck.value = "";
        signinBttn.setAttribute("class", "signin-bttn button is-info");
        window.alert(error.message);
      }
    });
  }
}

customElements.define("custom-signin", Signin);
