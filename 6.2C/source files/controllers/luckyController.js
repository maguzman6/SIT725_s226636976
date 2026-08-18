// Import the service
const luckyService = require('../services/luckyService');

// Controller uses the service to get data
exports.getLuckyNumber = (req, res) => {
  const { number } = req.query;
  const luckyNumber = luckyService.getLuckyNumber(number);
  res.json({
    status: 200,
    data: { luckyNumber },
    message: 'Lucky number retrieved'
  });
};