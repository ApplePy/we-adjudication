import Ember from 'ember';

export default Ember.Route.extend({

	store: Ember.inject.service(),

	beforeModel() {
		this.get('store').findAll('adjudication').then(adjudications => {
			console.log("here");
			console.log(adjudications);
			if (adjudications.get('length') === 0) {
				Ember.$('.ui.modal')
  					.modal('setting', 'closable', false)
  					.modal('show')
				;
				this.transitionTo('home');
			}
		});	
  	}

});