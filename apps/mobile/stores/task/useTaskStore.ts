import { create } from "zustand";
import { TaskSlice, createTaskSlice } from "./useTaskSlice";

export const useTaskStore = create<TaskSlice>()((...args) => ({
  ...createTaskSlice(...args),
}));
