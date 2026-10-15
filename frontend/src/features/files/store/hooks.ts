import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../app/store";
export const useFileDispatch = useDispatch.withTypes<AppDispatch>();
export const useFileSelector = useSelector.withTypes<RootState>();