const express = require('express')
const PythonShell = require('python-shell')
const bodyParser = require('body-parser')
const Minio = require('minio')
const multer  = require('multer')
const upload = multer({ dest: './.uploads/' })
const app = express()

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

var minioClient = new Minio.Client({
	endPoint: process.env.MINIO_ENDPOINT,
	secure: true,
	accessKey: process.env.MINIO_ACCESS_KEY,
	secretKey: process.env.MINIO_SECRET_KEY
});

/**
 * source_img: the image input file - Multipart File
 * style: name if the style - String
 */
app.post('/prisma', upload.single('source_img'), function (req, res, next) {
	var output_file = './shared/output/'+req.file.filename+'_converted.jpg'
	var style_obj = {'cosa': 'cosa.jpg', 'picasso': 'picasso.jpg', 'pop': 'pop.jpg', 'prisma': 'prisma.jpg', 'scream': 'scream.jpg', 'starry': 'starry.jpg', 'surfing': 'surfing.jpg'}
	if(!style_obj.hasOwnProperty(req.body.style)) {
		return
    }
	var style_file = './shared/styles/'+style_obj[req.body.style]
	var input_file = req.file.path

	var options = {
	  scriptPath: '/home/app/neural-style/',
	  args: ['--content', input_file, '--styles', style_file, '--output', output_file]
	};

	PythonShell.run('neural_style.py', options, function (err, results) {
		// upload output file
		minioClient.makeBucket('neural-style', 'us-east-1', function(err) {
			if (err.code != "BucketAlreadyOwnedByYou") {
				return console.log(err)
			}
			minioClient.fPutObject('neural-style', req.file.filename+'.jpg', req.file.path, 'application/octet-stream', function(err, etag) {
			  if (err) return console.log(err)
			  console.log(etag)
			});
		});
	});
})

app.listen(8080,function(){
  console.log('Example app listening on port 8080!')
})