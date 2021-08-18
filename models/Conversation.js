const mongoose = require("mongoose");

const Conversation = new mongoose.Schema(
	{
		members: {
			type: Array,
		},
		isGroup: {
			type: Boolean,
			default: false,
		},
		groupName: {
			type: String,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Conversation", Conversation);
