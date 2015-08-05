  get "/search" do
    authenticate!
    search = SearchModel.new(params['query'])
    @result = search.execute
    redirect @result
  end

  get "/mac-address" do
    authenticate!
    haml :'search/mac_address'
  end
