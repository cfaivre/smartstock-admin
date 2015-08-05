ENV['RACK_ENV'] = 'test'
#require 'simplecov'
#SimpleCov.start
require File.join(File.dirname(__FILE__), '..', 'app.rb')

require 'sinatra'
require 'rack/test'
require 'json'

#require helper files
Dir[File.join(File.dirname(__FILE__), "/helpers/*.rb")].each {|file| require file }

def app
  Rack::Builder.new do
    map '/ping' do
      run ->(env) { [200, {'Content-Type' => 'text/plain'}, ['PONG']] }
    end
    map '/' do
      run StockApp.new
    end
  end
end

RSpec.configure do |config|
  config.include Rack::Test::Methods
end

# VCR
require 'webmock/rspec'
require 'vcr'

VCR.configure do |c|
  c.cassette_library_dir = 'spec/fixtures/vcr_cassettes'
  c.hook_into :webmock
end


def json_header
  { 'ACCEPT' => 'application/json', "CONTENT_TYPE" => "application/json"}
end
