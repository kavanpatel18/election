/**
 * quiz.js
 * 5-question interactive knowledge quiz with adaptive role-based question pools.
 */

const QUESTION_BANK = {
  voter: [
    {
      id: "q1",
      question: "What is the purpose of a provisional ballot?",
      options: [
        "It allows you to vote for multiple candidates at once",
        "It is used when your eligibility to vote cannot be immediately confirmed at the polling place",
        "It is a backup ballot for if you make a mistake",
        "It lets you vote by mail after election day",
      ],
      correct: 1,
      explanation:
        "A provisional ballot is cast when a poll worker cannot immediately confirm your eligibility — for example, if your name is not on the voter roll. It is set aside and counted after election officials verify your eligibility.",
    },
    {
      id: "q2",
      question: "Which federal law requires most U.S. states to offer voter registration when applying for a driver's license?",
      options: ["Voting Rights Act of 1965", "National Voter Registration Act (Motor Voter Act)", "Help America Vote Act", "Civil Rights Act of 1964"],
      correct: 1,
      explanation:
        "The National Voter Registration Act of 1993 (also known as the Motor Voter Act) requires states to offer voter registration opportunities at DMVs and public assistance agencies.",
    },
    {
      id: "q3",
      question: "If you are in line at your polling place when the polls close, what are your rights?",
      options: [
        "You must leave and try again next time",
        "You can vote only if a poll worker allows it",
        "You are generally entitled to vote if you were in line before closing time",
        "You must file a court order to vote",
      ],
      correct: 2,
      explanation:
        "In most U.S. states and many democracies, if you are standing in line before the polls close, you have the legal right to cast your ballot even if the line is long and it takes time past closing.",
    },
    {
      id: "q4",
      question: "What does 'absentee voting' mean?",
      options: [
        "Voting on behalf of someone who is absent",
        "Voting in person at a different location than your assigned polling place",
        "Casting a ballot by mail when you cannot go to your polling place in person",
        "Voting without registering in advance",
      ],
      correct: 2,
      explanation:
        "Absentee voting (also called mail-in voting) allows registered voters to receive and return a ballot by mail if they cannot or prefer not to vote in person on election day.",
    },
    {
      id: "q5",
      question: "What is the purpose of the 'canvass' after an election?",
      options: [
        "It is the campaign outreach process before the election",
        "It is the official process of reviewing and counting all ballots to produce a final, verified vote tally",
        "It is when candidates concede or claim victory",
        "It is the process of printing new ballots",
      ],
      correct: 1,
      explanation:
        "The post-election canvass is the official process where election officials review and verify all ballots — including mail-in, provisional, and any ballots with questions — to produce the certified final tally.",
    },
    {
      id: "q6",
      question: "If you receive a mail-in ballot but decide to vote in person instead, what should you do?",
      options: [
        "Simply go vote in person — your mail ballot doesn't matter",
        "Bring your blank mail ballot to the polling place to surrender it before voting",
        "Throw the mail ballot away",
        "Mail the blank ballot back first, then vote in person",
      ],
      correct: 1,
      explanation:
        "In most jurisdictions, if you received a mail ballot but want to vote in person, you should bring the UNVOTED mail ballot to your polling place to surrender it. If you don't have it, you may need to vote by provisional ballot.",
    },
    {
      id: "q7",
      question: "What is 'early voting'?",
      options: [
        "Voting before you are 18 years old",
        "Casting your ballot at an authorized location during a designated period before official election day",
        "Submitting a ballot prediction before the election",
        "Voting via telephone before election day",
      ],
      correct: 1,
      explanation:
        "Early voting allows eligible voters to cast a ballot at authorized polling locations during a designated window before election day, helping reduce crowding and giving voters more flexibility.",
    },
    {
      id: "q8",
      question: "Which of these is NOT typically a valid reason to request an absentee ballot?",
      options: ["You will be out of town on election day", "You have a disability or illness", "You simply prefer the convenience of voting at home", "You disagree with the candidates on the ballot"],
      correct: 3,
      explanation:
        "Disagreeing with candidates is not a valid reason for an absentee ballot — though many states now offer 'no-excuse' absentee voting where no reason is required at all. Always check your state's specific rules.",
    },
  ],

  candidate: [
    {
      id: "cq1",
      question: "What is a campaign finance disclosure report?",
      options: [
        "A report detailing your campaign strategy",
        "A public record of all contributions received and expenditures made by a campaign",
        "A report filed to officially declare candidacy",
        "A voter registration form for campaign staff",
      ],
      correct: 1,
      explanation:
        "Campaign finance disclosure reports are public records required by law that list all money raised and spent by a campaign, promoting transparency and accountability.",
    },
    {
      id: "cq2",
      question: "What is a 'nomination petition'?",
      options: [
        "A document nominating a running mate",
        "A collection of voter signatures required to appear on the ballot in many jurisdictions",
        "An endorsement letter from a political party",
        "A legal challenge to an opponent's candidacy",
      ],
      correct: 1,
      explanation:
        "A nomination petition is a document signed by a required number of registered voters that allows a candidate to qualify for the ballot. Requirements vary widely by jurisdiction and office.",
    },
    {
      id: "cq3",
      question: "What does the Federal Election Commission (FEC) oversee in the United States?",
      options: [
        "All federal and state election laws",
        "Campaign finance laws for federal elections (President, Senate, House of Representatives)",
        "Voter registration nationwide",
        "Polling place procedures and ballot design",
      ],
      correct: 1,
      explanation:
        "The FEC enforces federal campaign finance laws, including contribution limits and disclosure requirements for campaigns for federal office. State elections are overseen by state election authorities.",
    },
    {
      id: "cq4",
      question: "What is the 'Model Code of Conduct' in the context of Indian elections?",
      options: [
        "A code of conduct for election officials only",
        "A set of guidelines issued by the Election Commission of India governing political parties and candidates during election season",
        "A template for candidate manifestos",
        "A voter behavior code enforced by the Supreme Court",
      ],
      correct: 1,
      explanation:
        "The Model Code of Conduct (MCC) is issued by the Election Commission of India and comes into effect the moment elections are announced. It governs the conduct of political parties, candidates, and the government to ensure free and fair elections.",
    },
  ],

  poll_worker: [
    {
      id: "pwq1",
      question: "What is a poll worker's primary responsibility regarding voter ID?",
      options: [
        "To accept any form of ID a voter presents",
        "To verify that voters present acceptable ID as required by the jurisdiction's law and to do so consistently and without bias",
        "To turn away any voter without a photo ID, regardless of local law",
        "To assist voters in obtaining IDs on election day",
      ],
      correct: 1,
      explanation:
        "Poll workers must follow their jurisdiction's specific ID requirements consistently and without discrimination. Requirements vary by state — some require photo ID, others accept various documents or signatures.",
    },
    {
      id: "pwq2",
      question: "Under the Americans with Disabilities Act (ADA), polling places must:",
      options: [
        "Only accommodate voters with visible disabilities",
        "Be accessible to voters with physical, sensory, and cognitive disabilities, including providing accessible voting equipment",
        "Offer curbside voting only if requested 48 hours in advance",
        "Direct all voters with disabilities to a separate polling location",
      ],
      correct: 1,
      explanation:
        "The ADA requires that all polling places be physically accessible and that voters with disabilities be provided accessible voting systems (e.g., audio ballots, large-print, sip-and-puff systems). Curbside voting must also be available.",
    },
    {
      id: "pwq3",
      question: "If a voter's name does not appear on the poll book, a poll worker should:",
      options: [
        "Turn the voter away immediately",
        "Allow the voter to cast a regular ballot without question",
        "Offer the voter a provisional ballot and direct them to the right precinct if applicable",
        "Contact the candidate's campaign office for guidance",
      ],
      correct: 2,
      explanation:
        "Federal law (HAVA) requires that provisional ballots be offered to anyone who claims eligibility but cannot be verified in the poll book. Poll workers should never turn a voter away without offering a provisional ballot.",
    },
  ],

  generic: [
    {
      id: "gq1",
      question: "What does 'nonpartisan' mean in the context of an election guide?",
      options: [
        "It means the guide supports independent candidates only",
        "It means the guide does not favor or advocate for any political party, candidate, or ballot measure",
        "It means the guide is published by the government",
        "It means the guide only covers non-political elections",
      ],
      correct: 1,
      explanation:
        "Nonpartisan means the information is neutral and does not advocate for or against any political party, candidate, or position. Civic education tools must be nonpartisan to serve all voters equally.",
    },
    {
      id: "gq2",
      question: "Why is it important to verify election deadlines with your official local election authority?",
      options: [
        "Because deadlines are the same everywhere",
        "Because election laws change frequently and vary significantly by country, state, county, and election type",
        "Because online guides are always wrong",
        "Because you need a special code from the authority to vote",
      ],
      correct: 1,
      explanation:
        "Election laws, deadlines, and procedures vary enormously by jurisdiction and can change from election to election. Always confirm critical dates with your official election authority website or office to ensure accuracy.",
    },
    {
      id: "gq3",
      question: "What is the primary purpose of a voting jurisdiction's 'official canvass'?",
      options: [
        "To conduct exit polls",
        "To count all votes, resolve discrepancies, and produce a certified official result",
        "To campaign for a recount",
        "To register late voters",
      ],
      correct: 1,
      explanation:
        "The official canvass is the post-election process where all ballots are counted, provisional ballots adjudicated, and totals verified, culminating in the official certified results.",
    },
    {
      id: "gq4",
      question: "What is a 'ballot measure' or 'referendum'?",
      options: [
        "A vote on a specific candidate",
        "A vote directly on a policy question, law, or constitutional amendment placed on the ballot for voters to decide",
        "A survey conducted before the election",
        "A measure to increase the number of polling places",
      ],
      correct: 1,
      explanation:
        "A ballot measure (or referendum / proposition) is a direct vote by citizens on a specific policy question, proposed law, or constitutional amendment — not on a candidate.",
    },
    {
      id: "gq5",
      question: "Which of the following best describes 'same-day voter registration'?",
      options: [
        "Registering to vote on the day your birthday falls",
        "A policy allowing eligible citizens to register to vote on election day itself at their polling place",
        "Registering online the day before an election",
        "A policy that automatically registers all citizens on election day",
      ],
      correct: 1,
      explanation:
        "Same-day registration (SDR) allows eligible voters to register and cast a ballot on election day at their polling place, bypassing the traditional advance registration deadline. It is available in some but not all jurisdictions.",
    },
  ],
};

