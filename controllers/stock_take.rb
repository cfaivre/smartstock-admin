require 'active_record'
# Stock Take list
#####################################
get '/stock_takes' do
  authenticate!
  ActiveRecord::Base.include_root_in_json = false
  viewmodel = StockTakeListModel.new.load_stock_takes
  @data = viewmodel.to_json
  haml :'stock_take/list/index'
end
