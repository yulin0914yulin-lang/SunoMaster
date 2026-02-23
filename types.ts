export enum ElementType {
  BUTTON = 'BUTTON',
  INPUT = 'INPUT',
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  CARD = 'CARD',
  CONTAINER = 'CONTAINER',
  TABLE = 'TABLE'
}

export interface CanvasElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
  style: React.CSSProperties;
  className?: string; // Additional utility classes
  children?: string[]; // For container types (not fully implemented nesting in this prototype, sticking to flat for simplicity)
}

// Data structure for dragging items
export interface DragItem {
  type: ElementType;
}

export interface ComponentMetadata {
  type: ElementType;
  label: string;
  iconName: string;
  defaultWidth: number;
  defaultHeight: number;
  defaultContent: string;
  defaultStyle: React.CSSProperties;
}