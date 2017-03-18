import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('edit-adjudicationcode', 'Integration | Component | edit adjudicationcode', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{edit-adjudicationcode}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#edit-adjudicationcode}}
      template block text
    {{/edit-adjudicationcode}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
