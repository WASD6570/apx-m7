import { goTo } from "../../router";
import { state } from "../../state";
export function initMMR(containerEl: Element) {
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
  div.appendChild(document.createElement("custom-card"));
  containerEl.appendChild(style);
}
