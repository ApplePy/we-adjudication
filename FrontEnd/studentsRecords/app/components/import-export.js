import Ember from 'ember';
import XLSX from "npm:xlsx-browserify-shim"; 

/* jshint loopfunc: true */

export default Ember.Component.extend({

	store: Ember.inject.service(),

	actions: {
		uploadFile() {

			//var file = Ember.$("#excelSheet").val();
			let file = document.getElementById('excelSheet').files[0];
			let fileName = file.name;
			console.log(file);
			console.log(fileName);

			//File Reader
			let reader = new FileReader();

			//File loads
			reader.onload = (event) => {

				//Get workbook
				let data = event.target.result;
				this.workbook = XLSX.read(data, { type: 'binary' });	// Moved into the "this" variable to save typing

				if (fileName.toUpperCase() === "genders.xlsx".toUpperCase()) {
					parseStrategies.singleColumn.call(this, cellValue => saveStrategies.createAndSave.call(this, { name: cellValue }, "gender"));
				} else if (fileName.toUpperCase() === "residencies.xlsx".toUpperCase()) {
					parseStrategies.singleColumn.call(this, cellValue => saveStrategies.createAndSave.call(this, { name: cellValue }, "residency"));
				} else if (fileName.toUpperCase() === "UndergraduateCourses.xlsx".toUpperCase()) {
					parseStrategies.byRow.call(this, false, valueArray => saveStrategies.createAndSave.call(this, {
						courseLetter: valueArray[0],
						courseNumber: valueArray[1],
						name: valueArray[2],
						unit: valueArray[3]
					}, "course-code"));
				} else if (fileName.toUpperCase() === "HighSchools.xlsx".toUpperCase()) {
					parseStrategies.singleColumn.call(this, cellValue => saveStrategies.createAndSave.call(this, { name: cellValue }, "secondary-school"));
				} else if (fileName.toUpperCase() === "students.xlsx".toUpperCase()) {
					parseStrategies.byRow.call(this, false, valueArray => {
						// Get gender and dependencies
						// TODO: Find out if this usage of Promise.all makes Ember squirm... it intentionally removed Promise from jshint global space
						Promise.all([
							this.get('store').query('gender', { filter: { name: valueArray[3] } }),
							this.get('store').query('residency', { filter: { name: valueArray[5] } })
						]).then(values => {
							let gender = values[0].get("firstObject");
							let residency = values[1].get("firstObject");

							// Create new record
							let studentJSON = {
								number: valueArray[0],
								firstName: valueArray[1],
								lastName: valueArray[2],
								DOB: new Date(valueArray[4]),	// TODO: THIS DOES NOT WORK.
								genderInfo: gender,
								resInfo: residency
							};
							saveStrategies.createAndSave.call(this, studentJSON, "student");
						});
					});
				} else if (fileName.toUpperCase() === "AdmissionComments.xlsx".toUpperCase()) {
					let admissionComments = miscellaneous.parseComments.call(this);
					admissionComments.forEach((value, key) => {
						if (value !== "NONE FOUND") {
							saveStrategies.modifyAndSave.call(this, "student", { number: key }, "admissionComments", value);
						}
					});

				} else if (fileName.toUpperCase() === "RegistrationComments.xlsx".toUpperCase()) {
					let registrationComments = miscellaneous.parseComments.call(this);
					registrationComments.forEach((value, key) => {
						if (value !== "NONE FOUND") {
							saveStrategies.modifyAndSave.call(this, "student", { number: key }, "registrationComments", value);
						}
					});
				} else if (fileName.toUpperCase() === "BasisOfAdmission.xlsx".toUpperCase()) {
					parseStrategies.byRow.call(this, true, valueArray => {
						if (valueArray[1] !== "NONE FOUND") {
							saveStrategies.modifyAndSave.call(this, "student", { number: valueArray[0] }, "basisOfAdmission", valueArray[1]);
						}
					});
				} else if (fileName.toUpperCase() === "AdmissionAverages.xlsx".toUpperCase()) {

					parseStrategies.byRow.call(this, true, valueArray => {
						if (valueArray[1] !== "NONE FOUND") {
							saveStrategies.modifyAndSave.call(this, "student", { number: valueArray[0] }, "admissionAverage", valueArray[1]);
						}
					});
				} else if (fileName.toUpperCase() === "AdvancedStanding.xlsx".toUpperCase()) {
					parseStrategies.byRowJSON.call(this, json => {
						if (json.course !== "NONE FOUND") {
							// Find student to save an advanced standing for
							this.get('store').query('student', { filter: { number: json.studentNumber } })
								.then(students => {
									let student = students.get("firstObject");

									// Save advanced standing
									saveStrategies.createAndSave.call(this, {
										course: json.course,
										description: json.description,
										units: json.units,
										grade: json.grade,
										from: json.from,
										recipient: student
									}, "advanced-standing");
								});
						}
					}, "studentNumber");
				} else if (fileName.toUpperCase() === "scholarshipsAndAwards.xlsx".toUpperCase()) {
					parseStrategies.byRowJSON.call(this, json => {
						if (json.note !== "NONE FOUND") {
							// Find student and save a new award related to student
							this.get('store').query('student', { filter: { number: json.studentNumber } })
								.then(students => {
									let student = students.get("firstObject");

									saveStrategies.createAndSave.call(this, { note: json.note, recipient: student }, "award");
								});
						}
					}, "studentNumber");
				} else if (fileName.toUpperCase() === "HighSchoolCourseInformation.xlsx".toUpperCase()) {
					parseStrategies.byRowJSON.call(this, rowContents => {
						if (rowContents.schoolName !== "NONE FOUND") {
							// Find listed subject
							Promise.all([
								this.get('store').query('hs-subject', { filter: { subject: rowContents.subject, description: rowContents.description } }),
								this.get('store').query('hs-course-source', { filter: { code: rowContents.source } }),
								this.get('store').query('student', { filter: { number: rowContents.studentNumber } }),
								this.get('store').query('secondary-school', { filter: { name: rowContents.schoolName } })
							]).then(values => {
								// Array of tasks that need to be done before saving the high school course
								let preRequisitePromises = [];
								let school = values[3].get('firstObject');
								let emptySubject = (values[0].get('length') === 0);
								let emptySource = (values[1].get('length') === 0);

								// If subject does not exist, create it
								if (emptySubject) {
									preRequisitePromises.push(
										saveStrategies.createAndSave.call(this, { name: rowContents.subject, description: rowContents.description }, "hs-subject")
									);
								} else {
									preRequisitePromises.push(null);	// To keep position in the preReqValues array
								}

								// If course source does not exist, create it
								if (emptySource) {
									preRequisitePromises.push(
										saveStrategies.createAndSave.call(this, { code: rowContents.source }, "hs-course-source")
									);
								} else {
									preRequisitePromises.push(null);	// To keep position in the preReqValues array
								}

								// Handle the rerequisite
								Promise.all(preRequisitePromises).then(preReqValues => {
									console.debug(preReqValues);
									// Get the right value
									let subject = emptySubject ? preReqValues[0] : values[0].get('firstObject');// TODO: Don't know if the .get('firstObject') is needed
									let source = emptySource ? preReqValues[1] : values[1].get('firstObject');	// TODO: Don't know if the .get('firstObject') is needed

									console.debug(subject);
									console.debug(source);

									// Save a new high school course
									saveStrategies.createAndSave.call(this, {
										level: rowContents.level,
										unit: rowContents.units,
										source: source,
										school: school,
										subject: subject
									}, "hs-course")
										.then((hsCourse) => {
											let student = values[2].get("firstObject");

											// Save the student's grade
											saveStrategies.createAndSave.call(this, { mark: rowContents.grade, course: hsCourse, recipient: student }, "hs-grade");
										});
								});
							});
						}
					}, "studentNumber", "schoolName");
				} else if (fileName.toUpperCase() === "UndergraduateRecordCourses.xlsx".toUpperCase()) {
					parseStrategies.byRowJSON.call(this, rowContents => {
						// Save grades
						saveStrategies.createAndSave({ mark: rowContents.grade, note: rowContents.note }, "grade")
							.then((grade) => {

								// Get relevant student data
								Promise.all([
									this.get('store').query('student', { filter: { number: rowContents.studentNumber } }),
									this.get('store').query('term-code', { filter: { name: rowContents.term, number: rowContents.studentNumber } })
								]).then(values => {
									let student = values[0].get("firstObject");
									let termCodes = values[1];
									let preRequisitePromises = [];

									// If new term, create it
									if (termCodes.get("length") === 0) {
										preRequisitePromises.push(
											saveStrategies.createAndSave.call(this, { name: rowContents.term, student: student }, "term-code"
											));
									} else {
										preRequisitePromises.push(null);
									}

									// Resolve prerequistes and then continue
									Promise.all(preRequisitePromises).then(preReqValues => {
										let termCode = termCodes.get("length") === 0 ? preReqValues[0] : termCodes.get("firstObject");

										// Save new course code
										saveStrategies.modifyAndSave.call(this, "course-code", {
											courseLetter: rowContents.courseLetter,
											courseNumber: rowContents.courseNumber
										},
											"termInfo", termCode,
											"gradeInfo", grade);
									});
								});
							});
					}, "studentNumber", "term");
				} else if (fileName.toUpperCase() === "UndergraduateRecordPlans.xlsx".toUpperCase()) {
					parseStrategies.byRowJSON.call(this, rowContents => {
						this.get('store').query('student', { filter: { number: rowContents.studentNumber } })
							.then(students => {
								let student = students.get("firstObject");

								// Get all prerequisite data 
								Promise.all([
									this.get('store').query('program-status', { filter: { status: "Active" } }),
									this.get('store').query('plan-code', { filter: { name: rowContents.plan } }),
									this.get('store').query('course-load', { filter: { load: rowContents.load } }),
									this.get('store').query('program-record', {
										filter: {
											name: rowContents.program,
											level: rowContents.level,
											load: rowContents.load,
											status: rowContents.status
										}
									}),
									this.get('store').query('term-code', { filter: { name: rowContents.term, number: rowContents.studentNumber } })
								]).then(values => {
									let preReqValues = [];
									let emptyStatus = (values[0].get("length") === 0);
									let emptyPlanCode = (values[1].get("length") === 0);
									let emptyLoad = (values[2].get("length") === 0);
									let emptyRecords = (values[3].get("length") === 0);
									let emptyTermCode = (values[4].get("length") === 0);

									// If something is missing, create it
									if (emptyStatus) {
										preReqValues.push(saveStrategies.createAndSave.call(this, { status: "Active" }, "program-status"));		// MASSIVE ASSUMPTION
									} else { preReqValues.push(null); }

									if (emptyPlanCode) {
										preReqValues.push(saveStrategies.createAndSave.call(this, { name: rowContents.plan }, "plan-code"));
									} else { preReqValues.push(null); }

									if (emptyLoad) {
										saveStrategies.createAndSave.call(this, { load: rowContents.load }, "course-load");
									} else { preReqValues.push(null); }

									// Since program record cannot be created until planCode is, resolve now
									Promise.all(preReqValues).then(preReqValues => {
										let preReqValuesTwo = [];
										let status = emptyStatus ? preReqValues[0] : values[0].get('firstObject');
										let planCode = emptyPlanCode ? preReqValues[1] : values[1].get('firstObject');
										let load = emptyLoad ? preReqValues[2] : values[2].get('firstObject');

										// If record doesn't already exist, create it, otherwise add the plan code
										if (emptyRecords) {
											preReqValuesTwo.push(
												saveStrategies.createAndSave.call(this, {
													name: rowContents.program,
													level: rowContents.level,
													load: load,
													status: status,
													plan: [planCode] }, "program-record"));
										} else {
											let programRecord = values[3].get("firstObject");
											preReqValuesTwo.push(programRecord.get('plan').then(plans => {
												// Add planCode if not already there
												plans.addObject(planCode);

												// Save updated programRecord
												programRecord.set('plan', plans);
												return programRecord.save().then(() => {
													console.log("Added program record");
												}, () => {
													console.log("Could not add program record");
												});
											}));
										}

										// After program record is set up...
										Promise.all(preReqValues).then(preReqTwoValues => {
											let programRecord = preReqTwoValues[0];
											let termCodes = values[4];

											// If term does not exist, create with program record, otherwise append new program record
											if (emptyTermCode) {
												saveStrategies.createAndSave.call(this, {
													name: rowContents.term,
													student: student,
													programRecords: [programRecord]
												}, "term-code");
											} else {
												let termCode = termCodes.get("firstObject");

												termCode.get('programRecords').then(programRecords => {
													// Add if not already there
													programRecords.addObject(programRecord);

													termCode.set('programRecords', programRecords);
													termCode.save().then(() => {
														console.log("Added term code");
													}, () => {
														console.log("Could not add term code");
													});
												});
											}
										});
									});
								});

							});
					}, "studentNumber", "term", "program", "level", "load", "plan");
				}
			};

			//Error in file loading
			reader.onerror = () => {
				alert("Error in loading file.");
			};

			//Read file
			reader.readAsBinaryString(file);

		}
	}

});


