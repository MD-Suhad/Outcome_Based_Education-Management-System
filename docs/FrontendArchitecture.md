# OBE-MS Frontend Architecture

The Angular 20 client application is built with modern structure guidelines: Standalone components, Reactive forms, Signals state management, and Tailwind/Material design system.

## Folder Directory Structure

```
frontend/
├── src/
│   ├── main.ts               # Application bootstrapping
│   ├── index.html            # Main host document
│   ├── styles.scss           # Global styles and Material typography
│   └── app/
│       ├── app.ts            # Root application component
│       ├── app.config.ts     # Global application providers (Routing, HTTP client, Animations)
│       ├── app.routes.ts     # Definition of application navigation routes
│       ├── core/             # Core features (singleton services, guards, interceptors)
│       │   ├── auth/         # Authentication service, guards, and interceptors
│       │   ├── theme/        # Theme switcher service
│       │   └── interceptors/ # HTTP request/response interceptors (error, token, tenant)
│       ├── layouts/          # Layout wrappers (auth-layout, dashboard-layout)
│       └── features/         # Domain-driven features (Dashboard, Users, Courses, Reports)
```

## State & Reactivity

- **Angular Signals**: Signals are utilized to handle application states, such as authenticated user context, sidebar toggle state, and active configurations.
- **Standalone Architecture**: Components, directives, and pipes are fully standalone, avoiding legacy NgModule declarations.
- **Tailwind CSS & Angular Material**: Components leverage custom CSS classes alongside Angular Material styles to achieve a modern, cohesive UI.
