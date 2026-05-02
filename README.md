# ElectWise — Nonpartisan Interactive Election Education App

## Chosen Vertical
**Civic Technology / Election Education**
ElectWise is a nonpartisan, civic education web application designed to empower voters, poll workers, candidates, and campaign staff. It aims to simplify the complex and often confusing timelines, deadlines, and procedures associated with elections by providing an interactive and personalized guide.

## Approach and Logic
The project is built using a **Vanilla JavaScript** architecture without relying on heavy frameworks like React or Angular. This ensures maximum performance, broad browser compatibility, and simple deployment. The application logic is modularized into distinct JavaScript files (`app.js`, `timeline.js`, `checklist.js`, `quiz.js`, `scenarios.js`, `exports.js`, `i18n.js`) representing different core features of the platform.

### Core Logic:
- **State Management:** All application state (user's chosen jurisdiction, role, language, and election date) is managed entirely client-side. This ensures complete privacy, as no user data is sent to a backend server.
- **Dynamic Content Generation:** Instead of hardcoded HTML, the application dynamically generates UI components (Timeline, Checklist, Scenarios) by injecting data from `data/jurisdictions.js` into the DOM based on the user's configuration.
- **Relative Date Calculation:** Election milestones (e.g., voter registration deadlines, absentee ballot requests) are calculated dynamically using mathematical offsets (e.g., `-30` days) relative to the chosen Election Day (`day 0`).
- **Localization:** An `i18n.js` module provides a dictionary-based translation system, allowing the interface to be instantly localized into different languages (English, Spanish, French) without page reloads.

## How the Solution Works
1. **Setup Wizard:** Upon launching the app, the user is greeted by a setup wizard where they input their specific parameters: Jurisdiction (US National, India National, UK National, or Generic), Role (Voter, Poll Worker, Candidate, Campaign Staff), preferred Language, and the specific Election Date.
2. **Personalized Timeline:** The app calculates all relevant deadlines based on the Election Date and displays a chronological timeline of milestones.
3. **Interactive Checklist:** Milestones are converted into an interactive checklist where users can mark tasks (like registering to vote or requesting a ballot) as complete.
4. **Knowledge Quiz & Scenarios:** Users can test their civic knowledge through a built-in quiz or explore "What If?" edge-case scenarios (e.g., "What if my mail ballot doesn't arrive?").
5. **Exporting Tools:** Users can export their personalized checklist and timeline to PDF, CSV, JSON, or download it as an ICS calendar file to add directly to their personal digital calendars.

## Assumptions Made
1. **Client-Side Environment:** It is assumed the user is running a modern web browser that supports ES6 modules (`type="module"`) and modern CSS features (like Grid, Flexbox, and CSS variables).
2. **Approximate Dates:** Election laws vary widely not just by country, but by state, county, and municipality. The offsets and milestones provided in the `data/jurisdictions.js` file are approximate/typical guidelines (e.g., "typically 30 days before"). The application explicitly assumes and warns the user that they must verify exact dates with their local official election authority.
3. **Privacy First:** It is assumed that voters value privacy when inputting their election details. Therefore, the architectural assumption is to rely on zero backend storage; everything happens in the browser's memory and is discarded when the page is closed or reset.
4. **Nonpartisan Neutrality:** It is assumed that the tool will be used purely for procedural education, making no attempt to endorse or analyze political candidates or parties.
