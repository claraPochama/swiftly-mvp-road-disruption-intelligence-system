import Svg, { Circle, Path } from 'react-native-svg';

// Standalone circular icon (includes its own background circle), same
// pattern as the Route Radio button icon.
export default function ReportIncidentIcon({ size = 56 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 85 85" fill="none">
      <Circle cx={42.5} cy={42.5} r={27.5} fill="#DFECE0" />
      <Path
        d="M43 32.1875C43.7514 32.1876 44.4926 32.8203 44.4365 33.6582L44.4355 33.6572L43.9688 46.2812L43.9639 46.377C43.9419 46.5987 43.8435 46.8069 43.6846 46.9658C43.5029 47.1474 43.2569 47.2499 43 47.25C42.7431 47.25 42.4961 47.1475 42.3145 46.9658C42.1372 46.7883 42.0368 46.5492 42.0322 46.2988L41.5625 33.6436L41.5635 33.6426C41.5175 32.8123 42.2532 32.1875 43 32.1875Z"
        fill="#498058"
        stroke="#498058"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M43 50.9375C43.7939 50.9375 44.4375 51.5811 44.4375 52.375C44.4375 53.1689 43.7939 53.8125 43 53.8125C42.2061 53.8125 41.5625 53.1689 41.5625 52.375C41.5625 51.5811 42.2061 50.9375 43 50.9375Z"
        fill="#498058"
        stroke="#498058"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}