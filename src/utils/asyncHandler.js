const asyncHandler = (requestHandler) => {
    return async (req, res, next) => {
        Promise
            .resolve(requestHandler(req,res,next))
            .catch((err) => next(err));
 } 
}

export { asyncHandler };

// way to define asyncHandeler in following three lines
//const asyncHandler = () => { }
//const asyncHandler1 = (fn) => () => { }
//const asyncHandler = (fn) => async () => { }


// try catch method for asyncHandler 

/* const asyncHandler = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next) 
    } catch (err) {
        res.status(err.code || 500).json({
            success: false,     
            message: err.message,
        })
    }
 }
 */    

    

