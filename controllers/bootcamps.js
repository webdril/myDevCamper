const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');
const Bootcamp = require('../models/Bootcamp');


// @desc  Get all bootcamps
// @route Get /api/v1/bootcamps
// @access Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
        let query;
    
        // Copy req.query
        const reqQuery = { ...req.query };
        // Fields to exclude
        const removeFields = ['select'];
        // Loop over removeFields and delete them from reqQuery
        removeFields.forEach(param => delete reqQuery[param]);
        console.log(reqQuery);

        // Create query string
        let queryStr = JSON.stringify(reqQuery);
        // Create operators ($gt, $gte, etc)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
        // Finding resource
        query = Bootcamp.find(JSON.parse(queryStr));
        // Executing query
        const bootcamps = await query /*Bootcamp.find();*/

        res
            .status(200)
            .json({ success: true, count: bootcamps.length, data: bootcamps });
        
    
});

// @desc  Get single bootcamp
// @route Get /api/v1/bootcamps/:id
// @access Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
    
        const bootcamp = await Bootcamp.findById(req.params.id);

        if (!bootcamp) {
           return  next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
        }

        res
            .status(200)
            .json({ success: true, data: bootcamp });
        
   
    
});


// @desc  Create new bootcamp
// @route POST /api/v1/bootcamps
// @access Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
    

    const bootcamp = await Bootcamp.create(req.body);
    res
        .status(201)
        .json({
        success: true,
        data: bootcamp
    });

    
    
});

// @desc  Update bootcamp
// @route Put /api/v1/bootcamps/:id
// @access Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
   
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    
    if (!bootcamp) {
        return next(
            new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }
    
    res
        .status(200)
        .json({ success: true, data: bootcamp });
    
    
});


// @desc  Delete new bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @access Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    
        if (!bootcamp) {
            return  next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
        }
    
        res
            .status(200)
            .json({ success: true, data: {} });
    
});


// @desc  Get Bootcamps within a radius
// @route GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    
    const { zipcode, distance } = req.params;
    //Get lat/lang from geocode
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    // calc radius using radians
    // divide dist by radius of earth
    // Eart Radius = 3,963 miles / 6,378 km
    const radius = distance / 3963;

    const bootcamps = await Bootcamp.find({
        location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    });



    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    });

});