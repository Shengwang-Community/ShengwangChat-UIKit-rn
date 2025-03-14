import type { ImageProps as RNImageProps } from 'react-native';
import { NativeModules } from 'react-native';

export type ImageProps = Omit<RNImageProps, 'onLoad' | 'onError'> & {
  onLoad?: (event: { width: number; height: number }) => void;
  onError?: (event: { error?: unknown }) => void;
  tintColor?: string;
};

export type ImageComponent = (props: ImageProps) => JSX.Element;

function getImageComponent(): ImageComponent {
  const hasFastImage = Boolean(NativeModules.FastImageView);
  if (hasFastImage) {
    try {
      return require('./FastImage').default;
    } catch (e) {
      return require('./Image').default;
    }
  } else {
    return require('./Image').default;
  }
}

export default getImageComponent();
