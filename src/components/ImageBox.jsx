import React, { Component } from 'react';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'; // This only needs to be imported once in your app
 

 
export default class ImageBox extends Component {
  constructor(props) {
    super(props);
 
    this.state = {
      
      isOpen: false,
    };
  }
 
  render() {
    const { isOpen } = this.state;
    //console.log(this.props.image)
    return (
      <div>
        <button  type="button" onClick={() => this.setState({ isOpen: true })}>
         {this.props.label}
        </button>
 
        {isOpen && (
          <Lightbox
            mainSrc={this.props.image}
            
            onCloseRequest={() => this.setState({ isOpen: false })}
           
          />
        )}
      </div>
    );
  }
}