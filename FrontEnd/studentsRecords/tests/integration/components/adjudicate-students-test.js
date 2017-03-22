import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('adjudicate-students', 'Integration | Component | adjudicate students', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{adjudicate-students}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#adjudicate-students}}
      template block text
    {{/adjudicate-students}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
