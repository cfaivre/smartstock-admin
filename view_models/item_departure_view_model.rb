class ItemDepartureViewModel < BaseViewModel
  include ActiveModel::Serialization
  attr_accessor :items
  attr_accessor :rfids
  attr_accessor :current_location
  attr_accessor :new_storage_location
  attr_accessor :user

  def initialize
    self.items = []
    self.rfids = []
    self.new_storage_location = ''
    self.current_location = ''
    self.user = ''
  end

end
