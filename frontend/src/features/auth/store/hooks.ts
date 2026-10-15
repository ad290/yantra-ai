import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../app/store";

export const useAuthDispatch = useDispatch.withTypes<AppDispatch>();
export const useAuthSelector = useSelector.withTypes<RootState>();