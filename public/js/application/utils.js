/*globals $, DateHelper, Infrastructure, Validation, Logging, StringHelper, Page, Modal*/
var Utils = function (config) {
   'use strict';
   var 	_capitalizeFirstLetter,
   		_replaceAll,
      _log;

	_capitalizeFirstLetter = function(string){
	  	return string.charAt(0).toUpperCase() + string.slice(1);
	};

  _replaceAll = function(find, replace, str) {
  		return str.replace(new RegExp(find, 'g'), replace);
	}

  _log = function(message){
    if(core.config.debug!==undefined && core.config.debug==true)
    {
      $("#stdout").prepend(">>> " + message + "<br />");
    }
  };

   return {
      capitalizeFirstLetter: _capitalizeFirstLetter,
      replaceAll: _replaceAll,
      log: _log
   };
};
