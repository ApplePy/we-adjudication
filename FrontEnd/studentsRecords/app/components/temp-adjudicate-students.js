import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  codeModel: [],
  booleanExp: null,
  student: null,
  terms: [],
  programRecords: [],
  courses: [],
  selectedCourse: null,
  ruleExp: "",
  parseResult: "",
  ruleToRule: "",

  init(){
    this._super(...arguments);
    this.set('terms', []);
    //A dummy student for testing
    this.get('store').query('student', {limit: 1}).then((student) => {
      //Load all of the terms for this student
      var baseLimit = 10;
      this.get('store').query('term', {
        limit: baseLimit,
        filter: {
          student: student.get('id')
        }
      }).then((terms) => {

        for(var i = 0; i < terms.get('length'); i++) {
          var term = terms.objectAt(i);
          this.get('terms').pushObject(term);
        }

        if( typeof terms.get('meta') === "object" &&
          typeof terms.get('meta').total === "number" &&
          baseLimit < terms.get('meta').total)
        {
          this.get('store').query('term', {
            limit: terms.get('meta').total - baseLimit,
            offset: baseLimit,
            filter: {student: student.get('id')}
          }).then((moreTerms) => {
            for(var i = 0; i < moreTerms.get('length'); i++) {
              var term = moreTerms.objectAt(i);
              this.get('terms').pushObject(term);
            }
          });
        }
      });
    });

    this.get('store').query('assessment-code', {limit: 10}).then((records) => {
      let totalRecords = records.get('meta').total;
      let offsetUsed = records.get('meta').offset;
      let limitUsed = records.get('meta').limit;
      this.get('store').query('assessment-code', {limit: totalRecords}).then((rules) => {
        for(var i=0; i < rules.get('length'); i++){
          this.get('codeModel').pushObject(rules.objectAt(i));
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

  loop: function() {
    for(var i = 0; i < this.get('terms').get('length'); i++){
      this.set('courses', this.get('terms').objectAt(i).get('courses'));
      this.set('programRecords', this.get('terms').objectAt(i).get('programRecords'));
    }
  },

  parseRules(ruleExp, ruleObj, rule){
    ruleExp += '(';
    //Get each boolean expression within the rule
    for(var k=0; k < rule.length; k++){
      //Parse through to get the parameter, operator, value, and link for the
      var m = rule.indexOf('(', k);
      var z = rule.indexOf(']', m);
      if(z == -1){
        k= rule.indexOf(')', m);
      } else {
        while(z != -1){
          k = rule.indexOf(')', z);
          z = rule.indexOf(']', k + 1);
        }
      }
      var exp = rule.substr(m,k - m);
      var endParam = exp.indexOf(' ') - 1
      var param = exp.substr(1, endParam);
      var endOpr = exp.indexOf(" ", endParam + 2);
      var opr = exp.substr(endParam + 2, endOpr - endParam - 2);
      if(param === "Rule"){
        var value = exp.substr(endOpr + 2, exp.length - endOpr - 3);
      } else {
        var value = exp.substr(endOpr + 1);
      }
      var link = rule.substr(k + 2, rule.indexOf(' ', k + 2) - k - 2);
      if(link == "AND"){
        link = '&&';
      } else if (link == "OR"){
        link = '||';
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
          console.log(this.get('courses').objectAt(n).get('unit'));
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
        this.parseRules("", null, value);
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
    }
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
      this.loop();
      //for each code...
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
        console.log(this.get('ruleExp'));
        console.log(eval(this.get('ruleExp')));
      }
    }
  }
});
