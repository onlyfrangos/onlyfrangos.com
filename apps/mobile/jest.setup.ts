jest.mock('expo-font', () => ({
  useFonts: () => [true, null],
}));

jest.mock('expo-secure-store', () => ({
  WHEN_UNLOCKED_THIS_DEVICE_ONLY: 'WHEN_UNLOCKED_THIS_DEVICE_ONLY',
  deleteItemAsync: jest.fn().mockResolvedValue(undefined),
  getItemAsync: jest.fn().mockResolvedValue(null),
  setItemAsync: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('lucide-react-native', () => {
  function MockIcon() {
    return null;
  }

  return {
    AlertCircle: MockIcon,
    Ban: MockIcon,
    Bookmark: MockIcon,
    Camera: MockIcon,
    ChevronRight: MockIcon,
    CircleHelp: MockIcon,
    CloudOff: MockIcon,
    Dumbbell: MockIcon,
    FileText: MockIcon,
    Grip: MockIcon,
    Heart: MockIcon,
    Home: MockIcon,
    ImagePlus: MockIcon,
    Inbox: MockIcon,
    LoaderCircle: MockIcon,
    LogOut: MockIcon,
    Menu: MockIcon,
    MessageCircle: MockIcon,
    MoreHorizontal: MockIcon,
    Plus: MockIcon,
    Search: MockIcon,
    Send: MockIcon,
    Settings: MockIcon,
    Shield: MockIcon,
    UserRound: MockIcon,
    UserRoundPen: MockIcon,
    X: MockIcon,
  };
});
