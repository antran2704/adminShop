import { io } from "socket.io-client";

const URL = process.env.SOCKET_ENDPOINT || "http://localhost:3001";

export const socket = io(URL);