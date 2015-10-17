require 'active_record'
# LOcation list
#####################################
get "/locations" do
  authenticate!
  ActiveRecord::Base.include_root_in_json = false
  viewmodel = LocationListModel.new.load_locations
  @data = viewmodel.to_json
  haml :'location/list/index'
end
