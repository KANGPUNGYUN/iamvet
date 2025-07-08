import { createContext, useContext } from "react";
import { InputBoxGuideProps } from "./types";

export interface InputBoxContextType {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
  success?: boolean;
  guide?: InputBoxGuideProps;
}

export const InputBoxContext = createContext<InputBoxContextType | null>(null);

export const useInputBoxContext = () => {
  const context = useContext(InputBoxContext);
  if (!context) {
    throw new Error("InputBox components must be used within InputBox.Group");
  }
  return context;
};