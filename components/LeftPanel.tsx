import React from 'react';
import { ElementType } from '../types';
import { COMPONENT_REGISTRY } from '../constants';
import * as Icons from 'lucide-react';

// Helper to get icon component dynamically
const IconRenderer = ({ name, className }: { name: string; className?: string }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const LucideIcon = (Icons as any)[name];
  if (!LucideIcon) return null;
  return <LucideIcon className={className} size={18} />;
};

const DraggableItem = ({ type }: { type: ElementType }) => {
  const meta = COMPONENT_REGISTRY[type];

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('application/react-dnd-type', type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="flex items-center gap-3 p-2.5 mb-2 bg-white border border-[#e0e0e6] rounded-[3px] cursor-grab hover:border-[#18a058] hover:text-[#18a058] hover:bg-[#f9fcf9] transition-all active:cursor-grabbing select-none group"
    >
      <div className="p-1.5 bg-[#f5f7fa] rounded-[3px] text-[#9ca3af] group-hover:text-[#18a058] group-hover:bg-[#e7f5ee] transition-colors">
        <IconRenderer name={meta.iconName} />
      </div>
      <span className="text-sm text-[#333639] group-hover:text-[#18a058]">{meta.label}</span>
    </div>
  );
};

export const LeftPanel: React.FC = () => {
  return (
    <div className="w-64 bg-white border-r border-[#efeff5] flex flex-col h-full shrink-0">
      <div className="p-4 border-b border-[#efeff5]">
        <h2 className="font-medium text-[#1f2225] flex items-center gap-2">
          <Icons.LayoutGrid size={18} className="text-[#18a058]" />
          Components
        </h2>
      </div>
      
      <div className="p-4 overflow-y-auto flex-1">
        <p className="text-xs font-medium text-[#9ca3af] uppercase mb-3 tracking-wider px-1">Elements</p>
        <div className="space-y-1">
          {Object.values(ElementType).map((type) => (
            <DraggableItem key={type} type={type} />
          ))}
        </div>
        
        <div className="mt-8 p-4 bg-[#e7f5ee] rounded-[3px] border border-[#18a058]/20">
          <p className="text-xs text-[#18a058] font-bold mb-1">Naive UI Theme</p>
          <p className="text-xs text-[#18a058]/80 leading-relaxed">
            Components are now styled to match the Naive UI design system guidelines (Green primary, 3px radius).
          </p>
        </div>
      </div>
    </div>
  );
};