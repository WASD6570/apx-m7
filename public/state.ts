import { API_BASE_URL } from "./db";
import { goTo } from "./router";

const state = {
  data: {
    token: null,
  },
  apiURL: API_BASE_URL,
  init() {},
  getState() {
    return this;
  },
  async setState(state) {
    const { data } = this.getState();
    data.token = await state.token;
  },
  async logIn(
    email: string,
    password: string,
    newUser: boolean
  ): Promise<void> {
    let authPath = "auth/token";
    if (newUser) {
      authPath = "signin";
    }
    const rawToken = await fetch(`${API_BASE_URL}/${authPath}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const tokenReady = rawToken.json();
    this.setState({ token: tokenReady });
  },

  isAuthenticated(): boolean {
    const { data } = this.getState();
    if (data.token == null) {
      return false;
    } else true;
  },
};

// re largo el state :c

export { state };
