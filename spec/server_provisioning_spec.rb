require_relative '../spec/spec_helper'

describe "for_server_provisioning" do

  it "returns all servers that are unallocated with default hardware" do
    VCR.use_cassette('server/for_provisioning/default_hardware') do
      custom_hardware = false
      response = JSON.parse( Helpers::Setup.for_server_provisioning custom_hardware)
      get '/server/list/Unallocated', (), json_header
      json = JSON.parse(last_response.body)
      servers = json["servers"]
      expect( servers.length ).to eq( 1 )
    end
  end

  it "returns all servers that are unallocated with custom hardware" do
    VCR.use_cassette('server/for_provisioning/custom_hardware') do
      custom_hardware = true
      response = JSON.parse( Helpers::Setup.for_server_provisioning custom_hardware)
      get '/server/list/Unallocated_Custom', (), json_header
      json = JSON.parse(last_response.body)
      servers = json["servers"]
      expect( servers.length ).to eq( 1 )
    end
  end

end
