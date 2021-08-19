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
		// check if user is already in a group
		const user = await Conversation.find({
			groupName: req.body.groupName,
			members: {
				$in: [req.params.userId]
			}
		})
		if (user) res.status(200).json('User already in a group');
		// add a user
		const updatedGroup = await Conversation.findOneAndUpdate(
			{
				groupName: req.body.groupName,
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
