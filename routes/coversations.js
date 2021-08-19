const router = require("express").Router();
const Conversation = require("../models/Conversation");

// new Conversation
router.post("/", async (req, res) => {
	const newConversation = new Conversation({
		members: [req.body.senderId, req.body.recieverId],
	});
	try {
		const savedConversation = await newConversation.save();
		res.status(200).json(savedConversation);
	} catch (err) {
		res.status(500).json(err);
	}
});

// get user Conversation
router.get("/:userId", async (req, res) => {
	try {
		const conversations = await Conversation.find({
			members: { $in: [req.params.userId] },
			isGroup: false
		});
		res.status(200).json(conversations);
	} catch (err) {
		res.status(500).json(err);
	}
});
module.exports = router;
