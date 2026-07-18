// Typography scale from the Swiftly Figma design system.
// Fonts must be loaded via expo-font (see App.js) before these are used —
// Plus Jakarta Sans for headings, Poppins for body text, Aboreto for the
// "Swiftly" logo wordmark specifically.

export const fontFamily = {
  headingBold: 'PlusJakartaSans-Bold',
  bodyMedium: 'Poppins-Medium',
  bodyRegular: 'Poppins-Regular',
  logo: 'Aboreto-Regular',
};

export const heading = {
  h1: { fontFamily: fontFamily.headingBold, fontSize: 30 },
  h2: { fontFamily: fontFamily.headingBold, fontSize: 26 },
  h3: { fontFamily: fontFamily.headingBold, fontSize: 24 },
  h4: { fontFamily: fontFamily.headingBold, fontSize: 20 },
  h5: { fontFamily: fontFamily.headingBold, fontSize: 18 },
  h6: { fontFamily: fontFamily.headingBold, fontSize: 16 },
  h7: { fontFamily: fontFamily.headingBold, fontSize: 14 },
};

export const body = {
  b1: { fontFamily: fontFamily.bodyMedium, fontSize: 18 },
  b2: { fontFamily: fontFamily.bodyRegular, fontSize: 16 },
  b3: { fontFamily: fontFamily.bodyRegular, fontSize: 14 },
  b4: { fontFamily: fontFamily.bodyRegular, fontSize: 12 },
  b5: { fontFamily: fontFamily.bodyRegular, fontSize: 10 }, // footnotes/timestamps only
};

// Logo wordmark treatment — used only for the "SWIFTLY" brand text, not
// general headings.
export const logo = {
  fontFamily: fontFamily.logo,
  fontSize: 48,
  lineHeight: 48,
  letterSpacing: 0,
  textAlign: 'center',
};

export default { fontFamily, heading, body, logo };