export default async function (context) {
  if (context.store.state?.user?.me?.email === undefined) {
    await context.store.$accessor.user.fetchUser();
  }
}
