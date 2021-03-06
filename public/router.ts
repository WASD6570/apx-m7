import { initHomePage } from "./pages/home/index";
import { initMMR } from "./pages/mis-mascotas-reportadas/index";
import { initMCT } from "./pages/mascotas-cerca/index";
import { initReportPet } from "./pages/reportar-mascota/index";
import { initMisDatos } from "./pages/mis-datos/index";

function routeHandler(path: string, container: Element) {
  const routes = [
    {
      path: /\/home/,
      handler: (container) => {
        initHomePage(container);
      },
    },
    {
      path: /\/mis-mascotas-reportadas/,
      handler: (container) => {
        initMMR(container);
      },
    },
    {
      path: /\/mascotas-cerca-tuyo/,
      handler: (container) => {
        initMCT(container);
      },
    },
    {
      path: /\/reportar-mascota/,
      handler: (container) => {
        initReportPet(container);
      },
    },
    {
      path: /\/mis-datos/,
      handler: (container) => {
        initMisDatos(container);
      },
    },
  ];
  try {
    const contenedor = container.querySelectorAll(".container");
    const estilos = container.querySelectorAll(".style");
    if (contenedor.length > 0) {
      contenedor[0].remove();
      estilos[0].remove();
    }
  } catch (error) {}
  for (const r of routes) {
    if (r.path.test(path)) {
      r.handler(container);
    }
  }
}

export async function goTo(path: string) {
  const root = document.querySelector(".root");
  history.pushState({}, "", path);
  routeHandler(path, root);
}

export async function initRouter() {
  goTo("/home");
}
