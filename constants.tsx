import { ElementType, ComponentMetadata } from './types';
import { Square, Type, Image as ImageIcon, CreditCard, Box, MousePointer2, Table } from 'lucide-react';
import React from 'react';

// Naive UI constants
const NAIVE_GREEN = '#18a058';
const NAIVE_BORDER = '#e0e0e6';
const NAIVE_TEXT = '#000000'; // Changed to black as requested
const NAIVE_RADIUS = '3px';

export const COMPONENT_REGISTRY: Record<ElementType, ComponentMetadata> = {
  [ElementType.BUTTON]: {
    type: ElementType.BUTTON,
    label: 'Button',
    iconName: 'MousePointer2',
    defaultWidth: 100,
    defaultHeight: 34,
    defaultContent: 'Button',
    defaultStyle: {
      backgroundColor: '#ffffff', // Default Naive button is white
      color: NAIVE_TEXT,
      borderRadius: NAIVE_RADIUS,
      fontSize: '14px',
      fontWeight: '400',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: `1px solid ${NAIVE_BORDER}`,
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    }
  },
  [ElementType.INPUT]: {
    type: ElementType.INPUT,
    label: 'Input',
    iconName: 'Type',
    defaultWidth: 240,
    defaultHeight: 34,
    defaultContent: '',
    defaultStyle: {
      backgroundColor: '#ffffff',
      color: NAIVE_TEXT,
      borderRadius: NAIVE_RADIUS,
      fontSize: '14px',
      border: `1px solid ${NAIVE_BORDER}`,
      paddingLeft: '12px',
      outline: 'none',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    }
  },
  [ElementType.TEXT]: {
    type: ElementType.TEXT,
    label: 'Text',
    iconName: 'Type',
    defaultWidth: 200,
    defaultHeight: 30,
    defaultContent: 'Text Content',
    defaultStyle: {
      color: NAIVE_TEXT,
      fontSize: '14px',
      fontWeight: '400',
      backgroundColor: 'transparent',
    }
  },
  [ElementType.IMAGE]: {
    type: ElementType.IMAGE,
    label: 'Image',
    iconName: 'Image',
    defaultWidth: 200,
    defaultHeight: 150,
    defaultContent: 'https://picsum.photos/200/150',
    defaultStyle: {
      objectFit: 'cover',
      borderRadius: NAIVE_RADIUS,
      backgroundColor: '#f5f5f5',
    }
  },
  [ElementType.CARD]: {
    type: ElementType.CARD,
    label: 'Card',
    iconName: 'CreditCard',
    defaultWidth: 300,
    defaultHeight: 200,
    defaultContent: '',
    defaultStyle: {
      backgroundColor: '#ffffff',
      borderRadius: NAIVE_RADIUS,
      boxShadow: '0 1px 2px -2px rgba(0, 0, 0, 0.08), 0 3px 6px 0 rgba(0, 0, 0, 0.06), 0 5px 12px 4px rgba(0, 0, 0, 0.04)', // Naive-like shadow
      border: `1px solid #efeff5`,
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      color: NAIVE_TEXT
    }
  },
  [ElementType.CONTAINER]: {
    type: ElementType.CONTAINER,
    label: 'Container',
    iconName: 'Square',
    defaultWidth: 100,
    defaultHeight: 100,
    defaultContent: '',
    defaultStyle: {
      backgroundColor: '#fafafc',
      border: `1px dashed ${NAIVE_BORDER}`,
      borderRadius: NAIVE_RADIUS,
    }
  },
  [ElementType.TABLE]: {
    type: ElementType.TABLE,
    label: 'Data Table',
    iconName: 'Table',
    defaultWidth: 600,
    defaultHeight: 200,
    defaultContent: JSON.stringify([
      { "Name": "John Brown", "Age": 32, "Address": "New York No. 1 Lake Park" },
      { "Name": "Jim Green", "Age": 42, "Address": "London No. 1 Lake Park" },
      { "Name": "Joe Black", "Age": 32, "Address": "Sidney No. 1 Lake Park" }
    ]),
    defaultStyle: {
      backgroundColor: '#ffffff',
      borderRadius: NAIVE_RADIUS,
      border: `1px solid ${NAIVE_BORDER}`,
      overflow: 'hidden',
      fontSize: '14px'
    }
  }
};

export const GRID_SIZE = 10; // Finer grid for Naive UI precision