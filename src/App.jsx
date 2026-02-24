import { useState, useEffect, useRef } from "react";

// ─── CONSTANTS ───────────────────────────────────────────────
const PAGES = {
  HOME: "home",
  ROBOTICS: "robotics",
  ENERGY: "energy",
};

const ROBOTICS_PROJECTS = [
  {
    id: "quetzalcoatl",
    name: "Quetzalcóatl",
    subtitle: "Search & Rescue VTOL Drone",
    description:
      "Autonomous VTOL drone platform engineered for search and rescue operations. Combining fixed-wing endurance with multirotor precision, Quetzalcóatl deploys AI-driven object detection to locate survivors in disaster zones where every second counts.",
    specs: ["VTOL Tailsitter", "AI Object Detection", "60+ Min Endurance", "Autonomous Nav"],
    status: "In Development",
    icon: "◈",
  },
  {
    id: "rc-car",
    name: "Tlāloc",
    subtitle: "Autonomous Ground Vehicle",
    description:
      "All-terrain autonomous ground vehicle platform for reconnaissance and payload delivery in environments too dangerous for human operators. Sensor fusion and real-time path planning enable navigation through unstructured terrain.",
    specs: ["All-Terrain", "Sensor Fusion", "Path Planning", "Modular Payload"],
    status: "Research Phase",
    icon: "◇",
  },
  {
    id: "submarine",
    name: "Cipactli",
    subtitle: "Unmanned Underwater Vehicle",
    description:
      "Submersible autonomous platform for underwater inspection, environmental monitoring, and subsea operations. Pressure-rated hull with multi-axis thruster configuration enables precise maneuvering in confined underwater spaces.",
    specs: ["Depth-Rated Hull", "Multi-Axis Thrust", "Sonar Mapping", "Autonomous Return"],
    status: "Research Phase",
    icon: "◆",
  },
  {
    id: "robot-arm",
    name: "Tezcatlipoca",
    subtitle: "Collaborative Robot Arm",
    description:
      "Precision robotic manipulator designed for collaborative human-robot workflows. Force-sensing joints and adaptive gripping enable safe operation alongside human operators in manufacturing and research environments.",
    specs: ["6-DOF Articulation", "Force Sensing", "Adaptive Grip", "Human-Safe"],
    status: "Concept Phase",
    icon: "◊",
  },
];

const ENERGY_PROJECTS = [
  {
    id: "hydrogen-gen",
    name: "Tōnatiuh Reactor",
    subtitle: "Hydrogen Energy Generator",
    description:
      "Compact hydrogen generation system designed for distributed clean energy production. Electrochemical conversion architecture enables on-site hydrogen fuel generation from water, eliminating transportation logistics and reducing infrastructure dependency.",
    specs: ["Electrolysis Core", "Scalable Output", "Zero-Emission", "Grid-Independent"],
    status: "Research Phase",
    icon: "⬡",
  },
];

