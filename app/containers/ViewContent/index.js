/**
 *
 * ViewContent
 *
 */

import React, { memo, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { useParams } from 'react-router-dom';

import { useInjectReducer } from 'utils/injectReducer';
import styled from 'styled-components';
import { Typography } from 'antd';
import makeSelectViewContent from './selectors';
import reducer from './reducer';

import ModuleService from '../../utils/services/ModuleService';
import colors from '../../utils/colors';

import CustomImageRender from '../../components/CustomImageRender';
const { Title, Text, Paragraph } = Typography;

export function ViewContent() {
  useInjectReducer({ key: 'viewContent', reducer });
  const [data, setData] = useState({});
  const params = useParams();

  useEffect(() => {
    async function loadContent(id) {
      const payload = {
        population: JSON.stringify([
          'topicId',
          'chapterId',
          'classId',
          'flashcards',
          'video',
          '3dVideo',
          'vrVideo',
          'thumbnail',
          'articleCover',
        ]),
      };
      const [, response] = await ModuleService.getModule(
        `contents/${id}`,
        payload,
      );
      if (response && response.data) {
        setData(response.data);
      }
    }

    if (params && params.id) {
      loadContent(params.id);
    }
  }, []);

  return (
    <div>
      <Helmet>
        <title>ViewContent</title>
        <meta name="description" content="Description of ViewContent" />
      </Helmet>
      <Wrapper>
        {data && data._id && (
          <div>
            <Typography>
              <Title>{data.title}</Title>
              {data.detailLink && (
                <Paragraph>
                  <Text>View more at : </Text>
                  <a href={data.detailLink} target="_blank">
                    {data.detailLink}
                  </a>
                </Paragraph>
              )}
              {data.postType === 'flashcards' &&
                data.flashcards &&
                !!data.flashcards.length && (
                  <ImageWrapper>
                    {data.flashcards.map(item => (
                      <StyledImage urldata={item} />
                    ))}
                  </ImageWrapper>
                )}

              {data.postType === 'video' && data.video && (
                <video
                  src={data.video.baseUrl + data.video.name}
                  type="video/mp4"
                  controls
                />
              )}

              <div dangerouslySetInnerHTML={{ __html: data.description }} />
            </Typography>
          </div>
        )}
      </Wrapper>
    </div>
  );
}

ViewContent.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  viewContent: makeSelectViewContent(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(ViewContent);

const Wrapper = styled.div`
  width: 100%;
  padding: 10px;
  background: ${colors.white};
`;

const ImageWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
`;

const StyledImage = styled(CustomImageRender)`
  width: 200px;
  margin-bottom: 20px;
  border-radius: 25px;
  object-fit: contain;
`;
