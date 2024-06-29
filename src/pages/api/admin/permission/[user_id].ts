import type { NextApiRequest, NextApiResponse } from "next";
import httpProxy, { ProxyResCallback } from "http-proxy";
import { getCookies } from "cookies-next";
import { IKeyToken } from "~/interface";

const proxy = httpProxy.createProxyServer();

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.url) {
    req.url = req.url.replace(/^\/api/, "").replace("/permission", "");
  }

  const { accessToken, publicKey, apiKey } = getCookies({ req, res });

  if (accessToken && publicKey && apiKey) {
    req.headers.Authorization = `Bear ${accessToken}`;
    req.headers["public-key"] = `Key ${publicKey}`;
    req.headers["x-api-key"] = `Key ${apiKey}`;
  }

  return new Promise<void>((resolve, reject) => {
    proxy.web(req, res, {
      target: process.env.ENDPOINT_SERVER,
      changeOrigin: true,
      selfHandleResponse: false,
    });

    proxy.once("proxyRes", () => {
      resolve;
    });

    proxy.once("error", reject);
  });
};
