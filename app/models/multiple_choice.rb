class MultipleChoice < ActiveRecord::Base
   belongs_to :game_question


  def as_json(options={})
    super( :include =>[:content] )
  end

  acts_as_api

  api_accessible :questions_and_choices do |t|
    t.add :id
    t.add :content
  end

  api_accessible :complete_session do |t|
    t.add :id
    t.add :content

  end


end