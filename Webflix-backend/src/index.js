
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const multer=require('multer');
const path = require('path');
const fs = require('fs');
const { corsOptions, authenticateToken,secureHeaders,logRequests } = require('./middlewares/middlewares');


const app = express();
const port = process.env.PORT||3000;
const uploadDir = './public/img/users';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({ storage: storage })
const popularMoviesRoutes=require('./routes/popularMovies');
const imagePathsMovieRoutes=require('./routes/imagePathsMovie');
const  findMediaTypeByIdRoutes = require('./routes/findMediaTypeById');
const imagePathsTVseriesRoutes=require('./routes/imagePathsTVseries');
const searchMoviesWithGenresRoutes = require('./routes/searchMoviesWithGenres');
const searchTVseriesWithGenresRoutes = require('./routes/searchTVSeriesWithGenres');
const searchMoviesRoutes=require('./routes/searchMovies');
const searchTVSeriesRoutes=require('./routes/searchTVSeries');
const popularTVseriesRoutes = require('./routes/popularTVSeries');
const trendingRoutes = require('./routes/trending');
const signupRoutes=require('./routes/signup')
const uploadAvatarRoutes=require('./routes/uploadAvatar')
const loginRoutes=require('./routes/login')
const getprofilepicRoutes=require('./routes/getProfilePic')
const bookmarkRoutes=require('./routes/bookmark')
const verifytokenRoutes=require('./routes/verifytoken')
const fetchbookmarksRoutes=require('./routes/fetchbookmarks')
const castandwebsiteRoutes=require('./routes/castandwebsite')
const trailerRoutes=require('./routes/trailer')
//middlewares
app.use(express.json());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(secureHeaders);
app.use(logRequests);
  
//Routes
app.use('/api/popularMovies', popularMoviesRoutes);
app.use('/api/imagePathsMovie',imagePathsMovieRoutes);
app.use('/api/findMediaTypeById',findMediaTypeByIdRoutes);
app.use('/api/imagePathsTVseries',imagePathsTVseriesRoutes);
app.use('/api/searchMoviesWithGenres',searchMoviesWithGenresRoutes);
app.use('/api/searchTVSeriesWithGenres',searchTVseriesWithGenresRoutes);
app.use('/api/searchMovies',searchMoviesRoutes);
app.use('/api/searchTVSeries',searchTVSeriesRoutes);
app.use('/api/popularTVSeries',popularTVseriesRoutes);
app.use('/api/trending',trendingRoutes);
app.use('/api/signup',signupRoutes)
app.options('/api/upload-avatar', cors(corsOptions));
app.use('/api/upload-avatar',cors(corsOptions), upload.single('avatar'),authenticateToken, uploadAvatarRoutes)
app.use('/api/login', loginRoutes)
app.use('/api/profilepic',authenticateToken,getprofilepicRoutes)
app.use('/api/bookmark',cors(corsOptions),authenticateToken,bookmarkRoutes)
app.use('/api/verify-token',verifytokenRoutes)
app.use('/api/fetchbookmarks',authenticateToken, fetchbookmarksRoutes)
app.use('/api/castandwbsite',castandwebsiteRoutes)
app.use('/api/trailer', trailerRoutes)

// For local testing

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

module.exports = app;