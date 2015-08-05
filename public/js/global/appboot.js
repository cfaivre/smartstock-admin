$(function () {
   'use strict';
   var var1 , getElementValue, getModelValue, isNullOrEmpty,  initializeKnockout;

   $("#search_form").keyup(function(event){
      if(event.keyCode==13 || event.which == 13)
      {
        if($("#search_form #query").val().length >0)
        {
          $("#search_form").submit();
        }
      }
   });

   getElementValue = function (el) {
      var value = el.autoNumeric('get');
      if (value === '' || value === null) {
         return null;
      }

      return parseFloat(value, 10);
   };

   getModelValue = function (accessor) {
      var value = ko.utils.unwrapObservable(accessor());
      if (value === null || value === undefined || isNaN(value)) {
         return '';
      }

      return parseFloat(ko.utils.unwrapObservable(accessor()), 10);
   };

   isNullOrEmpty = function (value) {
      return typeof value === 'undefined' || value === null || value.length === 0;
   };


   initializeKnockout = function () {
      // Override to allow you to set arbitrary CSS class without removing existing ones.  See https://github.com/SteveSanderson/knockout/wiki/Bindings---class
      ko.bindingHandlers['class'] = {
         'update': function (element, valueAccessor) {
            if (element['__ko__previousClassValue__']) {
               $(element).removeClass(element['__ko__previousClassValue__']);
            }
            var value = ko.utils.unwrapObservable(valueAccessor());
            $(element).addClass(value);
            element['__ko__previousClassValue__'] = value;
         }
      };
   };

   ko.bindingHandlers.IsDisabled = {
      update: function (element, valueAccessor) {
         var value, $element;
         value = ko.utils.unwrapObservable(valueAccessor());
         ko.bindingHandlers.css.update(element, function () { return { disabled: value }; });
         ko.bindingHandlers.disable.update(element, valueAccessor);
         $element = $(element);
         $element.prop("disabled", value);
      }
   };

   ko.bindingHandlers.IsVisible = {
      update: function (element, valueAccessor) {
         var value = ko.utils.unwrapObservable(valueAccessor());
         if (value) {
            $(element).show();
         } else {
            $(element).hide();
         }
      }
   };

   ko.bindingHandlers.deferBindings = {
      init: function () {
         return { 'controlsDescendantBindings': true };
      }
   };

   ko.bindingHandlers.singleChosen = {

      init: function (element) {
         // This will be called when the binding is first applied to an element
         // Set up any initial state, event handlers, etc. here
         $(element).chosen();

         //ko.utils.domNodeDisposal.addDisposeCallback(element, function () { });

      },
      update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
         // This will be called once when the binding is first applied to an element,
         // and again whenever the associated observable changes value.
         // Update the DOM element based on the supplied values here.
         var value = ko.utils.unwrapObservable(valueAccessor());

         ko.bindingHandlers.options.update(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);

         setTimeout(function () {
            $(element).trigger("liszt:updated");
         }, 0);

      }
   };

   ko.bindingHandlers.autoNumeric = {
      init: function (el, valueAccessor, bindingsAccessor) {
         var $el, updateModelValue, bindings, settings, value;
         $el = $(el);
         bindings = bindingsAccessor();
         settings = bindings.settings;
         value = valueAccessor();

         updateModelValue = function () {
            value(getElementValue($el));
         };

         $el.autoNumeric(settings);
         try {
            $el.autoNumeric('set', getModelValue(value));
         }
         catch (e) {
            // The autoNumeric set method throws an exception when the value is outside the vMin or vMax settings, stopping execution for the rest of the page.
            // Example: When loading an existing life insured with a monthly salary of 2,200,000,00.00, rather don't set the value, than giving a broken screen to the user.
            //console.log('Exception occurred with setting an autonumeric value. /nError: ' + e);
         }

         if (settings.updateOnKeyUp) {
            $el.keyup(updateModelValue);
         }
         $el.change(updateModelValue);
      },
      update: function (el, valueAccessor) {
         var $el, newValue, elementValue, valueHasChanged;
         $el = $(el);
         newValue = getModelValue(valueAccessor());
         elementValue = getElementValue($el);
         valueHasChanged = (newValue != elementValue);

         if ((newValue === 0) && (elementValue !== 0) && (elementValue !== "0")) {
            valueHasChanged = true;
         }

         if (valueHasChanged) {
            try {
               $el.autoNumeric('set', newValue);
            }
            catch (e) {
               // The autoNumeric set method throws an exception when the value is outside the vMin or vMax settings, stopping execution for the rest of the page.
               // Example: When loading an existing life insured with a monthly salary of 2,200,000,00.00, rather don't set the value, than giving a broken screen to the user.
               //console.log('Exception occurred with setting an autonumeric value. /nError: ' + e);
            }
            setTimeout(function () { $el.change(); }, 0);
         }
      }
   };

   ko.bindingHandlers.datepicker = {
      init: function(element, valueAccessor) {
         $(element).datepicker({
            showOn: 'button',
            buttonText:'',
            buttonImage: datePickerUrl,
            buttonImageOnly: true,
            changeMonth: true,
            showOtherMonths: true,
            changeYear: true,
            showButtonPanel: true,
            dateFormat: 'dd/mm/yy',
            yearRange: "1900:+1"
         }).setMask('39/19/9999');

         $(element).after('<span class="ddmmyy">ddmmccyy&nbsp;</span>');

         $(element).on('change', function() {
            // UI element changed, validate input before updating Knockout viewModel.
            var newValue, existingValue, result, value, $element;

            value = valueAccessor();
            $element = $(element);
            newValue = $element.val();
            existingValue = ko.unwrap(value);
            result = datepickerValidation(newValue, existingValue);

            if (result === null) {
               return;
            }

            if (result === true) {
               // Date valid. Update viewModel/data.
               value(newValue);
            } else {
               // Date invalid. Reset the UI element.
               $element.datepicker('setDate', existingValue);
            }
         });
      },
      // Knockout viewModel changed, validate input before updating UI element.
      update: function(element, valueAccessor) {
         var newValue, elementValue, result, value, $element;

         value = valueAccessor();
         newValue = ko.unwrap(value());
         $element = $(element);
         elementValue = $element.val();
         result = datepickerValidation(newValue, elementValue);

         if (result === null) {
            return;
         }

         if (result === true) {
            // Valid date, update UI element.
            $element.datepicker('setDate', newValue);
         } else {
            // Invalid date, revert viewModel/data.
            value(elementValue);
         }
      }
   };

   ko.bindingHandlers.maxLength = {
      update: function(element, valueAccessor, allBindings) {
         if (allBindings().value()) {
            allBindings()
               .value(allBindings().value().substr(0, valueAccessor()));
         }
      }
   };

   ko.bindingHandlers.numeric = {
    init: function (element, valueAccessor) {
        var value = valueAccessor();
        element.value = value();
        $(element).on("keydown", function (event) {
            // Allow: backspace, delete, tab, escape, and enter
            if (event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 ||
                // Allow: Ctrl+A
                (event.keyCode == 65 && event.ctrlKey === true) ||
                // Allow: . ,
                (event.keyCode == 188 || event.keyCode == 190 || event.keyCode == 110) ||
                // Allow: home, end, left, right
                (event.keyCode >= 35 && event.keyCode <= 39)) {
                // let it happen, don't do anything
                return;
            }
            else {
                // Ensure that it is a number and stop the keypress
                if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
                    event.preventDefault();
                }
            }
        });
        element.onchange = function () {
            var strValue = this.value;
            var numValue = Number(strValue);
            numValue = isNaN(numValue) ? 0 : numValue;
            this.value = numValue;
            value(numValue.toString());
        };
       },
      update: function(element, valueAccessor, allBindings) {
           var value = ko.utils.unwrapObservable(valueAccessor());
           $(element).val(value);
      }
   };

   ko.bindingHandlers.instantValue = {
    init: function (element, valueAccessor, allBindings) {
        var newAllBindings = function(){
            // for backwards compatibility w/ knockout  < 3.0
            return ko.utils.extend(allBindings(), { valueUpdate: 'afterkeydown' });
        };
        newAllBindings.get = function(a){
            return a === 'valueupdate' ? 'afterkeydown' : allBindings.get(a);
        };
        newAllBindings.has = function(a){
            return a === 'valueupdate' || allBindings.has(a);
        };
        ko.bindingHandlers.value.init(element, valueAccessor, newAllBindings);
    },
    update: ko.bindingHandlers.value.update
};

   ko.bindingHandlers.masked = {
       init: function(element, valueAccessor, allBindingsAccessor) {
           var mask = allBindingsAccessor().mask || {};
           $(element).mask(mask);
           ko.utils.registerEventHandler(element, 'focusout', function() {
               var observable = valueAccessor();
               observable($(element).val());
           });
       },
       update: function (element, valueAccessor) {
           var value = ko.utils.unwrapObservable(valueAccessor());
           $(element).val(value);
       }
   };

  ko.extenders.number = function(target, message) {
      var msg = message || "Value must be a number";

      // Set a "sub-observable" on the existing observable
      target.error = ko.observable();

      function validate(val) {
          var hasError = isNaN(parseInt(val, 10));
          target.error(hasError ? msg : null);
      }

      validate(target());
      target.subscribe(validate);

      // Allow chaining
      return target;
  };

   initializeKnockout();
});
