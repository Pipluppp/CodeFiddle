import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../lib/utils";

export interface ContextMenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
  separator?: boolean;
}

interface ContextMenuProps {
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, items, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x, y });

  // Handle clicking outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // Adjust position to prevent overflow (Boundary Detection)
  useEffect(() => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      let newX = x;
      let newY = y;

      // Check right edge
      if (x + rect.width > window.innerWidth) {
        newX = x - rect.width;
      }
      // Check bottom edge
      if (y + rect.height > window.innerHeight) {
        newY = y - rect.height;
      }

      setPosition({ x: newX, y: newY });
    }
  }, [x, y]);

  // Use Portal to ensure it renders on top of everything (z-index 50)
  return createPortal(
    <div
      ref={menuRef}
      className="fixed z-50 min-w-[180px] py-1 bg-[#3C3C3C] rounded-md shadow-xl text-[13px] text-jb-text font-sans"
      style={{ top: position.y, left: position.x }}
      onContextMenu={(e) => e.preventDefault()} // Prevent native context menu on the custom menu
    >
      {items.map((item, index) => {
        if (item.separator) {
          return <div key={index} className="h-[1px] bg-[#454545] my-1 mx-1" />;
        }

        return (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              item.onClick();
              onClose();
            }}
            className={cn(
              "w-[calc(100%-8px)] mx-1 flex items-center gap-2 px-2 py-1 text-left cursor-default select-none transition-colors rounded-[4px]",
              "hover:bg-[#04395E] hover:text-white focus:outline-none",
              item.danger && "text-red-400 hover:text-white"
            )}
          >
            {item.icon && <span className="w-4 h-4 opacity-80">{item.icon}</span>}
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>,
    document.body
  );
};
