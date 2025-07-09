import { createContext, useContext } from "react";

export interface SelectBoxContextType {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
  success?: boolean;
}

export const SelectBoxContext = createContext<SelectBoxContextType | null>(null);

export const useSelectBoxContext = () => {
  const context = useContext(SelectBoxContext);
  if (!context) {
    throw new Error("SelectBox components must be used within SelectBox.Group");
  }
  return context;
};