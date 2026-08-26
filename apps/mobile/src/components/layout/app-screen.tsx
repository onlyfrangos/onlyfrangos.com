import { type PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, View, type ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../../theme/theme-provider';

type AppScreenProps = PropsWithChildren<
  ViewProps & {
    isScrollable?: boolean;
  }
>;

export function AppScreen({ children, isScrollable = false, style, ...viewProps }: AppScreenProps) {
  const theme = useTheme();
  const contentStyle = [
    styles.content,
    {
      maxWidth: theme.layout.contentMaximumWidth,
      paddingHorizontal: theme.layout.screenHorizontalPadding,
    },
    style,
  ];

  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
    >
      {isScrollable ? (
        <ScrollView
          {...viewProps}
          contentContainerStyle={contentStyle}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View {...viewProps} style={contentStyle}>
          {children}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingBottom: 24,
    width: '100%',
  },
  safeArea: {
    flex: 1,
  },
});
