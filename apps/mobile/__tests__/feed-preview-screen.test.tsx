import { render } from '@testing-library/react-native';

import { FeedPreviewScreen } from '../src/features/feed/components/feed-preview-screen';

describe('<FeedPreviewScreen />', () => {
  it('renderiza a shell do feed e seus conteúdos principais', async () => {
    const screen = await render(<FeedPreviewScreen />);

    expect(screen.getByTestId('feed-screen')).toBeTruthy();
    expect(screen.getAllByText('@maromba_raiz')).toHaveLength(2);
    expect(screen.getByRole('button', { name: 'Buscar' })).toBeTruthy();
  });
});
