import { goTo } from "../../router";
import { state } from "../../state";
import { startMap } from "../../lib/mapbox";
import Dropzone from "dropzone";

//import { myDropzone } from "../../lib/dropzone";
export async function initReportPet(containerEl: Element) {
  const div = document.createElement("div");
  div.setAttribute("class", "container");
  const style = document.createElement("style");
  style.setAttribute("class", "style");
  style.innerHTML = ``;

  if (await state.isGeolocAvailable()) {
    div.innerHTML =
      /*html*/
      `
    <custom-header></custom-header>
    <div class="upload-form container has-text-centered box">
    <form class="form">
    <label class="label">
    <h2 class="title is-5" style="margin: 20px;">Nombre</h2>
    <input type="text" name="nombre" placeholder="nombre" class="input" />
    </label>
    <label class="label">
    <h2 class="title is-5" style="margin: 20px;">Descripcion</h2>
    <textarea class="textarea" name="descripcion" placeholder="descripcion..."></textarea>
    </label>
    </form>
     <h2 class="title is-5" style="margin: 20px auto auto 10px;">¿Donde se perdio?</h2>
      <div class="search-form box field has-addons">
        <div class="control">
          <input name="q" type="search" class="q-input input" />
        </div>
        <div class="control">
          <a class="q-button button is-info">Buscar</a>
        </div>
        </div>
      <div id="map" style="width: 100%; height: 30vh"></div>
    <label class="a label">
      <h2>Foto</h2>
      <div
      class="foto-input image is-2by1"
      style="height: 150px; border: 1px solid"
      ></div>
    </label>
    <div class="field is-grouped box">
      <div class="control">
        <button type="submit" class="send button is-success">Send</button>
      </div>
      <div class="control">
        <button class="remove button is-danger">remove file</button>
      </div>
    </div>
    </div>
    `;
    containerEl.appendChild(div);
    containerEl.appendChild(style);

    setTimeout(() => {
      document.querySelector(".mapboxgl-ctrl-attrib-inner").remove();
      document.querySelector(".mapboxgl-ctrl-attrib-button").remove();
    }, 10);

    startMap();

    const myDropzone = new Dropzone(".foto-input", {
      url: "/falsa",
      autoProcessQueue: false,
      maxFiles: 1,
      dictDefaultMessage: "Drop files here to upload",
      thumbnailWidth: 150,
      thumbnailHeight: 150,
    });
    const obj = {
      name: "",
      bio: "",
      dataURL: "",
    };

    myDropzone.on("thumbnail", function (file) {
      obj.dataURL = file.dataURL;
      const c1 = document.querySelector(".dz-details");
      const c2 = document.querySelector(".dz-progress");
      const c3 = document.querySelector(".dz-error-message");
      const c4 = document.querySelector(".dz-success-mark");
      const c5 = document.querySelector(".dz-error-mark");

      const array = [c1, c2, c3, c4, c5];

      array.forEach((node) => {
        node.remove();
      });
    });
    const form = document.querySelector(".form");
    form.addEventListener("submit", async (e: any) => {
      e.preventDefault();
      obj.name = e.target.nombre.value;
      obj.bio = e.target.descripcion.value;

      console.log(obj);

      // const response = await fetch(`${API_BASE_URL}/profile`, {
      //   method: "post",
      //   headers: {
      //     "content-type": "application/json",
      //   },
      //   body: JSON.stringify(obj),
      // });
      // const parsedResponse = await response.json();
      // console.log(parsedResponse);

      // return parsedResponse;
    });

    const deletebttn = document.querySelector(".remove");
    deletebttn.addEventListener("click", (e) => {
      e.preventDefault();
      const parent = document.querySelectorAll(".dz-preview");
      parent.forEach((child) => {
        child.remove();
      });
    });
  } else {
    div.innerHTML =
      /*html*/
      `
    <custom-header></custom-header>
    <section class="home-page-body">
      <div class="container has-text-centered">
        <h3 class="title is-4">para poder reportar tu mascota perdida o ayudar a encontrar <br> 
        otras mascotas perdidas necesitamos conocer tu ubicacion
        </h3>
        <button class="geobutton button is-success is-large">Dar mi ubicacion</button>
      </div>
    </section>
  `;
    containerEl.appendChild(div);
    containerEl.appendChild(style);
    const geoBttn = document.querySelector(".geobutton");
    geoBttn.addEventListener("click", () => {
      geoBttn.textContent = "Listo!";
      navigator.geolocation.getCurrentPosition(
        async (geolocation) => {
          let { data } = await state.getState();
          data.lat = geolocation.coords.latitude;
          data.lng = geolocation.coords.longitude;
          state.setState(data);
          location.reload();
        },
        (error) => {
          console.log(error);
          window.alert("no pudimos obtener tu ubicacion");
        }
      );
    });
  }
}
