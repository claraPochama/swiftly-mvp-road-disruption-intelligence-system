import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { theme } from '../../theme';
import Button from '../../components/Button';
import { useUserType } from '../../context/UserTypeContext';

const userTypes = [
  {
    key: 'driver',
    title: 'Driver',
    description: 'Audio alerts, hands-free, route-specific.',
    expandedDescription:
      "Stay informed without touching your screen — Swiftly's audio radio reads your route conditions aloud so you can keep your eyes on the road.",
    iconPath:
      'M25.7392 6.36328C26.6337 6.36331 27.5106 6.6124 28.2715 7.08265C29.0325 7.5529 29.6475 8.22573 30.0477 9.02577L32.2734 13.4756C32.6652 13.315 33.0506 13.1415 33.4296 12.9553C33.8107 12.7649 34.2519 12.7337 34.6561 12.8687C35.0602 13.0036 35.3942 13.2935 35.5846 13.6747C35.775 14.0559 35.8061 14.4971 35.6712 14.9012C35.5363 15.3054 35.2464 15.6394 34.8652 15.8297C34.4792 16.0015 34.0911 16.1685 33.701 16.3308L35.2442 19.4188C35.5791 20.0884 35.7534 20.8268 35.7532 21.5754V25.6334C35.7532 26.3112 35.6102 26.9814 35.3335 27.6001C35.0567 28.2188 34.6526 28.7722 34.1474 29.2241V31.2539C34.1474 31.8927 33.8936 32.5054 33.4419 32.9571C32.9901 33.4088 32.3775 33.6626 31.7386 33.6626C31.0998 33.6626 30.4871 33.4088 30.0354 32.9571C29.5836 32.5054 29.3298 31.8927 29.3298 31.2539V30.4509H10.0597V31.2539C10.0597 31.8927 9.80595 32.5054 9.35422 32.9571C8.90248 33.4088 8.2898 33.6626 7.65096 33.6626C7.01212 33.6626 6.39944 33.4088 5.94771 32.9571C5.49598 32.5054 5.2422 31.8927 5.2422 31.2539V29.2241C4.25621 28.3409 3.63635 27.0594 3.63635 25.6334V21.5738C3.63665 20.8262 3.81093 20.089 4.1454 19.4204L5.67577 16.3564C5.28823 16.1937 4.9055 16.0187 4.5276 15.8313C4.14835 15.6385 3.86006 15.3043 3.72489 14.9009C3.58971 14.4975 3.61847 14.0571 3.80497 13.6747C3.89916 13.4859 4.02964 13.3175 4.18895 13.1791C4.34826 13.0408 4.53327 12.9352 4.7334 12.8684C4.93354 12.8016 5.14488 12.7749 5.35535 12.7898C5.56582 12.8047 5.77129 12.8609 5.96001 12.9553C6.34006 13.1426 6.72546 13.316 7.11621 13.4756L9.34191 9.02738C9.74185 8.22703 10.3568 7.55387 11.1177 7.08333C11.8787 6.61279 12.7557 6.36346 13.6504 6.36328H25.7392ZM12.4685 20.8159C11.8296 20.8159 11.217 21.0697 10.7652 21.5214C10.3135 21.9731 10.0597 22.5858 10.0597 23.2246C10.0597 23.8635 10.3135 24.4762 10.7652 24.9279C11.217 25.3796 11.8296 25.6334 12.4685 25.6334C13.1073 25.6334 13.72 25.3796 14.1717 24.9279C14.6235 24.4762 14.8773 23.8635 14.8773 23.2246C14.8773 22.5858 14.6235 21.9731 14.1717 21.5214C13.72 21.0697 13.1073 20.8159 12.4685 20.8159ZM26.9211 20.8159C26.2822 20.8159 25.6696 21.0697 25.2178 21.5214C24.7661 21.9731 24.5123 22.5858 24.5123 23.2246C24.5123 23.8635 24.7661 24.4762 25.2178 24.9279C25.6696 25.3796 26.2822 25.6334 26.9211 25.6334C27.5599 25.6334 28.1726 25.3796 28.6243 24.9279C29.0761 24.4762 29.3298 23.8635 29.3298 23.2246C29.3298 22.5858 29.0761 21.9731 28.6243 21.5214C28.1726 21.0697 27.5599 20.8159 26.9211 20.8159ZM25.7392 9.57497H13.6504C13.3861 9.57493 13.1258 9.64013 12.8928 9.76479C12.6597 9.88944 12.461 10.0697 12.3143 10.2896L12.2148 10.463L10.1753 14.5386C12.6612 15.2837 16.011 15.9983 19.6948 15.9983C23.1345 15.9983 26.2804 15.3753 28.7036 14.6864L29.2126 14.5386L27.1748 10.463C27.0566 10.2266 26.8819 10.0231 26.6662 9.87044C26.4505 9.71777 26.2005 9.62069 25.9383 9.58781L25.7408 9.57497H25.7392Z',
  },
  {
    key: 'passenger',
    title: 'Passenger',
    description: 'View, report and track road disruptions.',
    expandedDescription:
      'As a passenger you have time to dig deeper — browse route details, flag road conditions, and check what\'s coming up on the road ahead.',
    iconPath:
      'M15.9949 32.0317L25.9621 31.2223L26.2319 34.5447L16.2647 35.3541C11.6798 35.7264 7.65651 32.3075 7.28418 27.7226L6.07008 12.7718L9.39247 12.502L10.6066 27.4528C10.8305 30.2104 13.2373 32.2556 15.9949 32.0317ZM16.5205 9.26445C17.711 7.86349 17.5397 5.75377 16.1387 4.56326C14.7377 3.37275 12.628 3.54407 11.4375 4.94503C10.247 6.34598 10.4183 8.45571 11.8193 9.64622C13.2216 10.8533 15.3147 10.6834 16.5205 9.26445ZM18.7989 15.0825C18.6505 13.2551 17.034 11.8815 15.2067 12.0299L14.3761 12.0973C12.5487 12.2457 11.1751 13.8622 11.3235 15.6895L12.1329 25.6567C12.3568 28.4143 14.7636 30.4595 17.5212 30.2356L25.9434 29.5516L32.2298 34.8937L34.4124 32.3253L25.3062 24.5869L19.6083 25.0496L18.7989 15.0825Z',
  },
  {
    key: 'emergency',
    title: 'Emergency Personnel',
    description: 'Verified disruption data and team coordination.',
    expandedDescription:
      'Access priority incident dashboards, verify road reports, and coordinate with responding units — all from one secure operational interface.',
    iconPath:
      'M9.99996 33.3333C9.52774 33.3333 9.13219 33.1733 8.8133 32.8533C8.49441 32.5333 8.33441 32.1378 8.3333 31.6667C8.33219 31.1956 8.49219 30.8 8.8133 30.48C9.13441 30.16 9.52996 30 9.99996 30H11L14.2916 19.0417C14.5139 18.3195 14.9239 17.7433 15.5216 17.3133C16.1194 16.8833 16.7789 16.6678 17.5 16.6667H22.5C23.2222 16.6667 23.8822 16.8822 24.48 17.3133C25.0777 17.7444 25.4872 18.3206 25.7083 19.0417L29 30H30C30.4722 30 30.8683 30.16 31.1883 30.48C31.5083 30.8 31.6677 31.1956 31.6666 31.6667C31.6655 32.1378 31.5055 32.5339 31.1866 32.855C30.8677 33.1761 30.4722 33.3356 30 33.3333H9.99996ZM18.3333 11.6667V6.66667C18.3333 6.19445 18.4933 5.79889 18.8133 5.48001C19.1333 5.16112 19.5289 5.00112 20 5.00001C20.4711 4.99889 20.8672 5.15889 21.1883 5.48001C21.5094 5.80112 21.6689 6.19667 21.6666 6.66667V11.6667C21.6666 12.1389 21.5066 12.535 21.1866 12.855C20.8666 13.175 20.4711 13.3345 20 13.3333C19.5289 13.3322 19.1333 13.1722 18.8133 12.8533C18.4933 12.5345 18.3333 12.1389 18.3333 11.6667ZM27.0833 13.9167L30.625 10.375C30.9305 10.0694 31.3127 9.90945 31.7716 9.89501C32.2305 9.88056 32.6261 10.0406 32.9583 10.375C33.2639 10.6806 33.4166 11.0695 33.4166 11.5417C33.4166 12.0139 33.2639 12.4028 32.9583 12.7083L29.4166 16.2917C29.0833 16.625 28.6944 16.7917 28.25 16.7917C27.8055 16.7917 27.4166 16.625 27.0833 16.2917C26.75 15.9583 26.5833 15.5628 26.5833 15.105C26.5833 14.6472 26.75 14.2511 27.0833 13.9167ZM31.6666 21.6667H36.6666C37.1389 21.6667 37.535 21.8267 37.855 22.1467C38.175 22.4667 38.3344 22.8622 38.3333 23.3333C38.3322 23.8045 38.1722 24.2006 37.8533 24.5217C37.5344 24.8428 37.1389 25.0022 36.6666 25H31.6666C31.1944 25 30.7989 24.84 30.48 24.52C30.1611 24.2 30.0011 23.8045 30 23.3333C29.9989 22.8622 30.1589 22.4667 30.48 22.1467C30.8011 21.8267 31.1966 21.6667 31.6666 21.6667ZM10.5833 16.25L7.04163 12.7083C6.73608 12.4028 6.57663 12.0211 6.5633 11.5633C6.54996 11.1056 6.70941 10.7095 7.04163 10.375C7.34719 10.0694 7.73608 9.91667 8.2083 9.91667C8.68052 9.91667 9.06941 10.0694 9.37496 10.375L12.9583 13.9167C13.2916 14.25 13.4583 14.6389 13.4583 15.0833C13.4583 15.5278 13.2916 15.9167 12.9583 16.25C12.625 16.5833 12.2294 16.75 11.7716 16.75C11.3139 16.75 10.9177 16.5833 10.5833 16.25ZM3.3333 25C2.86108 25 2.46552 24.84 2.14663 24.52C1.82774 24.2 1.66774 23.8045 1.66663 23.3333C1.66552 22.8622 1.82552 22.4667 2.14663 22.1467C2.46774 21.8267 2.8633 21.6667 3.3333 21.6667H8.3333C8.80552 21.6667 9.20163 21.8267 9.52163 22.1467C9.84163 22.4667 10.0011 22.8622 9.99996 23.3333C9.99885 23.8045 9.83885 24.2006 9.51996 24.5217C9.20108 24.8428 8.80552 25.0022 8.3333 25H3.3333Z',
  },
];

