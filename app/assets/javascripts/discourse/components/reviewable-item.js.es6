import { ajax } from "discourse/lib/ajax";
import { popupAjaxError } from "discourse/lib/ajax-error";
import computed from "ember-addons/ember-computed-decorators";

let _components = {};

export default Ember.Component.extend({
  tagName: "",
  updating: null,
  editing: false,
  _updates: null,

  @computed("reviewable.type")
  customClass(type) {
    return type.dasherize();
  },

  // Find a component to render, if one exists. For example:
  // `ReviewableUser` will return `reviewable-user`
  @computed("reviewable.type")
  reviewableComponent(type) {
    if (_components[type] !== undefined) {
      return _components[type];
    }

    let dasherized = Ember.String.dasherize(type);
    let template = Ember.TEMPLATES[`components/${dasherized}`];
    if (template) {
      _components[type] = dasherized;
      return dasherized;
    }
    _components[type] = null;
  },

  actions: {
    edit() {
      this.set("editing", true);
      this._updates = { payload: {} };
    },

    cancelEdit() {
      this.set("editing", false);
    },

    saveEdit() {
      this.set("updating", true);

      let updates = this._updates;

      // Remove empty objects
      Object.keys(updates).forEach(name => {
        let attr = updates[name];
        if (typeof attr === "object" && Object.keys(attr).length === 0) {
          delete updates[name];
        }
      });

      this.get("reviewable")
        .update(updates)
        .then(() => {
          this.set("editing", false);
        })
        .catch(popupAjaxError)
        .finally(() => this.set("updating", false));
    },

    valueChanged(fieldId, value) {
      if (value && fieldId === "category_id") {
        value = value.id;
      }
      Ember.set(this._updates, fieldId, value);
    },

    perform(actionId) {
      let reviewable = this.get("reviewable");
      this.set("updating", true);
      ajax(`/review/${reviewable.id}/perform/${actionId}`, { method: "PUT" })
        .then(result => {
          if (result.reviewable_perform_result.success) {
            this.attrs.remove(reviewable);
          }
        })
        .catch(popupAjaxError)
        .finally(() => {
          this.set("updating", false);
        });
    }
  }
});
