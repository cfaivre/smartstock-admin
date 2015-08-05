var CncListHelper = function (data, config) {
  'use strict';
  var  _viewModel,
       _applyKoBindings,
       _currentContext,
       _mapToJSON,
       _setup;


  _applyKoBindings = function () {

    _viewModel = ko.mapping.fromJS(data);

    _viewModel.cncs.removeAll();
    var model = ko.mapping.fromJS(data);
    var mappedCncs = ko.utils.arrayMap(data.cncs, function(cnc) {
      return new Cnc(cnc.code, cnc.name);
    });
    _viewModel.cncs( mappedCncs );

    ko.applyBindings(_viewModel, _currentContext[0]);
  };

  _mapToJSON = function (model) {
      var ignoreMapping;
      ignoreMapping = {
         ignore: []
      };
      return ko.mapping.toJSON(model, ignoreMapping);
  };

  var Cnc = function(code, name) {
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
