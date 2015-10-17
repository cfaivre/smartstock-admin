class LocationListViewModel < BaseViewModel
  include ActiveModel::Serialization
  attr_accessor :locations

  def initialize(user_id=nil )
    @user_id = user_id
    self.locations = []
  end

end
