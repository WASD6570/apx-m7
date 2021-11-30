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

    const loginBttn = document.querySelector(".login-bttn");
    loginBttn.addEventListener("click", (e: any) => {
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
      state.logIn(email.value, password.value, false).then(() => {
        console.log(state.getState());

        //goTo("/profile")
      });
    });
  }
}

customElements.define("custom-login", Login);
