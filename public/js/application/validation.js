var Validation = function () {
   'use strict';

   var getPropertyState, isApplicable, isRequired, isReadOnly, isVisible;

   getPropertyState = function (fieldStates, fieldName) {
      var property;
      if (fieldStates && fieldName) {
         for (property in fieldStates) {
            if (fieldStates.hasOwnProperty(property) && property === fieldName) {
               return fieldStates[property];
            }
         }
      }

      return {
         IsApplicable: false,
         IsReadOnly: false,
         IsRequired: false,
         IsVisible: false
      };
   };

   isApplicable = function (fieldStates, fieldName) {
      var propertyState = getPropertyState(fieldStates, fieldName).IsApplicable;
      if (typeof propertyState === 'function') {
         return propertyState();
      }
      return propertyState;
   };

   isRequired = function (fieldStates, fieldName) {
      var propertyState = getPropertyState(fieldStates, fieldName).IsRequired;
      if (typeof propertyState === 'function') {
         return propertyState();
      }
      return propertyState;
   };

   isReadOnly = function (fieldStates, fieldName) {
      var propertyState = getPropertyState(fieldStates, fieldName).IsReadOnly;
      if (typeof propertyState === 'function') {
         return propertyState();
      }
      return propertyState;
   };

   isVisible = function (fieldStates, fieldName) {
      var propertyState = getPropertyState(fieldStates, fieldName).IsVisible;
      if (typeof propertyState === 'function') {
         return propertyState();
      }
      return propertyState;
   };

   return {
      getPropertyState: getPropertyState,
      isApplicable: isApplicable,
      isRequired: isRequired,
      isReadOnly: isReadOnly,
      isVisible: isVisible
   };
};
