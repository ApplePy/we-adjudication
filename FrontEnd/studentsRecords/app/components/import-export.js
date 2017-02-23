import Ember from 'ember';

export default Ember.Component.extend({

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
		    reader.onload = function(event) {

		    	//Get workbook
		    	var data = event.target.result;
		    	var workbook = XLSX.read(data, {type: 'binary'});

		    	if (fileName == "termcodes.xlsx") {

		    		//Get worksheet
		    		var first_sheet_name = workbook.SheetNames[0];
					var worksheet = workbook.Sheets[first_sheet_name];

					var sheetJSON = XLSX.utils.sheet_to_json(worksheet);
					console.log(sheetJSON);

					for(var R = 1; R <=  XLSX.utils.decode_range(worksheet['!ref']).e.r; ++R) {

						var cellAddress = XLSX.utils.encode_cell({r: R, c: 0});
					    var cell = worksheet[cellAddress];
					    var cellValue = cell.v;

					    console.log(cellValue);

					    var termCode = this.get('store').createRecord('term-code', {
				       		name: cellValue
				        });

				        termCode.save().then(function() {
				        	console.log("Added termcode");
				        }, function() {
				        	console.log("Could not add termcode");
				        });

					}
		    	} else if(fileName == "genders.xlsx") {

		    		//Get worksheet
		    		var first_sheet_name = workbook.SheetNames[0];
					var worksheet = workbook.Sheets[first_sheet_name];

					for(var R = 1; R <=  XLSX.utils.decode_range(worksheet['!ref']).e.r; ++R) {

						var cellAddress = XLSX.utils.encode_cell({r: R, c: 0});
					    var cell = worksheet[cellAddress];
					    var cellValue = cell.v;

					    console.log(cellValue);

					    var gender = this.get('store').createRecord('gender', {
				       		name: cellValue
				        });

				        gender.save().then(function() {
				        	console.log("Added gender");
				        }, function() {
				        	console.log("Could not add gender");
				        });

		    		}
		    	} else if (fileName == "residencies.xlsx") {

		    		//Get worksheet
		    		var first_sheet_name = workbook.SheetNames[0];
					var worksheet = workbook.Sheets[first_sheet_name];

					for(var R = 1; R <=  XLSX.utils.decode_range(worksheet['!ref']).e.r; ++R) {

						var cellAddress = XLSX.utils.encode_cell({r: R, c: 0});
					    var cell = worksheet[cellAddress];
					    var cellValue = cell.v;

					    console.log(cellValue);

					    var residency = this.get('store').createRecord('residency', {
				       		name: cellValue
				        });

				        residency.save().then(function() {
				        	console.log("Added residency");
				        }, function() {
				        	console.log("Could not add residency");
				        });

		    		}
		    	} else if (fileName == "UndergraduateCourses.xlsx") {

		    		//Get worksheet
		    		var first_sheet_name = workbook.SheetNames[0];
					var worksheet = workbook.Sheets[first_sheet_name];

					for(var R = 1; R <=  XLSX.utils.decode_range(worksheet['!ref']).e.r; ++R) {

						var courseLetter;
						var courseNumber;
						var name;
						var unit;

						for(var C = 0; C <=  XLSX.utils.decode_range(worksheet['!ref']).e.c; ++C) {
						

							var cellAddress = XLSX.utils.encode_cell({r: R, c: C});
						    var cell = worksheet[cellAddress];
						    var cellValue = cell.v;

						    console.log(cellValue);

						    if (C == 0) {
						    	courseLetter = cellValue;
						    } else if (C == 1) {
						    	courseNumber = cellValue;
						    } else if (C == 2) {
						    	name = cellValue;
						    } else if (C == 3) {
						    	unit = cellValue;
						    }

			    		}
			    		var courseCode = this.get('store').createRecord('course-code', {
				       		courseLetter: courseLetter,
							courseNumber: courseNumber,
							name: name,
							unit: unit
				        });

				        courseCode.save().then(function() {
				        	console.log("Added course code");
				        }, function() {
				        	console.log("Could not add course code");
				        });
			    	}
		    	} else if (fileName == "HighSchools.xlsx") {

		    		//Get worksheet
		    		var first_sheet_name = workbook.SheetNames[0];
					var worksheet = workbook.Sheets[first_sheet_name];

					for(var R = 1; R <=  XLSX.utils.decode_range(worksheet['!ref']).e.r; ++R) {

						var cellAddress = XLSX.utils.encode_cell({r: R, c: 0})
					    var cell = worksheet[cellAddress];
					    var cellValue = cell.v;

					    console.log(cellValue);

					    var secondarySchool = this.get('store').createRecord('secondary-school', {
				       		name: cellValue
				        });

				        secondarySchool.save().then(function() {
				        	console.log("Added secondary school");
				        }, function() {
				        	console.log("Could not add secondary school");
				        });

		    		}
		    	} else if (fileName == "students.xlsx") {

		    		//Get worksheet
		    		var first_sheet_name = workbook.SheetNames[0];
					var worksheet = workbook.Sheets[first_sheet_name];

					for(var R = 1; R <=  XLSX.utils.decode_range(worksheet['!ref']).e.r; ++R) {

						var number;
						var firstName;
						var lastName;
						var DOB;
						var gender;
						var residency;

						for(var C = 0; C <=  XLSX.utils.decode_range(worksheet['!ref']).e.c; ++C) {
						

							var cellAddress = XLSX.utils.encode_cell({r: R, c: C});
						    var cell = worksheet[cellAddress];
						    var cellValue = cell.v;

						    console.log(cellValue);

						    if (C == 0) {
						    	number = cellValue;
						    } else if (C == 1) {
						    	firstName = cellValue;
						    } else if (C == 2) {
						    	lastName = cellValue;
						    } else if (C == 3) {
						    	DOB = cellValue;
						    } else if (C == 4) {
						    	gender = cellValue;
						    } else if (C == 5) {
						    	residency = cellValue;
						    }

			    		}

						store.query('gender', {
							filter: {
								name: gender
							}
						}).then(function(genders) {

							gender = genders.get("firstObject");

							store.query('residency', {
								filter: {
									name: residency
								}
							}).then(function(residencies) {

								let residency = residencies.get("firstObject");

								var student = this.get('store').createRecord('student', {
						       		number: number,
									firstName: firstName,
									lastname: lastName,
									DOB: DOB,
									gender: gender,
									residency: residency
						        });

						        student.save().then(function() {
						        	console.log("Added student");
						        }, function() {
						        	console.log("Could not add student");
						        });
							});
						});	    		
			    	}
		    	} else if (fileName == "AdmissionComments.xlsx") {

		    		//Get worksheet
		    		var first_sheet_name = workbook.SheetNames[0];
					var worksheet = workbook.Sheets[first_sheet_name];

					for(var R = 1; R <=  XLSX.utils.decode_range(worksheet['!ref']).e.r; ++R) {

						var number;
						var note;

						for(var C = 0; C <=  XLSX.utils.decode_range(worksheet['!ref']).e.c; ++C) {
						

							var cellAddress = XLSX.utils.encode_cell({r: R, c: C});
						    var cell = worksheet[cellAddress];
						    var cellValue = cell.v;

						    console.log(cellValue);

						    if (C == 0) {
						    	number = cellValue;
						    } else if (C == 1) {
						    	note = cellValue;
						    }

			    		}

			    		if (note != "NONE FOUND") {

							store.query('student', {
								filter: {
									number: number
								}
							}).then(function(students) {

								let student = students.get("firstObject");

								student.set('admissionComments', note);
								student.save().then(function() {
					        		console.log("Added admission comment");
					        	}, function() {
					            	console.log("Could not add admission comment");
					          	});

							});
						}	    		
			    	}
		    	} else if (fileName == "RegistrationComments.xlsx") {

		    		//Get worksheet
		    		var first_sheet_name = workbook.SheetNames[0];
					var worksheet = workbook.Sheets[first_sheet_name];

					for(var R = 1; R <=  XLSX.utils.decode_range(worksheet['!ref']).e.r; ++R) {

						var number;
						var note;

						for(var C = 0; C <=  XLSX.utils.decode_range(worksheet['!ref']).e.c; ++C) {
						

							var cellAddress = XLSX.utils.encode_cell({r: R, c: C});
						    var cell = worksheet[cellAddress];
						    var cellValue = cell.v;

						    console.log(cellValue);

						    if (C == 0) {
						    	number = cellValue;
						    } else if (C == 1) {
						    	note = cellValue;
						    }

			    		}

			    		if (note != "NONE FOUND") {

							store.query('student', {
								filter: {
									number: number
								}
							}).then(function(students) {

								let student = students.get("firstObject");

								student.set('registrationComments', note);
								student.save().then(function() {
					        		console.log("Added registration comment");
					        	}, function() {
					            	console.log("Could not add registration comment");
					          	});

							});
						}	    		
			    	}
		    	} else if (fileName == "BasisOfAdmission.xlsx") {

		    		//Get worksheet
		    		var first_sheet_name = workbook.SheetNames[0];
					var worksheet = workbook.Sheets[first_sheet_name];

					for(var R = 1; R <=  XLSX.utils.decode_range(worksheet['!ref']).e.r; ++R) {

						var number;
						var note;

						for(var C = 0; C <=  XLSX.utils.decode_range(worksheet['!ref']).e.c; ++C) {
						

							var cellAddress = XLSX.utils.encode_cell({r: R, c: C});
						    var cell = worksheet[cellAddress];
						    var cellValue = cell.v;

						    console.log(cellValue);

						    if (C == 0) {
						    	number = cellValue;
						    } else if (C == 1) {
						    	note = cellValue;
						    }

			    		}

			    		if (note != "NONE FOUND") {

							store.query('student', {
								filter: {
									number: number
								}
							}).then(function(students) {

								let student = students.get("firstObject");

								student.set('basisOfAdmission', note);
								student.save().then(function() {
					        		console.log("Added basis of admission");
					        	}, function() {
					            	console.log("Could not add basis of admission");
					          	});

							});
						}  		
			    	}
		    	} else if (fileName == "AdmissionAverages.xlsx") {

		    		//Get worksheet
		    		var first_sheet_name = workbook.SheetNames[0];
					var worksheet = workbook.Sheets[first_sheet_name];

					for(var R = 1; R <=  XLSX.utils.decode_range(worksheet['!ref']).e.r; ++R) {

						var number;
						var note;

						for(var C = 0; C <=  XLSX.utils.decode_range(worksheet['!ref']).e.c; ++C) {
						

							var cellAddress = XLSX.utils.encode_cell({r: R, c: C});
						    var cell = worksheet[cellAddress];
						    var cellValue = cell.v;

						    console.log(cellValue);

						    if (C == 0) {
						    	number = cellValue;
						    } else if (C == 1) {
						    	note = cellValue;
						    }

			    		}

			    		if (note != "NONE FOUND") {

							store.query('student', {
								filter: {
									number: number
								}
							}).then(function(students) {

								let student = students.get("firstObject");

								student.set('admissionAverage', note);
								student.save().then(function() {
					        		console.log("Added admission comment");
					        	}, function() {
					            	console.log("Could not add admission comment");
					          	});

							});
						}	    		
			    	}
		    	} else if(fileName == "AdvancedStanding.xlsx") {

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

							store.query('student', {
								filter: {
									number: studentNumber
								}
							}).then(function(students) {

								let student = students.get("firstObject");

								var advancedStanding = this.get('store').createRecord('advanced-standing', {
						       		course: rowContents.course,
									description: rowContents.description,
									units: rowContents.units,
									grade: rowContents.grade,
									from: rowContents.from,
									recipient: student
						        });

						        advancedStanding.save().then(function() {
						        	console.log("Added advanced standing");
						        }, function() {
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

							store.query('student', {
								filter: {
									number: studentNumber
								}
							}).then(function(students) {

								let student = students.get("firstObject");

								var award = this.get('store').createRecord('award', {
						       		note: note,
									recipient: student
						        });

						        award.save().then(function() {
						        	console.log("Added award");
						        }, function() {
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

						if (schoolName != "NONE FOUND") {

							//Save possibly new subject
							store.query('hs-subject', {
								filter: {
									subject: rowContents.subject,
									description: rowContents.description
								}
							}).then(function(findSubjects) {	

								if (findSubjects.length == 0) {
									var hsSubject = this.get('store').createRecord('hs-subject', {
							        	name: rowContents.subject,
										description: rowContents.description
									});

							        hsSubject.save().then(function() {
							        	console.log("Added hs subject");
							        }, function() {
							        	console.log("Could not add hs subject");
							        });
							    } else {
							    	subject = findSubjects.get("firstObject");
							    }
							});

							//Save possibly new source
							store.query('hs-course-source', {
								filter: {
									code: rowContents.source
								}
							}).then(function(sources) {

								if (findSubjects.length == 0) {
									var source = this.get('store').createRecord('hs-course-source', {
							        	code: rowContents.source
									});

							        source.save().then(function() {
							        	console.log("Added source");
							        }, function() {
							        	console.log("Could not source");
							        });
							    } else {
							    	source = sources.get("firstObject");
							    }
							});

						}

						//Add row to rows
						let fullRow = rowContents;
						fullRow.studentNumber = studentNumber;
						fullRow.schoolName = schoolName;
						rows.push(fullRow);
					}

					for (row of rows) {

						if (row.schoolName != "NONE FOUND") {

							store.query('hs-subject', {
								filter: {
									subject: row.subject,
									description: row.description
								}
							}).then(function(findSubjects) {

								let subject = findSubjects.get("firstObject");

								store.query('hs-course-source', {
									filter: {
										code: rowContents.source
									}
								}).then(function(courseSources) {

									let courseSource = courseSources.get("firstObject");

									var hsCourse = this.get('store').createRecord('hs-course', {
							        	level: row.level,
										unit: row.units,
										source: courseSource,
										school: row.schoolName,
										subject: subject
									});

							        hsCourse.save().then(function() {

							        	console.log("Added hs course");

							        	store.query('student', {
											filter: {
												number: row.studentNumber
											}
										}).then(function(students) {

											let student = students.get("firstObject");

											var hsGrade = this.get('store').createRecord('hs-grade', {
									       		mark: row.grade,
												course: hsCourse,
												recipient: student
									        });
											
											hsGrade.save().then(function() {
									        	console.log("Added hs grade");
									        }, function() {
									        	console.log("Could not add hs grade");
									        });

								        }, function() {
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
					}

					var grade = this.get('store').createRecord('grade', {
			       		mark: rowContents.grade,
						note: rowContents.note
			        });
					
					grade.save().then(function() {

			        	console.log("Added grade");

			        	store.query('student', {
							filter: {
								number: studentNumber
							}
						}).then(function(students) {

							let student = students.get("firstObject");

							var termCode = this.get('store').createRecord('term-code', {
					       		name: term,
					       		student: student
					        });

					        termCode.save().then(function() {

					        	console.log("Added termcode");

					        	store.query('course-code', {
									filter: {
										courseLetter: rowContents.courseLetter,
										courseNumber: rowContents.courseNumber,
									}
								}).then(function(courseCodes) {

									let courseCode = courseCodes.get("firstObject");

									courseCode.set('termInfo', termCode);
									courseCode.set('gradeInfo', grade);
							        courseCode.save().then(function() {
							        	console.log("Added course code");
							        }, function() {
							        	console.log("Could not add course code");
							        });

								});

					        }, function() {
					        	console.log("Could not add termcode");
					        });

						});   	

			        }, function() {
			        	console.log("Could not add grade");
			        });

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
					}

					store.query('student', {
						filter: {
							number: studentNumber
						}
					}).then(function(students) {

						let student = students.get("firstObject");

						var termCode = this.get('store').createRecord('term-code', {
				       		name: term,
				       		student: student
				        });

				        termCode.save().then(function() {

				        	console.log("Added termcode");

				        	var status = this.get('store').createRecord('program-status', {
					       		status: "ACTIVE"
					        });
							
							status.save().then(function() {

					        	console.log("Added status");

								var load = this.get('store').createRecord('course-load', {
						       		load: load
						        });
								
								load.save().then(function() {

						        	console.log("Added load");

						        	var programRecord = this.get('store').createRecord('program-record', {
							       		name: program,
										level: level,
										load: load,
										status: status,
										semester: termCode
							        });
									
									programRecord.save().then(function() {

							        	console.log("Added program record");

							        	var planCode = this.get('store').createRecord('plan-code', {
								       		name: plan,
											programRecords: [programRecord]
								        });
										
										planCode.save().then(function() {

								        	console.log("Added plan code");	

								        }, function() {
								        	console.log("Could not add plan code");
								        });

							        }, function() {
							        	console.log("Could not add program record");
							        });
						        	
						        }, function() {
						        	console.log("Could not add load");
						        });				        	

					        }, function() {
					        	console.log("Could not add status");
					        });

				        }, function() {
				        	console.log("Could not add termcode");
				        });
					});
		    	}
		    };
		    
		    //Error in file loading
		    reader.onerror = function (event) {
		        alert("Error in loading file.");
		    };

		    //Read file
		    reader.readAsBinaryString(file);

		}
	}

});