export default async function (context) {
  const config = await context.$axios.get("/config");
  context.store.commit("config/setConfig", config);
}
