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
		{name: "UndergraduateRecordCourses.xlsx", complete: false},
		{ name: "UndergraduateRecordPlans.xlsx", complete: false }
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
					parseStrategies.singleColumn.call(this, cellValue => saveStrategies.createAndSave.call(this, { name: cellValue }, "secondary-school"), true)
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
									throw "Gender or residency not found!";
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
					miscellaneous.parseAwardsAndStandings.call(this, "course", "advanced-standing", (json, student, emberName) => {
						// Save advanced standing
						return saveStrategies.createAndSave.call(this, {
							course: json.course,
							description: json.description,
							units: json.units,
							grade: json.grade,
							from: json.from,
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
						[{ modelName: "hs-course-source", source: "code" }, { modelName: "hs-subject", subject: "name" }, { modelName: "secondary-school", schoolName: "name" }],
						miscellaneous.columnKeyReplaceAndSave.bind(this), false)
						.then(() => {
							// Get all prerequisite models
							return Promise.all([
								miscellaneous.getAllModels.call(this, 'hs-subject'),
								miscellaneous.getAllModels.call(this, 'hs-course-source'),
								miscellaneous.getAllModels.call(this, 'student'),
								miscellaneous.getAllModels.call(this, 'secondary-school')]);
						})
						.then(values => {
							// Create all the courses
							return parseStrategies.byRowJSON.call(this, rowContents => {
								if (rowContents.schoolName !== "NONE FOUND") {
									// Find needed elements
									let school = values[3].find(el => el.get('name') === rowContents.schoolName);
									let subject = values[0].find(el => el.get('name') === rowContents.subject);
									let source = values[1].find(el => el.get('code') === rowContents.source);

									// Sanity check
									if (typeof school === 'undefined' || typeof subject === 'undefined' || typeof source === 'undefined') {
										throw "Required values are missing!";
									}

									// Save a new high school course
									return saveStrategies.createAndSave.call(this, {
										level: rowContents.level,
										unit: rowContents.units,
										source: source,
										school: school,
										subject: subject
									}, "hs-course", "source", "school", "subject");
								} else {
									return new Promise((res) => res());
								}
							}, false, "studentNumber", "schoolName")
								// Create all the grade entries
								.then((hsCourses) => {
									// Remove null courses
									hsCourses = hsCourses.filter(el => el !== null);

									return parseStrategies.byRowJSON.call(this, rowContents => {
										if (rowContents.schoolName !== "NONE FOUND") {
											// Find student
											let student = values[2].find(el => el.get('number') === rowContents.studentNumber);

											// Find course
											let course = hsCourses.find(el => {
												if (el.get('level') === rowContents.level && el.get('unit') === rowContents.units &&
													el.get('source.name') === rowContents.source && el.get('subject.name') === rowContents.subject &&
													el.get('school.name') === rowContents.schoolName) {
													return true;
												} else {
													return false;
												}
											});

											// Save the student's grade
											return saveStrategies.createAndSave.call(this, { mark: rowContents.grade, course: course, recipient: student }, "hs-grade");
										}
									}, false, "studentNumber", "schoolName");
								});
						}).then(processOff).catch(errorOff);
				} else if (fileName.toUpperCase() === "UndergraduateRecordCourses.xlsx".toUpperCase()) {
					// NOTE: Not storing sections, and ignoring the 1-to-many on grades -> course-code

					// Get prerequisite data
					// NOTE: Inefficient use of resources? Yes. Efficient use of my time? Also yes.
					Promise.all([
						miscellaneous.getAllModels.call(this, "student"),
						miscellaneous.getAllModels.call(this, "term-code"),
						this.get('store').query("course-code", { filter: {termInfo: null, gradeInfo: null}, limit: 0 })
						.then(records => this.get('store').query("course-code", { filter: {termInfo: null, gradeInfo: null}, limit: records.get('meta').total })),
						miscellaneous.getAllModels.call(this, "term")
					])
					.then(values => {
						// Save grades, skip if a prerequisite piece of data is missing
						return parseStrategies.byRowJSON.call(this, rowContents => {
							let student = values[0].find(el => el.get('number') === parseInt(rowContents.studentNumber));
							let termCode = values[1].find(el => el.get('name') === rowContents.term);
							let courseCodeTemplate = values[2].find(el => el.get('courseLetter') === rowContents.courseLetter && el.get('courseNumber') === rowContents.courseNumber);
							let term = values[3].find(el => el.get('termCode.name') === rowContents.term && el.get('student.number') === parseInt(rowContents.studentNumber));

							// Sanity check
							if (typeof student === "undefined" || typeof termCode === "undefined" || typeof courseCodeTemplate === "undefined") {
								throw "Missing student " + rowContents.studentNumber + " or termCode " + rowContents.term + " or course " + [rowContents.courseLetter, rowContents.courseNumber].join(' ');
							}

							// Create grade
							return saveStrategies.createAndSave.call(this, {mark: rowContents.grade, note: rowContents.note}, "grade")
							.then(grade => {
								// Create term if none created yet for student
								if (typeof term === 'undefined') {
									// TODO: Does this term-replacement shenaniganry work?
									return saveStrategies.createAndSave.call(this, { termCode: termCode, student: student }, "term", "termCode", "student")
									.then(newTerm => { term = newTerm; return new Promise(res => res(grade)); });
								}

								return grade;
							})
							.then(grade => {
								// Duplicate course template for this term
								let newModel = courseCodeTemplate.toJSON();
								// set the properties you want to alter
								newModel.termInfo = term;
								newModel.gradeInfo = grade;

								// Save course template
								return saveStrategies.createAndSave.call(this, newModel, "course-code", "termInfo", "gradeInfo");
							});
						}, true, "studentNumber", "term");
					}).then(processOff).catch(errorOff);
				} else if (fileName.toUpperCase() === "UndergraduateRecordPlans.xlsx".toUpperCase()) {
					// NOTE: Inefficient use of resources? Yes. Efficient use of my time? Also yes.
					Promise.all([
						miscellaneous.getAllModels.call(this, 'student'),
						miscellaneous.getAllModels.call(this, 'term-code'),
						miscellaneous.getAllModels.call(this, 'term'),
						miscellaneous.getAllModels.call(this, 'course-load'),
						miscellaneous.getAllModels.call(this, 'plan-code'),
						miscellaneous.getAllModels.call(this, 'program-record'),
					])
						.then(values => {
							// Create missing term codes, course loads, and plans
							return parseStrategies.byColumn.call(this, true, true,
								[['term'], ['load'], ['plan']],
								[{ modelName: "term-code", term: "name" }, { modelName: "course-load" }, { modelName: "plan-code", plan: "name" }],
								miscellaneous.columnKeyReplaceAndSave.bind(this), false)
								.then(() => {
									// Create or modify program records
									return miscellaneous.createOrModifyRecords.call(this,
										'program-record',
										(rowContents, el) => el.get('name') === rowContents.program && el.get('level') === parseInt(rowContents.level) && el.get('load.load') === rowContents.load,
										rowContents => {
											// Create the JS object for a new program record
											return {
												name: rowContents.program,
												level: parseInt(rowContents.level),
												load: values[3].find(el => el.get('load') === rowContents.load),
												plan: [values[4].find(el => el.get('name') === rowContents.plan)]
											};
										},
										(record, rowContents) => {
											// Modifiy a program record
											record.set('plan', record.get('plan').addObject(values[4].find(el => el.get('name') === rowContents.plan)));
										}, "studentNumber", "term", "program", "level", "load");
								})
								.then(() => {
									// Create or modify student terms
									return miscellaneous.createOrModifyRecords.call(this,
										'term',
										(rowContents, el) => el.get('termCode.name') === rowContents.term && el.get('student.number') === parseInt(rowContents.studentNumber),
										rowContents => {
											// Create the JS object for a new term
											return {
												termCode: values[1].find(el => el.get('name') === rowContents.term),
												student: values[0].find(el => el.get('number') === parseInt(rowContents.studentNumber)),
												programRecords: [values[5].find(el => el.get('name') === rowContents.program && el.get('level') === parseInt(rowContents.level) && el.get('load.load') === rowContents.load)]
											};
										},
										(record, rowContents) => {
											// Modifiy a term
											record.set('plan', record.get('plan').addObject(values[5].find(el => el.get('name') === rowContents.program && el.get('level') === parseInt(rowContents.level) && el.get('load.load') === rowContents.load)));
										}, "studentNumber", "term", "program", "level", "load");
								});
						})
						.then(processOff).catch(errorOff);
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
	 * @param {...string} multiLineVariables												A variadic parameter that specifies columns that only list entries once for multiple rows.
	 */
	createOrModifyRecords: function (emberName, findRecord, createRecordJSON, modifyFunction, ...multiLineVariables) {
		// Create records, or modify existing ones
		return parseStrategies.byRowJSON.call(this, rowContents => {
			// Find if record already exists
			let record = this.get('store').peekAll(emberName).find(findRecord.bind(this, rowContents));

			// New record
			if (typeof record === "undefined") {
				// First time ever seen, create
				record = this.get('store').createRecord(emberName, createRecordJSON(rowContents));
			}
			// Record already exists, just add modification to object
			else {
				modifyFunction(record, rowContents);
			}

			// Return dummy promise to make byRowJSON happy.
			return new Promise((res) => res());
		}, false, ...multiLineVariables)
			.then(() => {
				let savePromises = [];

				// Save all records
				this.get('store').peekAll(emberName).forEach(el => {
					if (el.get('isNew') === true || el.get('hasDirtyAttributes') === true) {
						savePromises.push(el.save());
					}
				});

				// Continue once all the saves are done
				return Promise.all(savePromises);
			})
			.catch(err => {
				// If program record generation failed, rollback any unsaved records
				this.get('store').peekAll(emberName).forEach(el => el.rollbackAttributes());

				throw err;
			})
	},

	/**
	 * Given results and a context in format {modelName: name, old column name: new column name}, make changes and save.
	 * 
	 * @param {object[]} results	A row in the column that was searched.
	 * @param {object} context		An object providing the model name to save and the old column name->new property names.
	 */
	columnKeyReplaceAndSave: function(results, context) {
		(results, context) => {
			//Results is an array of objects
			// Context is the arbitrary objects we passed in
			let saves = [];
			for (let result of results) {
				// Remove modelName from list of keys to rename
				let keys = Object.keys(context);
				keys = keys.splice(1, 1);	// Remove modelName

				// Do key renaming
				for (let key of keys) {
					// WARNING: JAVASCRIPT MAGIC
					result[context[key]] = result[key];		// Create a new property with the right name
					delete result[key];						// Delete property with wrong name
				}

				// Assuming the value doesn't already exist
				saves.push(saveStrategies.createAndSave.call(this, result, context.modelName));
			}

			// Return a promise representing all the saves
			return Promise.all(saves);
		}
	},
	
	/**
	 * Retrieves all models.
	 * 
	 * @param {string} emberName	The model to get.
	 * @returns {Promise}
	 */
	getAllModels: function (emberName) {
		return this.get('store').findAll(emberName).then(records => {
			let meta = records.get('meta');

			// Was not paginated, return
			if (typeof meta === "undefined" || meta === null) {
				return records;
			}

			let total = meta.get('total');
			return this.get('store').query(emberName, { limit: total, offset: 0 });
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
							throw "Student not found!";
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
			throw "Invalid arguments!";
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
				// Save values for row, and store the promise returned; ignore errors if requested
				let savePromise = ignoreSaveErrors ? saveFunction(result).catch((err) => console.warn(err)) : saveFunction(result);
				savePromises.push(savePromise);
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
			throw "Invalid arguments!";
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
			throw "Invalid arguments!";
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
					if (cellValue === "---END OF FILE") { throw "Ignore this."; }
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
			throw "Invalid arguments!";
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
			throw "Missing a parameter in the list of properties to modify and their new value.";
		}
		else if (typeof filter !== "object" || filter === null || typeof emberName !== "string" || emberName.length <= 0) {
			throw "Invalid emberName or filter!";
		}

		// Find the record to change
		return this.get('store').query(emberName, { filter: filter }).then((models) => {
			// No matching model found!
			if (models.get('length') === 0) {
				throw "No model matching filter " + filter + " was found.";
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
			throw "Invalid arguments!";
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
				console.warn("Record " + recordJSON + " already exists. Not saving again.");
				return records.get('firstObject');	// Return previously-saved element
			}

			// Create record
			let model = this.get('store').createRecord(emberName, recordJSON);

			// Return promise of the record saving
			return model.save().then(() => {
				console.log("Added " + emberName.replace("-", " "));
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