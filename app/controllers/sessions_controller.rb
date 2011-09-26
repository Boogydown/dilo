class SessionsController < ApplicationController
  # GET /sessions
  # GET /sessions.xml
  def index
    @sessions = Session.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @sessions }
      format.json { render :json => @sessions }
    end
  end

  # GET /sessions/1
  # GET /sessions/1.xml
  def show
    @session = Session.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @session }
      format.json  { render :json => @session  }


    end
  end

  # GET /sessions/new
  # GET /sessions/new.xml
  def new
    @session = Session.new
    @session.state = 'waiting'

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @session }
      format.json  { render :json => @session }
    end
  end

  # GET /sessions/1/edit
  def edit
    @session = Session.find(params[:id])
  end

  # POST /sessions
  # POST /sessions.xml
  def create

    #look for an existing session
    @session = Session.where(:state=>"waiting").order("created_at ASC").limit(1).first

    #can't find one? let's create one.
    if(@session.blank?)
      @session = Session.new
      @session.state = 'waiting'
    else
      @session.state = 'active'
      @session.game = Game.new
      questions = Question.find(:all, :order => "created_at ASC", :limit => 7 )
      #@session.save
      #@session.game.questions = Question.find(:all, :order => "created_at ASC", :limit => 7 )
      questions.all? do |question|
          @session.game.questions << question
      end

    end


    logger.debug @session



    json = ActiveSupport::JSON.decode(request.raw_post)

    #handling json
    if(!json.blank?)
      player = Player.find(json['playerId'])
      #add this player to the session
      @session.players.push(player)
      logger.debug player
    end



    respond_to do |format|
      if @session.save
        format.html { redirect_to(@session, :notice => 'Session was successfully created.') }
        format.xml  { render :xml => @session, :status => :created, :location => @session }
        format.json  { render :json => @session, :status => :created, :location => @session }

      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @session.errors, :status => :unprocessable_entity }
        format.json  { render :json => @session.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /sessions/1
  # PUT /sessions/1.xml
  def update
    @session = Session.find(params[:id])

    json = ActiveSupport::JSON.decode(request.raw_post)
    @session.state = json['state']

    respond_to do |format|
      if @session.save
        format.html { redirect_to(@session, :notice => 'Session was successfully updated.') }
        format.xml  { head :ok }
        format.json  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @session.errors, :status => :unprocessable_entity }
        format.json  { render :json => @session.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /sessions/1
  # DELETE /sessions/1.xml
  def destroy
    @session = Session.find(params[:id])
    @session.destroy

    respond_to do |format|
      format.html { redirect_to(sessions_url) }
      format.xml  { head :ok }
      format.json  { head :ok }

    end
  end
end
