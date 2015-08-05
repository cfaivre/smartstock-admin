var ItemTypeListHelper = function (data, config) {
  'use strict';
  var  _viewModel,
       _applyKoBindings,
       _currentContext,
       _mapToJSON,
       _setup;


  _applyKoBindings = function () {

    _viewModel = ko.mapping.fromJS(data);

    _viewModel.item_types.removeAll();
    var model = ko.mapping.fromJS(data);
    var mappedItemTypes = ko.utils.arrayMap(data.item_types, function(item_type) {
      return new ItemType(item_type.sap_number, item_type.material_type, item_type.description,
                          item_type.image, item_type.rating);
    });
    _viewModel.item_types( mappedItemTypes );

    _viewModel.openImage = function() {
      $('.imagepreview').attr( 'src', this.image() );
      $('#imagemodal').modal('show');
    };

    _viewModel.displayStats = function() {
      location.href="/chart?sap_number=" + this.sap_number();
    };

    ko.applyBindings(_viewModel, _currentContext[0]);
  };

  _mapToJSON = function (model) {
      var ignoreMapping;
      ignoreMapping = {
         ignore: []
      };
      return ko.mapping.toJSON(model, ignoreMapping);
  };

  var ItemType = function(sap_number, material_type, description, image, rating) {
      this.sap_number = ko.observable(sap_number);
      this.material_type = ko.observable(material_type);
      this.description = ko.observable(description);
      this.image = ko.observable(image);
      this.rating = ko.observable(rating);
  }

  _setup = function() {
      _currentContext = $('#content_left');
      _applyKoBindings();
  };

  return {
      setup: _setup
  };

};
