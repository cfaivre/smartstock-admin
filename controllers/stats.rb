require 'active_record'
# Stats
#####################################
get "/stats" do
  haml :'stats/index'
end

get "/chart" do
  authenticate!
  viewmodel = ChartModel.new.load( params['sap_number'] )
  @data = viewmodel.to_json
  haml :'chart/index'
end
