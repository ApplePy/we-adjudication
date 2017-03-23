import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  codeModel: [],
  booleanExp: null,
  student: null,
  terms: [], //all of the students term objs
  programRecords: [],
  courses: [],
  selectedCourse: null,
  ruleExp: "",
  parseResult: "",
  ruleToRule: "",
  date: null,
  studentArray: [],
  notDONE: null,
  termCode: null,
  manualAdjuID: null,
  isFinished: false,
  isWorking: false,
  hasError: false,
  parsingError: false,

  init(){
    this._super(...arguments);
 this.get('store').query('adjudication', {limit: 10}).then((records) => {
      let totalRecords = records.get('meta').total;
      let offsetUsed = records.get('meta').offset;
      let limitUsed = records.get('meta').limit;
      this.get('store').query('adjudication', {limit: totalRecords})
    });


    this.set('codeModel', []);
    this.get('store').query('assessment-code', {limit: 10}).then((records) => {
      let totalRecords = records.get('meta').total;
      let offsetUsed = records.get('meta').offset;
      let limitUsed = records.get('meta').limit;
      this.get('store').query('assessment-code', {limit: totalRecords}).then((rules) => {
        for(var i=0; i < rules.get('length'); i++){
          this.get('codeModel').pushObject(rules.objectAt(i));
          if(rules.objectAt(i).get('code') == "Manually Adjudicate"){
            this.set('manualAdjuID', rules.objectAt(i));
          }
        }
      });
    });
    this.get('store').query('logical-expression', {limit: 10}).then((records) => {
      let totalRecords = records.get('meta').total;
      let offsetUsed = records.get('meta').offset;
      let limitUsed = records.get('meta').limit;
      this.get('store').query('logical-expression', {limit: totalRecords});
    });
    this.get('store').findAll('program-status');
    this.get('store').findAll('plan-code');
    this.get('store').findAll('course-load');
    //load all of the grades into the store
    this.get('store').query('grade', {limit: 10}).then((records) => {
      let totalRecords = records.get('meta').total;
      let offsetUsed = records.get('meta').offset;
      let limitUsed = records.get('meta').limit;
      this.get('store').query('grade', {limit: totalRecords});
    });
    this.get('store').query('program-record', {limit: 10}).then((records) => {
      let totalRecords = records.get('meta').total;
      let offsetUsed = records.get('meta').offset;
      let limitUsed = records.get('meta').limit;
      this.get('store').query('program-record', {limit: totalRecords});
    });
    this.get('store').query('course-code', {limit: 10}).then((records) => {
      let totalRecords = records.get('meta').total;
      let offsetUsed = records.get('meta').offset;
      let limitUsed = records.get('meta').limit;
      this.get('store').query('course-code', {limit: totalRecords});
    });
  },

  parseRules(ruleExp, ruleObj, rule){
    ruleExp += '(';
    //Get each boolean expression within the rule
    for(var k=0; k < rule.length; k++){
  //    try {
      //Parse through to get the parameter, operator, value, and link for the
      var m = rule.indexOf('(', k);
      if(rule.substr(m + 1, 4) === "Rule"){
        var y = rule.indexOf('[', m);
        var z = rule.indexOf(']', y);
        k = rule.indexOf(')', z);
        y = rule.indexOf('[', y + 1);
        while(y < z && y != -1){
            y = rule.indexOf('[', y + 1);
            k = rule.indexOf(')', z);
            z = rule.indexOf(']', z + 1);
          }
        var exp = rule.substr(m,k - m);
        var endParam = exp.indexOf(' ') - 1
        var param = exp.substr(1, endParam);
        var endOpr = exp.indexOf(" ", endParam + 2);
        var opr = exp.substr(endParam + 2, endOpr - endParam - 2);
        var value = exp.substr(endOpr + 2, exp.length - endOpr - 3);
        var link = rule.substr(k + 2, rule.indexOf(' ', k + 2) - k - 2);
        if(link == "AND"){
          link = '&&';
        } else if (link == "OR"){
          link = '||';
        }
        this.parseRules("", null, value);
      } else {
        k= rule.indexOf(')', m);
        var exp = rule.substr(m,k - m);
        var endParam = exp.indexOf(' ') - 1
        var param = exp.substr(1, endParam);
        var endOpr = exp.indexOf(" ", endParam + 2);
        var opr = exp.substr(endParam + 2, endOpr - endParam - 2);

        var value = exp.substr(endOpr + 1);
        var link = rule.substr(k + 2, rule.indexOf(' ', k + 2) - k - 2);
        if(link == "AND"){
          link = '&&';
        } else if (link == "OR"){
          link = '||';
        }
      }
      var found = false;
      //Get the value based on the parameter
      if (param === "CourseLetter"){
        for(var n = 0; n < this.get('courses').get('length'); n++){
          if(this.get('courses').objectAt(n).get('courseLetter') == value){
            this.set('selectedCourse', this.get('courses').objectAt(n));
            param = this.get('courses').objectAt(n).get('courseLetter');
            found = true;
            break;
          }
        }
      } else if (param === "CourseLetterAndNumber"){
        //Not yet implemented
      } else if (param === "CourseNumber"){
        for(var n = 0; n < this.get('courses').get('length'); n++){
          if(this.get('courses').objectAt(n).get('courseNumber') == value){
            this.set('selectedCourse', this.get('courses').objectAt(n));
            param = this.get('courses').objectAt(n).get('courseNumber');
            found = true;
          }
        }
      } else if (param === "CourseName"){
        for(var n = 0; n < this.get('courses').get('length'); n++){
          if(this.get('courses').objectAt(n).get('name') == value){
            this.set('selectedCourse', this.get('courses').objectAt(n));
            param = this.get('courses').objectAt(n).get('name');
            found = true;
          }
        }
      } else if (param === "CourseUnit"){
        for(var n = 0; n < this.get('courses').get('length'); n++){
          if(this.get('courses').objectAt(n).get('unit') == value){
            this.set('selectedCourse', this.get('courses').objectAt(n));
            param = this.get('courses').objectAt(n).get('unit');
            found = true;
          }
        }
      } else if (param === "CumulativeAverage"){
        //NOT YET IMPLEMENTED
      } else if (param === "Mark"){
        if(this.get('selectedCourse').get('gradeInfo').get('mark') == value){
          param = this.get('selectedCourse').get('gradeInfo').get('mark');
          found = true;
        }
      } else if (param === "ProgramName"){
        for(var n = 0; n < this.get('programRecords').get('length'); n++){
          if(this.get('programRecords').objectAt(n).get('name') == value){
            param = this.get('programRecords').objectAt(n).get('name');
            found = true;
          }
        }
      } else if (param === "ProgramLevel"){
        for(var n = 0; n < this.get('programRecords').get('length'); n++){
          if(this.get('programRecords').objectAt(n).get('name') == value){
            param = this.get('programRecords').objectAt(n).get('name');
            found = true;
          }
        }
      } else if (param === "ProgramLoad"){
        for(var n = 0; n < this.get('programRecords').get('length'); n++){
          if(this.get('programRecords').objectAt(n).get('load').get('load') == value){
            param = this.get('programRecords').objectAt(n).get('load').get('load');
            found = true;
          }
        }
      } else if (param === "ProgramStatus"){
        for(var n = 0; n < this.get('programRecords').get('length'); n++){
          if(this.get('programRecords').objectAt(n).get('status').get('status') == value){
            param = this.get('programRecords').objectAt(n).get('status').get('status');
            found = true;
          }
        }
      } else if (param === "Plan"){
        for(var n = 0; n < this.get('programRecords').get('length'); n++){
          for(var p = 0; p < this.get('programRecords').objectAt(n).get('plan').get('length'); p++){
            if(this.get('programRecords').objectAt(n).get('plan').objectAt(p).get('name') == value){
              param = this.get('programRecords').objectAt(n).get('plan').objectAt(p).get('name');
              found = true;
            }
          }
        }
      } else if (param === "Rule"){
        //this.parseRules("", null, value);
        param = true;
        found = true;
        value = this.get('ruleToRule');
      } else if (param === "TermAverage"){
        //NOT YET IMPLEMENTED
      }
      if(!found){
        param = null;
      }
        ruleExp += eval(param + opr + value);
        ruleExp += link;
     // }
    /*  catch(err) {
        console.log("error: " + err);
        this.set('parsingError', true);
      } */
    } //end of for loop
    ruleExp += ')';
    if(ruleObj != null){
      var logicalLink = ruleObj.get('logicalLink');
      if(logicalLink == 'AND'){
        logicalLink = '&&';
      } else if(logicalLink == 'OR'){
        logicalLink = '||';
      } else {
        logicalLink = "";
      }
      ruleExp += logicalLink;
      this.set('parseResult', ruleExp);
    } else {
      this.set('ruleToRule', ruleExp);
    }
  },

  actions:{
loop(){
  this.send('working');
      for(var b=0; b < this.get('terms').length; b++){
        this.set('courses', this.get('terms').objectAt(b).get('courses'));
        this.set('programRecords', this.get('terms').objectAt(b).get('programRecords'));
        //for each code...
        var codeToAdd = null;
        for(var i=0; i < this.get('codeModel').get('length'); i++){
          //get each rule.  For each logicalexpression...
          this.set('ruleExp', "");
          var ruleExp = '';
          for(var j=0; j < this.get('codeModel').objectAt(i).get('logicalExpressions').get('length'); j++){
            //Get the rule object...
            var ruleObj = this.get('codeModel').objectAt(i).get('logicalExpressions').objectAt(j);
            var rule = ruleObj.get('booleanExp');
            this.parseRules(ruleExp, ruleObj, rule);
            this.set('ruleExp', this.get('ruleExp') + this.get('parseResult'));
          }
          //Just console logging for now.  Will have to check if true/false
          if(eval(this.get('ruleExp'))) {
            codeToAdd = this.get('codeModel').objectAt(i);
            break;
          }
        }

        if (codeToAdd == null) {
          codeToAdd = this.get('manualAdjuID');
          this.set('hasError', true);
        }
  for(var z = 0; z < this.get('terms').objectAt(b).get('adjudications').get('length'); z++) {
  this.get('store').findRecord('adjudication',this.get('terms').objectAt(b).get('adjudications').objectAt(z).get('id'), { backgroundReload: false }).then(function(standing) {
        standing.deleteRecord();
        standing.save();
      });
}

        //Save the adjudication stuff
        var adjudication = this.get('store').createRecord('adjudication', {
        date: new Date(this.get('date')),
        assessmentCode: codeToAdd,
    term: this.get('terms').objectAt(b),
    //unset these after we get import working (we will assume we are always given these fields)
        termAVG: 0,
        termUnitsPassed: 0,
        termUnitsTotal: 0,
      });
      adjudication.save();
      }
      this.send('done');
    },


    //Gets rid of the modal
    cancel: function () {
      this.set('notDONE', false);
      Ember.$('.ui.modal').modal('hide');
      Ember.$('.ui.modal').remove();
    },

    done: function(){
      this.set('isFinished', true);
      this.set('isWorking', false);
      this.set('parsingError', false);
    },

    working: function(){
      this.set('isFinished', false);
      this.set('isWorking', true);
      this.set('hasError', false);
       this.set('parsingError', false);
    },

    parsingIssues: function() {
      this.set('isFinished', false);
      this.set('isWorking', false);
      this.set('hasError', false);
      this.set('parsingError', true);
    },
  },


  didRender() {
    Ember.$('.ui.modal')
      .modal({
        closable: false,
      })
      .modal('show');
  }
});
