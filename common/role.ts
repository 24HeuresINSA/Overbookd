
export function hasRole(context: any, roles: string[] | string) {
    const teams = getUser(context)?.team;
    if (teams === undefined) {
        return false
    }
    if (typeof roles == "string"){
        roles = [roles];
    }
    return roles.some(r=> teams.includes(r));
}

export function getUser(context: any) {
    return context.$store.state.user.data
}

