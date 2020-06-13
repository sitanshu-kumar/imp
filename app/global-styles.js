import { createGlobalStyle } from 'styled-components';
import colors from './utils/colors';

const GlobalStyle = createGlobalStyle`
  html,
  body {
    height: 100%;
    width: 100%;
  }

  body {
    font-family:'SF Pro Display ', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  body.fontLoaded {
    font-family: 'SF Pro Display','Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  #app {
    background-color: #fafafa;
    min-height: 100%;
    min-width: 100%;
  }

 /*  p,
  label {
    font-family: Georgia, Times, 'Times New Roman', serif;
    line-height: 1.5em;
  } */
  .has-error .ant-form-explain, .has-error .ant-form-split {
    color: #f5222d;
    font-size:12px;
}
.ant-card-small > .ant-card-head > .ant-card-head-wrapper > .ant-card-head-title{
  padding: 16px 0;
  font-size: 16px;
}
.ant-card-small > .ant-card-body {
  padding: 24px;
}
.ant-input {
  height: 40px;
  &:hover, &:active, &:focus{
      border-color: ${colors.primaryColor};
      box-shadow: 0 0 0 2px rgba(238,126,45,0.1);
  }
}
.anticon svg{
  vertical-align: initial;
}
.ant-tooltip-inner {
  text-align: center;
}
.ant-slider-track{
  background-color: ${colors.primaryBlue};
  &:hover{
    background-color: ${colors.primaryBlue};
  }
}
.ant-slider-handle{
  border: solid 2px ${colors.primaryBlue};
}
.ant-calendar-picker-input.ant-input {
  height: 32px;
}
.public-DraftStyleDefault-ltr{
  margin: 0 !important;
}
.rdw-editor-wrapper{
  border: 1px solid #eee;
  width: 90%;
  margin:auto;
}
.ant-carousel .slick-slide {
  text-align: center;
  height: 160px;
  line-height: 160px;
  background: #364d79;
  overflow: hidden;
}

.ant-carousel .slick-slide h3 {
  color: #fff;
}
`;

export default GlobalStyle;
