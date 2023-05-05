const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    res.status(error.code || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export default asyncHandler;

// from the function `fn` the values req, res and next will be extracted
// next is a middleware flag
// middleware - software that is stopping you in between. it acts as a bridge between an operating system or database and applications
// req is coming fron the frontend
// res is something that is server is sending to the frontend
