class PlayerSession < ActiveRecord::Base
   belongs_to :player
   belongs_to :session
end
