var WarehouseListHelper = function (data, config) {
  'use strict';
  var  _viewModel,
       _applyKoBindings,
       _currentContext,
       _mapToJSON,
       _setup;


  _applyKoBindings = function () {

    _viewModel = ko.mapping.fromJS(data);

    _viewModel.warehouses.removeAll();
    var model = ko.mapping.fromJS(data);
    var mappedWarehouses = ko.utils.arrayMap(data.warehouses, function(warehouse) {
      return new Warehouse(warehouse.code, warehouse.name);
    });
    _viewModel.warehouses( mappedWarehouses );

    ko.applyBindings(_viewModel, _currentContext[0]);
  };

  _mapToJSON = function (model) {
      var ignoreMapping;
      ignoreMapping = {
         ignore: []
      };
      return ko.mapping.toJSON(model, ignoreMapping);
  };

  var Warehouse = function(code, name) {
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
