interface OverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Overlay({ isOpen, onClose }: OverlayProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/30 z-30 md:hidden"
      onClick={onClose}
      aria-hidden="true"
    />
  );
} 