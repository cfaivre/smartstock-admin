class WarehouseListViewModel < BaseViewModel
  include ActiveModel::Serialization
  attr_accessor :warehouses

  def initialize( user_id=nil )
    @user_id = user_id
    self.warehouses = []
  end

end
