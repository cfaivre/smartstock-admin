class ItemListViewModel < BaseViewModel
  include ActiveModel::Serialization
  attr_accessor :items

  def initialize(user_id=nil )
    @user_id = user_id
    self.items = []
  end

end
