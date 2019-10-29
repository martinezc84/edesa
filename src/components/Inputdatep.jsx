import React, { Component } from 'react';
import DateInput from 'semantic-ui-calendar-react';
 
export default class Inputdatep extends Component {
  state = {
    date: '',
    
  }
  
  onChange = date => this.managedate(date)

  managedate(date){
  
    this.setState({ date });
    this.props.guardar(date,this.props.guardar_id)
  }
 
  render() {
   
    return (
      <div>
        <DateInput
          onChange={this.onChange}
          value={this.state.date}
          
          name={this.props.name}
          iconPosition="left"
         
        />
      </div>
    );
  }

  
}

