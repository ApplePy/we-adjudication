import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('add-advanced-standing', 'Integration | Component | add advanced standing', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{add-advanced-standing}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#add-advanced-standing}}
      template block text
    {{/add-advanced-standing}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
