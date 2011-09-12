class RenamePlayerSessions < ActiveRecord::Migration
def self.up
        rename_table :'players_sessions', :player_sessions
    end
    def self.down
        rename_table :player_sessions, :'players_sessions'
    end
 end
