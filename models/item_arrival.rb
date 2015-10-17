class ItemArrivalModel

  READER_HOSTNAME = 'speedwayr-10-e3-04.local'
  READER_PORT = 14150

  def initialize( username=nil )
    @username = username
  end

  def load
    viewmodel = ItemArrivalViewModel.new
    viewmodel.items = []
    viewmodel.user = @username
    viewmodel.new_location = @username
    #viewmodel.locations = []
    viewmodel
  end

  def read_arrived_items( already_read_rfids )
    items = read_items( already_read_rfids )#.select{ |item| ['in-transit', 'supplier'].include?(item[:location]) }

    viewmodel = ItemArrivalViewModel.new
    viewmodel.items = items
    viewmodel.rfids = items.map{|item| item[:rfid]}
    viewmodel
  end

  def read_items( already_read_rfids=[] )
    stock_api = StockApiClient.new
    tag_numbers = (read_tags + already_read_rfids).uniq
    item_details = stock_api.item_details( tag_numbers )
    items = []
    tag_numbers.each{|tag_number|
      detail = item_details.select{|detail| detail[:rfid] == tag_number }
      next if detail.empty? # TODO: Add it to a list and display it in the frontend
      items << { rfid: tag_number, location: detail.first[:location].gsub!(/\w+/, &:capitalize),
                 serial_number: detail.first[:serial_number],
                 purchase_order_number: detail.first[:purchase_order_number],
                 date: detail.first[:date],
                 storage_location: detail.first[:storage_location] }
    }
    items
  end

  def read_tags
    return [ '2015052900000000000000000000ABE2', '2015052900000000000000000000ABD1', '20150529000000008FF92F2500000000', '2015052900000000000000000000ABCF',
            '2015052900000000000000000000ABD0', '2015052900000000000000000000ABD4', '2015052900000000000000000000ABD2' ]
    result = []
    # Create a TCP socket connection to the reader
    s = TCPSocket.open(READER_HOSTNAME, READER_PORT)

    started_time = Time.now
    while (Time.now < started_time + 1.seconds)
      # Read one line at a time
      line = s.gets.strip
      if !result.include?( line )
        result << line
        print line
      end
    end
    s.close
    result
  end

  def update_locations( items )
    stock_api = StockApiClient.new
    stock_api.items_update_locations( items )
  end

  def reload
  end

  def process
#    viewmodel = ItemListViewModel.new
#    items = StockApiClient.new.get_items
#    items.sort_by! { |item| item["name"] } unless items.empty?
#    viewmodel.items = items
#    viewmodel
  end

end
