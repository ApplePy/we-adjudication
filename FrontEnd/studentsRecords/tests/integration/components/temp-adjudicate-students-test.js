import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('temp-adjudicate-students', 'Integration | Component | temp adjudicate students', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{temp-adjudicate-students}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#temp-adjudicate-students}}
      template block text
    {{/temp-adjudicate-students}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
