import Ember from 'ember';

import XLSX from "npm:xlsx-browserify-shim";
import jsPDF from "npm:jspdf";


export default Ember.Component.extend({

	store: Ember.inject.service(),
	searchValue: null,
	systemLists: {
	    "program-record": []
  	},

	init() {
		this._super(...arguments);

	    // Get all the records necessary for the dropdown
	    let getAll = emberName => {
		    // Get the records
		    this.get('store')
		    .query(emberName, { limit: 10, offset: 0 })
		    .then(records => {
		        // If the result was paginated, get all results
		        if (typeof records.get("meta").total !== "undefined" && records.get('meta').limit < records.get('meta').total) {
		          	this.get('store')
		          	.query(emberName, { limit: records.get("meta").total })
		          	.then(() => {
		          		Ember.set(this.get('systemLists'), emberName, this.get('store').peekAll(emberName))
		          	});
		        } else {
		          	Ember.set(this.get('systemLists'), emberName, this.get('store').peekAll(emberName));
		        }
	      	});
	  	};

	    // Populate the Secondary School course source, and subject list
	    getAll("program-record");
	},


	actions: {

		saveDropdownVal(event) {
		    // Get value of dropdown
		    let value = event.target.value;
		    this.set("searchValue", value);
	    },

		convertToPDF() {

			var doc = new jsPDF();

			//Saves information to be printed out
			let adjudicationInfo = getAdjudicationInfo.call(this);

			//Write to PDF
			let y = 10;
			for (let adjInfo of adjudicationInfo) {
				let keys = Object.keys(adjInfo);
				let x = 10;
				for (let col of keys) {
					doc.text(adjInfo[col], x, y);
					x += 20;
				}
				y += 20;
				if (y >= 100) {
					doc.addPage();
					y = 0;
				}
			}

			//Save document
			doc.save('adjudication.pdf');
		},

		convertToExcel() {

			//Saves information to be printed out
			let adjudicationInfo = getAdjudicationInfo.call(this);

			//Get worksheet
			function getSheet() {

				//Write column titles to Excel
				let keys = Object.keys(adjudicationInfo[0]);
				let C = 0;
				for (let col of keys) {
					var cell_ref = XLSX.utils.encode_cell({c:C,r:0});
					ws[cell_ref] = {v: col};
					C++;
				}

				//Write to Excel
				var ws = {};
				let R = 1;
				for (let adjInfo of adjudicationInfo) {
					let keys = Object.keys(adjInfo);
					let C = 0;
					for (let col of keys) {
						var cell_ref = XLSX.utils.encode_cell({c:C,r:R});
						ws[cell_ref] = {v: adjInfo[col]};
						C++;
					}
					R++;
				}

				return ws;
			}

			//Create workbook
			var workbook = new Workbook();

			//Add worksheet to workbook
			workbook.SheetNames.push("adjudicationSheet");
			workbook.Sheets[ws_name] = getSheet();

			//Write exel file
			XLSX.writeFile(workbook, 'adjudication.xlsx');

		}
	}

});

//Gets adjudication info based on selected search parameter
getAdjudicationInfo() {

	//Let adjudicationInfo be an array of objects.  One object per row of info.
	let adjudicationInfo = [];

	//Populate adjudication info
	this.get('store').query('program-record', {
		filter: {
			name: this.get("searchValue");
		}
	}).then((programRecords) => {
		let terms = [];
		for (let programRecord of programRecords) {
			this.get('store').query('term', {
				filter: {
					programRecords: programRecord
				}
			}).then((terms) => {
				let term = records.get('firstObject');
			});
		}		
	});

	return adjudicationInfo;

}
