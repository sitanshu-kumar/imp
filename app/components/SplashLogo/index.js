/**
 *
 * SplashLogo
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import logoImage from '../../images/logo.png';
const StyledImage = styled.img`
  width: ${props => (props.width ? props.width : 'auto')};
`;
function SplashLogo(props) {
  return <StyledImage width={props.width} src={logoImage} />;
}

SplashLogo.propTypes = {
  width: PropTypes.string,
};

export default memo(SplashLogo);
