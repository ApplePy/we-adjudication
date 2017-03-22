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
		          		Ember.set(this.get('systemLists'), emberName, this.get('store').peekAll(emberName));
		          	});
		        } else {
		          	Ember.set(this.get('systemLists'), emberName, this.get('store').peekAll(emberName));
		        }
	      	});
	  	};

	    // Populate the Secondary School course source, and subject list
	    getAll("program-record");

	    //Remove duplicate program records
	    let programRecordNames = new Set();
	    for (let programRecord of Ember.get(this.get('systemLists'), "program-record")) {
	    	if (programRecordNames.has(programRecord.name) === false) {
	    		programRecordNames.add(programRecord.name);
	    	}
	    }
	    Ember.set(this.get('systemLists'), "program-record", programRecordNames);

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
			getAdjudicationInfo.call(this).then(adjudicationInfo => {

				let adjudicationInfo = adjudicationInfo.map(adjInfo => {
					Program: this.get("searchValue"),
					StudentNumber: adjInfo.student.get('number'),
					FirstName: adjInfo.student.get('firstName'),
					LastName: adjInfo.student.get('lastName'),
					AdjCode: adjInfo.assessmentCode.get('code'),
					AdjName: adjInfo.assessmentCode.get('name'),
					"Date": adjInfo.adjudication.get('date')
				});

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
				return doc.save('adjudication.pdf');
			});

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

	//Given program record
	return this.get('store').query('program-record', {
		filter: {
			name: this.get("searchValue");
		}
	}).then((programRecords) => {
		//Get all terms
		//TODO: this is pagenated
		return this.get('store').findAll('term').then(terms => {
			return terms.filter(term => {
				let termIndex = term.programRecords.findIndex(programRecord => {
					let programRecordIndex = programRecords.findIndex(progRec => 
						return programRecord.get('id') === progRec.get('id')
					);
					return (programRecordIndex !== -1);
				});
				return (termIndex !== -1);
			});
		});
	}).then(filteredTerms => {
		return this.get('store').query('student', {}).then(dummy => {
			return this.get('store').query('student', {limit: dummy.get('meta').total});
		}).then(students => {
			return filteredTerms.map(term => {
				term: term,
				student: term.get('student')
			});
		});
	}).then(filteredTermsandStudents => {
		return this.get('store').query('adjudication', {}).then(dummy => {
			return this.get('store').query('adjudication', {limit: dummy.get('meta').total});
		}).then(adjudications => {
			return adjudications.filter(adjudication => {
				let foundIndex = filteredTermsandStudents.findIndex(termandstudent => adjudication.get('term.id') === termandstudent.term.get('id'));

				return (foundIndex !== -1);
			});	
		}).then(filteredAdjudications => {
			return filteredAdjudications.map(adjudication => {
				adjudication: adjudication,
				student: filteredTermsandStudents.find(termandstudent => adjudication.get('term.id') === termandstudent.term.get('id')).student
			});
		});
	}).then(filteredAdjudicationsAndStudents => {
		return this.get('store').findAll('assessment-code').then(assessmentCode => {
			return filteredAdjudicationsAndStudents.map(adjudicationAndStudent => {
				adjudication: adjudicationAndStudent.adjudication,
				student: adjudicationAndStudent.student,
				assessmentCode: adjudicationAndStudent.adjudication.get('assessmentCode')
			});
		});
	});

}
