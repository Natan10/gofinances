import React from 'react';
import {TextInputProps} from 'react-native';

import { Container } from './styles';

type Props = TextInputProps & {
  active?: boolean;
};

export const Input = ({active=false,...rest}: Props) => {
  return <Container active={active}  {...rest} />;
}
