export function fakeDetect() {
  return {
    aiScore: Math.floor(Math.random() * 100),
    result: "AI Generated Image",
    confidence: "High",
  };
}