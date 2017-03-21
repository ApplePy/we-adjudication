import Ember from 'ember';

export default Ember.Component.extend({
	VA001IsPermitted: Ember.computed(function(){ //Delete user
	    var authentication = this.get('oudaAuth');
	    if (authentication.getName === "Root") {
	      return true;
	    } else {
	      return (authentication.get('userCList').indexOf("VA001") >= 0);
	    }
	}),
});
