export interface Card {
  id: string;
  label: string;
  emoji?: string;
  color?: "emerald" | "blue" | "amber" | "red" | "purple" | "rose" | "indigo";
  drillDown?: DrillDown;
}

export interface DrillDown {
  question: string;
  subtext?: string;
  type: "CARD_SINGLE" | "CARD_MULTI";
  cards: Card[];
  dimension?: string;
}

export interface Question {
  id: string;
  text: string;
  subtext?: string;
  type: "CARD_SINGLE" | "CARD_MULTI" | "EMOJI_MOOD" | "OPEN_TEXT" | "ENPS";
  cards: Card[];
  dimension: string;
  required?: boolean;
}

export interface Module {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  timeEstimate: string;
  questions: Question[];
  dimensions: Dimension[];
}

export interface Dimension {
  id: string;
  label: string;
  description: string;
  riskThreshold: number; // card index >= this = at risk (0-based)
  color: string;
}

// ─── BURNOUT MODULE ──────────────────────────────────────────────────────────

export const BURNOUT_MODULE: Module = {
  id: "burnout",
  slug: "burnout",
  title: "Burnout Check",
  description: "Understand your energy, case load, and wellbeing — monthly",
  icon: "🔋",
  color: "amber",
  gradient: "from-amber-500 to-orange-500",
  timeEstimate: "4 min",
  dimensions: [
    { id: "workload", label: "Workload Pressure", description: "Volume and intensity of work", riskThreshold: 2, color: "amber" },
    { id: "exhaustion", label: "Emotional Exhaustion", description: "Energy drain after work", riskThreshold: 2, color: "red" },
    { id: "disconnection", label: "Team Disconnection", description: "Sense of belonging and connection", riskThreshold: 2, color: "purple" },
    { id: "clarity", label: "Clarity Deficit", description: "Unclear priorities or direction", riskThreshold: 2, color: "blue" },
    { id: "retention", label: "Retention Risk", description: "Likelihood of leaving", riskThreshold: 1, color: "red" },
  ],
  questions: [
    {
      id: "b1",
      text: "My workload right now feels...",
      subtext: "Be honest — this is anonymous",
      type: "CARD_SINGLE",
      dimension: "workload",
      cards: [
        {
          id: "manageable", label: "Manageable", emoji: "✅", color: "emerald",
          drillDown: {
            question: "What's keeping your workload manageable?",
            subtext: "Help us replicate what's working for the team",
            type: "CARD_MULTI",
            dimension: "workload",
            cards: [
              { id: "good_planning", label: "Clear case queue prioritization", emoji: "📋" },
              { id: "clear_prio", label: "Case severity (Sev) is well-defined", emoji: "🎯" },
              { id: "team_support", label: "Strong team support", emoji: "🤝" },
              { id: "good_mgr_w", label: "Manager shields from noise / interruptions", emoji: "🛡️" },
              { id: "right_scope", label: "Sev 1/2 scope is clear", emoji: "📐" },
              { id: "async_ok", label: "Shift handover works smoothly", emoji: "🔁" },
            ]
          }
        },
        {
          id: "busy", label: "Busy but okay", emoji: "📊", color: "blue",
          drillDown: {
            question: "What's keeping you on top of it?",
            type: "CARD_MULTI",
            dimension: "workload",
            cards: [
              { id: "focus_time", label: "Good case triage process", emoji: "📋" },
              { id: "delegate", label: "Able to reassign cases", emoji: "🔄" },
              { id: "tooling_b", label: "Good tooling / automation", emoji: "⚙️" },
              { id: "motivation_b", label: "Motivated by customer impact", emoji: "🚀" },
            ]
          }
        },
        {
          id: "heavy", label: "Heavy", emoji: "⚠️", color: "amber",
          drillDown: {
            question: "What's making it heavy?",
            type: "CARD_MULTI",
            dimension: "workload",
            cards: [
              { id: "deadlines", label: "Unrealistic SLA targets", emoji: "⏰" },
              { id: "meetings", label: "Too many meetings / bridges", emoji: "📅" },
              { id: "understaffed", label: "Understaffed team", emoji: "👥" },
              { id: "priorities", label: "Unclear case priorities", emoji: "🧭" },
              { id: "switching", label: "Constant context switching across cases", emoji: "🔀" },
              { id: "nosupport", label: "No support on Sev 1/2 escalations", emoji: "🆘" },
            ]
          }
        },
        {
          id: "overwhelming", label: "Overwhelming", emoji: "🔴", color: "red",
          drillDown: {
            question: "What's driving this most?",
            type: "CARD_MULTI",
            dimension: "workload",
            cards: [
              { id: "volume", label: "Too many open cases", emoji: "📚" },
              { id: "urgency", label: "Everything is Sev 1 or 2", emoji: "🚨" },
              { id: "alone", label: "Handling escalations alone", emoji: "🧍" },
              { id: "scope", label: "Case scope keeps expanding", emoji: "📈" },
              { id: "tools", label: "Tools slow down resolution", emoji: "🛠️" },
              { id: "manager_load", label: "Manager assigns more without context", emoji: "🧑‍💼" },
            ]
          }
        },
      ]
    },
    {
      id: "b2",
      text: "After work, I usually feel...",
      type: "CARD_SINGLE",
      dimension: "exhaustion",
      cards: [
        {
          id: "refreshed", label: "Refreshed", emoji: "😌", color: "emerald",
          drillDown: {
            question: "What helps you recharge well?",
            subtext: "This helps us understand what's supporting the team",
            type: "CARD_MULTI",
            dimension: "exhaustion",
            cards: [
              { id: "boundaries", label: "I keep clear work hours", emoji: "🕐" },
              { id: "low_mtg", label: "Low meeting load", emoji: "📵" },
              { id: "meaningful_e", label: "Work feels meaningful", emoji: "🌟" },
              { id: "autonomy_e", label: "I have autonomy", emoji: "🔑" },
              { id: "team_vibe", label: "Great team energy", emoji: "🤝" },
              { id: "physical", label: "Exercise / physical activity", emoji: "🏃" },
            ]
          }
        },
        {
          id: "neutral", label: "Neutral", emoji: "😐", color: "blue",
          drillDown: {
            question: "What would tip it towards refreshed?",
            type: "CARD_MULTI",
            dimension: "exhaustion",
            cards: [
              { id: "less_mtgs", label: "Fewer incident bridge calls", emoji: "📵" },
              { id: "more_focus", label: "Dedicated focus time between cases", emoji: "🧘" },
              { id: "clearer_goals", label: "Clearer case ownership", emoji: "🎯" },
              { id: "better_tools_e", label: "Better resolution tooling", emoji: "⚙️" },
            ]
          }
        },
        {
          id: "drained", label: "Drained", emoji: "😮‍💨", color: "amber",
          drillDown: {
            question: "What drains you most?",
            type: "CARD_MULTI",
            dimension: "exhaustion",
            cards: [
              { id: "social", label: "Back-to-back customer calls", emoji: "📞" },
              { id: "decisions", label: "High-stakes escalation decisions", emoji: "🤯" },
              { id: "conflict", label: "Team tension / blame culture", emoji: "⚡" },
              { id: "monotony", label: "Repetitive case types with no change", emoji: "🔁" },
              { id: "noapprec", label: "Effort on Sev 1s goes unrecognized", emoji: "💔" },
            ]
          }
        },
        {
          id: "exhausted", label: "Exhausted", emoji: "😩", color: "red",
          drillDown: {
            question: "How long has this been going on?",
            type: "CARD_SINGLE",
            dimension: "exhaustion",
            cards: [
              { id: "week", label: "Just this week", emoji: "📅", color: "amber" },
              { id: "month", label: "Past month", emoji: "🗓️", color: "amber" },
              { id: "quarter", label: "Last 3 months", emoji: "📆", color: "red" },
              { id: "longer", label: "Longer than that", emoji: "⏳", color: "red" },
            ]
          }
        },
      ]
    },
    {
      id: "b3",
      text: "I feel connected to my team",
      type: "CARD_SINGLE",
      dimension: "disconnection",
      cards: [
        {
          id: "always", label: "Always — we're tight", emoji: "🤝", color: "emerald",
          drillDown: {
            question: "What makes your team connection strong?",
            subtext: "Your manager wants to keep doing what's working",
            type: "CARD_MULTI",
            dimension: "disconnection",
            cards: [
              { id: "rituals", label: "Regular team rituals", emoji: "🔁" },
              { id: "transparency", label: "Open and honest culture", emoji: "🔓" },
              { id: "shared_goals", label: "We share clear goals", emoji: "🎯" },
              { id: "mgr_connect", label: "Manager keeps us aligned", emoji: "🧑‍💼" },
              { id: "social_time", label: "We make time to connect", emoji: "☕" },
              { id: "trust_t", label: "High trust environment", emoji: "💙" },
            ]
          }
        },
        {
          id: "usually", label: "Usually yes", emoji: "👍", color: "blue",
          drillDown: {
            question: "What makes those good moments happen?",
            type: "CARD_MULTI",
            dimension: "disconnection",
            cards: [
              { id: "standups", label: "Daily team standups", emoji: "🗣️" },
              { id: "retros", label: "Post-incident reviews (PIRs)", emoji: "🔍" },
              { id: "slack_chat", label: "Casual team chats", emoji: "💬" },
              { id: "pairing", label: "Case collaboration / shadowing", emoji: "👥" },
            ]
          }
        },
        {
          id: "sometimes", label: "Sometimes", emoji: "🤷", color: "amber",
          drillDown: {
            question: "What gets in the way?",
            type: "CARD_MULTI",
            dimension: "disconnection",
            cards: [
              { id: "remote", label: "Remote / async barriers", emoji: "🌐" },
              { id: "silos", label: "Team silos", emoji: "🧱" },
              { id: "trust", label: "Trust issues", emoji: "🔒" },
              { id: "diff_goals", label: "Different priorities", emoji: "🎯" },
              { id: "new", label: "I'm relatively new", emoji: "🌱" },
            ]
          }
        },
        {
          id: "rarely", label: "Rarely or never", emoji: "😶", color: "red",
          drillDown: {
            question: "What's the biggest reason?",
            type: "CARD_SINGLE",
            dimension: "disconnection",
            cards: [
              { id: "excluded", label: "Feel excluded from decisions", emoji: "🚪", color: "red" },
              { id: "manager_d", label: "Manager is disconnected", emoji: "🧑‍💼", color: "red" },
              { id: "culture", label: "Culture doesn't fit me", emoji: "🌍", color: "amber" },
              { id: "wfh", label: "Full remote, no touchpoints", emoji: "🏠", color: "amber" },
            ]
          }
        },
      ]
    },
    {
      id: "b4",
      text: "My priorities at work are...",
      type: "CARD_SINGLE",
      dimension: "clarity",
      cards: [
        {
          id: "clear", label: "Crystal clear", emoji: "🎯", color: "emerald",
          drillDown: {
            question: "What's driving that clarity?",
            subtext: "Help us understand what's working so we can scale it",
            type: "CARD_MULTI",
            dimension: "clarity",
            cards: [
              { id: "great_1on1", label: "Regular 1:1s with manager", emoji: "💬" },
              { id: "okrs", label: "Clear case ownership & SLA targets", emoji: "📊" },
              { id: "good_roadmap", label: "Well-defined escalation runbook", emoji: "📖" },
              { id: "standup_c", label: "Daily standups / queue reviews help", emoji: "🗣️" },
              { id: "own_work", label: "I own my case queue entirely", emoji: "🔑" },
            ]
          }
        },
        {
          id: "mostly", label: "Mostly clear", emoji: "🔍", color: "blue",
          drillDown: {
            question: "What would make it 100% clear?",
            type: "CARD_MULTI",
            dimension: "clarity",
            cards: [
              { id: "more_1on1", label: "More frequent 1:1s", emoji: "💬" },
              { id: "written_goals", label: "Documented case handling guidelines", emoji: "📝" },
              { id: "priority_stack", label: "Explicit Sev escalation priority order", emoji: "📊" },
            ]
          }
        },
        {
          id: "blurry", label: "A bit blurry", emoji: "🌫️", color: "amber",
          drillDown: {
            question: "What's causing the blur?",
            type: "CARD_MULTI",
            dimension: "clarity",
            cards: [
              { id: "changing", label: "Priorities keep shifting mid-day", emoji: "🔄" },
              { id: "no1on1", label: "Not enough 1:1 time", emoji: "💬" },
              { id: "overlap", label: "Overlapping case ownership", emoji: "🔁" },
              { id: "nogoals", label: "SLA targets not communicated", emoji: "📋" },
              { id: "toomany", label: "Too many Sev 1s at once", emoji: "⚔️" },
            ]
          }
        },
        {
          id: "lost", label: "I'm lost", emoji: "😵", color: "red",
          drillDown: {
            question: "When did this start?",
            type: "CARD_SINGLE",
            dimension: "clarity",
            cards: [
              { id: "reorg", label: "After a reorg / team change", emoji: "🔀", color: "amber" },
              { id: "new_mgr", label: "New manager", emoji: "🧑‍💼", color: "amber" },
              { id: "always_lost", label: "Always been this way here", emoji: "⏳", color: "red" },
              { id: "strategy", label: "Company strategy shifted", emoji: "🧭", color: "red" },
            ]
          }
        },
      ]
    },
    {
      id: "b5",
      text: "Honestly, I think about leaving...",
      type: "CARD_SINGLE",
      dimension: "retention",
      cards: [
        {
          id: "notatall", label: "Not at all", emoji: "💚", color: "emerald",
          drillDown: {
            question: "What keeps you here?",
            subtext: "Your manager wants to protect what's working",
            type: "CARD_MULTI",
            dimension: "retention",
            cards: [
              { id: "team_love", label: "I love my team", emoji: "🤝" },
              { id: "growth_k", label: "Strong growth path", emoji: "📈" },
              { id: "mission_k", label: "Exciting mission", emoji: "🚀" },
              { id: "mgr_great", label: "Great manager", emoji: "⭐" },
              { id: "comp_k", label: "Competitive pay", emoji: "💰" },
              { id: "flex_k", label: "Flexibility & autonomy", emoji: "🕐" },
              { id: "balance_k", label: "Work-life balance", emoji: "⚖️" },
            ]
          }
        },
        {
          id: "occasionally", label: "Occasionally", emoji: "💭", color: "blue",
          drillDown: {
            question: "What triggers those thoughts?",
            type: "CARD_MULTI",
            dimension: "retention",
            cards: [
              { id: "stress_r", label: "High-pressure Sev 1 periods", emoji: "😰" },
              { id: "compare", label: "Better offers elsewhere", emoji: "💼" },
              { id: "plateaued", label: "Feeling plateaued in the role", emoji: "📉" },
              { id: "unfair", label: "Feeling treated unfairly", emoji: "⚖️" },
            ]
          }
        },
        {
          id: "frequently", label: "Frequently", emoji: "🚪", color: "amber",
          drillDown: {
            question: "What's the main pull?",
            type: "CARD_MULTI",
            dimension: "retention",
            cards: [
              { id: "pay", label: "Better compensation elsewhere", emoji: "💰" },
              { id: "growth_r", label: "Limited growth here", emoji: "📈" },
              { id: "culture_r", label: "Culture doesn't fit", emoji: "🌍" },
              { id: "mgr_r", label: "My manager", emoji: "🧑‍💼" },
              { id: "burnout_r", label: "Burnout", emoji: "🔥" },
              { id: "mission", label: "Not excited by the mission", emoji: "🧭" },
            ]
          }
        },
        {
          id: "actively", label: "Actively looking", emoji: "🔍", color: "red",
          drillDown: {
            question: "What would make you stay?",
            type: "CARD_MULTI",
            dimension: "retention",
            cards: [
              { id: "raise", label: "Significant pay raise", emoji: "💰" },
              { id: "promo", label: "Promotion / role change", emoji: "🏆" },
              { id: "mgr_change", label: "Different manager", emoji: "🔄" },
              { id: "flex", label: "More flexibility", emoji: "🕓" },
              { id: "nothing", label: "Honestly, nothing", emoji: "😔" },
            ]
          }
        },
      ]
    },
    {
      id: "b6",
      text: "Do you want to escalate anything to HR or your manager?",
      subtext: "This is completely anonymous. Select if you'd like someone to follow up.",
      type: "CARD_SINGLE",
      dimension: "retention",
      cards: [
        { id: "no_esc", label: "No, I'm fine", emoji: "✅", color: "emerald" },
        { id: "talk_mgr", label: "I'd welcome a 1:1", emoji: "💬", color: "blue" },
        {
          id: "raise_case", label: "I want to raise a case", emoji: "📋", color: "amber",
          drillDown: {
            question: "What's the nature of the issue?",
            subtext: "Anonymous — will be logged as a case for HR/manager review",
            type: "CARD_SINGLE",
            dimension: "retention",
            cards: [
              { id: "workload_esc", label: "Unsustainable case load / burnout", emoji: "🔥", color: "amber" },
              { id: "sev_esc", label: "Sev 1/2 handling & on-call concerns", emoji: "🚨", color: "amber" },
              { id: "mgr_esc", label: "Manager relationship", emoji: "🧑‍💼", color: "amber" },
              { id: "team_esc", label: "Team conflict", emoji: "⚡", color: "amber" },
              { id: "pay_esc", label: "Compensation concern", emoji: "💰", color: "amber" },
              { id: "conduct_esc", label: "Conduct / policy issue", emoji: "⚖️", color: "red" },
            ]
          }
        },
        { id: "urgent", label: "This is urgent", emoji: "🚨", color: "red" },
      ]
    },
  ]
};

