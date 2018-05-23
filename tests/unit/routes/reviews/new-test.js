import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | reviews\new', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:reviews\new');
    assert.ok(route);
  });
});
