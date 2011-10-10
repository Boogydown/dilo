class GameQuestion < ActiveRecord::Base
  belongs_to :game
  belongs_to :question
  has_many :multiple_choices
  has_many :responses

  #def as_json(options={})
  #  super( :include =>[:multiple_choices])
  #end

  #Stupid workaround described here:
  #http://stackoverflow.com/questions/4840968/as-json-not-calling-as-json-on-associations
  # define json options as constant, or you could return them from a method
  #GAME_QUESTION_JSON_OPTS = { :include => { :multiple_choices => { :only => [:content]} }  }
  GAME_QUESTION_JSON_OPTS = { :include => :multiple_choices   }
  #
  def as_json(options={})
    super(GAME_QUESTION_JSON_OPTS)
  end


  acts_as_api

  api_accessible :questions_and_choices do |t|
    t.add :multiple_choices
    t.add :id

  end


  api_accessible :in_progress_session do |t|
    t.add :id
    t.add :responses
  end

end
