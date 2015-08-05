class SearchModel
  attr_accessor :characteristic, :query_string, :ip_info, :asset_info, :ip_range

  def initialize(query_string)
    @query_string = query_string.to_s
    determine_characteristic
    env = ENV['RACK_ENV']
  end

  def execute
    collins_attribs = []
    redirect_to = ""
    search_redirect = false;
    if @query_string.empty?
      return "/"
    end
    case @characteristic
      when 'asset_tag_colo'
        redirect_to = "/colo/list?asset_tag=" + @query_string
      when 'asset_tag'
        redirect_to = "/server/list?asset_tag=" + @query_string
      when 'ip', 'ip_range'
        redirect_to = "/ip_addresses/list?ip=" + @query_string
      when 'servername', 'regex_servername'
        redirect_to = "/server/list?server_name=" + @query_string
      when 'client_number'
        redirect_to = "/client?client_number=" + @query_string
      when 'mac_address'
        redirect_to = "/mac-address?mac_address=" + @query_string
      else
    end
    return redirect_to
  end

  def determine_characteristic
    if IPAddress::valid_ipv4?(@query_string)
      @characteristic = 'ip'
      ip_object = IPAddress(@query_string)
      @query_string = ip_object.address.to_s
    elsif @query_string =~ /HET\d*/
      @characteristic = 'asset_tag'
    elsif @query_string =~ /COL\d*/
      @characteristic = 'asset_tag_colo'
    elsif @query_string =~ /^(?:\d{1,3}\.){3}\d{1,3}\/(24|25|26|27|28|29|30|31|32)$/
      @characteristic = 'ip_range'
    elsif @query_string =~ /^.{6}\_.*\d{3}$/
      @characteristic = 'servername'
    elsif @query_string =~ /^.{6}\_$/
      @characteristic = 'regex_servername'
    else
      @characteristic = 'client_number'
    end
  end

end
