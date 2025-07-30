export type ScreenProps = {
  children: React.ReactElement;
  pH?: number;
  withBackBtn?: boolean;
  headerTitle?: string;
  headerRight?: React.JSX.Element;
  onBackHandlerPress?: () => void;
  bgColor?: string;
};
