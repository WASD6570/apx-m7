class Card extends HTMLElement {
  name: string;
  description: string;
  pictureURL: string;
  id: any;
  lat: any;
  lng: any;
  editable?: string;
  constructor() {
    super();
  }
  connectedCallback() {
    this.name = this.getAttribute("name");
    this.description = this.getAttribute("description");
    this.pictureURL = this.getAttribute("img");
    this.id = this.getAttribute("id");
    this.lat = this.getAttribute("lat");
    this.lng = this.getAttribute("lng");
    this.editable = this.getAttribute("editable");

    this.render();
  }
  render() {
    const container = document.createElement("section");

    if (this.editable == "false") {
      container.innerHTML =
        /*html*/
        `
      <section class="mmr-page-body has-text-centered">
        <div class="card">
          <div class="card-image">
            <figure class="image is-4by3">
              <img
                src="${this.pictureURL}"
                alt="Placeholder image"
              />
            </figure>
          </div>
          <div class="card-content">
            <div class="media">
              <div class="media-content">
                <h4 class="title is-4">${this.name}</h4>
              </div>
            </div>
            <div class="content">
              <p>${this.description}.</p>
            </div>
            <!-- asd -->
            <a role="button" class="edit button is-small">
            Reportar info
            </a>
            <custom-modalcard id="reportcard,${this.id}"></custom-modalcard>
            <!-- asd -->
          </div>
        </div>
    </section>
    `;
      const customCard = document.getElementById(this.id);
      customCard.appendChild(container);

      const modal = this.querySelector(".modal");

      const editButton = this.querySelector(".edit");
      editButton.addEventListener("click", () => {
        modal.setAttribute("class", "modal is-active");
        const body = modal.querySelector(".modal-card-body");

        this.querySelector(
          ".modal-card-title"
        ).innerHTML = `Reportar informacion <br> sobre ${this.name.toString()}`;

        body.innerHTML =
          /*html*/
          `
          <custom-report id="report,${this.id}"></custom-report>
         `;
      });
      //////////////////////////////////////////////////////////
    } else {
      container.innerHTML =
        /*html*/
        `
      <section class="mmr-page-body has-text-centered">
        <div class="card">
          <div class="card-image">
            <figure class="image is-4by3">
              <img
                src="${this.pictureURL}"
                alt="Placeholder image"
              />
            </figure>
          </div>
          <div class="card-content">
            <div class="media">
              <div class="media-content">
                <h4 class="title is-4">${this.name}</h4>
              </div>
            </div>
            <div class="content">
              <p>${this.description}.</p>
            </div>
            <!-- asd -->
              <a role="button" class="edit button" style="border: none; display: inline-block; margin-left: 80%;">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"><path d="M7.127 22.562l-7.127 1.438 1.438-7.128 5.689 5.69zm1.414-1.414l11.228-11.225-5.69-5.692-11.227 11.227 5.689 5.69zm9.768-21.148l-2.816 2.817 5.691 5.691 2.816-2.819-5.691-5.689z"/></svg>
              </a>
              <custom-modalcard id="customcard,${this.id}"></custom-modalcard>
            <!-- asd -->
          </div>
        </div>
    </section>
    `;
      const customCard = document.getElementById(this.id);
      customCard.appendChild(container);

      const modal = this.querySelector(".modal");

      const editButton = this.querySelector(".edit");
      editButton.addEventListener("click", () => {
        modal.setAttribute("class", "modal is-active");
        const body = this.querySelector(".modal-card-body");
        this.querySelector(
          ".modal-card-title"
        ).innerHTML = `Editar informacion <br> sobre ${this.name.toString()}`;

        body.innerHTML =
          /*html*/
          `
       <custom-editpet name="${this.name}" description="${this.description}"
        from-edit="true" id="editpet${this.id}"
        img="${this.pictureURL}" lat="${this.lat}" lng="${this.lng}"
        ></custom-editpet>
       `;
      });
    }
  }
}

customElements.define("custom-card", Card);
