require 'active_record'
# Warehouse list
#####################################
get "/warehouses" do
  authenticate!
  ActiveRecord::Base.include_root_in_json = false
  viewmodel = WarehouseListModel.new.load_warehouses
  @data = viewmodel.to_json
  haml :'warehouse/list/index'
end