//////////////////////////////
//                          //
//	STRATEGIES AND HELPERS  //
//                          //
//////////////////////////////

let miscellaneous = {
	parseComments: function () {
		let comments = new Map();

		parseStrategies.byRow.call(this, true, valueArray => {
			//Add or update admission comments map
			let noteAddition = comments.get(valueArray[0]);
			if (noteAddition === undefined) {
				noteAddition = "";
			}
			noteAddition += valueArray[1] + " ";
			comments.set(valueArray[0], noteAddition);
		});

		return comments;
	}
};

let parseStrategies = {
	byRowJSON: function (saveFunction, ...multiLineVariables) {
		//Get worksheet
		let first_sheet_name = this.workbook.SheetNames[0];
		let worksheet = this.workbook.Sheets[first_sheet_name];
		
		let sheetJSON = XLSX.utils.sheet_to_json(worksheet);

		let preservedVariables = {};
		for (let row of sheetJSON) {
			let rowContents = {};
			let keys = Object.keys(row);
			for (let col of keys) {
				if (multiLineVariables.indexOf(col) === -1) {
					rowContents[col] = row[col];
				} else {
					preservedVariables[col] = row[col];
				}
			}

			// Mash them together and save
			let result = Ember.$.extend({}, rowContents, preservedVariables);
			saveFunction(result);
		}
	},
	byRow: function (savePreviousRowValue, saveFunction) {
		//Get worksheet
		let first_sheet_name = this.workbook.SheetNames[0];
		let worksheet = this.workbook.Sheets[first_sheet_name];

		// Stores all the values from the row
		let valueArray = [];

		// TODO: Look at changing to sheet_to_json to save lines?
		for (let R = 1; R <= XLSX.utils.decode_range(worksheet['!ref']).e.r; ++R) {

			if (savePreviousRowValue) {
				valueArray = [...valueArray];
			} else {
				valueArray = [];
			}

			for (let C = 0; C <= XLSX.utils.decode_range(worksheet['!ref']).e.c; ++C) {

				let cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
				let cell = worksheet[cellAddress];
				try {
					// Get value and save it to valueArray
					let cellValue = cell.v;
					valueArray[C] = cellValue;
				} catch (err) {
					// Skip, extension point here later?
				}
			}

			// Save values for row
			saveFunction(valueArray);
		}
	},
	singleColumn: function (saveFunction) {
		//Get worksheet
		let first_sheet_name = this.workbook.SheetNames[0];
		let worksheet = this.workbook.Sheets[first_sheet_name];

		// TODO: Look at changing to sheet_to_json to save lines?
		for (let R = 1; R <= XLSX.utils.decode_range(worksheet['!ref']).e.r; ++R) {

			let cellAddress = XLSX.utils.encode_cell({ r: R, c: 0 });
			let cell = worksheet[cellAddress];
			let cellValue = null;
			try {
				cellValue = cell.v;
				// HAX to handle Ouda file weirdness
				if (cellValue === "---END OF FILE") {throw "Ignore this.";}
			} catch (err) {
				// Try/Catch was present in high schools parsing
				console.warn(err);
				continue;
			}

			// Save values for row
			saveFunction(cellValue);
		}
	},
	byColumn: function (removeDuplicates, columnsToRead, saveFunction) {

		//Get worksheet
		let first_sheet_name = this.workbook.SheetNames[0];
		let worksheet = this.workbook.Sheets[first_sheet_name];
		
		let sheetJSON = XLSX.utils.sheet_to_json(worksheet);
		
		//Loop through different groups of columns to read
		for (let i = 0; i <= columnsToRead.length; i++) {	
			let results = [];  //Array to save results in for each group of columns

			//Iterate through rows
			for (let row of sheetJSON) {
				let keys = Object.keys(row);
				let rowContents = {}; //Contents of row
				for (let col of keys) {
					//Checks to see if the column I am currently on is one that I am looking for
					if (columnsToRead[i].indexOf(col) !== -1) {
						//Add property and value to rowContents
						rowContents[col] = row[col];		
					}
				}
				//Check if duplicates are to be removed
				if (removeDuplicates) {
					//Find if rowContents is in results
					let foundIndex = results.findIndex(element => {
						let keys = Object.keys(element);

						//Return true if equivalent object is found in results, otherwise, return false
						for (let key of keys){
							if (rowContents[key] !== element[key])
								return false;
						}
						return true;
					});
					//If rowContents not in results, push row contents
					if (foundIndex === -1) {
						results.push(rowContents);
					}
				}
			}
			//Save results of specific group of columns to read
			saveFunction(results);
		}
	}
};

