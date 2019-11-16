var express = require('express');
var app = express();
var multer = require('multer')
var cors = require('cors');

app.use(cors())

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, 'public')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname )
  }
})

var upload = multer({ storage: storage }).single('file')

app.post('/upload',function(req, res) {     
    upload(req, res, function (err) {
           if (err instanceof multer.MulterError) {
               return res.status(500).json(err)
           } else if (err) {
               return res.status(500).json(err)
           }
           console.log(req.file);
           pythonCode(req, res)

      // return res.status(200).send(req.file)

    })

});

const pythonCode = function(req, res) {
  console.log("called")
	// Use child_process.spawn method from 
	// child_process module and assign it 
	// to variable spawn 
	var spawn = require("child_process").spawn; 
	
	// Parameters passed in spawn - 
	// 1. type_of_script 
	// 2. list containing Path of the script 
	// and arguments for the script 
	
	// E.g : http://localhost:3000/name?firstname=Mike&lastname=Will 
  // so, first name = Mike and last name = Will
  console.log(req.file); 
	var process = spawn('python',["./shape.py", req.file.filename] ); 
  console.log("python called")
	// Takes stdout data from script which executed 
	// with arguments and send this data to res object 
	process.stdout.on('data', function(data) {
	const result = JSON.parse(data.toString().replace(/'/g, '"'));
	const qrcode = result.map(r => r.res).join('');
	console.log("qrcode",qrcode);
		res.send(qrcode); 
	} ) 

};

app.listen(8000, function() {

    console.log('App running on port 8000');

});