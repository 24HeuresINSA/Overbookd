const pages = [
  {
    name: "calendar",
    permission: "validated-user",
  },
  {
    name: "humans",
    permission: "hard",
  },
  {
    name: "fa",
    permission: "admin",
  },
  {
    name: "fa-fa",
    permission: "hard",
  },
  {
    name: "assignment-orga-task",
    permission: "can-affect",
  },
];

export default async function (context: any) {
  const pageName = context.route.name;
  const currentPage = pages.find((page) => page.name === pageName);
  if (!currentPage) return;

  const hasPermission = context.store.$accessor.user.hasPermission(
    currentPage.permission
  );
  if (!hasPermission) context.redirect("/");
}
