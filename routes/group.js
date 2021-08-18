const router = require("express").Router();
const { find } = require("../models/Conversation");
const Conversation = require("../models/Conversation");
const User = require("../models/User");

// new Group
router.post("/", async (req, res) => {
	try {
		const newGroup = new Conversation({
			members: [req.body.senderId],
			isGroup: true,
			groupName: req.body.groupName,
		});
		const savedGroup = await newGroup.save();
		res.status(200).json(savedGroup);
	} catch (err) {
		res.status(500).json(err);
	}
});

// get user Group
router.get("/:userId", async (req, res) => {
	try {
		const conversations = await Conversation.find({
			members: { $in: [req.params.userId] },
			isGroup: true,
		});
		res.status(200).json(conversations);
	} catch (err) {
		res.status(500).json(err);
	}
});
// add user to Group
router.post("/add/:userId", async (req, res) => {
	try {
		const user = await Conversation.find({
			members: { $in: [req.params.userId] },
		});
		if (user) return res.status(200).json("User is already in a chat room");
		const group = await Conversation.findOne({ groupName: req.body.groupName });
		const updatedGroup = await Conversation.findByIdAndUpdate(
			{
				_id: group._id,
			},
			{
				$push: { members: req.params.userId },
			}
		);
		res.status(200).json(updatedGroup);
	} catch (err) {
		res.status(500).json(err);
	}
});
module.exports = router;
