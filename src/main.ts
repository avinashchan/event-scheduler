import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/pages/calendar/app.config';
import { AppComponent } from './app/pages/calendar/app.component';

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
