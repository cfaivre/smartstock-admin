class LocationListModel

  def initialize(user_id=nil )
    @user_id = user_id
  end

  def load_locations
    viewmodel = LocationListViewModel.new
    locations = StockApiClient.new.get_locations
    if !locations.empty?
      locations.sort_by! { |location| location[:name] }
      locations.each{|location|
        location[:name].gsub!(/\w+/, &:capitalize)
      }
    end
    viewmodel.locations = locations
    viewmodel
  end

end
