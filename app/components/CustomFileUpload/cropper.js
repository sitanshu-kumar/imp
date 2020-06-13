import React, { Component } from 'react';
import 'cropperjs/dist/cropper.css';
import PropTypes from 'prop-types';
import Cropper from 'react-cropper';
import { Button } from 'antd';
/* global FileReader */

const src = 'img/child.jpg';

export default class CropperView extends Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    console.log('====>>>>>', nextProps, prevState);
    if (nextProps.file !== prevState.src) {
      return { src: nextProps.file };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      src: props.file,
      cropResult: null,
    };
    this.cropImage = this.cropImage.bind(this);
    this.onChange = this.onChange.bind(this);
    this.useDefaultImage = this.useDefaultImage.bind(this);
  }

  onChange(e) {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      this.setState({ src: reader.result });
    };
    reader.readAsDataURL(files[0]);
  }

  cropImage() {
    if (typeof this.cropper.getCroppedCanvas() === 'undefined') {
      return;
    }
    // console.log(this.cropper.getCroppedCanvas().toDataURL());

    // console.log(
    //   URL.createObjectUrl(this.cropper.getCroppedCanvas().toDataURL()),
    // );54321
    this.setState({
      cropResult: this.cropper.getCroppedCanvas().toDataURL(),
    });

    if (this.props.onBase64Data) {
      this.props.onBase64Data(this.cropper.getCroppedCanvas().toDataURL());
    }
  }

  useDefaultImage() {
    this.setState({ src });
  }

  render() {
    return (
      <div>
        <div style={{ width: '100%' }}>
          <input type="file" onChange={this.onChange} />
          <br />
          <br />
          <Cropper
            style={{ height: 400, width: '100%' }}
            aspectRatio={3 / 4}
            preview=".img-preview"
            guides={false}
            src={this.state.src}
            ref={cropper => {
              this.cropper = cropper;
            }}
          />
        </div>
        <div>
          {/* <div className="box" style={{ width: '50%', float: 'right' }}>
            <h1>Preview</h1>
            <div
              className="img-preview"
              style={{ width: '100%', float: 'left', height: 300 }}
            />
          </div> */}
          <div className="box" style={{ width: '50%', float: 'right' }}>
            <h1>
              <Button
                type="primary"
                onClick={this.cropImage}
                style={{ float: 'right' }}
              >
                Crop Image
              </Button>
            </h1>
            {/* <img
              style={{ width: '100%' }}
              src={this.state.cropResult}
              alt="cropped image"
            /> */}
          </div>
        </div>
        <br style={{ clear: 'both' }} />
      </div>
    );
  }
}

CropperView.propTypes = {
  file: PropTypes.string,
  onBase64Data: PropTypes.func,
};
