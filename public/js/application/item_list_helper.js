var ItemListHelper = function (data, config) {
  'use strict';
  var  _viewModel,
       _applyKoBindings,
       _currentContext,
       _mapToJSON,
       _setup;


  _applyKoBindings = function () {

    _viewModel = ko.mapping.fromJS(data);

    _viewModel.items.removeAll();
    var model = ko.mapping.fromJS(data);
    var mappedItems = ko.utils.arrayMap(data.items, function(item) {
      return new Item(item.location, item.date, item.serial_number,
                          item.rfid, item.purchase_order_number,
                          item.sap_number);
    });
    _viewModel.items( mappedItems );

    ko.applyBindings(_viewModel, _currentContext[0]);
  };

  _mapToJSON = function (model) {
      var ignoreMapping;
      ignoreMapping = {
         ignore: []
      };
      return ko.mapping.toJSON(model, ignoreMapping);
  };

  var Item = function(location, date, serial_number, rfid, purchase_order_number, sap_number) {
      this.location = ko.observable(location);
      this.date = ko.observable(date);
      this.serial_number = ko.observable(serial_number);
      this.rfid = ko.observable(rfid);
      this.purchase_order_number = ko.observable(purchase_order_number);
      this.sap_number = ko.observable(sap_number);
  }

  _setup = function() {
    _currentContext = $('#content_left');
    _applyKoBindings();
  };

  return {
      setup: _setup
  };

};
