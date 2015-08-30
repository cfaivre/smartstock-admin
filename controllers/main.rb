require 'json'
require_relative '../lib/authentication'

class StockApp < Sinatra::Application
  get "/reqenv" do
    content_type :text
    return JSON.pretty_generate(env)
  end

  get "/" do
    authenticate!
    redirect 'stock_takes'
  end

end
