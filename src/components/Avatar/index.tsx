import React from 'react';
import { ImageStyle, StyleProp } from 'react-native';
import defaultAvatar from '../../assets/defaultAvatar.jpg';
import api from '../../services/api';
import { UserAvatar } from './styles';

type Props = {
  source: string | null;
  size?: number;
  style?: StyleProp<ImageStyle>;
};

export function Avatar({ source, size = 50, style }: Props) {
  const initialImage =
    source && typeof source === 'string'
      ? {
          uri: `${api.defaults.baseURL!.split('3333')[0]}3333${source.split('3333')[1]}`,
        }
      : defaultAvatar;

  return <UserAvatar style={style} $size={size} source={initialImage} />;
}