let quizState = {
  role: "voter",
  questions: [],
  currentIndex: 0,
  answers: [],
  started: false,
  finished: false,
};

function selectQuestions(role, count = 5) {
  const pool = [
    ...(QUESTION_BANK[role] || []),
    ...QUESTION_BANK.generic,
  ];
  // Shuffle and pick `count` questions
  const shuffled = pool.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

function renderQuiz(role, t) {
  const container = document.getElementById("quiz-container");
  if (!container) return;

  quizState = { role, questions: selectQuestions(role), currentIndex: 0, answers: [], started: false, finished: false };

  container.innerHTML = `
    <h2 class="section-title">${t.quizTitle}</h2>
    <div id="quiz-inner">
      <div class="quiz-start-screen">
        <div class="quiz-icon">🧠</div>
        <p class="quiz-intro">Test what you know about the election process. ${quizState.questions.length} questions, instant feedback on each answer.</p>
        <button class="btn btn-primary btn-large" id="quiz-start-btn">${t.quizStart}</button>
      </div>
    </div>`;

  document.getElementById("quiz-start-btn").addEventListener("click", () => {
    quizState.started = true;
    showQuestion(0, t);
  });
}

function showQuestion(index, t) {
  const inner = document.getElementById("quiz-inner");
  if (!inner) return;
  const q = quizState.questions[index];
  const total = quizState.questions.length;

  inner.innerHTML = `
    <div class="quiz-progress-bar">
      <div class="quiz-progress-fill" style="width:${((index) / total) * 100}%"></div>
    </div>
    <div class="quiz-status">Question ${index + 1} of ${total}</div>
    <div class="quiz-question-card glass-card">
      <p class="quiz-question-text">${q.question}</p>
      <div class="quiz-options" role="radiogroup" aria-label="Answer options">
        ${q.options
          .map(
            (opt, i) => `
          <button class="quiz-option" data-index="${i}" role="radio" aria-checked="false">
            <span class="quiz-option-letter">${String.fromCharCode(65 + i)}</span>
            <span class="quiz-option-text">${opt}</span>
          </button>`
          )
          .join("")}
      </div>
      <div class="quiz-feedback" id="quiz-feedback" hidden></div>
      <button class="btn btn-primary quiz-next-btn" id="quiz-next-btn" hidden>
        ${index < total - 1 ? t.quizNext : t.quizFinish}
      </button>
    </div>`;

  inner.querySelectorAll(".quiz-option").forEach((btn) => {
    btn.addEventListener("click", () => handleAnswer(btn.dataset.index, q, index, t));
  });
}

function handleAnswer(selectedIndex, q, qIndex, t) {
  const si = parseInt(selectedIndex);
  quizState.answers[qIndex] = si;
  const isCorrect = si === q.correct;

  // Disable all options & highlight
  document.querySelectorAll(".quiz-option").forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correct) btn.classList.add("correct");
    else if (i === si && !isCorrect) btn.classList.add("incorrect");
  });

  const feedback = document.getElementById("quiz-feedback");
  feedback.hidden = false;
  feedback.innerHTML = `
    <div class="feedback-badge ${isCorrect ? "feedback-correct" : "feedback-incorrect"}">
      ${isCorrect ? "✓ " + t.quizCorrect : "✗ " + t.quizIncorrect}
    </div>
    <p class="feedback-explanation"><strong>${t.quizExplanation}:</strong> ${q.explanation}</p>`;

  const nextBtn = document.getElementById("quiz-next-btn");
  nextBtn.hidden = false;
  nextBtn.addEventListener("click", () => {
    if (qIndex < quizState.questions.length - 1) {
      showQuestion(qIndex + 1, t);
    } else {
      showResults(t);
    }
  });
}

