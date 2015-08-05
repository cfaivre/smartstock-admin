require ::File.join( ::File.dirname(__FILE__), 'app' )

test_environment = (ENV['RACK_ENV'] == 'test')
dev_environment = (ENV['RACK_ENV'] == 'development')

app = Rack::Builder.new do
  unless (test_environment or dev_environment)
    use Rack::Session::Cookie, key: 'myapp.session', secret: 'secret'
  end
  map '/ping' do
    run ->(env) { [200, {'Content-Type' => 'text/plain'}, ['PONG']] }
  end
  map '/' do
    run StockApp.new
  end
end

run app
