import React, { useRef } from 'react';
import ReactToPrint from 'react-to-print';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import Barcode from 'react-barcode'
import { Button, FormControl, Container, Row, Col} from 'react-bootstrap';
 
export default class barcodeprint extends React.Component {
  render() {
      let itemsgenerados = this.props.itemsgenerados
    return (
      <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
        {itemsgenerados.map((t, i)=> (
            <Text><Row><Col><Barcode
            value={t.code}
            format="CODE128"
            /></Col></Row></Text>

        ))}
          
        </View>
       
      </Page>
    </Document>
    );
  }
}