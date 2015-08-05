class SearchResultViewModel < BaseViewModel
  attr_accessor :client_prefixes
  attr_accessor :colo_locations
  attr_accessor :assets
  attr_accessor :network_details
  attr_accessor :customer_details
  attr_accessor :hosts_details
  attr_accessor :network_details
  attr_accessor :legacy_master_server_tool_info
  attr_accessor :legacy_ip_ranges
  attr_accessor :legacy_ip_records
  attr_accessor :search_term

  def initialize()
    self.client_prefixes = []
    self.colo_locations = []
    self.hosts_details = []
    self.network_details = {}
    self.customer_details = {}
    self.assets = []
    self.legacy_master_server_tool_info = []
    self.legacy_ip_ranges = []
    self.legacy_ip_records = []
    self.search_term = ""
  end

end
