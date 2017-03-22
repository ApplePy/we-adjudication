import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('adjudication-statistics', 'Integration | Component | adjudication statistics', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{adjudication-statistics}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#adjudication-statistics}}
      template block text
    {{/adjudication-statistics}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
