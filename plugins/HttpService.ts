import axios from "axios";
import qs from "qs";
// @ts-ignore
import jwt_decode from "jwt-decode";
import {HOST, KEYCLOAK} from "~/config/url.json";

export default class HttpService {
  public HTTP_AUTH = axios.create({
    baseURL: KEYCLOAK.BASE_URL,
  });

  public HTTP_tmp = axios.create({
    // For json-server interaction
    // baseURL: `http://localhost:3000/`
    // For back-end interaction
    baseURL: HOST,
  });

  constructor() {
    this.setupInterceptor();
  }

  refreshToken() {
    const refreshToken = localStorage.refreshToken;
    const body = qs.stringify({
      refresh_token: refreshToken,
      client_id: "project_a_web",
      grant_type: "refresh_token",
    });
    return this.HTTP_AUTH.post(
      KEYCLOAK.GET_TOKEN,
      body
    );
  };

  setupInterceptor() {
    this.HTTP_tmp.interceptors.request.use(
      (config) => {
        if (!config.headers.Authorization) {
          const token = localStorage.accessToken;
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      () => {
        return Promise.reject();
      }
    );

    this.HTTP_tmp.interceptors.response.use(undefined, (error) => {
      let ogRequest = error.config;
      if (error.response.status === 403 && !ogRequest._retry) {
        ogRequest._retry = true;
        // @ts-ignore
        const exp = jwt_decode(localStorage.accessToken).exp;
        const ts = Math.round(new Date().getTime() / 1000);
        if (ts > exp) {
          return this.refreshToken()
            .then((res) => {
              const accessToken = res.data.access_token;
              const refreshToken = res.data.refresh_token;
              localStorage.accessToken = accessToken;
              localStorage.refreshToken = refreshToken;
              ogRequest.headers.Authorization = `Bearer ${accessToken}`;
              return this.HTTP_tmp(ogRequest);
            })
            .catch(() => {
              localStorage.clear();
              // window.location = "/login";
            });
        }
      }
      return Promise.reject(error);
    });
  }
}
