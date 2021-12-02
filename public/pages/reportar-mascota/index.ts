import { goTo } from "../../router";
import { state } from "../../state";
import { initMap, initSearchForm, mapboxgl } from "../../lib/mapbox";
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
    </form>
    </div>
    `;
    containerEl.appendChild(div);
    containerEl.appendChild(style);

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
    };

    (async function () {
      const map = await initMap();

      const marker = new mapboxgl.Marker({
        anchor: "center",
        draggable: false,
      });

      map.on("click", (e) => {
        const coordinates = e.lngLat;
        console.log("Lng:", coordinates.lng, "Lat:", coordinates.lat);
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
      obj.name = e.target.nombre.value;
      obj.description = e.target.descripcion.value;

      for (const property in obj) {
        if (obj[property] == null || obj[property] == "") {
          return window.alert(`Porfavor completa ${property}`);
        }
      }

      console.log(obj);

      // const response = await fetch(`${API_BASE_URL}/report-pet`, {
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
