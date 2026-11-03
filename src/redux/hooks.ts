import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "recharts/types/state/store";
import type { RootState } from "./base/store";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();