// Key feature to note: the promises' then functions return the *promise* of the save occurring,
//   so that these functions can be chained together to save multiple items sequentially
// TODO: Check how exceptions and rejections are handled with chained thens
let saveStrategies = {
	modifyAndSave: function (emberName, filter, ...modifyObjects) {

		// Basic sanity check
		if (modifyObjects.length % 2 !== 0) {
			throw "Missing a parameter in the list of properties to modify and their new value.";
		}

		// Find the record to change
		return this.get('store').query(emberName, { filter: filter })
			.then((models) => {
				let model = models.get("firstObject");

				// Make all requested modifications
				for (let i = 0; i < modifyObjects.length / 2; i++) {
					model.set(modifyObjects[i * 2], modifyObjects[i * 2 + 1]);
				}

				// Return promise of the modified record saving
				return model.save().then(() => {
					console.log("Modified on a " + emberName.replace("-", " "));
				}, err => {
					console.warn(err);
					console.log("Could not modify on a " + emberName.replace("-", " "));
				});

			});
	},
	createAndSave: function (recordJSON, emberName) {
		// Create record
		let model = this.get('store').createRecord(emberName, recordJSON);

		// Return promise of the record saving
		return model.save().then(() => {
			console.log("Added " + emberName.replace("-", " "));
		}, err => {
			console.warn(err);
			console.log("Could not add " + emberName.replace("-", " "));
		});
	}
};