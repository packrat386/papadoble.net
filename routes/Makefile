OPS =  '-H "Content-Type:application/json" localhost:3000/api'
POST = 'curl -XPOST -d'
GET = 'curl -XGET -d'

default:
	$(GET) $(OPS)
	$(GET) '{"core": false}' $(OPS)
