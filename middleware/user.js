import jwt_decode from "jwt-decode";

export default async function (context) {
  const userID = getUserID(context);
  if (userID) {
    const user = (await context.$axios.get("/user/" + userID)).data;
    context.store.commit("user/SET_USER", user);
  }
}

/**
 * @param context
 */
export function getUserID(context) {
  if (context.$auth.loggedIn) {
    const token = context.$auth.$storage._state["_token.local"].split(" ")[1];
    const decoded = jwt_decode(token);
    return decoded.user_id;
  }
}
