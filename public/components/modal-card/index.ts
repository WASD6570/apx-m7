class ModalCard extends HTMLElement {
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
    container.setAttribute("class", "signin-container");
    container.innerHTML =
      /*html*/
      `
      <div class="modal">
        <div class="modal-background"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title"></p>
            <button class="delete" aria-label="close"></button>
          </header>
          <section class="modal-card-body">
          </section>
          <footer class="modal-card-foot">
          </footer>
        </div>
      </div>    
    `;
    document.getElementById(this.id).appendChild(container);

    const modal = this.querySelector(".modal");
    const modalClose = this.querySelector(".delete");
    modalClose.addEventListener("click", () => {
      modal.classList.remove("is-active");
      modal.setAttribute("class", "modal");
    });
  }
}

customElements.define("custom-modalcard", ModalCard);
