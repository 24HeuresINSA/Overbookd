// Authentication middleware
import http from "http";
import axios from "axios";

function login(context, credentials) {
  axios.create({
    // baseURL: KEYCLOAK.BASE_URL,
  });
}

export default function (context) {
  return {
    login,
  };
}
