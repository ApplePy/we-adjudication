import Ember from 'ember';
import XLSX from "npm:xlsx-browserify-shim";

/* jshint loopfunc: true */


// WARNING: THIS FILE IS **LOADED** WITH JS PROMISES WRAPPING, WAITING ON, AND CALLING EACH OTHER;
// 'THIS' REBINDING; AND OTHER ARCANE JS MAGIC THAT MADE THIS MESS OF A USE CASE WORK. PROCEED AT YOUR OWN RISK.


export default Ember.Component.extend({

	store: Ember.inject.service(),
	processing: false,
	processError: false,

	files: [
		{ name: "genders.xlsx", complete: false },
		{ name: "residencies.xlsx", complete: false },
		{ name: "UndergraduateCourses.xlsx", complete: false },
		{ name: "termcodes.xlsx", complete: false },
		{ name: "HighSchools.xlsx", complete: false },
		{ name: "students.xlsx", complete: false },
		{ name: "AdmissionComments.xlsx", complete: false },
		{ name: "RegistrationComments.xlsx", complete: false },
		{ name: "BasisOfAdmission.xlsx", complete: false },
		{ name: "AdmissionAverages.xlsx", complete: false },
		{ name: "AdvancedStanding.xlsx", complete: false },
		{ name: "scholarshipsAndAwards.xlsx", complete: false },
		{ name: "HighSchoolCourseInformation.xlsx", complete: false },
		{ name: "UndergraduateRecordCourses.xlsx", complete: false },
		{ name: "UndergraduateRecordPlans.xlsx", complete: false },
		{ name: "AssessmentCodes.xlsx", complete: false },
		{ name: "Faculties.xlsx", complete: false },
		{ name: "Departments.xlsx", complete: false },
		{ name: "ProgramAdministrations.xlsx", complete: false },
		{ name: "UndergraduateRecordAdjudications.xlsx", complete: false }
	],

	actions: {
		uploadFile() {
			// Signal processing
			this.set('processing', true);
			this.set('processError', false);
			let processOff = () => {
				this.set('processing', false);

				// Set file to complete
				for (let file of this.get('files')) {
					if (file.name.toUpperCase() === fileName.toUpperCase()) {
						Ember.set(file, "complete", true);
					}
				}
			};
			let errorOff = (err) => {
				this.set('processing', false);
				this.set('processError', true);
				console.error(err);
			};

			//var file = Ember.$("#excelSheet").val();
			let file = null;
			let fileName = null;
			let reader = null;
			try {
				file = document.getElementById('excelSheet').files[0];
				fileName = file.name;
				console.log(file);
				console.log(fileName);

				//File Reader
				reader = new FileReader();
			} catch (err) {
				errorOff(err);
				throw err;
			}

			//File loads
			reader.onload = (event) => {

				//Get workbook
				let data = event.target.result;
				this.workbook = XLSX.read(data, { type: 'binary', cellDates: true });	// Moved into the "this" variable to save typing

				if (fileName.toUpperCase() === "genders.xlsx".toUpperCase()) {
					parseStrategies.singleColumn.call(this, cellValue => saveStrategies.createAndSave.call(this, { name: cellValue }, "gender"), true)
						.then(processOff).catch(errorOff);
				} else if (fileName.toUpperCase() === "residencies.xlsx".toUpperCase()) {
					parseStrategies.singleColumn.call(this, cellValue => saveStrategies.createAndSave.call(this, { name: cellValue }, "residency"), true)
						.then(processOff).catch(errorOff);
				}
				// NOTE TO SELF: the course-code model multiplicity makes zero sense
				else if (fileName.toUpperCase() === "UndergraduateCourses.xlsx".toUpperCase()) {
					parseStrategies.byRow.call(this, false, valueArray => saveStrategies.createAndSave.call(this, {
						courseLetter: valueArray[0],
						courseNumber: valueArray[1],
						name: valueArray[2],
						unit: valueArray[3]
					}, "course-code"), true)
						.then(processOff).catch(errorOff);
				} else if (fileName.toUpperCase() === "termcodes.xlsx".toUpperCase()) {
					parseStrategies.singleColumn.call(this, cellValue => saveStrategies.createAndSave.call(this, { name: cellValue }, "term-code"), true)
						.then(processOff).catch(errorOff);
				} else if (fileName.toUpperCase() === "HighSchools.xlsx".toUpperCase()) {
					parseStrategies.singleColumn.call(this, cellValue => {
						if (cellValue !== "NONE FOUND") {
							return saveStrategies.createAndSave.call(this, { name: cellValue }, "secondary-school");
						} else {
							return new Promise(res => res());
						}
					}, true)
						.then(processOff).catch(errorOff);
				} else if (fileName.toUpperCase() === "students.xlsx".toUpperCase()) {
					// Get all genders and residencies (sensitive to pagination)
					Promise.all([
						this.get('store').findAll('gender'),
						this.get('store').findAll('residency')])
						.then(values => {
							parseStrategies.byRow.call(this, false, valueArray => {
								let gender = values[0].find(el => el.get('name') === valueArray[3]);
								let residency = values[1].find(el => el.get('name') === valueArray[5]);

								// Sanity check
								if (typeof gender === "undefined" || typeof residency === "undefined") {
									throw Error("Gender or residency not found!");
								}

								// Parse birthday
								// Solution gleaned from https://github.com/SheetJS/js-xlsx/issues/126
								// NOTE: Storing date in UTC time!
								/* jshint eqeqeq: false, -W041: false */
								let parsed_date = XLSX.SSF.parse_date_code(valueArray[4], { date1904: this.workbook.Workbook.WBProps.date1904 == true });
								let date = new Date(Date.UTC(parsed_date.y, parsed_date.m - 1, parsed_date.d));

								// Create new record
								let studentJSON = {
									number: valueArray[0],
									firstName: valueArray[1],
									lastName: valueArray[2],
									DOB: date,
									genderInfo: gender,
									resInfo: residency
								};
								return saveStrategies.createAndSave.call(this, studentJSON, "student", "genderInfo", "resInfo");
							}, true);
						})
						.then(processOff).catch(errorOff);
				} else if (fileName.toUpperCase() === "AdmissionComments.xlsx".toUpperCase()) {
					miscellaneous.parseComments.call(this).then(comments => comments.forEach((value, key) => {
						if (value !== "NONE FOUND") {
							saveStrategies.modifyAndSave.call(this, "student", { number: key }, "admissionComments", value);
						}
					}))
						.then(processOff).catch(errorOff);
				} else if (fileName.toUpperCase() === "RegistrationComments.xlsx".toUpperCase()) {
					miscellaneous.parseComments.call(this).then(comments => comments.forEach((value, key) => {
						if (value !== "NONE FOUND") {
							saveStrategies.modifyAndSave.call(this, "student", { number: key }, "registrationComments", value);
						}
					}))
						.then(processOff).catch(errorOff);
				} else if (fileName.toUpperCase() === "BasisOfAdmission.xlsx".toUpperCase()) {
					parseStrategies.byRow.call(this, true, valueArray => {
						if (valueArray[1] !== "NONE FOUND") {
							return saveStrategies.modifyAndSave.call(this, "student", { number: valueArray[0] }, "basisOfAdmission", valueArray[1]);
						} else {
							return new Promise((res) => res());
						}
					})
						.then(processOff).catch(errorOff);
				} else if (fileName.toUpperCase() === "AdmissionAverages.xlsx".toUpperCase()) {
					parseStrategies.byRow.call(this, true, valueArray => {
						if (valueArray[1] !== "NONE FOUND") {
							return saveStrategies.modifyAndSave.call(this, "student", { number: valueArray[0] }, "admissionAverage", valueArray[1]);
						} else {
							return new Promise((res) => res());
						}
					})
						.then(processOff).catch(errorOff);
				} else if (fileName.toUpperCase() === "AdvancedStanding.xlsx".toUpperCase()) {
					miscellaneous.parseAwardsAndStandings.call(this, "Course", "advanced-standing", (json, student, emberName) => {
						// Save advanced standing
						return saveStrategies.createAndSave.call(this, {
							course: json.Course,
							description: json.Description,
							units: json.Units,
							grade: json.Grade,
							from: json.From,
							recipient: student
						}, emberName, "recipient");
					})
						.then(processOff).catch(errorOff);
				} else if (fileName.toUpperCase() === "scholarshipsAndAwards.xlsx".toUpperCase()) {
					miscellaneous.parseAwardsAndStandings.call(this, "note", "award", (json, student, emberName) => {
						// Save advanced standing
						return saveStrategies.createAndSave.call(this, { note: json.note, recipient: student }, emberName, "recipient");
					})
						.then(processOff).catch(errorOff);
				} else if (fileName.toUpperCase() === "HighSchoolCourseInformation.xlsx".toUpperCase()) {
					// Parse through each column and create all column
					parseStrategies.byColumn.call(this,
						true,
						true,
						[['source'], ['subject', 'description'], ['schoolName']],
						[{ modelName: "hs-course-source", source: "code" }, { modelName: "hs-subject", subject: "name" }, { modelName: "secondary-school", schoolName: "name", exclusions: {name: "NONE FOUND"}}],
						miscellaneous.columnKeyReplaceAndSave.bind(this), false)
						// Get all prerequisite models
						.then(() => {
							return Promise.all([
								miscellaneous.getAllModels.call(this, 'hs-subject'),
								miscellaneous.getAllModels.call(this, 'hs-course-source'),
								miscellaneous.getAllModels.call(this, 'student'),
								miscellaneous.getAllModels.call(this, 'secondary-school')]);
						})
						// Create all the courses
						.then(values => {
							let newCourses = new Map();

							// Get all unique courses
							return parseStrategies.byRowJSON.call(this, rowContents => {
								if (rowContents.schoolName !== "NONE FOUND") {

									// Find needed elements
									let school = values[3].find(el => el.get('name') === rowContents.schoolName);
									let subject = values[0].find(el => el.get('name') === rowContents.subject);
									let source = values[1].find(el => el.get('code') === rowContents.source);

									// Sanity check
									if (typeof school === 'undefined' || typeof subject === 'undefined' || typeof source === 'undefined') {
										throw Error("Required values are missing!");
									}

									// Add new course to set - make a crappy key for uniqueness
									newCourses.set(([rowContents.level, rowContents.units, source.get('id'), school.get('id'), subject.get('id')]).join(""), {
										level: rowContents.level,
										unit: rowContents.units,
										source: source,
										school: school,
										subject: subject
									});

									return new Promise((res) => res());
								}
							}, false, "studentNumber", "schoolName")
								// Save the unique courses
								.then(() => {
									let saves = [];
									// Save a new high school course
									newCourses.forEach(val => saves.push(saveStrategies.createAndSave.call(this, val, "hs-course", "source", "school", "subject")));

									return Promise.all(saves);
								})
								// Get all the courses, including previously-existing ones
								.then(() => miscellaneous.getAllModels.call(this, 'hs-course'))
								// Create all the grade entries
								.then(hsCourses => {

									return parseStrategies.byRowJSON.call(this, rowContents => {
										if (rowContents.schoolName !== "NONE FOUND") {
											// Find student
											let student = values[2].find(el => el.get('number') === parseInt(rowContents.studentNumber));

											// Find course
											let course = hsCourses.find(el => {
												if (el.get('level') === parseInt(rowContents.level) && el.get('unit') === parseInt(rowContents.units) &&
													el.get('source.code') === rowContents.source && el.get('subject.name') === rowContents.subject &&
													el.get('school.name') === rowContents.schoolName) {
													return true;
												} else {
													return false;
												}
											});

											// Sanity check
											if (typeof student !== "object" || typeof course !== "object") {
												throw Error("Student or Course not found!");
											}

											// Save the student's grade
											return saveStrategies.createAndSave.call(this, { mark: rowContents.grade, course: course, recipient: student }, "hs-grade", "course", "recipient");
										}
									}, false, "studentNumber", "schoolName");
								});
						}).then(processOff).catch(errorOff);
				} else if (fileName.toUpperCase() === "UndergraduateRecordCourses.xlsx".toUpperCase()) {
					// NOTE: Not storing sections, and ignoring the 1-to-many on grades -> course-code

					// Get prerequisite data
					miscellaneous.getAllModels.call(this, "term-code")
						// Save all term-codes first
						.then(() => {
							return parseStrategies.byColumn.call(this, true, true,
								[['term']],
								[{ modelName: 'term-code', term: "name" }],
								miscellaneous.columnKeyReplaceAndSave.bind(this), false);
						})
						// Get all the students that may get a new term, and their existing terms
						.then(() => Promise.all([
								miscellaneous.getAllModels.call(this, "student"),
								miscellaneous.getAllModels.call(this, "term")
						]))
						// Find and save all new term objects
						.then(studentsAndTerms => {
							let studentTermPairs = new Map();

							// Get all term objects
							return parseStrategies.byRowJSON.call(this, rowContents => {
								// Sanity Check
								if (typeof rowContents.studentNumber === "undefined" || typeof rowContents.term === "undefined") {
									throw new Error("Student number or term missing from row, and could not be inferred.");
								}

								let strippedDownRow = { studentNumber: rowContents.studentNumber, term: rowContents.term };
								// Create crappy key for uniqueness and add to map
								studentTermPairs.set(rowContents.studentNumber.toString() + rowContents.term, strippedDownRow);
								return new Promise(res => res());
							}, false, "studentNumber", "term")
							// Save all term objects
								.then(() => {
									studentTermPairs.forEach(value => {
										// Construct new term
										let newTerm = {
											termCode: miscellaneous.getAllModels.call(this, "term-code", true).find(el => el.get('name') === value.term),
											student: studentsAndTerms[0].find(el => el.get('number') === parseInt(value.studentNumber))
										};

										// sanity check
										if (typeof newTerm.termCode === "undefined" || typeof newTerm.student === "undefined") {
											throw new Error("The new term could not be saved. A term code or student was not found.");
										}

										// Save the new term object
										saveStrategies.createAndSave.call(this, newTerm, "term", "termCode", "student");
									});
									return null;
								});
						})
						// Get existing courses
						.then(miscellaneous.getAllModels.bind(this, "course-code"))
						// Save all courses per term, and the grade achieved
						.then(() => {
							// Filter existing course codes to only the unlinked "templates"
							let templateCourseCodes = miscellaneous.getAllModels.call(this, "course-code", true).filter(el => typeof el.get('termInfo.id') === "undefined" && typeof el.get('gradeInfo.id') === "undefined");

							// For each row, take the student and term to get the term object, and then make a copy of the courseCodeTemplates if needed, and save (let createAndSave deal with duplication)
							return parseStrategies.byRowJSON.call(this, rowContents => {
								// Get the term for this line (it really really should exist)
								let term = miscellaneous.getAllModels.call(this, "term", true).find(el => el.get('termCode.name') === rowContents.term && el.get('student.number') === parseInt(rowContents.studentNumber));
								let template = templateCourseCodes.find(el => el.get('courseLetter') === rowContents.courseLetter && el.get('courseNumber') === rowContents.courseNumber);

								// Sanity check
								if (typeof term === "undefined" || typeof template === "undefined") {
									throw Error("A term for a student, or a course template, could not be found.");
								}

								// Save grade
								return saveStrategies.createAndSave.call(this, {
									mark: rowContents.grade,
									note: rowContents.note
								}, "grade")
								// then save the linking course
								.then(grade => {
									// Sanity check
									if (typeof grade === "undefined") {
										throw Error("createAndSave did not return a new grade.");
									}

									// Create new copy of the template
									let newModel = template.toJSON();
									// set the properties you want to alter
									newModel.termInfo = term;
									newModel.gradeInfo = grade;								

									// Save course template
									return saveStrategies.createAndSave.call(this, newModel, "course-code", "termInfo", "gradeInfo");
									});


							}, false, "studentNumber", "term");
						})
						.then(processOff).catch(errorOff);
				} else if (fileName.toUpperCase() === "UndergraduateRecordPlans.xlsx".toUpperCase()) {
					// Create missing term codes, course loads, and plans
					parseStrategies.byColumn.call(this, true, true,
						[['term'], ['load'], ['plan']],
						[{ modelName: "term-code", term: "name" }, { modelName: "course-load" }, { modelName: "plan-code", plan: "name" }],
						miscellaneous.columnKeyReplaceAndSave.bind(this), false)
						// Get the course load and the plan codes for the next step
						.then(() => Promise.all([
							miscellaneous.getAllModels.call(this, 'course-load'),
							miscellaneous.getAllModels.call(this, 'plan-code')
						]))
						// Create or modify program records
						.then(values => {
							let courseLoads = values[0];
							let planCodes = values[1];

							return miscellaneous.createOrModifyRecords.call(this,
								'program-record',
								// Find function to determine if a 
								(rowContents, el) => el.get('name') === rowContents.program && el.get('level') === parseInt(rowContents.level) && el.get('load.load') === rowContents.load,
								rowContents => {
									// Create the JS object for a new program record
									let newObj = {
										name: rowContents.program,
										level: parseInt(rowContents.level),
										load: courseLoads.find(el => el.get('load') === rowContents.load),
										plan: [planCodes.find(el => el.get('name') === rowContents.plan)]
									};

									// Sanity check
									if (typeof newObj.load === "undefined" || typeof newObj.plan[0] === "undefined") {
										throw Error("A load or plan was unable to be generated");
									}

									return newObj;
								},
								(record, rowContents) => {

									// Modify a program record by attaching a plan
									let plan = planCodes.find(el => el.get('name') === rowContents.plan);
									if (typeof plan === "undefined") {
										throw Error("Cannot find plan!");
									}

									// Push the plan to the record
									record.get('plan').pushObject(plan);
								}, false, "studentNumber", "term", "program", "level", "load");
						})
						// Retrieve records needed for next step
						.then(() => Promise.all([
							miscellaneous.getAllModels.call(this, 'student'),
							miscellaneous.getAllModels.call(this, 'term-code'),
							miscellaneous.getAllModels.call(this, 'program-record'),
						]))
						// Create or modify student terms to connect the program records
						.then(values => {
							let students = values[0];
							let termCodes = values[1];
							let programRecords = values[2];

							return miscellaneous.createOrModifyRecords.call(this,
								'term',
								(rowContents, el) => el.get('termCode.name') === rowContents.term && el.get('student.number') === parseInt(rowContents.studentNumber),
								rowContents => {
									// Create the JS object for a new term
									let newObj = {
										termCode: termCodes.find(el => el.get('name') === rowContents.term),
										student: students.find(el => el.get('number') === parseInt(rowContents.studentNumber)),
										programRecords: [programRecords.find(el => el.get('name') === rowContents.program && el.get('level') === parseInt(rowContents.level) && el.get('load.load') === rowContents.load)]
									};

									// Sanity check
									if (typeof newObj.termCode === "undefined" || typeof newObj.student === "undefined" || typeof newObj.programRecords[0] === "undefined") {
										console.debug(newObj);
										throw Error("Could not generate a new term successfully! A parameter is missing.");
									}

									// Return new object
									return newObj;
								},
								(record, rowContents) => {
									// Modifiy a term
									let programRecord = programRecords.find(el => el.get('name') === rowContents.program && el.get('level') === parseInt(rowContents.level) && el.get('load.load') === rowContents.load);
									if (typeof programRecord === "undefined") {
										throw Error("Cannot find program record!");
									}

									// Add program record to the term object
									record.get('programRecords').pushObject(programRecord);
								}, true, "studentNumber", "term", "program", "level", "load");
						})
						.then(processOff).catch(errorOff);
				} else if (fileName.toUpperCase() === "AssessmentCodes.xlsx".toUpperCase()) {
					parseStrategies.byRow.call(this, false, valueArray => saveStrategies.createAndSave.call(this, {
						code: valueArray[0],
						name: valueArray[1],
					}, "assessment-code"), true)
						.then(processOff).catch(errorOff);
				} else if (fileName.toUpperCase() === "Faculties.xlsx".toUpperCase()) {
					parseStrategies.byRow.call(this, false, valueArray => saveStrategies.createAndSave.call(this, {
						name: valueArray[0]
					}, "faculty"), true)
						.then(processOff).catch(errorOff);
				} else if (fileName.toUpperCase() === "Departments.xlsx".toUpperCase()) {
					miscellaneous.getAllModels.call(this, "faculty")
						.then(faculties => {
							return parseStrategies.byRow.call(this, false, valueArray => {
								// Get faculty
								let faculty = faculties.find(el => el.get('name') === valueArray[1]);

								// Sanity check
								if (typeof faculty === "undefined") {
									throw Error("Faculty not found");
								}
								return saveStrategies.createAndSave.call(this, {
									name: valueArray[0],
									faculty: faculty
								}, "department", "faculty");
							}, true);
						})
					.then(processOff).catch(errorOff);
				} else if (fileName.toUpperCase() === "ProgramAdministrations.xlsx".toUpperCase()) {
					miscellaneous.getAllModels.call(this, "department")
						.then(departments => {
							return parseStrategies.byRow.call(this, false, valueArray => {
								// Get faculty
								let department = departments.find(el => el.get('name') === valueArray[2]);

								// Sanity check
								if (typeof department === "undefined") {
									throw Error("Department not found");
								}
								return saveStrategies.createAndSave.call(this, {
									name: valueArray[0],
									position: valueArray[1],
									department: department
								}, "program-administration", "department");
							}, true);
						})
					.then(processOff).catch(errorOff);
				} else if (fileName.toUpperCase() === "UndergraduateRecordAdjudications.xlsx".toUpperCase()) {

					// Collect all terms
					Promise.all([
						miscellaneous.getAllModels.call(this, "student"),
						miscellaneous.getAllModels.call(this, "term-code"),
						miscellaneous.getAllModels.call(this, "term")
					])
					// Convert the terms array to a map with the student/termCode pair as the key
					.then(values => {
						let terms = values[2];

						// Get the unique student/term pairs
						return parseStrategies.byColumn.call(this, true, true,
							[['studentNumber', 'term']],
							[{}],
							(results, context) => {
								let termsMap = new Map();

								// Filter the terms array by the student/term pairs
								terms.forEach(term => {
									results.forEach(result => {
										// If a matching tuple is found, add to map
										if (term.get('student.number') === parseInt(result.studentNumber) && term.get('termCode.name') === result.term) {
											termsMap.set(result.term + result.studentNumber, term);
										}
									});
								});

								// Return completed map
								return termsMap;
							}, false)
							// The terms map will be wrapped in an array - remove wrapping
							.then(wrapped => wrapped[0]);
					})
					// create a new adjudication record, and glue on the term object
					.then(termsMap => {
						return parseStrategies.byRowJSON.call(this, rowContents => {
							let term = termsMap.get(rowContents.term + rowContents.studentNumber);

							// Sanity check
							if (typeof term === "undefined") {
								throw Error("Term for adjudication item not found!");
							}

							// Save new adjudication object
							return saveStrategies.createAndSave.call(this, {
									termAVG: rowContents.termAVG,
									termUnitsPassed: rowContents.termUnitsPassed,
									termUnitsTotal: rowContents.termUnitsTotals,
									term: term
								}, "adjudication", "term");
						}, true);
					})
					.then(processOff).catch(errorOff);
				}
				else {
				    errorOff(Error("Invalid file name."));
				    alert("Invalid file name!");
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
	/**
	 * Loops through a spreadsheet, looking for matching models, and updating based on another record, or creating a new record.
	 * 
	 * @param {string} emberName																		The ember data model name to be searched for matching models.
	 * @param {function(object, object, number, object)} findRecord	A forEach predicate function (after getting the row contents bound to the first parameter) that returns true on a match, and false on no match.
	 * @param {function(object)} createRecordJSON										A function that recieves the row contents as an object, and returns a JS object for the new record.
	 * @param {function(object)} modifyFunction											A function that receives the row contents object, and performs the appropriate modifications to Ember Data.
	 * @param {boolean} ignoreSaveErrors														Toggles on breaking on errors, redirecting errors to warning console instead.
	 * @param {...string} multiLineVariables												A variadic parameter that specifies columns that only list entries once for multiple rows.
	 */
	createOrModifyRecords: function (emberName, findRecord, createRecordJSON, modifyFunction, ignoreSaveErrors, ...multiLineVariables) {
		let changedRecords = [];

		// Create records, or modify existing ones, but don't save yet
		return miscellaneous.getAllModels.call(this, emberName)
			.then(emberModelList => {
				return parseStrategies.byRowJSON.call(this, rowContents => {
					// Find if record already exists
					let record = emberModelList.find(findRecord.bind(this, rowContents));

					// New record
					if (typeof record === "undefined") {
						// First time ever seen, create
						try {
							record = this.get('store').createRecord(emberName, createRecordJSON(rowContents));
							changedRecords.push(record);
						} catch (err) {
							console.warn(err);
						}
					}
					// Record already exists, just add modification to object
					else {
						try {
							modifyFunction(record, rowContents);
						} catch (err) {
							console.warn(err);
						}
					}

					// To keep byRowJSON happy
					return new Promise(res => res());
				}, ignoreSaveErrors, ...multiLineVariables);
			})
			// Save all changes
			.then(() => {
				let promises = [];
					for (let record of changedRecords) {
						let savePromise = ignoreSaveErrors ? record.save().catch(err => console.warn(err)) : record.save();
						promises.push(savePromise);
					}
				return Promise.all(promises);
			})
			// Return all records
			.then(miscellaneous.getAllModels.bind(this, emberName, true));
	},

	/**
	 * Given results and a context in format {modelName: name, old column name: new column name}, make changes and save.
	 * 
	 * @param {object[]} results	A row in the column that was searched.
	 * @param {object} context		An object providing the model name to save, any excluded key:value pairs, and the old column name->new property names.
	 */
	columnKeyReplaceAndSave: function (results, context) {
		//Results is an array of objects
		// Context is the arbitrary objects we passed in
		let saves = [];
		for (let result of results) {
			// Get special keys
			let modelName = context.modelName;
			let exclusions = context.exclusions;

			// Remove modelName from list of keys to rename
			let keys = Object.keys(context);
			keys = keys.filter(el => el !== "modelName" && el !== "exclusions");

			// Do key renaming
			for (let key of keys) {
				// WARNING: JAVASCRIPT MAGIC
				result[context[key]] = result[key];		// Create a new property with the right name
				delete result[key];						// Delete property with wrong name
			}


			// Check for disallowed key values (OUDA HACK)
			if (typeof exclusions !== "undefined") {
				let excluded = false;
				for (let exclusionKey of Object.keys(exclusions)) {
					if (result[exclusionKey] === exclusions[exclusionKey]) {
						excluded = true;
						break;
					}
				}
				if (excluded === true) {
					continue;
				}
			}

			// Assuming the value doesn't already exist
			saves.push(saveStrategies.createAndSave.call(this, result, modelName));
		}

		// Return a promise representing all the saves
		return Promise.all(saves);
	},

	/**
	 * Retrieves all models.
	 * 
	 * @param {string} emberName		The model to get.
	 * @param {boolean} peekInstead	Run a peekAll instead of a findAll; use only if you know the data's been loaded.
	 * @returns {Promise|object}
	 */
	getAllModels: function (emberName, peekInstead = false) {
		// If peek is requested instead, just do that
		if (peekInstead === true) {
			return this.get('store').peekAll(emberName);
		}
		
		// Otherwise, do a full find
		return this.get('store').query(emberName, {}).then(records => {
			let meta = records.get('meta');

			// Was not paginated, return
			if (typeof meta === "undefined" || typeof meta.total === "undefined" || meta === null) {
				return this.get('store').findAll(emberName);
			}

			let total = meta.total;
			return this.get('store').query(emberName, { limit: total, offset: 0 })
				.then(() => this.get('store').findAll(emberName));
		});
	},

	/**
	 * Saves Awards and Advanced Standings to a student.
	 * 
	 * @param {string} noneFoundColumn													The column that the award name is in that will list "NONE FOUND"
	 * @param {string} emberName																Model name to use when saving.
	 * @param {function(object, object, string)} saveFunction		The save function to use, accepting parameters (row json, student object, emberName)
	 */
	parseAwardsAndStandings: function (noneFoundColumn, emberName, saveFunction) {
		return this.get('store').query('student', {}).then(records => {
			// Get number of records to retrieved
			let totalRecords = records.get('meta').total;

			// Get all students
			return this.get('store').query('student', { limit: totalRecords, offset: 0 }).then(students => {
				parseStrategies.byRowJSON.call(this, json => {
					// If they have an award
					if (json[noneFoundColumn] !== "NONE FOUND") {
						// Get student
						let student = students.find(el => el.get('number') === parseInt(json.studentNumber));

						// Sanity check
						if (typeof student === "undefined") {
							throw Error("Student not found!");
						}

						// Save
						return saveFunction.call(this, json, student, emberName);
					} else {
						return new Promise((res) => res());
					}
				}, true, "studentNumber");
			});
		});
	},

	/**
	 * Parses a spreadsheet set up in comments format and returns the comments for the first column.
	 * 
	 * @returns {Promise}	Resolves into a map of student number/comment
	 */
	parseComments: function () {
		let self = this;

		return new Promise(function (resolve) {
			let comments = new Map();

			// Go through each row and collect the comments
			parseStrategies.byRow.call(self, true, valueArray => {
				//Add or update admission comments map
				let noteAddition = comments.get(valueArray[0]);
				if (noteAddition === undefined) {
					noteAddition = "";
				}
				noteAddition += valueArray[1] + " ";
				comments.set(valueArray[0], noteAddition);

				// No promise to return
				return new Promise((res) => res());
			}, true)
				// Send the comments off
				.then(() => resolve(comments));
		});
	}
};
// Strategies that are commonly used to parse spreadsheets.
let parseStrategies = {
	/**
	 * Parse sheets by row, saving each row.
	 * 
	 * @param {function(object)} saveFunction	The save function that is passed ({row column: row value}). Returns a promise.
	 * @param {boolean} ignoreSaveErrors			Dictates if errors from the saveFunction should be suppressed.
	 * @param {...string} multiLineVariables	Strings that correspond to column names that must be preserved between rows.
	 * @throws {string}												Throws on bad parameters.
	 * @returns {Promise}											Returns a promise that resolves into an array of saved objects.
	 */
	byRowJSON: function (saveFunction, ignoreSaveErrors = false, ...multiLineVariables) {
		// Basic sanity check
		if (typeof saveFunction !== "function" || typeof ignoreSaveErrors !== "boolean") {
			throw Error("Invalid arguments!");
		}

		//Get worksheet
		let first_sheet_name = this.workbook.SheetNames[0];
		let worksheet = this.workbook.Sheets[first_sheet_name];

		let sheetJSON = XLSX.utils.sheet_to_json(worksheet);

		return new Promise(function (resolve, reject) {
			let savePromises = [];	// Stores all the promises emitted from the save function
			let preservedVariables = {};	// Stores all variables that need to be preserved between rows

			for (let row of sheetJSON) {
				let rowContents = {};

				// Don't process rows with ---END OF FILE on them
				let cont = false;
				for (let cellKey of Object.keys(row)) {
					if (row[cellKey] === "---END OF FILE") {
						cont = true;
					}
				}
				if (cont === true) { continue; }

				let keys = Object.keys(row);
				for (let col of keys) {
					if (multiLineVariables.indexOf(col) === -1 || row[col] === "") {		//The blank string is to fix an XLSX issue that only appears to be in UndergraduateRecordCourses
						rowContents[col] = row[col];
					} else {
						preservedVariables[col] = row[col];
					}
				}

				// Mash them together and save
				let result = Ember.$.extend({}, rowContents, preservedVariables);
				// Save values for row, and store the promise returned; ignore errors if requested
				try {
				let savePromise = ignoreSaveErrors ? saveFunction(result).catch((err) => console.warn(err)) : saveFunction(result);
				savePromises.push(savePromise);
				} catch (err) {
					if (ignoreSaveErrors) {
						console.warn(err);
					} else {
						throw err;
					}
				}
			}
			// Wait on all saves and only resolve when finished
			Promise.all(savePromises).then(resolve).catch(reject);
		});
	},

	/**
	 * Parse sheets by row, saving each row.
	 * 
	 * This function is kept around for legacy code.
	 * 
	 * @param {function(object)} saveFunction	The save function that is passed ([row contents]). Returns a promise.
	 * @param {boolean} ignoreSaveErrors			Dictates if errors from the saveFunction should be suppressed.
	 * @throws {string}												Throws on bad parameters.
	 * @returns {Promise}											Returns a promise that resolves into an array of saved objects.
	 */
	byRow: function (savePreviousRowValue, saveFunction, ignoreSaveErrors = false) {
		// Basic sanity check
		if (typeof savePreviousRowValue !== "boolean" || typeof saveFunction !== "function" || typeof ignoreSaveErrors !== "boolean") {
			throw Error("Invalid arguments!");
		}

		//Get worksheet
		let first_sheet_name = this.workbook.SheetNames[0];
		let worksheet = this.workbook.Sheets[first_sheet_name];

		return new Promise(function (resolve, reject) {
			let savePromises = [];	// Stores all the promises emitted from the save function

			// Stores all the values from the row
			let valueArray = [];

			// Loop through each row
			for (let R = 1; R <= XLSX.utils.decode_range(worksheet['!ref']).e.r; ++R) {

				// Save previous values if requested, otherwise wipe
				valueArray = savePreviousRowValue ? [...valueArray] : [];

				// Loop through each column in the row
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

				// Save values for row, and store the promise returned; ignore errors if requested
				let savePromise = ignoreSaveErrors ? saveFunction(valueArray).catch((err) => console.warn(err)) : saveFunction(valueArray);
				savePromises.push(savePromise);
			}

			// Wait on all saves and only resolve when finished
			Promise.all(savePromises).then(resolve).catch(reject);
		});
	},

	/**
	 * Parse sheets by a column, saving the contents found.
	 * 
	 * This function is kept around for legacy code.
	 * 
	 * @param {function(object)} saveFunction	The save function that is passed (column contents). Returns a promise.
	 * @param {boolean} ignoreSaveErrors			Dictates if errors from the saveFunction should be suppressed.
	 * @throws {string}												Throws on bad parameters.
	 * @returns {Promise}											Returns a promise that resolves into an array of saved objects.
	 */
	singleColumn: function (saveFunction, ignoreSaveErrors = false) {
		// Basic sanity check
		if (typeof saveFunction !== "function" || typeof ignoreSaveErrors !== "boolean") {
			throw Error("Invalid arguments!");
		}

		//Get worksheet
		let first_sheet_name = this.workbook.SheetNames[0];
		let worksheet = this.workbook.Sheets[first_sheet_name];

		return new Promise(function (resolve, reject) {
			let savePromises = [];	// Stores all the promises emitted from the save function

			// loop through each row
			for (let R = 1; R <= XLSX.utils.decode_range(worksheet['!ref']).e.r; ++R) {

				let cellAddress = XLSX.utils.encode_cell({ r: R, c: 0 });
				let cell = worksheet[cellAddress];
				let cellValue = null;
				try {
					cellValue = cell.v;
					// HAX to handle Ouda file weirdness
					if (cellValue === "---END OF FILE") { throw Error("Ignore this."); }
				} catch (err) {
					// Try/Catch was present in high schools parsing
					continue;	// Ignore erroring row
				}

				// Save values for row, and store the promise returned; ignore errors if requested
				let savePromise = ignoreSaveErrors ? saveFunction(cellValue).catch((err) => console.warn(err)) : saveFunction(cellValue);
				savePromises.push(savePromise);
			}

			// Wait on all saves and only resolve when finished
			Promise.all(savePromises).then(resolve).catch(reject);
		});
	},

	/**
	 * Parse sheets by columns (or groups of columns), returning the contents of a column (or group of columns), optionally de-deduplicated.
	 * 
	 * @param {boolean} removeDuplicates							Boolean dictates if duplicate elements in a column should be removed.
	 * @param {boolean} requireAllColumns							Boolean dictates if all columns must be present to be added to the output.
	 * @param {string[][]} columnsToRead							An array of ['columnName', ...] objects that specify groups of columns to read.
	 * @param {any[]} contexts												An array of objects that are passed to the save function with their corresponding column group.
	 * @param {function(object, object)} saveFunction	The save function that is passed ([column group contents], context). Returns a promise.
	 * @param {boolean} ignoreSaveErrors							Dictates if errors from the saveFunction should be suppressed.
	 * @throws {string}																Throws on bad parameters.
	 * @returns {Promise}															Returns a promise that resolves into an array of saved objects.
	 */
	byColumn: function (removeDuplicates, requireAllColumns, columnsToRead, contexts, saveFunction, ignoreSaveErrors = false) {
		// Basic sanity check
		if (typeof removeDuplicates !== "boolean" || columnsToRead.length <= 0 ||
			contexts.length !== columnsToRead.length || typeof saveFunction !== "function" || typeof ignoreSaveErrors !== "boolean") {
			throw Error("Invalid arguments!");
		}

		//Get worksheet
		let first_sheet_name = this.workbook.SheetNames[0];
		let worksheet = this.workbook.Sheets[first_sheet_name];
		let sheetJSON = XLSX.utils.sheet_to_json(worksheet);

		return new Promise(function (resolve, reject) {
			let savePromises = [];	// Stores all the promises emitted from the save function

			//Loop through different groups of columns to read
			for (let i = 0; i < columnsToRead.length; i++) {
				let results = [];  //Array to save results in for each group of columns

				//Iterate through rows
				for (let row of sheetJSON) {
					let keys = Object.keys(row);
					let rowContents = {}; //Contents of row
					for (let col of keys) {
						//Checks to see if the column I am currently on is one that I am looking for
						if (columnsToRead[i].findIndex(key => key === col) !== -1) {
							//Add property and value to rowContents
							rowContents[col] = row[col];
						}
					}

					// Check if all columns are populated, skip rest of processing if columns are missing
					let keyMissing = columnsToRead[i].findIndex(key => typeof rowContents[key] === "undefined");
					if (requireAllColumns === true && keyMissing !== -1) {
						continue;
					}

					//Check if duplicates are to be removed
					if (removeDuplicates) {
						//Find if rowContents is in results
						let foundIndex = results.findIndex(element => {
							let keys = Object.keys(element);

							//Return true if equivalent object is found in results, otherwise, return false
							for (let key of keys) {
								if (rowContents[key] !== element[key]) {
									return false;
								}
							}
							return true;
						});
						//If rowContents not in results, push row contents
						if (foundIndex === -1) {
							results.push(rowContents);
						}
					} else {
						// Duplicates don't matter, push it anyways
						results.push(rowContents);
					}
				}

				//Save results of specific group of columns to read, ignore errors if requested
				let savePromise = ignoreSaveErrors ? saveFunction(results, contexts[i]).catch((err) => console.warn(err)) : saveFunction(results, contexts[i]);
				savePromises.push(savePromise);
			}

			// Wait on all saves and only resolve when finished
			Promise.all(savePromises).then(resolve).catch(reject);
		});
	}
};

// Strategies to use that encapsulate common saving behaviours
let saveStrategies = {
	/**
	 * Finds an existing object and modifies it with new values.
	 * 
	 * @param {string} emberName			A string representing the name of the ember model.
	 * @param {object} filter					An object that contains properties to help find the model to change.
	 * @param {any[]} modifyObjects		A list of [model property name, new value] that represents the object replacement.
	 * @throws {string}								Throws when there are an odd number of modifyObjects, or if emberName or filter are empty.
	 * @returns {Promise}							Returns a promise that resolves into a modified record.
	 */
	modifyAndSave: function (emberName, filter, ...modifyObjects) {
		// Basic sanity check
		if (modifyObjects.length % 2 !== 0) {
			throw Error("Missing a parameter in the list of properties to modify and their new value.");
		}
		else if (typeof filter !== "object" || filter === null || typeof emberName !== "string" || emberName.length <= 0) {
			throw Error("Invalid emberName or filter!");
		}

		// Find the record to change
		return this.get('store').query(emberName, { filter: filter }).then((models) => {
			// No matching model found!
			if (models.get('length') === 0) {
				throw Error("No model matching filter " + filter + " was found.");
			}
			// Get the model
			let model = models.get("firstObject");

			// Make all requested modifications
			for (let i = 0; i < modifyObjects.length / 2; i++) {
				model.set(modifyObjects[i * 2], modifyObjects[i * 2 + 1]);
			}

			// Return promise of the record saving
			return model.save().then(() => {
				console.log("Modified " + emberName.replace("-", " "));
			}).catch(err => {
				// Logging
				console.debug(err);
				console.error("Could not modify " + emberName.replace("-", " "));

				// Re-break the chain
				throw err;
			});
		});
	},

	/**
	 * Saves a new element to backend if it does not already exist.
	 *
	 * @param {object} recordJSON				A flat JS object that represents the new model object.
	 * @param {string} emberName				A string representing the name of the ember model.
	 * @param {...string} relatedModels	Strings of property names in recordJSON that are actually ember models. For doing check-for-duplicates queries properly.
	 * @throws {string}									Throws when the parameters are malformed.
	 * @returns {Promise}								Returns promise that resolves into a record.
	 */
	createAndSave: function (recordJSON, emberName, ...relatedModels) {
		// Basic sanity check
		if (typeof recordJSON !== "object" || recordJSON === null || typeof emberName !== "string" || emberName.length <= 0) {
			throw Error("Invalid arguments!");
		}

		// Create a query JSON object with the ember models replaced with their IDs
		let queryJSON = {};

		// Optimization to save time
		if (relatedModels.length === 0) {
			queryJSON = recordJSON;
		} else {
			for (let prop of Object.keys(recordJSON)) {
				// If not an ember model property, copy over, otherwise only copy ID
				if (relatedModels.findIndex(element => element === prop) === -1) {
					queryJSON[prop] = recordJSON[prop];
				} else {
					queryJSON[prop] = recordJSON[prop].get('id');
				}
			}
		}

		// Check if record already exists
		return this.get('store').query(emberName, { filter: queryJSON, limit: 1 }).then(records => {

			// If the record already exists
			if (records.get('length') !== 0) {
				// Provide warning and send the found record
				console.warn("Record already exists. Not saving again.");
				return records.get('firstObject');	// Return previously-saved element
			}

			// Create record
			let model = this.get('store').createRecord(emberName, recordJSON);

			// Return promise of the record saving
			return model.save().then(res => {
				console.log("Added " + emberName.replace("-", " "));
				return res;
			}).catch(err => {
				// Logging
				console.debug(err);
				console.error("Could not add " + emberName.replace("-", " "));

				// Re-break the chain
				throw err;
			});
		});
	}
};