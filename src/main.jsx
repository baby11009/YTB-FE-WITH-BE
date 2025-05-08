"use strict";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import RouteProvider from "./Router/RouteProvider.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "./Auth Provider/AuthProvider.jsx";
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <RouteProvider />
      </QueryClientProvider>
    </AuthProvider>
  </React.StrictMode>,
);
// ReactDOM.createRoot(document.getElementById("root")).render(
//   <AuthProvider>
//     <QueryClientProvider client={queryClient}>
//       <RouteProvider />
//     </QueryClientProvider>
//   </AuthProvider>,
// );
