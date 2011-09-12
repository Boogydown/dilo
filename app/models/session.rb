class Session < ActiveRecord::Base
  has_many :players, :through => :player_sessions
  has_one :game
  #def as_json(options={})
  #  super( :include =>[:players])
  #end
end
