require 'active_record'
# Item Type list
#####################################
get "/item_types" do
  authenticate!
  ActiveRecord::Base.include_root_in_json = false
  viewmodel = ItemTypeListModel.new.load_item_types( params )
  @data = viewmodel.to_json
  haml :'item_type/list/index'
end

get "/item_type" do
  StockApiClient.new.get_item_types( sap_number: params['sap_number'] ).to_json
end
