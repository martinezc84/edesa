import uniqueId from 'lodash/uniqueId';
import React, { Component } from 'react';
import ReactSortable  from 'react-sortablejs';
import mandadostyles from '../css/mandados.css';
import {  Checkbox, Label, Button, Icon } from 'semantic-ui-react';
import ImageBox from '../components/ImageBox'
import UploadBox from '../components/uploadbox'
// Functional Component
export default class SortableList extends Component {
cambiar=(id,tipo)=>{
    //console.log(id)
    this.props.onSelect(id,tipo)
}

borrar=(id)=>{
    //console.log(id)
    this.props.Borrar(id)
}

autorizar=(id)=>{
    //console.log(id)
   this.props.autorizar(id)

}

editar=(id)=>{
    //console.log(id)
   this.props.editar(id)

}
render(){

   let  {
        items, group_id
    } = this.props;
    //console.log(this.props.firma)
    let sortable = null; // sortable instance
    const reverseOrder = (evt) => {
        const order = sortable.toArray();
        onChange(order.reverse());
    };
    const listItems = items.map(val => (
    <li className={(val.tipo == 1) ? 'cobro' : (val.tipo == 3) ? 'soporte':(val.tipo == 5) ? 'compra':''} key={uniqueId()}  data-id={val.id}>
    {val.listorder} )Hora: {val.hora} <strong>Encargado:</strong>{val.encargado} <strong>Descripción:</strong> {val.descripcion} Cliente: {val.cliente} 
    <strong>Nota:</strong>{(val.nota!=null ) ?  val.nota :('')}
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
    
    ) :('')
    }

{val.realizado == 0 && group_id<3  ? (
<Button >
     
      <Button.Content onClick={() => {
                    this.borrar(val.id);
                }} >
        <Icon name='trash' />
      </Button.Content>
    </Button>):("")
    }
    {val.autorizado == 0 && group_id<3  ? (
<Button onClick={() => {
                    this.autorizar(val.id);
                }} >
     Autorizar
      <Button.Content  >
      </Button.Content>
    </Button>):("")
    }
    {val.autorizado == 1 && group_id<3  ? (
<Button onClick={() => {
                    this.editar(val.id);
                }} >
     Editar
      <Button.Content  >
      </Button.Content>
    </Button>):("")
    }
</li>
));
    return (
        <div id="list">
            <button type="button" onClick={reverseOrder}>Reverse Order</button>
            <ReactSortable 
                // Sortable options (https://github.com/RubaXa/Sortable#options)
                options={{
                }}

                // [Optional] Use ref to get the sortable instance
                // https://facebook.github.io/react/docs/more-about-refs.html#the-ref-callback-attribute
                ref={(c) => {
                    if (c) {
                        sortable = c.sortable;
                    }
                }}

                // [Optional] A tag or react component to specify the wrapping element. Defaults to "div".
                // In a case of a react component it is required to has children in the component
                // and pass it down.
                tag="ul"

                // [Optional] The onChange method allows you to implement a controlled component and keep
                // DOM nodes untouched. You have to change state to re-render the component.
                // @param {Array} order An ordered array of items defined by the `data-id` attribute.
                // @param {Object} sortable The sortable instance.
                // @param {Event} evt The event object.
                onChange={(order, sortable, evt) => {
                    this.props.onChange(order);
                }}
            >
                {listItems}
            </ReactSortable >
        </div>
    );
};


}
