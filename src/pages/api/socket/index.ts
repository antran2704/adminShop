import type { NextApiRequest, NextApiResponse } from "next";
import httpProxy from "http-proxy";
import http from "http";

const proxy = httpProxy.createProxyServer();

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // console.log("req.url", req.url);

  if (req.url) {
    req.url = req.url.replace("/api/socket", "/socket.io/");
  }
  // console.log("req.url", req.url);

  // "http://localhost:3001/socket.io/?EIO=4&transport=polling&t=OxSfh5Y&sid=fe1GeTouSzsbiZdgAABZ"
  return new Promise<void>((resolve, reject) => {
    // proxy.web(req, res, {
    //   target: process.env.NEXT_PUBLIC_SOCKET_ENDPOINT,
    //   changeOrigin: true,
    //   selfHandleResponse: false,
    // });

    proxy.web(req, res, {
      target: process.env.NEXT_PUBLIC_SOCKET_ENDPOINT,
      changeOrigin: true,
      selfHandleResponse: false,
      ws: true,
    });

    proxy.once("proxyRes", () => {
      resolve;
    });

    proxy.once("error", reject);
  });
};