function showResults(t) {
  const inner = document.getElementById("quiz-inner");
  const total = quizState.questions.length;
  const correct = quizState.answers.filter((a, i) => a === quizState.questions[i].correct).length;
  const pct = Math.round((correct / total) * 100);

  let badge = pct >= 80 ? "🏆 Expert" : pct >= 60 ? "📘 Learner" : "🌱 Beginner";
  let msg = pct >= 80 ? "Excellent! You're well-prepared." : pct >= 60 ? "Good effort — review the items below." : "Keep learning — review each explanation below.";

  inner.innerHTML = `
    <div class="quiz-results glass-card">
      <div class="quiz-score-ring">
        <svg viewBox="0 0 100 100" class="score-svg">
          <circle cx="50" cy="50" r="42" class="score-track"/>
          <circle cx="50" cy="50" r="42" class="score-fill" style="stroke-dasharray: ${(pct / 100) * 264} 264"/>
        </svg>
        <div class="score-center">
          <span class="score-pct">${pct}%</span>
          <span class="score-badge">${badge}</span>
        </div>
      </div>
      <p class="quiz-result-msg">${msg}</p>
      <div class="quiz-review">
        ${quizState.questions
          .map((q, i) => {
            const userAns = quizState.answers[i];
            const correct = userAns === q.correct;
            return `
          <div class="review-item ${correct ? "review-correct" : "review-incorrect"}">
            <div class="review-q">${i + 1}. ${q.question}</div>
            <div class="review-your">Your answer: <strong>${q.options[userAns] ?? "Not answered"}</strong></div>
            ${!correct ? `<div class="review-right">Correct: <strong>${q.options[q.correct]}</strong></div>` : ""}
            <div class="review-exp"><em>${q.explanation}</em></div>
          </div>`;
          })
          .join("")}
      </div>
      <button class="btn btn-ghost" id="quiz-retake-btn">${t.quizRetake}</button>
    </div>`;

  document.getElementById("quiz-retake-btn").addEventListener("click", () => {
    renderQuiz(quizState.role || "voter", t);
  });
}

export { renderQuiz };
