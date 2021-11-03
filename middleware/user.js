import jwt_decode from "jwt-decode";

export default async function (context) {
  if (context.store.state?.user?.me?.email === undefined) {
    const userID = getUserID(context);
    await context.store.$accessor.user.fetchUser();
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
