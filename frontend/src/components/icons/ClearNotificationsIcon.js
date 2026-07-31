import Svg, { Path, G, ClipPath, Rect, Defs } from 'react-native-svg';

// Includes its own rounded-square background (fill #F5F8F4), same pattern
// as the Map pin / Route Radio icons — not tint-based.
export default function ClearNotificationsIcon({ size = 28 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Path
        d="M0 10C0 4.47715 4.47715 0 10 0H18C23.5228 0 28 4.47715 28 10V18C28 23.5228 23.5228 28 18 28H10C4.47715 28 0 23.5228 0 18V10Z"
        fill="#F5F8F4"
      />
      <Defs>
        <ClipPath id="clipClearNotifications">
          <Rect width={14} height={14} fill="white" transform="translate(7 7)" />
        </ClipPath>
      </Defs>
      <G clipPath="url(#clipClearNotifications)">
        <Path
          d="M19.7172 12.8337C19.9836 14.1411 19.7937 15.5004 19.1793 16.6847C18.5648 17.8691 17.5629 18.8071 16.3406 19.3421C15.1183 19.8772 13.7495 19.9771 12.4624 19.6251C11.1754 19.2731 10.048 18.4905 9.2681 17.4079C8.48823 16.3252 8.10309 15.0079 8.17691 13.6757C8.25072 12.3434 8.77903 11.0767 9.67373 10.0869C10.5684 9.09701 11.7754 8.44378 13.0935 8.23612C14.4115 8.02847 15.7609 8.27895 16.9166 8.94578"
          stroke="#2D6A4F"
          strokeWidth={1.16667}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M12.25 13.4163L14 15.1663L19.8333 9.33301"
          stroke="#2D6A4F"
          strokeWidth={1.16667}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
    </Svg>
  );
}