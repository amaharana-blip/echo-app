export interface WhyOption {
  id: string;
  label: string;
  emoji: string;
}

export interface EngQuestion {
  id: string;
  text: string;
  sectionId: string;
  icon: string;
  positiveWhys: WhyOption[];
  neutralWhys: WhyOption[];
  negativeWhys: WhyOption[];
}

export interface EngSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  questions: EngQuestion[];
}

export const ENGAGEMENT_SURVEY_ID = "engagement";

export const ENGAGEMENT_SECTIONS: EngSection[] = [
  {
    id: "leadership",
    title: "Leadership & Trust",
    description: "Transparency, accessibility, and trustworthiness of senior leadership",
    icon: "🧭",
    color: "#4F46E5",
    gradient: "linear-gradient(135deg, #4F46E5, #6366F1)",
    questions: [
      {
        id: "l1", sectionId: "leadership", icon: "📢",
        text: "Senior leaders communicate direction clearly and honestly.",
        positiveWhys: [
          { id: "l1p1", emoji: "🔊", label: "Updates are clear and timely" },
          { id: "l1p2", emoji: "📖", label: "No sugarcoating — I get the real picture" },
          { id: "l1p3", emoji: "🗓️", label: "All-hands and comms feel purposeful" },
          { id: "l1p4", emoji: "💬", label: "I can ask anything and get a real answer" },
          { id: "l1p5", emoji: "🧩", label: "Strategy is explained, not just announced" },
        ],
        neutralWhys: [
          { id: "l1n1", emoji: "🌫️", label: "Direction is shared but not always clear why" },
          { id: "l1n2", emoji: "📭", label: "Comms are infrequent or lag behind events" },
          { id: "l1n3", emoji: "🔄", label: "Message changes without explanation" },
          { id: "l1n4", emoji: "🤷", label: "Some topics feel deliberately vague" },
          { id: "l1n5", emoji: "🎭", label: "Tone is polished but substance is thin" },
        ],
        negativeWhys: [
          { id: "l1neg1", emoji: "🤐", label: "Key decisions are made behind closed doors" },
          { id: "l1neg2", emoji: "📵", label: "I find out about changes from others, not leaders" },
          { id: "l1neg3", emoji: "🎪", label: "Communication feels like spin, not honesty" },
          { id: "l1neg4", emoji: "❓", label: "Direction shifts constantly with no explanation" },
          { id: "l1neg5", emoji: "😤", label: "Promises made in all-hands are never followed up" },
        ],
      },
      {
        id: "l2", sectionId: "leadership", icon: "🤝",
        text: "I trust that leadership makes decisions with the team's best interests in mind.",
        positiveWhys: [
          { id: "l2p1", emoji: "💡", label: "Decisions are explained with real reasoning" },
          { id: "l2p2", emoji: "🛡️", label: "Leadership protects the team from unnecessary pressure" },
          { id: "l2p3", emoji: "🙌", label: "I've seen them take accountability publicly" },
          { id: "l2p4", emoji: "🎯", label: "Trade-offs are honest and transparent" },
          { id: "l2p5", emoji: "💚", label: "Team wellbeing visibly factors into decisions" },
        ],
        neutralWhys: [
          { id: "l2n1", emoji: "🤔", label: "Some decisions feel like they prioritize optics" },
          { id: "l2n2", emoji: "🔭", label: "Hard to tell if team input is genuinely weighed" },
          { id: "l2n3", emoji: "⚖️", label: "Business needs often win over people needs" },
          { id: "l2n4", emoji: "🕳️", label: "Reasoning behind big calls is rarely shared" },
          { id: "l2n5", emoji: "🌊", label: "Trust fluctuates depending on the situation" },
        ],
        negativeWhys: [
          { id: "l2neg1", emoji: "💔", label: "Decisions feel self-serving, not team-first" },
          { id: "l2neg2", emoji: "🚫", label: "Team feedback is collected but visibly ignored" },
          { id: "l2neg3", emoji: "🎭", label: "Stated values and actual decisions don't align" },
          { id: "l2neg4", emoji: "😞", label: "I've been burned by trusting leadership before" },
          { id: "l2neg5", emoji: "🔇", label: "No accountability when things go wrong" },
        ],
      },
      {
        id: "l3", sectionId: "leadership", icon: "👁️",
        text: "Leadership is visible and accessible when it matters most.",
        positiveWhys: [
          { id: "l3p1", emoji: "🚀", label: "Leaders show up during high-pressure moments" },
          { id: "l3p2", emoji: "🚪", label: "Open door feels genuinely open" },
          { id: "l3p3", emoji: "👋", label: "They engage in day-to-day team moments" },
          { id: "l3p4", emoji: "📞", label: "Easy to get time with leadership when needed" },
          { id: "l3p5", emoji: "🔥", label: "Visible in crises, not just calm periods" },
        ],
        neutralWhys: [
          { id: "l3n1", emoji: "🌀", label: "Accessible in theory, but hard to reach in practice" },
          { id: "l3n2", emoji: "🎯", label: "Visible during good times, less so when things are hard" },
          { id: "l3n3", emoji: "📅", label: "Rare interaction unless escalated" },
          { id: "l3n4", emoji: "🪟", label: "Presence feels performative sometimes" },
          { id: "l3n5", emoji: "⏳", label: "Response time makes access feel blocked" },
        ],
        negativeWhys: [
          { id: "l3neg1", emoji: "👻", label: "Leadership disappears when things go badly" },
          { id: "l3neg2", emoji: "📵", label: "No real way to get time with leaders" },
          { id: "l3neg3", emoji: "🏰", label: "Leadership feels isolated from the team's reality" },
          { id: "l3neg4", emoji: "🤷", label: "I don't even know who to go to with concerns" },
          { id: "l3neg5", emoji: "😶", label: "Raising issues upward feels pointless" },
        ],
      },
      {
        id: "l4", sectionId: "leadership", icon: "🎯",
        text: "I feel confident in the direction this organization is heading.",
        positiveWhys: [
          { id: "l4p1", emoji: "🗺️", label: "Strategy is clear and makes sense to me" },
          { id: "l4p2", emoji: "📈", label: "We're clearly making progress toward the goal" },
          { id: "l4p3", emoji: "🔥", label: "I'm excited about where we're going" },
          { id: "l4p4", emoji: "🧭", label: "Priorities are stable and well-communicated" },
          { id: "l4p5", emoji: "💪", label: "I believe the plan is realistic and achievable" },
        ],
        neutralWhys: [
          { id: "l4n1", emoji: "🌫️", label: "Direction feels unclear or keeps shifting" },
          { id: "l4n2", emoji: "🤷", label: "I understand the plan but don't believe in it fully" },
          { id: "l4n3", emoji: "🔄", label: "Goals change before we can make progress on them" },
          { id: "l4n4", emoji: "📉", label: "Progress feels stalled or unclear" },
          { id: "l4n5", emoji: "🎲", label: "It feels reactive more than strategic" },
        ],
        negativeWhys: [
          { id: "l4neg1", emoji: "❌", label: "I have no confidence in the current direction" },
          { id: "l4neg2", emoji: "😟", label: "Strategy feels out of touch with our reality" },
          { id: "l4neg3", emoji: "🚨", label: "The path feels risky and not well thought through" },
          { id: "l4neg4", emoji: "🏳️", label: "I've stopped trying to understand the strategy" },
          { id: "l4neg5", emoji: "💔", label: "I don't see a future here that excites me" },
        ],
      },
      {
        id: "l5", sectionId: "leadership", icon: "⚖️",
        text: "Senior leaders act consistently with the values this organization publicly commits to.",
        positiveWhys: [
          { id: "l5p1", emoji: "✅", label: "I see values in action, not just on a poster" },
          { id: "l5p2", emoji: "🪞", label: "Leaders hold themselves to the same standard" },
          { id: "l5p3", emoji: "🤝", label: "Behavior matches what we say we stand for" },
          { id: "l5p4", emoji: "🌟", label: "Leaders call out values violations, not ignore them" },
          { id: "l5p5", emoji: "💬", label: "Our values genuinely shape how decisions are made" },
        ],
        neutralWhys: [
          { id: "l5n1", emoji: "🌓", label: "Values are lived sometimes, not always" },
          { id: "l5n2", emoji: "📋", label: "Values are communicated but not deeply practiced" },
          { id: "l5n3", emoji: "🎭", label: "Some leaders live them; others clearly don't" },
          { id: "l5n4", emoji: "🔦", label: "Consistency depends on who's watching" },
          { id: "l5n5", emoji: "🕰️", label: "Values alignment fades under pressure" },
        ],
        negativeWhys: [
          { id: "l5neg1", emoji: "🎪", label: "Values are marketing, not how we actually operate" },
          { id: "l5neg2", emoji: "🚧", label: "Leaders actively contradict stated values" },
          { id: "l5neg3", emoji: "😡", label: "Hypocrisy from leadership erodes my trust" },
          { id: "l5neg4", emoji: "🔕", label: "Values violations go unaddressed or are normalized" },
          { id: "l5neg5", emoji: "🤐", label: "I've been told to not raise inconsistencies" },
        ],
      },
    ],
  },
  {
    id: "growth",
    title: "Growth & Career Development",
    description: "Support for learning, feedback quality, and career progression",
    icon: "🚀",
    color: "#7C3AED",
    gradient: "linear-gradient(135deg, #7C3AED, #A855F7)",
    questions: [
      {
        id: "g1", sectionId: "growth", icon: "📈",
        text: "I have clear opportunities to grow my skills and advance my career here.",
        positiveWhys: [
          { id: "g1p1", emoji: "🧑‍💻", label: "Stretch assignments and new challenges available" },
          { id: "g1p2", emoji: "🏆", label: "Promotion path is clear and achievable" },
          { id: "g1p3", emoji: "📚", label: "Learning investments are real and supported" },
          { id: "g1p4", emoji: "🚀", label: "I've already grown significantly in this role" },
          { id: "g1p5", emoji: "🎯", label: "My growth goals are taken seriously" },
        ],
        neutralWhys: [
          { id: "g1n1", emoji: "🌀", label: "Opportunities exist but aren't well-signposted" },
          { id: "g1n2", emoji: "⏳", label: "Growth feels slow compared to my ambition" },
          { id: "g1n3", emoji: "🪜", label: "The path forward is vague" },
          { id: "g1n4", emoji: "🔎", label: "I have to find growth opportunities myself" },
          { id: "g1n5", emoji: "🎲", label: "Advancement feels inconsistent across the team" },
        ],
        negativeWhys: [
          { id: "g1neg1", emoji: "🚫", label: "There is no real growth path here for me" },
          { id: "g1neg2", emoji: "😔", label: "I feel stuck and unchallenged" },
          { id: "g1neg3", emoji: "🕳️", label: "Career conversations have never happened" },
          { id: "g1neg4", emoji: "📉", label: "Promotions feel random or politically driven" },
          { id: "g1neg5", emoji: "🏳️", label: "I'm actively looking elsewhere because of this" },
        ],
      },
      {
        id: "g2", sectionId: "growth", icon: "💬",
        text: "My manager provides useful and timely feedback that helps me improve.",
        positiveWhys: [
          { id: "g2p1", emoji: "🎯", label: "Feedback is specific and actionable" },
          { id: "g2p2", emoji: "⏱️", label: "I get feedback when it's still relevant" },
          { id: "g2p3", emoji: "🪞", label: "My manager is honest, even when it's hard to hear" },
          { id: "g2p4", emoji: "📈", label: "I can see myself improving because of the feedback" },
          { id: "g2p5", emoji: "💬", label: "Feedback is two-way — I can share mine too" },
        ],
        neutralWhys: [
          { id: "g2n1", emoji: "📅", label: "Feedback only comes during formal reviews" },
          { id: "g2n2", emoji: "🌫️", label: "Feedback is too vague to act on" },
          { id: "g2n3", emoji: "🔄", label: "Good feedback, but not consistent enough" },
          { id: "g2n4", emoji: "🙉", label: "My manager mostly focuses on what's wrong" },
          { id: "g2n5", emoji: "🕰️", label: "Feedback arrives too late to matter" },
        ],
        negativeWhys: [
          { id: "g2neg1", emoji: "🔇", label: "I rarely receive any feedback at all" },
          { id: "g2neg2", emoji: "😟", label: "Feedback is demoralizing rather than helpful" },
          { id: "g2neg3", emoji: "🎭", label: "Feedback feels inconsistent or unfair" },
          { id: "g2neg4", emoji: "🤷", label: "I genuinely don't know how I'm performing" },
          { id: "g2neg5", emoji: "🚧", label: "Negative feedback is delivered in a harmful way" },
        ],
      },
      {
        id: "g3", sectionId: "growth", icon: "📚",
        text: "I have access to the learning resources I need to develop in my role.",
        positiveWhys: [
          { id: "g3p1", emoji: "🎓", label: "Training budget and resources are real and usable" },
          { id: "g3p2", emoji: "📖", label: "Time is protected for learning activities" },
          { id: "g3p3", emoji: "🔗", label: "Good internal knowledge-sharing exists" },
          { id: "g3p4", emoji: "🌐", label: "External courses and certifications are supported" },
          { id: "g3p5", emoji: "🧑‍🏫", label: "Mentoring and coaching are available" },
        ],
        neutralWhys: [
          { id: "g3n1", emoji: "📋", label: "Resources exist but aren't surfaced proactively" },
          { id: "g3n2", emoji: "⌛", label: "No dedicated time — I learn on my own time" },
          { id: "g3n3", emoji: "💸", label: "Budget exists but approvals are slow or blocked" },
          { id: "g3n4", emoji: "🔎", label: "Hard to find what's available to me" },
          { id: "g3n5", emoji: "🌀", label: "Resources exist but aren't relevant to my role" },
        ],
        negativeWhys: [
          { id: "g3neg1", emoji: "❌", label: "No learning resources or budget exist here" },
          { id: "g3neg2", emoji: "😤", label: "Learning time is sacrificed for case volume" },
          { id: "g3neg3", emoji: "🏔️", label: "Getting approval for anything learning-related is a battle" },
          { id: "g3neg4", emoji: "🕳️", label: "I feel behind because I can't develop here" },
          { id: "g3neg5", emoji: "😞", label: "Growth investment feels like an afterthought" },
        ],
      },
      {
        id: "g4", sectionId: "growth", icon: "🗺️",
        text: "My career goals are understood and actively supported by my manager.",
        positiveWhys: [
          { id: "g4p1", emoji: "🗓️", label: "We have regular career conversations" },
          { id: "g4p2", emoji: "🤝", label: "My manager advocates for my growth actively" },
          { id: "g4p3", emoji: "🎯", label: "My goals shape how work is assigned to me" },
          { id: "g4p4", emoji: "💡", label: "My manager connects me to opportunities" },
          { id: "g4p5", emoji: "🌟", label: "I feel genuinely invested in, not just used" },
        ],
        neutralWhys: [
          { id: "g4n1", emoji: "🌫️", label: "Goals are acknowledged but rarely revisited" },
          { id: "g4n2", emoji: "📅", label: "Career conversations are rare and surface-level" },
          { id: "g4n3", emoji: "🤷", label: "My manager means well but isn't proactive" },
          { id: "g4n4", emoji: "⚖️", label: "Support depends on how busy my manager is" },
          { id: "g4n5", emoji: "🔄", label: "I have to push to keep my goals visible" },
        ],
        negativeWhys: [
          { id: "g4neg1", emoji: "🔇", label: "My career goals have never come up" },
          { id: "g4neg2", emoji: "😔", label: "My manager doesn't know what I want" },
          { id: "g4neg3", emoji: "🚫", label: "My goals are acknowledged but never acted on" },
          { id: "g4neg4", emoji: "💔", label: "I feel like a resource, not a person with ambitions" },
          { id: "g4neg5", emoji: "🏳️", label: "I've stopped sharing my goals — it changes nothing" },
        ],
      },
      {
        id: "g5", sectionId: "growth", icon: "🛤️",
        text: "I see a realistic career path for myself within this organization.",
        positiveWhys: [
          { id: "g5p1", emoji: "🏆", label: "I can picture my next role here clearly" },
          { id: "g5p2", emoji: "📈", label: "People grow and get promoted here — I've seen it" },
          { id: "g5p3", emoji: "🗺️", label: "Career ladders are clear and publicly visible" },
          { id: "g5p4", emoji: "🎯", label: "I know exactly what I need to do to advance" },
          { id: "g5p5", emoji: "💪", label: "I feel optimistic about my future here" },
        ],
        neutralWhys: [
          { id: "g5n1", emoji: "🌫️", label: "Path is unclear — roles but no roadmap" },
          { id: "g5n2", emoji: "🎲", label: "Advancement feels luck-based or political" },
          { id: "g5n3", emoji: "🕳️", label: "There aren't enough senior roles to grow into" },
          { id: "g5n4", emoji: "⏳", label: "I can see a path but it's very long" },
          { id: "g5n5", emoji: "🔭", label: "Future depends too much on things I can't control" },
        ],
        negativeWhys: [
          { id: "g5neg1", emoji: "❌", label: "There is no path here — it's a dead end" },
          { id: "g5neg2", emoji: "😟", label: "Growth opportunities go to the same people always" },
          { id: "g5neg3", emoji: "🏳️", label: "I've accepted I need to leave to advance" },
          { id: "g5neg4", emoji: "💔", label: "My skills aren't valued or used here" },
          { id: "g5neg5", emoji: "🚨", label: "I'm actively looking because of this" },
        ],
      },
    ],
  },
  {
    id: "purpose",
    title: "Company Purpose & Alignment",
    description: "Connection to mission, values, and customer impact",
    icon: "🌟",
    color: "#0891B2",
    gradient: "linear-gradient(135deg, #0891B2, #06B6D4)",
    questions: [
      {
        id: "pu1", sectionId: "purpose", icon: "🔗",
        text: "I understand clearly how my daily work contributes to the company's broader mission.",
        positiveWhys: [
          { id: "pu1p1", emoji: "🔗", label: "I can draw a direct line from my work to the mission" },
          { id: "pu1p2", emoji: "💡", label: "My manager connects my work to the bigger picture" },
          { id: "pu1p3", emoji: "🌍", label: "I see customer impact from my contributions" },
          { id: "pu1p4", emoji: "🎯", label: "Goals at every level are clearly connected" },
          { id: "pu1p5", emoji: "🔥", label: "Purpose makes hard work feel meaningful" },
        ],
        neutralWhys: [
          { id: "pu1n1", emoji: "🌫️", label: "The mission feels abstract and distant" },
          { id: "pu1n2", emoji: "🔌", label: "My work feels disconnected from any bigger goal" },
          { id: "pu1n3", emoji: "🤷", label: "No one has ever explained how my role fits in" },
          { id: "pu1n4", emoji: "📋", label: "Goals are communicated but not contextualized" },
          { id: "pu1n5", emoji: "🎲", label: "I complete tasks but rarely understand the why" },
        ],
        negativeWhys: [
          { id: "pu1neg1", emoji: "❌", label: "I don't see how my work matters at all" },
          { id: "pu1neg2", emoji: "😞", label: "Work feels like box-ticking, not contribution" },
          { id: "pu1neg3", emoji: "🧩", label: "Company goals feel irrelevant to my day-to-day" },
          { id: "pu1neg4", emoji: "🏳️", label: "I've stopped trying to connect purpose to my tasks" },
          { id: "pu1neg5", emoji: "💔", label: "The mission doesn't resonate with me personally" },
        ],
      },
      {
        id: "pu2", sectionId: "purpose", icon: "🏅",
        text: "I feel proud to tell others where I work.",
        positiveWhys: [
          { id: "pu2p1", emoji: "✨", label: "Our reputation and impact genuinely excite me" },
          { id: "pu2p2", emoji: "🌍", label: "We do work that positively changes people's lives" },
          { id: "pu2p3", emoji: "💼", label: "It's a respected name I'm glad to be associated with" },
          { id: "pu2p4", emoji: "🚀", label: "I believe in what we're building" },
          { id: "pu2p5", emoji: "🏆", label: "Our culture and values are things I'd brag about" },
        ],
        neutralWhys: [
          { id: "pu2n1", emoji: "🤔", label: "Pride varies depending on what we're doing" },
          { id: "pu2n2", emoji: "🌓", label: "Some things I'm proud of, some not so much" },
          { id: "pu2n3", emoji: "🎭", label: "Public brand doesn't match internal reality" },
          { id: "pu2n4", emoji: "😐", label: "I'm neutral — it's a job, nothing more" },
          { id: "pu2n5", emoji: "🔭", label: "I was more proud earlier — that's faded" },
        ],
        negativeWhys: [
          { id: "pu2neg1", emoji: "😞", label: "I avoid talking about where I work" },
          { id: "pu2neg2", emoji: "🚧", label: "Recent decisions have embarrassed me" },
          { id: "pu2neg3", emoji: "🎭", label: "What we promise externally vs. internally is very different" },
          { id: "pu2neg4", emoji: "💔", label: "I no longer connect with what we stand for" },
          { id: "pu2neg5", emoji: "🏳️", label: "The brand has been damaged by things I've witnessed" },
        ],
      },
      {
        id: "pu3", sectionId: "purpose", icon: "💎",
        text: "This organization consistently lives by the values it publicly commits to.",
        positiveWhys: [
          { id: "pu3p1", emoji: "✅", label: "Values are embedded in how we actually work" },
          { id: "pu3p2", emoji: "🪞", label: "Leaders model the values, not just preach them" },
          { id: "pu3p3", emoji: "💬", label: "Value violations are addressed, not swept aside" },
          { id: "pu3p4", emoji: "🌟", label: "I feel the values in my day-to-day experience" },
          { id: "pu3p5", emoji: "🤝", label: "Values shape how decisions are made under pressure" },
        ],
        neutralWhys: [
          { id: "pu3n1", emoji: "🌓", label: "Values are lived in some teams but not others" },
          { id: "pu3n2", emoji: "📋", label: "Values exist on paper but rarely drive decisions" },
          { id: "pu3n3", emoji: "🎭", label: "Some leaders live them; many don't" },
          { id: "pu3n4", emoji: "🔦", label: "Consistency drops when under business pressure" },
          { id: "pu3n5", emoji: "🌀", label: "Values are referenced but not genuinely integrated" },
        ],
        negativeWhys: [
          { id: "pu3neg1", emoji: "❌", label: "Values are marketing — not how we actually behave" },
          { id: "pu3neg2", emoji: "😡", label: "Hypocrisy between stated and lived values is obvious" },
          { id: "pu3neg3", emoji: "🚧", label: "I've witnessed clear violations with no consequences" },
          { id: "pu3neg4", emoji: "🔕", label: "Raising values misalignment is discouraged" },
          { id: "pu3neg5", emoji: "💔", label: "I've lost faith in the values being real" },
        ],
      },
      {
        id: "pu4", sectionId: "purpose", icon: "🌍",
        text: "I believe our work makes a genuine positive impact for the customers we serve.",
        positiveWhys: [
          { id: "pu4p1", emoji: "🌍", label: "Customer feedback confirms our positive impact" },
          { id: "pu4p2", emoji: "💡", label: "I can see real change driven by what we ship" },
          { id: "pu4p3", emoji: "🔥", label: "Customer stories inspire and motivate me" },
          { id: "pu4p4", emoji: "🎯", label: "We solve real, meaningful problems" },
          { id: "pu4p5", emoji: "💚", label: "Impact is measurable, not just claimed" },
        ],
        neutralWhys: [
          { id: "pu4n1", emoji: "🌫️", label: "Hard to see if our work really changes anything" },
          { id: "pu4n2", emoji: "🔌", label: "Customer impact feels distant from my daily role" },
          { id: "pu4n3", emoji: "📊", label: "Metrics exist but don't tell a human story" },
          { id: "pu4n4", emoji: "🤷", label: "I'm not sure our work is as impactful as claimed" },
          { id: "pu4n5", emoji: "⏳", label: "Impact is real but hard to feel in the short term" },
        ],
        negativeWhys: [
          { id: "pu4neg1", emoji: "❌", label: "I don't believe our work makes a real difference" },
          { id: "pu4neg2", emoji: "😞", label: "We cause more friction for customers than we solve" },
          { id: "pu4neg3", emoji: "📉", label: "Customer satisfaction signals are heading the wrong way" },
          { id: "pu4neg4", emoji: "🎭", label: "Impact claims feel exaggerated or performative" },
          { id: "pu4neg5", emoji: "💔", label: "I've stopped believing in the purpose we're sold" },
        ],
      },
      {
        id: "pu5", sectionId: "purpose", icon: "🎯",
        text: "I understand the company's goals and feel motivated to contribute to them.",
        positiveWhys: [
          { id: "pu5p1", emoji: "🗺️", label: "Goals are clear, compelling, and well-communicated" },
          { id: "pu5p2", emoji: "🔥", label: "I'm personally energized by what we're trying to achieve" },
          { id: "pu5p3", emoji: "🎯", label: "I can see how my work directly contributes" },
          { id: "pu5p4", emoji: "💪", label: "The goals challenge and stretch me" },
          { id: "pu5p5", emoji: "🌟", label: "Progress toward goals is visible and celebrated" },
        ],
        neutralWhys: [
          { id: "pu5n1", emoji: "🌫️", label: "Goals are shared but I don't find them inspiring" },
          { id: "pu5n2", emoji: "🔄", label: "Goals keep changing before we achieve them" },
          { id: "pu5n3", emoji: "📋", label: "Goals feel more like metrics than real direction" },
          { id: "pu5n4", emoji: "🤷", label: "I understand the goals but they don't motivate me" },
          { id: "pu5n5", emoji: "🕳️", label: "My work doesn't feel tied to the stated goals" },
        ],
        negativeWhys: [
          { id: "pu5neg1", emoji: "❌", label: "Goals are unclear, unrealistic, or constantly shifting" },
          { id: "pu5neg2", emoji: "😤", label: "I've disengaged from company-level objectives" },
          { id: "pu5neg3", emoji: "🏳️", label: "I work for a paycheck, not the mission" },
          { id: "pu5neg4", emoji: "😞", label: "Goals feel imposed rather than co-created" },
          { id: "pu5neg5", emoji: "💔", label: "I no longer feel a connection to where we're going" },
        ],
      },
    ],
  },
  {
    id: "team",
    title: "Team Relationships",
    description: "Belonging, collaboration, and peer respect",
    icon: "🤝",
    color: "#059669",
    gradient: "linear-gradient(135deg, #059669, #10B981)",
    questions: [
      {
        id: "t1", sectionId: "team", icon: "⚡",
        text: "My team collaborates effectively and genuinely supports one another.",
        positiveWhys: [
          { id: "t1p1", emoji: "🤗", label: "We jump in to help each other without being asked" },
          { id: "t1p2", emoji: "⚡", label: "Collaboration is smooth — we have a great rhythm" },
          { id: "t1p3", emoji: "🎯", label: "Team goals are shared and prioritized together" },
          { id: "t1p4", emoji: "🛡️", label: "No one is left to sink alone on hard problems" },
          { id: "t1p5", emoji: "🙌", label: "We celebrate each other's wins genuinely" },
        ],
        neutralWhys: [
          { id: "t1n1", emoji: "🌊", label: "Collaboration quality varies by project" },
          { id: "t1n2", emoji: "⏳", label: "Good teamwork, but we rarely go beyond task-level" },
          { id: "t1n3", emoji: "🎭", label: "Dynamics differ a lot between team members" },
          { id: "t1n4", emoji: "📱", label: "Remote setup makes collaboration harder" },
          { id: "t1n5", emoji: "🔄", label: "Support is reactive rather than proactive" },
        ],
        negativeWhys: [
          { id: "t1neg1", emoji: "🥶", label: "Everyone works in silos — it's very fragmented" },
          { id: "t1neg2", emoji: "🔇", label: "Asking for help feels like an imposition" },
          { id: "t1neg3", emoji: "⚔️", label: "Internal competition damages real collaboration" },
          { id: "t1neg4", emoji: "😤", label: "Work gets blocked waiting on team members" },
          { id: "t1neg5", emoji: "💔", label: "I often feel I'm on my own when things get hard" },
        ],
      },
      {
        id: "t2", sectionId: "team", icon: "🫂",
        text: "I feel a strong sense of belonging within my team.",
        positiveWhys: [
          { id: "t2p1", emoji: "🏡", label: "This team feels like a place I genuinely belong" },
          { id: "t2p2", emoji: "🤗", label: "I feel welcomed as my full self" },
          { id: "t2p3", emoji: "🌟", label: "My presence and contributions are valued" },
          { id: "t2p4", emoji: "💬", label: "I can be honest and vulnerable with this team" },
          { id: "t2p5", emoji: "🎉", label: "Team culture actively includes everyone" },
        ],
        neutralWhys: [
          { id: "t2n1", emoji: "🌀", label: "I belong sometimes — other times I feel like an outsider" },
          { id: "t2n2", emoji: "🌫️", label: "It's professional but rarely personal" },
          { id: "t2n3", emoji: "📱", label: "Remote work makes it hard to feel truly included" },
          { id: "t2n4", emoji: "👥", label: "Cliques make it hard to feel like part of the team" },
          { id: "t2n5", emoji: "🕰️", label: "I'm newer so belonging is still building" },
        ],
        negativeWhys: [
          { id: "t2neg1", emoji: "😶", label: "I don't feel I truly belong here" },
          { id: "t2neg2", emoji: "🚪", label: "I feel excluded from key conversations and decisions" },
          { id: "t2neg3", emoji: "🥶", label: "The team culture feels cold and unwelcoming" },
          { id: "t2neg4", emoji: "🤐", label: "I don't feel safe bringing my full self to work" },
          { id: "t2neg5", emoji: "😔", label: "I feel invisible in this team most of the time" },
        ],
      },
      {
        id: "t3", sectionId: "team", icon: "🙏",
        text: "My colleagues treat me with respect and value my contributions.",
        positiveWhys: [
          { id: "t3p1", emoji: "🌟", label: "My ideas are listened to and built on" },
          { id: "t3p2", emoji: "🤝", label: "I'm treated with consistent respect" },
          { id: "t3p3", emoji: "🙌", label: "Credit is given where it's genuinely due" },
          { id: "t3p4", emoji: "🎯", label: "My expertise is recognized and utilized" },
          { id: "t3p5", emoji: "💬", label: "I feel heard in meetings and discussions" },
        ],
        neutralWhys: [
          { id: "t3n1", emoji: "🌓", label: "Respect depends on who I'm working with" },
          { id: "t3n2", emoji: "🔦", label: "I'm respected but my contributions aren't always visible" },
          { id: "t3n3", emoji: "🤷", label: "Some people engage with my ideas, others don't" },
          { id: "t3n4", emoji: "🎭", label: "Respect differs in public vs. private settings" },
          { id: "t3n5", emoji: "⏳", label: "Still building credibility with the team" },
        ],
        negativeWhys: [
          { id: "t3neg1", emoji: "😡", label: "My contributions are regularly dismissed or minimized" },
          { id: "t3neg2", emoji: "🚧", label: "I've experienced disrespect that wasn't addressed" },
          { id: "t3neg3", emoji: "🎪", label: "Credit for my work goes to others" },
          { id: "t3neg4", emoji: "💔", label: "My ideas are ignored until someone else says the same thing" },
          { id: "t3neg5", emoji: "😤", label: "I feel undervalued by the people I work closest with" },
        ],
      },
      {
        id: "t4", sectionId: "team", icon: "🛡️",
        text: "I have at least one trusted colleague I can turn to when things get difficult.",
        positiveWhys: [
          { id: "t4p1", emoji: "🤝", label: "I have a real ally on this team" },
          { id: "t4p2", emoji: "💬", label: "I can be honest about struggles with a peer" },
          { id: "t4p3", emoji: "🛡️", label: "My trusted colleague has my back" },
          { id: "t4p4", emoji: "🌟", label: "Trust on this team has been built over time" },
          { id: "t4p5", emoji: "🫂", label: "I've been supported in genuinely hard moments" },
        ],
        neutralWhys: [
          { id: "t4n1", emoji: "🌀", label: "I have surface-level connections but nothing deep" },
          { id: "t4n2", emoji: "📱", label: "Remote work makes building real trust harder" },
          { id: "t4n3", emoji: "🕰️", label: "Still building those relationships — I'm relatively new" },
          { id: "t4n4", emoji: "🌫️", label: "Relationships are friendly but not trusting enough" },
          { id: "t4n5", emoji: "⚖️", label: "I have one — but I shouldn't have to rely on just one" },
        ],
        negativeWhys: [
          { id: "t4neg1", emoji: "😔", label: "I have no one I trust on this team" },
          { id: "t4neg2", emoji: "🚪", label: "The team feels like a collection of strangers" },
          { id: "t4neg3", emoji: "🤐", label: "I don't feel safe being vulnerable with colleagues" },
          { id: "t4neg4", emoji: "💔", label: "Previous attempts to build trust have been bruised" },
          { id: "t4neg5", emoji: "🥶", label: "Team culture doesn't allow for real connection" },
        ],
      },
      {
        id: "t5", sectionId: "team", icon: "💬",
        text: "My team communicates openly and works through disagreements constructively.",
        positiveWhys: [
          { id: "t5p1", emoji: "🗣️", label: "Disagreements are healthy and well-handled" },
          { id: "t5p2", emoji: "🔄", label: "We clear the air quickly when tensions arise" },
          { id: "t5p3", emoji: "💬", label: "Honest feedback flows in all directions" },
          { id: "t5p4", emoji: "🌟", label: "Debates make our work stronger, not weaker" },
          { id: "t5p5", emoji: "🤝", label: "We disagree without it becoming personal" },
        ],
        neutralWhys: [
          { id: "t5n1", emoji: "🌊", label: "Some tensions go unresolved for too long" },
          { id: "t5n2", emoji: "🎭", label: "Disagreements are avoided rather than resolved" },
          { id: "t5n3", emoji: "📱", label: "Async comms make it hard to work through conflict" },
          { id: "t5n4", emoji: "🌫️", label: "Communication is professional but not always open" },
          { id: "t5n5", emoji: "⚖️", label: "Some voices dominate discussions too much" },
        ],
        negativeWhys: [
          { id: "t5neg1", emoji: "⚔️", label: "Unresolved conflict creates ongoing tension" },
          { id: "t5neg2", emoji: "🔇", label: "Disagreements are suppressed, not resolved" },
          { id: "t5neg3", emoji: "😡", label: "Conflict turns personal and unprofessional" },
          { id: "t5neg4", emoji: "🚧", label: "Communication breakdowns affect delivery" },
          { id: "t5neg5", emoji: "😶", label: "I stay silent to avoid triggering conflict" },
        ],
      },
    ],
  },
  {
    id: "culture",
    title: "Workplace Culture & Values",
    description: "Inclusion, psychological safety, and cultural consistency",
    icon: "🏛️",
    color: "#D97706",
    gradient: "linear-gradient(135deg, #D97706, #F59E0B)",
    questions: [
      {
        id: "c1", sectionId: "culture", icon: "🛡️",
        text: "I feel safe speaking up about concerns or ideas without fear of negative consequences.",
        positiveWhys: [
          { id: "c1p1", emoji: "🗣️", label: "I speak up regularly and it's received well" },
          { id: "c1p2", emoji: "🛡️", label: "No fear of retaliation for honest feedback" },
          { id: "c1p3", emoji: "💬", label: "Concerns are taken seriously, not brushed aside" },
          { id: "c1p4", emoji: "🌟", label: "Candor is genuinely valued in this culture" },
          { id: "c1p5", emoji: "🤝", label: "My manager actively creates space for honesty" },
        ],
        neutralWhys: [
          { id: "c1n1", emoji: "🌓", label: "Safety to speak up depends on the topic or person" },
          { id: "c1n2", emoji: "🎯", label: "Some concerns are welcomed, others clearly aren't" },
          { id: "c1n3", emoji: "🎭", label: "Safe in 1:1s but not in group settings" },
          { id: "c1n4", emoji: "📋", label: "Feedback channels exist but rarely lead to anything" },
          { id: "c1n5", emoji: "⚖️", label: "I selectively share based on the perceived risk" },
        ],
        negativeWhys: [
          { id: "c1neg1", emoji: "😶", label: "I don't feel safe speaking up at all" },
          { id: "c1neg2", emoji: "🚧", label: "I've seen people get burned for raising concerns" },
          { id: "c1neg3", emoji: "🔕", label: "Concerns are dismissed or minimized regularly" },
          { id: "c1neg4", emoji: "😤", label: "Speaking up has caused problems for me before" },
          { id: "c1neg5", emoji: "🤐", label: "I've learned to stay quiet to protect myself" },
        ],
      },
      {
        id: "c2", sectionId: "culture", icon: "⚖️",
        text: "People of all backgrounds and identities are treated equitably in this organization.",
        positiveWhys: [
          { id: "c2p1", emoji: "🌈", label: "Inclusion is genuinely practiced, not just claimed" },
          { id: "c2p2", emoji: "⚖️", label: "Equitable treatment is consistently modeled" },
          { id: "c2p3", emoji: "🌍", label: "Diverse perspectives are actively sought out" },
          { id: "c2p4", emoji: "🛡️", label: "Bias concerns are taken seriously when raised" },
          { id: "c2p5", emoji: "🏆", label: "Advancement opportunities are equitable across groups" },
        ],
        neutralWhys: [
          { id: "c2n1", emoji: "🌓", label: "Intentions are good but equity isn't always achieved" },
          { id: "c2n2", emoji: "🔭", label: "DEI efforts exist but feel surface-level" },
          { id: "c2n3", emoji: "👂", label: "Some voices are heard much more than others" },
          { id: "c2n4", emoji: "🌀", label: "Consistency of equitable treatment varies by team" },
          { id: "c2n5", emoji: "📋", label: "Policies exist but culture hasn't fully caught up" },
        ],
        negativeWhys: [
          { id: "c2neg1", emoji: "🚧", label: "Bias and inequity are visible and unaddressed" },
          { id: "c2neg2", emoji: "😡", label: "I have experienced or witnessed unfair treatment" },
          { id: "c2neg3", emoji: "🎭", label: "Inclusion is a talking point, not a reality" },
          { id: "c2neg4", emoji: "🔕", label: "Equity concerns are minimized or dismissed" },
          { id: "c2neg5", emoji: "💔", label: "Certain groups are visibly disadvantaged here" },
        ],
      },
      {
        id: "c3", sectionId: "culture", icon: "🪞",
        text: "Our team culture genuinely reflects the values this organization says it cares about.",
        positiveWhys: [
          { id: "c3p1", emoji: "✅", label: "I live the values daily — they're not just words" },
          { id: "c3p2", emoji: "🌟", label: "Culture and stated values are genuinely aligned" },
          { id: "c3p3", emoji: "🤝", label: "My team actively upholds the culture we want" },
          { id: "c3p4", emoji: "💬", label: "Culture is discussed and refined, not just assumed" },
          { id: "c3p5", emoji: "🔥", label: "I'm proud of the culture we've built together" },
        ],
        neutralWhys: [
          { id: "c3n1", emoji: "🌓", label: "Culture is good in some areas, weaker in others" },
          { id: "c3n2", emoji: "🎭", label: "Stated values and actual culture have gaps" },
          { id: "c3n3", emoji: "🌀", label: "Culture quality varies across teams and managers" },
          { id: "c3n4", emoji: "📋", label: "Values are referenced but not deeply lived" },
          { id: "c3n5", emoji: "🕰️", label: "Culture was better before recent changes" },
        ],
        negativeWhys: [
          { id: "c3neg1", emoji: "❌", label: "The culture doesn't reflect the stated values at all" },
          { id: "c3neg2", emoji: "😞", label: "I'm disappointed by the gap between words and reality" },
          { id: "c3neg3", emoji: "🚨", label: "Cultural problems are ignored or normalized" },
          { id: "c3neg4", emoji: "💔", label: "The culture is actively harmful to some people" },
          { id: "c3neg5", emoji: "🏳️", label: "I've disengaged from caring about the culture" },
        ],
      },
      {
        id: "c4", sectionId: "culture", icon: "✅",
        text: "I rarely experience or witness behavior that contradicts our stated values.",
        positiveWhys: [
          { id: "c4p1", emoji: "🌟", label: "Values violations are rare and quickly addressed" },
          { id: "c4p2", emoji: "🛡️", label: "People hold each other accountable to the culture" },
          { id: "c4p3", emoji: "✅", label: "I genuinely don't see many contradictions" },
          { id: "c4p4", emoji: "🤝", label: "Trust in our values is backed by consistent behavior" },
          { id: "c4p5", emoji: "💚", label: "The culture feels healthy and genuine" },
        ],
        neutralWhys: [
          { id: "c4n1", emoji: "🌀", label: "It depends on the team and the individual" },
          { id: "c4n2", emoji: "🌓", label: "Some contradictions happen but are addressed" },
          { id: "c4n3", emoji: "🔦", label: "Behavior is better when leadership is watching" },
          { id: "c4n4", emoji: "🎭", label: "Some value violations slip through unaddressed" },
          { id: "c4n5", emoji: "⏳", label: "Culture contradictions have worsened recently" },
        ],
        negativeWhys: [
          { id: "c4neg1", emoji: "😤", label: "I see value violations regularly go unchallenged" },
          { id: "c4neg2", emoji: "🚧", label: "Behavior that contradicts our values is normalized" },
          { id: "c4neg3", emoji: "🔕", label: "Raising culture concerns makes things worse" },
          { id: "c4neg4", emoji: "💔", label: "I've become desensitized to the contradictions" },
          { id: "c4neg5", emoji: "🏳️", label: "I've stopped reporting issues because nothing changes" },
        ],
      },
      {
        id: "c5", sectionId: "culture", icon: "🌈",
        text: "Diverse perspectives and ideas are actively welcomed and respected here.",
        positiveWhys: [
          { id: "c5p1", emoji: "🌈", label: "Different viewpoints make our team stronger" },
          { id: "c5p2", emoji: "💡", label: "Contrarian or different ideas are genuinely explored" },
          { id: "c5p3", emoji: "🌍", label: "Diversity of background is celebrated, not just tolerated" },
          { id: "c5p4", emoji: "🤝", label: "Everyone has a real voice in discussions" },
          { id: "c5p5", emoji: "🌟", label: "I've seen my diverse perspective drive real change" },
        ],
        neutralWhys: [
          { id: "c5n1", emoji: "🌓", label: "Diversity is valued in theory, inconsistently in practice" },
          { id: "c5n2", emoji: "👥", label: "Certain voices and views dominate regardless" },
          { id: "c5n3", emoji: "🎭", label: "Welcoming different perspectives depends on the topic" },
          { id: "c5n4", emoji: "📋", label: "Diversity initiatives exist but cultural change is slow" },
          { id: "c5n5", emoji: "🤷", label: "Some teams are great, others are clearly not" },
        ],
        negativeWhys: [
          { id: "c5neg1", emoji: "🔕", label: "Different perspectives are ignored or dismissed" },
          { id: "c5neg2", emoji: "😤", label: "The same voices dominate every conversation" },
          { id: "c5neg3", emoji: "🚧", label: "Challenging the dominant view isn't safe here" },
          { id: "c5neg4", emoji: "💔", label: "I've stopped sharing my perspective because it's ignored" },
          { id: "c5neg5", emoji: "😶", label: "Diversity is a checkbox, not a genuine value" },
        ],
      },
    ],
  },
  {
    id: "wellbeing",
    title: "Work-Life Balance & Wellbeing",
    description: "Workload sustainability and genuine support for wellbeing",
    icon: "💚",
    color: "#DC2626",
    gradient: "linear-gradient(135deg, #DC2626, #EF4444)",
    questions: [
      {
        id: "w1", sectionId: "wellbeing", icon: "⚖️",
        text: "My overall workload is sustainable over the long term.",
        positiveWhys: [
          { id: "w1p1", emoji: "🧘", label: "Workload feels balanced and manageable" },
          { id: "w1p2", emoji: "🎯", label: "Priorities are clear so I'm not stretched thin" },
          { id: "w1p3", emoji: "💚", label: "My manager actively protects me from overload" },
          { id: "w1p4", emoji: "📅", label: "Deadlines are realistic and respected" },
          { id: "w1p5", emoji: "🌟", label: "I feel energized, not depleted, by the work" },
        ],
        neutralWhys: [
          { id: "w1n1", emoji: "🌊", label: "Workload fluctuates — sometimes too high" },
          { id: "w1n2", emoji: "🔄", label: "Good periods and hard periods roughly balance out" },
          { id: "w1n3", emoji: "📊", label: "Workload is okay but room to breathe is rare" },
          { id: "w1n4", emoji: "⏳", label: "Peaks are unsustainable but then it evens out" },
          { id: "w1n5", emoji: "🎭", label: "Sustainable on paper, harder in reality" },
        ],
        negativeWhys: [
          { id: "w1neg1", emoji: "🔥", label: "My workload is genuinely unsustainable right now" },
          { id: "w1neg2", emoji: "😴", label: "I'm constantly exhausted by the pace" },
          { id: "w1neg3", emoji: "📉", label: "Quality is suffering because I'm spread too thin" },
          { id: "w1neg4", emoji: "😤", label: "Work keeps expanding with no extra support" },
          { id: "w1neg5", emoji: "🚨", label: "I'm heading toward burnout if this continues" },
        ],
      },
      {
        id: "w2", sectionId: "wellbeing", icon: "🔋",
        text: "I am able to genuinely disconnect from work outside of working hours.",
        positiveWhys: [
          { id: "w2p1", emoji: "🏡", label: "I genuinely switch off after work" },
          { id: "w2p2", emoji: "📵", label: "No expectation to respond outside of hours" },
          { id: "w2p3", emoji: "🧘", label: "I have real space to recharge" },
          { id: "w2p4", emoji: "💚", label: "Boundaries I set are respected consistently" },
          { id: "w2p5", emoji: "🌅", label: "Work doesn't follow me into personal time" },
        ],
        neutralWhys: [
          { id: "w2n1", emoji: "📲", label: "Hard to fully disconnect from Slack/messages" },
          { id: "w2n2", emoji: "⏰", label: "Occasional after-hours expectation exists" },
          { id: "w2n3", emoji: "🌀", label: "I can disconnect but feel guilty doing so" },
          { id: "w2n4", emoji: "🎭", label: "Officially encouraged but culturally expected to stay on" },
          { id: "w2n5", emoji: "🌊", label: "Depends on project phase — sometimes impossible" },
        ],
        negativeWhys: [
          { id: "w2neg1", emoji: "📵", label: "I can never truly switch off" },
          { id: "w2neg2", emoji: "😤", label: "After-hours messages create real pressure to respond" },
          { id: "w2neg3", emoji: "😴", label: "Work anxiety follows me into personal time" },
          { id: "w2neg4", emoji: "💔", label: "My personal life is suffering because of work bleed" },
          { id: "w2neg5", emoji: "🚨", label: "I've stopped trying to disconnect — it doesn't work" },
        ],
      },
      {
        id: "w3", sectionId: "wellbeing", icon: "🚧",
        text: "My manager and team respect the boundaries I set around my personal time.",
        positiveWhys: [
          { id: "w3p1", emoji: "🛡️", label: "My boundaries are explicitly respected" },
          { id: "w3p2", emoji: "🤝", label: "My manager models healthy boundaries themselves" },
          { id: "w3p3", emoji: "💬", label: "I've set expectations and they've been honored" },
          { id: "w3p4", emoji: "💚", label: "No one expects me to be always-on" },
          { id: "w3p5", emoji: "🌟", label: "Team culture genuinely values personal time" },
        ],
        neutralWhys: [
          { id: "w3n1", emoji: "🌓", label: "Boundaries are respected most of the time" },
          { id: "w3n2", emoji: "⚖️", label: "Depends on who I'm working with" },
          { id: "w3n3", emoji: "🌀", label: "Respected in calm periods, ignored in crunch" },
          { id: "w3n4", emoji: "🎭", label: "Verbal respect, but implicit pressure to respond" },
          { id: "w3n5", emoji: "📋", label: "Policy supports it but culture doesn't always" },
        ],
        negativeWhys: [
          { id: "w3neg1", emoji: "😤", label: "My boundaries are regularly ignored" },
          { id: "w3neg2", emoji: "🚧", label: "Setting boundaries is seen as lack of commitment" },
          { id: "w3neg3", emoji: "😟", label: "I get pinged late at night or on weekends routinely" },
          { id: "w3neg4", emoji: "💔", label: "I feel punished for protecting my personal time" },
          { id: "w3neg5", emoji: "🏳️", label: "I've given up enforcing boundaries — easier to just comply" },
        ],
      },
      {
        id: "w4", sectionId: "wellbeing", icon: "🧠",
        text: "This organization genuinely cares about my mental health and overall wellbeing.",
        positiveWhys: [
          { id: "w4p1", emoji: "💚", label: "Wellbeing support is real and proactively offered" },
          { id: "w4p2", emoji: "🧠", label: "Mental health resources are accessible and promoted" },
          { id: "w4p3", emoji: "🤝", label: "I've felt genuinely supported during hard times" },
          { id: "w4p4", emoji: "🌟", label: "Wellbeing is a leadership priority, not just HR talk" },
          { id: "w4p5", emoji: "🛡️", label: "I feel safe disclosing struggles without career impact" },
        ],
        neutralWhys: [
          { id: "w4n1", emoji: "📋", label: "Programs exist but aren't meaningfully promoted" },
          { id: "w4n2", emoji: "🤷", label: "Caring about wellbeing is claimed but not felt" },
          { id: "w4n3", emoji: "🌀", label: "Support depends on my manager's attitude" },
          { id: "w4n4", emoji: "🎭", label: "Wellbeing language exists; follow-through doesn't" },
          { id: "w4n5", emoji: "⚖️", label: "Resources exist but I don't feel safe using them" },
        ],
        negativeWhys: [
          { id: "w4neg1", emoji: "💔", label: "My wellbeing is not a genuine priority here" },
          { id: "w4neg2", emoji: "😟", label: "Mental health struggles are seen as weakness" },
          { id: "w4neg3", emoji: "🚧", label: "I've been penalized for taking mental health time" },
          { id: "w4neg4", emoji: "🔕", label: "No meaningful support exists when I need it" },
          { id: "w4neg5", emoji: "😤", label: "Work culture actively harms my mental health" },
        ],
      },
      {
        id: "w5", sectionId: "wellbeing", icon: "🌅",
        text: "I feel energized and motivated most days rather than depleted.",
        positiveWhys: [
          { id: "w5p1", emoji: "☀️", label: "I genuinely look forward to work most days" },
          { id: "w5p2", emoji: "🔋", label: "My energy stays relatively consistent and healthy" },
          { id: "w5p3", emoji: "🌟", label: "The work itself is energizing and meaningful to me" },
          { id: "w5p4", emoji: "🚀", label: "Good team dynamics boost my motivation" },
          { id: "w5p5", emoji: "💚", label: "I feel fulfilled more often than depleted" },
        ],
        neutralWhys: [
          { id: "w5n1", emoji: "🌊", label: "Motivation fluctuates significantly week to week" },
          { id: "w5n2", emoji: "⚡", label: "Energized on good days, drained on bad ones" },
          { id: "w5n3", emoji: "🔄", label: "Passion exists but fatigue offsets it" },
          { id: "w5n4", emoji: "🌀", label: "Depends heavily on the type of work I'm doing" },
          { id: "w5n5", emoji: "📉", label: "Energy is slowly declining over time" },
        ],
        negativeWhys: [
          { id: "w5neg1", emoji: "😴", label: "I feel burned out and depleted most days" },
          { id: "w5neg2", emoji: "🔥", label: "Work drains me faster than I can recover" },
          { id: "w5neg3", emoji: "💔", label: "I've lost the motivation I had when I joined" },
          { id: "w5neg4", emoji: "🏳️", label: "I'm coasting because I have nothing left to give" },
          { id: "w5neg5", emoji: "😟", label: "I dread Mondays more often than not" },
        ],
      },
    ],
  },
  {
    id: "recognition",
    title: "Recognition & Feedback",
    description: "Fairness and meaningfulness of recognition and performance feedback",
    icon: "🏆",
    color: "#B45309",
    gradient: "linear-gradient(135deg, #B45309, #D97706)",
    questions: [
      {
        id: "r1", sectionId: "recognition", icon: "🌟",
        text: "My contributions are recognized in ways that feel meaningful and genuine to me.",
        positiveWhys: [
          { id: "r1p1", emoji: "🎉", label: "Recognition is timely, personal, and sincere" },
          { id: "r1p2", emoji: "🌟", label: "My specific contributions are called out clearly" },
          { id: "r1p3", emoji: "🤝", label: "Recognition from my manager feels genuine" },
          { id: "r1p4", emoji: "💬", label: "I get recognized in both private and public ways" },
          { id: "r1p5", emoji: "🔥", label: "Being recognized motivates me to do more" },
        ],
        neutralWhys: [
          { id: "r1n1", emoji: "🌓", label: "Recognition happens but feels formulaic" },
          { id: "r1n2", emoji: "⏳", label: "Recognition arrives too late to feel relevant" },
          { id: "r1n3", emoji: "📋", label: "Acknowledgment exists but lacks personal meaning" },
          { id: "r1n4", emoji: "🎲", label: "Recognition is inconsistent — sometimes yes, sometimes no" },
          { id: "r1n5", emoji: "🤷", label: "I appreciate it but it doesn't strongly impact me" },
        ],
        negativeWhys: [
          { id: "r1neg1", emoji: "😞", label: "My contributions go unnoticed regularly" },
          { id: "r1neg2", emoji: "🤫", label: "Good work is expected, never celebrated" },
          { id: "r1neg3", emoji: "💔", label: "I feel invisible despite consistently delivering" },
          { id: "r1neg4", emoji: "😤", label: "Others get recognition for work I contributed to" },
          { id: "r1neg5", emoji: "🏳️", label: "I've stopped expecting recognition — it never comes" },
        ],
      },
      {
        id: "r2", sectionId: "recognition", icon: "⚖️",
        text: "Feedback here is given fairly and consistently — not only when something goes wrong.",
        positiveWhys: [
          { id: "r2p1", emoji: "📣", label: "Positive feedback is given as often as constructive" },
          { id: "r2p2", emoji: "⚖️", label: "Feedback feels balanced and fair across the team" },
          { id: "r2p3", emoji: "🔄", label: "I get regular check-ins, not just crisis feedback" },
          { id: "r2p4", emoji: "💬", label: "Feedback is an ongoing conversation, not a one-off" },
          { id: "r2p5", emoji: "🌟", label: "Consistent feedback helps me feel grounded" },
        ],
        neutralWhys: [
          { id: "r2n1", emoji: "🌓", label: "Feedback comes but skews toward criticism" },
          { id: "r2n2", emoji: "📅", label: "Regular enough but not consistently balanced" },
          { id: "r2n3", emoji: "🌀", label: "Some managers give good feedback; mine doesn't" },
          { id: "r2n4", emoji: "🎲", label: "Feedback feels arbitrary or reactive" },
          { id: "r2n5", emoji: "⏳", label: "Mostly fine but positive feedback is rare" },
        ],
        negativeWhys: [
          { id: "r2neg1", emoji: "❌", label: "Feedback only comes when something goes wrong" },
          { id: "r2neg2", emoji: "😟", label: "I never know if I'm actually performing well" },
          { id: "r2neg3", emoji: "🔇", label: "The silence makes it hard to trust where I stand" },
          { id: "r2neg4", emoji: "😤", label: "Feedback feels weaponized, not developmental" },
          { id: "r2neg5", emoji: "💔", label: "The feedback culture here is unhealthy" },
        ],
      },
      {
        id: "r3", sectionId: "recognition", icon: "🏅",
        text: "High performance is genuinely acknowledged and rewarded in this organization.",
        positiveWhys: [
          { id: "r3p1", emoji: "🏆", label: "Top performers are visibly recognized and rewarded" },
          { id: "r3p2", emoji: "💰", label: "Compensation and rewards reflect performance" },
          { id: "r3p3", emoji: "🚀", label: "Exceptional work leads to real career advancement" },
          { id: "r3p4", emoji: "🌟", label: "High performers are celebrated, not just expected" },
          { id: "r3p5", emoji: "🎯", label: "Performance expectations and rewards are clearly linked" },
        ],
        neutralWhys: [
          { id: "r3n1", emoji: "🌓", label: "Acknowledgment exists but rewards don't follow" },
          { id: "r3n2", emoji: "🎲", label: "Rewards feel inconsistently applied" },
          { id: "r3n3", emoji: "⏳", label: "Recognition takes far too long to materialize" },
          { id: "r3n4", emoji: "🤷", label: "Hard to tell if performance really drives outcomes here" },
          { id: "r3n5", emoji: "📉", label: "The link between performance and reward is unclear" },
        ],
        negativeWhys: [
          { id: "r3neg1", emoji: "😞", label: "High performance goes unrewarded here" },
          { id: "r3neg2", emoji: "😡", label: "Politics matter more than performance for rewards" },
          { id: "r3neg3", emoji: "🚫", label: "Compensation doesn't reflect the value I deliver" },
          { id: "r3neg4", emoji: "💔", label: "I've been passed over despite strong performance" },
          { id: "r3neg5", emoji: "🏳️", label: "I've stopped going above and beyond — it's not worth it" },
        ],
      },
      {
        id: "r4", sectionId: "recognition", icon: "📡",
        text: "I receive the feedback I need to clearly understand how I am performing.",
        positiveWhys: [
          { id: "r4p1", emoji: "🎯", label: "I have a clear picture of where I stand" },
          { id: "r4p2", emoji: "📊", label: "Performance expectations are measurable and clear" },
          { id: "r4p3", emoji: "💬", label: "My manager keeps me informed proactively" },
          { id: "r4p4", emoji: "🪞", label: "Feedback is honest and helps me calibrate" },
          { id: "r4p5", emoji: "🌟", label: "I'm never surprised at review time" },
        ],
        neutralWhys: [
          { id: "r4n1", emoji: "🌫️", label: "Performance picture is fuzzy — I have to guess" },
          { id: "r4n2", emoji: "📅", label: "Feedback is mostly reserved for formal reviews" },
          { id: "r4n3", emoji: "🤷", label: "I know roughly where I stand but not the detail" },
          { id: "r4n4", emoji: "🔄", label: "Mixed signals make performance hard to read" },
          { id: "r4n5", emoji: "⏳", label: "Feedback comes too late to adjust in time" },
        ],
        negativeWhys: [
          { id: "r4neg1", emoji: "🤐", label: "I have no idea how I'm actually performing" },
          { id: "r4neg2", emoji: "😟", label: "I found out I had issues only at review time" },
          { id: "r4neg3", emoji: "🔇", label: "Silence on performance creates constant anxiety" },
          { id: "r4neg4", emoji: "📉", label: "Performance standards aren't clearly communicated" },
          { id: "r4neg5", emoji: "😤", label: "The lack of feedback feels like being kept in the dark" },
        ],
      },
      {
        id: "r5", sectionId: "recognition", icon: "🎯",
        text: "Recognition feels equitable — not reserved for a small group of people.",
        positiveWhys: [
          { id: "r5p1", emoji: "⚖️", label: "Recognition is spread fairly across the team" },
          { id: "r5p2", emoji: "🌟", label: "Everyone's contributions are visible and valued" },
          { id: "r5p3", emoji: "🌈", label: "No favoritism in how recognition is given" },
          { id: "r5p4", emoji: "🏆", label: "Recognition systems are fair and transparent" },
          { id: "r5p5", emoji: "💚", label: "I don't feel disadvantaged in how I'm recognized" },
        ],
        neutralWhys: [
          { id: "r5n1", emoji: "🌓", label: "Some people get recognized more but it's not blatant" },
          { id: "r5n2", emoji: "🎲", label: "Recognition feels a bit arbitrary at times" },
          { id: "r5n3", emoji: "👥", label: "Visible work gets recognized; invisible work doesn't" },
          { id: "r5n4", emoji: "🌀", label: "Equity depends on who your manager is" },
          { id: "r5n5", emoji: "📋", label: "Recognition policies are fair; practice is less so" },
        ],
        negativeWhys: [
          { id: "r5neg1", emoji: "🏴", label: "The same small group gets all the recognition" },
          { id: "r5neg2", emoji: "😡", label: "Recognition feels clearly biased or political" },
          { id: "r5neg3", emoji: "💔", label: "I've felt passed over for recognition unfairly" },
          { id: "r5neg4", emoji: "🤐", label: "Certain groups are systematically under-recognized" },
          { id: "r5neg5", emoji: "🏳️", label: "Unfair recognition is a major driver of disengagement for me" },
        ],
      },
    ],
  },
  {
    id: "enablement",
    title: "Enablement & Tools",
    description: "Access to tools, information, and processes that support effective work",
    icon: "⚡",
    color: "#2563EB",
    gradient: "linear-gradient(135deg, #2563EB, #3B82F6)",
    questions: [
      {
        id: "e1", sectionId: "enablement", icon: "🛠️",
        text: "I have the tools and technology I need to do my job effectively.",
        positiveWhys: [
          { id: "e1p1", emoji: "🛠️", label: "My toolset is modern and genuinely fit for purpose" },
          { id: "e1p2", emoji: "⚡", label: "Tools help me move fast — not slow me down" },
          { id: "e1p3", emoji: "🔧", label: "When tools break, they're fixed quickly" },
          { id: "e1p4", emoji: "🌟", label: "I have everything I need to do my best work" },
          { id: "e1p5", emoji: "🚀", label: "New tools are adopted proactively, not reluctantly" },
        ],
        neutralWhys: [
          { id: "e1n1", emoji: "🌀", label: "Tools work but are outdated or clunky" },
          { id: "e1n2", emoji: "🔄", label: "Adequate but I rely on workarounds too often" },
          { id: "e1n3", emoji: "💸", label: "Budget to get better tools is hard to access" },
          { id: "e1n4", emoji: "🕰️", label: "Tool improvement requests take too long to go anywhere" },
          { id: "e1n5", emoji: "🤷", label: "Works, but nowhere near what I need to excel" },
        ],
        negativeWhys: [
          { id: "e1neg1", emoji: "💀", label: "Tools are broken, outdated, or missing entirely" },
          { id: "e1neg2", emoji: "😤", label: "I lose significant time to tool failures daily" },
          { id: "e1neg3", emoji: "🏔️", label: "Getting better tools is a bureaucratic nightmare" },
          { id: "e1neg4", emoji: "😞", label: "I can't do my best work with what I have" },
          { id: "e1neg5", emoji: "🚨", label: "Poor tooling is actively impacting our quality and output" },
        ],
      },
      {
        id: "e2", sectionId: "enablement", icon: "🔍",
        text: "I have easy access to the information I need to do my work well.",
        positiveWhys: [
          { id: "e2p1", emoji: "📚", label: "Documentation is clear, current, and findable" },
          { id: "e2p2", emoji: "🔍", label: "I can find what I need quickly without asking" },
          { id: "e2p3", emoji: "🌐", label: "Knowledge is actively shared across the team" },
          { id: "e2p4", emoji: "💡", label: "Information flow is transparent and proactive" },
          { id: "e2p5", emoji: "🚀", label: "I'm never blocked waiting for information" },
        ],
        neutralWhys: [
          { id: "e2n1", emoji: "🔎", label: "Information exists but takes effort to find" },
          { id: "e2n2", emoji: "📋", label: "Documentation is incomplete or out of date" },
          { id: "e2n3", emoji: "🧩", label: "Key information is siloed in specific people or teams" },
          { id: "e2n4", emoji: "⏳", label: "I often have to wait for answers I need immediately" },
          { id: "e2n5", emoji: "🌀", label: "Tribal knowledge is everywhere — hard to navigate" },
        ],
        negativeWhys: [
          { id: "e2neg1", emoji: "🕳️", label: "Critical information is locked away or inaccessible" },
          { id: "e2neg2", emoji: "😤", label: "I waste hours chasing information I need to do my job" },
          { id: "e2neg3", emoji: "🧩", label: "Silos mean I often work with incomplete context" },
          { id: "e2neg4", emoji: "🔕", label: "Questions about access or documentation go unanswered" },
          { id: "e2neg5", emoji: "😞", label: "Poor information access makes me feel underequipped" },
        ],
      },
      {
        id: "e3", sectionId: "enablement", icon: "⚙️",
        text: "Processes and workflows here support rather than hinder my ability to get things done.",
        positiveWhys: [
          { id: "e3p1", emoji: "⚡", label: "Workflows are lean and genuinely efficient" },
          { id: "e3p2", emoji: "🚀", label: "Processes are designed to help, not create friction" },
          { id: "e3p3", emoji: "🔧", label: "Process feedback is welcomed and acted on" },
          { id: "e3p4", emoji: "🌟", label: "Less time on admin means more time on real work" },
          { id: "e3p5", emoji: "🎯", label: "Processes are proportionate to the actual need" },
        ],
        neutralWhys: [
          { id: "e3n1", emoji: "🌀", label: "Some processes help; others add unnecessary friction" },
          { id: "e3n2", emoji: "🕰️", label: "Workflows are functional but not optimized" },
          { id: "e3n3", emoji: "🔄", label: "Good processes but they're slow to evolve" },
          { id: "e3n4", emoji: "📋", label: "Too many approval steps for straightforward tasks" },
          { id: "e3n5", emoji: "🤷", label: "Adequate — but room to be much more enabling" },
        ],
        negativeWhys: [
          { id: "e3neg1", emoji: "🏔️", label: "Bureaucracy slows everything down significantly" },
          { id: "e3neg2", emoji: "😤", label: "Processes create more friction than they remove" },
          { id: "e3neg3", emoji: "⏳", label: "Approval cycles kill velocity and momentum" },
          { id: "e3neg4", emoji: "😞", label: "I spend more time on process than on actual work" },
          { id: "e3neg5", emoji: "🚨", label: "Process failures are regularly impacting deliverables" },
        ],
      },
      {
        id: "e4", sectionId: "enablement", icon: "🚧",
        text: "Unnecessary bureaucracy does not get in the way of doing my job well.",
        positiveWhys: [
          { id: "e4p1", emoji: "🚀", label: "I can move fast without fighting the system" },
          { id: "e4p2", emoji: "🎯", label: "Red tape is minimal and reasonable" },
          { id: "e4p3", emoji: "💡", label: "Decisions can be made at the right level" },
          { id: "e4p4", emoji: "🌟", label: "Bureaucracy has been actively reduced here" },
          { id: "e4p5", emoji: "🏃", label: "Autonomy is real — I don't need approval for everything" },
        ],
        neutralWhys: [
          { id: "e4n1", emoji: "🌀", label: "Some bureaucracy is unavoidable; some is excessive" },
          { id: "e4n2", emoji: "📋", label: "I work around it, but it costs real time" },
          { id: "e4n3", emoji: "⏳", label: "Approval cycles slow things that should be fast" },
          { id: "e4n4", emoji: "🔄", label: "It's better than before but still too heavy" },
          { id: "e4n5", emoji: "🤷", label: "Not crippling, but clearly not optimal" },
        ],
        negativeWhys: [
          { id: "e4neg1", emoji: "🏔️", label: "Bureaucracy is the single biggest drag on my productivity" },
          { id: "e4neg2", emoji: "😡", label: "Nothing moves without layers of unnecessary approvals" },
          { id: "e4neg3", emoji: "🕳️", label: "Process requirements are completely disproportionate" },
          { id: "e4neg4", emoji: "💔", label: "I feel disempowered by how much bureaucracy there is" },
          { id: "e4neg5", emoji: "🏳️", label: "I've learned to lower my expectations because of it" },
        ],
      },
      {
        id: "e5", sectionId: "enablement", icon: "📣",
        text: "When I raise concerns about tools or blockers, they are taken seriously and addressed.",
        positiveWhys: [
          { id: "e5p1", emoji: "🙌", label: "Blockers I raise get actioned quickly" },
          { id: "e5p2", emoji: "💬", label: "There's a clear channel for raising these concerns" },
          { id: "e5p3", emoji: "🛠️", label: "My manager removes blockers proactively" },
          { id: "e5p4", emoji: "🌟", label: "Raising tooling issues is welcomed and valued" },
          { id: "e5p5", emoji: "📈", label: "I can see concrete improvements from feedback I've given" },
        ],
        neutralWhys: [
          { id: "e5n1", emoji: "⏳", label: "Concerns are heard but action is slow" },
          { id: "e5n2", emoji: "📮", label: "Feedback goes in — outcome is unclear" },
          { id: "e5n3", emoji: "🌀", label: "Some blockers get fixed; others linger forever" },
          { id: "e5n4", emoji: "🤷", label: "Acknowledged but not truly prioritized" },
          { id: "e5n5", emoji: "🎲", label: "Outcome feels unpredictable when I raise issues" },
        ],
        negativeWhys: [
          { id: "e5neg1", emoji: "🙉", label: "Raised blockers are routinely ignored" },
          { id: "e5neg2", emoji: "😤", label: "I've stopped flagging issues because nothing changes" },
          { id: "e5neg3", emoji: "🔕", label: "Concerns disappear into a black hole" },
          { id: "e5neg4", emoji: "😞", label: "Raising blockers makes no difference to outcomes" },
          { id: "e5neg5", emoji: "💔", label: "I feel powerless to fix the things slowing me down" },
        ],
      },
    ],
  },
  {
    id: "remote",
    title: "Remote & Hybrid Experience",
    description: "Inclusion, flexibility, and equal opportunity for distributed team members",
    icon: "🌐",
    color: "#0F766E",
    gradient: "linear-gradient(135deg, #0F766E, #14B8A6)",
    questions: [
      {
        id: "rh1", sectionId: "remote", icon: "🌍",
        text: "I feel equally included regardless of whether I work remotely or in the office.",
        positiveWhys: [
          { id: "rh1p1", emoji: "🌍", label: "Remote and in-office are treated genuinely equally" },
          { id: "rh1p2", emoji: "🛡️", label: "No disadvantage for being remote in decisions or visibility" },
          { id: "rh1p3", emoji: "🎯", label: "Meetings and async work are designed to include everyone" },
          { id: "rh1p4", emoji: "💬", label: "My voice matters just as much regardless of location" },
          { id: "rh1p5", emoji: "🌟", label: "Hybrid works genuinely well for me" },
        ],
        neutralWhys: [
          { id: "rh1n1", emoji: "📶", label: "Remote occasionally feels like a slight disadvantage" },
          { id: "rh1n2", emoji: "🌀", label: "Inclusion quality depends on the specific meeting or team" },
          { id: "rh1n3", emoji: "🎭", label: "Policy supports hybrid; practice doesn't always follow" },
          { id: "rh1n4", emoji: "🕰️", label: "Office presence subtly rewards those who come in" },
          { id: "rh1n5", emoji: "🤷", label: "Mostly fine but informal advantages exist for in-office" },
        ],
        negativeWhys: [
          { id: "rh1neg1", emoji: "📵", label: "Remote workers are clearly at a disadvantage" },
          { id: "rh1neg2", emoji: "😞", label: "Key decisions happen in-office without remote input" },
          { id: "rh1neg3", emoji: "💔", label: "I feel like a second-class citizen when working remotely" },
          { id: "rh1neg4", emoji: "🚧", label: "Visibility and promotion favor in-office heavily" },
          { id: "rh1neg5", emoji: "😤", label: "I feel penalized for choosing to work remotely" },
        ],
      },
      {
        id: "rh2", sectionId: "remote", icon: "🔗",
        text: "Collaboration tools help my team stay genuinely connected and productive.",
        positiveWhys: [
          { id: "rh2p1", emoji: "🔧", label: "Our collaboration stack genuinely works well" },
          { id: "rh2p2", emoji: "⚡", label: "Async tools reduce friction and unnecessary meetings" },
          { id: "rh2p3", emoji: "🔗", label: "Tools help maintain real connection with the team" },
          { id: "rh2p4", emoji: "🚀", label: "Productivity stays high because of the tooling" },
          { id: "rh2p5", emoji: "🌟", label: "The tools we use are well-chosen for our workflow" },
        ],
        neutralWhys: [
          { id: "rh2n1", emoji: "🌀", label: "Tools are adequate but not optimal" },
          { id: "rh2n2", emoji: "📱", label: "Too many tools create noise and overlap" },
          { id: "rh2n3", emoji: "🎭", label: "Some tools work well; others create friction" },
          { id: "rh2n4", emoji: "⏳", label: "Tools work but async communication is slow" },
          { id: "rh2n5", emoji: "🤷", label: "Connection feels forced — tools can't replicate in-person" },
        ],
        negativeWhys: [
          { id: "rh2neg1", emoji: "💔", label: "Collaboration tools make remote work harder, not easier" },
          { id: "rh2neg2", emoji: "😤", label: "Tool fragmentation means things constantly fall through the cracks" },
          { id: "rh2neg3", emoji: "🔇", label: "Async communication delays kill our momentum" },
          { id: "rh2neg4", emoji: "🏔️", label: "Technical issues with tools are a constant drag" },
          { id: "rh2neg5", emoji: "😞", label: "Remote collaboration feels inferior to what it should be" },
        ],
      },
      {
        id: "rh3", sectionId: "remote", icon: "🕊️",
        text: "I have the flexibility I need in how and where I do my best work.",
        positiveWhys: [
          { id: "rh3p1", emoji: "🕊️", label: "I have genuine autonomy in when and where I work" },
          { id: "rh3p2", emoji: "🏡", label: "Flexible work arrangements are real, not just stated" },
          { id: "rh3p3", emoji: "🎯", label: "Results matter more than where I sit" },
          { id: "rh3p4", emoji: "💚", label: "Flexibility has improved my wellbeing and productivity" },
          { id: "rh3p5", emoji: "🌟", label: "I feel trusted to manage my own time and location" },
        ],
        neutralWhys: [
          { id: "rh3n1", emoji: "⏰", label: "Flexibility exists but has some conditions attached" },
          { id: "rh3n2", emoji: "🌀", label: "Policy allows it; cultural pressure sometimes contradicts" },
          { id: "rh3n3", emoji: "🎭", label: "Flexibility depends heavily on your manager" },
          { id: "rh3n4", emoji: "🔄", label: "Some flexibility — but less than officially stated" },
          { id: "rh3n5", emoji: "📋", label: "Formal flexibility without full psychological safety to use it" },
        ],
        negativeWhys: [
          { id: "rh3neg1", emoji: "🔒", label: "Very little genuine flexibility in how I work" },
          { id: "rh3neg2", emoji: "😤", label: "Flexibility is stated but culturally punished if used" },
          { id: "rh3neg3", emoji: "💔", label: "Rigid work requirements make my life significantly harder" },
          { id: "rh3neg4", emoji: "🏳️", label: "I've stopped asking because requests are consistently denied" },
          { id: "rh3neg5", emoji: "😞", label: "Lack of flexibility is a real reason I'm considering leaving" },
        ],
      },
      {
        id: "rh4", sectionId: "remote", icon: "🪄",
        text: "My manager ensures remote team members are not disadvantaged in meetings or key decisions.",
        positiveWhys: [
          { id: "rh4p1", emoji: "🛡️", label: "My manager actively amplifies remote voices in meetings" },
          { id: "rh4p2", emoji: "🎯", label: "Decisions wait for remote input — not made in the room" },
          { id: "rh4p3", emoji: "🪄", label: "Meeting design explicitly includes distributed participants" },
          { id: "rh4p4", emoji: "💬", label: "My manager checks in to ensure I'm not missing anything" },
          { id: "rh4p5", emoji: "🌟", label: "No one is disadvantaged based on location" },
        ],
        neutralWhys: [
          { id: "rh4n1", emoji: "🌓", label: "Mostly equitable but occasional blind spots exist" },
          { id: "rh4n2", emoji: "🤷", label: "Manager is aware but not consistently proactive about it" },
          { id: "rh4n3", emoji: "🌀", label: "Depends on the meeting format or situation" },
          { id: "rh4n4", emoji: "⚖️", label: "Remote input is invited but not always weighted equally" },
          { id: "rh4n5", emoji: "⏳", label: "Getting better, but not fully equitable yet" },
        ],
        negativeWhys: [
          { id: "rh4neg1", emoji: "😞", label: "Decisions happen in the room without remote input" },
          { id: "rh4neg2", emoji: "😤", label: "My manager doesn't think about remote inclusion" },
          { id: "rh4neg3", emoji: "💔", label: "I find out about key decisions after the fact" },
          { id: "rh4neg4", emoji: "🔕", label: "Remote voices are treated as less important" },
          { id: "rh4neg5", emoji: "🏳️", label: "I've disengaged from meetings where I can't influence anything" },
        ],
      },
      {
        id: "rh5", sectionId: "remote", icon: "🖥️",
        text: "My work setup enables me to perform at my best — wherever I work from.",
        positiveWhys: [
          { id: "rh5p1", emoji: "🖥️", label: "My equipment and setup are excellent" },
          { id: "rh5p2", emoji: "🏡", label: "Home office setup is well-supported by the company" },
          { id: "rh5p3", emoji: "⚡", label: "My internet, hardware, and software all work reliably" },
          { id: "rh5p4", emoji: "🌟", label: "Setup allowances or stipends make a real difference" },
          { id: "rh5p5", emoji: "💚", label: "I feel fully equipped to do my best work" },
        ],
        neutralWhys: [
          { id: "rh5n1", emoji: "🎛️", label: "Setup is functional but not well-optimized" },
          { id: "rh5n2", emoji: "💸", label: "I've invested personally because company support is limited" },
          { id: "rh5n3", emoji: "🌀", label: "Office setup is great; home setup is lacking" },
          { id: "rh5n4", emoji: "🔄", label: "Setup works, but connectivity issues come up" },
          { id: "rh5n5", emoji: "🤷", label: "Adequate but not what I'd need to truly excel" },
        ],
        negativeWhys: [
          { id: "rh5neg1", emoji: "🖥️", label: "Poor setup regularly impacts my performance" },
          { id: "rh5neg2", emoji: "😤", label: "No company support to improve my remote setup" },
          { id: "rh5neg3", emoji: "😞", label: "Hardware and connectivity issues are constant frustrations" },
          { id: "rh5neg4", emoji: "💔", label: "I can't do my best work in my current setup" },
          { id: "rh5neg5", emoji: "🚨", label: "Setup failures have caused real impact on my deliverables" },
        ],
      },
    ],
  },
];

