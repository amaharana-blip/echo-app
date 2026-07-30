const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

// /feedback slash command — opens a quick modal
app.command("/feedback", async ({ ack, body, client }) => {
  await ack();
  await client.views.open({
    trigger_id: body.trigger_id,
    view: {
      type: "modal",
      callback_id: "feedback_modal",
      title: { type: "plain_text", text: "Give Feedback" },
      submit: { type: "plain_text", text: "Send" },
      close: { type: "plain_text", text: "Cancel" },
      blocks: [
        {
          type: "input",
          block_id: "receiver",
          label: { type: "plain_text", text: "To" },
          element: {
            type: "users_select",
            action_id: "receiver_input",
            placeholder: { type: "plain_text", text: "Select a team member" },
          },
        },
        {
          type: "input",
          block_id: "category",
          label: { type: "plain_text", text: "Category" },
          element: {
            type: "static_select",
            action_id: "category_input",
            options: [
              { text: { type: "plain_text", text: "General" }, value: "general" },
              { text: { type: "plain_text", text: "Recognition" }, value: "recognition" },
              { text: { type: "plain_text", text: "Improvement" }, value: "improvement" },
              { text: { type: "plain_text", text: "Collaboration" }, value: "collaboration" },
            ],
          },
        },
        {
          type: "input",
          block_id: "message",
          label: { type: "plain_text", text: "Message" },
          element: {
            type: "plain_text_input",
            action_id: "message_input",
            multiline: true,
            placeholder: { type: "plain_text", text: "Write your feedback..." },
          },
        },
        {
          type: "input",
          block_id: "anonymous",
          optional: true,
          label: { type: "plain_text", text: "Options" },
          element: {
            type: "checkboxes",
            action_id: "anonymous_input",
            options: [
              {
                text: { type: "plain_text", text: "Send anonymously" },
                value: "anonymous",
              },
            ],
          },
        },
      ],
    },
  });
});

// Handle the modal submission
app.view("feedback_modal", async ({ ack, view, client, body }) => {
  await ack();

  const values = view.state.values;
  const receiverSlackId = values.receiver.receiver_input.selected_user;
  const category = values.category.category_input.selected_option?.value ?? "general";
  const message = values.message.message_input.value;
  const isAnonymous = (values.anonymous?.anonymous_input?.selected_options ?? []).some(
    (o) => o.value === "anonymous"
  );

  // Post to the web app API
  try {
    const res = await fetch(`${APP_URL}/api/slack/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        giverSlackId: body.user.id,
        receiverSlackId,
        message,
        category,
        isAnonymous,
      }),
    });

    if (res.ok) {
      await client.chat.postMessage({
        channel: body.user.id,
        text: `✓ Your feedback has been sent${isAnonymous ? " anonymously" : ""}.`,
      });
    }
  } catch (err) {
    console.error("Failed to submit feedback:", err);
  }
});

// /pulse slash command — nudge to fill survey
app.command("/pulse", async ({ ack, body, client }) => {
  await ack();
  await client.chat.postMessage({
    channel: body.user_id,
    text: "Time to check in! Fill out this week's pulse survey:",
    blocks: [
      {
        type: "section",
        text: { type: "mrkdwn", text: "*Weekly Pulse Check* — It takes less than 2 minutes." },
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: { type: "plain_text", text: "Open Survey" },
            url: `${APP_URL}/dashboard`,
            style: "primary",
          },
        ],
      },
    ],
  });
});

(async () => {
  await app.start();
  console.log("Pulse Slack bot is running");
})();
