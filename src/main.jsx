import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Check,
  ChevronDown,
  Compass,
  Flag,
  GitCompareArrows,
  Menu,
  RefreshCw,
  Sparkles,
  Target,
  UserPlus,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import "./styles.css";
import SynthesisModal from "./SynthesisModal";
import { IllustrationPlayer } from "./components/IllustrationPlayer";
import visionDriftImg from "./assets/illustrations/vision-drift-portrait.svg?raw";
import hiddenRiskImg from "./assets/illustrations/hidden-risk.svg?raw";
import compassRealignmentImg from "./assets/illustrations/compass-realignment.svg?raw";
import staleComparisonImg from "./assets/illustrations/stale-vs-no-vision.svg?raw";
import focusValueImg from "./assets/illustrations/focus-on-value.svg?raw";
import realignmentImg from "./assets/illustrations/deliberate-realignment.svg?raw";
import phaseBoundaryImg from "./assets/illustrations/phase-boundaries.svg?raw";
import majorChangesImg from "./assets/illustrations/major-changes.svg?raw";
import newStakeholdersImg from "./assets/illustrations/new-stakeholders.svg?raw";
import noVisionCard from "./assets/illustrations/no-vision-card.svg?raw";
import staleVisionCard from "./assets/illustrations/stale-vision-card.svg?raw";

const screens = [
  "The drift",
  "Keep it current",
  "Revisit moments",
  "False confidence",
  "Exam lens",
];
const triggers = [
  {
    name: "Phase boundaries",
    icon: Flag,
    kicker: "Phase Boundaries — the natural checkpoint",
    text: "At the end of each phase or major milestone, the PM has both the opportunity and the responsibility to ask whether the destination the team has been navigating toward still reflects what the organization needs. Phase boundaries exist partly for this purpose — they're the governance moments where continuing, re-scoping, or stopping are all legitimate options on the table.",
    image: phaseBoundaryImg,
  },
  {
    name: "Major changes",
    icon: GitCompareArrows,
    kicker: "Major Changes",
    text: "A new regulatory requirement that reshapes the product. A market shift that changes the competitive landscape. A scope change significant enough to alter what the project delivers. The question is never whether the change was expected — it's whether it has changed the destination. Any shift big enough to affect what the project is trying to achieve is big enough to reopen the vision conversation.",
    image: majorChangesImg,
  },
  {
    name: "New stakeholders",
    icon: UserPlus,
    kicker: "New Key Stakeholders",
    text: "When a significant stakeholder joins mid-project — a new sponsor, a new regulatory body, an executive with a different strategic agenda — their understanding of the vision can't be assumed. They weren't in the workshop; they didn't negotiate the language of the vision statement. Bringing them into alignment isn't a courtesy — it's a governance necessity. An influential stakeholder working from a different mental model of the destination is a misalignment waiting to surface as conflict.",
    image: newStakeholdersImg,
  },
];
const quiz1 = {
  q: "A new executive sponsor joins the project in month 5, replacing someone who helped co-create the original vision statement. What should the PM do?",
  answers: [
    "Nothing — the vision is already documented and approved",
    "Wait until the next phase boundary to bring them up to speed",
    "Proactively revisit the vision with them — new key stakeholders can't be assumed to share the existing mental model",
    "Only revisit if the new sponsor raises concerns",
  ],
  correct: 2,
  yes: "Right — the new sponsor wasn't in the room when the vision was negotiated, so their alignment can't be assumed. Waiting for a phase boundary or for them to raise it leaves the misalignment live in the meantime.",
  no: "Reconsider — this stakeholder's understanding of the vision genuinely can't be assumed just because the document exists.",
};
const quiz2 = {
  q: "Which is generally more dangerous to a project — having no documented vision, or navigating by a stale one?",
  answers: [
    "No vision — teams need something to aim for, even if imperfect",
    "A stale vision — it creates false confidence that suppresses the checking-in a missing vision would have prompted",
    "They're equally risky — both leave a team without real direction",
    "Neither — vision has no real bearing on project decisions",
  ],
  correct: 1,
  yes: "Exactly — the danger isn't the absence of a vision, it's the false confidence a stale one produces, which quietly suppresses the very check-ins that would have caught the drift.",
  no: "Think about what each team actually does differently — one keeps checking, one stops. That difference is where the real risk sits.",
};

