interface IAuthLocal {
  accessToken: string;
  refreshToken: string;
  apiKey: string;
  publicKey: string;
}

interface ILogin {
  email: string;
  password: string;
}

type IResponseLogin = Pick<IAuthLocal, "apiKey" | "publicKey"> & {
  accessToken: {
    value: string;
    exp: number;
  };
  refreshToken: {
    value: string;
    exp: number;
  };
};

export type { IAuthLocal, IResponseLogin, ILogin };
