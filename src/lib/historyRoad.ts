// Coordinates traced along the dashed centreline in the 1278 × 1230 road image.
const ROAD_WIDTH = 1278;
const fork = [
  { x: 1210, y: 146 },
  { x: 1060, y: 230 },
  { x: 639, y: 475 },
  { x: 639, y: 740 },
];

function curve(t: number) {
  const u = 1 - t;
  return {
    x: u ** 3 * fork[0].x + 3 * u ** 2 * t * fork[1].x + 3 * u * t ** 2 * fork[2].x + t ** 3 * fork[3].x,
    y: u ** 3 * fork[0].y + 3 * u ** 2 * t * fork[1].y + 3 * u * t ** 2 * fork[2].y + t ** 3 * fork[3].y,
    dx: 3 * u ** 2 * (fork[1].x - fork[0].x) + 6 * u * t * (fork[2].x - fork[1].x) + 3 * t ** 2 * (fork[3].x - fork[2].x),
    dy: 3 * u ** 2 * (fork[1].y - fork[0].y) + 6 * u * t * (fork[2].y - fork[1].y) + 3 * t ** 2 * (fork[3].y - fork[2].y),
  };
}

export function getHistoryRoadPosition(progress: number, width: number, height: number, mobile = width < 768) {
  const p = Math.min(1, Math.max(0, progress));
  if (mobile) {
    return { x: 44, y: 64 + p * Math.max(0, height - 192), rotate: 180 };
  }

  const scale = width / ROAD_WIDTH;
  const start = fork[0].y * scale;
  const end = Math.max(start, height - 256);
  const y = start + p * (end - start);
  const imageY = y / scale;
  if (imageY >= fork[3].y) return { x: width / 2, y, rotate: 180 };

  // Solve against the image's Y coordinate, never a percentage of timeline height.
  let low = 0;
  let high = 1;
  for (let i = 0; i < 24; i++) {
    const mid = (low + high) / 2;
    if (curve(mid).y < imageY) low = mid;
    else high = mid;
  }
  const point = curve((low + high) / 2);
  return {
    x: point.x * scale,
    y,
    rotate: Math.atan2(point.dy, point.dx) * 180 / Math.PI + 90,
  };
}
