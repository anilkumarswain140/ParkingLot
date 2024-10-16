const errorHandler = (err, res) => {
    console.error(err?.stack);
    res.status(500).json({ message: 'Internal Server Error' });
  };
  
  module.exports = { errorHandler };
  