class CncListViewModel < BaseViewModel
  include ActiveModel::Serialization
  attr_accessor :cncs

  def initialize(user_id=nil )
    @user_id = user_id
    self.cncs = []
  end

end
