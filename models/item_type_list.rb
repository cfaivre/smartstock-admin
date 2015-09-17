class ItemTypeListModel

  def initialize(user_id=nil )
    @user_id = user_id
  end

  def load_item_types
    viewmodel = ItemTypeListViewModel.new
    item_types = StockApiClient.new.get_item_types
    if !item_types.empty?
      item_types.sort_by! { |item_type| item_type[:sap_number] }
      item_types.each{|item_type|
        item_type[:material_type].gsub!(/\w+/, &:capitalize)
      }
    end
    viewmodel.item_types = item_types
    viewmodel
  end

end
