class CncListModel

  def initialize(user_id=nil )
    @user_id = user_id
  end

  def load_cncs
    viewmodel = CncListViewModel.new
    cncs = StockApiClient.new.get_cncs
    if !cncs.empty?
      cncs.sort_by! { |cnc| cnc["name"] }
      cncs.each{|cnc|
        cnc[:name].gsub!(/\w+/, &:capitalize)
      }
    end
    viewmodel.cncs = cncs
    viewmodel
  end

end
