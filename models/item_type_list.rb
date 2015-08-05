class ItemTypeListModel

  def initialize(user_id=nil )
    @user_id = user_id
  end

  def load_item_types
    viewmodel = ItemTypeListViewModel.new
    item_types = StockApiClient.new.get_item_types
    item_types.sort_by! { |item_type| item_type["name"] } unless item_types.empty?
    viewmodel.item_types = item_types
    viewmodel
  end

end
