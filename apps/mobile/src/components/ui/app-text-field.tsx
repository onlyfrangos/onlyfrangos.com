import { StyleSheet, TextInput, type TextInputProps, View } from 'react-native';

import { useTheme } from '../../theme/theme-provider';
import { AppText } from './app-text';

type AppTextFieldProps = TextInputProps & {
  errorMessage?: string;
  label: string;
};

export function AppTextField({ errorMessage, label, style, ...inputProps }: AppTextFieldProps) {
  const theme = useTheme();

  return (
    <View style={styles.wrapper}>
      <AppText nativeID={`${inputProps.testID ?? label}-label`} weight="medium">
        {label}
      </AppText>
      <TextInput
        {...inputProps}
        accessibilityLabel={inputProps.accessibilityLabel ?? label}
        placeholderTextColor={theme.colors.muted}
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.surface,
            borderColor: errorMessage ? theme.colors.danger : theme.colors.border,
            color: theme.colors.text,
            fontFamily: theme.typography.bodyFontFamily,
            minHeight: theme.layout.minimumTouchTarget,
          },
          style,
        ]}
      />
      {errorMessage ? (
        <AppText accessibilityLiveRegion="polite" tone="danger" variant="caption">
          {errorMessage}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  wrapper: {
    gap: 6,
  },
});
