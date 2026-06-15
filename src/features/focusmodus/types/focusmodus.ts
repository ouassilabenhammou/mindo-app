export type focusSchermProps = {
  remainingSeconds: number;
  isPaused: boolean;
  onPause: () => void;
  onResume: () => void;

  onMinutenChange: (minuten: number) => void;
};

export type focusStartProps = {
  minuten: number;
  onMinutenChange: (minuten: number) => void;
  onStart: () => void;
};

export type focusTimerProps = {
  remainingSeconds: number;
  progress: number;
  size?: number;
  donker?: boolean;
};

export type minutenKiezerProps = {
  minuten: number;
  onMinutenChange?: (minuten: number) => void;
  size?: number;
  donker?: boolean;
  resterendeSeconden?: number;
};

export type Thema = {
  ringAchtergrond: string;
  ringActief: string;
  tickActief: string;
  tickInactief: string;
  markerActief: string;
  markerInactief: string;
  knopRand: string;
  centrumWaarde: string;
  centrumLabel: string;
};
