require 'faraday'
require 'json'

class JsonService

  def initialize( url_prefix, username = nil, password = nil )
    @connection = Faraday.new(:url => url_prefix) do |faraday|
      faraday.request :url_encoded
      faraday.response :logger
      faraday.adapter Faraday.default_adapter
    end
    Faraday::Utils.default_params_encoder = Faraday::FlatParamsEncoder
    @connection.headers = {'Accept' => 'application/json', 'Content-Type' => 'application/json'}
    @connection.basic_auth(username, password) unless username.nil?
  end

  def get(route, params={})
    begin
      response = @connection.get do |req|
        req.url route
        req.headers['Accept'] = 'application/json'
        req.params = params
      end
      unless response.status.to_s=="200"
        raise "Failed to communicate on route #{route} ."
      end
      return JSON.parse( response.body, symbolize_names: true)
    rescue Exception => e
      response = {:error => e.message}.to_json
    end
    response
  end

  def post(url, params = {})
    response = @connection.post do |req|
      req.url url
      req.body = params
    end
    JSON.parse(response.body, symbolize_names: true)
  end

end
