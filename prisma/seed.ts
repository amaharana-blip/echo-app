import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SYSTEM_USER_ID = "system";

async function main() {
  // Ensure a system user exists for seeded surveys
  await prisma.user.upsert({
    where: { id: SYSTEM_USER_ID },
    update: {},
    create: {
      id: SYSTEM_USER_ID,
      auth0Id: "system|seed",
      email: "system@seed.internal",
      name: "System",
      role: "ADMIN",
    },
  });

  // ─── PULSE ───────────────────────────────────────────────────────────────
  await prisma.survey.upsert({
    where: { id: "seed-survey-pulse" },
    update: {},
    create: {
      id: "seed-survey-pulse",
      title: "Pulse Check",
      description: "A quick daily check-in to understand how your team is feeling.",
      module: "PULSE",
      status: "ACTIVE",
      isAnonymous: true,
      recurrence: "DAILY",
      createdById: SYSTEM_USER_ID,
      questions: {
        create: [
          {
            text: "How are you feeling today?",
            type: "EMOJI_MOOD",
            order: 1,
            cards: JSON.stringify([
              { id: "1", label: "Struggling", emoji: "😔" },
              { id: "2", label: "Low", emoji: "😟" },
              { id: "3", label: "Okay", emoji: "😐" },
              { id: "4", label: "Good", emoji: "🙂" },
              { id: "5", label: "Great", emoji: "😊" },
              { id: "6", label: "Thriving", emoji: "🤩" },
            ]),
          },
          {
            text: "What's your energy level right now?",
            type: "CARD_SINGLE",
            order: 2,
            cards: JSON.stringify([
              { id: "1", label: "Energized", emoji: "⚡", color: "emerald" },
              { id: "2", label: "Steady", emoji: "👍", color: "blue" },
              { id: "3", label: "Running low", emoji: "🔋", color: "amber" },
              { id: "4", label: "Burned out", emoji: "💤", color: "red" },
            ]),
          },
          {
            text: "What's on your mind?",
            type: "CARD_MULTI",
            order: 3,
            cards: JSON.stringify([
              { id: "1", label: "Too much work", emoji: "📚" },
              { id: "2", label: "Team dynamics", emoji: "👥" },
              { id: "3", label: "Career growth", emoji: "📈" },
              { id: "4", label: "My manager", emoji: "🧑‍💼" },
              { id: "5", label: "Tools & tech", emoji: "🛠️" },
              { id: "6", label: "All good!", emoji: "✅" },
              { id: "7", label: "Personal wellbeing", emoji: "❤️" },
              { id: "8", label: "Company direction", emoji: "🧭" },
            ]),
          },
        ],
      },
    },
  });

  // ─── BURNOUT ─────────────────────────────────────────────────────────────
  await prisma.survey.upsert({
    where: { id: "seed-survey-burnout" },
    update: {},
    create: {
      id: "seed-survey-burnout",
      title: "Burnout Assessment",
      description: "Understand workload, energy, and retention risk across your team.",
      module: "BURNOUT",
      status: "ACTIVE",
      isAnonymous: true,
      recurrence: "WEEKLY",
      createdById: SYSTEM_USER_ID,
      questions: {
        create: [
          {
            text: "My workload feels...",
            type: "CARD_SINGLE",
            order: 1,
            cards: JSON.stringify([
              { id: "1", label: "Manageable", emoji: "✅", color: "emerald" },
              { id: "2", label: "Busy but okay", emoji: "📊", color: "blue" },
              { id: "3", label: "Heavy", emoji: "⚠️", color: "amber" },
              { id: "4", label: "Overwhelming", emoji: "🔴", color: "red" },
            ]),
          },
          {
            text: "After work I usually feel...",
            type: "CARD_SINGLE",
            order: 2,
            cards: JSON.stringify([
              { id: "1", label: "Refreshed", emoji: "😌", color: "emerald" },
              { id: "2", label: "Neutral", emoji: "😐", color: "blue" },
              { id: "3", label: "Drained", emoji: "😮‍💨", color: "amber" },
              { id: "4", label: "Exhausted", emoji: "😩", color: "red" },
            ]),
          },
          {
            text: "I feel connected to my team",
            type: "CARD_SINGLE",
            order: 3,
            cards: JSON.stringify([
              { id: "1", label: "Always", color: "emerald" },
              { id: "2", label: "Usually", color: "blue" },
              { id: "3", label: "Sometimes", color: "amber" },
              { id: "4", label: "Rarely", color: "red" },
            ]),
          },
          {
            text: "I have clarity on my priorities",
            type: "CARD_SINGLE",
            order: 4,
            cards: JSON.stringify([
              { id: "1", label: "Crystal clear", color: "emerald" },
              { id: "2", label: "Mostly yes", color: "blue" },
              { id: "3", label: "It's blurry", color: "amber" },
              { id: "4", label: "Completely lost", color: "red" },
            ]),
          },
          {
            text: "Honestly, I'm thinking about leaving",
            type: "CARD_SINGLE",
            order: 5,
            cards: JSON.stringify([
              { id: "1", label: "Not at all", color: "emerald" },
              { id: "2", label: "Occasionally", color: "blue" },
              { id: "3", label: "Frequently", color: "amber" },
              { id: "4", label: "Actively looking", color: "red" },
            ]),
          },
        ],
      },
    },
  });

  // ─── MANAGER ─────────────────────────────────────────────────────────────
  const managerCards = JSON.stringify([
    { id: "1", label: "Always", color: "emerald" },
    { id: "2", label: "Usually", color: "blue" },
    { id: "3", label: "Sometimes", color: "amber" },
    { id: "4", label: "Rarely", color: "red" },
  ]);

  await prisma.survey.upsert({
    where: { id: "seed-survey-manager" },
    update: {},
    create: {
      id: "seed-survey-manager",
      title: "Manager Effectiveness",
      description: "Evaluate how well managers are supporting their teams.",
      module: "MANAGER",
      status: "ACTIVE",
      isAnonymous: true,
      recurrence: "MONTHLY",
      createdById: SYSTEM_USER_ID,
      questions: {
        create: [
          {
            text: "My manager gives me clear direction",
            type: "CARD_SINGLE",
            order: 1,
            cards: managerCards,
          },
          {
            text: "I feel supported when I face challenges",
            type: "CARD_SINGLE",
            order: 2,
            cards: managerCards,
          },
          {
            text: "My manager recognizes my contributions",
            type: "CARD_SINGLE",
            order: 3,
            cards: managerCards,
          },
          {
            text: "I can speak openly with my manager",
            type: "CARD_SINGLE",
            order: 4,
            cards: managerCards,
          },
        ],
      },
    },
  });

  // ─── SATISFACTION ─────────────────────────────────────────────────────────
  const satisfactionCards = JSON.stringify([
    { id: "1", label: "Strongly agree", color: "emerald" },
    { id: "2", label: "Agree", color: "blue" },
    { id: "3", label: "Disagree", color: "amber" },
    { id: "4", label: "Strongly disagree", color: "red" },
  ]);

  await prisma.survey.upsert({
    where: { id: "seed-survey-satisfaction" },
    update: {},
    create: {
      id: "seed-survey-satisfaction",
      title: "Employee Satisfaction",
      description: "Measure overall employee satisfaction, recognition, and belonging.",
      module: "SATISFACTION",
      status: "ACTIVE",
      isAnonymous: true,
      recurrence: "MONTHLY",
      createdById: SYSTEM_USER_ID,
      questions: {
        create: [
          {
            text: "My role gives me opportunities to grow",
            type: "CARD_SINGLE",
            order: 1,
            cards: satisfactionCards,
          },
          {
            text: "I feel recognized for my contributions",
            type: "CARD_SINGLE",
            order: 2,
            cards: satisfactionCards,
          },
          {
            text: "I feel a sense of belonging on this team",
            type: "CARD_SINGLE",
            order: 3,
            cards: satisfactionCards,
          },
          {
            text: "I'm proud to work at this company",
            type: "CARD_SINGLE",
            order: 4,
            cards: satisfactionCards,
          },
        ],
      },
    },
  });

  // ─── AI_TOOLS ─────────────────────────────────────────────────────────────
  await prisma.survey.upsert({
    where: { id: "seed-survey-ai-tools" },
    update: {},
    create: {
      id: "seed-survey-ai-tools",
      title: "AI Tools Adoption",
      description: "Understand how employees are experiencing the rollout of AI tools.",
      module: "AI_TOOLS",
      status: "ACTIVE",
      isAnonymous: true,
      recurrence: "MONTHLY",
      createdById: SYSTEM_USER_ID,
      questions: {
        create: [
          {
            text: "AI tools at work make me feel...",
            type: "CARD_SINGLE",
            order: 1,
            cards: JSON.stringify([
              { id: "1", label: "Empowered", emoji: "🚀", color: "emerald" },
              { id: "2", label: "Curious", emoji: "🤔", color: "blue" },
              { id: "3", label: "Uncertain", emoji: "😶", color: "amber" },
              { id: "4", label: "Overwhelmed", emoji: "😵", color: "red" },
              { id: "5", label: "Left behind", emoji: "😔", color: "red" },
            ]),
          },
          {
            text: "Which tools are causing the most friction?",
            type: "CARD_MULTI",
            order: 2,
            cards: JSON.stringify([
              { id: "1", label: "Slack" },
              { id: "2", label: "Jira" },
              { id: "3", label: "Salesforce" },
              { id: "4", label: "Email" },
              { id: "5", label: "Internal tools" },
              { id: "6", label: "AI assistants" },
              { id: "7", label: "Video calls" },
              { id: "8", label: "None" },
            ]),
          },
          {
            text: "AI is helping me with...",
            type: "CARD_MULTI",
            order: 3,
            cards: JSON.stringify([
              { id: "1", label: "Research", emoji: "📚" },
              { id: "2", label: "Writing", emoji: "✍️" },
              { id: "3", label: "Code", emoji: "💻" },
              { id: "4", label: "Analysis", emoji: "📊" },
              { id: "5", label: "None yet" },
              { id: "6", label: "I don't use AI" },
            ]),
          },
          {
            text: "My team's AI adoption feels...",
            type: "CARD_SINGLE",
            order: 4,
            cards: JSON.stringify([
              { id: "1", label: "Ahead of curve", color: "emerald" },
              { id: "2", label: "About right", color: "blue" },
              { id: "3", label: "Moving too fast", color: "amber" },
              { id: "4", label: "Moving too slow", color: "amber" },
              { id: "5", label: "Unclear", color: "red" },
            ]),
          },
        ],
      },
    },
  });

  // ─── ENPS ─────────────────────────────────────────────────────────────────
  await prisma.survey.upsert({
    where: { id: "seed-survey-enps" },
    update: {},
    create: {
      id: "seed-survey-enps",
      title: "Employee Net Promoter Score",
      description: "Measure employee advocacy and the key drivers behind their score.",
      module: "ENPS",
      status: "ACTIVE",
      isAnonymous: true,
      recurrence: "MONTHLY",
      createdById: SYSTEM_USER_ID,
      questions: {
        create: [
          {
            text: "How likely are you to recommend working here?",
            type: "ENPS",
            order: 1,
            cards: JSON.stringify([]),
          },
          {
            text: "The main reason for your score is...",
            type: "CARD_MULTI",
            order: 2,
            cards: JSON.stringify([
              { id: "1", label: "Great culture", color: "emerald" },
              { id: "2", label: "Strong leadership", color: "emerald" },
              { id: "3", label: "Growth opportunities", color: "emerald" },
              { id: "4", label: "Work-life balance", color: "emerald" },
              { id: "5", label: "Compensation", color: "blue" },
              { id: "6", label: "Team quality", color: "blue" },
              { id: "7", label: "Exciting mission", color: "blue" },
              { id: "8", label: "Poor management", color: "red" },
              { id: "9", label: "Burnout", color: "red" },
              { id: "10", label: "Limited growth", color: "red" },
              { id: "11", label: "Unclear direction", color: "amber" },
              { id: "12", label: "Better options elsewhere", color: "red" },
            ]),
          },
        ],
      },
    },
  });

  // ─── CASE ─────────────────────────────────────────────────────────────────
  await prisma.survey.upsert({
    where: { id: "seed-survey-case" },
    update: {},
    create: {
      id: "seed-survey-case",
      title: "Report a Concern",
      description: "Raise a workplace concern confidentially so it can be addressed.",
      module: "CASE",
      status: "ACTIVE",
      isAnonymous: true,
      recurrence: "ONCE",
      createdById: SYSTEM_USER_ID,
      questions: {
        create: [
          {
            text: "What area does your concern relate to?",
            type: "CARD_SINGLE",
            order: 1,
            cards: JSON.stringify([
              { id: "1", label: "Workload", emoji: "📚", color: "amber" },
              { id: "2", label: "Team conflict", emoji: "👥", color: "red" },
              { id: "3", label: "Process issues", emoji: "🔄", color: "blue" },
              { id: "4", label: "Tools & tech", emoji: "🛠️", color: "blue" },
              { id: "5", label: "Manager behaviour", emoji: "🧑‍💼", color: "red" },
              { id: "6", label: "Wellbeing", emoji: "❤️", color: "amber" },
              { id: "7", label: "Other", emoji: "📝", color: "blue" },
            ]),
          },
          {
            text: "Please describe the situation in your own words",
            type: "OPEN_TEXT",
            order: 2,
            cards: JSON.stringify([]),
          },
        ],
      },
    },
  });

  console.log("Seed completed — 7 survey templates created.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
