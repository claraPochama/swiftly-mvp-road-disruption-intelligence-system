import Svg, { Path } from 'react-native-svg';

// Only the actual triangle/warning icon shape from the export — the source
// SVG also included separate vector text glyphs (an "icon + label" combo
// export), which we skip since the tab bar already renders its own text label.
// Accepts a color prop so it can match the tab bar's active/inactive tint,
// same as React Navigation's built-in icon color behavior.
export default function AlertsTabIcon({ size = 20, color = '#498058' }) {
  return (
    <Svg width={size} height={(size * 27) / 35} viewBox="0 0 35 27" fill="none">
      <Path
        d="M6.4126 25C9.41585 16.5203 12.0262 12.1733 18.0001 5C24.0005 12.1944 26.6157 16.5407 29.5876 25C20.4252 26.2534 15.4038 26.3029 6.4126 25ZM18.5426 21.7925C18.6943 21.6408 18.7701 21.46 18.7701 21.25C18.7701 21.04 18.6943 20.8592 18.5426 20.7075C18.3909 20.5558 18.2101 20.4804 18.0001 20.4812C17.7901 20.4821 17.6093 20.5575 17.4576 20.7075C17.3059 20.8575 17.2305 21.0383 17.2313 21.25C17.2322 21.4617 17.3076 21.6425 17.4576 21.7925C17.6076 21.9425 17.7884 22.0179 18.0001 22.0187C18.2118 22.0196 18.3926 21.9442 18.5426 21.7925ZM17.3751 19.23C17.8538 19.3257 18.1464 19.3257 18.6251 19.23C21.0185 18.7513 19.2501 14.375 18.0001 12.98C17.4586 13.0883 18.4788 12.8843 18.0001 12.98C16.7501 14.375 14.9817 18.7513 17.3751 19.23Z"
        fill={color}
      />
    </Svg>
  );
}