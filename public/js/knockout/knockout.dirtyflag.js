// By: Hans Fjällemark and John Papa
// https://github.com/CodeSeven/KoLite
//
// Knockout.DirtyFlag
//
// John Papa 
//          http://johnpapa.net
//          http://twitter.com/@john_papa
//
// Depends on scripts:
//          Knockout 
//
//  Notes:
//          Special thanks to Steve Sanderson and Ryan Niemeyer for 
//          their influence and help.
//
//  Usage:      
//          To Setup Tracking, add this tracker property to your viewModel    
//              ===> viewModel.dirtyFlag = new ko.DirtyFlag(viewModel.model);
//
//          Hook these into your view ...
//              Did It Change?          
//              ===> viewModel.dirtyFlag().isDirty();
//
//          Hook this into your view model functions (ex: load, save) ...
//              Resync Changes
//              ===> viewModel.dirtyFlag().reset();
//
//          Optionally, you can pass your own hashFunction for state tracking.
//
////////////////////////////////////////////////////////////////////////////////////////
; (function (ko) {
ko.dirtyFlag = function (root) {
    var result = function () { },
        _initialState = ko.observable(ko.toJSON(root))

    result.isDirty = ko.dependentObservable(function () {
        return _initialState() !== ko.toJSON(root);
    });

    result.reset = function () {
        _initialState(ko.toJSON(root));
    };

    return result;
};

})(ko);