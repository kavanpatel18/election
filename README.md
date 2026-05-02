<div align="center">
  <h1>🗳️ ElectWise</h1>
  <p><strong>A Nonpartisan, Interactive Civic Education App</strong></p>
  <p><strong><a href="https://electwise-xaeqr4ozba-uc.a.run.app/" target="_blank">🌐 Live Demo</a></strong></p>

  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
  [![Code Size](https://img.shields.io/github/languages/code-size/kavanpatel18/election)](https://github.com/kavanpatel18/election)
</div>

<br />

ElectWise is a nonpartisan, civic education web application designed to empower voters, poll workers, candidates, and campaign staff. It aims to simplify the complex and often confusing timelines, deadlines, and procedures associated with elections by providing an interactive and personalized guide.

---

## ✨ Features

- **🎯 Personalized Timelines:** Generates a custom timeline of important dates based on your jurisdiction, role, and election date.
- **✅ Interactive Checklists:** Converts your timeline milestones into a satisfying, interactive to-do list.
- **🧠 Civic Knowledge Quiz:** Test your knowledge on voting rights, procedures, and facts with a built-in interactive quiz.
- **🚨 "What If" Scenarios:** Explore edge cases like lost mail ballots, moving right before an election, or making a mistake on your ballot.
- **📤 Export Options:** Export your timeline and checklist to PDF, CSV, JSON, or download as an `.ics` calendar file to add straight to your phone.
- **🌍 Localization:** Instantly translate the interface into English, Spanish, or French.
- **🔒 Privacy First:** 100% Client-side. No backend. No databases. Your data never leaves your browser.

## 🛠️ Tech Stack

ElectWise is built with simplicity, speed, and accessibility in mind:
- **Vanilla JavaScript (ES6 Modules):** No heavy frameworks. Just fast, native JS.
- **HTML5 & CSS3:** Utilizing CSS Grid, Flexbox, and CSS Variables for a responsive, modern UI.
- **Docker:** Ready for containerized deployment (includes `Dockerfile` and `nginx.conf`).

## 🚀 Getting Started

Because ElectWise is entirely frontend-based, you can run it almost instantly.

### Running Locally (Node.js)

1. Clone the repository:
   ```bash
   git clone https://github.com/kavanpatel18/election.git
   cd election
   ```
2. Install dependencies (for the local server and tests):
   ```bash
   npm install
   ```
3. Start the local server:
   ```bash
   npm start
   ```
4. Open your browser and navigate to `http://localhost:8080`.

### Running with Docker

1. Build the Docker image:
   ```bash
   docker build -t electwise .
   ```
2. Run the container:
   ```bash
   docker run -d -p 8080:80 electwise
   ```
3. Open your browser and navigate to `http://localhost:8080`.

## 🏗️ Architecture & Logic

- **State Management:** All application state (chosen jurisdiction, role, language, and election date) is managed entirely in the client's session.
- **Dynamic Content Generation:** The application dynamically generates UI components (Timeline, Checklist, Scenarios) by injecting data from `data/jurisdictions.js` into the DOM.
- **Relative Date Calculation:** Election milestones (e.g., voter registration deadlines) are calculated dynamically using mathematical offsets relative to the chosen Election Day (`day 0`).
- **Localization:** The `i18n.js` module provides a dictionary-based translation system.

## ⚠️ Assumptions & Disclaimer

- **Approximate Dates:** Election laws vary widely. The offsets provided in `data/jurisdictions.js` are approximate guidelines. **Users must verify exact dates with their local official election authority.**
- **Nonpartisan Neutrality:** This tool is purely procedural. It does not endorse or analyze political candidates, parties, or ballot measures.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/kavanpatel18/election/issues).

## 📝 License

This project is [MIT](LICENSE) licensed.
