class PlayersController < ApplicationController
  # GET /players
  # GET /players.xml
  def index
    @players = Player.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @players }
      format.json { render :json => @players }
    end
  end

  # GET /players/1
  # GET /players/1.xml
  def show
    @player = Player.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @player }
      format.json { render :json => @player }
    end
  end

  # GET /players/new
  # GET /players/new.xml
  def new
    @player = Player.new
    session[:current_user_id] = @player.id

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @player }
      format.json { render :json => @player }
    end
  end

  # GET /players/1/edit
  def edit
    @player = Player.find(params[:id])
  end

  # POST /players
  # POST /players.xml
  def create

    playerJson = ActiveSupport::JSON.decode(request.raw_post)
    logger.debug request.raw_post
    logger.debug playerJson


    #we must be handling json
    if(playerJson.blank?)
      @player = Player.new(playerJson["name"])
    else#handle html page
      @player = Player.new(params[:player])
    end

    respond_to do |format|
      if @player.save
        session[:current_user_id] = @player.id
        format.html { redirect_to root_url }
        format.xml  { render :xml => @player, :status => :created, :location => @player }
        format.json  { render :json => @player, :status => :created, :location => @player }

      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @player.errors, :status => :unprocessable_entity }
        format.json  { render :json => @player.errors, :status => :unprocessable_entity }

      end
    end
  end

  # PUT /players/1
  # PUT /players/1.xml
  def update
    @player = Player.find(params[:id])

    respond_to do |format|
      if @player.update_attributes(params[:player])
        format.html { redirect_to(@player, :notice => 'Player was successfully updated.') }
        format.xml  { head :ok }
        format.json  { head :ok }


      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @player.errors, :status => :unprocessable_entity }
        format.json  { render :xml => @player.errors, :status => :unprocessable_entity }

      end
    end
  end

  # DELETE /players/1
  # DELETE /players/1.xml
  def destroy
    @player = Player.find(params[:id])
    @player.destroy

    respond_to do |format|
      format.html { redirect_to(players_url) }
      format.xml  { head :ok }
      format.json  { head :ok }

    end
  end
end
