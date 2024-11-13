import { createContext, useContext } from "react";

export const AuthContext = createContext({
  user: undefined,
  setUser: () => {},
  setRefetch: () => {},
  isShowing: undefined,
  setIsShowing: () => {},
  openedMenu: false,
  setOpenedMenu: () => {},
  setShowHover: () => {},
  handleCursorPositon: () => {},
});

export const useAuthContext = () => useContext(AuthContext);