function tone(success, enabled) {
  if (!enabled) return;
  const C = window.AudioContext || window.webkitAudioContext;
  if (!C) return;
  const c = new C(),
    o = c.createOscillator(),
    g = c.createGain(),
    n = c.currentTime;
  o.frequency.value = success ? 720 : 430;
  g.gain.setValueAtTime(0.025, n);
  g.gain.exponentialRampToValueAtTime(0.0001, n + 0.14);
  o.connect(g);
  g.connect(c.destination);
  o.start();
  o.stop(n + 0.15);
  o.onended = () => c.close();
}
function Quiz({ data, onDone, sound, onFinish }) {
  const [picked, setPicked] = useState(null);
  const [closed, setClosed] = useState(false);
  const choose = (i) => {
    if (picked === data.correct) return;
    setPicked(i);
    tone(i === data.correct, sound);
    if (i === data.correct) onDone();
  };
  if (closed) return null;
  return createPortal(
    <motion.div className="knowledge-modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <motion.section className="quiz knowledge-modal" initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} role="dialog" aria-modal="true" aria-label="Micro knowledge check">
      <div className="quiz-label">
        <Target size={16} /> MICRO KNOWLEDGE CHECK
      </div>
      <h3>{data.q}</h3>
      <div className="answers">
        {data.answers.map((a, i) => (
          <button
            key={a}
            onClick={() => choose(i)}
            className={
              picked === i
                ? i === data.correct
                  ? "correct"
                  : "wrong"
                : picked !== null && i === data.correct
                  ? "correct reveal"
                  : ""
            }
          >
            <span>{String.fromCharCode(65 + i)}</span>
            {a}
            {picked !== null && i === data.correct && <Check size={18} />}
          </button>
        ))}
      </div>
      {picked !== null && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={picked === data.correct ? "feedback good" : "feedback bad"}
        >
          {picked === data.correct
            ? data.yes
            : data.no}
        </motion.p>
      )}
      {picked !== null && (
        <button className="finish-check" onClick={() => { setClosed(true); onFinish?.(); }}>
          Finish check <ArrowRight size={18} />
        </button>
      )}
    </motion.section>
    </motion.div>,
    document.body,
  );
}

