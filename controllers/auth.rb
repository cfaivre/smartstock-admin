require 'json'

class StockApp < Sinatra::Application

  get "/login" do
    haml :login, :layout => false
  end

  post "/login" do
    if user = User.authenticate(params)
      session[:user] = user
      #redirect_to_original_request
      redirect 'item/arrival'
    else
      flash[:notice] = 'You could not be signed in. Did you enter the correct username and password?'
      redirect '/login'
    end
  end

  get "/logout" do
    session[:user] = nil
    flash[:notice] = 'You have been signed out.'
    redirect '/login'
  end

end
