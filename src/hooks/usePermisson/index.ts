import { useEffect, useState } from "react";
import { checkPermission } from "~/helper/auth";
import { useAppSelector } from "~/store/hooks";

const usePermission = (permission: string) => {
  const { infor, permissions } = useAppSelector((state) => state.user);

  const [check, setCheck] = useState<boolean>(false);

  useEffect(() => {
    if (!infor._id || !permissions.length) return;

    const isCheck = checkPermission(permissions, permission);

    setCheck(isCheck);
  }, [infor, permissions]);

  return check;
};

export default usePermission;
