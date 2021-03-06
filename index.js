const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const imageRoute = require("./routes/images");
const conversationRoute = require("./routes/coversations");
const messagesRoute = require("./routes/messages");
const groupRoute = require("./routes/group");
const cors = require("cors");

dotenv.config();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

mongoose.connect(
	process.env.MONGO_URL,
	{ useNewUrlParser: true, useUnifiedTopology: true },
	() => {
		console.log("Connected to MongoDB");
	}
);

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(cors());

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/images", imageRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/group", groupRoute);
app.use("/api/messages", messagesRoute);
// hardcode fix
app.use("/api/profile/images", imageRoute);
app.use("/api/profile/users", userRoute);

app.listen(8080, () => {
	console.log("Backend server is running!");
});
