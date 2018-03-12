import React, { Component } from 'react';

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
    ctx.arc(x - 10, y - 10, 20, 0, 2 * Math.PI, false);
    ctx.fill();
  }

  paintItWhite() {
    const ctx = this.canvasElement.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 640, 480);
    ctx.fillStyle = '#000000';
  }

  setMouseDown(down) {
    this.setState({
      mouseDown: down
    })
  }

  scaleImage() {
    console.log('scaling...')
    const ctx = this.canvasElement.getContext('2d');
    const temp = this.cloneCanvas(this.canvasElement);
    this.paintItWhite();
    ctx.drawImage(temp, 0, 0, 28, 28);
    const newTemp = this.cloneCanvas(this.canvasElement);
    this.paintItWhite();
    ctx.drawImage(newTemp, 0, 0, 28, 28, 0, 0, 480, 480);
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