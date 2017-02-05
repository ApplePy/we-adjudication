import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('scholarships-awards', 'Integration | Component | scholarships awards', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{scholarships-awards}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#scholarships-awards}}
      template block text
    {{/scholarships-awards}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
