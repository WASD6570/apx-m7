import { goTo } from "../../router";
import { state } from "../../state";
export async function initMMR(containerEl: Element) {
  const div = document.createElement("div");
  div.setAttribute("class", "container");
  const style = document.createElement("style");
  style.setAttribute("class", "style");
  style.innerHTML = ``;
  div.innerHTML =
    /*html*/
    `
  <custom-header></custom-header>
  `;
  containerEl.appendChild(div);
  containerEl.appendChild(style);

  await state.getUserPets();
  const { data } = await state.getState();
  data.userPets.forEach((pet) => {
    if (pet.isLost == false) {
      return;
    } else {
      const customCard = document.createElement("custom-card");
      customCard.setAttribute("name", pet.name);
      customCard.setAttribute("description", pet.description);
      customCard.setAttribute("img", pet.pictureURL);
      customCard.setAttribute("id", pet.id);
      customCard.setAttribute("lat", pet.lat);
      customCard.setAttribute("lng", pet.lng);
      div.appendChild(customCard);
    }
  });
}
