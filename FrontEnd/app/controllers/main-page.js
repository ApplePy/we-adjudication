import Ember from 'ember';

export default Ember.Controller.extend({
    
    gender:"",
    residency:"",
    
    init() {
        var mystore = this.get('store');
        mystore.findRecord('student', 'first').then(student => {
            this.set('sNum', student.get('studentNo'));
            this.set('fName', student.get('firstName'));
            this.set('lName', student.get('lastName'));
            this.set('dob', student.get('dob'));
            this.set('gender', student.get('gender'));
            this.set('residency',  String(student.get('residency') + 1));
            
            document.getElementById("resDropDown").selectedIndex = this.get('residency');
            $('#resDropDown').trigger('change');
            if (this.get('gender') == false) {
                document.getElementById("genderDropDown").selectedIndex = 1;
            } else if (this.get('gender')== true) {
                document.getElementById("genderDropDown").selectedIndex = 2;
            }
        
            $('#genderDropDown').trigger('change');
        });
    },
    
    actions: {
        
        changeGender(gender){
            if (gender == "1") {
                this.set('gender', false);
            } else if (gender == "2") {
                this.set('gender', true);   
            }
        },
              
        changeResidency(residencyNum){
            this.set('residency', Number(residencyNum));
        },
        
        save() { //this is done
            if(this.get('sNum') == "" || this.get('fName') == "" || this.get('lName') == "" || this.get('dob') == "" || typeof this.get('residency') == "string" || typeof this.get('gender') == "string") {
                alert("Fields cannot be empty.");
            } else {
                var mystore = this.get('store');
                mystore.findRecord('student', this.get('sNum')).then(student => {
                    //sets the model data by getting the values of the user inputted feilds
                    student.set('studentNo', this.get('sNum'));
                    student.set('firstName', this.get('fName'));
                    student.set('lastName', this.get('lName'));
                    student.set('dob', this.get('dob'));
                    student.set('residency', this.get('residency'));
                    student.set('gender', this.get('gender'));
                    //saves the set data, this then does an AJAX request on its own. Ember is smart enough 
                    //to know whether data has been changed or not (in otherwords whether it is sending a PUT or POST)
                    student.save(); 
                },
                error => {
                    mystore.createRecord('student', {
                        id:  this.get('sNum'),
                        studentNo: this.get('sNum'),
                        firstName: this.get('fName'),
                        lastName: this.get('lName'),
                        dob: this.get('dob'),
                        residency: this.get('residency'),
                        gender: this.get('gender')
                    }).save();
                });
            }
        },
        
        undo() { //this is done
            console.log(this.get('sNum'));
            var mystore = this.get('store');
            mystore.findRecord('student', this.get('sNum')).then(student => {
                
                //Display previous record (if no previous record exists then the data won't change)
                this.set('sNum', student.get('studentNo'));
                this.set('fName', student.get('firstName'));
                this.set('lName', student.get('lastName'));
                this.set('dob', student.get('dob'));
                this.set('gender', student.get('gender'));
                this.set('residency', String(student.get('residency') + 1));
                document.getElementById("resDropDown").selectedIndex = this.get('residency');
                $('#resDropDown').trigger('change');
                
                if (this.get('gender') == false) {
                    document.getElementById("genderDropDown").selectedIndex = 1;
                } else if (this.get('gender')== true) {
                    document.getElementById("genderDropDown").selectedIndex = 2;
                }
            
                $('#genderDropDown').trigger('change');
            });
        },
        
        first() { //this is done
            var mystore = this.get('store');
            mystore.findRecord('student', 'first').then(student => {
                this.set('sNum', student.get('studentNo'));
                this.set('fName', student.get('firstName'));
                this.set('lName', student.get('lastName'));
                this.set('dob', student.get('dob'));
                this.set('gender', student.get('gender'));
                this.set('residency',  String(student.get('residency') + 1));
                
                document.getElementById("resDropDown").selectedIndex = this.get('residency');
                $('#resDropDown').trigger('change');
                if (this.get('gender') == false) {
                    document.getElementById("genderDropDown").selectedIndex = 1;
                } else if (this.get('gender')== true) {
                    document.getElementById("genderDropDown").selectedIndex = 2;
                }
            
                $('#genderDropDown').trigger('change');
            });
        },
        
        previousRecord() {
            console.log("prev clicked");
            var mystore = this.get('store');
            mystore.queryRecord('student', { filter: { before: this.get('sNum')} }).then (student => {
            //mystore.findRecord('student', this.get('sNum'), 'previous').then(student => {
                this.set('sNum', student.get('studentNo'));
                this.set('fName', student.get('firstName'));
                this.set('lName', student.get('lastName'));
                this.set('dob', student.get('dob'));
                this.set('gender', student.get('gender'));
                this.set('residency',  String(student.get('residency') + 1));
                
                document.getElementById("resDropDown").selectedIndex = this.get('residency');
                $('#resDropDown').trigger('change');
                if (this.get('gender') == false) {
                    document.getElementById("genderDropDown").selectedIndex = 1;
                } else if (this.get('gender')== true) {
                    document.getElementById("genderDropDown").selectedIndex = 2;
                }
            
                $('#genderDropDown').trigger('change');
            });
        },
        
        nextRecord() {
            
            console.log("next clicked");
            var mystore = this.get('store');
            mystore.queryRecord('student', { filter: { after: this.get('sNum')} }).then (student => {
            //mystore.findRecord('student', this.get('sNum'), 'next').then(student => {
                this.set('sNum', student.get('studentNo'));
                this.set('fName', student.get('firstName'));
                this.set('lName', student.get('lastName'));
                this.set('dob', student.get('dob'));
                this.set('gender', student.get('gender'));
                this.set('residency',  String(student.get('residency') + 1));
                
                document.getElementById("resDropDown").selectedIndex = this.get('residency');
                $('#resDropDown').trigger('change');
                if (this.get('gender') == false) {
                    document.getElementById("genderDropDown").selectedIndex = 1;
                } else if (this.get('gender')== true) {
                    document.getElementById("genderDropDown").selectedIndex = 2;
                }
            
                $('#genderDropDown').trigger('change');
            });
        },
        
        lastRecord() { //this is done
            var mystore = this.get('store');
            mystore.findRecord('student', 'last').then(student => {
                this.set('sNum', student.get('studentNo'));
                this.set('fName', student.get('firstName'));
                this.set('lName', student.get('lastName'));
                this.set('dob', student.get('dob'));
                this.set('gender', student.get('gender'));
                this.set('residency',  String(student.get('residency') + 1));
                
                document.getElementById("resDropDown").selectedIndex = this.get('residency');
                $('#resDropDown').trigger('change');
                if (this.get('gender') == false) {
                    document.getElementById("genderDropDown").selectedIndex = 1;
                } else if (this.get('gender')== true) {
                    document.getElementById("genderDropDown").selectedIndex = 2;
                }
            
                $('#genderDropDown').trigger('change');
            });
        },
        
        find() { //done this
            
            var mystore = this.get('store');
            mystore.findRecord('student', this.get('findsNum')).then(student => {
                
                //Display previous record (if no previous record exists then the data won't change)
                this.set('sNum', student.get('studentNo'));
                this.set('fName', student.get('firstName'));
                this.set('lName', student.get('lastName'));
                this.set('dob', student.get('dob'));
                this.set('gender', student.get('gender'));
                this.set('residency', String(student.get('residency') + 1));
                document.getElementById("resDropDown").selectedIndex = this.get('residency');
                $('#resDropDown').trigger('change');
                
                if (this.get('gender') == false) {
                    document.getElementById("genderDropDown").selectedIndex = 1;
                  
                } else if (this.get('gender')== true) {
                    document.getElementById("genderDropDown").selectedIndex = 2;
                }
                $('#genderDropDown').trigger('change');
                
            });
        }
    }
});
