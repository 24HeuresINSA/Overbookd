import { pages } from "../utils/pages/pagesList";

export default async function (context: any) {
  const pagePath = context.route.path;
  const currentPage = pages.find((page) => page.to.startsWith(pagePath));
  if (!currentPage?.permission) return;

  const hasPermission = context.store.$accessor.user.hasPermission(
    currentPage.permission
  );
  if (!hasPermission) context.redirect("/");
}
