export const blogPosts = [
  {
    id: '1',
    slug: 'what-is-iso-27001-2022-practical-guide',
    title: 'What is ISO 27001:2022? A Practical Guide for ISMS Teams',
    excerpt: 'Beyond the buzzwords: how the 2022 revision actually changes day-to-day ISMS work, from risk treatment and the Statement of Applicability to evidence that survives a Stage 2 audit.',
    content: `
      <p class="lead">If you have landed here, you are almost certainly one of three people: a security lead who has been told "we need ISO 27001 by Q3," a founder staring down a vendor questionnaire that mentions it 14 times, or an auditor-in-training trying to make sense of a standard that, frankly, was not written to be read on a phone. This guide is for all three of you.</p>

      <p>ISO/IEC 27001:2022 is the international standard for an <strong>Information Security Management System</strong> (ISMS). That phrase — management system — is the part most teams miss. The standard is not a checklist of firewalls and password policies. It is a contract you sign with yourself: a documented way of identifying what could go wrong with your information, deciding what to do about it, executing that decision, and proving — repeatedly, with evidence — that you did.</p>

      <p>Get the management system right, and the controls take care of themselves. Get it wrong, and you can have the most expensive security stack on earth and still fail Stage 2.</p>

      <h2>The 2022 Revision: What Actually Changed</h2>

      <p>The 2022 edition is the first substantive update since 2013. If you are inheriting an old ISMS, you have until <strong>31 October 2025</strong> to transition existing certifications. The clauses (4 through 10) stayed structurally the same. The real movement happened in <strong>Annex A</strong>, the catalogue of reference controls.</p>

      <ul>
        <li><strong>Restructure into four themes:</strong> The fourteen domains of the 2013 version were collapsed into four — Organizational (37), People (8), Physical (14), and Technological (34). The mapping is cleaner, and it matches how modern security teams actually divide responsibility.</li>
        <li><strong>114 controls became 93:</strong> Not because anything was deleted, but because 24 overlapping controls were merged. Coverage is the same; cognitive load is lower.</li>
        <li><strong>Eleven new controls</strong> were added — and they tell you exactly what kept the standards committee up at night: <em>Threat intelligence, Information security for use of cloud services, ICT readiness for business continuity, Physical security monitoring, Configuration management, Information deletion, Data masking, Data leakage prevention, Monitoring activities, Web filtering,</em> and <em>Secure coding.</em></li>
        <li><strong>Attributes:</strong> Every control now carries metadata — control type, security property (CIA), cybersecurity concept (Identify/Protect/Detect/Respond/Recover), operational capability, and security domain. You can finally slice your Statement of Applicability the way your business reasons about risk, not the way an alphabetical list forces you to.</li>
      </ul>

      <div class="bg-surface-container rounded-lg p-5 my-6 border-l-4 border-gold">
        <p class="font-semibold text-gold mb-2">If you remember nothing else</p>
        <p class="text-white/70">The 2022 update is not about <em>more</em> security. It is about making the ISMS readable to humans who do not live inside the standard. If your team still talks in "A.12.4.1" instead of "logging," you are working harder than you need to.</p>
      </div>

      <h2>The Clauses: Where the Real Work Lives</h2>

      <p>Annex A gets the attention because it is concrete. The clauses get the certification because they are the <em>system</em>. Here is the shape of what an auditor will actually walk through, in order:</p>

      <h3>Clause 4 — Context of the Organization</h3>
      <p>You describe what the business does, who it serves, what internal and external issues matter (regulation, market, geography, technology), and — critically — who your <strong>interested parties</strong> are and what they expect. Then you draw the <strong>scope</strong>. The scope is everything. A scope that is too narrow misses real risk; a scope that is too broad turns every coffee-shop laptop into an audit finding. Most first-time certifications get the scope wrong.</p>

      <h3>Clause 5 — Leadership</h3>
      <p>Top management has to demonstrate commitment. In practice this means a signed Information Security Policy, named roles, a budget line, and meeting minutes that prove the executives are not delegating the entire ISMS to one overworked security engineer. Auditors read body language at the kickoff meeting. If the CEO does not know what the ISMS is for, that is a clause 5 finding waiting to be written.</p>

      <h3>Clause 6 — Planning</h3>
      <p>This is the risk assessment and risk treatment clause. It is also where the <strong>Statement of Applicability</strong> (SoA) is born — the master document that lists every Annex A control, says whether you applied it, and explains why or why not. The SoA is the single most-read document in your entire ISMS. Treat it accordingly.</p>

      <h3>Clauses 7, 8, 9, 10 — Support, Operation, Performance Evaluation, Improvement</h3>
      <p>These are the gears that keep the ISMS turning: competence and awareness, documented information, operational planning, monitoring and measurement, internal audits, management review, nonconformity handling, and continual improvement. None of them are glamorous. All of them are checked.</p>

      <h2>The Risk Treatment Workflow, In Plain English</h2>

      <p>Strip away the language and risk management is four moves you repeat forever:</p>

      <ol>
        <li><strong>Identify.</strong> What information assets exist, what threats apply, what vulnerabilities are exposed. Asset-based, scenario-based, or hybrid — pick a methodology and document it.</li>
        <li><strong>Analyze and evaluate.</strong> Score likelihood and impact, multiply, compare against your risk acceptance criteria. The criteria themselves are the part most teams skip — without them you cannot show <em>why</em> something was treated or accepted.</li>
        <li><strong>Treat.</strong> Four options exist: <em>Modify</em> (apply controls), <em>Retain</em> (accept, with sign-off), <em>Avoid</em> (stop doing the thing), or <em>Share</em> (insurance, contractual transfer). Each treated risk maps to one or more Annex A controls. The mapping lives in the SoA.</li>
        <li><strong>Monitor.</strong> Risks change. New ones appear. Old ones quietly become irrelevant. The risk register is a living document, not a quarterly ceremony.</li>
      </ol>

      <p>If you take a screenshot of your risk register today and look at it again in six months and nothing has changed, that is itself a finding. Real businesses change; static registers do not survive scrutiny.</p>

      <h2>The Statement of Applicability — The Document Auditors Live In</h2>

      <p>The SoA is a single table with one row per Annex A control. Every row has four columns that matter: the control reference, whether it is <strong>applicable</strong>, the <strong>justification</strong> (especially for exclusions), and the <strong>implementation status</strong>. Many teams add columns for control owner, evidence link, and last review date — all of these make the auditor's job easier, which makes your audit faster.</p>

      <p>The single most common SoA mistake: justifying inclusion as "best practice" or "industry standard." That is not a justification. The right justification ties back to a specific risk in your register, a legal or contractual requirement, or an explicit business decision. "We applied A.8.7 because risk R-042 (malware introduction via removable media) was rated High and treated by Modify" — that survives an audit. "We applied A.8.7 because it is good hygiene" does not.</p>

      <h2>Internal Audit Readiness — What Stage 2 Actually Looks Like</h2>

      <p>External certification is a two-stage process. <strong>Stage 1</strong> is a documentation review — the auditor reads your ISMS and decides whether it is mature enough to test. <strong>Stage 2</strong> is the real audit, where they sample evidence against the controls and clauses. Surveillance audits then continue annually, with a full recertification every three years.</p>

      <p>Before any of that, your <strong>internal audit</strong> has to find the problems first. An internal audit is not a formality. It is a dress rehearsal performed by someone independent enough to tell you the truth.</p>

      <ul>
        <li><strong>Audit every clause and every applicable control</strong> at least once across the audit cycle — not all in one sitting, but on a documented plan.</li>
        <li><strong>Sample evidence the way the external auditor will:</strong> "Show me the three most recent leavers and prove their access was revoked within policy." "Pull the last incident ticket and walk me through your response."</li>
        <li><strong>Raise findings honestly.</strong> A clean internal audit immediately before Stage 2 is suspicious, not impressive. Auditors expect to see real findings, real corrective actions, and evidence those actions closed the gap.</li>
        <li><strong>Hold a real management review</strong> (Clause 9.3). Inputs are mandatory: changes in context, feedback from interested parties, performance against objectives, audit results, status of corrective actions, risk treatment progress, opportunities for improvement. If your management review is one Slack thread, that is a finding.</li>
      </ul>

      <div class="bg-surface-container rounded-lg p-5 my-6 border-l-4 border-gold">
        <p class="font-semibold text-gold mb-2">Audit Pro Tip</p>
        <p class="text-white/70">Auditors do not look for empty templates. They look for <strong>evidence of operation</strong> — meeting minutes, ticket trails, screenshots with timestamps, signed acknowledgments, monitoring dashboards. The question is never "do you have a policy for X?" It is always "show me X happening, three times, in the last quarter."</p>
      </div>

      <h2>The Common Trap: Mistaking Documentation for Security</h2>

      <p>The fastest way to fail an audit is to confuse a policy library with a security program. A 200-page policy stack written by a consultant and never read by anyone in the engineering team will <em>not</em> get you certified — and if it somehow does, the certificate is meaningless. The auditor wants to see that the policy describes what the company actually does, that the people doing the work know it exists, and that there is evidence the work happens.</p>

      <p>Conversely, the second-fastest way to fail is to have great security and zero documentation. ISO 27001 is an evidence standard. If it is not written down, it does not exist.</p>

      <h2>What To Do This Week</h2>

      <ol>
        <li><strong>Get the scope statement on one page.</strong> If you cannot describe what is inside your ISMS in three sentences, no one else will either.</li>
        <li><strong>Open a risk register.</strong> Five rows is enough to start. Identify, score, decide treatment, link to a control. Iterate.</li>
        <li><strong>Read your existing security policies out loud.</strong> If they do not match what your team actually does, fix one or the other today.</li>
        <li><strong>Pick a target date for internal audit.</strong> Working backward from a date is the only way an ISMS implementation finishes.</li>
      </ol>

      <p>ISO 27001 is not hard because the standard is complicated. It is hard because it asks you to be honest about how your organization handles information — every day, not just on audit week. The companies that pass do not have more security than everyone else. They have a clearer picture of their own risk, and the discipline to act on it.</p>
    `,
    author: '27001certified Team',
    date: '2026-03-17',
    imageUrl: '/blog/iso-27001-2022-guide.svg',
    readTime: '11 min read'
  },
  {
    id: '2',
    slug: 'mastering-annex-a-controls',
    title: 'Demystifying Annex A: The 93 Controls You Need to Know',
    excerpt: 'The 2022 revision did not just shrink the control list — it rewired how you scope, own, and prove security. A field guide to the four themes, the eleven new controls, and the attribute system that finally makes the SoA usable.',
    content: `
      <p class="lead">Ask ten security professionals what Annex A is and you will get ten slightly different answers — most of them wrong in the same way. Annex A is not a control framework you must implement. It is a <strong>menu of reference controls</strong> that you consult when treating risks. You pick from it, justify what you skipped, and prove what you applied. That distinction matters because it changes how you read every row of the 93.</p>

      <p>In 2022, the menu was rewritten. Not the controls themselves — most of those existed in 2013 in some form — but the organization, the metadata, and the eleven additions that reflect how attackers actually behave in 2026. This guide walks the new structure the way an ISMS lead would walk it on day one of an implementation.</p>

      <h2>The Shift from Domains to Themes</h2>

      <p>The 2013 version organized controls into fourteen domains — A.5 through A.18. The boundaries between them were historical: A.13 was "Communications security" and A.14 was "System acquisition, development and maintenance," and good luck explaining to a developer why TLS configuration and secure coding lived in different sections. The 2022 revision threw that out and grouped controls by <strong>who owns the work</strong>.</p>

      <h3>1. Organizational Controls — 37 controls</h3>
      <p>The rules of the road. Policies, asset inventories, supplier relationships, incident management procedures, classification schemes, threat intelligence (new), cloud services security (new), and ICT readiness for business continuity (new). If a control is about <em>what the organization decides</em>, it lives here. This is the largest theme because management decisions are the largest part of an ISMS.</p>
      <p>Common owner: CISO, GRC lead, Head of IT, Legal.</p>

      <h3>2. People Controls — 8 controls</h3>
      <p>The smallest theme, and the most underestimated. Screening, terms and conditions of employment, awareness and training, disciplinary process, responsibilities after employment ends, confidentiality agreements, remote working, and information security event reporting. Every control here is the difference between a policy on paper and a policy in practice. The reason awareness training appears here and not in the technological theme is deliberate: training is a people problem, not a tooling problem.</p>
      <p>Common owner: HR, with security input.</p>

      <h3>3. Physical Controls — 14 controls</h3>
      <p>Walls, doors, badges, cabling, equipment siting, secure disposal, clear-desk and clear-screen policies, and the new <em>Physical security monitoring</em> control. "But we are cloud-native" is not a valid reason to skip this theme. Your laptops live in the physical world. Your office, however small, contains screens that print contracts. Your data center provider — even if it is AWS — has physical controls you have to evaluate. Physical risk does not disappear just because the workload moved.</p>
      <p>Common owner: Facilities, IT operations, with security oversight.</p>

      <h3>4. Technological Controls — 34 controls</h3>
      <p>Where engineering teams live. Identity and access management, cryptography, secure development lifecycle, network segregation, logging and monitoring, malware protection, capacity management, vulnerability management, the new <em>Data masking</em>, <em>Data leakage prevention</em>, <em>Web filtering</em>, <em>Secure coding</em>, <em>Configuration management</em>, <em>Monitoring activities</em>, and <em>Information deletion</em>. If a control is implemented in code, configuration, or a security product, it almost certainly lives in this theme.</p>
      <p>Common owner: Engineering, DevSecOps, SecOps, IT.</p>

      <h2>The Eleven New Controls — A Map of the Modern Threat Landscape</h2>

      <p>The eleven additions are the most useful diagnostic for whether your existing security program has kept up. Each one was added because real organizations were getting hurt in ways the 2013 standard did not explicitly address.</p>

      <ul>
        <li><strong>A.5.7 Threat intelligence</strong> — You are expected to consume, analyze, and act on threat data. Subscribing to a feed is the start, not the finish.</li>
        <li><strong>A.5.23 Information security for use of cloud services</strong> — Cloud is now its own line item. Vendor selection, configuration, and exit are all in scope.</li>
        <li><strong>A.5.30 ICT readiness for business continuity</strong> — Your BCP cannot wave its hands at "the IT team will figure it out." Tested recovery procedures, named systems, defined RTO/RPO.</li>
        <li><strong>A.7.4 Physical security monitoring</strong> — Cameras, alarms, intrusion detection, logged and reviewed.</li>
        <li><strong>A.8.9 Configuration management</strong> — Baselines, drift detection, change control. Implicit before, explicit now.</li>
        <li><strong>A.8.10 Information deletion</strong> — Not just disposal of media; deletion from live systems when retention ends.</li>
        <li><strong>A.8.11 Data masking</strong> — Production data in test environments is finally called out by name.</li>
        <li><strong>A.8.12 Data leakage prevention</strong> — DLP as a control, with detection and response expectations.</li>
        <li><strong>A.8.16 Monitoring activities</strong> — Continuous, not just incidental.</li>
        <li><strong>A.8.23 Web filtering</strong> — Outbound traffic is a risk surface.</li>
        <li><strong>A.8.28 Secure coding</strong> — SDLC controls, code review, dependency management, secrets handling.</li>
      </ul>

      <p>If you cannot point to <em>some</em> evidence for each of these eleven, that is your first implementation backlog.</p>

      <h2>Attributes — The Feature That Finally Makes the SoA Usable</h2>

      <p>Each of the 93 controls now carries five attributes. This sounds like bureaucratic overhead. It is, in fact, the most practical change in the entire revision.</p>

      <ol>
        <li><strong>Control type</strong> — Preventive, Detective, Corrective. Tells you when the control fires in the incident lifecycle.</li>
        <li><strong>Information security properties</strong> — Confidentiality, Integrity, Availability. Maps controls to the CIA triad so you can spot coverage gaps.</li>
        <li><strong>Cybersecurity concepts</strong> — Identify, Protect, Detect, Respond, Recover. The NIST CSF function alignment lets you cross-walk your ISMS to NIST without a translation layer.</li>
        <li><strong>Operational capabilities</strong> — Governance, Asset management, Information protection, Human resource security, Physical security, System and network security, Application security, Secure configuration, Identity and access management, Threat and vulnerability management, Continuity, Supplier relationships security, Legal and compliance, Information security event management, Information security assurance. Maps controls to the team that owns them.</li>
        <li><strong>Security domains</strong> — Governance and ecosystem, Protection, Defence, Resilience. The strategic view.</li>
      </ol>

      <p>What this unlocks: instead of an SoA that is just a long alphabetical list, you can produce <em>views</em>. "Show me every Detective control we have applied that supports Availability." "Show me every Identity and access management control across all four themes." "Show me my Detect-function coverage." Auditors love these views. Boards love these views. Engineers stop arguing about ownership when the attributes assign it for them.</p>

      <div class="bg-surface-container rounded-lg p-5 my-6 border-l-4 border-gold">
        <p class="font-semibold text-gold mb-2">Practical Tip</p>
        <p class="text-white/70">In your SoA spreadsheet, add a column for each attribute and use filtering. The hour you spend tagging controls pays back the first time a Risk Committee asks "where are our gaps on Detect?" and you can answer in ten seconds instead of three days.</p>
      </div>

      <h2>How To Decide What Is "Applicable"</h2>

      <p>Every control in Annex A must be marked applicable or not applicable, with justification. The mistake teams make is treating non-applicability as a loophole — declare it not applicable, no work required. Auditors are immediately suspicious of any organization with a long list of exclusions. The legitimate exclusions are narrow:</p>

      <ul>
        <li><strong>The activity does not occur in the organization.</strong> No software development → A.8.25 (Secure development life cycle) can be excluded, with a clean justification that the organization does not develop software.</li>
        <li><strong>The control is provided entirely by a third party</strong> with contractual coverage. Physical security at a colocated data center provided by the host, with evidence in the supplier agreement.</li>
        <li><strong>The risk has been formally accepted</strong> with proper sign-off — though this should be rare and well-documented.</li>
      </ul>

      <p>"We are too small," "we cannot afford it," and "it does not apply to startups" are not justifications. They are findings.</p>

      <h2>From Annex A to a Working Control Set</h2>

      <p>Annex A is a reference list, not a project plan. The path from "here are 93 controls" to "here is a working ISMS" looks like this in practice:</p>

      <ol>
        <li><strong>Run the risk assessment first.</strong> You cannot pick controls before you know what you are defending against.</li>
        <li><strong>Map each treated risk to one or more controls.</strong> Use the attributes to confirm you have layered Preventive + Detective + Corrective coverage where it matters.</li>
        <li><strong>Assign an owner</strong> per control, using the operational capability attribute as a starting point. One owner per control. Shared ownership is no ownership.</li>
        <li><strong>Define evidence</strong> for each applied control. Not "we have a policy" — what artifact proves the control operates? A ticket query? A dashboard screenshot? A signed log?</li>
        <li><strong>Set a review cadence.</strong> High-risk controls reviewed quarterly; lower-risk annually. Document it.</li>
        <li><strong>Test before the auditor does.</strong> Pull random samples. If you cannot find evidence for a control in your own organization, neither can the auditor — and that is a finding.</li>
      </ol>

      <h2>The Quiet Truth About Annex A</h2>

      <p>Most controls in Annex A are common sense written in formal language. The 93 are not a curriculum to study; they are a vocabulary your organization needs to <em>already speak fluently</em>. If your team is doing reasonable security hygiene — patching, access reviews, backups, monitoring, training — you already comply with most of the catalogue. The work of certification is making that fluency <strong>visible, repeatable, and provable</strong>.</p>

      <p>That is the entire game. Annex A is the answer key. The exam is whether your day-to-day operations match what you said you do.</p>
    `,
    author: 'Security Architect',
    date: '2026-03-24',
    imageUrl: '/blog/annex-a-controls.svg',
    readTime: '12 min read'
  },
  {
    id: '3',
    slug: 'top-reasons-audits-fail',
    title: 'Top 5 Reasons Internal Audits Uncover Major Nonconformities',
    excerpt: 'After watching hundreds of ISMS audits, the same five findings appear again and again — and each one is preventable in the week before Stage 2 if you know what to look for.',
    content: `
      <p class="lead">Most ISO 27001 audit failures are not surprises. They are recurring patterns — predictable, well-documented, and entirely preventable. After enough audit cycles, the same five major nonconformities show up in eight out of ten first-time certifications. This is not because organizations are careless. It is because the five failures hide in plain sight, inside processes that <em>feel</em> like they are working.</p>

      <p>Here are the five, in order of how often they sink a certification — and what to actually do about each one before the auditor arrives.</p>

      <h2>1. The Management Review That Never Really Happened</h2>

      <p>Clause 9.3 is short, specific, and unforgiving. Top management must review the ISMS <strong>at planned intervals</strong>, and the review must include a defined list of inputs and produce a defined list of outputs. The clause names them explicitly: changes in external and internal issues, feedback on the information security performance, results of risk assessment and status of the risk treatment plan, audit results, nonconformities and corrective actions, monitoring and measurement results, fulfillment of objectives, feedback from interested parties, and opportunities for improvement.</p>

      <p>The failure pattern: a Slack thread, a 15-minute meeting with no agenda, a presentation that covers two of the nine inputs and never mentions the rest. The minutes — if they exist — are three bullet points. The auditor asks "what did management decide about the risk treatment plan?" and the room goes quiet.</p>

      <p><strong>The fix:</strong> a single Management Review agenda template that mirrors Clause 9.3 input-by-input. Run it at least annually, preferably quarterly. Keep minutes that capture <em>decisions</em>, not just discussion. The minutes should be boring; the meeting should not be.</p>

      <div class="bg-surface-container rounded-lg p-5 my-6 border-l-4 border-gold">
        <p class="font-semibold text-gold mb-2">Auditor's Tell</p>
        <p class="text-white/70">"Show me the last management review output that resulted in a change to the ISMS." If you cannot point to one — a budget reallocation, a policy revision, a new objective — the review was theater.</p>
      </div>

      <h2>2. The Asset Register That Lives in Last Quarter</h2>

      <p>The asset inventory is the foundation of risk assessment. Without it, every other control loses its grounding — you cannot protect what you have not enumerated. Yet the asset register is one of the first artifacts to drift. A spreadsheet is generated at the start of the implementation, signed off as complete, and then quietly diverges from reality as new SaaS subscriptions are added, laptops are issued, repositories are created, and cloud accounts are spun up.</p>

      <p>By the time the audit arrives, the register lists software the company stopped using 14 months ago and omits the production database that was migrated last quarter. The auditor finds this in 90 seconds: pick any active employee, ask what they use, then check whether those assets appear in the register.</p>

      <p><strong>The fix:</strong> stop maintaining the asset register by hand. Pull it from authoritative sources — your IdP for users, your MDM for endpoints, your cloud accounts for infrastructure, your SSO logs or finance system for SaaS. Reconcile monthly. The register stops being a document and starts being a query. Auditors trust queries more than spreadsheets, every time.</p>

      <h2>3. The Access Review That Forgot the Leavers</h2>

      <p>If there is one sample an external auditor will <em>always</em> pull, it is the leavers list. They will ask HR for the last ten people who left the company, then walk through each one and ask you to prove their access was revoked — across email, SSO, source control, cloud consoles, VPN, internal tools, and any production system they touched. Within policy SLA. With evidence.</p>

      <p>The failure pattern is consistent. IT revokes SSO and email on day one. The terminated employee's GitHub access lingers for three months. Their AWS IAM user is still active. Their access to a contractor portal nobody remembered to add to the offboarding checklist never goes away. The auditor finds one of these, then samples more, then writes a major nonconformity for ineffective access management.</p>

      <p><strong>The fix:</strong> two changes. First, every system that grants access must be on a single offboarding checklist, owned by one team, with a maximum SLA from termination date to revocation. Second, run a quarterly <em>positive</em> access review — pull every system's user list, reconcile against the current employee directory, and document the result. Auditors are unimpressed by policy. They are very impressed by a quarterly reconciliation log with timestamps and sign-off.</p>

      <h2>4. The Incident Response Plan That Has Never Been Tested</h2>

      <p>Every ISMS has an incident response policy. Almost every ISMS has an untested one. The auditor's question is not "do you have a plan?" The question is "when did you last test it, who participated, what did you learn, and what changed as a result?"</p>

      <p>If your answer is "we have not had an incident yet," the finding writes itself. Clause 8.1 and control A.5.24 require planned testing. Tabletop exercises count. Simulated incidents count. Production incidents handled under the documented procedure count. <em>Having</em> the procedure does not count.</p>

      <p><strong>The fix:</strong> run a tabletop exercise once a quarter for an hour. Pick a realistic scenario — phishing leading to credential compromise, a leaked API key in a public repo, a ransomware note on a developer laptop. Walk through the procedure. Note where the procedure was unclear, who hesitated, what tool was missing. Update the procedure. Save the meeting notes. That single hour, four times a year, is the difference between a major nonconformity and a clean finding.</p>

      <div class="bg-surface-container rounded-lg p-5 my-6 border-l-4 border-gold">
        <p class="font-semibold text-gold mb-2">Underrated Win</p>
        <p class="text-white/70">When real incidents happen, treat the postmortem itself as evidence of incident response testing. A blameless writeup that references your IR procedure, names the responders, and lists corrective actions covers the test requirement and the continual improvement requirement at the same time.</p>
      </div>

      <h2>5. The Supplier Risk Process That Stops at Procurement</h2>

      <p>Control A.5.19 through A.5.22 cover supplier relationships, and the modern reality is that your suppliers <em>are</em> your security perimeter. Every SaaS vendor, every contractor with access to a repository, every cloud provider, every payment processor — each one inherits some portion of your risk and amplifies some portion of your exposure.</p>

      <p>The common failure: a security questionnaire is sent at procurement, received, filed, never revisited. The vendor is never re-evaluated. The contract has no security clauses. There is no list of critical suppliers, no ranking by access sensitivity, no annual review, no offboarding procedure when a contract ends. The auditor asks "which of your suppliers have access to personal data, and what is the security review status of each?" and the answer comes back as a sigh.</p>

      <p><strong>The fix:</strong> a supplier register, classified by criticality (which usually maps to data sensitivity and integration depth). For critical suppliers: a documented review cadence, a contract with security and DPA clauses, a defined offboarding procedure, and named ownership. For non-critical suppliers: a lighter process, but a process. The register, like the asset inventory, works best when it pulls from procurement and finance rather than relying on memory.</p>

      <h2>The Pattern Behind the Pattern</h2>

      <p>Look at the five failures together and a single theme emerges: they all describe controls that <em>exist on paper but not in operation</em>. The management review template is in the document library; the meeting never produces decisions. The asset register file is shared on the drive; nobody updates it. The offboarding checklist is in Notion; three systems are missing from it. The incident response plan is approved; it has never been opened. The supplier policy is signed; the supplier list has not been touched in a year.</p>

      <p>The auditor's job — and the internal auditor's job — is to find this gap. Documented intent, undocumented operation. That gap is what a major nonconformity actually <em>is</em>.</p>

      <h2>A Two-Week Pre-Audit Checklist</h2>

      <ol>
        <li><strong>Day 1–2:</strong> Walk every clause and Annex A control with a sampling mindset. Where would the auditor look? Look there first.</li>
        <li><strong>Day 3–5:</strong> Run the five checks above. Reconcile the asset register. Reconcile the leaver list. Pull the last management review minutes. Verify the IR plan has been tested. Pull the supplier register.</li>
        <li><strong>Day 6–8:</strong> Hold a real management review meeting if the last one was too long ago. Document decisions.</li>
        <li><strong>Day 9–10:</strong> Run a tabletop. Save the notes.</li>
        <li><strong>Day 11–12:</strong> Fix what you found. Raise corrective actions for what cannot be fixed in time — open and documented is better than hidden.</li>
        <li><strong>Day 13–14:</strong> Brief the audit team on the most likely sampling angles. Make sure everyone knows where evidence lives.</li>
      </ol>

      <p>None of this is a substitute for a mature ISMS. But all of it dramatically narrows the surface area for surprise. The best certifications are not won at Stage 2 — they are won in the quiet, unglamorous reconciliation work done in the weeks before.</p>

      <p>If you can run this checklist honestly and emerge with a short list of corrective actions in progress, you are in the top decile of audit readiness. The other 90% of organizations show up to Stage 2 hoping the auditor will be lenient. Lenient is not how auditors keep their accreditation.</p>
    `,
    author: 'Lead Auditor',
    date: '2026-04-02',
    imageUrl: '/blog/audit-failures.svg',
    readTime: '10 min read'
  }
]
