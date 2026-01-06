'use client';

export default function Modal({
                                  isOpen,
                                  onClose,
                                  title,
                                  children,
                              }: {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500"
                >
                    ✕
                </button>

                {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
                {children}
            </div>
        </div>
    );
}
