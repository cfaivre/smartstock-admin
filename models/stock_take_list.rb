class StockTakeListModel

  def initialize(user_id=nil )
    @user_id = user_id
  end

  def load_stock_takes
    viewmodel = StockTakeListViewModel.new
    stock_takes = StockApiClient.new.get_stock_takes
    stock_takes.sort_by! { |stock_take| stock_take["created_at"] } unless stock_takes.empty?
    viewmodel.stock_takes = stock_takes
    viewmodel
  end

end
