import { useEffect, useRef, useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { Hero } from "./components/Hero";
import { Steps } from "./components/Steps";
import { CoursePreview } from "./components/CoursePreview";
import { CareerScenes } from "./components/CareerScenes";
import { IncomeWidget } from "./components/IncomeWidget";
import { SkillMap } from "./components/SkillMap";
import { DiagnosisForm } from "./components/DiagnosisForm";
import { ResultSection } from "./components/ResultSection";
import { StandardsStrip } from "./components/StandardsStrip";
import { SiteFooter } from "./components/SiteFooter";
import { Toast, ErrorBanner } from "./components/Toast";
import { useDiagnosis } from "./context/useDiagnosis";
import { useToast } from "./hooks/useToast";
import { calculateResult } from "./lib/diagnosis";
import { buildDemoAnswers, DEMO_INTERESTS, DEMO_PROFILE_DEFAULTS } from "./lib/demo";
import type { DiagnosisResult } from "./lib/diagnosis";

const GATED_SECTION_IDS = new Set(["result", "courses", "plan", "career"]);

function isDemoModeRequested(): boolean {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get("demo") === "1";
}

function buildDemoResult(): DiagnosisResult {
  return calculateResult({
    userType: "adult",
    personName: DEMO_PROFILE_DEFAULTS.personName,
    organization: DEMO_PROFILE_DEFAULTS.organization,
    currentRole: DEMO_PROFILE_DEFAULTS.currentRole,
    baseIncome: DEMO_PROFILE_DEFAULTS.baseIncome,
    interests: DEMO_INTERESTS,
    answers: buildDemoAnswers(),
  });
}

function App() {
  const { dispatch } = useDiagnosis();
  const { toast, error, showToast, showError } = useToast();
  const [result, setResult] = useState<DiagnosisResult | null>(() =>
    isDemoModeRequested() ? buildDemoResult() : null,
  );
  const [activeSection, setActiveSection] = useState("home");
  const demoFormHydratedRef = useRef(false);

  function handleResult(nextResult: DiagnosisResult, options?: { silent?: boolean }) {
    setResult(nextResult);
    if (!options?.silent) {
      navigateToSection("result");
    }
  }

  function navigateToSection(sectionId: string, behavior: ScrollBehavior = "smooth") {
    window.requestAnimationFrame(() => {
      const target = document.getElementById(sectionId);
      if (!target) return;
      const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - 24);
      window.scrollTo({ top, behavior });
    });
  }

  function handleGatedNavigate(sectionId: string) {
    navigateToSection("diagnosis");
    showToast("診断を実行すると、このエリアが表示されます");
    void sectionId;
  }

  // IntersectionObserver-based active section tracking (mirrors legacy setupSectionTracking()).
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main [id]"));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting && !entry.target.classList.contains("hidden"))
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { threshold: [0.25, 0.5, 0.75] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [result]);

  // Hash navigation: redirect gated sections back to #diagnosis until a result exists.
  useEffect(() => {
    function syncHash() {
      const sectionId = window.location.hash.replace("#", "");
      if (!sectionId) return;
      if (GATED_SECTION_IDS.has(sectionId) && !result) {
        navigateToSection("diagnosis", "auto");
        setActiveSection("diagnosis");
        return;
      }
      navigateToSection(sectionId, "auto");
      setActiveSection(sectionId);
    }
    window.addEventListener("hashchange", syncHash);
    const timers = [0, 220, 700, 1400].map((delay) => window.setTimeout(syncHash, delay));
    return () => {
      window.removeEventListener("hashchange", syncHash);
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [result]);

  // ?demo=1#result support: pre-fills the form (dispatch only; no local setState) and
  // scrolls to the already-computed demo result from the lazy useState initializer above.
  useEffect(() => {
    if (demoFormHydratedRef.current) return;
    if (!isDemoModeRequested()) return;
    demoFormHydratedRef.current = true;

    dispatch({
      type: "HYDRATE_FORM",
      form: {
        userType: "adult",
        personName: DEMO_PROFILE_DEFAULTS.personName,
        organization: DEMO_PROFILE_DEFAULTS.organization,
        currentRole: DEMO_PROFILE_DEFAULTS.currentRole,
        baseIncome: String(DEMO_PROFILE_DEFAULTS.baseIncome),
        interests: DEMO_INTERESTS,
        answers: buildDemoAnswers(),
      },
    });
    navigateToSection("result", "auto");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <a className="skip-link" href="#home">
        メインコンテンツへスキップ
      </a>
      <Sidebar activeSection={activeSection} onGatedNavigate={handleGatedNavigate} hasResult={Boolean(result)} />
      <main id="home" className="app-shell">
        <Hero />
        <Steps />

        <section className="dashboard-grid" aria-label="おすすめ講座とAI活用シーン">
          <CoursePreview />
          <aside className="right-stack">
            <CareerScenes />
            <IncomeWidget />
          </aside>
        </section>

        <SkillMap />
        <DiagnosisForm onResult={handleResult} showToast={showToast} showError={showError} />
        <ResultSection result={result} showToast={showToast} showError={showError} />
        <StandardsStrip />
        <SiteFooter />
      </main>
      <Toast message={toast?.message ?? null} />
      <ErrorBanner message={error?.message ?? null} />
    </>
  );
}

export default App;
