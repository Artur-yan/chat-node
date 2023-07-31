import { writable } from 'svelte/store';
import { defaultSettings } from './models';

export const alert = writable();

export const state = writable();

export const currentBot = writable();
