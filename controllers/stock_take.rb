require 'active_record'
require 'mail'
# Stock Take list
#####################################
get '/stock_takes' do
  authenticate!
  ActiveRecord::Base.include_root_in_json = false
  viewmodel = StockTakeListModel.new.load_stock_takes
  @data = viewmodel.to_json
  haml :'stock_take/list/index'
end

post '/stock_take/mail' do
  Mail.defaults do
    delivery_method :sendmail
  end
  mail = Mail.new
  mail.to = 'christophe@faivre.co.za'
  mail.from = 'reports@mshini.com'
  mail.subject = 'Stock Level Report'
  mail.body = "Please find the stock level report for #{params['date']} attached."
  mail.add_file( File.join(File.dirname(__FILE__), "../public/pdfs/#{params['id']}.pdf") )
  #mail.attachments['myfile.pdf'] = File.read('path/to/myfile.pdf')
  response = mail.deliver!
  raise "Error sending mail!" unless response.class == Mail::Message
end
