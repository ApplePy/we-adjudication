import Ember from 'ember';
import async from 'npm:async';
import XLSX from "npm:xlsx-browserify-shim";

export default Ember.Component.extend({

	store: Ember.inject.service(),

	actions: {
		uploadFile() {

			//var file = Ember.$("#excelSheet").val();
			var file = document.getElementById('excelSheet').files[0];
			var fileName = file.name;
			console.log(file);
			console.log(fileName);

			//File Reader
			var reader = new FileReader();

			//File loads
			reader.onload = (event) => {

				//Get workbook
				var data = event.target.result;
				this.workbook = XLSX.read(data, { type: 'binary' });	// Moved into the "this" variable to save typing

				if (fileName == "genders.xlsx") {

					strategies.singleColumn.call(this, (cellValue) => {
						var gender = this.get('store').createRecord('gender', {
							name: cellValue
						});

						gender.save().then(() => {
							console.log("Added gender");
						}, () => {
							console.log("Could not add gender");
						});
					});

				} else if (fileName == "residencies.xlsx") {

					strategies.singleColumn.call(this, (cellValue) => {

						var residency = this.get('store').createRecord('residency', {
							name: cellValue
						});

						residency.save().then(() => {
							console.log("Added residency");
						}, () => {
							console.log("Could not add residency");
						});

					});
				} else if (fileName == "UndergraduateCourses.xlsx") {
					strategies.byRow.call(this, valueArray => {
						var courseCode = this.get('store').createRecord('course-code', {
							courseLetter: valueArray[0],
							courseNumber: valueArray[1],
							name: valueArray[2],
							unit: valueArray[3]
						});

						courseCode.save().then(() => {
							console.log("Added course code");
						}, () => {
							console.log("Could not add course code");
						});
					});
				} else if (fileName == "HighSchools.xlsx") {

					strategies.singleColumn.call(true, cellValue => {
						var secondarySchool = this.get('store').createRecord('secondary-school', {
							name: cellValue
						});

						secondarySchool.save().then(() => {
							console.log("Added secondary school");
						}, () => {
							console.log("Could not add secondary school");
						});
					});

				} else if (fileName == "students.xlsx") {

					strategies.byRow.call(this, valueArray => {
						this.get('store').query('gender', {
							filter: {
								name: valueArray[3]
							}
						}).then((genders) => {

							gender = genders.get("firstObject");

							//console.log(gender);

							this.get('store').query('residency', {
								filter: {
									name: valueArray[5]
								}
							}).then((residencies) => {

								residency = residencies.get("firstObject");

								var studentJSON = {
									number: valueArray[0],
									firstName: valueArray[1],
									lastName: valueArray[2],
									DOB: new Date(valueArray[4]),	// TODO: THIS DOES NOT WORK.
									genderInfo: gender,
									resInfo: residency
								};
								var student = this.get('store').createRecord('student', studentJSON);


								student.save().then(() => {
									console.log("Added student");
								}, (err) => {
									 console.warn(err);
									console.log("Could not add student");
								});
							});
						});
					});

				} else if (fileName == "AdmissionComments.xlsx") {

					//Get worksheet
					var first_sheet_name = workbook.SheetNames[0];
					var worksheet = workbook.Sheets[first_sheet_name];

					var number;
					var note;

					let admissionComments = new Map();

					for (var R = 1; R <= XLSX.utils.decode_range(worksheet['!ref']).e.r; ++R) {

						for (var C = 0; C <= XLSX.utils.decode_range(worksheet['!ref']).e.c; ++C) {

							var cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
							var cell = worksheet[cellAddress];
							try {
								var cellValue = cell.v;
							} catch (e) {
								var cellValue = number;
							}

							console.log(cellValue);

							if (C == 0) {
								number = cellValue;
							} else if (C == 1) {
								note = cellValue;
							}

							if (C == 1) {
								//Add or update admission comments map
								if (admissionComments.has(number) == undefined) {
									admissionComments.set(number, note);
								} else {
									let noteAddition = admissionComments.get(number);
									if (noteAddition == undefined) {
										noteAddition = "";
									}
									noteAddition += note;
									admissionComments.set(number, noteAddition);
								}
							}
						}
					}

					admissionComments.forEach((value, key) => {

						console.log(key + ' = ' + value);

						if (value != "NONE FOUND") {

							this.get('store').query('student', {
								filter: {
									number: key
								}
							}).then((students) => {

								let student = students.get("firstObject");

								student.set('admissionComments', value);
								student.save().then(() => {
									console.log("Added admission comment");
								}, () => {
									console.log("Could not add admission comment");
								});

							});
						}
					});

				} else if (fileName == "RegistrationComments.xlsx") {

					//Get worksheet
					var first_sheet_name = workbook.SheetNames[0];
					var worksheet = workbook.Sheets[first_sheet_name];

					var number;
					var note;

					let registrationComments = new Map();

					for (var R = 1; R <= XLSX.utils.decode_range(worksheet['!ref']).e.r; ++R) {

						for (var C = 0; C <= XLSX.utils.decode_range(worksheet['!ref']).e.c; ++C) {


							var cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
							var cell = worksheet[cellAddress];
							try {
								var cellValue = cell.v;
							} catch (e) {
								var cellValue = number;
							}

							console.log(cellValue);

							if (C == 0) {
								number = cellValue;
							} else if (C == 1) {
								note = cellValue;
							}

							if (C == 1) {
								//Add or update registration comments map
								if (registrationComments.has(number) == undefined) {
									registrationComments.set(number, note);
								} else {
									let noteAddition = registrationComments.get(number);
									if (noteAddition == undefined) {
										noteAddition = "";
									}
									noteAddition += note;
									registrationComments.set(number, noteAddition);
								}
							}

						}
					}

					registrationComments.forEach((value, key) => {

						console.log(key + ' = ' + value);

						if (value != "NONE FOUND") {

							this.get('store').query('student', {
								filter: {
									number: key
								}
							}).then((students) => {

								let student = students.get("firstObject");

								student.set('registrationComments', value);
								student.save().then(() => {
									console.log("Added registration comment");
								}, () => {
									console.log("Could not add registration comment");
								});

							});
						}
					});
					//}
				} else if (fileName == "BasisOfAdmission.xlsx") {

					//Get worksheet
					var first_sheet_name = workbook.SheetNames[0];
					var worksheet = workbook.Sheets[first_sheet_name];

					var number;
					var note;

					for (var R = 1; R <= XLSX.utils.decode_range(worksheet['!ref']).e.r; ++R) {

						for (var C = 0; C <= XLSX.utils.decode_range(worksheet['!ref']).e.c; ++C) {


							var cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
							var cell = worksheet[cellAddress];
							try {
								var cellValue = cell.v;
							} catch (e) {
								var cellValue = number;
							}

							console.log(cellValue);

							if (C == 0) {
								number = cellValue;
							} else if (C == 1) {
								note = cellValue;
							}

						}

						if (note != "NONE FOUND") {

							this.get('store').query('student', {
								filter: {
									number: number
								}
							}).then((students) => {

								let student = students.get("firstObject");

								student.set('basisOfAdmission', note);
								student.save().then(() => {
									console.log("Added basis of admission");
								}, () => {
									console.log("Could not add basis of admission");
								});

							});
						}
					}
				} else if (fileName == "AdmissionAverages.xlsx") {

					//Get worksheet
					var first_sheet_name = workbook.SheetNames[0];
					var worksheet = workbook.Sheets[first_sheet_name];

					var number;
					var note;

					for (var R = 1; R <= XLSX.utils.decode_range(worksheet['!ref']).e.r; ++R) {

						for (var C = 0; C <= XLSX.utils.decode_range(worksheet['!ref']).e.c; ++C) {


							var cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
							var cell = worksheet[cellAddress];
							try {
								var cellValue = cell.v;
							} catch (e) {
								var cellValue = number;
							}

							console.log(cellValue);

							if (C == 0) {
								number = cellValue;
							} else if (C == 1) {
								note = cellValue;
							}

						}

						if (note != "NONE FOUND") {

							this.get('store').query('student', {
								filter: {
									number: number
								}
							}).then((students) => {

								let student = students.get("firstObject");

								student.set('admissionAverage', note);
								student.save().then(() => {
									console.log("Added admission comment");
								}, () => {
									console.log("Could not add admission comment");
								});

							});
						}
					}
				} else if (fileName == "AdvancedStanding.xlsx") {

					//Get worksheet
					var first_sheet_name = workbook.SheetNames[0];
					var worksheet = workbook.Sheets[first_sheet_name];

					var sheetJSON = XLSX.utils.sheet_to_json(worksheet);
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

								var advancedStanding = this.get('store').createRecord('advanced-standing', {
									course: rowContents.course,
									description: rowContents.description,
									units: rowContents.units,
									grade: rowContents.grade,
									from: rowContents.from,
									recipient: student
								});

								advancedStanding.save().then(() => {
									console.log("Added advanced standing");
								}, () => {
									console.log("Could not add advanced standing");
								});
							});
						}
					}
				} else if (fileName == "scholarshipsAndAwards.xlsx") {

					//Get worksheet
					var first_sheet_name = workbook.SheetNames[0];
					var worksheet = workbook.Sheets[first_sheet_name];

					var sheetJSON = XLSX.utils.sheet_to_json(worksheet);
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

								var award = this.get('store').createRecord('award', {
									note: note,
									recipient: student
								});

								award.save().then(() => {
									console.log("Added award");
								}, () => {
									console.log("Could not add award");
								});
							});
						}
					}
				} else if (fileName == "HighSchoolCourseInformation.xlsx") {

					//Get worksheet
					var first_sheet_name = workbook.SheetNames[0];
					var worksheet = workbook.Sheets[first_sheet_name];

					var sheetJSON = XLSX.utils.sheet_to_json(worksheet);
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

							this.get('store').query('hs-subject', {
								filter: {
									subject: rowContents.subject,
									description: rowContents.description
								}
							}).then((findSubjects) => {

								if (findSubjects.length == 0) {
									var subject = this.get('store').createRecord('hs-subject', {
										name: rowContents.subject,
										description: rowContents.description
									});

									subject.save().then(() => {
										console.log("Added hs subject");
									}, () => {
										console.log("Could not add hs subject");
									});
								} else {
									let subject = findSubjects.get("firstObject");
								}

								this.get('store').query('hs-course-source', {
									filter: {
										code: rowContents.source
									}
								}).then((sources) => {

									if (sources.length == 0) {
										var courseSource = this.get('store').createRecord('hs-course-source', {
											code: rowContents.source
										});

										courseSource.save().then(() => {
											console.log("Added source");
										}, () => {
											console.log("Could not source");
										});
									} else {
										let courseSource = sources.get("firstObject");
									}

									var hsCourse = this.get('store').createRecord('hs-course', {
										level: rowContents.level,
										unit: rowContents.units,
										source: courseSource,
										school: schoolName,
										subject: subject
									});

									hsCourse.save().then(() => {

										console.log("Added hs course");

										this.get('store').query('student', {
											filter: {
												number: studentNumber
											}
										}).then((students) => {

											let student = students.get("firstObject");

											var hsGrade = this.get('store').createRecord('hs-grade', {
												mark: row.grade,
												course: hsCourse,
												recipient: student
											});

											hsGrade.save().then(() => {
												console.log("Added hs grade");
											}, () => {
												console.log("Could not add hs grade");
											});

										}, () => {
											console.log("Could not add hs course");
										});
									});
								});
							});
						}
					}

				} else if (fileName == "UndergraduateRecordCourses.xlsx") {

					//Get worksheet
					var first_sheet_name = workbook.SheetNames[0];
					var worksheet = workbook.Sheets[first_sheet_name];

					var sheetJSON = XLSX.utils.sheet_to_json(worksheet);
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

						var grade = this.get('store').createRecord('grade', {
							mark: rowContents.grade,
							note: rowContents.note
						});

						grade.save().then(() => {

							console.log("Added grade");

							this.get('store').query('student', {
								filter: {
									number: studentNumber
								}
							}).then((students) => {

								let student = students.get("firstObject");

								this.get('store').query('term-code', {
									filter: {
										name: term,
										number: studentNumber
									}
								}).then((termCodes) => {

									if (termCodes.length == 0) {
										var termCode = this.get('store').createRecord('term-code', {
											name: term,
											student: student
										});

										termCode.save().then(() => {
											console.log("Added term code");
										}, () => {
											console.log("Could not add term code");
										});
									} else {
										let termCode = termCodes.get("firstObject");
									}

									this.get('store').query('course-code', {
										filter: {
											courseLetter: rowContents.courseLetter,
											courseNumber: rowContents.courseNumber,
										}
									}).then((courseCodes) => {

										let courseCode = courseCodes.get("firstObject");

										courseCode.set('termInfo', termCode);
										courseCode.set('gradeInfo', grade);
										courseCode.save().then(() => {
											console.log("Added course code");
										}, () => {
											console.log("Could not add course code");
										});

									});

								});

							});

						}, () => {
							console.log("Could not add grade");
						});

					}

				} else if (fileName == "UndergraduateRecordPlans.xlsx") {

					//Get worksheet
					var first_sheet_name = workbook.SheetNames[0];
					var worksheet = workbook.Sheets[first_sheet_name];

					var sheetJSON = XLSX.utils.sheet_to_json(worksheet);
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

							var planCode = this.get('store').createRecord('plan-code', {
								name: plan
							});

							planCode.save().then(() => {

								console.log("Added plan code");

								var status = this.get('store').createRecord('program-status', {
									status: "Active"
								});

								status.save().then(() => {

									console.log("Added status");

									var load = this.get('store').createRecord('course-load', {
										load: load
									});

									load.save().then(() => {

										console.log("Added load");

										this.get('store').query('program-record', {
											filter: {
												name: program,
												level: level,
												load: load,
												status: status
											}
										}).then((programRecords) => {

											if (programRecords.length == 0) {

												var programRecord = this.get('store').createRecord('program-record', {
													name: program,
													level: level,
													load: load,
													status: status,
													plan: [planCode]
												});

												programRecord.save().then(() => {
													console.log("Added program record");
												}, () => {
													console.log("Could not add program record");
												});
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
													var termCode = this.get('store').createRecord('term-code', {
														name: term,
														student: student,
														programRecords: [programRecord]
													});

													termCode.save().then(() => {
														console.log("Added term code");
													}, () => {
														console.log("Could not add term code");
													});
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

let strategies = {
	byRowCarryingPreviousColumnValue : null,
	byRow: function (saveFunction) {
		//Get worksheet
		var first_sheet_name = workbook.SheetNames[0];
		var worksheet = workbook.Sheets[first_sheet_name];

		for (var R = 1; R <= XLSX.utils.decode_range(worksheet['!ref']).e.r; ++R) {

			// Stores all the values from the row
			let valueArray = [];

			for (var C = 0; C <= XLSX.utils.decode_range(worksheet['!ref']).e.c; ++C) {


				var cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
				var cell = worksheet[cellAddress];
				var cellValue = cell.v;

				console.log(cellValue);

				valueArray[C] = cellValue;
			}

			// Save values for row
			saveFunction(valueArray);
		}
	},
	singleColumn: function (saveFunction) {
		//Get worksheet
		let first_sheet_name = this.workbook.SheetNames[0];
		let worksheet = this.workbook.Sheets[first_sheet_name];

		for (let R = 1; R <= XLSX.utils.decode_range(worksheet['!ref']).e.r; ++R) {

			let cellAddress = XLSX.utils.encode_cell({ r: R, c: 0 });
			let cell = worksheet[cellAddress];
			try {
				let cellValue = cell.v;
			} catch (err) {
				// Try/Catch was present in high schools parsing
				console.warn(err);
			}

			console.log(cellValue);

			saveFunction(cellValue);
		}
	}
}