interface IAuthLocal {
  accessToken: string;
  refreshToken: string;
  apiKey: string;
  publicKey: string;
}

type ILogin = Pick<IAuthLocal, "apiKey" | "publicKey"> & {
  accessToken: {
    value: string;
    exp: number;
  };
  refreshToken: {
    value: string;
    exp: number;
  };
};

export type { IAuthLocal, ILogin };
