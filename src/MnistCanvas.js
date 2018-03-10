import React, { Component } from 'react';

class MnistCanvas extends Component {
  constructor(props) {
    super(props);
    
  }
  
  render() {
    return (
      <canvas ref={(element) => this.canvasElement = element} width={640} height={480} />
    );
  }

}

export default MnistCanvas;