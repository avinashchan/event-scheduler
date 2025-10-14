# Event Scheduler

The **Event Scheduler** is an application for creating and editing events via a calendar view interface.

## Architecture

### Models + Utils

Models (interfaces/types) for various data models (e.g., Event Details):

- Define strongly typing models and documentation for application and service models.
- Utilities to handle mapping backend types to front end types (i.e., handle translation of **ISO Date String** -> **JavaScript Date Object**).

### Services

The ##EventService## is used to handle all API calls to the backend services:

- Manages all CRUD operations for event records from a backend store.
- Maintaining state of the application.

### Components

The components in this application will handle all displaying of various UI elements on the page:

- Components are "dry" and contain no state or business logic.
- They will receive _inputs_ and emit _output_ for delegating business usage to the client.

#### Calendar View

The **Calendar View** component handles displaying a daily view of calendar events. This includes:

- Displays the current event for the inputted date.
- Rendering a 24 hour view/table to represent hourly time-slots
- Rendering of individual events throughout the day
- Handle stacking and position of events
- Emit event selection to handle client selection

#### Event Detail

#### Button

The **Button** component handles reused button styles:

- Minimize boilerplate styles across the application
- Abstract rendering of buttons based on various "types" (i.e., rounded, primary).

## Local Development

Ensure local dependencies, run:

```base
npm install
```

Start the local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`.

## Build and Deployment

To build the project for deployment (hosting), run:

```bash
ng build
```

This output application files will be output to the `dist/` directory.
