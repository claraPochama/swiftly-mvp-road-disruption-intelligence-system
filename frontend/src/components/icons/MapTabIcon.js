import Svg, { Circle, Path } from 'react-native-svg';

// Fixed brand colors (not tint-based) — this is a standalone marker design,
// not meant to shift color between active/inactive tab states.
export default function MapTabIcon({ size = 26 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 63 63" fill="none">
      <Circle cx={31.5} cy={31.5} r={27.5} fill="#97BE9F" />
      <Path
        d="M32.0001 19.5C26.4864 19.5 22.0001 23.9862 22.0001 29.4937C21.9639 37.55 31.6201 44.23 32.0001 44.5C32.0001 44.5 42.0364 37.55 42.0001 29.5C42.0001 23.9863 37.5139 19.5 32.0001 19.5ZM32.0001 34.5C29.2376 34.5 27.0001 32.2625 27.0001 29.5C27.0001 26.7375 29.2376 24.5 32.0001 24.5C34.7626 24.5 37.0001 26.7375 37.0001 29.5C37.0001 32.2625 34.7626 34.5 32.0001 34.5Z"
        fill="white"
      />
    </Svg>
  );
}