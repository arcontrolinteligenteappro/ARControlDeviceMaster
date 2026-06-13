export type KeyAction = 'tap' | 'swipe';

export interface KeyMapping {
  key: string;
  x: number;
  y: number;
  type: KeyAction;
  // Para 'swipe', se necesitan coordenadas de inicio y fin
  startX?: number;
  startY?: number;
  endX?: number;
  endY?: number;
  // El tiempo que dura un 'tap' o un 'swipe' en milisegundos
  duration?: number;
}
