// Decorative gradient bars along the bottom of the home page.
// [left, width, height] as percentages of the strip, read off the design.
const bars: [number, number, number][] = [
  [0, 7.6, 47],
  [7.6, 6.1, 63],
  [13.7, 4.1, 79],
  [17.8, 6, 100],
  [23.8, 9.3, 71],
  [33.1, 5.2, 50],
  [49.1, 3.1, 32],
  [52.2, 8.8, 50],
  [61, 8.1, 61],
  [69.1, 5.2, 79],
  [74.3, 6.4, 100],
  [80.7, 5.2, 50],
  [85.9, 3.9, 68],
  [89.8, 10.2, 90],
];

export function BottomBars() {
  return (
    <div aria-hidden className="relative h-32 w-full overflow-hidden sm:h-48">
      {bars.map(([left, width, height]) => (
        <span
          key={left}
          className="absolute bottom-0 bg-linear-to-t from-primary-400 via-primary-300/70 to-primary-200/0"
          style={{ left: `${left}%`, width: `${width}%`, height: `${height}%` }}
        />
      ))}
    </div>
  );
}
