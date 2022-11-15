import styled, {css} from "styled-components/native";
import { Feather } from '@expo/vector-icons';
import { RFValue } from "react-native-responsive-fontsize";
import { RectButton, RectButtonProps } from "react-native-gesture-handler";
import { PropsWithChildren } from "react";

interface ButtonProps extends PropsWithChildren<RectButtonProps>{
}

interface IconProps {
  type: 'up' | 'down';
}

interface ContainerProps {
  isActive: boolean;
  type: 'up' | 'down';
}

export const Container = styled.View<ContainerProps>`
  width: 48%;
  
  border-width: ${({isActive}) => isActive ? 0 : 1.5}px;
  border-style: solid;
  border-color: ${({theme}) => theme.colors.text};
  border-radius: 5px;


  ${({theme, isActive, type}) => isActive && css`
    background-color: ${ type === "up" ? 
      theme.colors.success_light:
      theme.colors.attention_light
    };
  `}
`;

export const Button = styled(RectButton)<ButtonProps>`
  flex-direction: row;
  align-items: center;
  justify-content: center;

  padding: 16px;
`;


export const Icon = styled(Feather)<IconProps>`
  font-size: ${RFValue(24)}px;
  margin-right: 12;
  color: ${({theme, type}) => type === "up" ?  
    theme.colors.success : 
    theme.colors.attention }
`;

export const Title = styled.Text`
  font-family: ${({theme}) => theme.fonts.medium};
  font-size: ${RFValue(14)}px;
`;