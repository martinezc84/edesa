import uniqueId from 'lodash/uniqueId';
import React, { Component } from 'react';
import ReactSortable  from 'react-sortablejs';
import mandadostyles from '../css/mandados.css';
import {  Checkbox, Label } from 'semantic-ui-react';

// Functional Component
export default class SortableList extends Component {
cambiar=(id)=>{
    console.log(id)
    this.props.onSelect(id)
}
render(){

   let  {
        items
    } = this.props;

    let sortable = null; // sortable instance
    const reverseOrder = (evt) => {
        const order = sortable.toArray();
        onChange(order.reverse());
    };
    const listItems = items.map(val => (<li key={uniqueId()}  data-id={val.id}>{val.listorder} ) Descripción: {val.descripcion} Cliente: {val.cliente} 
    <Checkbox
    onChange={() => {
        this.cambiar(val.id)
        
    }}
    
    checked={val.realizado==1}
/></li>
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
                    onChange(order);
                }}
            >
                {listItems}
            </ReactSortable >
        </div>
    );
};


}
