import "./components/header/index";
import "./components/login/index";
import "./components/signin/index";
import "./components/modal-card/index";
import "./components/dashboard/index";
import "./components/card/index";
import "./components/edit-pet/index";
import "./components/report-pet-info/index";

import { initRouter } from "./router";
import { state } from "./state";
(function () {
  state.init();

  initRouter();
})();
