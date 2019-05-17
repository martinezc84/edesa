import uniqueId from 'lodash/uniqueId';
import React, { Component } from 'react';
import mandadostyles from '../css/mandados.css';
import {  Checkbox, Label, Button, Icon } from 'semantic-ui-react';
import ImageBox from '../components/ImageBox'
import UploadBox from '../components/uploadbox'
// Functional Component
export default class SortableList extends Component {
cambiar=(id, tipo)=>{
    //console.log(id)
    this.props.onSelect(id, tipo)
}

borrar=(id)=>{
    console.log(id)
    this.props.Borrar(id)
}
render(){

   let  {
        items
    } = this.props;
   
    const listItems = items.map(val => (
    <li className={(val.tipo == 1) ? 'cobro' : (val.tipo == 3) ? 'soporte':''} key={uniqueId()}  data-id={val.id}>
    {val.listorder} )Hora: {val.hora} Descripción: {val.descripcion} Cliente: {val.cliente} 
    <Checkbox
    onChange={() => {
        
        if(val.realizado == 0){
            val.realizado = 1;
            this.cambiar(val.id,val.tipo)
        }
        
    }}    
    checked={val.realizado == 1}
/>
{val.realizado == 1 && val.sign == 1 ? (
<ImageBox
    image={process.env.GATSBY_URL_IMAGES+'/signature_'+val.id+'.png'}
    label={"Firma"}
/>

) :("")
}

{val.image != null ? (
    <ImageBox
        image={val.image}
        label={"Foto"}
    />
    
    ) :(<UploadBox
        mandado={val.id}
        >       
    </UploadBox>)
    }


</li>
)

);
    return (
        <div id="list">
            
           <ul>
               {listItems}
           </ul>
        </div>
    );
};


}
