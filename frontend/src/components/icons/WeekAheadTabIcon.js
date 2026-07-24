import Svg, { Path } from 'react-native-svg';

// Only the calendar icon shape — the source SVG also included separate
// vector text glyphs (same "icon + label" combo pattern as the Alerts icon),
// which we skip since the tab bar already renders its own text label.
export default function WeekAheadTabIcon({ size = 20, color = '#C1D9C4' }) {
  return (
    <Svg width={size} height={(size * 25) / 25} viewBox="16 0 30 30" fill="none">
      <Path
        d="M18.5 23.75C18.5 25.875 20.125 27.5 22.25 27.5H39.75C41.875 27.5 43.5 25.875 43.5 23.75V13.75H18.5V23.75ZM39.75 5H37.25V3.75C37.25 3 36.75 2.5 36 2.5C35.25 2.5 34.75 3 34.75 3.75V5H27.25V3.75C27.25 3 26.75 2.5 26 2.5C25.25 2.5 24.75 3 24.75 3.75V5H22.25C20.125 5 18.5 6.625 18.5 8.75V11.25H43.5V8.75C43.5 6.625 41.875 5 39.75 5Z"
        fill={color}
      />
    </Svg>
  );
}