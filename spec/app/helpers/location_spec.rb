require_relative '../../spec_helper'

describe Helpers::Location do

  context "location hash to string" do
    it "returns an empty string if data_centre is an empty string" do
      location_hash = { data_centre: '', pod: '', rack: '' }
      expect( Helpers::Location.hash_to_string( location_hash ) ).to eq ''
    end
    it "accepts the hash has keys of type string" do
      location_hash = { data_centre: '5', pod: '1', rack: '1' }
      expect( Helpers::Location.hash_to_string( location_hash ) ).to eq 'J1/1-1'
    end
    context "colo location" do
      it "accepts a colo location hash, with symbol keys, and outputs the string value" do
        location_hash = { data_centre: 5, pod: 1, rack: 1 }
        expect( Helpers::Location.hash_to_string( location_hash ) ).to eq 'J1/1-1'
      end
      it "accepts a colo location hash, with string keys, and outputs the string value" do
        location_hash = { 'data_centre'=>5, 'pod'=>1, 'rack'=>1 }
        expect( Helpers::Location.hash_to_string( location_hash ) ).to eq 'J1/1-1'
      end
    end

    context "server location" do
      it "accepts a server location hash, with symbol keys, and outputs the string value" do
        location_hash = { data_centre: 5, row: 1, rack: 1, shelf: 1, position: 1, custom_position: nil }
        expect( Helpers::Location.hash_to_string( location_hash ) ).to eq 'J1/1-1-1-1'
      end
      it "accepts a server location hash, with string keys, and outputs the string value" do
        location_hash = { 'data_centre'=>5, 'row'=>1, 'rack'=>1, 'shelf'=>1, 'position'=>1, 'custom_position'=>nil }
        expect( Helpers::Location.hash_to_string( location_hash ) ).to eq 'J1/1-1-1-1'
      end
    end

    context "server location with custom position" do
      it "accepts a server location hash, with symbol keys, and outputs the string value" do
        location_hash = { data_centre: 5, custom_position: 'CAB1 POS1', row: nil, rack: nil, shelf: nil, position: nil }
        expect( Helpers::Location.hash_to_string( location_hash ) ).to eq 'J1/CAB1 POS1'
      end
      it "accepts a server location hash, with string keys, and outputs the string value" do
        location_hash = { 'data_centre'=>5, 'custom_position'=>'CAB1 POS1', 'row'=>nil, 'rack'=>nil, 'shelf'=>nil, 'position'=>nil }
        expect( Helpers::Location.hash_to_string( location_hash ) ).to eq 'J1/CAB1 POS1'
      end
      it "converts the another custom position" do
        location_hash = {"data_centre"=>5.0, "row"=>nil, "rack"=>nil, "shelf"=>nil, "position"=>nil, "custom_position"=>"2-07 POS16"}
        expect( Helpers::Location.hash_to_string( location_hash ) ).to eq 'J1/2-07 POS16'
      end
    end
  end

end
