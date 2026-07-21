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
import visionDriftImg from "./assets/illustrations/vision-drift-portrait.png";
import hiddenRiskImg from "./assets/illustrations/hidden-risk.png";
import compassRealignmentImg from "./assets/illustrations/compass-realignment.png";
import staleComparisonImg from "./assets/illustrations/stale-vs-no-vision.png";
import focusValueImg from "./assets/illustrations/focus-on-value.png";
import realignmentImg from "./assets/illustrations/deliberate-realignment.png";
import phaseBoundaryImg from "./assets/illustrations/phase-boundaries.png";
import majorChangesImg from "./assets/illustrations/major-changes.png";
import newStakeholdersImg from "./assets/illustrations/new-stakeholders.png";
import noVisionCard from "./assets/illustrations/no-vision-card.png";
import staleVisionCard from "./assets/illustrations/stale-vision-card.png";

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
    kicker: "THE NATURAL CHECKPOINT",
    text: "At the end of each phase or major milestone, test whether the destination still reflects what the organization needs. Continuing, re-scoping, and stopping are all legitimate governance outcomes.",
    prompt: "Does this destination still deserve the next investment?",
    image: phaseBoundaryImg,
  },
  {
    name: "Major changes",
    icon: GitCompareArrows,
    kicker: "WHEN REALITY MOVES",
    text: "A regulatory requirement, market shift, or material scope change can alter what the project is trying to achieve. If a change affects the destination, it is big enough to reopen the vision conversation.",
    prompt: "Did this change alter what success needs to mean?",
    image: majorChangesImg,
  },
  {
    name: "New stakeholders",
    icon: UserPlus,
    kicker: "A NEW MENTAL MODEL",
    text: "A new sponsor, regulator, or executive did not negotiate the original language. Their alignment cannot be assumed; an influential stakeholder navigating toward a different destination is conflict waiting to surface.",
    prompt: "Are we all steering toward the same outcome?",
    image: newStakeholdersImg,
  },
];
const quiz1 = {
  q: "A new executive sponsor joins in month 5, replacing someone who co-created the original vision. What should the PM do?",
  answers: [
    "Nothing — the vision is already approved",
    "Wait until the next phase boundary",
    "Proactively revisit the vision with them",
    "Only revisit if the sponsor raises concerns",
  ],
  correct: 2,
  yes: "Right — the new sponsor wasn’t in the room when the vision was negotiated, so alignment cannot be assumed.",
  no: "Reconsider: this stakeholder’s understanding cannot be assumed simply because the document exists.",
};
const quiz2 = {
  q: "Which is generally more dangerous: having no documented vision, or navigating by a stale one?",
  answers: [
    "No vision — something is always better than nothing",
    "A stale vision — it creates false confidence",
    "They are equally risky",
    "Neither affects project decisions",
  ],
  correct: 1,
  yes: "Exactly — false confidence suppresses the check-ins that would have caught the drift.",
  no: "Think about behavior: one team keeps checking; the other confidently stops. That difference creates the risk.",
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
            : `${data.no} Choose another answer to try again.`}
        </motion.p>
      )}
      {picked === data.correct && (
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
        {detail.image ? <img className="drawer-illustration" src={detail.image} alt="" /> : <div className="sheet-icon">{detail.icon && React.createElement(detail.icon)}</div>}
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
    if (page === 1 && detail?.title === "Test the destination against value") {
      setSteps(1);
      setDetail(null);
      return;
    }
    if (page === 1 && detail?.title === "Build in deliberate moments to realign") {
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
                      <p className="eyebrow">LESSON 3.2.2 · KEEP THE VISION CURRENT</p>
                      <h1>
                        A clear destination
                        <br />
                        can still become <em>wrong.</em>
                      </h1>
                      <p>
                        A GPS plots the best route for the moment you enter the
                        address. It cannot know a bridge will close later—or
                        that a better road will open.
                      </p>
                      <button
                        className="primary"
                        onClick={() => {
                          setReveal(true);
                          setDetail({
                            title: "A stale vision is not neutral",
                            kicker: "THE HIDDEN RISK",
                            icon: Compass,
                            image: hiddenRiskImg,
                            body: "A vision can be perfectly crafted at initiation and still become wrong when the world changes around it. Unlike having no vision, a stale vision creates false confidence: the team keeps making aligned, purposeful decisions—but toward a destination that no longer reflects what the project needs to achieve. That makes an outdated vision actively dangerous, not merely incomplete.",
                            prompt: "Is the destination still true—or are we only following an old map?",
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
                    <img className="lesson-illustration hero-illustration portrait-art" src={visionDriftImg} alt="A project team reaches a blocked bridge where its old route is no longer valid and a new destination must be considered" />
                  </>
                )}
                {page === 1 && (
                  <div className="wide two-step">
                    <div>
                      <p className="eyebrow">WHAT THE ENABLER ACTUALLY ASKS</p>
                      <h2>
                        Keeping the vision current is a <em>governance act.</em>
                      </h2>
                      <p className="lede">
                        Reveal each part to bring the compass back into
                        alignment.
                      </p>
                      <div className="reveal-steps">
                        <button
                          className={steps >= 1 ? "opened" : ""}
                          onClick={() => {
                            setDetail({
                              title: "Test the destination against value",
                              kicker: "FOCUS ON VALUE",
                              icon: Target,
                              body: "ECO People Task 1 asks the PM to revisit and refresh the vision so it continues to describe a destination worth pursuing. If it no longer points toward value, update it—or question whether the project should continue.",
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
                                ECO People Task 1 asks the PM to revisit and
                                refresh the vision so it continues to describe a
                                destination worth pursuing. If it no longer
                                points toward value, update it—or question
                                whether the project should continue.
                              </motion.p>
                            )}
                          </div>
                        </button>
                        <button
                          disabled={steps < 1}
                          className={steps >= 2 ? "opened" : steps === 1 ? "available" : ""}
                          onClick={() => {
                            setDetail({
                              title: "Build in deliberate moments to realign",
                              kicker: "ACTIVE GOVERNANCE",
                              icon: RefreshCw,
                              body: "This is not reactive housekeeping or a document-control exercise. Build deliberate checkpoints into the work, test the vision against present reality, and realign the group whenever assumptions, value, or the operating environment have moved on without it. The outcome may be to continue, revise, re-scope, or stop.",
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
                                This is not reactive housekeeping. Test the
                                vision against reality on purpose, then realign
                                the group whenever reality has moved on without
                                it.
                              </motion.p>
                            )}
                          </div>
                        </button>
                      </div>
                    </div>
                    <div className={`generated-compass ${steps === 2 ? "aligned" : ""}`}><img className="lesson-illustration compass-art" src={compassRealignmentImg} alt="A compass needle realigning toward a destination" /></div>
                  </div>
                )}
                {page === 2 && (
                  <div className="wide">
                    <p className="eyebrow">THREE MOMENTS TO REVISIT</p>
                    <h2>Don’t wait for something to break.</h2>
                    <p className="lede">
                      Open every checkpoint and test the vision against current
                      reality.
                    </p>
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
                    <p className="eyebrow">THE COUNTERINTUITIVE RISK</p>
                    <h2>Why a stale vision can be worse than none.</h2>
                    <p className="lede">
                      Flip both cards to compare how each team behaves.
                    </p>
                    <div className="flip-grid">
                      {[
                        {
                          title: "A team with no vision",
                          sub: "Knows it lacks direction",
                          icon: Compass,
                          image: noVisionCard,
                          body: "The gap is visible, so the team checks more frequently, escalates uncertainty, and seeks alignment before significant decisions. The caution is uncomfortable—but protective.",
                        },
                        {
                          title: "A team with a stale vision",
                          sub: "Believes it has direction",
                          icon: RefreshCw,
                          image: staleVisionCard,
                          body: "The team decides confidently, accelerates, and uses an outdated vision to justify choices that pull the project further from where it needs to go. Nothing prompts a second look.",
                        },
                      ].map((c, i) => {
                        const I = c.icon,
                          on = flips.includes(i);
                        return (
                          <div className="illustrated-flip" key={c.title}>
                          <img className="flip-card-art" src={c.image} alt="" />
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
                        <div className="backing">
                          <b>Focus on Value:</b> value is the point—not
                          protecting the vision document from change.
                          Misalignment accumulates quietly until it becomes
                          visible and expensive.
                        </div>
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
                      <p className="eyebrow">EXAM LENS · KEEP IT TRUE</p>
                      <h2>
                        A vision is a <em>living alignment tool.</em> Its value
                        depends on remaining accurate.
                      </h2>
                      <p className="lede">The vision is useful only while it describes a destination worth pursuing and keeps decision-makers aligned around that destination.</p>
                      {!done ? (
                        <button
                          className="primary"
                          onClick={() => {
                            setDone(true);
                            tone(true, sound);
                          }}
                        >
                          Refresh the vision <Sparkles size={18} />
                        </button>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <ul>
                            <li>
                              Test it at phase boundaries; continue, re-scope,
                              or stop.
                            </li>
                            <li>
                              Revisit after any change that affects the
                              destination.
                            </li>
                            <li>
                              Reintroduce it to every new key stakeholder.
                            </li>
                            <li>
                              When reality moves, update the vision before the
                              team drifts further.
                            </li>
                          </ul>
                        </motion.div>
                      )}
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
      </AnimatePresence>
    </div>
  );
}
createRoot(document.getElementById("root")).render(<App />);
