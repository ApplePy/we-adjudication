import Ember from 'ember';

export default Ember.Component.extend({
    store: Ember.inject.service(),
    termArray: [],

   init() {

       //create new adjudication objects for testing later


       this.set('termArray', []);
       this._super(...arguments);

       
       //load all terms for drop down
       this.get('store').query('term-code', {limit: 10}).then((records) => {
           let totalRecords = records.get('meta').total;
           let offsetUsed = records.get('meta').offset;
           let limitUsed = records.get('meta').limit;
           
           this.get('store').query('term-code', {limit: totalRecords}).then((terms) => {
               for(var i=0; i < terms.get('length'); i++){
                   this.get('termArray').pushObject(terms.objectAt(i));
                }
            });
        });
    },

    action:{
        selectTerm() {

        }
    }

});
