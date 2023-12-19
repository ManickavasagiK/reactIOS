import React, { createContext, useState } from "react";

export const AppContext = createContext({});

export const AppProvider = (props) => {
  const [context, updateContext] = useState({});
  return (
    <AppContext.Provider
      value={{ updateContext: updateContext, context: context }}
    >
      {props.children}
    </AppContext.Provider>
  );
};
