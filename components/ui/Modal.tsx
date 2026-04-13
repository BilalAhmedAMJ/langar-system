interface ModalProps {
  children: React.ReactNode;
}

export default function Modal({
  children,
}: ModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-4 md:p-8 rounded-xl w-full max-w-md">
        {children}
      </div>
    </div>
  );
}