import { moduleForModel, test } from 'ember-qunit';

moduleForModel('hs-grade-schema', 'Unit | Model | hs grade schema', {
  // Specify the other units that are required for this test.
  needs: []
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});
