import RestModel from "discourse/models/rest";
import computed from "ember-addons/ember-computed-decorators";

export default RestModel.extend({
  @computed("type")
  humanType(type) {
    return I18n.t(`review.types.${type.underscore()}.title`, {
      defaultValue: ""
    });
  }
});
