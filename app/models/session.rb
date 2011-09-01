class Session < ActiveRecord::Base
  has_many :players


  def as_json(options={})
    super( :include =>[:players])
  end

end
