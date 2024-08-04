import { useRouter } from "next/router";
import { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { loginReducer, setPermisson } from "~/store/slice/user";

import { getPermission, getInfoUser } from "~/api-client";

import SpinLoading from "~/components/Loading/SpinLoading";
import { IResponse, IUserInfor } from "~/interface";

interface Props {
  children: JSX.Element;
}

const DefaultLayout = ({ children }: Props) => {
  const router = useRouter();

  const { infor } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState<boolean>(!infor._id);

  const handleGetPermission = async (userId: string) => {
    if (!userId) return;

    await getPermission(userId)
      .then(({ status, payload }) => {
        if (status === 200) {
          dispatch(setPermisson(payload));
        }
      })
      .catch((err) => err);
  };

  const checkAuth = async () => {
    setLoading(true);

    try {
      const { status, payload }: IResponse<IUserInfor> = await getInfoUser();

      if (status === 200) {
        dispatch(loginReducer(payload));
        setLoading(false);
      }
    } catch (err) {
      await router.push("/login");
    }
  };

  useEffect(() => {
    if (!infor._id) {
      checkAuth();
    }
  }, [infor._id]);

  useEffect(() => {
    if (!infor._id) return;

    handleGetPermission(infor._id);
  }, [infor]);

  if (loading) {
    return (
      <div className="fixed top-0 left-0 right-0 bottom-0">
        <SpinLoading className="text-3xl" />
      </div>
    );
  }

  return (
    <main className="flex items-start justify-between bg-[#f9fafb] dark:bg-[#111827] transition-all ease-linear duration-100">
      {children}
    </main>
  );
};

export default DefaultLayout;
