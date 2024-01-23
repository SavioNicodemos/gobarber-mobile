import styled from 'styled-components/native';

type Props = {
  $size: number;
};

export const UserAvatar = styled.Image<Props>`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: ${({ $size }) => $size / 2}px;
`;
