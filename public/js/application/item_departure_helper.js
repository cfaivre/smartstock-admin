var ItemDepartureHelper = function (data, config) {
  'use strict';
  var  _viewModel,
       _applyKoBindings,
       _currentContext,
       _itemsCallback,
       _updatedItemsCallback,
       _loadUpdatedItems,
       _mapToJSON,
       _setup;

  _applyKoBindings = function () {

    _viewModel = ko.mapping.fromJS(data);
    _viewModel.isLoading = ko.observable( false );
    _viewModel.hasError = ko.observable( false );
    _viewModel.items_counter = ko.observable( false );

    _viewModel.readDepartureStock = function() {
      _viewModel.isLoading = ko.observable( true );
      $( "#btnReadStock" ).val('Scan again');
      var jsdata = _mapToJSON( _viewModel.rfids() );
      core.infrastructure.ajaxPost( '/item/read_departure_items', jsdata, null,
                                   _currentContext,
                                   _itemsCallback,
                                     null );
    };

    _itemsCallback = function( result ){
      var model = ko.mapping.fromJS(result);
      var mappedItems = ko.utils.arrayMap(result.items, function(item) {
        return new Item(item.location, item.storage_location, item.date, item.serial_number,
                            item.rfid, item.purchase_order_number);
      });
      var mappedRfids = ko.utils.arrayMap(result.items, function(item) {
        return item.rfid;
      });

      _viewModel.items( mappedItems );
      _viewModel.rfids( mappedRfids );
    };

    _viewModel.acceptDepartureStock = function() {
      if(!core.infrastructure.validateForm("submit_form"))
      {
        var jsdata = _mapToJSON(_viewModel);
        core.infrastructure.askConfirmation(
        function(){
          core.infrastructure.ajaxPost('/items/in-transit', jsdata, null,
          _currentContext,
          function(result){
            var model = ko.mapping.fromJS(result);
            _loadUpdatedItems(model);
          });
        },
        null,
        'Are you sure you want to accept the read stock?');
      } else {
        _viewModel.hasError = ko.observable( true );
      }
    };

    _loadUpdatedItems = function() {
      var jsdata = _mapToJSON(_viewModel.rfids());
      core.infrastructure.ajaxPost( '/items/details', jsdata, null,
                                   _currentContext,
                                   _updatedItemsCallback,
                                     null );
    };

    _updatedItemsCallback = function( result ){
      var model = ko.mapping.fromJS(result);
      var mappedItems = ko.utils.arrayMap(result, function(item) {
        return new Item(item.location, item.storage_location, item.date, item.serial_number,
                            item.rfid, item.purchase_order_number);
      });
      _viewModel.items( mappedItems );
    };

    _mapToJSON = function (model) {
      var ignoreMapping;
      ignoreMapping = {
         ignore: []
      };
      return ko.mapping.toJSON(model, ignoreMapping);
    };

    ko.applyBindings(_viewModel, _currentContext[0]);
  };

  var Item = function(location, storage_location, date, serial_number, rfid, purchase_order_number) {
    this.location = ko.observable(location);
    this.storage_location = ko.observable(storage_location);
    this.date = ko.observable(date);
    this.serial_number = ko.observable(serial_number);
    this.rfid = ko.observable(rfid);
    this.purchase_order_number = ko.observable(purchase_order_number);
  }

  _setup = function() {
    _currentContext = $('#content_left');
    _applyKoBindings();
  };

  return {
    setup: _setup
  };

};
