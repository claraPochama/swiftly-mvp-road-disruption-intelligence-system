import Svg, { Path, G, ClipPath, Rect, Defs } from 'react-native-svg';

export default function CautionAlertIcon({ size = 28 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Path
        d="M0 10C0 4.47715 4.47715 0 10 0H18C23.5228 0 28 4.47715 28 10V18C28 23.5228 23.5228 28 18 28H10C4.47715 28 0 23.5228 0 18V10Z"
        fill="#F5F8F4"
      />
      <Defs>
        <ClipPath id="clipCautionAlert">
          <Rect width={14} height={14} fill="white" transform="translate(7 7)" />
        </ClipPath>
      </Defs>
      <G clipPath="url(#clipCautionAlert)">
        <Path
          d="M7.00033 12.8337C10.222 12.8337 12.8337 10.222 12.8337 7.00033C12.8337 3.77866 10.222 1.16699 7.00033 1.16699C3.77866 1.16699 1.16699 3.77866 1.16699 7.00033C1.16699 10.222 3.77866 12.8337 7.00033 12.8337Z"
          stroke="#E67700"
          strokeWidth={1.16667}
          strokeLinecap="round"
          strokeLinejoin="round"
          transform="translate(7 7)"
        />
        <Path d="M7 4.66699V7.00033" stroke="#E67700" strokeWidth={1.16667} strokeLinecap="round" strokeLinejoin="round" transform="translate(7 7)" />
        <Path d="M7 9.33301H7.00583" stroke="#E67700" strokeWidth={1.16667} strokeLinecap="round" strokeLinejoin="round" transform="translate(7 7)" />
      </G>
    </Svg>
  );
}