// ─── STYLES ──────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Rajdhani:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

  :root {
    --bg-deep: #04060e;
    --bg-panel: #0a0e1a;
    --bg-card: #0d1220;
    --border-dim: rgba(0, 212, 255, 0.08);
    --border-glow: rgba(0, 212, 255, 0.25);
    --cyan: #00d4ff;
    --cyan-dim: rgba(0, 212, 255, 0.4);
    --cyan-ghost: rgba(0, 212, 255, 0.06);
    --teal: #00ffc8;
    --amber: #ffb800;
    --amber-dim: rgba(255, 184, 0, 0.3);
    --text-primary: #e8edf5;
    --text-secondary: #7a8ba8;
    --text-dim: #3d4f6a;
    --danger: #ff3366;
    --font-display: 'Orbitron', monospace;
    --font-body: 'Rajdhani', sans-serif;
    --font-mono: 'Space Mono', monospace;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    background: var(--bg-deep);
    color: var(--text-primary);
    font-family: var(--font-body);
    overflow-x: hidden;
  }

  /* ── SCANLINE OVERLAY ── */
  .scanlines {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    pointer-events: none;
    z-index: 9999;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0, 0, 0, 0.03) 2px,
      rgba(0, 0, 0, 0.03) 4px
    );
  }

  /* ── GRID BACKGROUND ── */
  .grid-bg {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    pointer-events: none;
    z-index: 0;
    background-image:
      linear-gradient(var(--border-dim) 1px, transparent 1px),
      linear-gradient(90deg, var(--border-dim) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: radial-gradient(ellipse 80% 60% at 50% 30%, black 20%, transparent 70%);
  }

  /* ── NAVIGATION ── */
  .nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 1000;
    padding: 0 40px;
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(4, 6, 14, 0.85);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border-dim);
  }

  .nav-logo {
    font-family: var(--font-display);
    font-size: 18px;
    font-weight: 700;
    letter-spacing: 3px;
    color: var(--cyan);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 12px;
    text-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
  }

  .nav-logo .logo-mark {
    width: 36px;
    height: 36px;
    border: 2px solid var(--cyan);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
    background: rgba(0, 212, 255, 0.05);
  }

  .nav-links {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .nav-link {
    font-family: var(--font-display);
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 8px 20px;
    border: 1px solid transparent;
    background: none;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
  }

  .nav-link:hover {
    color: var(--cyan);
    border-color: var(--border-glow);
    background: var(--cyan-ghost);
  }

  .nav-link.active {
    color: var(--cyan);
    border-color: var(--cyan);
    background: rgba(0, 212, 255, 0.08);
    box-shadow: 0 0 15px rgba(0, 212, 255, 0.1), inset 0 0 15px rgba(0, 212, 255, 0.05);
  }

  .nav-link.active::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 20%;
    right: 20%;
    height: 1px;
    background: var(--cyan);
    box-shadow: 0 0 8px var(--cyan);
  }

  /* ── PAGE WRAPPER ── */
  .page {
    min-height: 100vh;
    padding-top: 72px;
    position: relative;
    z-index: 1;
  }

  /* ── HERO SECTION ── */
  .hero {
    min-height: calc(100vh - 72px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 80px 40px;
    position: relative;
  }

  .hero-glow {
    position: absolute;
    top: 20%;
    left: 50%;
    transform: translateX(-50%);
    width: 600px;
    height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0, 212, 255, 0.06) 0%, transparent 70%);
    pointer-events: none;
  }

  .hero-tag {
    font-family: var(--font-mono);
    font-size: 12px;
    letter-spacing: 4px;
    color: var(--cyan-dim);
    text-transform: uppercase;
    margin-bottom: 32px;
    opacity: 0;
    animation: fadeSlideUp 0.8s ease forwards 0.2s;
  }

  .hero-title {
    font-family: var(--font-display);
    font-size: clamp(36px, 6vw, 72px);
    font-weight: 900;
    letter-spacing: 6px;
    line-height: 1.1;
    margin-bottom: 8px;
    opacity: 0;
    animation: fadeSlideUp 0.8s ease forwards 0.4s;
  }

  .hero-title .highlight {
    color: var(--cyan);
    text-shadow: 0 0 40px rgba(0, 212, 255, 0.3);
  }

  .hero-subtitle {
    font-family: var(--font-display);
    font-size: clamp(14px, 2vw, 20px);
    font-weight: 400;
    letter-spacing: 8px;
    text-transform: uppercase;
    color: var(--text-secondary);
    margin-bottom: 48px;
    opacity: 0;
    animation: fadeSlideUp 0.8s ease forwards 0.6s;
  }

  .hero-desc {
    max-width: 640px;
    font-size: 18px;
    font-weight: 300;
    line-height: 1.8;
    color: var(--text-secondary);
    opacity: 0;
    animation: fadeSlideUp 0.8s ease forwards 0.8s;
  }

  .hero-cta-row {
    display: flex;
    gap: 16px;
    margin-top: 48px;
    opacity: 0;
    animation: fadeSlideUp 0.8s ease forwards 1s;
  }

  .btn-primary {
    font-family: var(--font-display);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 3px;
    text-transform: uppercase;
    padding: 16px 40px;
    background: linear-gradient(135deg, rgba(0, 212, 255, 0.15), rgba(0, 212, 255, 0.05));
    border: 1px solid var(--cyan);
    color: var(--cyan);
    cursor: pointer;
    transition: all 0.3s ease;
    clip-path: polygon(12px 0, 100% 0, calc(100% - 12px) 100%, 0 100%);
  }

  .btn-primary:hover {
    background: linear-gradient(135deg, rgba(0, 212, 255, 0.25), rgba(0, 212, 255, 0.1));
    box-shadow: 0 0 30px rgba(0, 212, 255, 0.2);
  }

  .btn-secondary {
    font-family: var(--font-display);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 3px;
    text-transform: uppercase;
    padding: 16px 40px;
    background: transparent;
    border: 1px solid var(--text-dim);
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.3s ease;
    clip-path: polygon(12px 0, 100% 0, calc(100% - 12px) 100%, 0 100%);
  }

  .btn-secondary:hover {
    border-color: var(--text-secondary);
    color: var(--text-primary);
  }

  /* ── SEGMENTS GRID (HOME) ── */
  .segments-section {
    padding: 100px 40px;
  }

  .section-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 60px;
  }

  .section-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, var(--border-glow), transparent);
  }

  .section-line.right {
    background: linear-gradient(90deg, transparent, var(--border-glow));
  }

  .section-label {
    font-family: var(--font-display);
    font-size: 11px;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: var(--cyan-dim);
    white-space: nowrap;
  }

  .segments-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
    gap: 24px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .segment-card {
    background: var(--bg-card);
    border: 1px solid var(--border-dim);
    padding: 48px 40px;
    cursor: pointer;
    transition: all 0.4s ease;
    position: relative;
    overflow: hidden;
  }

  .segment-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 3px;
    background: linear-gradient(90deg, transparent, var(--cyan), transparent);
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  .segment-card:hover {
    border-color: var(--border-glow);
    transform: translateY(-4px);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4), 0 0 30px rgba(0, 212, 255, 0.05);
  }

  .segment-card:hover::before {
    opacity: 1;
  }

  .segment-icon {
    font-family: var(--font-display);
    font-size: 32px;
    color: var(--cyan);
    margin-bottom: 24px;
    text-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
  }

  .segment-name {
    font-family: var(--font-display);
    font-size: 22px;
    font-weight: 700;
    letter-spacing: 3px;
    margin-bottom: 8px;
  }

  .segment-count {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-dim);
    letter-spacing: 2px;
    margin-bottom: 20px;
  }

  .segment-desc {
    font-size: 16px;
    font-weight: 300;
    line-height: 1.7;
    color: var(--text-secondary);
  }

  .segment-enter {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 32px;
    font-family: var(--font-display);
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--cyan-dim);
    transition: color 0.3s ease;
  }

  .segment-card:hover .segment-enter {
    color: var(--cyan);
  }

  /* ── SUBPAGE HERO ── */
  .subpage-hero {
    padding: 100px 40px 60px;
    text-align: center;
    position: relative;
  }

  .subpage-hero .hero-glow {
    width: 400px;
    height: 400px;
    top: 10%;
  }

  .subpage-tag {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 4px;
    color: var(--cyan-dim);
    text-transform: uppercase;
    margin-bottom: 20px;
  }

  .subpage-title {
    font-family: var(--font-display);
    font-size: clamp(28px, 4vw, 52px);
    font-weight: 800;
    letter-spacing: 4px;
    margin-bottom: 16px;
  }

  .subpage-desc {
    max-width: 600px;
    margin: 0 auto;
    font-size: 17px;
    font-weight: 300;
    line-height: 1.7;
    color: var(--text-secondary);
  }

  /* ── PROJECT CARDS ── */
  .projects-section {
    padding: 40px 40px 120px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .project-card {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
    background: var(--bg-card);
    border: 1px solid var(--border-dim);
    margin-bottom: 24px;
    transition: all 0.4s ease;
    overflow: hidden;
    position: relative;
  }

  .project-card::after {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 3px; height: 100%;
    background: var(--cyan);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .project-card:hover {
    border-color: var(--border-glow);
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 212, 255, 0.03);
  }

  .project-card:hover::after {
    opacity: 1;
  }

  .project-info {
    padding: 48px;
    display: flex;
    flex-direction: column;
  }

  .project-header {
    display: flex;
    align-items: flex-start;
    gap: 20px;
    margin-bottom: 20px;
  }

  .project-icon-box {
    width: 52px;
    height: 52px;
    border: 1px solid var(--border-glow);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    color: var(--cyan);
    background: var(--cyan-ghost);
    flex-shrink: 0;
  }

  .project-titles .project-name {
    font-family: var(--font-display);
    font-size: 20px;
    font-weight: 700;
    letter-spacing: 2px;
    margin-bottom: 4px;
  }

  .project-titles .project-sub {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-dim);
    letter-spacing: 1px;
  }

  .project-desc {
    font-size: 15px;
    font-weight: 300;
    line-height: 1.8;
    color: var(--text-secondary);
    flex: 1;
  }

  .project-meta {
    padding: 48px;
    background: rgba(0, 0, 0, 0.2);
    border-left: 1px solid var(--border-dim);
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .meta-label {
    font-family: var(--font-display);
    font-size: 10px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--text-dim);
    margin-bottom: 12px;
  }

  .status-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: var(--font-mono);
    font-size: 12px;
    letter-spacing: 1px;
    padding: 6px 14px;
    border: 1px solid;
    margin-bottom: 32px;
    width: fit-content;
  }

  .status-badge.dev {
    color: var(--teal);
    border-color: rgba(0, 255, 200, 0.3);
    background: rgba(0, 255, 200, 0.05);
  }

  .status-badge.research {
    color: var(--amber);
    border-color: var(--amber-dim);
    background: rgba(255, 184, 0, 0.05);
  }

  .status-badge.concept {
    color: var(--text-dim);
    border-color: rgba(61, 79, 106, 0.4);
    background: rgba(61, 79, 106, 0.05);
  }

  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
    animation: pulse-dot 2s ease infinite;
  }

  .specs-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .spec-item {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 1px;
    color: var(--text-secondary);
    padding: 10px 14px;
    border: 1px solid var(--border-dim);
    background: rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .spec-dot {
    width: 4px;
    height: 4px;
    background: var(--cyan);
    flex-shrink: 0;
  }

  /* ── FOOTER ── */
  .footer {
    border-top: 1px solid var(--border-dim);
    padding: 40px;
    text-align: center;
  }

  .footer-text {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-dim);
    letter-spacing: 2px;
  }

  .footer-text .cyan {
    color: var(--cyan-dim);
  }

  /* ── ANIMATIONS ── */
  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes pulse-dot {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  @keyframes borderScan {
    0% { background-position: 0% 50%; }
    100% { background-position: 200% 50%; }
  }

  /* ── FADE-IN ON SCROLL ── */
  .fade-in {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }

  .fade-in.visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 860px) {
    .nav { padding: 0 20px; }
    .hero, .subpage-hero { padding-left: 20px; padding-right: 20px; }
    .segments-grid { grid-template-columns: 1fr; }
    .project-card { grid-template-columns: 1fr; }
    .project-meta { border-left: none; border-top: 1px solid var(--border-dim); }
    .projects-section { padding: 40px 20px 80px; }
    .nav-links { gap: 4px; }
    .nav-link { padding: 8px 12px; font-size: 10px; letter-spacing: 1px; }
  }
