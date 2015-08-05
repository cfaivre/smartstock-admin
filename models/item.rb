class ItemModel

  def initialize(username=nil )
    @username = username
  end

  def details( rfids )
    item_details = StockApiClient.new.item_details( rfids )
    item_details.map{|item|
      { rfid: item[:rfid], location: item[:location],
        serial_number: item[:serial_number],
        purchase_order_number: item[:purchase_order_number],
        date: item[:date],
        storage_location: item[:storage_location]}
    }
  end

end
