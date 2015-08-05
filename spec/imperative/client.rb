require_relative '../spec_helper'

describe "server" do

  before :all do
    VCR.use_cassette('model/client/init') do
      response = JSON.parse( Helpers::Setup.provision_server )
      @client_number = response['client_number']
    end
  end

  it "returns client details for an existing client" do
    VCR.use_cassette('imperative/client/serarch') do
      get "/client?client_number=#{@client_number}", (), json_header
      expect( last_response.body ).to include "10.0.60.0/29"
      expect( last_response.body ).to include "999"
    end
  end

end

