// sessionStorage flag shared by IntroSplash (sets it) and the inline script in
// app/layout.tsx (reads it before first paint so returning visits skip the intro)
export const INTRO_PLAYED_KEY = "jsIntroPlayed";
