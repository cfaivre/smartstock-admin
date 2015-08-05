class ItemListModel

  def initialize(user_id=nil )
    @user_id = user_id
  end

  def load_items( filter )
    viewmodel = ItemListViewModel.new
    items = StockApiClient.new.get_items( filter )
    items.sort_by! { |item| item["name"] } unless items.empty?
    viewmodel.items = items
    viewmodel
  end

end
