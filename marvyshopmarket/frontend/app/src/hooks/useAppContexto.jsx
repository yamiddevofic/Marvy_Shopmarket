import { useContext } from "react";
import AppContext from "../App";

export  const useAppContext = () => {
    return useContext(AppContext);
};