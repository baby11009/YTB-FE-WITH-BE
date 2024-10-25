import { createContext, useContext } from "react";

export const AuthContext = createContext({
  user: undefined,
  setUser: () => {},
  isShowing: undefined,
  setIsShowing: () => {},
  openedMenu: false,
  setOpenedMenu: () => {},
});

export const useAuthContext = () => useContext(AuthContext);
