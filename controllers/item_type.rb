require 'active_record'
# Item Type list
#####################################
get "/item_types" do
  authenticate!
  ActiveRecord::Base.include_root_in_json = false
  viewmodel = ItemTypeListModel.new.load_item_types
  @data = viewmodel.to_json
  haml :'item_type/list/index'
end
