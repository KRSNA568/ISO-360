/**
 * Lead auditor interview preparation — public reference content.
 *
 * Questions a candidate is actually asked when interviewing for an ISO 27001
 * lead auditor or lead implementer role, with what the interviewer is testing,
 * a model answer, the follow-ups that usually come next, and the answers that
 * end an interview early.
 *
 * Clause and control numbers follow ISO/IEC 27001:2022 and audit practice
 * follows ISO 19011. Every word here is original material written for
 * 27001certified — nothing is copied from ISO/IEC 27001, 27002 or 19011, which
 * are copyrighted. These are not exam questions and must never become one.
 *
 * Shape: { id, category, question, checking, answer, followUps[], redFlags[] }
 *
 * Validated at build time by scripts/validate-content.mjs.
 */

export const INTERVIEW_PATH = '/iso-27001/lead-auditor-interview-questions'

export const CATEGORIES = [
  {
    slug: 'fundamentals',
    label: 'Management system fundamentals',
    intro: 'The opening questions. They sort people who have read the standard from people who have run one.',
  },
  {
    slug: 'planning',
    label: 'Planning the audit',
    intro: 'Scope, programme, sampling and preparation — where a weak auditor is exposed before they ever meet an auditee.',
  },
  {
    slug: 'conducting',
    label: 'Conducting the audit',
    intro: 'Interview technique, evidence, and what you do when the room stops cooperating.',
  },
  {
    slug: 'findings',
    label: 'Findings and reporting',
    intro: 'Grading, writing findings that survive challenge, and defending them to someone senior.',
  },
  {
    slug: 'follow-up',
    label: 'Corrective action and follow-up',
    intro: 'Root cause, effectiveness and the judgement calls around closing a finding.',
  },
  {
    slug: 'judgment',
    label: 'Judgement and ethics',
    intro: 'The questions with no clean answer. Interviewers use these to see how you behave under pressure.',
  },
]

