require_relative '../spec_helper'

describe "server" do

  before :all do
    VCR.use_cassette('imperative/server/provision') do
      response = JSON.parse( Helpers::Setup.provision_server )
      @client_number = response['client_number']
      @location = response['location']
      @parsed_location = Helpers::Location.hash_to_string( @location )
      @assignment_prefix = response['assignment_prefix']
      @server_prefix = response['server_prefix']
    end
  end

  it "returns all server positions where status != available for a given rack" do
    VCR.use_cassette('imperative/server/used_positions') do
      get '/rack-management/positions/server/5/1', (), json_header
      new_location = @location.map{|k,v| v.to_s}.join('-')
      expect( JSON.parse(last_response.body) ).to eq [{"position"=>new_location, "status"=>"in-use"}]
    end
  end

  it "returns the details for a specified colo rack" do
    VCR.use_cassette('imperative/server/rack_detail') do
      get '/rack-management/detail/server/5/1/1/1/1', (), json_header
      expect( last_response.body ).to include "<span>#{@parsed_location}</span>"
      expect( last_response.body ).to include "<span class='asset_tag'>HET0002</span>" # check asset tag
      expect( last_response.body ).to match (/<span class='switch'>switch\d{0,2}(\.\d{1,2})?-row\d{0,2}(\.\d{1,2})?.jnb\d{0,2}(\.\d{1,2})?.host-h.net<\/span>/)#  # check switch
      expect( last_response.body ).to match (/<span class='switch_port'>\d{0,2}(\.\d{1,2})?<\/span>/) # check swith port
    end
  end

end
