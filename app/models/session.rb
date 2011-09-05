class Session < ActiveRecord::Base
  has_many :players
  has_many :questions

  #def as_json(options={})
  #  super( :include =>[:players])
  #end

end
