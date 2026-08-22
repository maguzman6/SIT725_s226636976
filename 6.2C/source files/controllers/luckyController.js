// Import the service
const luckyService = require('../services/luckyService');

// Controller uses the service to get data
exports.getLuckyNumber = (req, res) => {
  const { number } = req.query;

  // If number is missing or not a valid number, return 400 Bad Request
  if (number === undefined || number === '' || isNaN(number)) {
    return res.status(400).json({
      data: null,
      message: 'Invalid input: number parameter is required and must be numeric'
    });
  } else {
    const luckyNumber = luckyService.getLuckyNumber(Number(number));
    res.status(200).json({
      data: { luckyNumber },
      message: 'Lucky number retrieved'
    });
  }
};