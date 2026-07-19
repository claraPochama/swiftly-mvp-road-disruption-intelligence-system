import { Dimensions } from 'react-native';
import Svg, { Path, Circle, G, Defs, ClipPath } from 'react-native-svg';

const { width } = Dimensions.get('window');

// Original Figma export is 402x329 — keep that exact aspect ratio when
// stretching to fill the actual device width.
export const WAVE_HEADER_HEIGHT = width * (329 / 402);

const WAVE_PATH_D =
  'M0 0H402V317.61C402 317.61 341.48 301.5 301.5 301.5C261.52 301.5 201 317.61 201 317.61C201 317.61 141.708 328.782 101 328.5C61.4376 328.226 0 317.61 0 317.61V0Z';

// Big circle + logo, positioned in the same 402x329 coordinate space as the
// wave path, then clipped by that exact wave shape — so the circle's bottom
// is cropped following the real wavy contour, not a straight line.
// Usage: <WaveHeaderGraphic waveColor={...} circleColor={...} logoColor={...} />
export default function WaveHeaderGraphic({ waveColor, circleColor, logoColor }) {
  const circleCx = 201;
  const circleCy = 195;
  const circleR = 160;

  // Logo's native viewBox is 201x201 — scale and center it inside the circle,
  // filling most of the circle's diameter so the S's points nearly touch the edge.
  const logoScale = (circleR * 2 * 0.85) / 201;
  const logoOffset = circleR * 0.85;

  return (
    <Svg width={width} height={WAVE_HEADER_HEIGHT} viewBox="0 0 402 329">
      <Defs>
        <ClipPath id="waveClip">
          <Path d={WAVE_PATH_D} />
        </ClipPath>
      </Defs>

      <Path d={WAVE_PATH_D} fill={waveColor} />

      <G clipPath="url(#waveClip)">
        <Circle cx={circleCx} cy={circleCy} r={circleR} fill={circleColor} />
        <G
          transform={`translate(${circleCx - logoOffset}, ${circleCy - logoOffset}) scale(${logoScale})`}
        >
          <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M178.108 19.7543C159.447 27.2931 93.8015 56.2716 102.613 71.5912C109.558 83.6668 169.845 81.5683 160.032 116.284C149.725 152.746 50.3402 174.598 38.9606 177.515C33.5572 178.901 33.5917 178.837 28.1563 179.92C29.0988 178.513 29.3189 178.825 30.782 178.054C31.1489 178.016 30.7825 178.561 31.1973 178.517C31.4256 178.493 31.417 178.477 33.9567 177.721C61.3083 169.572 87.4978 156.848 91.9914 154.665C95.7852 152.822 126.237 138.026 134.394 123.333C148.545 97.8421 109.132 90.5408 98.35 86.8495C53.1168 71.3643 103.978 42.2118 158.61 24.9973C176.564 19.3399 176.691 18.978 178.108 19.7543Z"
            fill={logoColor}
          />
          <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M179.61 17.5623C178.117 20.278 176.468 17.21 134 32.223C116.158 38.5307 83.4901 52.9886 78.0335 66.5831C65.8443 96.9501 142.159 87.603 131.153 119.385C129.01 125.576 119.272 137.309 93.0571 151.543C64.0437 167.296 40.9181 174.328 30.7823 178.054C29.3192 178.825 29.0991 178.513 28.1566 179.919C25.1281 180.577 25.2134 180.624 22.2324 181.366C18.2268 182.363 25.5614 179.276 25.8762 179.144C38.7378 173.73 71.1693 156.367 90.2065 141.344C115.786 121.159 113.299 111.014 95.5927 104.107C92.5566 102.923 35.0219 87.5537 68.1326 56.5594C97.0915 29.4517 164.21 20.2235 179.61 17.5623Z"
            fill={logoColor}
          />
        </G>
      </G>
    </Svg>
  );
}