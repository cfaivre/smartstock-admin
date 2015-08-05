require 'active_record'
get "/status" do
  haml :'status/index'
end
