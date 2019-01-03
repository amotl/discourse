import { acceptance } from "helpers/qunit-helpers";

acceptance("Review", {
  loggedIn: true
});

const user = ".reviewable-item[data-reviewable-id=1234]";

QUnit.test("It returns a list of reviewable items", async assert => {
  await visit("/review");

  assert.ok(find(".reviewable-item").length, "has a list of items");
  assert.ok(find(user).length);
  assert.ok(
    find(`${user}.reviewable-user`).length,
    "applies a class for the type"
  );
  assert.ok(
    find(`${user} .reviewable-action.approve`).length,
    "creates a button for approve"
  );
  assert.ok(
    find(`${user} .reviewable-action.reject`).length,
    "creates a button for reject"
  );
});

QUnit.test("Clicking the buttons triggers actions", async assert => {
  await visit("/review");
  await click(`${user} .reviewable-action.approve`);
  assert.equal(find(user).length, 0, "it removes the reviewable on success");
});

QUnit.test("Editing a reviewable", async assert => {
  const topic = ".reviewable-item[data-reviewable-id=4321]";
  await visit("/review");
  assert.ok(find(`${topic} .reviewable-action.approve`).length);

  assert.equal(
    find(`${topic} .post-body`)
      .text()
      .trim(),
    "existing body"
  );

  await click(`${topic} .reviewable-action.edit`);

  assert.equal(
    find(`${topic} .reviewable-action.approve`).length,
    0,
    "when editing actions are disabled"
  );

  await fillIn(".editable-field.raw textarea", "new raw contents");
  await click(`${topic} .reviewable-action.cancel-edit`);
  assert.equal(
    find(`${topic} .post-body`)
      .text()
      .trim(),
    "existing body",
    "cancelling does not update the value"
  );

  await click(`${topic} .reviewable-action.edit`);
  await fillIn(".editable-field.raw textarea", "new raw contents");
  await click(`${topic} .reviewable-action.save-edit`);
  assert.equal(
    find(`${topic} .post-body`)
      .text()
      .trim(),
    "new raw contents",
    "saving updates the value"
  );
});
