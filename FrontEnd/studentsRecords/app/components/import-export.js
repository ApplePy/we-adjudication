import Ember from 'ember';
import async from 'npm:async';
import XLSX from "npm:xlsx-browserify-shim";

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

				// TODO: Recommendation to avoid capitalization causing issues: run all the strings through a "toUpperCase" or "toLowerCase" before comparison
				if (fileName === "genders.xlsx") {
					parseStrategies.singleColumn.call(this, cellValue => saveStrategies.createAndSave.call(this, {name: cellValue}, "gender"));
				} else if (fileName === "residencies.xlsx") {
					parseStrategies.singleColumn.call(this, cellValue => saveStrategies.createAndSave.call(this, {name: cellValue}, "residency"));
				} else if (fileName === "UndergraduateCourses.xlsx") {
					parseStrategies.byRow.call(this, false, valueArray => saveStrategies.createAndSave.call(this, {
						courseLetter: valueArray[0],
						courseNumber: valueArray[1],
						name: valueArray[2],
						unit: valueArray[3]
					}, "course-code"));
				} else if (fileName === "HighSchools.xlsx") {
					parseStrategies.singleColumn.call(this, cellValue => saveStrategies.createAndSave.call(this, {name: cellValue}, "secondary-school"));
				} else if (fileName === "students.xlsx") {
					parseStrategies.byRow.call(this, false, valueArray => {
						this.get('store').query('gender', {filter: {name: valueArray[3]}})
						.then((genders) => {
							let gender = genders.get("firstObject");

							this.get('store').query('residency', {filter: {name: valueArray[5]}})
							.then((residencies) => {
								let residency = residencies.get("firstObject");

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
					});

				} else if (fileName === "AdmissionComments.xlsx") {
					let admissionComments = miscellaneous.parseComments();

					admissionComments.forEach((value, key) => {

						console.log(key + ' = ' + value);

						if (value !== "NONE FOUND") {
							saveStrategies.modifyAndSave.call(this, "student", {number: key}, "admissionComments", value);
						}
					});

				} else if (fileName === "RegistrationComments.xlsx") {
					let registrationComments = miscellaneous.parseComments();

					registrationComments.forEach((value, key) => {

						console.log(key + ' = ' + value);

						if (value !== "NONE FOUND") {
							saveStrategies.modifyAndSave.call(this, "student", { number: key }, "registrationComments", value);
						}
					});
				} else if (fileName === "BasisOfAdmission.xlsx") {
					parseStrategies.byRow.call(this, true, valueArray => {
						if (valueArray[1] !== "NONE FOUND") {
							saveStrategies.modifyAndSave.call(this, "student", {number: valueArray[0]}, "basisOfAdmission", valueArray[1]);
						}
					});
				} else if (fileName === "AdmissionAverages.xlsx") {

					parseStrategies.byRow.call(this, true, valueArray => {
						if (valueArray[1] !== "NONE FOUND") {
							saveStrategies.modifyAndSave.call(this, "student", {number: valueArray[0]}, "admissionAverage", valueArray[1]);
						}
					});
				} else if (fileName === "AdvancedStanding.xlsx") {

					//Get worksheet
					let first_sheet_name = workbook.SheetNames[0];
					let worksheet = workbook.Sheets[first_sheet_name];

					// FIXME: How do we refactor this parsing?
					let sheetJSON = XLSX.utils.sheet_to_json(worksheet);
					console.log(sheetJSON);

					let studentNumber;
					for (let row of sheetJSON) {
						let rowContents = {
							course: null,
							description: null,
							units: null,
							grade: null,
							from: null,
						}
						let keys = Object.keys(row);
						keys.remove("__rowNum__");
						for (let col of keys) {
							if (column != "studentNumber") {
								rowContents[col] = row[col];
							} else {
								studentNumber = row[col];
							}
						}

						if (rowContents[course] != "NONE FOUND") {

							this.get('store').query('student', {
								filter: {
									number: studentNumber
								}
							}).then((students) => {

								let student = students.get("firstObject");

								saveStrategies.createAndSave.call(this, {
									course: rowContents.course,
									description: rowContents.description,
									units: rowContents.units,
									grade: rowContents.grade,
									from: rowContents.from,
									recipient: student
								}, "advanced-standing");
							});
						}
					}
				} else if (fileName == "scholarshipsAndAwards.xlsx") {

					//Get worksheet
					let first_sheet_name = workbook.SheetNames[0];
					let worksheet = workbook.Sheets[first_sheet_name];

					// FIXME: How do we refactor this parsing?
					let sheetJSON = XLSX.utils.sheet_to_json(worksheet);
					console.log(sheetJSON);

					let studentNumber;
					for (let row of sheetJSON) {
						let note = null;
						let keys = Object.keys(row);
						keys.remove("__rowNum__");
						for (let col of keys) {
							if (column != "studentNumber") {
								note = row[col];
							} else {
								studentNumber = row[col];
							}
						}

						if (note != "NONE FOUND") {

							this.get('store').query('student', {
								filter: {
									number: studentNumber
								}
							}).then((students) => {

								let student = students.get("firstObject");

								saveStrategies.createAndSave.call(this, {
									note: note,
									recipient: student
								}, "award");
							});
						}
					}
				} else if (fileName == "HighSchoolCourseInformation.xlsx") {

					//Get worksheet
					let first_sheet_name = workbook.SheetNames[0];
					let worksheet = workbook.Sheets[first_sheet_name];

					// FIXME: How do we refactor this parsing?
					let sheetJSON = XLSX.utils.sheet_to_json(worksheet);
					console.log(sheetJSON);

					let rows = [];

					let studentNumber;
					let schoolName;

					for (let row of sheetJSON) {

						let rowContents = {
							level: null,
							subject: null,
							description: null,
							source: null,
							units: null,
							grade: null
						}
						let keys = Object.keys(row);
						keys.remove("__rowNum__");
						for (let col of keys) {
							if (column == "studentNumber") {
								studentNumber = row[col];
							} else if (column == "schoolName") {
								schoolName = row[col];
							} else {
								rowContents[col] = row[col];
							}
						}

						if (row.schoolName != "NONE FOUND") {

							// TODO: Use the promise replacement trick to flatten these nested thens out.

							this.get('store').query('hs-subject', { filter: { subject: rowContents.subject, description: rowContents.description } })
								.then((findSubjects) => {

									if (findSubjects.length == 0) {

										saveStrategies.createAndSave.call(this, {
											name: rowContents.subject,
											description: rowContents.description
										}, "hs-subject");

									} else {
										let subject = findSubjects.get("firstObject");

										this.get('store').query('hs-course-source', { filter: { code: rowContents.source } })
											.then((sources) => {
												if (sources.length == 0) {
													saveStrategies.createAndSave.call(this, { code: rowContents.source }, "hs-course-source");
												} else {
													let courseSource = sources.get("firstObject");

													// Save a new high school course
													saveStrategies.createAndSave.call(this, {
														level: rowContents.level,
														unit: rowContents.units,
														source: courseSource,
														school: schoolName,
														subject: subject
													}, "hs-course")
														.then(() => {

															// After saving, find the student object needed
															this.get('store').query('student', { filter: { number: studentNumber } })
																.then((students) => {
																	let student = students.get("firstObject");

																	// Save the student's grade
																	saveStrategies.createAndSave.call(this, {
																		mark: row.grade,
																		course: hsCourse,
																		recipient: student
																	}, "hs-grade");
																});
														});
												}
											});
									}
								});
						}
					}

				} else if (fileName == "UndergraduateRecordCourses.xlsx") {

					//Get worksheet
					let first_sheet_name = workbook.SheetNames[0];
					let worksheet = workbook.Sheets[first_sheet_name];

					let sheetJSON = XLSX.utils.sheet_to_json(worksheet);
					console.log(sheetJSON);

					let studentNumber;
					let term;

					for (let row of sheetJSON) {

						let rowContents = {
							courseLetter: null,
							courseNumber: null,
							section: null,
							grade: null,
							note: null
						}

						let keys = Object.keys(row);
						keys.remove("__rowNum__");
						for (let col of keys) {
							if (column == "studentNumber") {
								studentNumber = row[col];
							} else if (column == "term") {
								term = row[col];
							} else {
								rowContents[col] = row[col];
							}
						}

						// TODO: Use the promise replacement trick to flatten these nested thens out.

						saveStrategies.createAndSave({
							mark: rowContents.grade,
							note: rowContents.note
						}, "grade")
						.then(() => {
							this.get('store').query('student', {filter: {number: studentNumber}})
							.then((students) => {
								let student = students.get("firstObject");

								this.get('store').query('term-code', {filter: {name: term, number: studentNumber}})
								.then((termCodes) => {

									if (termCodes.length == 0) {
										saveStrategies.createAndSave.call(this, {
											name: term,
											student: student
										}, "term-code");
									} else {
										let termCode = termCodes.get("firstObject");
									
										saveStrategies.modifyAndSave.call(this, "course-code", {
											courseLetter: rowContents.courseLetter,
											courseNumber: rowContents.courseNumber,
										},
										"termInfo", termCode,
										"gradeInfo", grade);
									}
								});
							});
						});
					}
				} else if (fileName == "UndergraduateRecordPlans.xlsx") {

					//Get worksheet
					let first_sheet_name = workbook.SheetNames[0];
					let worksheet = workbook.Sheets[first_sheet_name];

					let sheetJSON = XLSX.utils.sheet_to_json(worksheet);
					console.log(sheetJSON);

					let studentNumber;
					let term;
					let program;
					let level;
					let load;
					let plan = null;

					for (let row of sheetJSON) {

						let keys = Object.keys(row);
						keys.remove("__rowNum__");
						for (let col of keys) {
							if (column == "studentNumber") {
								studentNumber = row[col];
							} else if (column == "term") {
								term = row[col];
							} else if (column == "program") {
								program = row[col];
							} else if (column == "level") {
								level = row[col];
							} else if (column == "load") {
								load = row[col];
							} else if (column == "plan") {
								plan = row[col];
							}
						}

						this.get('store').query('student', {
							filter: {
								number: studentNumber
							}
						}).then((students) => {

							let student = students.get("firstObject");

							saveStrategies.createAndSave.call(this, {name: plan}, "plan-code")
							.then(() => {
								saveStrategies.createAndSave.call(this, {status: "Active"}, "program-status")
								.then(() => {
									saveStrategies.createAndSave.call(this, {load: load}, "course-load")
									.then(() => {
										this.get('store').query('program-record', {
											filter: {
												name: program,
												level: level,
												load: load,
												status: status
											}
										}).then((programRecords) => {

											if (programRecords.length == 0) {
												saveStrategies.createAndSave.call(this, {
													name: program,
													level: level,
													load: load,
													status: status,
													plan: [planCode]
												},"program-record");
											} else {

												let programRecord = programRecords.get("firstObject");

												let plans = programRecord.get('plan');
												plans.push(planCode);

												programRecord.set('plan', plans);
												programRecord.save().then(() => {
													console.log("Added program record");
												}, () => {
													console.log("Could not add program record");
												});

											}

											this.get('store').query('term-code', {
												filter: {
													name: term,
													number: studentNumber
												}
											}).then((termCodes) => {

												if (termCodes.length == 0) {
													saveStrategies.createAndSave.call(this, {
														name: term,
														student: student,
														programRecords: [programRecord]
													}, "term-code");
												} else {

													let termCode = termCodes.get("firstObject");

													let programRecords = termCode.get('programRecords');
													programRecords.push(programRecord);

													termCode.set('programRecords', programRecords);
													termCode.save().then(() => {
														console.log("Added term code");
													}, () => {
														console.log("Could not add term code");
													});
												}
											});

										});

									}, () => {
										console.log("Could not add load");
									});

								}, () => {
									console.log("Could not add status");
								});

							}, () => {
								console.log("Could not add plan code");
							});
						});
					}
				}
			};

			//Error in file loading
			reader.onerror = (event) => {
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
			if (comments.has(valueArray[0]) === undefined) {
				comments.set(valueArray[0], valueArray[1]);
			} else {
				let noteAddition = comments.get(valueArray[0]);
				if (noteAddition === undefined) {
					noteAddition = "";
				}
				noteAddition += valueArray[1];
				comments.set(valueArray[0], noteAddition);
			}
		});

		return comments;
	}
};

