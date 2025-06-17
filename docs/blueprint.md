# **App Name**: AgroVision AI

## Core Features:

- Authentication: User authentication with login screen, and a secure dashboard after login.
- Field Management Dashboard: Dashboard displaying a list of fields with details like image, name, crop, and area, plus options to view, edit, or delete each field.
- Add/Edit Field: Form to create new field or modify any existing fields, including name, area, soil type and crop type
- Field Detail View: View details of a field with an option to generate a plan of activities via AI integration.
- AI Activity Planner: AI-powered tool that analyzes field data (name, crop, area, soil type, and status) to generate an agronomic plan with upcoming actionable steps. The agronomic model will consider information in its plan or not, based on a reasoned assessment.
- Calendar View: Displays a calendar with activities, supporting monthly and weekly views with navigation to previous and next periods.
- AI Recommendations: AI-driven agronomic recommendations that are displayed along with manually curated recommendations. The agronomic recommendations will be generated considering current date, along with field information, from across all fields. The LLM-based tool may, based on its own reasoned assessment, include facts, ignore others, and selectively consider various bits of information, as well as follow specific advice based on that information.

## Style Guidelines:

- Primary color: Amber (#f59e0b), reminiscent of wheat fields, and symbolizing a connection to earth.
- Background color: Desaturated dark green (#1a4d2e), suggesting fertility and the Argentinian countryside. This is darker than the specified value to improve readability and contrast with other elements.
- Accent color: Green (#84cc16), complements the earth tones of the primary and background colors, while helping key interactive elements stand out.
- Body and headline font: 'Inter', a sans-serif font offering a clean, modern, and highly readable appearance.
- Lucide Icons: Use of 'Lucide Icons' library to provide consistent and clear visual cues throughout the interface.
- Desktop-first approach, employing a two-column layout. It should have a fixed navigation bar for easy access to essential sections, and a primary area with all the application functionalities
- Implement subtle animations in interactions like transitions and button presses, enriching UX with refined user feedback.