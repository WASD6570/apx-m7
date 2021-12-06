import { goTo } from "../../router";
import { state } from "../../state";
import { Header } from "../../components/header";
export async function initMCT(containerEl: Element) {
  const div = document.createElement("div");
  div.setAttribute("class", "container");
  const style = document.createElement("style");
  style.setAttribute("class", "style");
  style.innerHTML = ``;
  div.innerHTML =
    /*html*/
    `
    <custom-header></custom-header>
    <section class="mct-page-body">
      <div class="container has-text-centered" id="card-container">
        <h1 class="title is-2">Mascotas cerca tuyo</h1>
        
      </div>
    </section>
  `;
  containerEl.appendChild(div);
  containerEl.appendChild(style);

  await state.getNearByPets();
  const { data } = await state.getState();

  if (data.token == null) {
    Header.showUpAuthModal();
  }

  if (data.nearByPets == null) {
    const noHay = document.createElement("h2");
    noHay.textContent = "no hay mascotas cerca tuyo";
    noHay.setAttribute("class", "subtitle is-2");
    return document.getElementById("card-container").appendChild(noHay);
  }

  data.nearByPets.forEach((pet) => {
    if (pet.isLost == false) {
      return;
    } else {
      const customCard = document.createElement("custom-card");
      customCard.setAttribute("editable", "false");
      customCard.setAttribute("name", pet.name);
      customCard.setAttribute("description", pet.description);
      customCard.setAttribute("img", pet.pictureURL);
      customCard.setAttribute("id", pet.objectID);
      customCard.setAttribute("lat", pet.lat);
      customCard.setAttribute("lng", pet.lng);
      div.appendChild(customCard);
    }
  });
}
