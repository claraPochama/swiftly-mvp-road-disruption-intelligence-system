import colors from './colors';
import typography from './typography';
import layout from './spacing';

// Usage in a component:
//   import { theme } from '../theme';
//   backgroundColor: theme.colors.primary[500]
//   ...theme.typography.heading.h3
//   padding: theme.layout.spacing[4]

export const theme = {
  colors,
  typography,
  layout,
};

export default theme;