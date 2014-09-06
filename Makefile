OPS =  -H "Content-Type:application/json" http://papadoble.herokuapp.com/api
POST = curl -XPOST -d
GET = curl -XGET -d

default:
	$(GET) '' $(OPS)
	@echo "\n-----"
	$(GET) '{"core": false}' $(OPS)
	@echo "\n-----"
	$(GET) '{"ingredient": "Lime Juice"}' $(OPS)
	@echo "\n-----"
	$(GET) '{"book": "For whOm tHe bELL TOLLS"}' $(OPS)
	@echo "\n-----"
	$(GET) '{"id": "this aint gonna work"}' $(OPS)
	@echo "\n-----"
	$(POST) '{"name":"Bloody Mary","ingredients":{"vodka":"1.5 oz","tomato juice":"3 oz","lemon juice":".5 oz","woscestershire sauce":"dash","tabasco":"dash","salt and pepper":"dash"},"instructions":"Add the Worcestershire Sauce, Tabasco, and salt and pepper to a large glass, then pour in the liquid ingredients with ice. Garnish with a lemon wedge and/or a celery stalk","source":"Wikipedia","book":"For Whom the Bell Tolls","_id":"540b22a7a586250b0077c3f0"}' $(OPS)
	@echo "\n-----"
	$(POST) '' $(OPS)
	@echo "\n-----"
	$(POST) '{"bull": "shit"}' $(OPS)
	@echo "\n-----"
