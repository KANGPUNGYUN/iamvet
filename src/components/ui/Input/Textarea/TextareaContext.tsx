import { createContext, useContext } from "react";

export interface TextareaContextType {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
  success?: boolean;
}

export const TextareaContext = createContext<TextareaContextType | null>(null);

export const useTextareaContext = () => {
  const context = useContext(TextareaContext);
  if (!context) {
    throw new Error("Textarea components must be used within Textarea.Group");
  }
  return context;
};