function DetailSheet({ detail, onClose, onRead, modal = false }) {
  useEffect(() => {
    const close = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [onClose]);
  if (!detail) return null;
  return createPortal(
    <motion.div
      className={`modal-backdrop detail-sheet-backdrop ${modal ? "focused-modal-backdrop" : ""}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.aside
        className={modal ? "detail-sheet detail-modal" : "detail-sheet"}
        initial={modal ? { opacity: 0, y: 28, scale: .96 } : { x: "100%" }}
        animate={modal ? { opacity: 1, y: 0, scale: 1 } : { x: 0 }}
        exit={modal ? { opacity: 0, y: 18, scale: .97 } : { x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30, mass: .8 }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          className="drawer-close"
          onClick={onClose}
          aria-label="Close detail"
        >
          <X size={22} />
        </button>
        {detail.image ? <IllustrationPlayer className="drawer-illustration" svg={detail.image} /> : <div className="sheet-icon">{detail.icon && React.createElement(detail.icon)}</div>}
        <p className="mini-label">{detail.kicker}</p>
        <h3>{detail.name || detail.title}</h3>
        <p>{detail.text || detail.body}</p>
        {detail.prompt && (
          <div className="sheet-note">
            <Target size={18} />
            <span>Ask: “{detail.prompt}”</span>
          </div>
        )}
        <button className="modal-close-bottom" onClick={onRead || onClose}>
          <Check size={18} /> Mark as read
        </button>
      </motion.aside>
    </motion.div>,
    document.body,
  );
}

function VisionFrame({ current = false }) {
  return (
    <div className={`vision-frame ${current ? "current" : "stale"}`}>
      <div className="frame-corners">
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className="vision-seal">
        <Compass />
      </div>
      <small>PROJECT VISION</small>
      <h3>
        Make essential care
        <br />
        accessible to everyone.
      </h3>
      <p>One clear destination. Shared by every decision.</p>
      <div className="crack c1" />
      <div className="crack c2" />
      <div className="crack c3" />
      {current && (
        <motion.div
          className="current-stamp"
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          CURRENT
        </motion.div>
      )}
    </div>
  );
}

function CompassVisual({ step }) {
  return (
    <div className="compass-visual">
      <div className="orbit">
        <span>VALUE</span>
        <span>REALITY</span>
        <span>VISION</span>
      </div>
      <motion.div
        className="needle"
        animate={{ rotate: step === 0 ? 24 : step === 1 ? 8 : 0 }}
        transition={{ type: "spring", stiffness: 80 }}
      >
        <i />
      </motion.div>
      <Compass />
      <div className="heading">
        {step === 0
          ? "DRIFT DETECTED"
          : step === 1
            ? "TESTING HEADING"
            : "REALIGNED"}
      </div>
    </div>
  );
}

function App() {
  const [page, setPage] = useState(0),
    [sound, setSound] = useState(true),
    [reveal, setReveal] = useState(false),
    [steps, setSteps] = useState(0),
    [open, setOpen] = useState(0),
    [seen, setSeen] = useState([]),
    [q1, setQ1] = useState(false),
    [flips, setFlips] = useState([]),
    [q2, setQ2] = useState(false),
    [done, setDone] = useState(false),
    [synthesisOpen, setSynthesisOpen] = useState(false),
    [menu, setMenu] = useState(false),
    [quizOpen, setQuizOpen] = useState(false),
    [detail, setDetail] = useState(null);
  useEffect(() => { setReveal(false); setQuizOpen(false); }, [page]);
  const can = [
    reveal,
    steps === 2,
    seen.length === 3 && q1,
    flips.length === 2 && q2,
    done,
  ][page];
  useEffect(() => {
    if (can) {
      requestAnimationFrame(() =>
        document
          .querySelector(".nav-footer")
          ?.scrollIntoView({ behavior: "smooth", block: "nearest" }),
      );
    }
  }, [can, page]);
  const next = () => {
    if (page < 4 && can) {
      tone(true, sound);
      setPage(page + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  const selectTrigger = (index) => {
    setOpen(index);
    setDetail(triggers[index]);
    tone(false, sound);
  };
  const openTriggerDetail = () => {
    setDetail(triggers[open]);
    tone(false, sound);
  };
  const markDetailRead = () => {
    if (page === 1 && detail?.step === 1) {
      setSteps(1);
      setDetail(null);
      return;
    }
    if (page === 1 && detail?.step === 2) {
      setSteps(2);
      setDetail(null);
      return;
    }
    if (page === 2 && detail === triggers[open]) {
      setSeen((items) =>
        items.includes(open) ? items : [...items, open],
      );
      if (open < triggers.length - 1) setOpen(open + 1);
    }
    setDetail(null);
  };
  const progress = Math.round(((page + (can ? 1 : 0)) / 5) * 100);
  return (
    <div className="app-shell vision-app">
      <header className="topbar">
        <button className="course-select">
          <Award size={24} />
          <span>PMP Project Management Professional</span>
          <ChevronDown size={20} />
        </button>
        <div className="module-progress">
          <div>
            {Array.from({ length: 10 }, (_, i) => (
              <span
                key={i}
                className={`progress-dot ${i < 8 ? "done" : i === 8 ? "active" : ""}`}
              >
                {i < 8 ? <Check size={10} /> : <span />}
              </span>
            ))}
          </div>
          <div>
            {Array.from({ length: 9 }, (_, i) => (
              <span key={i} className="progress-dot">
                <span />
              </span>
            ))}
          </div>
        </div>
        <div className="top-actions">
          <button className="ghost-button" onClick={() => setSound(!sound)}>
            {sound ? <Volume2 size={20} /> : <VolumeX size={20} />}
            <span>{sound ? "Sound on" : "Sound off"}</span>
          </button>
          <button className="ghost-button">
            <X size={20} />
            <span>Quit</span>
          </button>
        </div>
      </header>
      <section className="workspace">
        <div className="lesson-stage">
          <div className="outline">
            <button className="menu-button" onClick={() => setMenu(!menu)}>
              <Menu size={20} />
            </button>
            {menu && (
              <div className="outline-panel">
                <div className="outline-summary">
                  <div>
                    <strong>Lesson 3.2.2</strong>
                    <span>{progress}%</span>
                  </div>
                  <span className="summary-track">
                    <span style={{ width: `${progress}%` }} />
                  </span>
                </div>
                <section className="study-block">
                  <div className="study-heading">
                    <span>
                      <BookOpen size={18} /> Study Plan
                    </span>
                    <span className="block-status">{page + 1}</span>
                  </div>
                  <div className="lesson-list">
                    {screens.map((title, i) => (
                      <button
                        key={title}
                        className={i === page ? "lesson current" : "lesson"}
                        disabled={i > page}
                        onClick={() => setPage(i)}
                      >
                        <span
                          className={`progress-dot ${i < page ? "done" : i === page ? "active" : ""}`}
                        >
                          {i < page ? <Check size={10} /> : <span />}
                        </span>
                        <span>{title}</span>
                        <small>{i + 1}</small>
                      </button>
                    ))}
                  </div>
                </section>
              </div>
            )}
          </div>
          <article className="lesson-card">
            <nav className="section-tabs">
              <p className="section-tabs-count">Section {page + 1} of 5</p>
              <div className="section-tabs-row">
                {screens.map((title, i) => (
                  <button
                    key={title}
                    className={`section-tab ${i === page ? "active" : i < page ? "done" : "locked"}`}
                    disabled={i > page}
                    onClick={() => setPage(i)}
                  >
                    {i < page && <Check size={14} />}
                    <span>{title}</span>
                  </button>
                ))}
              </div>
            </nav>
            <AnimatePresence mode="wait">
              <motion.section
                key={page}
                className={`lesson-content custom-stage vision-page page-${page}`}
                initial={{ opacity: 0, x: 70, filter: "blur(8px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: -48, filter: "blur(6px)" }}
                transition={{ duration: 0.48 }}
              >
                {page === 0 && (
                  <>
                    <div className="copy">
                      <p className="eyebrow">LESSON 3.2.2</p>
                      <h1>Keep the Vision Current</h1>
                      <p>Set a destination into a GPS at the start of a long drive, and it plots the best possible route — in that moment. It doesn't know a bridge will close an hour later, or that a new road will open next month. It just keeps confidently routing you down streets that made sense when you typed the address in, not necessarily the ones that make sense now.</p>
                      <button
                        className="primary"
                        onClick={() => {
                          setReveal(true);
                          setDetail({
                            title: "A project vision works the same way",
                            icon: Compass,
                            image: hiddenRiskImg,
                            body: "A project vision works the same way. A vision that was perfectly crafted at initiation can quietly become wrong — not because anyone made a mistake, but because the world around the project changed and the vision didn't change with it. A stale vision isn't neutral; it's actively dangerous, because the team keeps steering purposefully toward a destination that no longer reflects what the project is actually trying to achieve. Nobody notices until the gap between the vision and reality is too wide to ignore. That's the exact problem this enabler exists to solve.",
                          });
                          tone(false, sound);
                        }}
                      >
                        {reveal
                          ? "Review the hidden risk"
                          : "Reveal the hidden risk"}
                        <ArrowRight size={18} />
                      </button>
                    </div>
                    <IllustrationPlayer className="lesson-illustration hero-illustration portrait-art" svg={visionDriftImg} />
                  </>
                )}
                {page === 1 && (
                  <div className="wide two-step">
                    <div>
                      <h2>What the Enabler Actually Asks For</h2>
                      <p className="lede">"Keep the vision current" sounds simple, almost like housekeeping. It isn't. It's a deliberate governance act tied directly to one of PMBOK® 8's core principles.</p>
                      <div className="reveal-steps">
                        <button
                          className={steps >= 1 ? "opened" : ""}
                          onClick={() => {
                            setDetail({
                              step: 1,
                              title: "The third enabler of ECO People Task 1",
                              kicker: "PART 1",
                              icon: Target,
                              body: "The third enabler of ECO People Task 1 asks the project manager to revisit the vision deliberately, and where needed, refresh it so it continues to describe a destination worth pursuing. This connects directly to PMBOK® 8's Focus on Value principle: if conditions change such that the vision no longer points toward real value, the value-focused response is to update it. In the most significant cases — where changed conditions make the original destination unachievable or no longer worth pursuing — the value-focused response may even be to question whether the project should continue at all.",
                              image: focusValueImg,
                            });
                          }}
                        >
                          <span>01</span>
                          <div>
                            <b>Test the destination against value</b>
                            {steps >= 1 && (
                              <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                              >
                                The third enabler of ECO People Task 1 asks the project manager to revisit the vision deliberately, and where needed, refresh it so it continues to describe a destination worth pursuing. This connects directly to PMBOK® 8's Focus on Value principle: if conditions change such that the vision no longer points toward real value, the value-focused response is to update it. In the most significant cases — where changed conditions make the original destination unachievable or no longer worth pursuing — the value-focused response may even be to question whether the project should continue at all.
                              </motion.p>
                            )}
                          </div>
                        </button>
                        <button
                          disabled={steps < 1}
                          className={steps >= 2 ? "opened" : steps === 1 ? "available" : ""}
                          onClick={() => {
                            setDetail({
                              step: 2,
                              title: "This is not reactive housekeeping",
                              kicker: "PART 2",
                              icon: RefreshCw,
                              body: "This is not reactive housekeeping. It means deliberately building in moments to test the vision against reality — and re-aligning the group whenever that test reveals reality has moved on without it.",
                              image: realignmentImg,
                            });
                          }}
                        >
                          <span>02</span>
                          <div>
                            <b>Build in deliberate moments to realign</b>
                            {steps >= 2 && (
                              <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                              >
                                This is not reactive housekeeping. It means deliberately building in moments to test the vision against reality — and re-aligning the group whenever that test reveals reality has moved on without it.
                              </motion.p>
                            )}
                          </div>
                        </button>
                      </div>
                    </div>
                    <div className={`generated-compass ${steps === 2 ? "aligned" : ""}`}><IllustrationPlayer className="lesson-illustration compass-art" svg={compassRealignmentImg} /></div>
                  </div>
                )}
                {page === 2 && (
                  <div className="wide">
                    <h2>Three Moments to Revisit the Vision</h2>
                    <p className="lede">Three moments, consistently, are where the vision needs to be pulled out and tested against current reality — not waited on until something breaks. Click each to see why it matters.</p>
                    <div className="direct-card-grid" aria-label="Vision revisit checkpoints">
                        {triggers.map((trigger, index) => {
                          const Icon = trigger.icon;
                          return (
                            <button
                              key={trigger.name}
                              className={`direct-detail-card ${seen.includes(index) ? "visited" : ""}`}
                              onClick={() => selectTrigger(index)}
                            >
                              <span className="direct-card-icon">
                                <Icon />
                              </span>
                              <span className="direct-card-copy"><small>{seen.includes(index) ? <><Check size={14}/> READ</> : `0${index + 1}`}</small><strong>{trigger.name}</strong></span>
                              <ArrowRight className="direct-card-arrow" />
                            </button>
                          );
                        })}
                    </div>
                    <div className="thread">
                      {triggers.map((_, i) => (
                        <span
                          key={i}
                          className={seen.includes(i) ? "lit" : ""}
                        />
                      ))}
                    </div>
                    {seen.length === 3 && <>
                      {!q1 && <button className="knowledge-check-cta" onClick={() => setQuizOpen(true)}>
                        <Target size={18} /> Start knowledge check <ArrowRight size={18} />
                      </button>}
                      {quizOpen && !q1 && <Quiz data={quiz1} onDone={() => {}} sound={sound} onFinish={() => { setQ1(true); setQuizOpen(false); }} />}
                    </>}
                  </div>
                )}
                {page === 3 && (
                  <div className="wide">
                    <h2>Why a Stale Vision Is Worse Than None</h2>
                    <p className="lede">Here's the counterintuitive part of this enabler — and the part the exam loves to test. It would seem safer to have some vision than none. But there's a version of "having a vision" that's actually worse than having nothing at all. Flip both cards to see the difference.</p>
                    <div className="flip-grid">
                      {[
                        {
                          title: "A team with no vision",
                          sub: "Knows it lacks direction",
                          icon: Compass,
                          image: noVisionCard,
                          body: "Knows it lacks direction. Because the gap is visible, it tends to check back more frequently, escalate uncertainty, and seek alignment before committing to significant decisions. The caution is uncomfortable, but it's protective.",
                        },
                        {
                          title: "A team with a stale vision",
                          sub: "Believes it has direction",
                          icon: RefreshCw,
                          image: staleVisionCard,
                          body: "Believes it has direction. It makes decisions confidently, accelerates toward the destination, and uses the outdated vision to justify choices that may be pulling the project further from where it actually needs to go — with nothing prompting a second look.",
                        },
                      ].map((c, i) => {
                        const I = c.icon,
                          on = flips.includes(i);
                        return (
                          <div className="illustrated-flip" key={c.title}>
                          <IllustrationPlayer className="flip-card-art" svg={c.image} />
                          <button
                            className={`flip ${on ? "flipped" : ""}`}
                            onClick={() =>
                              setFlips((s) => (s.includes(i) ? s : [...s, i]))
                            }
                          >
                            <div className="flip-inner">
                              <div className="flip-front">
                                <small>CLICK TO FLIP</small>
                                <h3>{c.title}</h3>
                                <p>{c.sub}</p>
                              </div>
                              <div className="flip-back">
                                <small>
                                  {i === 0
                                    ? "VISIBLE UNCERTAINTY"
                                    : "HIDDEN MISALIGNMENT"}
                                </small>
                                <h3>{c.title}</h3>
                                <p>{c.body}</p>
                              </div>
                            </div>
                          </button>
                          </div>
                        );
                      })}
                    </div>
                    {flips.length === 2 && (
                      <>
                        <div className="backing">The misalignment in the second scenario doesn't surface in any single decision — it accumulates quietly, over months, until the distance between where the project is headed and where it should be headed becomes visible and expensive to correct. PMBOK® 8's Focus on Value principle is the governing idea: value is the point, not the vision document itself. Defending an outdated vision because changing it feels disruptive is the project management equivalent of navigating by an old map and refusing to look out the window.</div>
                        {!q2 && <button className="knowledge-check-cta" onClick={() => setQuizOpen(true)}>
                          <Target size={18} /> Start knowledge check <ArrowRight size={18} />
                        </button>}
                        {quizOpen && !q2 && <Quiz data={quiz2} onDone={() => {}} sound={sound} onFinish={() => { setQ2(true); setQuizOpen(false); }} />}
                      </>
                    )}
                  </div>
                )}
                {page === 4 && (
                  <div className="final vision-final">
                    <VisionFrame current={done} />
                    <div className="final-copy">
                      <p className="eyebrow">SYNTHESIS (EXAM LENS)</p>
                      <h2>Strip away every trigger and every scenario, and one idea sits underneath this whole enabler — one worth carrying into the exam room, and into every project you'll ever steer.</h2>
                      <button className="primary" disabled={done} onClick={() => setSynthesisOpen(true)}>
                        {done ? "Synthesis reviewed" : "Reveal the synthesis"} <Sparkles size={18} />
                      </button>
                    </div>
                  </div>
                )}
                {can && (
                  <motion.div
                    className="anchor"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Check size={20} />
                    <span>
                      {page === 4
                        ? "Lesson complete — the vision is current."
                        : "Interaction complete — continue when ready."}
                    </span>
                  </motion.div>
                )}
              </motion.section>
            </AnimatePresence>
            <footer className="nav-footer">
              <button
                className="secondary-button"
                disabled={page === 0}
                onClick={() => setPage(Math.max(0, page - 1))}
              >
                <ArrowLeft size={18} /> Previous
              </button>
              <button
                className={
                  can ? "primary-button unlocked" : "primary-button"
                }
                disabled={!can}
                onClick={page < 4 ? next : undefined}
              >
                {!can
                  ? "Complete interactions"
                  : page === 4
                    ? "Complete"
                    : "Continue"}
                <ArrowRight size={18} />
              </button>
            </footer>
          </article>
        </div>
      </section>
      <AnimatePresence>
        {detail && (
          <DetailSheet
            detail={detail}
            modal={page === 0 || page === 2}
            onClose={() => setDetail(null)}
            onRead={markDetailRead}
          />
        )}
        {synthesisOpen && <SynthesisModal title="A vision is a living alignment tool" onClose={() => setSynthesisOpen(false)} onReviewed={() => { setDone(true); setSynthesisOpen(false); tone(true, sound); }}>
          <p>A vision is not a document you create at initiation and protect from change. It's a living alignment tool — and its value depends on it remaining accurate. The team with no vision knows it needs direction. The team navigating by a stale vision believes it already has it — and that distinction is exactly what this enabler is designed to prevent. Expect the exam to test this through scenarios where a vision existed on paper but had quietly stopped being true.</p>
          <h4>Exam-relevant enablers to remember:</h4>
          <ul><li>Test the vision at phase boundaries — continuing, re-scoping, and stopping are all legitimate outcomes</li><li>Revisit it after any major change significant enough to affect what the project is trying to achieve</li><li>Reintroduce it to new key stakeholders — never assume their mental model matches the room that created it</li><li>When the test shows reality has moved, update the vision before the team steers further off course</li></ul>
        </SynthesisModal>}
      </AnimatePresence>
    </div>
  );
}
createRoot(document.getElementById("root")).render(<App />);
