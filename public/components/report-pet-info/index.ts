import { state } from "../../state";
import { goTo } from "../../router";
class ReportInfo extends HTMLElement {
  id: any;
  constructor() {
    super();
  }
  connectedCallback() {
    this.id = this.getAttribute("id");
    this.render();
  }
  render() {
    const container = document.createElement("section");

    container.innerHTML =
      /*html*/
      `
        <section class="mmr-page-body has-text-centered">
        <div class="field is gruped"> 
        <div class="field">
        <label class="label">Nombre</label>
        <div class="control">
          <input id="name-input" class="input" type="text" placeholder="Tu nombre">
        </div>
      </div>
      
      <div class="field">
      <label class="label">Telefono</label>
      <div class="control">
        <input id="phone-input" class="input" type="text" placeholder="Tu numero">
      </div>
    </div>
      
      <div class="field">
        <label class="label">Descripcion</label>
        <div class="control">
          <textarea id="description-input" class="textarea" placeholder="Descripcion"></textarea>
        </div>
      </div>
      
      <div class="field is-grouped">
        <div class="control">
          <button class="button send-report is-link">Enviar</button>
        </div>
      </div>
      </div>

      </section>
      `;
    const customCard = document.getElementById(this.id);
    customCard.appendChild(container);

    const sendButton = document.querySelector(".send-report");
    sendButton.addEventListener("click", async (e) => {
      e.preventDefault();
      const name: any = document.getElementById("name-input");
      const phone: any = document.getElementById("phone-input");
      const description: any = document.getElementById("description-input");

      sendButton.setAttribute("class", "button send-report is-link is-loading");

      const reportInfo = {
        name: name.value,
        phone: phone.value,
        description: description.value,
        id: this.id.split(",")[1],
      };

      state.reportPetInfo(reportInfo).then((res) => {
        sendButton.setAttribute(
          "class",
          "button send-report is-link is-loading"
        );
        goTo("/mascotas-cerca-tuyo");
      });
    });
  }
}

customElements.define("custom-report", ReportInfo);
