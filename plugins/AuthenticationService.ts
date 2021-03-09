import qs from "qs";
import HttpService from "~/plugins/HttpService";
// @ts-ignore
import jwt_decode from "jwt-decode";
import { KEYCLOAK } from "~/config/url.json";
import KeycloakResponse from "~/interfaces/KeycloakResponse";

export default class AuthenticationService {
  private http: HttpService = new HttpService();

  /*
  logs the user in
   */
  login(credentials: {
    password: string;
    username: string;
    grant_type?: string;
    client_id?: string;
  }) {
    credentials.grant_type = "password";
    credentials.client_id = "project_a_web";

    const body = qs.stringify(credentials);

    return this.http.HTTP_AUTH.post<KeycloakResponse>(KEYCLOAK.GET_TOKEN, body);
  }

  async refresh() {
    const accessToken = localStorage.accessToken;
    const refreshToken = localStorage.refreshToken;
    // @ts-ignore
    const exp = jwt_decode(accessToken).exp;
    const ts = Math.round(new Date().getTime() / 1000);
    if (ts > exp) {
      const body = qs.stringify({
        refresh_token: refreshToken,
        client_id: "project_a_web",
        grant_type: "refresh_token",
      });

      const response = await this.http.HTTP_AUTH.post<KeycloakResponse>(
        KEYCLOAK.GET_TOKEN,
        body
      );
      localStorage.accessToken = response.data.data.access_token;
      localStorage.refreshToken = response.data.data.refresh_token;
    }
  }

  logout(refresh_token: string = "") {
    const body = qs.stringify({
      client_id: "project_a_web",
      refresh_token: refresh_token,
    });
    return this.http.HTTP_AUTH.post(
      KEYCLOAK.LOGOUT,
      body
    );
  }
}
