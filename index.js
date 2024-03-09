import dotenv from "dotenv";
import express from "express";
import Framework from "webex-node-bot-framework";

dotenv.config();
const app = express();
app.use(express.json());

const config = {
  // webhookUrl:
  //   "https://3c9a-2405-201-d029-b175-6166-a1aa-5b85-f0aa.ngrok-free.app/webhook",

  token: process.env.WEBEX_TOKEN,
  port: process.env.WEBEX_PORT,
};

const bot = new Framework(config);

bot.start();

bot.on("initialized", () => {
  console.log("Bot is up and running...");
});

bot.on("spawn", (bot, id, addedBy) => {
  if (!addedBy) {
    // don't say anything here or your bot's spaces will get
    // spammed every time your server is restarted
    bot.debug(
      `bot created an object for an existing bot in a space called: ${bot.room.title}`
    );
  } else {
    bot.say(
      "Hi there, you can say hello to me.  Don't forget you need to mention me in a group space!"
    );
  }
});

// app.post("/webhook", webhook(bot));

bot.hears("webhook", (bot, trigger) => {
  console.log("webhook event");
  bot.say("webhook event");
});
bot.hears("hello", (bot, trigger) => {
  // send a adaptive card with options to select like show report, show users, show logs
  console.log("hello event");
  const card = {
    type: "AdaptiveCard",
    body: [
      {
        type: "ActionSet",
        actions: [
          {
            type: "Action.Submit",
            title: "Show User Activity Report",
            data: { type: "report" },
          },
          {
            type: "Action.Submit",
            title: "Show logged in users",
            data: { type: "loggedin" },
          },
        ],
      },
    ],
    $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
    version: "1.3",
  };
  bot.sendCard(card, "Couldn't fetch the report, please try again later");
});

bot.hears("report", (bot, trigger) => {
  console.log("report event");
  const fallbackText = "Couldn't fetch the report, please try again later";
  bot.sendCard(card, fallbackText);
});

// app.post("/webhook", (req, res) => {
//   fetch(`https://webexapis.com/v1/attachment/actions/${req.body.data.id}`, {
//     method: "GET",
//     headers: {
//       Authorization: `Bearer ${process.env.WEBEX_TOKEN}`,
//     },
//   })
//     .then((res) => res.json())
//     .then((data) => {
//       console.log(data);
//     });
// });
app.listen(3000, () => console.log("Webhook server is listening on port 3000"));
