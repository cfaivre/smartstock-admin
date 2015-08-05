module Helpers

  module Views

  def self.hash_to_view ( hash )
    jobinfo = []
    if hash ==nil
      return []
    end
    keys = hash.keys
    hash.each do |key, value|
      label = key.to_s.gsub(/_/," ").split.map(&:capitalize)*' '
      value = hash[key]
      if value.class.to_s=="Hash"
        if key=="location"
          value = Helpers::Location::hash_to_string value
          jobinfo.push( { "label" => "Location", "value" => value } )
        else
          value = value.to_s.gsub(/=>/, ": ").gsub(/\"|{|}/, "").gsub(/_/, " ")
          jobinfo.push( { "label" => label, "value" => value } )
        end
      else
        jobinfo.push( self.build_string_value label, value )
      end
    end
    jobinfo.sort{|a,b| a['label']<=>b['label']}
  end

  def self.build_string_value ( label, value )
    label = label==nil ? "" : label.split.map(&:capitalize)*' '
    hash_item = {"label" => label, "value" => value}
    hash_item
  end

  end

end
