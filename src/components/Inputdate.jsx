import React, { Component } from 'react';
import DatePicker from 'react-date-picker';
 
export default class Inputdate extends Component {
  state = {
    date: new Date(),
    
  }


  
  onChange = date => this.managedate(date)

  managedate(date){
    this.setState({ date });
    this.props.guardar(date,this.props.guardar_id)
  }
 
  render() {
    let disable = this.props;
    return (
      <div>
        <DatePicker
          onChange={this.onChange}
          value={this.state.date}
         
        />
      </div>
    );
  }

  
}

