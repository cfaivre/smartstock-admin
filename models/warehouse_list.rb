class WarehouseListModel

  def initialize(user_id=nil )
    @user_id = user_id
  end

  def load_warehouses
    viewmodel = WarehouseListViewModel.new
    warehouses = StockApiClient.new.get_warehouses
    warehouses.sort_by! { |warehouse| warehouse["name"] } unless warehouses.empty?
    viewmodel.warehouses = warehouses
    viewmodel
  end

end
