import { createContext, useContext, useState } from "react";

export const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

export default function UserProvider({children}){

    let [data, setData] = useState(undefined);

    return <UserContext.Provider value={{
        user : data, setUser : setData
    }}>
        {children}
    </UserContext.Provider>
}
