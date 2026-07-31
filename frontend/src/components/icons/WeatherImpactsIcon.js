import Svg, { Path, G, ClipPath, Rect, Defs } from 'react-native-svg';

export default function WeatherImpactsIcon({ size = 28 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Path
        d="M0 10C0 4.47715 4.47715 0 10 0H18C23.5228 0 28 4.47715 28 10V18C28 23.5228 23.5228 28 18 28H10C4.47715 28 0 23.5228 0 18V10Z"
        fill="#F5F8F4"
      />
      <Defs>
        <ClipPath id="clipWeatherImpacts">
          <Rect width={14} height={14} fill="white" transform="translate(7 7)" />
        </ClipPath>
      </Defs>
      <G clipPath="url(#clipWeatherImpacts)">
        <Path
          d="M9.62363 8.74968H4.6653C3.90805 8.74948 3.16577 8.53872 2.52141 8.14095C1.87706 7.74318 1.356 7.17406 1.01647 6.4972C0.676941 5.82034 0.532317 5.0624 0.598757 4.30807C0.665198 3.55375 0.940087 2.83275 1.39271 2.22566C1.84532 1.61857 2.45784 1.1493 3.16181 0.870292C3.86578 0.59128 4.63347 0.513518 5.37909 0.645696C6.12471 0.777874 6.81889 1.11478 7.38406 1.61878C7.94922 2.12277 8.36311 2.774 8.57946 3.49968H9.62363C10.3198 3.49968 10.9875 3.77624 11.4798 4.26852C11.9721 4.7608 12.2486 5.42848 12.2486 6.12468C12.2486 6.82087 11.9721 7.48855 11.4798 7.98083C10.9875 8.47311 10.3198 8.74968 9.62363 8.74968Z"
          stroke="#5A6B58"
          strokeWidth={1.16667}
          strokeLinecap="round"
          strokeLinejoin="round"
          transform="translate(7.5 9)"
        />
      </G>
    </Svg>
  );
}