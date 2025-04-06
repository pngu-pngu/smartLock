import { createContext } from "react";

const UserContext = createContext({
  user: {
    givenName: ""
  },
  setUser: () => {}
});

export default UserContext;