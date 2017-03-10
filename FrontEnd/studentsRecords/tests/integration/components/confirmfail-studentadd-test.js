import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('confirmfail-studentadd', 'Integration | Component | confirmfail studentadd', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{confirmfail-studentadd}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#confirmfail-studentadd}}
      template block text
    {{/confirmfail-studentadd}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
