class StockTakeListModel

  def initialize(user_id=nil )
    @user_id = user_id
  end

  def load_stock_takes
    viewmodel = StockTakeListViewModel.new
    stock_takes = StockApiClient.new.get_stock_takes
    stock_takes.sort_by! { |stock_take| stock_take[:created_at] } unless stock_takes.empty?
    stock_takes.each{|stock_take|
      stock_take[:created_at] = Time.parse(stock_take[:created_at]).strftime('%Y/%m/%d %H:%M')
      # Sort stats by biggest count to smallest
      new_stats = stock_take[:stats].sort_by(&:last).reverse.to_h
      stock_take[:stats] = new_stats
    }
    viewmodel.stock_takes = stock_takes
    viewmodel
  end

end
