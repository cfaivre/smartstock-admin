class WarehouseListModel

  def initialize(user_id=nil )
    @user_id = user_id
  end

  def load_warehouses
    viewmodel = WarehouseListViewModel.new
    warehouses = StockApiClient.new.get_warehouses
    if !warehouses.empty?
      warehouses.sort_by! { |warehouse| warehouse[:name] }
      warehouses.each{|warehouse|
        warehouse[:name].gsub!(/\w+/, &:capitalize)
      }
    end
    viewmodel.warehouses = warehouses
    viewmodel
  end

end
