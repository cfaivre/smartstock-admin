class HomeViewModel < BaseViewModel
  include ActiveModel::Serialization
  attr_accessor :servers
  attr_accessor :pools
  attr_accessor :provision_customer_number
  attr_accessor :allocated_percent
  attr_accessor :unallocated_percent
  attr_accessor :deccomissioned_percent
  attr_accessor :incomplete_percent
  def initialize()
    self.servers = []
    self.pools = []
    self.allocated_percent  =0
    self.unallocated_percent = 0
    self.deccomissioned_percent = 0
    self.incomplete_percent = 0
  end

  def stub
    self.servers.push({:asset_tag => "HET00001", :asset_type => "Truserv", :asset_status => "unallocated"})
    self.servers.push({:asset_tag => "HET00002", :asset_type => "Truserv", :asset_status => "allocated"})
    self.servers.push({:asset_tag => "HET00003", :asset_type => "Truserv", :asset_status => "unallocated"})
    self.servers.push({:asset_tag => "HET00004", :asset_type => "Truserv", :asset_status => "allocated"})
    self.servers.push({:asset_tag => "HET00005", :asset_type => "Truserv Plus", :asset_status => "allocated"})
    self.servers.push({:asset_tag => "HET00006", :asset_type => "Truserv", :asset_status => "allocated"})
    self.servers.push({:asset_tag => "HET00007", :asset_type => "Truserv", :asset_status => "unallocated"})
    self.servers.push({:asset_tag => "HET00008", :asset_type => "Truserv Plus", :asset_status => "allocated"})
    self.servers.push({:asset_tag => "HET00009", :asset_type => "Truserv", :asset_status => "unallocated"})
    self.servers.push({:asset_tag => "HET000010", :asset_type => "Truserv", :asset_status => "incomplete"})
    self.servers.push({:asset_tag => "HET000011", :asset_type => "Truserv Plus", :asset_status => "unallocated"})
    self.servers.push({:asset_tag => "HET000012", :asset_type => "Truserv", :asset_status => "unallocated"})
    self.servers.push({:asset_tag => "HET000013", :asset_type => "Truserv", :asset_status => "incomplete"})
    self.servers.push({:asset_tag => "HET000014", :asset_type => "Truserv Plus", :asset_status => "unallocated"})
    self.servers.push({:asset_tag => "HET000015", :asset_type => "Truserv", :asset_status => "unallocated"})
    self.servers.push({:asset_tag => "HET000016", :asset_type => "Truserv Commerce", :asset_status => "incomplete"})
    self.servers.push({:asset_tag => "HET000017", :asset_type => "Truserv Commerce", :asset_status => "unallocated"})
    self.servers.push({:asset_tag => "HET000018", :asset_type => "Truserv", :asset_status => "unallocated"})
    self.servers.push({:asset_tag => "HET000019", :asset_type => "Truserv", :asset_status => "deccomissioned"})
    self.servers.push({:asset_tag => "HET000020", :asset_type => "Truserv", :asset_status => "unallocated"})
  end
end
