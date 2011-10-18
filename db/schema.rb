# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20111017020449) do

  create_table "game_questions", :force => true do |t|
    t.integer  "game_id"
    t.integer  "question_id"
    t.integer  "order"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "distractors"
    t.string   "state"
    t.integer  "winner"
  end

  create_table "games", :force => true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "session_id"
  end

  create_table "multiple_choices", :force => true do |t|
    t.integer  "game_question_id"
    t.text     "content"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "correct"
  end

  create_table "options", :force => true do |t|
    t.text     "content"
    t.boolean  "correct"
    t.integer  "order"
    t.integer  "question_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "game_question_id"
  end

  create_table "player_sessions", :id => false, :force => true do |t|
    t.integer "player_id"
    t.integer "session_id"
  end

  create_table "players", :force => true do |t|
    t.string   "name"
    t.string   "level"
    t.string   "ranking"
    t.integer  "sessions_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "player_session_id"
  end

  create_table "questions", :force => true do |t|
    t.text     "prompt"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "answer"
  end

  create_table "responses", :force => true do |t|
    t.string   "content"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "player_id"
    t.integer  "game_question_id"
    t.integer  "response_index"
  end

  create_table "sessions", :force => true do |t|
    t.string   "state"
    t.integer  "current_question"
    t.string   "final_response"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "game_id"
    t.integer  "player_sessions_id"
  end

end
