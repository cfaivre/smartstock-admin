class ChartViewModel < BaseViewModel
  include ActiveModel::Serialization
  attr_accessor :item_type_data
  attr_accessor :locations

  def initialize(user_id=nil )
    @user_id = user_id
    self.item_type_data = []
    self.locations = []
  end

end
