//import { HMSkeletonLoader } from '@app/components';
import { Image as CustomImage } from 'expo-image';
import React, { useState } from 'react';
import type { CustomImageProps } from './types';
import { SkeletonLoader } from 'app/components';

const Image = ({
  uri,
  width,
  height,
  circle = false,
  bR,
  ui = {},
  fill = false,
}: CustomImageProps) => {
  const [loadError, setLoadError] = useState(false);

    if (!uri || loadError) {
    return (
      <SkeletonLoader
        width={width || '100%'}
        height={height || '100%'}
        bR={circle ? (height || 0) / 2 : bR}
      />
    );
  }

  return (
    <CustomImage
      source={uri}
      contentFit={fill ? 'fill' : 'cover'}
      style={{
        width: width || '100%',
        height: height || '100%',
        borderRadius: circle ? (typeof height === 'number' ? height / 2 : 0) : bR,
        ...ui,
        borderWidth: 0,
      }}
      onError={() => {
        setLoadError(true);
      }}
    />
  );
};

export default Image;
