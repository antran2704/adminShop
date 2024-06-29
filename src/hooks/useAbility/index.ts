import { useEffect, useState } from "react";
import { useAppSelector } from "~/store/hooks";

const useAbility = (roles: string[], permissions: string[]) => {
  const { infor, permission, role } = useAppSelector((state) => state.user);

  const [check, setCheck] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!infor._id || !permission || !role) return;

    const isCheck = roles.includes(role) && permissions.includes(permission);

    setCheck(isCheck);
    setLoading(false);
  }, [infor, permission, role]);

  return { isCan: check, abilityLoading: loading };
};

export default useAbility;
