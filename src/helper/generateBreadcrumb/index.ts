import { IBreadcrumb } from "~/interface";

const generalBreadcrumbs = (node_id: string | null, data: IBreadcrumb) => {
  let breadcrumbs: string[] = [];
  if (!node_id) return breadcrumbs;

  const item = data[node_id];

  breadcrumbs = generalBreadcrumbs(item.parent_id, data);
  breadcrumbs.push(item._id as string);
  return breadcrumbs;
};

export default generalBreadcrumbs;