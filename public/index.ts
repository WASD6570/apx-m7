import "./components/button/index";
import "./components/hands/index";
import "./components/header/index";
import "./components/login/index";
import "./components/signin/index";
import "./components/modal-card/index";
import "./components/dashboard/index";

import { initRouter } from "./router";
import { state } from "./state";
(function () {
  state.init();

  initRouter();
})();
