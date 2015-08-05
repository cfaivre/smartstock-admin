class BaseViewModel
  attr_accessor :errors
  attr_accessor :links
  attr_accessor :job_count
  attr_accessor :success
  attr_accessor :success_message
  attr_accessor :error_message
  attr_accessor :show_more_info
  attr_accessor :success_link
  attr_accessor :job_id

  def initialize()
    self.errors = []
    self.links = []
    self.job_count = 0
    self.success = false
    self.success_message = ""
    self.error_message = ""
    self.show_more_info = false
    self.success_link = ""
    self.job_id = ""
  end

  def stub
    return true
  end

end
