module SpecHelper
  module Json
    def self.extract_viewmodel ( html )
      data = html.match(/\ data = {(.*?)\};/)[0].sub!(" data = ","").sub!(";","").sub!("null","\"\"")
      json = JSON.parse(data)
      return json
    end
  end
end