export const QUESTIONS = [
  // ───────── Management system fundamentals ─────────
  {
    id: 'i-fun-1',
    category: 'fundamentals',
    question: 'What is the difference between ISO 27001 and ISO 27002?',
    checking: 'Whether you understand that only one of them is auditable, and why that matters commercially.',
    answer:
      'ISO 27001 contains the requirements an organisation is certified against — Clauses 4 to 10 plus Annex A, which lists the controls in short form. ISO 27002 is guidance: it takes the same controls and explains purpose and implementation at length. You audit against 27001; you reach for 27002 when you want to understand what a control was intended to achieve. An organisation cannot be certified to 27002, and a finding should never be written against it.',
    followUps: [
      'Which Annex A controls were new in the 2022 revision, and why do you think they were added?',
      'If an auditee says their implementation differs from the 27002 guidance, is that a finding?',
    ],
    redFlags: [
      'Describing 27002 as "the detailed version of 27001" without noting it is not auditable.',
      'Writing or defending a nonconformity against an ISO 27002 recommendation.',
    ],
  },
  {
    id: 'i-fun-2',
    category: 'fundamentals',
    question: 'Walk me through the relationship between risk assessment, the risk treatment plan and the Statement of Applicability.',
    checking: 'Whether you can trace the chain in the right direction. It is the single most diagnostic question in a lead auditor interview.',
    answer:
      'Risk assessment identifies and evaluates the risks against defined criteria, with an owner for each. Treatment decisions follow: treat, tolerate, transfer or terminate. Where the decision is to treat, you determine the controls necessary, and Annex A is the checklist you compare against so nothing is overlooked. The Statement of Applicability records that determination — which controls are necessary, why, their implementation status, and the justification for excluding any Annex A control. The treatment plan is the work: who does what by when. The direction matters: risk drives controls, never the reverse.',
    followUps: [
      'How would you test that chain in an audit, concretely?',
      'An organisation produced its SoA before its risk assessment. What would you do?',
    ],
    redFlags: [
      'Starting from Annex A and working backwards to invent risks.',
      'Treating the SoA and the treatment plan as the same document.',
    ],
  },
  {
    id: 'i-fun-3',
    category: 'fundamentals',
    question: 'An organisation wants to exclude an entire department from its ISMS scope. How do you audit that?',
    checking: 'Whether you understand that scope is a legitimate choice with consequences, rather than something to approve or reject.',
    answer:
      'Scope is the organisation\'s decision, so I would not challenge the exclusion itself. What I would audit is Clause 4.3: whether the boundaries account for the interfaces and dependencies with what sits outside them. I would look for shared infrastructure, shared identity, shared premises and data flows across the boundary, and test whether the risk of those interfaces has been assessed. I would also check the scope statement reads clearly enough that a customer could tell whether the service they buy is covered.',
    followUps: [
      'What would make you escalate a scope concern rather than note it?',
      'How do you handle a scope that is technically accurate but commercially misleading?',
    ],
    redFlags: [
      'Insisting the whole organisation must be in scope.',
      'Accepting an exclusion without examining the interfaces.',
    ],
  },
  {
    id: 'i-fun-4',
    category: 'fundamentals',
    question: 'How would you explain the value of an ISMS to a sceptical CFO?',
    checking: 'Whether you can leave the standard\'s vocabulary behind. Lead auditors spend a lot of time talking to people who do not care about clause numbers.',
    answer:
      'I would talk about decisions rather than compliance: the ISMS is the mechanism that makes sure security spend follows the risks that would actually hurt the business, and that it can be shown to have done so. Concretely it shortens enterprise sales cycles because the security questionnaire is already answered, it reduces the chance of the kind of incident that triggers notification costs and customer churn, and it gives the board a defensible record if something does go wrong. I would avoid promising that certification prevents breaches, because it does not.',
    followUps: [
      'What would you say if they asked for the return on investment as a number?',
      'How do you respond when someone calls it a paper exercise?',
    ],
    redFlags: [
      'Leading with clause numbers or Annex A.',
      'Claiming certification prevents incidents.',
    ],
  },

  // ───────── Planning the audit ─────────
  {
    id: 'i-pln-1',
    category: 'planning',
    question: 'How do you build an internal audit programme for a 200-person SaaS company?',
    checking: 'Whether you plan by risk or by clause order, and whether you understand coverage across a cycle rather than per audit.',
    answer:
      'I would plan a cycle rather than a single audit — typically three years, aligned to the certification cycle, with everything covered at least once and high-risk areas more often. Risk and past performance drive frequency: areas with previous findings, recent incidents, high change or new suppliers get revisited. For a SaaS company I would weight access management, change and deployment, supplier and cloud configuration, and the joiner-mover-leaver process. I would schedule around the business rather than against it, and I would make sure each audit is small enough to go deep instead of touching everything shallowly.',
    followUps: [
      'How do you demonstrate coverage to a certification auditor?',
      'What changes if the company acquires another business mid-cycle?',
    ],
    redFlags: [
      'Auditing Clauses 4 to 10 in order, once a year, with no risk weighting.',
      'Planning a single annual audit covering the whole ISMS.',
    ],
  },
  {
    id: 'i-pln-2',
    category: 'planning',
    question: 'What do you do before an audit that most people skip?',
    checking: 'Preparation discipline. Interviewers ask this because the answer separates auditors who arrive with questions from auditors who arrive with a checklist.',
    answer:
      'I read the previous audit reports and the corrective action log first, so I know what was already found and whether it stayed fixed — repeat findings are the most valuable thing I can look for. I request documents in advance and actually read them, so interview time is spent testing rather than orienting. I agree the sample in advance where I can, and I write my questions around the specific systems and people in this organisation rather than generic prompts. I also agree the logistics early: who is available, what access I need, and when I will give feedback.',
    followUps: [
      'What do you do when the auditee does not send the documents you asked for?',
      'How much time do you budget for preparation relative to fieldwork?',
    ],
    redFlags: [
      'Arriving with only a generic clause checklist.',
      'Not reviewing previous findings before starting.',
    ],
  },
  {
    id: 'i-pln-3',
    category: 'planning',
    question: 'How do you decide on a sample size?',
    checking: 'Whether you can justify a number. There is no formula in the standard, so the interviewer wants to hear reasoning, not a rule.',
    answer:
      'Sampling is a judgement I have to be able to defend, so I start from risk and population. For a high-risk, high-volume control such as leaver access removal I would take a larger sample and bias it towards recent cases and edge cases — contractors, mid-month leavers, people who changed role rather than left. For a low-volume control I may test the whole population. If the first few samples fail, I stop treating it as sampling and widen, because at that point I am no longer testing whether the control works but how badly it does not.',
    followUps: [
      'You sample five and two fail. What do you do next?',
      'How do you avoid being steered towards a convenient sample by the auditee?',
    ],
    redFlags: [
      'Quoting a fixed number with no reasoning behind it.',
      'Letting the auditee choose the sample.',
    ],
  },

  // ───────── Conducting the audit ─────────
  {
    id: 'i-con-1',
    category: 'conducting',
    question: 'An auditee tells you a control is working. How do you test that?',
    checking: 'Whether you distinguish assertion from evidence, and whether you know what evidence actually looks like.',
    answer:
      'I ask them to show me, on a specific recent case rather than in general. If they say access reviews happen quarterly, I pick a quarter and a system and ask for that review: who ran it, what it found, what changed as a result. Then I corroborate from a second direction — the ticket that removed an account, or the system itself. One source tells me what someone believes; two independent sources that agree tell me the control operated.',
    followUps: [
      'What if the evidence exists but is dated the morning of the audit?',
      'How do you handle a control that is genuinely working but undocumented?',
    ],
    redFlags: [
      'Accepting a verbal assurance as evidence.',
      'Testing only what the auditee offers.',
    ],
  },
  {
    id: 'i-con-2',
    category: 'conducting',
    question: 'How do you phrase questions during an audit interview?',
    checking: 'Interview technique. Closed and leading questions produce answers that tell you nothing, and nervous auditees give you less.',
    answer:
      'Open and neutral, aimed at a process rather than a person. "Talk me through what happens when someone joins" gets me the real process; "Do you follow the joiner procedure?" gets me yes. I ask for a walkthrough on a specific recent case, then follow the evidence trail wherever it goes. I try to make it clear I am auditing the system and not the individual, because a defensive auditee stops volunteering the exceptions — and the exceptions are where the findings are.',
    followUps: [
      'What do you do if someone clearly does not know the answer and is guessing?',
      'How do you keep a dominant manager from answering for their whole team?',
    ],
    redFlags: [
      'Leading questions that hand the auditee the answer.',
      'Treating the interview as an interrogation.',
    ],
  },
  {
    id: 'i-con-3',
    category: 'conducting',
    question: 'During an audit you discover evidence of an incident that was never reported internally. What do you do?',
    checking: 'Judgement under pressure, and whether you understand the limits of your own role.',
    answer:
      'I stay inside my remit: I am auditing the management system, not running an investigation. I record what I saw factually, establish whether the incident process was followed, and raise a finding against the gap — most likely that events are not being reported or escalated as the organisation\'s own process requires. I would raise it with the audit client promptly rather than saving it for the report, because an unreported incident may still be live. If it suggested something criminal or a regulatory notification obligation, I would escalate immediately through the agreed channel rather than deciding myself.',
    followUps: [
      'Who exactly would you escalate to, and when?',
      'What if the person who concealed it is the one hosting your audit?',
    ],
    redFlags: [
      'Starting an investigation of your own.',
      'Saving a live, serious issue for the closing meeting.',
    ],
  },
  {
    id: 'i-con-4',
    category: 'conducting',
    question: 'The auditee cannot produce evidence during the audit but says it exists. How do you handle it?',
    checking: 'Whether you can hold a line without being rigid, and whether you understand that an audit is time-boxed.',
    answer:
      'I set a clear deadline inside the audit window and say plainly what happens if it is not met — if I cannot see it, I cannot conclude the control operated, and I will record it as such. I try to be practical about where evidence lives, because the right record is sometimes in a system nobody thought to open. But I do not leave it open-ended or accept a promise to send it next week, because the audit has to conclude on what was demonstrated.',
    followUps: [
      'They send it two days after the closing meeting. Does the finding stand?',
      'How do you word that finding so it is fair?',
    ],
    redFlags: [
      'Accepting evidence indefinitely after the audit closes.',
      'Raising a finding without giving a reasonable chance to produce the record.',
    ],
  },

  // ───────── Findings and reporting ─────────
  {
    id: 'i-fnd-1',
    category: 'findings',
    question: 'What is the difference between a major nonconformity, a minor nonconformity and an observation?',
    checking: 'Grading consistency. Interviewers ask this of every candidate, and they listen for whether you can apply it, not recite it.',
    answer:
      'A major is a breakdown of a requirement — the requirement is not addressed at all, or the failure is systemic, or it casts doubt on the management system\'s ability to achieve its outcomes. A minor is a single lapse in something that is otherwise in place and working. An observation is not a nonconformity: it is something that conforms today but is heading somewhere, or an improvement opportunity. The judgement call is usually whether a failure is isolated or systemic, and I decide that by widening the sample before I grade it.',
    followUps: [
      'Give me an example of a minor that you would escalate to major.',
      'Can an accumulation of minors in one area become a major?',
    ],
    redFlags: [
      'Grading by how annoyed the auditor is rather than by evidence.',
      'Using observations to avoid difficult conversations about real nonconformities.',
    ],
  },
  {
    id: 'i-fnd-2',
    category: 'findings',
    question: 'Write me a nonconformity, out loud, for overdue access reviews.',
    checking: 'Whether your findings are defensible. A finding that mixes evidence with opinion falls apart the moment someone senior pushes back.',
    answer:
      'I would state the requirement, the evidence and the gap, in that order, with no solution attached. Something like: the organisation\'s access control policy requires quarterly reviews of privileged access to the finance system; a sample of four quarters found no review recorded for Q3 or Q4 2025; this does not meet Clause 9.1 and A.5.18. I would not write "the team should automate this" — recommending the fix is the auditee\'s job and compromises my independence at the follow-up audit.',
    followUps: [
      'Why not include the recommendation?',
      'How would the wording change if this were a major?',
    ],
    redFlags: [
      'Prescribing the corrective action inside the finding.',
      'Writing the finding without citing the specific evidence sampled.',
    ],
  },
  {
    id: 'i-fnd-3',
    category: 'findings',
    question: 'A senior manager disputes your finding in the closing meeting, in front of their team. What do you do?',
    checking: 'Composure and the difference between defending a conclusion and defending your ego.',
    answer:
      'I go back to the evidence rather than to the conclusion: here is the requirement, here is what I sampled, here is what I found. If they produce evidence I had not seen, I will genuinely reconsider — being wrong and correcting it costs me nothing, whereas being wrong and holding the line costs me the audit. If it is a disagreement about judgement rather than fact, I record their position in the report and let the process handle it. What I will not do is downgrade a finding because the conversation is uncomfortable.',
    followUps: [
      'What if the dispute is really about the commercial impact of a major finding?',
      'When would you involve the audit client or the certification body?',
    ],
    redFlags: [
      'Downgrading a finding to end an argument.',
      'Refusing to look at new evidence once the finding is written.',
    ],
  },

  // ───────── Corrective action and follow-up ─────────
  {
    id: 'i-fu-1',
    category: 'follow-up',
    question: 'An auditee gives you "human error" as the root cause. How do you respond?',
    checking: 'Whether you can push past the easy answer without turning it into a confrontation.',
    answer:
      'I treat it as the starting point rather than the answer, and keep asking why. People make mistakes constantly; the question is why this mistake was possible and why nothing caught it. That usually surfaces the real cause — no automated trigger, no second check, a process that depended on one person remembering, a confusing interface. I would not accept a corrective action of "remind the team to be careful", because it changes nothing a reminder has not already failed to change.',
    followUps: [
      'What root cause methods do you use, and when?',
      'How deep is deep enough before you stop asking why?',
    ],
    redFlags: [
      'Accepting retraining or a reminder as a corrective action.',
      'Naming an individual as the root cause.',
    ],
  },
  {
    id: 'i-fu-2',
    category: 'follow-up',
    question: 'How do you decide whether a corrective action was effective?',
    checking: 'Whether you understand that effectiveness is tested after the fact, not asserted at completion.',
    answer:
      'I wait until the changed process has actually run at least once and then test the output, rather than checking that the action was completed. If the fix was an automated quarterly ticket, I want to see the next two quarters open and close on time. Effectiveness and completion are different dates, and a log where they are always the same is itself evidence that nobody is checking.',
    followUps: [
      'How long would you wait before testing effectiveness?',
      'The fix worked but the underlying risk changed. Is the finding still closed?',
    ],
    redFlags: [
      'Closing a finding on the day the action was completed.',
      'Accepting the auditee\'s assertion that it is working.',
    ],
  },
  {
    id: 'i-fu-3',
    category: 'follow-up',
    question: 'The same finding appears for the third audit running. What is your conclusion?',
    checking: 'Whether you escalate from the symptom to the system, which is the step that separates senior auditors from competent ones.',
    answer:
      'The finding itself is no longer the most important thing. Three recurrences means the corrective action process is not working — root causes are not being found, or effectiveness is not being checked, or actions are being closed without either. I would raise that as a finding in its own right against Clause 10.2, probably as a major, because a management system that cannot correct itself fails the test of continual improvement regardless of the specific control involved.',
    followUps: [
      'How would you word that finding?',
      'What if management argues the underlying risk is trivial?',
    ],
    redFlags: [
      'Re-raising the same minor a third time with no escalation.',
      'Concluding the auditee is simply uncooperative rather than examining the process.',
    ],
  },

  // ───────── Judgement and ethics ─────────
  {
    id: 'i-eth-1',
    category: 'judgment',
    question: 'You are asked to audit a process you helped design last year. What do you say?',
    checking: 'Independence. This is a straightforward disqualifier and interviewers ask it to see whether you spot it unprompted.',
    answer:
      'I would decline that part of the audit, because auditors cannot audit their own work and objectivity has to be ensured, not merely intended. In a small organisation that usually means swapping scopes with another trained auditor, bringing in a peer from a different function, or contracting it out. If the organisation genuinely has nobody else, I would say so plainly and record the limitation rather than proceed and hope nobody notices.',
    followUps: [
      'What if you are the only trained auditor in the company?',
      'How long after designing something are you independent of it again?',
    ],
    redFlags: [
      'Agreeing to audit your own work with "I would just be extra careful".',
      'Not recognising the independence problem until prompted.',
    ],
  },
  {
    id: 'i-eth-2',
    category: 'judgment',
    question: 'Your client hints that a major nonconformity would jeopardise a large deal, and asks whether it could be a minor. What do you do?',
    checking: 'Integrity under commercial pressure, which is the whole job.',
    answer:
      'The grading follows the evidence, so the answer is no, and I would say it once, calmly, without making it a confrontation. What I can legitimately do is make sure the grading is right — if I have not yet widened the sample to confirm the failure is systemic rather than isolated, I should do that, and it might genuinely come out a minor. But I would not change a grade because of its consequences, and if the pressure continued I would escalate it through the agreed channel.',
    followUps: [
      'What if the pressure comes from your own employer rather than the client?',
      'Has this happened to you? What did you do?',
    ],
    redFlags: [
      'Any suggestion that grading is negotiable.',
      'Agreeing in the room and planning to raise it later.',
    ],
  },
  {
    id: 'i-eth-3',
    category: 'judgment',
    question: 'What is the hardest audit you have run, and what did you get wrong?',
    checking: 'Self-awareness. Interviewers are testing whether you can name a mistake without either hiding it or performing humility.',
    answer:
      'A good answer is specific and owns a real error — a finding graded wrongly, a sample chosen badly, an interview where defensiveness was created and evidence dried up — followed by what changed in your practice afterwards. The failure mode is the non-answer: a difficulty that was entirely someone else\'s fault, or a strength disguised as a weakness. Interviewers hear the disguised version constantly and it reads as unwillingness to be audited yourself.',
    followUps: [
      'What would you do differently if you ran that audit again tomorrow?',
      'How do you get feedback on your own auditing?',
    ],
    redFlags: [
      'A weakness that is secretly a strength.',
      'Blaming the auditee for every difficulty.',
    ],
  },
]
