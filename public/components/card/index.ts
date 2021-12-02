import { state } from "../../state";
class Card extends HTMLElement {
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
      <section class="mmr-page-body">
      <div class="container card-main-container">
        <div class="card has-text-centered">
          <div class="card-image">
            <figure class="image is-4by3">
              <img
                src="https://bulma.io/images/placeholders/1280x960.png"
                alt="Placeholder image"
              />
            </figure>
          </div>
          <div class="card-content">
            <div class="media">
              <div class="media-content">
                <p class="title is-4">Nombre de la mascota</p>
              </div>
            </div>
            <div class="content">
              *descricion de la mascota*
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
              nec iaculis mauris.
              <br />
              <time>aca va la ultima modificacion</time>
            </div>
          </div>
        </div>
      </div>
    </section>
    `;
    const customCard = document.querySelector("custom-card");
    customCard.appendChild(container);
  }
}

customElements.define("custom-card", Card);
