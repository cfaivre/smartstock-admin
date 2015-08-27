class StockTakeListViewModel < BaseViewModel
  include ActiveModel::Serialization
  attr_accessor :stock_takes

  def initialize(user_id=nil )
    @user_id = user_id
    self.stock_takes = []
  end

end
