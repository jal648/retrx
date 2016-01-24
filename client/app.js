APP = (function() {
exports = {};

exports.main = function(container) {
	var socket = io.connect();

	ko.bindingHandlers.date = {
	    update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            element.innerHTML = moment(ko.unwrap(valueAccessor())).format('H:mm:ss')
	    }
	};

    ko.bindingHandlers.gbp = {
        update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            var val = ko.unwrap(valueAccessor())
            if (val < 0) {
                element.className += ' neg'
            }
            element.innerHTML = "£&nbsp;" + numeral(val/100.0).format('0.00')
        }
    };

	var ViewModel = function() {
		var self = this;
		self.transactions = ko.observableArray([])
        self.balance = ko.computed(function() {
            return self.transactions().reduce(
                function(acc, trx) { return acc+trx.amount},
                14500
            )
        });
	};
	vm = new ViewModel();
    window._vm = vm;
	ko.applyBindings(vm, container);
	socket.on("connection", function(data) {
	  console.info("Connection Established")
	})
	socket.on("transactions/added", function(data) {
      vm.transactions.unshift(data);
	});
	socket.on("transactions/init", function(data) {
	  ko.utils.arrayPushAll(vm.transactions.reverse(), data)
	});


}

return exports;
})();