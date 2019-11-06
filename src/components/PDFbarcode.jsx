//@ts-check
import React, { Component } from 'react';
import Barcode from 'react-barcode';
import {
	Document,
	Page,
	Text,
	View,
	StyleSheet
  } from "@react-pdf/renderer";
 

  const styles = StyleSheet.create({
	page: {
	  flexDirection: "row"
	},
	section: {
	  flexGrow: 1
	}
  });

export default class PDFbarcode extends Component {

	state ={
	}
	componentDidMount() {
	
	}


	render() {
		let codes = this.props.codes

		return(
		<Document>
			<Page size="A4" style={styles.page}>
			
				{codes
					.map((t) => (<Barcode
						value={t.code}
						format="EAN13"
						/>))
					}
			
			
			
			</Page>
		</Document>	
		)
		
	}
}