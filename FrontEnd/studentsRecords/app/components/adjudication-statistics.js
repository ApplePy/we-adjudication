import Ember from 'ember';

import XLSX from "npm:xlsx-browserify-shim";
import jsPDF from "npm:jspdf";
import map from 'npm:async/map';
import FileSaver from 'npm:file-saver';


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

			var doc = new jsPDF({orientation: 'landscape'});

			//Gets required adjudication info
			this.getAdjudicationInfo.call(this).then(adjudicationInfo => {

				//Write column titles to PDF
				let y = 10;
				let keys = Object.keys(adjudicationInfo[0]);
				let horizontal = 3;
				for (let col of keys) {
					if (col === "Program") {							
						doc.text(col, horizontal, y);
						horizontal += 8;
					} else if (col === "StudentNumber") {							
						doc.text(col, horizontal, y);
						horizontal += 25;
					} else if (col === "FirstName") {							
						doc.text(col, horizontal, y);
						horizontal += 12;
					} else if (col === "LastName") {							
						doc.text(col, horizontal, y);
						horizontal += 12;
					} else if (col === "AdjCode") {							
						doc.text(col, horizontal, y);
						horizontal += 10;
					} else if (col === "AdjName") {							
						doc.text(col, horizontal, y);
						horizontal += 50;
					} else {
						doc.text(col, horizontal, y);
					}
					horizontal += 15;
				}
				y += 20;

				//Write to PDF
				for (let adjInfo of adjudicationInfo) {
					let keys = Object.keys(adjInfo);
					let x = 10;
					for (let col of keys) {
						if (typeof adjInfo[col] === "number" || adjInfo[col] instanceof Date) {							
							doc.text(adjInfo[col].toString(), x, y);
							x += 10;
						} else {
							doc.text(adjInfo[col], x, y);
						}
						x += 25;
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
				function getCompletedSheet() {

					let worksheet = "";

					//Write column titles to Excel
					let keys = Object.keys(adjudicationInfo[0]);
					for (let col of keys) {
						worksheet += col.toString() + ",";
					}
					worksheet = worksheet.replace(/,$/,"\r\n");

					//Write to Excel
					for (let adjInfo of adjudicationInfo) {
						let keys = Object.keys(adjInfo);
						for (let col of keys) {
							if (adjInfo[col] instanceof Date) {
								let date = adjInfo[col].getDate();
								let month = adjInfo[col].getMonth() + 1;
								let year = adjInfo[col].getFullYear();
								let dateString = month.toString() + "/" + date.toString() + "/" + year.toString() + ",";
								worksheet += dateString;
							} else {
								worksheet += adjInfo[col] + ",";
							}
						}
						worksheet = worksheet.replace(/,$/,"\r\n");
					}

					return worksheet;
				}

				let completedSheet = getCompletedSheet();
				 
				// Save file
				function s2ab(s) {
				  var buf = new ArrayBuffer(s.length);
				  var view = new Uint8Array(buf);
				  for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
				  return buf;
				}
				 
				/* the saveAs call downloads a file on the local machine */
				FileSaver.saveAs(new Blob([s2ab(completedSheet)],{type:"application/octet-stream"}), 'adjudication.csv');
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
				return new Promise((resolve, reject) => {
					map(filteredTerms,
						(term, done) => {
							// Resolve all promises
							this.get('store').findRecord("term", term.get('id'), { reload: true })
								.then(refreshedTerm => {
									refreshedTerm.get('student')
									.then(refreshedStudent => {
										// Return the new data
										done(null,
										{
											term: refreshedTerm,
											student: refreshedStudent
										});
									});
							    })
							    .catch(err => {
							    	// If there's an error, call map's error callback
							    	done(err);
							    });
						},
						function(err, results) {
							// results is now an array of stats for each file
							if (err) {
								reject(err);
							} else {
								resolve(results);
							}		
						});
				});
			});
		}).then(filteredTermsandStudents => {
			//Filter adjudication based on the selected terms
			return this.get('store').query('adjudication', {})
			.then(dummy => {
				return this.get('store').query('adjudication', { limit: dummy.get('meta').total });
			}).then(adjudications => {
				return adjudications.filter(adjudication => {
					let found = filteredTermsandStudents.find(termandstudent => adjudication.get('term.id') === termandstudent.term.get('id'));

					return (filteredTermsandStudents.indexOf(found) !== -1);
				});
			}).then(filteredAdjudications => {
				//Return adjudication and students
				return new Promise((resolve, reject) => {
					map(filteredAdjudications,
						(adjudication, done) => {
							// Resolve all promises
							done(null,
							{
								adjudication: adjudication,
								student: filteredTermsandStudents.find(termandstudent => adjudication.get('term.id') === termandstudent.term.get('id')).student
							});
						},
						function(err, results) {
							// results is now an array of stats for each file
							if (err) {
								reject(err);
							} else {
								resolve(results);
							}		
						});
				});
			});
		}).then(filteredAdjudicationsAndStudents => {

			//Get the assessment codes associated with the adjudications
			return this.get('store').findAll('assessment-code').then(assessmentCode => {

				return new Promise((resolve, reject) => {
					map(filteredAdjudicationsAndStudents,
						(adjudicationAndStudent, done) => {
							// Resolve all promises
							this.get('store').findRecord("adjudication", adjudicationAndStudent.adjudication.get('id'), { reload: true })
							.then(refreshedAdjudication => {
									refreshedAdjudication.get('assessmentCode')
									.then(refreshedAssessmentCode => {
										// Return the new data
										done(null,
										{
											adjudication: adjudicationAndStudent.adjudication,
											student: adjudicationAndStudent.student,
											assessmentCode: refreshedAssessmentCode
										});
									});
							    })
							    .catch(err => {
							    	// If there's an error, call map's error callback
							    	done(err);
							    });
						},
						function(err, results) {
							// results is now an array of stats for each file
							if (err) {
								reject(err);
							} else {
								resolve(results);
							}		
						});
				});
			});
		}).then(adjudicationInfo => {

			//Parse adjudication info
			return adjudicationInfo.map(adjInfo => {

				if (adjInfo.assessmentCode === null) {
					return {
						Program: this.get("searchValue"),
						StudentNumber: adjInfo.student.get('number'),
						FirstName: adjInfo.student.get('firstName'),
						LastName: adjInfo.student.get('lastName'),
						AdjCode: "",
						AdjName: "",
						"Date": adjInfo.adjudication.get('date')
					};
				} else {
					return {
						Program: this.get("searchValue"),
						StudentNumber: adjInfo.student.get('number'),
						FirstName: adjInfo.student.get('firstName'),
						LastName: adjInfo.student.get('lastName'),
						AdjCode: adjInfo.assessmentCode.get('code'),
						AdjName: adjInfo.assessmentCode.get('name'),
						"Date": adjInfo.adjudication.get('date')
					};
				}

			});
		});
	}
});
