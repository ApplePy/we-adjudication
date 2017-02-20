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

		    	//if (fileName == "termcodes.xlsx") {
		    	if (true) {

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

					    /*var termCode = this.get('store').createRecord('term-code', {
				       		name: cellValue
				        });

				        termCode.save().then(function() {
				        	console.log("Added termcode");
				        }, function() {
				        	console.log("Could not add termcode");
				        });*/

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

					    /*var gender = this.get('store').createRecord('gender', {
				       		name: cellValue
				        });

				        gender.save().then(function() {
				        	console.log("Added gender");
				        }, function() {
				        	console.log("Could not add gender");
				        });*/

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

					    /*var residency = this.get('store').createRecord('residency', {
				       		name: cellValue
				        });

				        residency.save().then(function() {
				        	console.log("Added residency");
				        }, function() {
				        	console.log("Could not add residency");
				        });*/

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
			    		/*var courseCode = this.get('store').createRecord('course-code', {
					       		courseLetter: courseLetter,
								courseNumber: courseNumber,
								name: name,
								unit: unit
					        });

					        courseCode.save().then(function() {
					        	console.log("Added course code");
					        }, function() {
					        	console.log("Could not add course code");
					        });*/
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

					    /*var secondarySchool = this.get('store').createRecord('secondary-school', {
				       		name: cellValue
				        });

				        secondarySchool.save().then(function() {
				        	console.log("Added secondary school");
				        }, function() {
				        	console.log("Could not add secondary school");
				        });*/

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

								residency = residencies.get("firstObject");

								/*var student = this.get('store').createRecord('student', {
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
						        });*/
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

						store.query('student', {
							filter: {
								number: number
							}
						}).then(function(students) {

							student = students.get("firstObject");

							student.set('admissionComments', note);
							student.save().then(function() {
				        		console.log("Added admission comment");
				        	}, function() {
				            	console.log("Could not add admission comment");
				          	});

						});	    		
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

						store.query('student', {
							filter: {
								number: number
							}
						}).then(function(students) {

							student = students.get("firstObject");

							student.set('registrationComments', note);
							student.save().then(function() {
				        		console.log("Added registration comment");
				        	}, function() {
				            	console.log("Could not add registration comment");
				          	});

						});	    		
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

						store.query('student', {
							filter: {
								number: number
							}
						}).then(function(students) {

							student = students.get("firstObject");

							student.set('basisOfAdmission', note);
							student.save().then(function() {
				        		console.log("Added basis of admission");
				        	}, function() {
				            	console.log("Could not add basis of admission");
				          	});

						});	    		
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

						store.query('student', {
							filter: {
								number: number
							}
						}).then(function(students) {

							student = students.get("firstObject");

							student.set('admissionAverage', note);
							student.save().then(function() {
				        		console.log("Added admission comment");
				        	}, function() {
				            	console.log("Could not add admission comment");
				          	});

						});	    		
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

						store.query('student', {
							filter: {
								number: studentNumber
							}
						}).then(function(students) {

							student = students.get("firstObject");

							/*var advancedStanding = this.get('store').createRecord('advanced-standing', {
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
					        });*/
						});	
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

						store.query('student', {
							filter: {
								number: studentNumber
							}
						}).then(function(students) {

							student = students.get("firstObject");

							/*var award = this.get('store').createRecord('award', {
					       		note: note,
								recipient: student
					        });

					        award.save().then(function() {
					        	console.log("Added award");
					        }, function() {
					        	console.log("Could not add award");
					        });*/
						});	
					}
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