// ─── MANAGER MODULE ───────────────────────────────────────────────────────────

export const MANAGER_MODULE: Module = {
  id: "manager",
  slug: "manager-review",
  title: "Manager Review",
  description: "Anonymous upward feedback for your manager",
  icon: "⭐",
  color: "purple",
  gradient: "from-purple-500 to-indigo-500",
  timeEstimate: "3 min",
  dimensions: [
    { id: "communication", label: "Communication", description: "Clarity and frequency of communication", riskThreshold: 2, color: "blue" },
    { id: "support", label: "Support", description: "Help when facing challenges", riskThreshold: 2, color: "purple" },
    { id: "recognition", label: "Recognition", description: "Acknowledgement of contributions", riskThreshold: 2, color: "amber" },
    { id: "safety", label: "Psychological Safety", description: "Ability to speak openly", riskThreshold: 2, color: "red" },
    { id: "direction", label: "Direction Setting", description: "Clarity of goals and expectations", riskThreshold: 2, color: "indigo" },
  ],
  questions: [
    {
      id: "m1",
      text: "My manager gives me clear direction",
      type: "CARD_SINGLE",
      dimension: "direction",
      cards: [
        {
          id: "always", label: "Always", emoji: "✅", color: "emerald",
          drillDown: {
            question: "What makes their direction so effective?",
            subtext: "Help your manager keep doing what's working",
            type: "CARD_MULTI",
            dimension: "direction",
            cards: [
              { id: "clear_okrs", label: "Clear SLA targets and case priorities", emoji: "🎯" },
              { id: "good_1on1s", label: "Regular 1:1s", emoji: "💬" },
              { id: "context", label: "Always explains escalation context", emoji: "🗂️" },
              { id: "accessible", label: "Available during Sev 1 escalations", emoji: "📲" },
              { id: "no_surprises", label: "No sudden priority changes", emoji: "🔄" },
            ]
          }
        },
        {
          id: "usually", label: "Usually", emoji: "👍", color: "blue",
          drillDown: {
            question: "What would make it even better?",
            type: "CARD_MULTI",
            dimension: "direction",
            cards: [
              { id: "more_context", label: "More context on decisions", emoji: "🗂️" },
              { id: "written_dir", label: "Written direction / docs", emoji: "📝" },
              { id: "more_freq", label: "More frequent check-ins", emoji: "📅" },
            ]
          }
        },
        {
          id: "sometimes", label: "Sometimes", emoji: "🤷", color: "amber",
          drillDown: {
            question: "What's missing in the direction you get?",
            type: "CARD_MULTI",
            dimension: "direction",
            cards: [
              { id: "goals", label: "Clear SLA goals and targets", emoji: "🎯" },
              { id: "why", label: "The 'why' behind escalations", emoji: "❓" },
              { id: "priority_m", label: "Case priority order", emoji: "📊" },
              { id: "timeline", label: "Realistic resolution timelines", emoji: "⏰" },
              { id: "feedback_m", label: "Regular feedback on case quality", emoji: "💬" },
            ]
          }
        },
        {
          id: "rarely", label: "Rarely", emoji: "❌", color: "red",
          drillDown: {
            question: "How does this affect you?",
            type: "CARD_MULTI",
            dimension: "direction",
            cards: [
              { id: "waste", label: "I waste time on wrong things", emoji: "⏳" },
              { id: "stress_m", label: "It causes stress", emoji: "😰" },
              { id: "guess", label: "I have to guess constantly", emoji: "🎲" },
              { id: "demot", label: "I feel demotivated", emoji: "📉" },
            ]
          }
        },
      ]
    },
    {
      id: "m2",
      text: "When I face challenges, my manager...",
      type: "CARD_SINGLE",
      dimension: "support",
      cards: [
        {
          id: "always_s", label: "Always steps in to help", emoji: "🦸", color: "emerald",
          drillDown: {
            question: "How do they show up for you?",
            subtext: "Your manager wants to keep doing what helps most",
            type: "CARD_MULTI",
            dimension: "support",
            cards: [
              { id: "removes_blockers", label: "Removes blockers fast", emoji: "🚧" },
              { id: "shields", label: "Shields me from distractions", emoji: "🛡️" },
              { id: "coaches", label: "Coaches me through it", emoji: "🎓" },
              { id: "advocates", label: "Advocates for me upward", emoji: "📣" },
              { id: "available_s", label: "Always available", emoji: "📲" },
            ]
          }
        },
        {
          id: "usually_s", label: "Usually supports me", emoji: "👋", color: "blue",
          drillDown: {
            question: "What kind of support do you get most?",
            type: "CARD_MULTI",
            dimension: "support",
            cards: [
              { id: "advice", label: "Practical advice", emoji: "💡" },
              { id: "listening", label: "They listen well", emoji: "👂" },
              { id: "resources_s", label: "Gets me resources", emoji: "🔧" },
            ]
          }
        },
        {
          id: "sometimes_s", label: "Sometimes, inconsistently", emoji: "🎲", color: "amber",
          drillDown: {
            question: "What kind of support is missing?",
            type: "CARD_MULTI",
            dimension: "support",
            cards: [
              { id: "availability", label: "They're rarely available", emoji: "📵" },
              { id: "solutions", label: "Help finding solutions", emoji: "💡" },
              { id: "shield", label: "Shielding me from distractions", emoji: "🛡️" },
              { id: "resources", label: "Getting me resources", emoji: "🔧" },
              { id: "advocacy", label: "Advocating for me upward", emoji: "📣" },
            ]
          }
        },
        {
          id: "never_s", label: "Rarely or never helps", emoji: "😶", color: "red",
          drillDown: {
            question: "What happens when you raise issues?",
            type: "CARD_SINGLE",
            dimension: "support",
            cards: [
              { id: "ignored", label: "They're ignored", emoji: "🙈", color: "red" },
              { id: "deflected", label: "Deflected back to me", emoji: "↩️", color: "amber" },
              { id: "dismissed", label: "Dismissed as unimportant", emoji: "👋", color: "red" },
              { id: "punished", label: "I fear negative consequences", emoji: "😨", color: "red" },
            ]
          }
        },
      ]
    },
    {
      id: "m3",
      text: "My contributions are recognized by my manager",
      type: "CARD_SINGLE",
      dimension: "recognition",
      cards: [
        {
          id: "always_r", label: "Consistently", emoji: "🏆", color: "emerald",
          drillDown: {
            question: "How does recognition show up for you?",
            subtext: "Helps your manager understand what resonates",
            type: "CARD_MULTI",
            dimension: "recognition",
            cards: [
              { id: "pub_praise", label: "Public praise in team", emoji: "📢" },
              { id: "priv_msg", label: "Personal messages", emoji: "💬" },
              { id: "career_rec", label: "Career advancement opportunities", emoji: "📈" },
              { id: "ownership_rec", label: "Given more ownership", emoji: "🔑" },
              { id: "comp_rec", label: "Compensation reflection", emoji: "💰" },
            ]
          }
        },
        {
          id: "usually_r", label: "Often", emoji: "👏", color: "blue",
          drillDown: {
            question: "What form of recognition means most to you?",
            type: "CARD_MULTI",
            dimension: "recognition",
            cards: [
              { id: "public_u", label: "Public acknowledgement", emoji: "📢" },
              { id: "private_u", label: "Private acknowledgement", emoji: "💬" },
              { id: "growth_u", label: "Growth opportunities", emoji: "📈" },
            ]
          }
        },
        {
          id: "rarely_r", label: "Rarely", emoji: "😐", color: "amber",
          drillDown: {
            question: "What form of recognition matters most to you?",
            type: "CARD_MULTI",
            dimension: "recognition",
            cards: [
              { id: "public", label: "Public praise in team meetings", emoji: "📢" },
              { id: "private", label: "Private acknowledgement", emoji: "💬" },
              { id: "career", label: "Career advancement", emoji: "📈" },
              { id: "comp", label: "Compensation increase", emoji: "💰" },
              { id: "ownership", label: "More ownership/responsibility", emoji: "🔑" },
            ]
          }
        },
        { id: "never_r", label: "Never", emoji: "💔", color: "red" },
      ]
    },
    {
      id: "m4",
      text: "I feel safe sharing honest opinions with my manager",
      type: "CARD_SINGLE",
      dimension: "safety",
      cards: [
        {
          id: "very_safe", label: "Completely safe", emoji: "🔓", color: "emerald",
          drillDown: {
            question: "What creates that safety?",
            subtext: "Your manager wants to protect this environment",
            type: "CARD_MULTI",
            dimension: "safety",
            cards: [
              { id: "no_retali", label: "No fear of retaliation", emoji: "🛡️" },
              { id: "feedback_welcome", label: "Feedback is actively welcomed", emoji: "🤝" },
              { id: "acts_on", label: "Manager acts on feedback", emoji: "✅" },
              { id: "modeled", label: "Vulnerability is modeled", emoji: "💙" },
              { id: "no_politics", label: "Low political environment", emoji: "🌿" },
            ]
          }
        },
        {
          id: "mostly_safe", label: "Mostly yes", emoji: "😌", color: "blue",
          drillDown: {
            question: "What would make you feel completely safe?",
            type: "CARD_MULTI",
            dimension: "safety",
            cards: [
              { id: "more_consistency", label: "More consistent response to feedback", emoji: "🔄" },
              { id: "anon_option", label: "Anonymous feedback channel", emoji: "🔒" },
              { id: "follow_through", label: "Visible follow-through on issues", emoji: "✅" },
            ]
          }
        },
        {
          id: "cautious", label: "I hold back sometimes", emoji: "🤐", color: "amber",
          drillDown: {
            question: "What makes you hold back?",
            type: "CARD_MULTI",
            dimension: "safety",
            cards: [
              { id: "retaliation", label: "Fear of retaliation", emoji: "😨" },
              { id: "judgment", label: "Fear of being judged", emoji: "👁️" },
              { id: "ignored_s", label: "Know it won't change anything", emoji: "🤷" },
              { id: "past", label: "Past negative experience", emoji: "📜" },
              { id: "culture_s", label: "It's not the culture here", emoji: "🌍" },
            ]
          }
        },
        {
          id: "not_safe", label: "Not safe at all", emoji: "🔒", color: "red",
          drillDown: {
            question: "Have you experienced any of these?",
            type: "CARD_MULTI",
            dimension: "safety",
            cards: [
              { id: "dismissed_s", label: "Ideas dismissed publicly", emoji: "🗑️" },
              { id: "blame", label: "Blamed for failures", emoji: "👉" },
              { id: "excluded_s", label: "Excluded from key decisions", emoji: "🚪" },
              { id: "micromanage", label: "Micromanaged", emoji: "🔬" },
              { id: "favourit", label: "Favouritism observed", emoji: "⚖️" },
            ]
          }
        },
      ]
    },
  ]
};

