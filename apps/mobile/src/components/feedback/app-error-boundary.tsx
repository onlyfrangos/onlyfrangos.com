import { Component, type PropsWithChildren, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppButton } from '../ui/app-button';
import { AppText } from '../ui/app-text';

type AppErrorBoundaryState = {
  hasError: boolean;
};

export class AppErrorBoundary extends Component<PropsWithChildren, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  private reset = () => {
    this.setState({ hasError: false });
  };

  render(): ReactNode {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <View accessibilityLiveRegion="assertive" style={styles.fallback}>
        <AppText variant="subtitle" weight="bold">
          Algo saiu do previsto
        </AppText>
        <AppText style={styles.centered} tone="muted">
          Tente carregar esta tela novamente. Nenhum dado sensível é exibido neste erro.
        </AppText>
        <AppButton label="Tentar novamente" onPress={this.reset} variant="secondary" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  centered: {
    textAlign: 'center',
  },
  fallback: {
    alignItems: 'center',
    flex: 1,
    gap: 12,
    justifyContent: 'center',
    padding: 32,
  },
});
