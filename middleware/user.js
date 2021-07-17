import jwt_decode from "jwt-decode";

export default async function (context){
    const keycloakID = getKeycloakID(context)
    const user = (await context.$axios.get('/user/' + keycloakID)).data;
    context.store.commit('user/setUser', user);
}


function getKeycloakID(context){
    const token = context.$auth.$storage._state["_token.keycloak"].split(' ')[1]
    const decoded = jwt_decode(token);
    return decoded.sub
};