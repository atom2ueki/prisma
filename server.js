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
	var output_file_path = './shared/output/'
	var output_file_name = req.file.filename+'.jpg'
	var style_obj = {'cosa': 'cosa.jpg', 'picasso': 'picasso.jpg', 'pop': 'pop.jpg', 'prisma': 'prisma.jpg', 'scream': 'scream.jpg', 'starry': 'starry.jpg', 'wave': 'wave.jpg'}
	if(!style_obj.hasOwnProperty(req.body.style)) {
		res.json({ errors: ['style cannot found!'] });
    }
	var style_file = './shared/styles/'+style_obj[req.body.style]
	var input_file = req.file.path

	var options = {
	  scriptPath: '/home/app/neural-style/',
	  args: ['--content', input_file, '--styles', style_file, '--output', output_file_path + output_file_name]
	};

	PythonShell.run('neural_style.py', options, function (err, results) {
// 		if (err != null) {
// 			res.json({ errors: ['neural_style hit errors!'] });
// 		}
		let bucket_name = 'neural-style'
		minioClient.makeBucket(bucket_name, 'us-east-1', function(err) {
			if (err.code != "BucketAlreadyOwnedByYou") {
				res.json({ errors: err });
			}
			minioClient.fPutObject('neural-style', 'neural-'+output_file_name, output_file_path + output_file_name, 'image/jpeg', function(err, etag) {
			  if (err!=null) {
			 	res.json({ errors: err });
			  }else {
			  	res.json({ errors: null, url: 'https://' + process.env.MINIO_ENDPOINT + '/' + bucket_name + '/neural-' + output_file_name });
			  }
			});
		});
	});
})

app.listen(8080,function(){
  console.log('Example app listening on port 8080!')
})
