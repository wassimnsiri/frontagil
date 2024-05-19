import React, { ReactNode } from 'react';
import { FaTimes } from 'react-icons/fa';

// Define the props type interface for the CustomModal
interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode; // Using ReactNode to accommodate any React elements
}

const CustomModal: React.FC<CustomModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray dark:bg-black-800 p-6 rounded-lg shadow-lg relative max-w-md w-full">
        <button
          className="absolute top-2 right-2 text-gray-700 dark:text-gray-200"
          onClick={onClose}
        >
          <FaTimes size={20} />
        </button>
        {children}
      </div>
    </div>
  );
};

export default CustomModal;
