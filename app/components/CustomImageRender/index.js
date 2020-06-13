/**
 *
 * CustomImageRender
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledImg = styled.img``;

function CustomImageRender(props) {
  const { urldata, type } = props;
  let url = '';
  if (urldata && urldata.baseUrl) {
    url = urldata.baseUrl;
    if (type) {
      url += `${type}/${urldata.videoThumbnail || urldata.name}`;
    } else {
      url += urldata.videoThumbnail || urldata.name;
    }
  }
  if (urldata && urldata.uri) {
    url = urldata.uri;
  }

  return <StyledImg {...props} src={url} alt="" />;
}

CustomImageRender.propTypes = {
  urldata: PropTypes.object,
  type: PropTypes.string,
};

export default memo(CustomImageRender);
