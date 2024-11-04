import multer from "multer";  // multer alternate is express-fileupload 

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/temp')
    },
    filename: function (req, file, cb) {
      // making filename unique
      //const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        //cb(null, file.fieldname + '-' + uniqueSuffix)
       console.log(file) 
      cb(null, file.originalname)
    }
  })
//const upload = multer({ storage: storage })
export const upload = multer({storage, })