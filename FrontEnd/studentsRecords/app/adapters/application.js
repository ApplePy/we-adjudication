import DS from 'ember-data';
import ENV from 'students-records/config/environment';

export default DS.RESTAdapter.extend({
  host: ENV.APP.host,
  namespace: 'api'
});
