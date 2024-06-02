import { NuxtContext } from "./nuxt-context";
import { pages } from "../utils/pages/pages-list";

export default async function (context: NuxtContext) {
  const pagePath = context.route.path;
  const currentPage = pages.find((page) => page.to.startsWith(pagePath));
  if (!currentPage?.permission) return;

  const hasPermission = context.store.$accessor.user.can(
    currentPage.permission,
  );
  if (!hasPermission) context.redirect("/");
}
