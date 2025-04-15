import { createContext, useContext } from "react";

export const AuthContext = createContext({
  user: undefined,
  setUser: Function,
  notReadNotiCount: Number,
  setNotReadNotiCount: Function,
  authTokenRef: undefined,
  socket: undefined,
  isShowing: undefined,
  setIsShowing: Function,
  openedMenu: false,
  setOpenedMenu: Function,
  setShowHover: Function,
  handleCursorPositon: Function,
  modalContainerRef: undefined,
  fetchingState: undefined,
  setFetchingState: Function,
  addToaster: Function,
});

export const useAuthContext = () => useContext(AuthContext);
