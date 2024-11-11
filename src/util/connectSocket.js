import { getCookie } from "./tokenHelpers";
import { io } from "socket.io-client";

const connectSocket = () => {
  const token = getCookie(import.meta.env.VITE_AUTH_TOKEN);
  let socket;
  if (token) {
    socket = io("http://localhost:3000/", {
      transports: ["websocket", "webpolling"],
      auth: { token },
    });
  }
  if (socket) {
    socket.on("connect", () => {
      console.log(socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("Disconnected from server:", reason);
    });

    socket.on("connect_error", (err) => {
      console.error("Connection failed:", err); // Xử lý lỗi kết nối
    });
  }
  return socket;
};

export default connectSocket;
