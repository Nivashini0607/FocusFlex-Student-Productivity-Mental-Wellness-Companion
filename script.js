// FocusFlex - Student Productivity & Mental Wellness Companion
// Lightweight front-end interactions & placeholder analysis logic.

const scrollToId = (id) => {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
};

// CTA button wiring
const heroAnalyzeBtn = document.getElementById("hero-analyze-btn");
const navAnalyzeBtn = document.getElementById("nav-analyze-btn");
const tryDemoBtn = document.getElementById("try-demo-btn");

heroAnalyzeBtn?.addEventListener("click", () => scrollToId("analyze"));
navAnalyzeBtn?.addEventListener("click", () => scrollToId("analyze"));
tryDemoBtn?.addEventListener("click", () => scrollToId("dashboard"));

// Reveal on scroll
const revealEls = document.querySelectorAll(".section, .feature-card, .layer-card, .dash-card, .testimonial-card, .analyze-form, .analyze-output");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealEls.forEach((el) => {
  el.classList.add("reveal");
  revealObserver.observe(el);
});

// Placeholder analysis logic for "Analyze Me" form.
// This is where a real AI / analytics layer would plug in.

const analyzeForm = document.getElementById("analyze-form");
const outFocus = document.getElementById("out-focus");
const outScreen = document.getElementById("out-screen");
const outMood = document.getElementById("out-mood");
const outInsight = document.getElementById("out-insight");

function analyzeMe(event) {
  event.preventDefault();

  if (!analyzeForm) return;

  const formData = new FormData(analyzeForm);
  const name = (formData.get("name") || "You").toString();
  const studyHours = Number(formData.get("studyHours") || 0);
  const screenTime = Number(formData.get("screenTime") || 0);
  const mood = (formData.get("mood") || "").toString();

  // Simple, transparent sample logic (NOT real AI):
  // - Start from a neutral focus baseline.
  // - Reward more focused study hours up to a soft cap.
  // - Penalize very high screen-time and very low mood.

  let focusScore = 65;
  const cappedStudy = Math.min(studyHours, 8);
  focusScore += cappedStudy * 2; // up to +16

  const ratio = screenTime === 0 ? 1 : Math.min(studyHours / Math.max(screenTime, 0.5), 2.2);
  focusScore += (ratio - 1) * 10; // small bonus if study > screen

  if (screenTime > 8) focusScore -= 10;
  if (screenTime > 10) focusScore -= 8;

  if (mood === "low") focusScore -= 12;
  if (mood === "okay") focusScore -= 4;
  if (mood === "great") focusScore += 6;

  focusScore = Math.max(0, Math.min(100, Math.round(focusScore)));

  let screenHealthLabel = "Balanced";
  if (screenTime === 0) screenHealthLabel = "Offline oasis";
  else if (screenTime > 7 && studyHours < 3) screenHealthLabel = "Scroll heavy";
  else if (screenTime > 9) screenHealthLabel = "Overloaded";

  let moodTilt = "Neutral";
  if (mood === "low") moodTilt = "Drained";
  if (mood === "okay") moodTilt = "Steady";
  if (mood === "good") moodTilt = "Bright";
  if (mood === "great") moodTilt = "Charged";

  // Generate a short, human insight.
  let insight;
  if (screenTime > studyHours + 2) {
    insight = `${name}, try 1 small offline pocket: 25 minutes notebook time before you open your phone.`;
  } else if (focusScore >= 80) {
    insight = `${name}, your week looks strong. Protect what works by anchoring 1 non‑negotiable deep work block daily.`;
  } else if (mood === "low") {
    insight = `${name}, treat this week as recovery‑friendly: lighter goals, earlier wind‑downs, and no self‑trash talk.`;
  } else {
    insight = `${name}, you’re close to a sweet spot. Tighten one thing: either 30 minutes less late‑night scroll or one extra micro‑break.`;
  }

  if (outFocus) outFocus.textContent = `${focusScore}/100`;
  if (outScreen) outScreen.textContent = screenHealthLabel;
  if (outMood) outMood.textContent = moodTilt;
  if (outInsight) outInsight.textContent = insight;

  // In a real build, this is where you would:
  // - Send anonymized data to your backend / AI service
  // - Update richer charts and trendlines
  // - Persist streaks and achievements
  console.log("[FocusFlex demo] Sample analysis computed", {
    name,
    studyHours,
    screenTime,
    mood,
    focusScore,
    screenHealthLabel,
    moodTilt,
  });
}

if (analyzeForm) {
  analyzeForm.addEventListener("submit", analyzeMe);
}