require 'active_record'
# Cnc list
#####################################
get "/cncs" do
  authenticate!
  ActiveRecord::Base.include_root_in_json = false
  viewmodel = CncListModel.new.load_cncs
  @data = viewmodel.to_json
  haml :'cnc/list/index'
end
