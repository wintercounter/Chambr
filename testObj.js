var testobj = {
	"name": "ChambrClient->Expose",
	"data": {
		"modelName": "Test",
		"modelApi": [{
			"name": "total",
			"type": "var",
			"decorators": {
				"default": -1
			}
		}, {
			"name": "create",
			"type": "fn",
			"decorators": {
				"peel": {
					"list": ["item->value"],
					"fn": "function () {\n\t            for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {\n\t                args[_key3] = arguments[_key3];\n\t            }\n\n\t            var finalArgs = args.slice();\n\t            peelList.forEach(function (peel, i) {\n\t                var peelArgIndex = i;\n\t                if (peel.indexOf(':') + 1) {\n\t                    var tmp = peel.split(':');\n\t                    peelArgIndex = parseInt(tmp[0], 10);\n\t                    peel = tmp[1];\n\t                }\n\t                if (_typeof(args[peelArgIndex]) === 'object') {\n\t                    try {\n\t                        (function () {\n\t                            var r = args[peelArgIndex];\n\t                            var str = peel.split('->');\n\t                            str.forEach(function (x) {\n\t                                return r = r[x];\n\t                            });\n\t                            if (r === undefined) throw 'e';\n\t                            finalArgs[i] = r;\n\t                        })();\n\t                    } catch (e) {}\n\t                }\n\t            });\n\t            finalArgs.forEach(function (v, i) {\n\t                return args[i] = v;\n\t            });\n\t            return old.call.apply(old, [this].concat(args));\n\t        }"
				}
			}
		}, {
			"name": "read",
			"type": "fn"
		}, {
			"name": "update",
			"type": "fn"
		}, {
			"name": "delete",
			"type": "fn"
		}, {
			"name": "triggerOnTest",
			"type": "fn"
		}, {
			"name": "onRemoteUpdated",
			"type": "fn"
		}]
	}
}


var outgoing = {
	"name": "ChambrWorker->Test->update",
	"data": {
		"argList": [0, "notOne"],
		"requestId": 4
	}
}

var outgoingDone = {
	"name": "ChambrClient->Test->create",
	"data": {
		"responseId": 8,
		"responseData": 2,
		"responseSoft": false,
		"responseState": "resolve",
		"modelData": ["two", "three", "four"],
		"modelExport": {"total": 3}
	},
	"state": "resolve"
}