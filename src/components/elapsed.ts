/** Whole seconds shared by the live clock, the saved row, and the stop announcement. */
export const elapsedSeconds = (startedAt: number, at: number): number => {
  if (!Number.isFinite(startedAt) || !Number.isFinite(at)) return 0;
  return Math.max(0, Math.floor((at - startedAt) / 1000));
};

export const formatDuration = (seconds: number): string => {
  const safe = elapsedSeconds(0, Math.max(0, seconds) * 1000);
  const minutes = Math.floor(safe / 60);
  const rest = safe % 60;
  return `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
};
