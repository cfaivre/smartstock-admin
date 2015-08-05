/*globals $, sqw*/
var SearchHelper = function (data, config) {
   'use strict';
   var _viewModel, _setup, _applyKoBindings, _currentContext, _bindDirtyFlags, _setDefaultAction ;

   _applyKoBindings = function () {
      _viewModel = ko.mapping.fromJS(data);

      _viewModel.dummyEvent = function () {

      };
      _setDefaultAction = function () {
         //core.infrastructure.setDefaultAction(function () {
         //   if ($(':input[name="btnSubmit"]:visible:enabled').length > 0) {
         //      _viewModel.submitProduct();
         //   }
         //}, 'section.selectProductDetails');
      };

      _viewModel.headerTitle = function(){
            return "Search result for " + _viewModel.search_term();
      }

      _viewModel.show_prefixes = function(){
            return _viewModel.client_prefixes().length>0 ? true : false;
      }

      _viewModel.show_colo_positions = function(){
            return _viewModel.colo_locations().length>0 ? true : false;
      }

      _viewModel.show_network_details = function(){
            return true; //TODO: Base this on property value perhaps
      }

      _viewModel.show_customer_details = function(){
            return true; //TODO: Base this on property value perhaps
      }

      _viewModel.show_hosts_details = function(){
            return _viewModel.hosts_details().length>0 ? true : false;
      }

      _viewModel.show_legacy_ip_records = function(){
            return _viewModel.legacy_ip_records().length>0 ? true : false;
      }

      _viewModel.show_legacy_ip_ranges = function(){
            return _viewModel.legacy_ip_ranges().length>0 ? true : false;
      }

      _viewModel.show_legacy_master_tool_info = function(){
            return _viewModel.legacy_master_server_tool_info().length>0 ? true : false;
      }


      try {
         ko.applyBindings(_viewModel, _currentContext[0]);
      } catch (e) {
         //sqw.logException(e, _pageContext);
         alert(e);
      }
   };


   _bindDirtyFlags = function () {
      var setDirty = function () {
         _viewModel.IsDirty(true);
      };

      //set up dirty flag observables
      //_viewModel.SelectedCategory.DirtyFlag = new ko.dirtyFlag(_viewModel.SelectedCategory);

      //set up callbacks
      //_viewModel.SelectedCategory.DirtyFlag.isDirty.subscribe(setDirty);
   };

   _setup = function () {
         //_data = result;
         _currentContext = $('#page');
         _applyKoBindings();
         //_bindDirtyFlags();
         //_setDefaultAction();
   };

   return { setup: _setup };
};
