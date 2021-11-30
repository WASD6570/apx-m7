let API_BASE_URL: string;

// @ts-ignore
if (process.env.NODE_ENV == "production") {
  API_BASE_URL = "";
} else {
  API_BASE_URL = "http://localhost:3000";
}

export { API_BASE_URL };
