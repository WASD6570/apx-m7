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

    const signinBttn = document.querySelector(".signin-bttn");
    signinBttn.addEventListener("click", (e: any) => {
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
      state.logIn(email.value, password.value, true).then(() => {
        console.log(state.getState());

        //goTo("/profile")
      });
    });
  }
}

customElements.define("custom-signin", Signin);