// ─── PULSE MODULE ─────────────────────────────────────────────────────────────

export const PULSE_MODULE: Module = {
  id: "pulse",
  slug: "pulse",
  title: "Daily Pulse",
  description: "Quick daily check-in — how are you really doing?",
  icon: "❤️",
  color: "rose",
  gradient: "from-rose-500 to-pink-500",
  timeEstimate: "2 min",
  dimensions: [
    { id: "mood", label: "Overall Mood", description: "General emotional state", riskThreshold: 3, color: "rose" },
    { id: "energy", label: "Energy Level", description: "Physical and mental energy", riskThreshold: 2, color: "amber" },
    { id: "focus", label: "Focus & Clarity", description: "Ability to concentrate", riskThreshold: 2, color: "blue" },
    { id: "team_vibe", label: "Team Vibe", description: "What's on the team's mind", riskThreshold: 0, color: "purple" },
  ],
  questions: [
    {
      id: "p1",
      text: "How are you feeling today?",
      subtext: "Tap your honest mood",
      type: "EMOJI_MOOD",
      dimension: "mood",
      cards: [
        { id: "1", label: "Struggling", emoji: "😔", color: "red" },
        { id: "2", label: "Low", emoji: "😟", color: "amber" },
        { id: "3", label: "Okay", emoji: "😐", color: "blue" },
        { id: "4", label: "Good", emoji: "🙂", color: "blue" },
        { id: "5", label: "Great", emoji: "😊", color: "emerald" },
        { id: "6", label: "Thriving", emoji: "🤩", color: "emerald" },
      ]
    },
    {
      id: "p2",
      text: "My energy level right now is...",
      type: "CARD_SINGLE",
      dimension: "energy",
      cards: [
        {
          id: "energized", label: "Energized", emoji: "⚡", color: "emerald",
          drillDown: {
            question: "What's fueling your energy today?",
            subtext: "Helps identify what the team can do more of",
            type: "CARD_MULTI",
            dimension: "energy",
            cards: [
              { id: "slept_well", label: "Slept really well", emoji: "😴" },
              { id: "exciting_work", label: "Meaningful cases to resolve", emoji: "🚀" },
              { id: "momentum", label: "Good case resolution momentum", emoji: "🏃" },
              { id: "team_energy", label: "Great team energy", emoji: "🤝" },
              { id: "clear_day", label: "Clear queue and priorities for the day", emoji: "🎯" },
            ]
          }
        },
        {
          id: "steady", label: "Steady", emoji: "👍", color: "blue",
          drillDown: {
            question: "What's keeping you steady?",
            type: "CARD_MULTI",
            dimension: "energy",
            cards: [
              { id: "routine", label: "Good daily routine", emoji: "🔁" },
              { id: "manageable_e", label: "Manageable case load", emoji: "✅" },
              { id: "no_drama", label: "No Sev 1 fires today", emoji: "🧘" },
            ]
          }
        },
        {
          id: "low_e", label: "Running low", emoji: "🔋", color: "amber",
          drillDown: {
            question: "What's draining your energy?",
            type: "CARD_MULTI",
            dimension: "energy",
            cards: [
              { id: "sleep", label: "Poor sleep / on-call disruption", emoji: "😴" },
              { id: "meetings_e", label: "Back-to-back bridge calls", emoji: "📅" },
              { id: "stress_e", label: "High-severity case pressure", emoji: "😰" },
              { id: "personal", label: "Personal matters", emoji: "🏠" },
              { id: "unclear_e", label: "Unclear which cases to prioritize", emoji: "🧭" },
            ]
          }
        },
        {
          id: "burnedout", label: "Burned out", emoji: "💤", color: "red",
          drillDown: {
            question: "How long have you felt this way?",
            type: "CARD_SINGLE",
            dimension: "energy",
            cards: [
              { id: "today", label: "Just today", emoji: "📅", color: "amber" },
              { id: "week_e", label: "This week", emoji: "🗓️", color: "amber" },
              { id: "weeks", label: "A few weeks", emoji: "📆", color: "red" },
              { id: "long", label: "A long time", emoji: "⏳", color: "red" },
            ]
          }
        },
      ]
    },
    {
      id: "p3",
      text: "What's on your mind today?",
      subtext: "Select all that apply",
      type: "CARD_MULTI",
      dimension: "team_vibe",
      cards: [
        { id: "toomuch", label: "Too many open cases", emoji: "📚" },
        { id: "team_p", label: "Team dynamics", emoji: "👥" },
        { id: "growth_p", label: "Career growth", emoji: "📈" },
        { id: "mgr_p", label: "My manager", emoji: "🧑‍💼" },
        { id: "tools_p", label: "Tools slowing me down", emoji: "🛠️" },
        { id: "allgood", label: "All good!", emoji: "✅" },
        { id: "wellbeing_p", label: "Personal wellbeing", emoji: "❤️" },
        { id: "sev1_p", label: "Ongoing Sev 1 / Sev 2 pressure", emoji: "🚨" },
        { id: "recognition_p", label: "Not feeling recognized", emoji: "💔" },
        { id: "collaboration", label: "Case collaboration issues", emoji: "🤝" },
      ]
    },
  ]
};

