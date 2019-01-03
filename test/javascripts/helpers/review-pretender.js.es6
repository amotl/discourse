export default function(helpers) {
  const { response } = helpers;

  this.get("/review.json", () => {
    return response(200, {
      reviewables: [
        {
          id: 1234,
          type: "ReviewableUser",
          status: 0,
          created_at: "2019-01-14T19:49:53.571Z",
          username: "newbie",
          email: "newbie@example.com",
          reviewable_action_ids: ["approve", "reject"]
        },
        {
          id: 4321,
          type: "ReviewableQueuedPost",
          status: 0,
          created_at: "2019-01-14T19:49:53.571Z",
          can_edit: true,
          raw: "existing body",
          editable_fields: [
            { id: "category_id", type: "category" },
            { id: "title", type: "text" },
            { id: "raw", type: "textarea" }
          ],
          reviewable_action_ids: ["approve", "reject"]
        }
      ],
      reviewable_actions: [
        { id: "approve", title: "Approve", icon: "far-thumbs-up" },
        { id: "reject", title: "Reject", icon: "far-thumbs-down" }
      ],
      __rest_serializer: "1"
    });
  });

  this.put("/review/:id/perform/:actionId", () => {
    return response(200, {
      reviewable_perform_result: {
        success: true
      }
    });
  });
}
