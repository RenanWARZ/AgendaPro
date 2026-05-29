import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { Buffer } from 'buffer';
import process from 'process';

(window as any).Buffer = Buffer;
(window as any).process = process;
(window as any).global = window;

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
