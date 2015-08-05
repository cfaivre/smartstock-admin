class ItemTypeListViewModel < BaseViewModel
  include ActiveModel::Serialization
  attr_accessor :item_types

  def initialize(user_id=nil )
    @user_id = user_id
    self.item_types = []
  end

end