// ─── AI & TOOLS MODULE ────────────────────────────────────────────────────────

export const AI_TOOLS_MODULE: Module = {
  id: "ai_tools",
  slug: "ai-tools",
  title: "AI & Tools Pulse",
  description: "How you really feel about the tech stack and AI at work",
  icon: "⚡",
  color: "blue",
  gradient: "from-blue-500 to-cyan-500",
  timeEstimate: "3 min",
  dimensions: [
    { id: "ai_sentiment", label: "AI Readiness", description: "How employees feel about AI adoption", riskThreshold: 2, color: "blue" },
    { id: "tool_friction", label: "Tool Friction", description: "Tools causing the most pain", riskThreshold: 0, color: "amber" },
    { id: "ai_usage", label: "AI Usage", description: "How AI is being used day-to-day", riskThreshold: 0, color: "indigo" },
    { id: "infra_pain", label: "Infrastructure Pain", description: "Systems and process bottlenecks", riskThreshold: 2, color: "red" },
  ],
  questions: [
    {
      id: "ai1",
      text: "AI tools at work make me feel...",
      type: "CARD_SINGLE",
      dimension: "ai_sentiment",
      cards: [
        {
          id: "empowered", label: "Empowered", emoji: "🚀", color: "emerald",
          drillDown: {
            question: "What's making AI work so well for you?",
            subtext: "Your manager wants to scale what's working",
            type: "CARD_MULTI",
            dimension: "ai_sentiment",
            cards: [
              { id: "good_training", label: "Good AI training provided", emoji: "📚" },
              { id: "right_tools", label: "Right tools for my work", emoji: "🛠️" },
              { id: "saves_time", label: "Genuinely saves me time", emoji: "⏱️" },
              { id: "creative_ai", label: "Sparks creativity", emoji: "💡" },
              { id: "trusted_output", label: "I trust the output quality", emoji: "✅" },
            ]
          }
        },
        {
          id: "curious", label: "Curious & learning", emoji: "🤔", color: "blue",
          drillDown: {
            question: "What are you most curious about?",
            type: "CARD_MULTI",
            dimension: "ai_sentiment",
            cards: [
              { id: "more_usecases", label: "More use cases for my role", emoji: "🎯" },
              { id: "better_prompts", label: "How to prompt better", emoji: "💬" },
              { id: "ai_agents", label: "Agentic / autonomous AI", emoji: "🤖" },
              { id: "data_ai", label: "AI for data analysis", emoji: "📊" },
            ]
          }
        },
        {
          id: "uncertain", label: "Uncertain", emoji: "😶", color: "amber",
          drillDown: {
            question: "What's causing the uncertainty?",
            type: "CARD_MULTI",
            dimension: "ai_sentiment",
            cards: [
              { id: "job_threat", label: "Concerned about my job", emoji: "😰" },
              { id: "no_training", label: "Haven't been trained", emoji: "📚" },
              { id: "trust", label: "Don't trust the outputs", emoji: "🤨" },
              { id: "too_fast", label: "Moving too fast", emoji: "⚡" },
              { id: "unclear_use", label: "Unclear when to use AI", emoji: "🧭" },
            ]
          }
        },
        {
          id: "overwhelmed", label: "Overwhelmed", emoji: "😵", color: "red",
          drillDown: {
            question: "What's the biggest friction?",
            type: "CARD_MULTI",
            dimension: "ai_sentiment",
            cards: [
              { id: "too_many", label: "Too many new tools", emoji: "🛠️" },
              { id: "no_support", label: "No support or guidance", emoji: "🆘" },
              { id: "conflict", label: "Conflicts with my workflow", emoji: "⚔️" },
              { id: "quality", label: "Output quality is poor", emoji: "📉" },
              { id: "security", label: "Security / data concerns", emoji: "🔐" },
            ]
          }
        },
        { id: "behind", label: "Left behind", emoji: "😔", color: "red" },
      ]
    },
    {
      id: "ai2",
      text: "Which tools cause the most friction in your day?",
      subtext: "Select all that apply",
      type: "CARD_MULTI",
      dimension: "tool_friction",
      cards: [
        { id: "slack_t", label: "Slack / messaging overload", emoji: "💬" },
        { id: "salesforce_t", label: "Salesforce case console", emoji: "☁️" },
        { id: "email_t", label: "Email overload", emoji: "📧" },
        { id: "internal", label: "Internal legacy / knowledge tools", emoji: "🖥️" },
        { id: "ai_tools_t", label: "AI assistants (unclear or unreliable)", emoji: "🤖" },
        { id: "video", label: "Bridge / video call fatigue", emoji: "📹" },
        { id: "docs", label: "Knowledge base / runbook gaps", emoji: "📄" },
        { id: "monitoring", label: "Monitoring / alerting tools", emoji: "📊" },
        { id: "none_t", label: "Tools are fine", emoji: "✅" },
      ]
    },
    {
      id: "ai3",
      text: "AI is genuinely helping me with...",
      subtext: "Select all that apply",
      type: "CARD_MULTI",
      dimension: "ai_usage",
      cards: [
        { id: "research_ai", label: "Researching known issues / bugs", emoji: "📚" },
        { id: "writing_ai", label: "Writing case updates & comms", emoji: "✍️" },
        { id: "triage_ai", label: "Case triage & Sev classification", emoji: "🔍" },
        { id: "analysis_ai", label: "Root cause analysis", emoji: "📊" },
        { id: "summaries", label: "Summarizing long case threads", emoji: "📝" },
        { id: "kb_ai", label: "Finding KB articles / runbooks", emoji: "📖" },
        { id: "none_ai", label: "Not using AI yet", emoji: "🚫" },
        { id: "no_access", label: "Don't have access", emoji: "🔐" },
      ]
    },
    {
      id: "ai4",
      text: "Our team's AI adoption feels...",
      type: "CARD_SINGLE",
      dimension: "infra_pain",
      cards: [
        {
          id: "ahead", label: "Ahead of the curve", emoji: "🚀", color: "emerald",
          drillDown: {
            question: "What's driving that leadership?",
            subtext: "Help the manager share this across the org",
            type: "CARD_MULTI",
            dimension: "infra_pain",
            cards: [
              { id: "leadership_push", label: "Strong leadership buy-in", emoji: "🏆" },
              { id: "experiments", label: "Culture of experimentation", emoji: "🧪" },
              { id: "champions", label: "AI champions on the team", emoji: "⭐" },
              { id: "training_a", label: "Regular AI training", emoji: "📚" },
              { id: "time_given", label: "Time given to learn / build", emoji: "🕐" },
            ]
          }
        },
        {
          id: "right", label: "About right", emoji: "👍", color: "blue",
          drillDown: {
            question: "What's making the pace feel right?",
            type: "CARD_MULTI",
            dimension: "infra_pain",
            cards: [
              { id: "measured", label: "Measured, thoughtful rollout", emoji: "⚖️" },
              { id: "feedback_loop", label: "Feedback is incorporated", emoji: "🔁" },
              { id: "no_overload", label: "Not overwhelmed with tools", emoji: "🧘" },
            ]
          }
        },
        {
          id: "too_fast_a", label: "Moving too fast", emoji: "⚡", color: "amber",
          drillDown: {
            question: "What's the impact of moving too fast?",
            type: "CARD_MULTI",
            dimension: "infra_pain",
            cards: [
              { id: "overwhelm_a", label: "People feel overwhelmed", emoji: "😵" },
              { id: "quality_a", label: "Quality is suffering", emoji: "📉" },
              { id: "adoption_a", label: "Low actual adoption", emoji: "🚫" },
              { id: "trust_a", label: "Trust issues with AI output", emoji: "🤨" },
            ]
          }
        },
        { id: "too_slow", label: "Moving too slow", emoji: "🐌", color: "amber" },
        { id: "unclear_a", label: "No clear strategy", emoji: "🧭", color: "red" },
      ]
    },
  ]
};

