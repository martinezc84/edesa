import React, { Component } from 'react';
import DatePicker from 'react-date-picker';
 
export default class Inputdate extends Component {
  state = {
    date: new Date(),
    
  }

  shouldComponentUpdate(np) {
		
		if(np.disable !== this.props.disable ){
			return true;
		}else{
			return false;
		}
		
	}
  
  onChange = date => this.setState({ date })
 
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

