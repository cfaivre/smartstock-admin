require 'bcrypt'
require 'yaml'

class User
  include BCrypt
  attr_reader :name

  def self.authenticate(params = {})
    return nil if params[:username].empty? || params[:password].empty?

    @@credentials ||= YAML.load_file(File.join(__dir__, '../config/credentials.yml'))
    username = params[:username].downcase
#    return nil if username != @@credentials[ 'username' ]
    begin
      password_hash = Password.new(@@credentials[ username ])
    rescue BCrypt::Errors::InvalidHash
      return nil
    end
    User.new(username) if password_hash == params[:password]
  end

  def initialize(username)
    @name = username
  end
end
