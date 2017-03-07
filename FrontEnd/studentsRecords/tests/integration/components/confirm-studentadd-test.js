import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('confirm-studentadd', 'Integration | Component | confirm studentadd', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{confirm-studentadd}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#confirm-studentadd}}
      template block text
    {{/confirm-studentadd}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
