OPS =  -H "Content-Type:application/json" http://papadoble.herokuapp.com/api
POST = curl -XPOST -d
GET = curl -XGET -d

default:
	$(GET) '' $(OPS)
	$(GET) '{"core": false}' $(OPS)
	$(GET) '{"ingredient": "Lime Juice"}' $(OPS)
	$(GET) '{"book": "For whOm tHe bELL TOLLS"}' $(OPS)
	$(GET) '{"id": "this aint gonna work"}' $(OPS)
