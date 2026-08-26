import { fireEvent, render } from '@testing-library/react-native';

import { AppButton } from '../src/components/ui/app-button';

describe('<AppButton />', () => {
  it('expõe um alvo acessível e executa a ação', async () => {
    const onPress = jest.fn();
    const screen = await render(<AppButton label="Publicar" onPress={onPress} />);

    await fireEvent.press(screen.getByRole('button', { name: 'Publicar' }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('bloqueia a ação enquanto carrega', async () => {
    const onPress = jest.fn();
    const screen = await render(<AppButton isLoading label="Publicar" onPress={onPress} />);
    const button = screen.getByRole('button');

    await fireEvent.press(button);

    expect(button.props.accessibilityState).toMatchObject({ busy: true, disabled: true });
    expect(onPress).not.toHaveBeenCalled();
  });
});
