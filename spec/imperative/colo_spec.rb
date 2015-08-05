require_relative '../spec_helper'

describe "colo" do

  before :all do
    VCR.use_cassette('imperative/colo/provision') do
      response = JSON.parse( Helpers::Setup.provision_colo )
      @client_number = response['client_number']
      @location = response['location']
      @parsed_location = Helpers::Location.hash_to_string( @location )
      @prefix = response['prefix']
    end
  end

  it "returns all pod racks where status != available for a given pod" do
    VCR.use_cassette('imperative/colo/used_racks') do
      get '/rack-management/positions/colo/5/2', (), json_header
      new_location = @location.map{|k,v| v.to_s}.join('-')
      expect( JSON.parse(last_response.body) ).to eq [{"position"=>new_location, "status"=>"in-use"}]
    end
  end

  it "returns the details for a specified colo rack" do
    VCR.use_cassette('imperative/colo/rack_detail') do
      get '/rack-management/detail/colo/5/2/1', (), json_header
      expect( last_response.body ).to include "<span>#{@parsed_location}</span>"
      expect( last_response.body ).to include "<span>#{@client_number}</span>"
      expect( last_response.body ).to include "<span>in-use</span>" # check status
      expect( last_response.body ).to include "<span>#{@prefix}</span>"
      expect( last_response.body ).to include "<span>COL00003</span>" # check asset tag
      expect( last_response.body ).to match (/<span class='switch'>row-access-switch\d{0,2}-pod\d{0,2}.jnb1.host-h.net<\/span>/)#  # check switch
      expect( last_response.body ).to match (/<span class='switch_port'>\d{0,2}<\/span>/) # check swith port
      expect( last_response.body ).to match (/<span class='switch_member'>\d{0,2}<\/span>/) # check swith member
    end
  end

end
