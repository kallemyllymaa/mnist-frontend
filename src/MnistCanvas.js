import React, { Component } from 'react';

import axios from 'axios';

class MnistCanvas extends Component {
  constructor(props) {
    super(props);
    this.touchMoveHandler = this.touchMoveHandler.bind(this);
    this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
    this.setMouseDown = this.setMouseDown.bind(this);
    this.scaleImage = this.scaleImage.bind(this);
    this.state = {
      mouseDown: false
    }
  }

  componentDidMount() {
    this.paintItWhite();
  }

  touchMoveHandler(e) {
    // e.preventDefault();
    // console.log(e.nativeEvent.changedTouches[0].pageX);
    const rect = this.canvasElement.getBoundingClientRect();
    this.draw(e.nativeEvent.touches[0].clientX - rect.left, e.nativeEvent.touches[0].clientY - rect.top);
  }

  mouseMoveHandler(e) {
    if (this.state.mouseDown) {
      this.draw(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    }
  }

  draw(x, y) {
    const ctx = this.canvasElement.getContext('2d');
    ctx.beginPath();
    ctx.arc(x, y, 18, 0, 2 * Math.PI, false);

    /*const grd = ctx.createRadialGradient(x, y, 6, x, y, 12);
    grd.addColorStop(0, "#060606");
    grd.addColorStop(0.9, "#222222");
    grd.addColorStop(1, "#414141");

    ctx.fillStyle = grd;*/
    ctx.fill();
  }

  paintItWhite() {
    const ctx = this.canvasElement.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 640, 480);

    ctx.fillStyle = '#060606';
  }

  setMouseDown(down) {
    this.setState({
      mouseDown: down
    })
  }

  roundToThree(num) {
    return +(Math.round(num + "e+3") + "e-3");
  }

  scaleImage() {
    console.log('scaling...')
    const ctx = this.canvasElement.getContext('2d');
    const temp = this.cloneCanvas(this.canvasElement);
    this.paintItWhite();
    ctx.drawImage(temp, 0, 0, 28, 28);
    const imageData = ctx.getImageData(0, 0, 28, 28);
    const newTemp = this.cloneCanvas(this.canvasElement);
    this.paintItWhite();
    ctx.drawImage(newTemp, 0, 0, 28, 28, 0, 0, 480, 480);
    let aPix = imageData.data;
    const nPixLen = aPix.length;
    let naks = [];
    for (let nPixel = 0; nPixel < nPixLen; nPixel += 4) {
      naks.push((aPix[nPixel] + aPix[nPixel + 1] + aPix[nPixel + 2]) / 3);
    }
    axios({
      method: 'post',
      url: 'http://localhost:5000/predict',
      responseType: 'json',
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify({
        data: naks.map((pix) => pix / 255).map((val) => 1 - val).map(this.roundToThree)
      })
    }).then(function (response) {
      const plop = response.data.predictions[0];
      console.log(plop.indexOf(Math.max(...plop)))
    });
  }

  cloneCanvas(oldCanvas) {

    //create a new canvas
    var newCanvas = document.createElement('canvas');
    var context = newCanvas.getContext('2d');

    //set dimensions
    newCanvas.width = oldCanvas.width;
    newCanvas.height = oldCanvas.height;

    //apply the old canvas to the new one
    context.drawImage(oldCanvas, 0, 0);

    //return the new canvas
    return newCanvas;
  }

  render() {
    return (
      <div>
        <canvas
          ref={(element) => this.canvasElement = element}
          width={480}
          height={480}
          onTouchMove={this.touchMoveHandler}
          onMouseMove={this.mouseMoveHandler}
          onMouseDown={(e) => this.setMouseDown(true)}
          onMouseUp={(e) => this.setMouseDown(false)}
          onMouseLeave={(e) => this.setMouseDown(false)} />
        <button onClick={this.scaleImage}>scale</button>
      </div>
    );
  }

}

export default MnistCanvas;