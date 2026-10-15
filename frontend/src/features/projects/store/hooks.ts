import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../app/store";
export const useProjectDispatch = useDispatch.withTypes<AppDispatch>();
export const useProjectSelector = useSelector.withTypes<RootState>();