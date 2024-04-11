import type { NextApiRequest, NextApiResponse } from "next";
import httpProxy from "http-proxy";

const proxy = httpProxy.createProxyServer();

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.url) {
    req.url = req.url.replace(/^\/api/, "");
  }

  return new Promise<void>((resolve, reject) => {
    proxy.web(req, res, {
      target: process.env.IMAGE_ENDPOINT,
      changeOrigin: true,
      selfHandleResponse: false,
    });

    proxy.once("proxyRes", () => {
      resolve;
    });

    proxy.once("error", reject);
  });
};
