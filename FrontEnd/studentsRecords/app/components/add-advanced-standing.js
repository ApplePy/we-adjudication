import Ember from 'ember';

export default Ember.Component.extend({
    newcourse: null,
    newunit: null,
    newdescription: null,
    newgrade: null,
    newfrom: null,
    newrecipient: null,
    standings: null,
    store: Ember.inject.service(),
    studentsModel: null,
    INDEX: null,
    notDONE: null,

 actions: {
  saveCourse() {
    var advancedStanding = this.get('store').createRecord('advanced-standing', {
      course: this.get('newcourse'),
      description: this.get('newdescription'),
      units: this.get('newunit'),
      grade: this.get('newgrade'),
      from: this.get('newfrom'),
     recipient: this.get('newrecipient')
      });

    var self = this;
    advancedStanding.save().then(function(record){
       self.get('standings').pushObject(record);
    });


      //var index = this.get('studentsModel').indexOf(this.get('newrecipient'));
      //this.set('INDEX', index);
     this.set('notDONE', false);
     Ember.$('.ui.modal').modal('hide');
     Ember.$('.ui.modal').remove();
  },

   close: function() {
     this.set('notDONE', false);
     Ember.$('.ui.modal').modal('hide');
     Ember.$('.ui.modal').remove();
   }
    },


  didRender() {
    Ember.$('.ui.modal')
      .modal({
        closable: false,
      })
      .modal('show');
  }

});