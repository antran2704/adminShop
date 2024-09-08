interface IUserInfor {
  _id: string;
  name: string;
  email: string;
  avartar: string | null;
}

interface IUpdateAccount {
  name: string;
  email: string;
  avartar: string | null;
}

interface IChangePassword {
  password: string;
  newPassword: string;
  reNewPassword: string;
}

export type { IUserInfor, IUpdateAccount, IChangePassword };
