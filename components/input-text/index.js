import styled from "styled-components"
import {InputButtonBox} from "components/boxes"
import Color from "color"
export const Input = InputButtonBox.withComponent("input").extend``;

export const InputDark = Input.extend`
  background-color: ${props=>props.theme.colors.grayLight};
  
  &::placeholder {
    color: ${props=>Color(props.theme.colors.grayLight).darken(0.2).hsl().string()};
  }
`;

export default Input