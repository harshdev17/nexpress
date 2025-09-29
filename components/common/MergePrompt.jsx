"use client";
import { useEffect } from 'react';

export default function MergePrompt({ isOpen, title = 'Keep your items?', description = 'We found items saved in your account. Do you want to merge them with your current items or replace them?', onMerge, onReplace, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    if (isOpen) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-6">{description}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button onClick={onMerge} className="px-4 py-3 bg-[#368899] text-white rounded-xl font-semibold hover:bg-[#2d7a8a]">Merge Items</button>
          <button onClick={onReplace} className="px-4 py-3 bg-white border-2 border-[#368899] text-[#368899] rounded-xl font-semibold hover:bg-[#368899] hover:text-white">Replace Current</button>
        </div>
        <button onClick={onClose} className="mt-4 w-full text-sm text-gray-500 hover:text-gray-700">Cancel</button>
      </div>
    </div>
  );
}


