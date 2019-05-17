import React, { Component } from 'react';
import Lightbox from 'react-image-lightbox';
import { ENDPOINTS} from '../utils/utils';
import 'react-image-lightbox/style.css'; // This only needs to be imported once in your app
import Axios from 'axios';

 
export default class ImageBox extends Component {
  constructor(props) {
    super(props);
 
    this.state = {
      
      isOpen: true,
    };
  }

  
  showWidget=(widget)=>{
    widget.open()
  }

  chekUploadResult = (resultEvent) =>{
    if (resultEvent.event  === 'success'){
        let info = resultEvent.info;
         this.guardar_url(info.secure_url,this.props.mandado)
    }
  }

  guardar_url(url,id){
    
    Axios.post(ENDPOINTS.editarmandadoss,'{"id":'+id+',"image":"'+url+'"}')
    .then(({ data }) => {
      console.log(data)
      
      
    })
    .catch((error) => {
      console.error(error);
    });

    this.setState({ isOpen: false })
  }

  
 
  render() {
    const { isOpen } = this.state;
    let widget =  window.cloudinary.createUploadWidget({
      cloudName:"roo",
      uploadPreset:"tw0hacxx"},(error, result)=>{this.chekUploadResult(result)})
   
    return (
      <div>
     { isOpen && (  <div id='photo-form-container'>
        <button onClick={() => widget.open()}>Subir imagen</button>
      </div>
      )}
      </div>
    );
  }
}