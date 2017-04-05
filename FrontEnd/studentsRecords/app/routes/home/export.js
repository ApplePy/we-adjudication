import Ember from 'ember';

export default Ember.Route.extend({

	store: Ember.inject.service(),

	beforeModel() {
		this.get('store').query('adjudication', {}).then(adjudications => {
			if (adjudications.get('meta').total === 0) {
				Ember.$('.ui.modal')
  					.modal('setting', 'closable', false)
  					.modal('show')
				;
				this.transitionTo('home');
			}
		});	
  	}

});