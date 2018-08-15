const httpProxy = require('http-proxy');
const HttpProxyRules = require('http-proxy-rules');
const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
app.use(cors())
app.use(morgan(':method :url :status'))
var proxyRules = new HttpProxyRules({
	rules: {
		'/mvg/(.*)': 'https://www.mvg.de/$1',
		'/mvv/(.*)': 'https://efa.mvv-muenchen.de/$1'
	}
})
var proxy = httpProxy.createProxy({
	changeOrigin: true
})
proxy.on('proxyRes', function (proxyRes, req, res) {
	  res.header('X-Content-Type-Options','') // dodges CORB
	  
});
proxy.on('error', function(e) {
  console.log('error')
	console.log(e)
});
app.get('/*',(req,res) => {

	var target = proxyRules.match(req);
	if (target) {
		return proxy.web(req, res, {
		target: target
		});
	}
	else {
		res.status(500).json({'error':'url does not match any rules'})
	}
})

app.listen(9898)
