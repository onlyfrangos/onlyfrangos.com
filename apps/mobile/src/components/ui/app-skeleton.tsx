import { useEffect, useRef } from 'react';
import { Animated, type DimensionValue, StyleSheet } from 'react-native';

import { useTheme } from '../../theme/theme-provider';

type AppSkeletonProps = {
  height: number;
  isRound?: boolean;
  width?: DimensionValue;
};

export function AppSkeleton({ height, isRound = false, width = '100%' }: AppSkeletonProps) {
  const theme = useTheme();
  const opacity = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { duration: 700, toValue: 0.75, useNativeDriver: true }),
        Animated.timing(opacity, { duration: 700, toValue: 0.35, useNativeDriver: true }),
      ]),
    );
    animation.start();

    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.skeleton,
        {
          backgroundColor: theme.colors.surfaceElevated,
          borderRadius: isRound ? height / 2 : theme.radii.md,
          height,
          opacity,
          width,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  skeleton: {
    overflow: 'hidden',
  },
});