export default function UserTypeScreen({ navigation }) {
  const [expandedKey, setExpandedKey] = useState(null);
  const { setUserType } = useUserType();

  const handleCardPress = (key) => {
    // Tapping an already-expanded card collapses it again; tapping a
    // different card expands that one instead.
    setExpandedKey(expandedKey === key ? null : key);
  };

  const handleContinue = (typeKey) => {
    // Store the selected role globally so MainTabNavigator (and any other
    // screen) can read it directly, instead of threading it through every
    // navigation call between here and the main app.
    setUserType(typeKey);
    navigation.navigate('LoginSignupChooser');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Who are you today?</Text>
        <Text style={styles.headerSubtitle}>
          Your experience is tailored to your role.
        </Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.sectionLabel}>SELECT YOUR USER TYPE</Text>

        {userTypes.map((type) => {
          const isExpanded = expandedKey === type.key;

          return (
            <Pressable
              key={type.key}
              style={({ pressed }) => [
                styles.card,
                isExpanded && styles.cardExpanded,
                pressed && styles.cardPressed,
              ]}
              onPress={() => handleCardPress(type.key)}
            >
              <View style={styles.cardTopRow}>
                <View style={styles.iconWrap}>
                  <Svg width={24} height={24} viewBox="0 0 40 40" fill="none">
                    <Path d={type.iconPath} fill={theme.colors.neutral[900]} />
                  </Svg>
                </View>
                <View style={styles.cardTextCompact}>
                  <Text style={styles.cardTitle}>{type.title}</Text>
                  {!isExpanded && (
                    <Text style={styles.cardDescription}>{type.description}</Text>
                  )}
                </View>
              </View>

              {isExpanded && (
                <View style={styles.expandedContent}>
                  <Text style={styles.expandedDescription}>
                    {type.expandedDescription}
                  </Text>
                  <Button
                    label="Continue"
                    onPress={() => handleContinue(type.key)}
                  />
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#DFECE0',
    paddingTop: theme.layout.spacing[9],
    paddingBottom: theme.layout.spacing[8],
    paddingHorizontal: theme.layout.spacing[6],
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  headerTitle: {
    ...theme.typography.heading.h2,
    color: '#498058',
  },
  headerSubtitle: {
    ...theme.typography.body.b3,
    color: '#498058',
    marginTop: theme.layout.spacing[1],
  },
  body: {
    paddingHorizontal: theme.layout.spacing[6],
    marginTop: theme.layout.spacing[7],
  },
  sectionLabel: {
    ...theme.typography.body.b4,
    color: theme.colors.neutral[500],
    letterSpacing: 1,
    marginBottom: theme.layout.spacing[3],
  },
  card: {
    backgroundColor: theme.colors.secondary[50],
    borderRadius: theme.layout.radius[4],
    padding: theme.layout.spacing[4],
    marginBottom: theme.layout.spacing[3],
    overflow: 'hidden',
  },
  cardExpanded: {
    paddingBottom: theme.layout.spacing[5],
  },
  cardPressed: {
    backgroundColor: theme.colors.secondary[100],
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: theme.layout.radius[4],
    backgroundColor: theme.colors.primary[200],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.layout.spacing[4],
  },
  cardTextCompact: {
    flex: 1,
  },
  cardTitle: {
    ...theme.typography.heading.h6,
    color: theme.colors.neutral[900],
  },
  cardDescription: {
    ...theme.typography.body.b4,
    color: theme.colors.neutral[500],
    marginTop: 2,
  },
  expandedContent: {
    marginTop: theme.layout.spacing[3],
  },
  expandedDescription: {
    ...theme.typography.body.b3,
    color: theme.colors.neutral[600],
    marginBottom: theme.layout.spacing[4],
  },
});