export function Modal({ children, isOpen, onClose }: any) {
  if (!isOpen) return null;
  return <div onClick={onClose}>{children}</div>;
}