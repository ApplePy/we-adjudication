import { moduleForModel, test } from 'ember-qunit';

moduleForModel('codeserializer', 'Unit | Serializer | codeserializer', {
  // Specify the other units that are required for this test.
  needs: ['serializer:codeserializer']
});

// Replace this with your real tests.
test('it serializes records', function(assert) {
  let record = this.subject();

  let serializedRecord = record.serialize();

  assert.ok(serializedRecord);
});