export const ALL_MODULES: Module[] = [
  PULSE_MODULE,
  BURNOUT_MODULE,
  MANAGER_MODULE,
  AI_TOOLS_MODULE,
];

// ─── INSIGHTS ENGINE ──────────────────────────────────────────────────────────

export interface DimensionScore {
  id: string;
  label: string;
  riskPercent: number;    // 0-100
  positivePercent: number; // 0-100
  atRisk: boolean;
  color: string;
  totalResponses: number;
}

export interface ModuleInsights {
  moduleId: string;
  moduleTitle: string;
  dimensions: DimensionScore[];
  overallRiskPercent: number;
  overallPositivePercent: number;
  topReason: string | null;        // top risk dimension
  topStrength: string | null;      // top positive dimension
}

export function computeInsights(
  module: Module,
  answers: Record<string, string[]>
): ModuleInsights {
  const dimensionRisks: Record<string, { risk: number; positive: number; total: number }> = {};

  module.dimensions.forEach((d) => {
    dimensionRisks[d.id] = { risk: 0, positive: 0, total: 0 };
  });

  module.questions.forEach((q) => {
    const selected = answers[q.id] ?? [];
    if (selected.length === 0) return;

    const dim = dimensionRisks[q.dimension];
    if (!dim) return;

    if (q.type === "CARD_SINGLE" || q.type === "EMOJI_MOOD") {
      dim.total++;
      const cardIndex = q.cards.findIndex((c) => c.id === selected[0]);
      const dimension = module.dimensions.find((d) => d.id === q.dimension);
      if (dimension) {
        if (cardIndex >= dimension.riskThreshold) {
          dim.risk++;
        } else {
          dim.positive++;
        }
      }
    } else if (q.type === "CARD_MULTI") {
      dim.total++;
      const hasPositive = selected.includes("allgood") || selected.includes("none_t") || selected.includes("none_ai");
      if (hasPositive || selected.length === 0) {
        dim.positive++;
      } else {
        dim.risk++;
      }
    }
  });

  const dimensions: DimensionScore[] = module.dimensions.map((d) => {
    const { risk, positive, total } = dimensionRisks[d.id];
    const riskPercent = total > 0 ? Math.round((risk / total) * 100) : 0;
    const positivePercent = total > 0 ? Math.round((positive / total) * 100) : 0;
    return {
      id: d.id,
      label: d.label,
      riskPercent,
      positivePercent,
      atRisk: riskPercent >= 50,
      color: d.color,
      totalResponses: total,
    };
  });

  const scored = dimensions.filter((d) => d.totalResponses > 0);

  const overallRisk = scored.length > 0
    ? Math.round(scored.reduce((s, d) => s + d.riskPercent, 0) / scored.length)
    : 0;

  const overallPositive = scored.length > 0
    ? Math.round(scored.reduce((s, d) => s + d.positivePercent, 0) / scored.length)
    : 0;

  const topRiskDim = [...dimensions].sort((a, b) => b.riskPercent - a.riskPercent)[0];
  const topPosDim = [...dimensions].sort((a, b) => b.positivePercent - a.positivePercent)[0];

  return {
    moduleId: module.id,
    moduleTitle: module.title,
    dimensions,
    overallRiskPercent: overallRisk,
    overallPositivePercent: overallPositive,
    topReason: topRiskDim?.riskPercent > 0 ? topRiskDim.label : null,
    topStrength: topPosDim?.positivePercent > 0 ? topPosDim.label : null,
  };
}
