import { Message, PersonaType, Vote, VerdictType, JuryPersonaType, JudgeVerdict } from '@/types/debate';

// Pre-written debate scripts for each claim
export interface DebateScript {
  claimId: number;
  // Moderator introduction to seed the discussion
  moderatorIntro: string;
  // Round 1 messages (random order of jury)
  round1Messages: Omit<Message, 'id' | 'timestamp'>[];
  // Moderator summary after round 1
  moderatorSummary: string;
  // New direction for round 2
  round2Direction: string;
  // Round 2 messages (random order of jury)
  round2Messages: Omit<Message, 'id' | 'timestamp'>[];
  // Final verdict from the judge
  judgeVerdict: JudgeVerdict;
}

export const debateScripts: DebateScript[] = [
  {
    claimId: 0,
    moderatorIntro: 'Welcome, jury. Today we examine a claim about pandemic statistics. The external claim states there were "less than 13,200 cases" and "less than 32 deaths." Our internal fact records exactly 13,083 cases and 31 deaths, with a case fatality rate of approximately 0.2%. Let\'s determine: is this claim a faithful representation, or has it been mutated?',
    round1Messages: [
      {
        personaId: 'academic',
        content: 'Let me start by comparing the numbers directly. The claim states "less than 13,200 cases" and "less than 32 deaths." The internal fact records exactly 13,083 cases and 31 deaths. Technically, both figures are indeed less than the claimed thresholds.',
        reactions: [{ personaId: 'ethicist', type: 'thumbsUp' }],
      },
      {
        personaId: 'skeptic',
        content: 'Hold on. Why say "less than 13,200" when you could just say "about 13,000" or give the exact figure? This phrasing choice seems designed to downplay the severity. It\'s technically accurate but rhetorically suspicious.',
        reactions: [{ personaId: 'academic', type: 'thumbsUp' }],
      },
      {
        personaId: 'journalist',
        content: 'I\'ve seen this pattern before in press releases. The "less than" framing gives them plausible deniability while softening the impact. Who wrote this and what was their motivation?',
        reactions: [{ personaId: 'skeptic', type: 'thumbsUp' }],
      },
      {
        personaId: 'pragmatist',
        content: 'From a practical standpoint, does the difference between "13,083" and "less than 13,200" actually change policy decisions or public behavior? The margin seems negligible.',
        reactions: [],
      },
      {
        personaId: 'ethicist',
        content: 'The internal fact also mentions a case fatality rate of approximately 0.2%. The claim omits this context entirely. That\'s a meaningful omission if we\'re discussing the pandemic\'s severity.',
        reactions: [{ personaId: 'skeptic', type: 'thumbsUp' }, { personaId: 'academic', type: 'thumbsUp' }],
      },
    ],
    moderatorSummary: 'We\'ve heard valid points on both sides. The numbers are technically accurate, but there are concerns about the "less than" phrasing and the omission of the case fatality rate.',
    round2Direction: 'Let\'s focus on whether this constitutes a meaningful mutation that would mislead the public, or just a stylistic choice.',
    round2Messages: [
      {
        personaId: 'skeptic',
        content: 'The claim selectively presents data. It\'s not lying, but it\'s not telling the whole truth either. This is a classic mutation through omission.',
        reactions: [{ personaId: 'academic', type: 'thumbsUp' }],
      },
      {
        personaId: 'journalist',
        content: 'If I were editing this for publication, I\'d flag the CFR omission. Readers deserve the full picture. However, I wouldn\'t call the core claim false.',
        reactions: [{ personaId: 'ethicist', type: 'thumbsUp' }],
      },
      {
        personaId: 'academic',
        content: 'The statistical accuracy is preserved within acceptable margins. However, the presentation methodology could be considered selective reporting.',
        reactions: [],
      },
      {
        personaId: 'pragmatist',
        content: 'I think we\'re overcomplicating this. The average person would get roughly the right picture from this claim. Minor imprecision isn\'t dangerous mutation.',
        reactions: [{ personaId: 'skeptic', type: 'thumbsDown' }],
      },
      {
        personaId: 'ethicist',
        content: 'Intent matters. If this was crafted to minimize perceived severity, that\'s ethically problematic even if technically accurate.',
        reactions: [{ personaId: 'journalist', type: 'thumbsUp' }],
      },
    ],
    judgeVerdict: {
      outcome: 'ambiguous',
      confidence: 65,
      argumentsFor: 'The numerical claims are technically accurate. "Less than 13,200" is true for 13,083 cases. The core information about case and death counts is preserved.',
      argumentsAgainst: 'The vague "less than" phrasing and omission of the case fatality rate (0.2%) create a slightly misleading impression. This represents selective presentation rather than complete transparency.',
      finalJudgement: 'The jury is split. While the numbers are technically accurate, the vague phrasing and omission of CFR context constitute a minor mutation through imprecision rather than outright falsehood.',
      juryVotes: [
        { personaId: 'skeptic', verdict: 'mutated', reasoning: 'The "less than" phrasing and omission of CFR data indicates spin.' },
        { personaId: 'academic', verdict: 'ambiguous', reasoning: 'Numbers are technically accurate, but context is incomplete.' },
        { personaId: 'journalist', verdict: 'ambiguous', reasoning: 'The framing is suspect but the core facts hold.' },
        { personaId: 'pragmatist', verdict: 'faithful', reasoning: 'Core information is preserved despite minor framing differences.' },
        { personaId: 'ethicist', verdict: 'mutated', reasoning: 'Selective omission is ethically problematic.' },
      ],
    },
  },
  {
    claimId: 1,
    moderatorIntro: 'Good day, jury. We\'re examining a claim about the Maxthon browser\'s popularity. The external claim states it has "more than 450 million downloads." Our internal fact indicates it has been downloaded more than 500 million times and is the second most popular browser in China. Let\'s assess whether this claim faithfully represents the facts.',
    round1Messages: [
      {
        personaId: 'academic',
        content: 'The claim says "more than 450 million downloads." The fact states it\'s been "downloaded more than 500 million times." That\'s a 50 million download discrepancy—the claim actually UNDERSTATES the true figure.',
        reactions: [{ personaId: 'skeptic', type: 'thumbsUp' }, { personaId: 'journalist', type: 'thumbsUp' }],
      },
      {
        personaId: 'skeptic',
        content: 'Interesting. Usually we see exaggeration, not understatement. Why would someone claim less than reality? This seems like either outdated information or deliberate underselling.',
        reactions: [],
      },
      {
        personaId: 'journalist',
        content: 'More importantly, the claim completely omits that Maxthon is the second most popular browser in China. That\'s crucial context about where these downloads are coming from.',
        reactions: [{ personaId: 'academic', type: 'thumbsUp' }],
      },
      {
        personaId: 'pragmatist',
        content: 'Does the China context really matter for the claim being made? The download number is still impressive regardless of geographic distribution.',
        reactions: [{ personaId: 'journalist', type: 'thumbsDown' }],
      },
      {
        personaId: 'ethicist',
        content: 'Presenting a global download number without mentioning it\'s primarily from one market could mislead readers about the browser\'s international adoption.',
        reactions: [{ personaId: 'journalist', type: 'thumbsUp' }],
      },
    ],
    moderatorSummary: 'Key issues identified: the claim understates downloads by 50 million and omits critical geographic context about China dominance.',
    round2Direction: 'Let\'s determine whether these omissions fundamentally change how a reader would interpret Maxthon\'s market position.',
    round2Messages: [
      {
        personaId: 'academic',
        content: 'The geographical context matters significantly. "450 million downloads worldwide" vs "500 million downloads, second most popular in China" paint very different pictures of market position.',
        reactions: [{ personaId: 'ethicist', type: 'thumbsUp' }],
      },
      {
        personaId: 'skeptic',
        content: 'This is clearly mutated. The claim understates the numbers AND strips away the China-centric context that explains Maxthon\'s success.',
        reactions: [{ personaId: 'academic', type: 'thumbsUp' }, { personaId: 'journalist', type: 'thumbsUp' }],
      },
      {
        personaId: 'journalist',
        content: 'The missing context fundamentally misrepresents global vs regional significance. This would fail any editorial fact-check at a major publication.',
        reactions: [{ personaId: 'skeptic', type: 'thumbsUp' }],
      },
      {
        personaId: 'pragmatist',
        content: 'I\'ll concede—the combination of understatement and missing context does change the meaning substantially.',
        reactions: [],
      },
      {
        personaId: 'ethicist',
        content: 'Whether intentional or not, presenting this claim without context is misleading to the reader.',
        reactions: [{ personaId: 'academic', type: 'thumbsUp' }],
      },
    ],
    judgeVerdict: {
      outcome: 'mutated',
      confidence: 92,
      argumentsFor: 'The claim still accurately conveys that Maxthon is a widely-downloaded browser. The "more than 450 million" is technically true since 500 million exceeds 450 million.',
      argumentsAgainst: 'The claim understates downloads by 50 million and critically omits that Maxthon is China\'s second most popular browser. This missing context fundamentally changes how readers interpret global significance.',
      finalJudgement: 'Unanimous verdict: MUTATED. The claim understates downloads by 50 million and critically omits that Maxthon is China\'s second most popular browser. This missing context fundamentally changes how readers would interpret the browser\'s global significance.',
      juryVotes: [
        { personaId: 'skeptic', verdict: 'mutated', reasoning: 'Understated numbers and missing China context misrepresent market reality.' },
        { personaId: 'academic', verdict: 'mutated', reasoning: '50 million download discrepancy plus missing geographical context.' },
        { personaId: 'journalist', verdict: 'mutated', reasoning: 'Would fail editorial fact-check standards.' },
        { personaId: 'pragmatist', verdict: 'mutated', reasoning: 'The combination of issues changes the meaning substantially.' },
        { personaId: 'ethicist', verdict: 'mutated', reasoning: 'Misleading presentation regardless of intent.' },
      ],
    },
  },
  {
    claimId: 2,
    moderatorIntro: 'Attention, jury. Today\'s claim concerns Scary Movie 5, stating it\'s a "stand-alone film" because it has a different storyline. Our internal fact confirms it\'s the first installment not featuring Cindy Campbell or Brenda Meeks, and it doesn\'t build on previous storylines. Is this characterization faithful or incomplete?',
    round1Messages: [
      {
        personaId: 'journalist',
        content: 'This claim is about Scary Movie 5 being a "stand-alone film" because it has a different storyline. Let me examine the internal fact carefully...',
        reactions: [],
      },
      {
        personaId: 'academic',
        content: 'The internal fact confirms it IS a stand-alone film—the first installment not featuring Cindy Campbell or Brenda Meeks, and it doesn\'t build on the previous storyline. The claim accurately represents this.',
        reactions: [{ personaId: 'ethicist', type: 'thumbsUp' }],
      },
      {
        personaId: 'skeptic',
        content: 'Wait, let\'s be precise. The claim says it\'s stand-alone "because it has a different storyline." But the fact says it\'s stand-alone because it lacks the main characters AND doesn\'t continue the storyline. The reasoning is incomplete.',
        reactions: [{ personaId: 'academic', type: 'thumbsDown' }],
      },
      {
        personaId: 'pragmatist',
        content: 'Does the average moviegoer care about the distinction between "different storyline" and "no returning characters"? The conclusion is the same.',
        reactions: [{ personaId: 'journalist', type: 'thumbsUp' }],
      },
      {
        personaId: 'ethicist',
        content: 'The core truth—that it stands alone—is correctly communicated. Incomplete reasoning doesn\'t necessarily make a claim false.',
        reactions: [{ personaId: 'academic', type: 'thumbsUp' }],
      },
    ],
    moderatorSummary: 'The debate centers on whether incomplete reasoning for a correct conclusion constitutes a mutation.',
    round2Direction: 'Let\'s assess whether the omission of character absence as a factor materially misleads the audience.',
    round2Messages: [
      {
        personaId: 'skeptic',
        content: 'The core assertion is accurate: it IS a stand-alone film. But attributing this solely to storyline changes slightly misrepresents why it\'s considered stand-alone.',
        reactions: [{ personaId: 'journalist', type: 'thumbsUp' }],
      },
      {
        personaId: 'journalist',
        content: 'I should note the fact also includes the release date—April 12, 2013—which the claim omits. Though that\'s perhaps less relevant to the stand-alone classification.',
        reactions: [],
      },
      {
        personaId: 'academic',
        content: 'The stand-alone status is accurately represented. The incomplete reasoning is a minor issue at most.',
        reactions: [{ personaId: 'pragmatist', type: 'thumbsUp' }],
      },
      {
        personaId: 'pragmatist',
        content: 'I\'d call this faithful with minor imprecision. The essential truth is correctly stated.',
        reactions: [{ personaId: 'ethicist', type: 'thumbsUp' }],
      },
      {
        personaId: 'ethicist',
        content: 'The spirit of the claim matters as much as the letter. The audience understands correctly that this is a stand-alone entry.',
        reactions: [{ personaId: 'academic', type: 'thumbsUp' }],
      },
    ],
    judgeVerdict: {
      outcome: 'faithful',
      confidence: 78,
      argumentsFor: 'The claim correctly identifies Scary Movie 5 as a stand-alone film. The core truth is accurately communicated to the audience.',
      argumentsAgainst: 'The reasoning focuses only on storyline differences, omitting the absence of lead characters (Cindy Campbell and Brenda Meeks) as an equally important factor.',
      finalJudgement: 'Majority verdict: FAITHFUL. The claim correctly identifies Scary Movie 5 as a stand-alone film. While the reasoning focuses only on storyline differences, this doesn\'t fundamentally misrepresent the film\'s relationship to the franchise.',
      juryVotes: [
        { personaId: 'skeptic', verdict: 'ambiguous', reasoning: 'Correct conclusion but incomplete reasoning about why it\'s stand-alone.' },
        { personaId: 'academic', verdict: 'faithful', reasoning: 'The stand-alone status is accurately represented.' },
        { personaId: 'journalist', verdict: 'faithful', reasoning: 'Core message is accurate despite minor omissions.' },
        { personaId: 'pragmatist', verdict: 'faithful', reasoning: 'The essential truth is correctly stated.' },
        { personaId: 'ethicist', verdict: 'faithful', reasoning: 'Core truth preserved; minor reasoning omission doesn\'t mislead.' },
      ],
    },
  },
  {
    claimId: 3,
    moderatorIntro: 'Welcome back, jury. We\'re reviewing a claim about the Los Angeles Angels baseball team name. The external claim states that "Since 2016" they\'re called the Los Angeles Angels. Our internal fact mentions the MLB Style Guide changed for the 2016 season, but most sources adopted it by 2017, and certain deals were never finalized. Let\'s examine this timeline.',
    round1Messages: [
      {
        personaId: 'academic',
        content: 'Timeline discrepancy alert. The claim says "Since 2016" the team is called "Los Angeles Angels." But the fact says as of 2017 most official sources omit "of Anaheim," and the MLB Style Guide made the change for the 2016 season.',
        reactions: [{ personaId: 'skeptic', type: 'thumbsUp' }],
      },
      {
        personaId: 'skeptic',
        content: 'So the official guide changed in 2016, but actual usage caught up in 2017? The claim conflates the style guide update with universal adoption. Classic case of oversimplification.',
        reactions: [{ personaId: 'academic', type: 'thumbsUp' }],
      },
      {
        personaId: 'journalist',
        content: 'As someone who covers sports, I can tell you name changes are rarely clean breaks. There\'s usually a transition period. The claim glosses over this complexity.',
        reactions: [{ personaId: 'pragmatist', type: 'thumbsUp' }],
      },
      {
        personaId: 'pragmatist',
        content: 'This is nuanced. If the MLB Style Guide officially used "Los Angeles Angels" since 2016, and most sources followed by 2017, is saying "since 2016" really a mutation?',
        reactions: [],
      },
      {
        personaId: 'ethicist',
        content: 'The fact also mentions "the deal was never finalized"—referring to some earlier negotiation. The claim presents the name change as a done deal when the situation was more complicated.',
        reactions: [{ personaId: 'academic', type: 'thumbsUp' }],
      },
    ],
    moderatorSummary: 'The key issues are: conflating style guide changes with universal adoption, and omitting that related deals were never finalized.',
    round2Direction: 'Let\'s evaluate whether these nuances are important enough to constitute a meaningful mutation.',
    round2Messages: [
      {
        personaId: 'skeptic',
        content: 'There\'s an unfinished business aspect here that the claim completely glosses over. It presents a clean break that didn\'t quite happen that cleanly.',
        reactions: [{ personaId: 'academic', type: 'thumbsUp' }, { personaId: 'journalist', type: 'thumbsUp' }],
      },
      {
        personaId: 'journalist',
        content: 'If I were writing this story, I\'d need to explain the transition period. The claim\'s "Since 2016" framing is too clean.',
        reactions: [],
      },
      {
        personaId: 'academic',
        content: 'The date is approximately correct but the presentation oversimplifies a gradual transition.',
        reactions: [{ personaId: 'ethicist', type: 'thumbsUp' }],
      },
      {
        personaId: 'pragmatist',
        content: 'I see this as a minor mutation. The claim captures the general direction correctly but oversimplifies the timeline.',
        reactions: [],
      },
      {
        personaId: 'ethicist',
        content: 'The oversimplification may not be malicious, but it does create a false impression of a cleaner process than reality.',
        reactions: [{ personaId: 'journalist', type: 'thumbsUp' }],
      },
    ],
    judgeVerdict: {
      outcome: 'ambiguous',
      confidence: 70,
      argumentsFor: 'The claim correctly notes the trend toward dropping "of Anaheim." The MLB Style Guide did make the change for the 2016 season.',
      argumentsAgainst: 'The claim oversimplifies by stating "Since 2016" when adoption was gradual through 2017. It also ignores that related deals were never finalized.',
      finalJudgement: 'The jury leans ambiguous. While the claim correctly notes the trend, it oversimplifies the timeline and ignores important context about unfinalized deals.',
      juryVotes: [
        { personaId: 'skeptic', verdict: 'mutated', reasoning: 'Oversimplifies timeline and ignores unfinalized deal context.' },
        { personaId: 'academic', verdict: 'ambiguous', reasoning: 'Date is approximately correct but presentation is too clean.' },
        { personaId: 'journalist', verdict: 'ambiguous', reasoning: 'The framing oversimplifies a complex transition.' },
        { personaId: 'pragmatist', verdict: 'ambiguous', reasoning: 'General truth preserved but important nuance lost.' },
        { personaId: 'ethicist', verdict: 'ambiguous', reasoning: 'Creates a false impression even if not intentionally misleading.' },
      ],
    },
  },
  {
    claimId: 4,
    moderatorIntro: 'Jury, our final case today involves a Pacific Rim anime announcement. The external claim states the anime "will come in 2019." Our internal fact from November 2018 says it "could come sometime in 2019." Pay close attention to the difference between certainty and possibility in these statements.',
    round1Messages: [
      {
        personaId: 'skeptic',
        content: 'This is a prediction about future events. The claim states Pacific Rim anime "will come in 2019." The fact says it "could come some time in 2019." That\'s certainty vs possibility—a huge difference.',
        reactions: [{ personaId: 'academic', type: 'thumbsUp' }, { personaId: 'journalist', type: 'thumbsUp' }],
      },
      {
        personaId: 'academic',
        content: 'The modal verb matters enormously here. "Will come" is a statement of fact about the future. "Could come" is speculation. The claim transforms uncertainty into certainty.',
        reactions: [{ personaId: 'skeptic', type: 'thumbsUp' }, { personaId: 'ethicist', type: 'thumbsUp' }],
      },
      {
        personaId: 'journalist',
        content: 'From a reader\'s perspective, "will come in 2019" sets an expectation. "Could come sometime in 2019" manages expectations. These create very different levels of anticipation.',
        reactions: [{ personaId: 'skeptic', type: 'thumbsUp' }],
      },
      {
        personaId: 'pragmatist',
        content: 'And note the timing context. The announcement was November 2018, so "sometime in 2019" means it could be December 2019 or never. The claim implies imminent arrival.',
        reactions: [{ personaId: 'academic', type: 'thumbsUp' }],
      },
      {
        personaId: 'ethicist',
        content: 'Converting "could" to "will" is essentially making a promise that wasn\'t made. That\'s problematic regardless of whether the anime eventually released.',
        reactions: [{ personaId: 'journalist', type: 'thumbsUp' }],
      },
    ],
    moderatorSummary: 'Strong consensus that the modal verb change from "could" to "will" fundamentally alters the claim\'s meaning.',
    round2Direction: 'Let\'s confirm whether this linguistic shift constitutes a clear mutation.',
    round2Messages: [
      {
        personaId: 'skeptic',
        content: 'There\'s also sloppy formatting in the source—"< /ref >" appears in the internal fact. But the core issue stands: will vs could is a fundamental distortion.',
        reactions: [],
      },
      {
        personaId: 'academic',
        content: 'This is textbook linguistic mutation. Hedging language was removed to create false certainty.',
        reactions: [{ personaId: 'ethicist', type: 'thumbsUp' }],
      },
      {
        personaId: 'journalist',
        content: 'I\'ve seen press releases carefully word things as "could" specifically to avoid this kind of overstatement. Someone ignored that nuance.',
        reactions: [{ personaId: 'skeptic', type: 'thumbsUp' }],
      },
      {
        personaId: 'pragmatist',
        content: 'No debate needed here. Converting possibility to certainty fundamentally changes what the reader takes away.',
        reactions: [{ personaId: 'academic', type: 'thumbsUp' }],
      },
      {
        personaId: 'ethicist',
        content: 'This is clearly mutated. Converting "could" to "will" fundamentally changes the claim from speculation to assertion.',
        reactions: [{ personaId: 'skeptic', type: 'thumbsUp' }, { personaId: 'journalist', type: 'thumbsUp' }],
      },
    ],
    judgeVerdict: {
      outcome: 'mutated',
      confidence: 95,
      argumentsFor: 'The subject matter (Pacific Rim anime) and timeframe (2019) are correctly reported.',
      argumentsAgainst: 'The claim transforms "could come sometime in 2019" into "will come in 2019," converting a possibility into a certainty. This is a fundamental distortion of the original statement.',
      finalJudgement: 'Unanimous verdict: MUTATED. The claim transforms "could come sometime in 2019" into "will come in 2019," converting a possibility into a certainty. This is a textbook example of how small word changes can fundamentally alter meaning.',
      juryVotes: [
        { personaId: 'skeptic', verdict: 'mutated', reasoning: 'Converting possibility to certainty is a fundamental distortion.' },
        { personaId: 'academic', verdict: 'mutated', reasoning: '"Will" vs "could" represents a clear factual overstatement.' },
        { personaId: 'journalist', verdict: 'mutated', reasoning: 'Reader expectations would be fundamentally different.' },
        { personaId: 'pragmatist', verdict: 'mutated', reasoning: 'No ambiguity—this changes what readers take away.' },
        { personaId: 'ethicist', verdict: 'mutated', reasoning: 'Making promises that weren\'t made is ethically problematic.' },
      ],
    },
  },
];

export const getScriptForClaim = (claimId: number): DebateScript | undefined => {
  return debateScripts.find(s => s.claimId === claimId);
};
