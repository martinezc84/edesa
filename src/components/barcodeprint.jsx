import React, { useRef } from 'react';
import ReactToPrint from 'react-to-print';
import Barcode from 'react-barcode'
import { Button, FormControl, Container, Row, Col} from 'react-bootstrap';
 
export default class barcodeprint extends React.Component {
  render() {
      let itemsgenerados = this.props.itemsgenerados
    return (
        {itemsgenerados.map((t, i)=> (
            <Row><Col><Barcode
            value={t.code}
            format="CODE128"
            /></Col></Row>

        ))}
    );
  }
}