import Svg, { Path, G, ClipPath, Rect, Defs } from 'react-native-svg';

export default function CriticalAlertIcon({ size = 28 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Path
        d="M0 10C0 4.47715 4.47715 0 10 0H18C23.5228 0 28 4.47715 28 10V18C28 23.5228 23.5228 28 18 28H10C4.47715 28 0 23.5228 0 18V10Z"
        fill="#F5F8F4"
      />
      <Defs>
        <ClipPath id="clipCriticalAlert">
          <Rect width={14} height={14} fill="white" transform="translate(7 7)" />
        </ClipPath>
      </Defs>
      <G clipPath="url(#clipCriticalAlert)">
        <Path
          d="M12.6759 10.5003L8.00925 2.33363C7.90749 2.15408 7.75993 2.00474 7.58162 1.90083C7.40331 1.79693 7.20062 1.74219 6.99425 1.74219C6.78787 1.74219 6.58519 1.79693 6.40688 1.90083C6.22856 2.00474 6.081 2.15408 5.97925 2.33363L1.31258 10.5003C1.20973 10.6784 1.1558 10.8806 1.15625 11.0863C1.15671 11.2919 1.21153 11.4939 1.31517 11.6715C1.41881 11.8492 1.56758 11.9963 1.7464 12.0979C1.92522 12.1996 2.12774 12.2521 2.33341 12.2503H11.6667C11.8714 12.2501 12.0725 12.196 12.2497 12.0935C12.4269 11.9911 12.574 11.8438 12.6762 11.6664C12.7785 11.4891 12.8323 11.288 12.8322 11.0833C12.8322 10.8786 12.7783 10.6776 12.6759 10.5003Z"
          stroke="#C92A2A"
          strokeWidth={1.16667}
          strokeLinecap="round"
          strokeLinejoin="round"
          transform="translate(7 7)"
        />
        <Path d="M7 5.25V7.58333" stroke="#C92A2A" strokeWidth={1.16667} strokeLinecap="round" strokeLinejoin="round" transform="translate(7 7)" />
        <Path d="M7 9.91699H7.00583" stroke="#C92A2A" strokeWidth={1.16667} strokeLinecap="round" strokeLinejoin="round" transform="translate(7 7)" />
      </G>
    </Svg>
  );
}