export const ALL_QUESTIONS: EngQuestion[] = ENGAGEMENT_SECTIONS.flatMap((s) => s.questions);

export const PULSE_SURVEY_ID = "pulse-short";

export interface PulseQuestion {
  id: string;
  sectionId: string;
  icon: string;
  text: string;
  positiveWhys: WhyOption[];
  neutralWhys: WhyOption[];
  negativeWhys: WhyOption[];
}

// One behavioral question per section — avoids "I feel…" language per legal guidance
// Why chips are reused from the first question of each section
const PULSE_RAW: { id: string; sectionId: string; icon: string; text: string }[] = [
  { id: "p_leadership",  sectionId: "leadership",  icon: "🧭", text: "Leadership communicates direction clearly and acts consistently on it." },
  { id: "p_growth",      sectionId: "growth",      icon: "📈", text: "My role gives me genuine opportunities to develop new skills and grow." },
  { id: "p_purpose",     sectionId: "purpose",     icon: "🎯", text: "My day-to-day work connects to goals that matter beyond just completing tasks." },
  { id: "p_team",        sectionId: "team",        icon: "🤝", text: "My team collaborates effectively and looks out for one another." },
  { id: "p_culture",     sectionId: "culture",     icon: "🏛️", text: "The team's stated values are reflected in how decisions actually get made." },
  { id: "p_wellbeing",   sectionId: "wellbeing",   icon: "🔋", text: "My current workload is sustainable without consistently spilling into personal time." },
  { id: "p_recognition", sectionId: "recognition", icon: "⭐", text: "Contributions are recognised in ways that feel timely and genuine." },
  { id: "p_enablement",  sectionId: "enablement",  icon: "⚙️",  text: "I have the tools, access, and information needed to do my job well." },
  { id: "p_remote",      sectionId: "remote",      icon: "🏠", text: "Remote and hybrid working arrangements are handled fairly across the team." },
];

