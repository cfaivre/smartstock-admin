module Authentication
  def authenticate!
    unless session[:user]
      session[:original_request] = request.path_info
      #flash[:notice] = 'You need to be logged in.'
      redirect '/login'
    end
  end
end
