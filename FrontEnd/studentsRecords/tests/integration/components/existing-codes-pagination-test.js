import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('existing-codes-pagination', 'Integration | Component | existing codes pagination', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{existing-codes-pagination}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#existing-codes-pagination}}
      template block text
    {{/existing-codes-pagination}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