`;

// ─── FADE-IN HOOK ────────────────────────────────────────────
function useFadeIn() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function FadeIn({ children, delay = 0, className = "" }) {
  const ref = useFadeIn();
  return (
    <div ref={ref} className={`fade-in ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

// ─── NAVIGATION ──────────────────────────────────────────────
function Nav({ page, setPage }) {
  return (
    <nav className="nav">
      <div className="nav-logo" onClick={() => setPage(PAGES.HOME)}>
        <div className="logo-mark">T3</div>
        T3—RC
      </div>
      <div className="nav-links">
        <button
          className={`nav-link ${page === PAGES.HOME ? "active" : ""}`}
          onClick={() => setPage(PAGES.HOME)}
        >
          Home
        </button>
        <button
          className={`nav-link ${page === PAGES.ROBOTICS ? "active" : ""}`}
          onClick={() => setPage(PAGES.ROBOTICS)}
        >
          Robotics
        </button>
        <button
          className={`nav-link ${page === PAGES.ENERGY ? "active" : ""}`}
          onClick={() => setPage(PAGES.ENERGY)}
        >
          Energy
        </button>
      </div>
    </nav>
  );
}

// ─── HOME PAGE ───────────────────────────────────────────────
function HomePage({ setPage }) {
  return (
    <div className="page">
      <section className="hero">
        <div className="hero-glow" />
        <div className="hero-tag">// Research Collective — Est. 2025</div>
        <h1 className="hero-title">
          <span className="highlight">T3</span> RESEARCH
          <br />
          COLLECTIVE
        </h1>
        <p className="hero-subtitle">Engineering Tomorrow's Autonomy</p>
        <p className="hero-desc">
          A grant-funded research engine building autonomous systems, clean energy platforms, and
          life-saving technology. We turn urgent problems into deployable solutions within 1–3 years.
        </p>
        <div className="hero-cta-row">
          <button className="btn-primary" onClick={() => setPage(PAGES.ROBOTICS)}>
            Explore Projects ⟶
          </button>
          <button className="btn-secondary">Join the Collective</button>
        </div>
      </section>

      <section className="segments-section">
        <div className="section-header">
          <div className="section-line right" />
          <span className="section-label">Research Segments</span>
          <div className="section-line" />
        </div>

        <div className="segments-grid">
          <FadeIn>
            <div className="segment-card" onClick={() => setPage(PAGES.ROBOTICS)}>
              <div className="segment-icon">⬡</div>
              <h3 className="segment-name">ROBOTICS</h3>
              <div className="segment-count">{ROBOTICS_PROJECTS.length} ACTIVE PROJECTS</div>
              <p className="segment-desc">
                Autonomous drones, ground vehicles, submersibles, and collaborative manipulators.
                Platforms engineered for search & rescue, reconnaissance, and precision operations.
              </p>
              <div className="segment-enter">
                Enter Segment <span>⟶</span>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={150}>
            <div className="segment-card" onClick={() => setPage(PAGES.ENERGY)}>
              <div className="segment-icon">⚡</div>
              <h3 className="segment-name">ENERGY</h3>
              <div className="segment-count">{ENERGY_PROJECTS.length} ACTIVE PROJECT</div>
              <p className="segment-desc">
                Distributed clean energy generation systems. On-site hydrogen production eliminating
                infrastructure dependency and transportation logistics.
              </p>
              <div className="segment-enter">
                Enter Segment <span>⟶</span>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* STATS BAR */}
      <section style={{ padding: "60px 40px 100px" }}>
        <FadeIn>
          <div
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 1,
              background: "var(--border-dim)",
              border: "1px solid var(--border-dim)",
            }}
          >
            {[
              { val: "5+", label: "Active Projects" },
              { val: "12", label: "Engineers" },
              { val: "3", label: "PhD Advisors" },
              { val: "2", label: "Research Segments" },
            ].map((s, i) => (
              <div
                key={i}
                style={{
                  background: "var(--bg-card)",
                  padding: "36px 32px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 32,
                    fontWeight: 800,
                    color: "var(--cyan)",
                    marginBottom: 8,
                  }}
                >
                  {s.val}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    letterSpacing: 2,
                    color: "var(--text-dim)",
                    textTransform: "uppercase",
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      <Footer />
    </div>
  );
}

// ─── PROJECT CARD COMPONENT ──────────────────────────────────
function ProjectCard({ project, index }) {
  const statusClass =
    project.status === "In Development"
      ? "dev"
      : project.status === "Research Phase"
      ? "research"
      : "concept";

  return (
    <FadeIn delay={index * 120}>
      <div className="project-card">
        <div className="project-info">
          <div className="project-header">
            <div className="project-icon-box">{project.icon}</div>
            <div className="project-titles">
              <h3 className="project-name">{project.name}</h3>
              <div className="project-sub">{project.subtitle}</div>
            </div>
          </div>
          <p className="project-desc">{project.description}</p>
        </div>
        <div className="project-meta">
          <div className="meta-label">Status</div>
          <div className={`status-badge ${statusClass}`}>
            <span className="status-dot" />
            {project.status}
          </div>
          <div className="meta-label">Capabilities</div>
          <div className="specs-grid">
            {project.specs.map((spec, i) => (
              <div className="spec-item" key={i}>
                <span className="spec-dot" />
                {spec}
              </div>
            ))}
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

// ─── ROBOTICS PAGE ───────────────────────────────────────────
function RoboticsPage() {
  return (
    <div className="page">
      <section className="subpage-hero">
        <div className="hero-glow" />
        <div className="subpage-tag">// Segment 01 — Robotics Division</div>
        <h1 className="subpage-title">ROBOTICS</h1>
        <p className="subpage-desc">
          Autonomous platforms for air, ground, sea, and workspace. Each system is engineered to
          operate in environments where human presence is impractical or dangerous.
        </p>
      </section>

      <section className="projects-section">
        <div className="section-header">
          <div className="section-line right" />
          <span className="section-label">Project Registry</span>
          <div className="section-line" />
        </div>
        {ROBOTICS_PROJECTS.map((p, i) => (
          <ProjectCard key={p.id} project={p} index={i} />
        ))}
      </section>

      <Footer />
    </div>
  );
}

// ─── ENERGY PAGE ─────────────────────────────────────────────
function EnergyPage() {
  return (
    <div className="page">
      <section className="subpage-hero">
        <div className="hero-glow" />
        <div className="subpage-tag">// Segment 02 — Energy Systems</div>
        <h1 className="subpage-title">ENERGY</h1>
        <p className="subpage-desc">
          Distributed energy generation systems that eliminate grid dependency. Clean hydrogen
          production at the point of use.
        </p>
      </section>

      <section className="projects-section">
        <div className="section-header">
          <div className="section-line right" />
          <span className="section-label">Project Registry</span>
          <div className="section-line" />
        </div>
        {ENERGY_PROJECTS.map((p, i) => (
          <ProjectCard key={p.id} project={p} index={i} />
        ))}
      </section>

      <Footer />
    </div>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-text">
        <span className="cyan">T3 RESEARCH COLLECTIVE</span> — © 2025 — ALL RIGHTS RESERVED
      </div>
    </footer>
  );
}

// ─── APP ─────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState(PAGES.HOME);

  const navigate = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  return (
    <>
      <style>{styles}</style>
      <div className="scanlines" />
      <div className="grid-bg" />
      <Nav page={page} setPage={navigate} />
      {page === PAGES.HOME && <HomePage setPage={navigate} />}
      {page === PAGES.ROBOTICS && <RoboticsPage />}
      {page === PAGES.ENERGY && <EnergyPage />}
    </>
  );
}