let parseStrategies = {
	byRow: function (savePreviousRowValue, saveFunction) {
		//Get worksheet
		let first_sheet_name = this.workbook.SheetNames[0];
		let worksheet = this.workbook.Sheets[first_sheet_name];

		// Stores all the values from the row
		let valueArray = [];

		// TODO: Look at changing to sheet_to_json to save lines?
		for (let R = 1; R <= XLSX.utils.decode_range(worksheet['!ref']).e.r; ++R) {

			if (!savePreviousRowValue)
				valueArray.length = 0;	// Yes, this actually clears the array. It's true voodoo.

			for (let C = 0; C <= XLSX.utils.decode_range(worksheet['!ref']).e.c; ++C) {

				let cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
				let cell = worksheet[cellAddress];
				try {
					// Get value and save it to valueArray
					let cellValue = cell.v;
					console.log(cellValue);
					valueArray[C] = cellValue;
				} catch (err) {
					valueArray[C] = null;
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
			} catch (err) {
				// Try/Catch was present in high schools parsing
				console.warn(err);
			}

			// Save values for row
			saveFunction(cellValue);
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
		this.get('store').query(emberName, { filter: filter })
			.then((models) => {
				let model = models.get("firstObject");

				// Make all requested modifications
				for (let i = 0; i < modifyObjects.length / 2; i++) {
					model.set(modifyObjects[i * 2], modifyObjects[i * 2 + 1]);
				}

				// Return promise of the modified record saving
				return model.save().then(() => {
					console.log("Modified " + modifyKey + " on a " + emberName.replace("-", " "));
				}, err => {
					console.warn(err);
					console.log("Could not modify " + modifyKey + " on a " + emberName.replace("-", " "));
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