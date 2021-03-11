import { LocalScheme } from "~auth/runtime";
import axios from "axios";
import { KEYCLOAK } from "../config/url.json";

export default class KeycloakScheme extends LocalScheme {
  keycloakServer = axios.create({
    baseURL: KEYCLOAK.BASE_URL,
    headers: {
      "Access-Control-Allow-Credentials": true,
      // "Access-Control-Allow-Origin:": "*",
    },
  });

  // Override `fetchUser` method of `local` scheme
  async fetchUser(endpoint) {
    // Token is required but not available
    if (!this.check().valid) {
      return;
    }

    // User endpoint is disabled.
    if (!this.options.endpoints.user) {
      this.$auth.setUser({});
      return;
    }

    // Try to fetch user and then set
    return this.$auth
      .requestWith(this.name, endpoint, this.options.endpoints.user)
      .then((response) => {
        const user = getProp(response.data, this.options.user.property);

        // Transform the user object
        const customUser = {
          ...user,
          fullName: user.firstName + " " + user.lastName,
          roles: ["user"],
        };

        // Set the custom user
        // The `customUser` object will be accessible through `this.$auth.user`
        // Like `this.$auth.user.fullName` or `this.$auth.user.roles`
        this.$auth.setUser(customUser);

        return response;
      })
      .catch((error) => {
        this.$auth.callOnError(error, { method: "fetchUser" });
      });
  }

  async login(scheme, { username, password }) {
    const response = await this.keycloakServer.post(KEYCLOAK.TOKEN, {
      username,
      password,
      client_id: "project_a_web",
      grant_type: "password",
    });
    console.log(response);
  }
}
