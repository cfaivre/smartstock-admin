class ChartModel

  def initialize(user_id=nil )
    @user_id = user_id
  end

  def load( sap_number )
    viewmodel = ChartViewModel.new
    viewmodel.item_type_data = item_type_data( sap_number )
    viewmodel.locations = item_type_table_data( sap_number )
    viewmodel
  end

  def item_type_table_data( sap_number )
    #TODO: Refactor this method
    api = StockApiClient.new

    items = api.get_items({sap_number: sap_number})

    locations = api.get_locations
    table_data = []
    counter = 0
    result = []
    locations.each do |location|
      count = items.select{|item| item[:location] == location[:name]}.count
      location[:name].gsub!(/\w+/, &:capitalize)
      result << { location: location[:name], color: location[:color], highlight: location[:highlight], counter: (count + 1)}
    end
    
    result.sort_by{ |k| k[:counter]}.reverse
  end

  def items_per_location(locations, items)
    result = {}
    locations.each do |location|
      count = items.select{|item| item[:location] == location[:name]}.count
      location[:name].gsub!(/\w+/, &:capitalize)
      result.merge!( location[:name] => { color: location[:color], highlight: location[:highlight], counter: (count + 1)} )
    end
    result
  end

  def item_type_data( sap_number )
    #TODO: Refactor this method
    api = StockApiClient.new

    items = api.get_items({sap_number: sap_number})

    locations = api.get_locations

    chart_data = []
    counter = 0
    items_per_location(locations, items).each do |k, v|
      if v[:counter] > 0
        chart_data <<
          { value: v[:counter],
            label: k,
            color: v[:color],
            highlight: v[:highlight] }
        counter += 1
      end
    end
    chart_data
  end

  def colors
    [ {
        color:"#00CC00",
        highlight: "#99EB99",
      },
      {
        color: "#003399",
        highlight: "#8099CC",
      },
      {
        color: "#FF0000",
        highlight: "#FF9999",
      } ]
  end


end
