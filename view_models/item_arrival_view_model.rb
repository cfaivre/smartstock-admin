class ItemArrivalViewModel < BaseViewModel
  include ActiveModel::Serialization
  attr_accessor :items
  attr_accessor :rfids
  attr_accessor :locations
  attr_accessor :new_location
  attr_accessor :new_storage_location
  attr_accessor :user

  def initialize
    self.items = []
    self.rfids = []
    self.locations = []
    self.new_location = ''
    self.new_storage_location = ''
    self.user = ''
  end

end
