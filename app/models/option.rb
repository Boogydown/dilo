class Option < ActiveRecord::Base
  belongs_to :game_question


   def as_json(options={})
    super( :include =>[:content])
  end

end
