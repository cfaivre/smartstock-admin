/*globals $, DateHelper, Infrastructure, Validation, Logging, StringHelper, Page, Modal*/
var Core = function (config) {
   'use strict';
   var _config, _stopEventPropagation, _setup, _infrastructure, _data, _page, _modal, _bindSearchAutocomplete, _setupMyJobPoll;
   _config = $.extend({
      apiRoot: '',
      searchUrl:'',
   }, config || {});
   if(typeof _config.debug!==undefined && _config.debug==true)
   {
      $("#stdout").show();
   }
   _stopEventPropagation = function(e) {
      if (e) {
         if (e.preventDefault) {
           e.preventDefault();
         }
         if (e.preventPropagation) {
            e.preventPropagation();
         }
      }
   };

  String.prototype.capitalize = function() {
      return this.charAt(0).toUpperCase() + this.slice(1);
  };

  _bindSearchAutocomplete = function(context, url){
      var elementToBind;
      elementToBind = $(context );
      _infrastructure.autocomplete(context,url,function(event, ui){
         _infrastructure.redirect(ui.item.url);
      });
  };

   _setup = function () {
      $('#lnkHome').on('click', function (e) {
         _infrastructure.blockUI();
         _infrastructure.redirectHref(e, homeUrl);
      });
   };

   _infrastructure = new Infrastructure(_config);

   return {
      setup: _setup,
      infrastructure: _infrastructure,
      config: _config,
      utils: new Utils(),
   };
};
