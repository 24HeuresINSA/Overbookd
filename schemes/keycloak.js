import { LocalScheme } from "~auth/runtime";
import axios from "axios";
import { KEYCLOAK } from "../config/url.json";
import qs from "qs";

export default class KeycloakScheme extends LocalScheme {
  keycloakServer = axios.create({
    baseURL: KEYCLOAK.BASE_URL,
    headers: {
      // "Access-Control-Allow-Credentials": true,
      // "Access-Control-Allow-Origin:": "*",
    },
  });

  async login({ username, password }) {
    const data = qs.stringify({
      username,
      password,
      client_id: "project_a_web",
      grant_type: "password",
    });
    const response = await this.keycloakServer.post(KEYCLOAK.TOKEN, data);
    if (response.status !== 200) {
      // wrong credentials
      throw Error;
    }
    // correct credentials
    await this.setUserToken(
      response.data.access_token,
      response.data.refresh_token
    );

    this.initializeRequestInterceptor();
    this.$auth.$storage.setState("loggedIn", true); // set state to let nuxt know user is logged in
  }
}
