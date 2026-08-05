// Colors pulled directly from the Swiftly Figma design system.
// Naming matches the Figma scale (50 lightest -> 950 darkest) so it's easy
// to cross-reference back to the design file.

export const primary = {
  50: '#F2F7F3',
  100: '#DFECE0',
  200: '#C1D9C4',
  300: '#97BE9F',
  400: '#6A9D76',
  500: '#498058', // core brand green
  600: '#366543',
  700: '#2B5137',
  800: '#24412D',
  900: '#1B3022',
  950: '#0E2523',
};

export const secondary = {
  50: '#F5F5F0',
  100: '#E9E9DE',
  200: '#D4D6C0',
  300: '#B9BC9A',
  400: '#A2A77F',
  500: '#81875B',
  600: '#646A46',
  700: '#4D5239',
  800: '#404331',
  900: '#383B2C',
  950: '#1C1E15',
};

export const secondaryWarm = {
  50: '#F8F9ED',
  100: '#EEF1D0',
  200: '#E3E7AF',
  300: '#D1D470',
  400: '#C6C549',
  500: '#B7B13B',
  600: '#9D8F31',
  700: '#7E6C2A',
  800: '#6A5729',
  900: '#5C4A27',
  950: '#342814',
};

export const neutral = {
  50: '#F6F6F6',
  100: '#E7E7E7',
  200: '#D1D1D1',
  300: '#B0B0B0',
  400: '#888888',
  500: '#6D6D6D',
  600: '#5D5D5D',
  700: '#4F4F4F',
  800: '#454545',
  900: '#333333',
  950: '#262626',
};

// Feedback colors — map directly to the severity system
export const red = {
  50: '#FEEDED',
  100: '#FEE5E5',
  200: '#FBD0D2',
  300: '#F8A9AD',
  400: '#F478B1',
  500: '#EA4958',
  600: '#D72741',
  700: '#B51836',
  800: '#981933',
  900: '#821931',
  950: '#480916',
};

export const orange = {
  50: '#FEF6E7',
  100: '#FDF1D7',
  200: '#FBDFAD',
  300: '#F8C679',
  400: '#F3A444',
  500: '#F0891F',
  600: '#E16F15',
  700: '#BB5413',
  800: '#954317',
  900: '#783816',
  950: '#411A09',
};

export const green = {
  50: '#F3FAF7',
  100: '#D7F0E9',
  200: '#AEE1D2',
  300: '#7ECAB7',
  400: '#53AE99',
  500: '#3A9281',
  600: '#2E7A6C',
  700: '#275E55',
  800: '#234C46',
  900: '#21403B',
  950: '#0E2523',
};

// Semantic aliases — use these in components for severity states
export const severity = {
  caution: orange[500],
  cautionBg: orange[50],
  cautionBorder: orange[300],
  disrupted: red[500],
  disruptedBg: red[50],
  disruptedBorder: red[300],
  clear: green[600],
  clearBg: green[50],
  clearBorder: green[200],
};

export default {
  primary,
  secondary,
  secondaryWarm,
  neutral,
  red,
  orange,
  green,
  severity,
};