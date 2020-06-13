import styled from 'styled-components';
import { Card, Button } from 'antd';
import colors from '../utils/colors';

export const HorizontalContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: ${props => props.padding || `0px`};
`;
export const VerticalContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const CardLayout = styled(Card)`
  border: 1px solid ${colors.primaryGrey};
  width: 414px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
`;

export const PrimaryButton = styled(Button)`
  width: ${props => (props.width ? props.width : '100%')};
  background-color: ${colors.primaryColor};
  border-color: ${colors.primaryColor};
  &:hover,
  &:active,
  &:focus {
    background-color: ${colors.primaryInteractionColor};
    border-color: ${colors.primaryInteractionColor};
  }
  height: 40px;
  &.ant-btn span {
    font-weight: bold;
    font-size: 16px;
    color: ${colors.white};
  }
  &.ant-btn .anticon svg {
    color: ${colors.white};
  }
`;
