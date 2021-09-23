import {RefreshScheme} from "~auth/runtime";
import axios from "axios";
import {KEYCLOAK} from "../config/url.json";
import qs from "qs";

export default class KeycloakScheme extends RefreshScheme {
  async login({ username, password }) {
    const data = qs.stringify({
      // keycloak accepts www-urlencoded-form and not JSON
      username,
      password,
      client_id: "project_a_web",
      grant_type: "password",
    });

    const response = await axios.post(
      process.env.BASE_URL_KEYCLOAK + KEYCLOAK.TOKEN,
      data
    );
    if (response.status !== 200 && response.data === null) {
      // wrong credentials
      throw Error;
    }
    // correct credentials
    await this.setUserToken(
      response.data.access_token,
      response.data.refresh_token
    );
    this.requestHandler.initializeRequestInterceptor(
      this.options.endpoints.refresh.url
    );
    this.$auth.$storage.setState("loggedIn", true); // set state to let nuxt know user is logged in
  }

  async refreshTokens() {
    const refreshTokenStatus = this.refreshToken.status(); // session expired
    if (refreshTokenStatus.expired()) {
      this.$auth.reset();
    }

    const data = qs.stringify({
      refresh_token: this.refreshToken.get(),
      client_id: "project_a_web",
      grant_type: "refresh_token",
    });
    const response = await axios.post(
        (process.env.BASE_URL_KEYCLOAK || "http://localhost:8080/") +
        KEYCLOAK.TOKEN,
        data
    );
    this.updateTokens(response, {isRefreshing: true});
    return response;
  }
}
