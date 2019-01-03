require 'rails_helper'

describe ReviewableQueuedPostSerializer do
let(:admin) { Fabricate(:admin) }

  context "new topic" do
    let(:reviewable) { Fabricate(:reviewable_queued_post_topic) }

    it "allows us to edit category / title" do
      json = ReviewableQueuedPostSerializer.new(reviewable, scope: Guardian.new(admin), root: nil).as_json

      payload = json[:payload]
      expect(payload['raw']).to eq('hello world post contents.')
      expect(payload['title']).to eq('queued post title')
      expect(json[:topic_id]).to be_blank
      expect(json[:can_edit]).to eq(true)

      fields = json[:editable_fields]
      expect(fields).to be_present

      category_field = fields.find { |f| f[:id] == 'category_id' }
      expect(category_field).to be_present
      expect(category_field[:type]).to eq(:category)

      title_field = fields.find { |f| f[:id] == 'payload.title' }
      expect(title_field).to be_present
      expect(title_field[:type]).to eq(:text)

      raw_field = fields.find { |f| f[:id] == 'payload.raw' }
      expect(raw_field).to be_present
      expect(raw_field[:type]).to eq(:textarea)
    end
  end

  context "reply to an existing topic" do
    let(:reviewable) { Fabricate(:reviewable_queued_post) }

    it "includes correct user fields" do
      json = ReviewableQueuedPostSerializer.new(reviewable, scope: Guardian.new(admin), root: nil).as_json

      payload = json[:payload]

      expect(payload['raw']).to eq('hello world post contents.')
      expect(payload['title']).to be_blank
      expect(json[:topic_id]).to eq(reviewable.topic_id)
      expect(json[:can_edit]).to eq(true)

      fields = json[:editable_fields]
      expect(fields).to be_present

      expect(fields.any? { |f| f[:id] == 'payload.title' }).to eq(false)
      expect(fields.any? { |f| f[:id] == 'category_id' }).to eq(false)

      raw_field = fields.find { |f| f[:id] == 'payload.raw' }
      expect(raw_field).to be_present
      expect(raw_field[:type]).to eq(:textarea)
    end
  end


end
