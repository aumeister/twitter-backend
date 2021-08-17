const mongoose = require("mongoose");

const Message = new mongoose.Schema(
	{
		coversationId: {
			type: String,
		},
		sender: {
			type: String,
		},
		text: {
			type: String,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Message", Message);
