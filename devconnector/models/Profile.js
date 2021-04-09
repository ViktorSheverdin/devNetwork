const mongoose = require('mongoose');
const ProfileSchema = new mongoose.Schema({
  name: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
});
