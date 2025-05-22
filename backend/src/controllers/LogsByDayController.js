const findLogsByDay = require('../utils/LogsByDay');

exports.getLogsByDay = async (req, res) => {
  try {
    const userId = req.user._id;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }

    const logs = await findLogsByDay(userId, date);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};