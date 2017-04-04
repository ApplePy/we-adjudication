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
		    return this.get('store')
		    .query(emberName, { limit: 10, offset: 0 })
		    .then(records => {
		        // If the result was paginated, get all results
		        if (typeof records.get("meta").total !== "undefined" && records.get('meta').limit < records.get('meta').total) {
		          	return this.get('store')
		          	.query(emberName, { limit: records.get("meta").total })
		          	.then((placeholder) => {
		          		Ember.set(this.get('systemLists'), emberName, this.get('store').peekAll(emberName));
		          		return placeholder;
		          	});
		        } else {
		          	Ember.set(this.get('systemLists'), emberName, this.get('store').peekAll(emberName));
		          	return records;
		        }
	      	});
	  	};

	    // Populate the Secondary School course source, and subject list
	    getAll("program-record").then(records => {
	    	//Remove duplicate program records
		    let programRecordNames = new Set();
		    records.forEach(programRecord => {
		    	if (programRecordNames.has(programRecord.get('name')) === false) {
		    		programRecordNames.add(programRecord.get('name'));
		    	}
		    });
		    Ember.set(this.get('systemLists'), "program-record", [...programRecordNames]);
	    });
	    
	},

	actions: {

		//Dropdown value changed
		saveDropdownVal(event) {
			// Get value of dropdown
			let value = event.target.value;
			this.set("searchValue", value);
		},

		//Convert to PDF button clicked
		convertToPDF() {

			var doc = new jsPDF();

			//Gets required adjudication info
			this.getAdjudicationInfo.call(this).then(adjudicationInfo => {

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

		//Convert to Excel button clicked
		convertToExcel() {

			//Get required adjudication info
			this.getAdjudicationInfo.call(this).then(adjudicationInfo => {

				//Get worksheet
				function getSheet() {

					//Write column titles to Excel
					let keys = Object.keys(adjudicationInfo[0]);
					let C = 0;
					let ws = {};
					for (let col of keys) {
						let cell_ref = XLSX.utils.encode_cell({ c: C, r: 0 });
						ws[cell_ref] = { v: col };
						C++;
					}

					//Write to Excel
					let R = 1;
					for (let adjInfo of adjudicationInfo) {
						let keys = Object.keys(adjInfo);
						let C = 0;
						for (let col of keys) {
							let cell_ref = XLSX.utils.encode_cell({ c: C, r: R });
							ws[cell_ref] = { v: adjInfo[col] };
							C++;
						}
						R++;
					}

					return ws;
				}

				//Create workbook
				//var workbook = new XLSX.Workbook();
				let workbook = { SheetNames:[], Sheets:{} };

				//Add worksheet to workbook
				workbook.SheetNames.push("adjudicationSheet");
				workbook.Sheets["adjudicationSheet"] = getSheet();

				//Write exel file
				return XLSX.writeFile(workbook, 'adjudication.xlsx');
			});
		}
	},

	//Gets adjudication info based on selected search parameter
	getAdjudicationInfo() {

		return this.get('store').query('program-record', { //Get program record
			filter: {
				name: this.get("searchValue") //Program record has already been selected
			}
		}).then((programRecords) => {
			//Get all terms
			return this.get('store').query('term', {}).then(dummy => {
				return this.get('store').query('term', { limit: dummy.get('meta').total });
			}).then(terms => {
				//Filter terms to get the ones with the selected program record
				return terms.filter(term => {
					let findTerm = term.get('programRecords').find(programRecord => {
						let findProgramRecord = term.get('programRecords').find(progRec => programRecord.get('id') === progRec.get('id'));
						return (term.get('programRecords').indexOf(findProgramRecord) !== -1);
					});
					return (term.get('programRecords').indexOf(findTerm) !== -1);
				});
			});
		}).then(filteredTerms => {
			//Get students that are associated with the term
			return this.get('store').query('student', {}).then(dummy => {
				return this.get('store').query('student', { limit: dummy.get('meta').total });
			}).then(students => {
				return filteredTerms.map(term => {

					return this.get('store').findRecord("term", term.get('id'), { reload: true }).then(refreshedTerm => {

				    	term = refreshedTerm;

						return {
							term: term,
							student: term.get('student')
						};

				    });

				});
			});
		}).then(filteredTermsandStudents => {
			//Filter adjudication based on the selected terms
			return this.get('store').query('adjudication', {}).then(dummy => {
				return this.get('store').query('adjudication', { limit: dummy.get('meta').total });
			}).then(adjudications => {
				return adjudications.filter(adjudication => {
					let found = filteredTermsandStudents.find(termandstudent => adjudication.get('term.id') === termandstudent._result.term.get('id'));

					return (filteredTermsandStudents.indexOf(found) !== -1);
				});
			}).then(filteredAdjudications => {
				//Return adjudication and students
				return filteredAdjudications.map(adjudication => {
					return {
						adjudication: adjudication,
						student: filteredTermsandStudents.find(termandstudent => adjudication.get('term.id') === termandstudent._result.term.get('id'))._result.student
					};
				});
			});
		}).then(filteredAdjudicationsAndStudents => {

			//console.log(filteredAdjudicationsAndStudents);

			//Get the assessment codes associated with the adjudications
			return this.get('store').findAll('assessment-code').then(assessmentCode => {
				//Return the adjudication, student and assessment codes
				return filteredAdjudicationsAndStudents.map(adjudicationAndStudent => {

					//console.log(adjudicationAndStudent);

					return this.get('store').findRecord("adjudication", adjudicationAndStudent.adjudication.get('id'), { reload: true }).then(refreshedAdjudication => {

				    	let adjudication = refreshedAdjudication;

				    	console.log("here");
				    	console.log(adjudication);

						return {
							adjudication: adjudicationAndStudent.adjudication,
							student: adjudicationAndStudent.student,
							assessmentCode: adjudication.get('assessmentCode')
						};

				    });

					/*return {
						adjudication: adjudicationAndStudent.adjudication,
						student: adjudicationAndStudent.student,
						assessmentCode: adjudicationAndStudent.adjudication.get('assessmentCode')
					};*/
				});
			});
		}).then(adjudicationInfo => {

			//console.log(adjudicationInfo);

			//Parse adjudication info
			return adjudicationInfo.map(adjInfo => {

				/*console.log("AdjInfo:");
				console.log(adjInfo);
				console.log("adjInfo.student:");
				console.log(adjInfo.student);
				console.log("adjInfo.student.get('number')");
				console.log(adjInfo.student.get("number"));
				console.log("object:");*/

				console.log({
					Program: this.get("searchValue"),
					StudentNumber: adjInfo.student.get('number'),
					FirstName: adjInfo.student.get('firstName'),
					LastName: adjInfo.student.get('lastName'),
					AdjCode: adjInfo.assessmentCode.get('code'),
					AdjName: adjInfo.assessmentCode.get('name'),
					"Date": adjInfo.adjudication.get('date')
				});

				return {
					Program: this.get("searchValue"),
					StudentNumber: adjInfo.student.get('number'),
					FirstName: adjInfo.student.get('firstName'),
					LastName: adjInfo.student.get('lastName'),
					AdjCode: adjInfo.assessmentCode.get('code'),
					AdjName: adjInfo.assessmentCode.get('name'),
					"Date": adjInfo.adjudication.get('date')
				};
			});
		});
	}
});
