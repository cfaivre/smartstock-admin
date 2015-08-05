/*globals $, window, document, Logging, StringHelper, sqw, Sqw*/
var Infrastructure = function (config) {
   'use strict';

   var _blockUiActive,
       _getLookupUrl,
       _config,
       _blockUI,
       _unblockUI,
       _clearErrors,
       _displayErrors,
       _scrollToError,
       _displayWarnings,
       _displayUnboundError,
       _clearUnboundError,
       _hasWarnings,
       _isLoggedOut,
       _ajaxSuccess,
       _ajaxError,
       _ajax,
       _ajaxPost,
       _ajaxGet,
       _getLookupValue,
       _autocompleteConfiguration,
       _autocomplete,
       _jsonToNameValuePair,
       _firstFieldFocus,
       _stripeTableRows,
       _askConfirmation,
       _askConfirmationSuppress,
       _askAlert,
       _applyInputFilters,
       _formatNumber,
       _redirect,
       _redirectHref,
       _getDataAttribute,
       _scrollTo,
       _applyFirstFieldFocusToTab,
       _setDefaultAction,
       _setDefaultActionOnInputs,
       _errorShown,
       _showModal,
       _validateForm,
       _validateFormElement,
       _disableForm,
       _invertColors,
       _loadRemoteView;

   _showModal = function(title, message){
     $("#appModal .modal-title").html(title);
     $("#appModal .modal-body").html(message);
     $("#appModal").modal('show');
   };

   _blockUI = function () {

      var screenBlockerSpinner = $('#screen_blocker_spinner');
      _blockUiActive = true;
      $(screenBlockerSpinner).css({
         position: 'fixed',
         left: ($(window).width() - $(screenBlockerSpinner).outerWidth()) / 2,
         top: ($(window).height() - $(screenBlockerSpinner).outerHeight()) / 2
      });
      screenBlockerSpinner.show();
      $('#screen_blocker').show().height(($(document).height()));
   };

   _unblockUI = function () {
      _blockUiActive = false;
      $('#screen_blocker_spinner').hide();
      $("#screen_blocker").hide();
   };


   var _clearErrors = function () {
      //$('.data-field-error').tooltip('destroy').removeClass('error');
      //$(':input[data-field]').removeClass('error');
      //_showTabContainerErrors();
      //$('.data-error-summary').html('').hide();
      //$('.data-warning-summary').html('').hide();
      //$('.data-info-summary').html('').hide();
   };

   _displayErrors = function (result, context) {
      var i, errorSpan, errorList;
      $('.ajax-error-messages ul', context).empty();
      if (typeof result === 'undefined' || typeof result.errors === 'undefined') {
         return;
      }
      if (result.errors.length > 0) {

         $('div.data-error-summary', context).last().html('<ul></ul>').removeClass('hidden').show();
         errorList = $('.ajax-error-messages ul', context);
         for (i = 0; i < result.errors.length; i += 1) {
            var propertyName = result.errors[i].property_name;
            var errorMessage = "";
            if(propertyName.length===0)
            {
              errorMessage = result.errors[i].error_message;
            }
            else
            {
              var propertyLabel = $('#' + result.errors[i].property_name , context).parent().parent().find('label').text();
              errorMessage = propertyLabel + " - " + result.errors[i].error_message ;
              $('#' + propertyName , context).parent().addClass('has-error');
              $('#' + propertyName , context).parent().append("<span class='error_label glyphicon glyphicon-exclamation-sign'>&nbsp;" + result.errors[i].error_message  + "</span>");
            }
            $(errorList).append('<li>' + errorMessage + '</li>');
            //}
         }
         $(".ajax-error",context).show();
      }
   };

   _scrollToError = function (errorSelector, context) {
      var errorSpan;

      errorSpan = $(errorSelector + ':visible', context);

      if (errorSpan.length > 0) {
         _scrollTo(errorSpan.selector);
      }
      else {
         _scrollTo('div.data-error-summary ul', false, context);
      }
   };

   _displayWarnings = function (result, context) {
      var i, errorList;

      if (typeof result === 'undefined' || typeof result.FieldErrors === 'undefined') {
         return;
      }

      if (result.FieldErrors.length > 0) {
         $('div.data-warning-summary', context).last().html('<ul></ul>').removeClass('hidden').show();
         errorList = $('div.data-warning-summary ul', context);
         for (i = 0; i < result.FieldErrors.length; i += 1) {
            if (result.FieldErrors[i].Severity === _config.severityTypes.Warning) {
               $(errorList).append('<li>' + result.FieldErrors[i].ErrorMessage + '</li>');
            }
         }
      }
   };

   _displayUnboundError = function (status, message, context) {
    $('.ajax-error-messages ul', context).empty();
    var errorTitle = status.length ==0 ? "An unknown error has occured!" : status;
    $('.ajax-error .message',context).text(errorTitle);
      var errorList = $('.ajax-error-messages ul', context);

      if (errorList.length !== 0) {
         $(errorList).append('<li>' + message + '</li>');
         $(".ajax-error",context).show();
      }
   };

   _clearUnboundError = function (context) {
      var errorPanel = $('.notification', context);

      if (errorPanel.length === 1) {
         $(errorPanel).addClass('hidden').html();
      }
   };

   _hasWarnings = function (result) {
      var i;
      if (result && result.FieldErrors) {
         for (i = 0; i < result.FieldErrors.length; i += 1) {
            if (result.FieldErrors[i].Severity === _config.severityTypes.Warning && result.FieldErrors[i].ShowInModal===false) {
               return true;
            }
         }
      }

      return false;
   };

   _getLookupValue = function (options, value) {
      var i;
      if (value !== null) {
         for (i = 0; i < options.length; i += 1) {
            if (typeof options[i].value!== 'undefined' && $.isFunction(options[i].value)) {
               if (options[i].value() === value) {
                  return options[i].text();
               }
            } else {
               if (options[i].value === value) {
                  return options[i].text;
               }
            }
         }
      }

      return '';
   };

  _disableForm = function(context){
    context.find(":input").attr("disabled", true);
  };

   // Default success handler for generic _ajax function.
   // - Clear/set errors in specified context.
   // - If result.ReturnUrl is specified - redirect to it, otherwise call the success function.
   // Parameters:
   //   result:  The result returned from the server
   //   success: The success callback function (optional)
   //   context: The jQuery selector of the default error context (where to display the error)
   _ajaxSuccess = function (result, success, context, handledError, options) {
      var url;
         _unblockUI();

         _clearErrors(context);

         _displayErrors(result,context);
   };

   // Default error handler for generic _ajax function.
   // - Display server error in the specified context.
   // Parameters:
   //   xhr:            The XMLHttpRequest result.
   //   status:         The type of error returned, e.g. "timeout", "error".
   //   exception:      The exception returned by the server.
   //   context:        The jQuery selector of the default error context (where to display the error).
   //   unhandledError: The function to call after all the error handling is conplete (optional).
   //   data:           The data that was sent to the URL.
   //   url:            The URL to which the request was made.
   _ajaxError = function (xhr, status, exception, context, unhandledError, url, data) {
      var timeoutMessage, message, status;
      timeoutMessage = 'The request timed out, please try again later.';
      message = '';
      status = '';
      _clearErrors();
      if (status === 'timeout') {
         message = timeoutMessage;
      } else {
            status = xhr.statusText;
            var response = xhr.responseText.match(/.*<body.*>([\s\S]*)<\/body>.*/);
            message = $('<div>').html(response).find('#summary h2').text();
            if(message.length===0)
            {
         switch (xhr.status) {
            case 400:
               _redirect(_config.homeUrl);
               break;
            case 403:
               message = 'You are not authorized to access this resource';
               break;
            case 404:
               message = 'The requested resource could not be found.';
               break;
            case 500:
               if (xhr.responseText === null || xhr.responseText === '' || xhr.responseText.indexOf('<html') !== -1) {
                  message = 'Due to technical problems, we are unable to process this transaction.';
               } else {
                  message = xhr.responseText;
               }
               break;
            case 504:
               message = timeoutMessage;
               break;
            case 0:
               message = 'The server is not responding or is not reachable.';
               break;
            default:
               if (xhr.status > 600) {
                  message = 'Unknown error: ' + xhr.responseText + ' (Status Code: ' + xhr.status + ')';
               } else {
                  message = 'Unknown error: ' + ((xhr.responseText.indexOf('<html') !== -1) ? xhr.responseText : '') + ' (Status Code: ' + xhr.status + ')';
               }
               break;
         }
       }
      }
      _displayUnboundError(status, message, context);

      if ($.isFunction(unhandledError)) {
         if (!_errorShown) {
            unhandledError(message);
            _errorShown = true;
         }
      }

      _unblockUI();
   };

   // Generic $.ajax wrapper function.  Implements default options.
   // Required:
   //   url:  The URL of the request
   //   data: The data to send to the server
   //   context: The jQuery selector of the default error context (where to display the error)
   // Optional:
   //   success: The function to execute on successful execution of the request
   //   options: The options to pass to $.ajax.  Defaults can be overridden, or new parameters can be added.
   //   ajaxSuccess: The function to execute on all successful AJAX requests, regardless of handled error state (optional).
   //   handledError: The function to execute on all successful AJAX requests with handled errors (optional).
   //   unhandledError: The function to execute on all unsuccessful AJAX request with unhandled, i.e. AJAX errors (optional).
   _ajax = function (url, data, context, success, options, ajaxSuccess, handledError, unhandledError) {
      //if (options.type === "POST") {
         _blockUI();
      //}
      var settings = $.extend({
         async: true,
         url: url,
         data: data,
         cache: false,
         success: function (response) {
            if ($.isFunction(ajaxSuccess)) {
               ajaxSuccess(response);
            }
            _ajaxSuccess(response, success, context, handledError, options);
         },
         error: function (xhr, status, exception) {
            _ajaxError(xhr, status, exception, context, unhandledError, url, data);
         },
         initialRetryWait: 1000,
         retryMax: 2
      }, options || {});

      $.ajax(settings);
   };

   // Ajax POST of form or JavaScript object data with error handling.
   // Notes:
   //   - The ProperyStateList and FieldErrors properties (if present) are set to empty to make the request smaller.
   // Requirements:
   //   - The AntiForgeryToken must be added to the calling page (e.g. @Html.AntiForgeryToken()).
   // Parameters:
   //   url:  The URL of the request
   //   data: The data to send to the server
   //   success: The function to execute on successful execution of the request (optional - null if not needed)
   //   context: The jQuery selector of the default error context (where to display the error)
   // Optional:
   //   ajaxSuccess: The function to execute on all successful AJAX requests, regardless of handled error state (optional).
   //   handledError: The function to execute on all successful AJAX requests with handled errors (optional).
   //   unhandledError: The function to execute on all unsuccessful AJAX request with unhandled, i.e. AJAX errors (optional).
   _ajaxPost = function (url, data, success, context, ajaxSuccess, handledError, unhandledError) {

      //data = _jsonToNameValuePair(data);
      _ajax(url, data, context, success, { type: 'POST' }, ajaxSuccess, handledError, unhandledError);
   };

   // Ajax GET of form or key/value pair data with error handling.
   // Parameters:
   //   url:  The URL of the request
   //   data: The data to send to the server
   //   success: The function to execute on successful execution of the request (optional - null if not needed)
   //   context: The jQuery selector of the default error context (where to display the error)
   // Optional:
   //   ajaxSuccess: The function to execute on all successful AJAX requests, regardless of handled error state (optional).
   //   handledError: The function to execute on all successful AJAX requests with handled errors (optional).
   //   unhandledError: The function to execute on all unsuccessful AJAX request with unhandled, i.e. AJAX errors (optional).
   _ajaxGet = function (url, data, success, context, ajaxSuccess, handledError, unhandledError) {
      _ajax(url, data, context, success, { type: 'GET' }, ajaxSuccess, handledError, unhandledError);
   };


   _autocomplete = function(context, url, callback){
      var elementToBind;
      elementToBind = $(context);
       $(elementToBind).autocomplete({
         source: url,
         minLength: 2,
         select: callback
       });
   };

   //generic helper function to set up autocomplete functionality
   _autocompleteConfiguration = function (url, searchCriteriaMethod, valueMethod, mapObject, mapMethod, errorHandler, selectMethod, closeMethod, context, options) {
      var _options;
      if (!$.isFunction(searchCriteriaMethod) || !$.isFunction(valueMethod) || !$.isFunction(mapObject) || !$.isFunction(mapMethod) || !$.isFunction(errorHandler)) {
         throw { message: "One or more parameter is not a function" };
      }

      _options = $.extend({
         minLength: 3
      }, options || {});

      return {
         delay: 1000,
         minLength: _options.minLength,
         source: function (request, response) {
            var data = searchCriteriaMethod(request.term);
            _ajaxGet(url, data, function (result) {
               var message;
               if (typeof result.ErrorsTemplateModel !== 'undefined') {
                  if (result.ErrorsTemplateModel.ErrorsModel.ErrorList.length > 0) {
                     message = result.ErrorsTemplateModel.ErrorsModel.ErrorList[0].Message;
                     errorHandler(message);
                  }
               }
               if (typeof result.FieldErrors !== 'undefined') {
                  if (result.FieldErrors.length > 0) {
                     message = result.FieldErrors[0].Message;
                     errorHandler(message);
                  }
               }
               response($.map(mapObject(result), function (item) {
                  return mapMethod(item);
               }));
            }, context);
         },

         select:
         function (event, ui) {
            if ($.isFunction(selectMethod)) {
               selectMethod(event, ui);
            }
         },

         close:
         function (event, ui) {
            if ($.isFunction(closeMethod)) {
               closeMethod(event, ui);
            }
         }
      };
   };

   _jsonToNameValuePair = function (json) {
      var deserialized, _process, _processObject, _processArray, _processPrimitive;
      deserialized = '';
      _process = function (parentKey, property) {
         if ($.isFunction(property)) {
            return;
         }

         if ($.isPlainObject(property)) {
            _processObject(parentKey, property);
            return;
         }

         if ($.isArray(property)) {
            _processArray(parentKey, property);
            return;
         }

         _processPrimitive(parentKey, property);
      };

      _processObject = function (parentKey, property) {

         $.each(property, function (key, value) {
            _process($.trim(parentKey) === '' ? property : parentKey + '.' + key, value);
         });
      };

      _processArray = function (parentKey, property) {
         $.each(property, function (key, value) {
            if (!$.isFunction(value) && !$.isPlainObject(value) && !$.isArray(value)) {
               _process(parentKey, value);
            }
            else {
               _process(parentKey + '[' + key + ']', value);
            }
         });
      };

      _processPrimitive = function (key, value) {
         if (value !== null && typeof value !== 'undefined' && value !== 'undefined') {
            deserialized = deserialized + '&' + encodeURIComponent(key) + '=' + encodeURIComponent(value);
         }
      };

      $.each(json, _process);

      return $.trim(deserialized) === '' ? '' : deserialized.substring(1, deserialized.length);
   };

   _firstFieldFocus = function (selector) {
       if (navigator.userAgent.indexOf('iPad') === -1) {
      $(':input:enabled:visible:first', selector).focus();
       }
   };

   _stripeTableRows = function () {
      $("tr:odd").css("background-color", "#f5f5f5");
   };

   _askConfirmation = function (yesAction, noAction, message) {
      $("#confirmationModal .modal-body p").html(message);
      $("#confirmationModal").modal('show');
      $("#confirmationModal #modalOK").unbind().bind('click', function(){
        if ($.isFunction(yesAction)) {
           yesAction();
        }
        $("#confirmationModal").modal('hide');
        return false;
      });
      $("#confirmationModal #modalCancel").unbind().bind('click', function(){

        if ($.isFunction(noAction)) {
           noAction();
        }
        $("#confirmationModal").modal('hide');
        return false;
      });
   };

   _askAlert = function (okAction, message) {
    $("#appModal #modalCancel").hide();
      $("#appModal .modal-body p").html(message);
      $("#appModal").modal('show');
      $("#appModal #modalOK").unbind().bind('click', function(){
        if ($.isFunction(yesAction)) {
           yesAction();
        }
        $("#appModal").modal('hide');
        return false;
      });
      $("#appModal #modalCancel").unbind();
   };

   _applyInputFilters = function (selector) {
      var inputFields = $(':input[filtertype]', selector);

      inputFields.each(function () {
         var input, filterType;
         input = this;
         filterType = $(input).attr('filtertype');

         switch (filterType) {
            case 'integer':
               $(this).numeric(false);
               break;
         }
      });
   };

   _formatNumber = function (number, decimals, dec_point, thousands_sep) {
      // http://kevin.vanzonneveld.net
      // +   original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
      // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
      // +     bugfix by: Michael White (http://getsprink.com)
      // +     bugfix by: Benjamin Lupton
      // +     bugfix by: Allan Jensen (http://www.winternet.no)
      // +    revised by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
      // +     bugfix by: Howard Yeend
      // +    revised by: Luke Smith (http://lucassmith.name)
      // +     bugfix by: Diogo Resende
      // +     bugfix by: Rival
      // +      input by: Kheang Hok Chin (http://www.distantia.ca/)
      // +   improved by: davook
      // +   improved by: Brett Zamir (http://brett-zamir.me)
      // +      input by: Jay Klehr
      // +   improved by: Brett Zamir (http://brett-zamir.me)
      // +      input by: Amir Habibi (http://www.residence-mixte.com/)
      // +     bugfix by: Brett Zamir (http://brett-zamir.me)
      // +   improved by: Theriault
      // +      input by: Amirouche
      // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
      // *     example 1: number_format(1234.56);
      // *     returns 1: '1,235'
      // *     example 2: number_format(1234.56, 2, ',', ' ');
      // *     returns 2: '1 234,56'
      // *     example 3: number_format(1234.5678, 2, '.', '');
      // *     returns 3: '1234.57'
      // *     example 4: number_format(67, 2, ',', '.');
      // *     returns 4: '67,00'
      // *     example 5: number_format(1000);
      // *     returns 5: '1,000'
      // *     example 6: number_format(67.311, 2);
      // *     returns 6: '67.31'
      // *     example 7: number_format(1000.55, 1);
      // *     returns 7: '1,000.6'
      // *     example 8: number_format(67000, 5, ',', '.');
      // *     returns 8: '67.000,00000'
      // *     example 9: number_format(0.9, 0);
      // *     returns 9: '1'
      // *    example 10: number_format('1.20', 2);
      // *    returns 10: '1.20'
      // *    example 11: number_format('1.20', 4);
      // *    returns 11: '1.2000'
      // *    example 12: number_format('1.2000', 3);
      // *    returns 12: '1.200'
      // *    example 13: number_format('1 000,50', 2, '.', ' ');
      // *    returns 13: '100 050.00'
      // Strip all characters but numerical ones.
      number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
      var n = !isFinite(+number) ? 0 : +number,
          prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
          sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
          dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
          s = '',
          toFixedFix = function (n, prec) {
             var k = Math.pow(10, prec);
             return '' + Math.round(n * k) / k;
          };
      // Fix for IE parseFloat(0.55).toFixed(0) = 0;
      s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
      if (s[0].length > 3) {
         s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
      }
      if ((s[1] || '').length < prec) {
         s[1] = s[1] || '';
         s[1] += new Array(prec - s[1].length + 1).join('0');
      }
      return s.join(dec);
   };

   // Redirect to a url without adding browser history.
   _redirect = function (url) {
      _blockUI();
      window.location.replace(url);
   };

   _redirectHref = function (e, url) {
      _redirect(url);
      if (e) {
         if (e.preventDefault) {
            e.preventDefault();
         }
         if (e.preventPropagation) {
            e.preventPropagation();
         }
      }
   };

   _getDataAttribute = function (event, attribute) {
      var target = event.target || event.srcElement;
      return $(target).data(attribute);
   };

   _scrollTo = function (bookmarkSelector, isHighLighted, context) {
      var bookmark, fixedNavigationOffset;
      bookmark = $(bookmarkSelector + ':visible', context);
      fixedNavigationOffset = 260;

      if (bookmark.length > 0) {
         $(window).scrollTop((bookmark.first().offset().top) - fixedNavigationOffset);

         if (isHighLighted) {
            bookmark.first().addClass("altered");
            $(bookmarkSelector + '-Image', context).addClass("alteration");
            if ($('.table', context).hasClass('altered')) {
               $('.table', context).stop().animate({
                  borderTopColor: '#e5e5e5',
                  borderLeftColor: '#e5e5e5',
                  borderRightColor: '#e5e5e5',
                  borderBottomColor: '#e5e5e5',
                  backgroundColor: '#fff'
               }, 4000);
            }
         }
      }
   };

   _applyFirstFieldFocusToTab = function (context) {
      $(document).off('click', context + ' .form-tabs a');
      $(document).on('click', context + ' .form-tabs a', function () {
         _firstFieldFocus(context);
      });
   };

   _setDefaultAction = function (action, inputAreaSelector, inputExclusionFilterSelector) {
      if (typeof action !== 'function') {
         throw 'The action parameter of setDefaultAction must be a function.';
      }

      $(document).off('keydown.defaultAction');

      $(document).on('keydown.defaultAction',
         function (e) {
            if (e.which === 13 && _blockUiActive === false) {
               e.preventDefault();
               action.call(this, e);
            }
         }
      );

      _setDefaultActionOnInputs(inputAreaSelector, inputExclusionFilterSelector);
   };

   _setDefaultActionOnInputs = function (inputAreaSelector, inputExclusionFilterSelector) {
      var selector;

      if (typeof inputExclusionFilterSelector === 'undefined') {
         selector = $(':input:not(button):not(select)', inputAreaSelector);
      } else {
         selector = $('input', inputAreaSelector).not(inputExclusionFilterSelector).not('button').not('select');
      }

      selector.off('keydown.defaultAction');

      selector.on('keydown.defaultAction',
         function (e) {
            if (e.which === 13 && _blockUiActive === false) {
               e.preventDefault();
               $(this).change();
            }
         }
      );
   };

   _blockUiActive = false;

   _getLookupUrl = function (selector) {
      return $(selector).attr("href");
   };

   _invertColors = function (rgb) {
      rgb = [].slice.call(arguments).join(",").replace(/rgb\(|\)|rgba\(|\)|\s/gi, '').split(',');
      //for (var i = 0; i < rgb.length; i++) rgb[i] = (i === 3 ? 1 : 255) - rgb[i];
      for (var i = 0; i < rgb.length; i++) rgb[i] = rgb[i]  - 60;
      return rgb.join(", ");
    };

   _validateForm = function(selector, excludeList){
      var hasErrors = false;
      var validatableEntities = new Array();
      if(!excludeList)
      {
        excludeList = [];
      }
      $('.error_label').remove();
      $(selector + ' :input[required=""],:input[required]').each(function(){
        validatableEntities.push($($(this)));
      });
      $(selector + ' select.required').each(function(){
        validatableEntities.push($($(this)));
      });
      $.each(validatableEntities,function(key,value){
        if(jQuery.inArray(value[0].id,excludeList)==-1)
        {
          var hasError = _validateFormElement(value);
          if(!hasErrors)
          {
            hasErrors = hasError;
          }
        }
      });
      return hasErrors;
   };

   _loadRemoteView = function(element, url, success){
    _blockUI();
      $(element).load(url,function(responseTxt,statusTxt,xhr){
        _unblockUI();
        if ($.isFunction(success)) {
          success(responseTxt,statusTxt,xhr);
        }
      });
   };

   _validateFormElement = function(element){
      $(element).parent().removeClass("has-error");
      var hasError = false;
      var elementValue = "";
      var elementType = $(element).get(0).tagName;
      switch (elementType)
      {
          case 'INPUT':
            elementValue = $(element).val();
            break;
          case 'SELECT':
            elementValue = $(element).val();
            break;
          default:
            elementValue = $(element).val();
      }
        if(elementValue.length==0)
        {
          hasError = true;
          $(element).parent().addClass("has-error");
        }
        else
        {
          if($(element).attr('pattern')!==undefined && $(element).attr('pattern').length>0)
          {
            var regex = new RegExp($(element).attr('pattern'))
            if(!regex.test(elementValue))
            {
              hasError = true
              if($(element).attr('placeholder')!==undefined && $(element).attr('placeholder').length>0)
              {
                  $(element).parent().append("<span class='error_label glyphicon glyphicon-exclamation-sign'>&nbsp;" + $(element).attr('placeholder') + "</span>");
              }
              else
              {
                  $(element).parent().append("<span class='error_label glyphicon glyphicon-exclamation-sign'>&nbsp;Format error</span>");
              }
            }
          }
        }
        return hasError;
   }

   _config = $.extend({
   }, config || {});

   _config.homeUrl = _getLookupUrl(_config.homeHref);

   return {

      displayErrors: _displayErrors,
      displayWarnings: _displayWarnings,
      displayUnboundError: _displayUnboundError,
      clearUnboundError: _clearUnboundError,
      hasWarnings: _hasWarnings,
      ajaxPost: _ajaxPost,
      ajaxGet: _ajaxGet,
      getLookupUrl: _getLookupUrl,
      getLookupValue: _getLookupValue,
      autocompleteConfiguration: _autocompleteConfiguration,
      autocomplete: _autocomplete,
      blockUI: _blockUI,
      unblockUI: _unblockUI,
      firstFieldFocus: _firstFieldFocus,
      applyFirstFieldFocusToTab: _applyFirstFieldFocusToTab,
      stripeTableRows: _stripeTableRows,
      askConfirmation: _askConfirmation,
      askConfirmationSuppress: _askConfirmationSuppress,
      applyInputFilters: _applyInputFilters,
      formatNumber: _formatNumber,
      askAlert: _askAlert,
      redirect: _redirect,
      redirectHref: _redirectHref,
      getDataAttribute: _getDataAttribute,
      scrollTo: _scrollTo,
      scrollToError: _scrollToError,
      setDefaultAction: _setDefaultAction,
      setDefaultActionOnInputs: _setDefaultActionOnInputs,
      showModal: _showModal,
      validateForm: _validateForm,
      disableForm: _disableForm,
      invertColors: _invertColors,
      loadRemoteView: _loadRemoteView
   };
};
