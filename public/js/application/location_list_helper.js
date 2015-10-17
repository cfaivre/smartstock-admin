var LocationListHelper = function (data, config) {
  'use strict';
  var  _viewModel,
       _applyKoBindings,
       _currentContext,
       _mapToJSON,
       _setup;


  _applyKoBindings = function () {

    _viewModel = ko.mapping.fromJS(data);

    _viewModel.locations.removeAll();
    var model = ko.mapping.fromJS(data);
    var mappedLocations = ko.utils.arrayMap(data.locations, function(location) {
      return new Location(location.code, location.name);
    });
    _viewModel.locations( mappedLocations );

    ko.applyBindings(_viewModel, _currentContext[0]);
  };

  _mapToJSON = function (model) {
      var ignoreMapping;
      ignoreMapping = {
         ignore: []
      };
      return ko.mapping.toJSON(model, ignoreMapping);
  };

  var Location = function(code, name) {
      this.code = ko.observable(code);
      this.name = ko.observable(name);
  }

  _setup = function() {
      _currentContext = $('#content_left');
      _applyKoBindings();
  };

  return {
      setup: _setup
  };

};
