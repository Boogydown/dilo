class Game < ActiveRecord::Base
  has_many :game_questions
  has_many :questions, :through => :game_questions
  belongs_to :session

  def as_json(options={})
    #options = {} if options.nil?

    super(:include  =>
              [
                  :questions,
                  #:game_questions =>  GameQuestion::GAME_QUESTION_JSON_OPTS

              ],
          :except=>[:name, :created_at,:updated_at]
    )
  end
  acts_as_api

  api_accessible :questions_and_choices do |t|
    t.add :questions
    t.add :game_questions
  end


  #def as_json(options={})
  #  super( :include =>[:questions, :game_questions], :except=>[:name, :created_at,:updated_at])
  #end

end