export const PULSE_QUESTIONS: PulseQuestion[] = PULSE_RAW.map((raw) => {
  const firstQ = ENGAGEMENT_SECTIONS.find((s) => s.id === raw.sectionId)!.questions[0];
  return {
    ...raw,
    positiveWhys: firstQ.positiveWhys,
    neutralWhys: firstQ.neutralWhys,
    negativeWhys: firstQ.negativeWhys,
  };
});

export const SECTION_BY_ID: Record<string, EngSection> = Object.fromEntries(
  ENGAGEMENT_SECTIONS.map((s) => [s.id, s])
);

export const RATING_OPTIONS = [
  { value: 5, emoji: "🌟", label: "Strongly Agree",    sublabel: "Absolutely yes",     color: "#059669", bg: "#ECFDF5", border: "#34D399" },
  { value: 4, emoji: "👍", label: "Agree",             sublabel: "Mostly yes",          color: "#10B981", bg: "#F0FDF4", border: "#6EE7B7" },
  { value: 3, emoji: "🤔", label: "Neutral",           sublabel: "It depends",          color: "#6B7280", bg: "#F9FAFB", border: "#D1D5DB" },
  { value: 2, emoji: "👎", label: "Disagree",          sublabel: "Mostly no",           color: "#DC2626", bg: "#FFF5F5", border: "#FCA5A5" },
  { value: 1, emoji: "😟", label: "Strongly Disagree", sublabel: "Definitely not",      color: "#991B1B", bg: "#FEF2F2", border: "#F87171" },
] as const;
