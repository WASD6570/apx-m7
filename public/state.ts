import { API_BASE_URL } from "./db";

const LOCAL_STORAGE_ITEMS = "localData";

type data = {
  token?: string;
  lat?: number;
  lng?: number;
  email?: string;
};

type petInfo = {
  name: string;
  description: string;
  lat: number;
  lng: number;
  petPicture: string;
};

const state = {
  data: {
    token: null,
    lat: null,
    lng: null,
    email: null,
    userPets: null,
    petInfo: {
      description: null,
      name: null,
      lat: null,
      lng: null,
      petPicture: null,
      isLost: null,
    },
    nearByPets: null,
  },
  apiURL: API_BASE_URL,
  init() {
    const localData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ITEMS));
    if (localData) {
      this.data = localData;
    }
  },
  async getState(): Promise<any> {
    return await this;
  },
  async setState(state: data): Promise<void> {
    let { data } = await this.getState();
    data = state;
    localStorage.setItem(LOCAL_STORAGE_ITEMS, JSON.stringify(data));
  },

  async setPetInfo(petInfo: petInfo): Promise<any> {
    let { data } = await this.getState();
    data.petInfo = petInfo;
    await this.setState(data);

    const response = await fetch(`${API_BASE_URL}/user/create-pet`, {
      method: "post",
      headers: {
        Authorization: `bearer ${data.token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(petInfo),
    });
    const parsedResponse = await response.json();
    return response.status;
  },

  async updatePetInfo(petInfo: petInfo): Promise<any> {
    let { data } = await this.getState();
    data.petInfo = petInfo;
    await this.setState(data);

    const response = await fetch(`${API_BASE_URL}/user/update-pet`, {
      method: "post",
      headers: {
        Authorization: `bearer ${data.token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(petInfo),
    });
    const parsedResponse = await response.json();
    return response.status;
  },

  async getNearByPets() {
    const { data } = await this.getState();

    const response = await fetch(
      `${API_BASE_URL}/pets-around?lat=${data.lat}&lng=${data.lng}`
    );
    const parsedResponse = await response.json();
    data.nearByPets = parsedResponse.hits;
    await this.setState(data);
    return parsedResponse;
  },

  async reportPetInfo(info) {
    let { data } = await this.getState();

    const body = {
      email: data.email,
      ...info,
    };

    const response = await fetch(`${API_BASE_URL}/user/send-report`, {
      method: "post",
      headers: {
        Authorization: `bearer ${data.token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const parsedResponse = await response.json();
    return response.status;
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

  async getUserPets() {
    const { data } = await this.getState();
    const response = await fetch(`${API_BASE_URL}/user/reported-pets`, {
      method: "GET",
      headers: {
        Authorization: `bearer ${data.token}`,
      },
    });
    const parsedResponse = await response.json();
    data.userPets = parsedResponse.pets;
    await this.setState(data);
    return parsedResponse;
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
