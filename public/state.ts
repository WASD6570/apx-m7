import { API_BASE_URL } from "./db";
import { goTo } from "./router";

const LOCAL_STORAGE_ITEMS = "localData";

type data = {
  token?: string;
  lat?: number;
  lng?: number;
  email?: string;
};

const state = {
  data: {
    token: null,
    lat: null,
    lng: null,
    email: null,
  },
  apiURL: API_BASE_URL,
  init() {
    const localData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ITEMS));
    if (localData) {
      this.data = localData;
    }
  },
  async getState() {
    return await this;
  },
  async setState(state: data) {
    let { data } = await this.getState();
    data = state;
    localStorage.setItem(LOCAL_STORAGE_ITEMS, JSON.stringify(data));
  },
  async logIn(
    email: string,
    password: string,
    newUser: boolean
  ): Promise<void> {
    let { data } = await this.getState();

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
    if (rawToken.status === 400)
      throw new Error("ya existe un usuario con ese email");
    const tokenReady = await rawToken.json();
    data.token = tokenReady;
    data.email = email;
    this.setState(data);
  },

  async isAuthenticated(): Promise<boolean> {
    const { data } = await this.getState();
    if (data.token == null) {
      return false;
    } else true;
  },

  async isGeolocAvailable(): Promise<boolean> {
    const { data } = await this.getState();
    if ((await data.lat) == null && (await data.lng) == null) {
      return false;
    } else return true;
  },
};

// re largo el state :c

export { state };
