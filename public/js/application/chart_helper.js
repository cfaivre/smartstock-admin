var ChartHelper = function (data, config) {
  'use strict';
  var  _viewModel,
       _applyKoBindings,
       _currentContext,
       _setup;


  _applyKoBindings = function () {

    _viewModel = ko.mapping.fromJS(data);

    var model = ko.mapping.fromJS(data);
    var mappedLocations = ko.utils.arrayMap(data.locations, function(location) {
      return new Location(location.location, location.counter, location.color);
    });
    _viewModel.locations( mappedLocations );

    var ctx = document.getElementById("myChart").getContext("2d");
    var myPieChart = new Chart(ctx).Pie(data.item_type_data);

    ko.applyBindings(_viewModel, _currentContext[0]);
  };

   var Location = function(location, counter, color) {
      this.location = ko.observable(location);
      this.counter = ko.observable(counter);
      this.color = ko.observable(color);
  }

  _setup = function() {
      _currentContext = $('#content_left');
      _applyKoBindings();
  };

  return {
      setup: _setup
  };

};
