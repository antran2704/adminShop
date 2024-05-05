const checkPermission = (
  permissions: string[],
  permission: string
): boolean => {
  if (!permissions.includes(permission)) return false;

  return true;
};

export { checkPermission };
