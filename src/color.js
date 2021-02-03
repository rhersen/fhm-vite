function interpolate(
  x0,
  y0,
  x1,
  y1,
  x,
) {
  return y0 + ((x - x0) * (y1 - y0)) / (x1 - x0);
}

export function red(x) {
  if (x < 60) return interpolate(0, 245, 60, 230, x);
  return interpolate(60, 230, 960, 135, x);
}

export function green(x) {
  if (x < 60) return interpolate(0, 214, 60, 148, x);
  if (x < 120) return interpolate(60, 148, 120, 88, x);
  if (x < 960) return interpolate(120, 88, 960, 0, x);
  return 0;
}

export function blue(x) {
  if (x > 50) return 0;
  return interpolate(0, 100, 50, 0, x);
}
