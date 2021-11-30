import { goTo } from "../../router";
import { state } from "../../state";
export function initHomePage(containerEl: Element) {
  const div = document.createElement("div");
  div.setAttribute("class", "container");
  const style = document.createElement("style");
  style.setAttribute("class", "style");
  style.innerHTML = ``;
  const header = document.createElement("custom-header");
  containerEl.appendChild(div);
  div.appendChild(header);
  containerEl.appendChild(style);
}
