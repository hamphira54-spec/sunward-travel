import { sendGAEvent } from '@next/third-parties/google';
import type { EventName, BaseEventParams } from './types';

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export const event = (action: EventName, params: BaseEventParams = {}) => {
  if (typeof window !== 'undefined' && GA_MEASUREMENT_ID) {
    sendGAEvent('event', action, params);
  }
};
