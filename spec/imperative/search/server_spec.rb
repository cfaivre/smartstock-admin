require_relative '../../spec_helper'
require_relative '../../json_helper'

describe "server" do

  before :all do
    VCR.use_cassette('imperative/cache/provision') do
      response = JSON.parse( Helpers::Setup.provision_server )
      @customer_number = response['customer_number']
      @asset_tag = response['asset_tag']
      @server_name = response['server_name']

    end
  end

  it "returns all server positions where status != available for a given rack" do
    VCR.use_cassette('imperative/search/server') do
      get '/server/list?asset_tag=' + @asset_tag, (), json_header
      json = SpecHelper::Json.extract_viewmodel last_response.body
      servers = json["servers"]
      expect( servers.length ).to eq( 1 )
      expect( servers[0]["client_number"] ).to eq( @customer_number )
      expect( servers[0]["asset_tag"] ).to eq( @asset_tag )
      expect( servers[0]["server_name"] ).to eq( @server_name )
    end
  end

end
