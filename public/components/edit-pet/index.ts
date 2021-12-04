import { initMap, initSearchForm, mapboxgl } from "../../lib/mapbox";
import Dropzone from "dropzone";
import { state } from "../../state";
import { goTo } from "../../router";

class EditPet extends HTMLElement {
  name?: string;
  description?: string;
  pictureURL?: string;
  id: any;
  fromEdit: string;
  lat?: number;
  lng?: number;
  constructor() {
    super();
  }
  async connectedCallback() {
    this.name = this.getAttribute("name");
    this.description = this.getAttribute("description");
    this.pictureURL = this.getAttribute("img");
    this.id = this.getAttribute("id");
    this.fromEdit = this.getAttribute("from-edit");
    this.lat = Number(this.getAttribute("lat"));
    this.lng = Number(this.getAttribute("lng"));

    this.render();
    if (this.fromEdit == "true") {
      return this.formForUPDATEpet();
    } else {
      return this.formForNEWPet();
    }
  }
  //temporal
  async formForNEWPet() {
    setTimeout(() => {
      document.querySelector(".mapboxgl-ctrl-attrib-inner").remove();
      document.querySelector(".mapboxgl-ctrl-attrib-button").remove();
    }, 10);

    const { data } = await state.getState();

    const obj = {
      name: null,
      description: null,
      petPicture: null,
      lat: data.lat,
      lng: data.lng,
      isLost: true,
    };

    (async function () {
      const map = await initMap();

      const marker = new mapboxgl.Marker({
        anchor: "center",
        draggable: false,
      });

      map.on("click", (e) => {
        const coordinates = e.lngLat;
        marker.setLngLat(coordinates).addTo(map);
        obj.lat = coordinates.lat;
        obj.lng = coordinates.lng;
      });

      initSearchForm(function (results) {
        try {
          const firstResult = results[0];

          if (firstResult == undefined) {
            return window.alert(`no encontre ninguna ubicacion con ese nombre`);
          }

          const [lng, lat] = firstResult.geometry.coordinates;

          marker.setLngLat([lng, lat]).addTo(map);
          map.setCenter(firstResult.geometry.coordinates);
          map.setZoom(14);
          obj.lat = lat;
          obj.lng = lng;
        } catch (error) {
          console.log(error.message);
        }
      });
    })();

    const myDropzone = new Dropzone(".foto-input", {
      url: "/falsa",
      autoProcessQueue: false,
      maxFiles: 1,
      dictDefaultMessage: "Drop files here to upload",
      thumbnailWidth: 150,
      thumbnailHeight: 150,
    });

    myDropzone.on("thumbnail", function (file) {
      obj.petPicture = file.dataURL;
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
      const sendButton = document.querySelector(".send");

      obj.name = e.target.nombre.value;
      obj.description = e.target.descripcion.value;

      for (const property in obj) {
        if (obj[property] == null || obj[property] == "") {
          return window.alert(`Porfavor completa ${property}`);
        }
      }
      sendButton.setAttribute("class", "send button is-success is-loading");
      state.setPetInfo(obj).then((res) => {
        if (res === 200) {
          sendButton.setAttribute("class", "send button is-success");
          sendButton.textContent = "OK!";
          goTo("/mis-mascotas-reportadas");
        } else {
          sendButton.setAttribute("class", "send button is-danger is-light");
          sendButton.setAttribute("disabled", "");
          window.alert(
            "tuvimos un problema al reportar tu mascota, recargá la pagina :("
          );
        }
      });
    });

    const deletebttn = document.querySelector(".remove");
    deletebttn.addEventListener("click", (e) => {
      e.preventDefault();
      const parent = document.querySelectorAll(".dz-preview");
      parent.forEach((child) => {
        child.remove();
      });
    });
  }
  //temporal
  async formForUPDATEpet() {
    setTimeout(() => {
      document.querySelector(".mapboxgl-ctrl-attrib-inner").remove();
      document.querySelector(".mapboxgl-ctrl-attrib-button").remove();
    }, 10);

    const obj = {
      name: this.name,
      description: this.description,
      petPicture: this.pictureURL,
      lat: this.lat,
      lng: this.lng,
      isLost: true,
      petId: this.id.split("editpet")[1],
    };

    (async () => {
      const map = await initMap([this.lng, this.lat]);

      const marker = new mapboxgl.Marker({
        anchor: "center",
        draggable: false,
      });

      map.on("click", (e) => {
        const coordinates = e.lngLat;
        marker.setLngLat(coordinates).addTo(map);
        obj.lat = coordinates.lat;
        obj.lng = coordinates.lng;
      });

      initSearchForm(function (results) {
        try {
          const firstResult = results[0];

          if (firstResult == undefined) {
            return window.alert(`no encontre ninguna ubicacion con ese nombre`);
          }

          const [lng, lat] = firstResult.geometry.coordinates;

          marker.setLngLat([lng, lat]).addTo(map);
          map.setCenter(firstResult.geometry.coordinates);
          map.setZoom(14);
          obj.lat = lat;
          obj.lng = lng;
        } catch (error) {
          console.log(error.message);
        }
      });
    })();

    const myDropzone = new Dropzone(`#dz-${this.id}`, {
      url: "/falsa",
      autoProcessQueue: false,
      maxFiles: 1,
      dictDefaultMessage: "Drop files here to upload",
      thumbnailWidth: 150,
      thumbnailHeight: 150,
    });

    myDropzone.on("thumbnail", function (file) {
      obj.petPicture = file.dataURL;
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

    const reportFound = document.querySelector(".found");
    reportFound.addEventListener("click", async (e) => {
      e.preventDefault();
      obj.isLost = false;
      state.updatePetInfo(obj).then((res) => {
        if (res === 200) {
          reportFound.setAttribute("class", "found button is-warning");
          reportFound.textContent = "OK!";
          goTo("/mis-mascotas-reportadas");
        } else {
          reportFound.setAttribute("class", "found button is-danger is-light");
          reportFound.setAttribute("disabled", "");
          window.alert(
            "tuvimos un problema al actualizar tu mascota, recargá la pagina :("
          );
        }
      });
    });

    const form = document.querySelector(".form");
    form.addEventListener("submit", async (e: any) => {
      e.preventDefault();
      const sendButton = document.querySelector(".send");

      obj.name = e.target.nombre.value;
      obj.description = e.target.descripcion.value;

      const reportFound = document.querySelector(".found");
      reportFound.addEventListener("click", async () => {
        obj.isLost = false;

        state.updatePetInfo(obj).then((res) => {
          if (res === 200) {
            reportFound.setAttribute("class", "found button is-warning");
            reportFound.textContent = "OK!";
            goTo("/mis-mascotas-reportadas");
          } else {
            reportFound.setAttribute(
              "class",
              "found button is-danger is-light"
            );
            reportFound.setAttribute("disabled", "");
            window.alert(
              "tuvimos un problema al actualizar tu mascota, recargá la pagina :("
            );
          }
        });
      });

      sendButton.setAttribute("class", "send button is-success is-loading");
      state.updatePetInfo(obj).then((res) => {
        if (res === 200) {
          sendButton.setAttribute("class", "send button is-success");
          sendButton.textContent = "OK!";
          goTo("/mis-mascotas-reportadas");
        } else {
          sendButton.setAttribute("class", "send button is-danger is-light");
          sendButton.setAttribute("disabled", "");
          window.alert(
            "tuvimos un problema al actualizar tu mascota, recargá la pagina :("
          );
        }
      });
    });

    const deletebttn = document.querySelector(".remove");
    deletebttn.addEventListener("click", (e) => {
      e.preventDefault();
      const parent = document.querySelectorAll(".dz-preview");
      parent.forEach((child) => {
        child.remove();
      });
    });
  }

  render() {
    Dropzone.autoDiscover = false;
    const container = document.createElement("section");
    if (this.fromEdit == "true") {
      container.innerHTML =
        /*html*/
        `
        <div class="upload-form container has-text-centered box">
        <form class="form">
        <label class="label">
        <h2 class="title is-5" style="margin: 20px;">Nombre</h2>
        <input type="text" name="nombre" placeholder="nombre" class="input" value="${
          this.name
        }" />
        </label>
        <label class="label">
        <h2 class="title is-5" style="margin: 20px;">Descripcion</h2>
        <textarea class="textarea" name="descripcion" placeholder="descripcion...">${this.description.toString()}</textarea>
        </label>
        <h2 class="title is-5" style="margin: 20px auto auto 10px;">¿Donde se perdio?</h2>
        <p class="subtitle is-6" style="margin: 5px;">
        Hace click cerca de la zona donde se perdio
        </p>
        
        <div class="search-form box field has-addons">
        <div class="control">
              <input name="q" type="search" class="q-input input" />
              </div>
              <div class="control">
              <a class="q-button button is-info">Buscar</a>
              </div>
            </div>
            <div id="map" style="width: 100%; height: 30vh"></div>
            <div class="card-image">
                <figure class="image is-2by2">
                  <img
                    src="${this.pictureURL}"
                    alt=""
                  />
                </figure>
              </div>
        <label class="a label">
        <h2 class="title is-5">Si esta foto es correcta no hace falta que subas una nueva</h2>
        <h2 class="subtitle is-6">haciendo click en el recuadro de abajo podes subir una nueva foto</h2>
        <div
        class="foto-input image is-2by1" id="dz-${this.id}"
        style="height: 150px; border: 1px solid"
        ></div>
        </label>
        <div class="field is-grouped box">
        <div class="control">
        <button type="submit" class="send button is-success">Enviar</button>
        </div>
        <div class="control">
        <button class="remove button is-danger">borrar nueva foto</button>
        </div>
        </div>
        <div class="control">
        <button class="found button is-warning">reportar como encontrado</button>
        </div>
        </form>
        </div>
      `;
      const customEditPet = document.getElementById(this.id);
      customEditPet.appendChild(container);
    } else {
      container.innerHTML =
        /*html*/
        `
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
          <h2 class="title is-5" style="margin: 20px auto auto 10px;">¿Donde se perdio?</h2>
          <p class="subtitle is-6" style="margin: 5px;">
          Podes buscar como referencia un lugar conocido o hacer click 
          en el mapa para establecer una ubicacion
          </p>
          
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
          class="foto-input image is-2by1" id="dz-0"
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
          </form>
          </div>
        `;
      const customEditPet = document.getElementById(this.id);
      customEditPet.appendChild(container);
    }
  }
}

customElements.define("custom-editpet", EditPet);
