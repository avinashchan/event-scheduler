# Event Scheduler

The **Event Scheduler** is an application for creating and editing events via a calendar view interface.

This application is built with Angular 19 for the front end, NGXS for State Management, and Tailwind CSS for styling utilities. This application is segmented into different folders to narrow their usage, i.e., `/models` for defining reuseable application and service models, `/state` for containing shared application State, `/components` for rendering custom components.

In additional, this application uses Angular Material, which uses Angular CDK, lending to built in accessible features for compliant UI navigation.

For managing larger application, this layout would be further scoped into features for better organization:

- `/auth`
  - `/state`
  - `/services`
  - `/utils`
  - `/models`
  - `/components`

## Architecture

### Defaults

By default:

- The calendar view will default to the current day.
- There are no events in the mocked events list.
- Adding a new event will default to the current hour on the selected date.

### State - `/state`

State is managed via the NGXS library:

- The source of truth for the application data, removing side-effects (i.e., state mutations), stale data.
- Clients will always be working with the latest, unified data.
- Application updates between the View and Backend are handles via dispatching state Actions.

### Service - `/services`

The ##EventService## is used to handle all API calls to the backend services:

- Simulates mocked REST API calls.
- Manages all CRUD operations for event records from a backend store.
- **[TODO]**: implement a proper backend.

### Utils - `/utils`

Shared application utilities without any Angular dependencies.

- Utilities to handle mapping backend types to front end types (i.e., handle translation of **ISO Date String** -> **JavaScript Date Object**).

### Models - `/models`

Models (interfaces/types) for various data models (e.g., Event Details):

- Define strongly typing models and documentation for application and service models.

### Components - `/components`

The components in this application will handle all displaying of various UI elements on the page:

- Components are "dry" and contain no state or business logic.
- They will receive _inputs_ and emit _output_ for delegating business usage to the client.

#### Calendar View

This component component handles displaying a daily view of calendar events. This includes:

- Displays the current event for the inputted date.
- Rendering a 24 hour view/table to represent hourly time-slots
- Rendering of individual events throughout the day
- Handle stacking and position of events
- Emit event selection to handle client selection

#### Event Detail

This component is responsible for:

- Displaying the form fields for an "Event"
- Enables editing, updating and deleting of the event record.
- Launched as a dialog to bring the user into a focused context for a single event.

#### Button

This componentThis component handles reused button styles:

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
