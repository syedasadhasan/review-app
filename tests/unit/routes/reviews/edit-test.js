import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | reviews\edit', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:reviews\edit');
    assert.ok(route);
  });
});
