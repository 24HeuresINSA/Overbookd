export const user = () => ({
    data: null,
})

export const mutations = {
    setUser(user, data) {
        user.data = data;
    }
}
