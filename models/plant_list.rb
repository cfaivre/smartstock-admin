class PlantListModel

  def initialize(user_id=nil )
    @user_id = user_id
  end

  def load_plants
    viewmodel = PlantListViewModel.new
    plants = StockApiClient.new.get_plants
    plants.sort_by! { |plant| plant["name"] } unless plants.empty?
    plants.each{|plant|
      plant[:name].gsub!(/\w+/, &:capitalize)
    }
    viewmodel.plants = plants
    viewmodel
  end

end
