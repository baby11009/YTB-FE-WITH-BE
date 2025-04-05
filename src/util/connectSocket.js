import { getCookie } from "./tokenHelpers";
import { io } from "socket.io-client";

const connectSocket = () => {
  console.log("connecting");
  const token = getCookie(import.meta.env.VITE_AUTH_TOKEN);

  let socket = null;

  if (token) {
    socket = io("http://localhost:3000/", {
      transports: ["websocket", "webpolling"],
      auth: { token },
    });

    socket.on("connect", () => {
      console.log("Connected:", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("Disconnected from server:", reason);
    });

    socket.on("connect_error", (err) => {
      console.error("Connection failed:", err);
      // Handle reconnection or display error to the user
    });
  } else {
    console.log("No token found. Cannot connect to socket.");
  }

  // Return the socket instance for further use
  return socket;
};

export default connectSocket;
