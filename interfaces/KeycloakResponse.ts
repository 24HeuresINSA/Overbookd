
export default interface KeycloakResponse {
    data:{
        access_token: string;
        refresh_token: string;
    }
}