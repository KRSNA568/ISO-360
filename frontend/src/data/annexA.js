/**
 * ISO/IEC 27001:2022 Annex A control library — public reference content.
 *
 * Control numbers and short titles follow ISO/IEC 27001:2022 Annex A. Every
 * other word here is original guidance written for 27001certified; nothing is
 * copied from ISO/IEC 27001 or 27002 (both are copyrighted). Do not paste
 * standard text into this file.
 *
 * Shape: { id, title, theme, isNew?, purpose, implement[], evidence[], ncs[], related[] }
 *   isNew   — control introduced in the 2022 revision
 *   related — ids of related controls (links render only for controls present)
 *
 * Validated at build time by scripts/validate-content.mjs.
 */

export const THEMES = {
  organizational: { label: 'Organizational controls', prefix: '5', range: [1, 37] },
  people:         { label: 'People controls',         prefix: '6', range: [1, 8] },
  physical:       { label: 'Physical controls',       prefix: '7', range: [1, 14] },
  technological:  { label: 'Technological controls',  prefix: '8', range: [1, 34] },
}

const ORGANIZATIONAL = [
  {
    id: '5.1', title: 'Policies for information security',
    purpose: 'Sets the direction for information security in writing. A top-level policy approved by management, supported by topic-specific policies, tells everyone what the organisation expects and gives every other control a mandate to point back to.',
    implement: [
      'Write a short top-level information security policy that management formally approves and signs off.',
      'Add topic-specific policies where risk justifies them — access control, acceptable use, cryptography, supplier security, remote working.',
      'Give each policy an owner, a version, an approval date and a planned review date.',
      'Publish policies where staff and relevant contractors can actually find them, and record that they have been acknowledged.',
      'Review policies on schedule and after significant change: new regulations, incidents, restructures or new technology.',
    ],
    evidence: [
      'Approved, version-controlled policy documents with owners and review dates',
      'Records of management approval (board minutes, signed approval page or workflow log)',
      'Staff acknowledgement records from onboarding or the policy portal',
      'Evidence of the last review and the changes it produced',
    ],
    ncs: [
      'Policies exist but have not been reviewed since the ISMS was first certified.',
      'Topic-specific policies contradict the top-level policy or each other.',
      'Staff interviewed cannot say where policies are published or what they require.',
    ],
    related: ['5.2', '5.4', '5.36', '6.3'],
  },
  {
    id: '5.2', title: 'Information security roles and responsibilities',
    purpose: 'Makes sure every security responsibility has a named owner. Without explicit allocation, tasks such as risk ownership, asset ownership and incident handling fall between teams.',
    implement: [
      'Define security roles — ISMS manager, risk owners, asset owners, incident coordinator — and what each is accountable for.',
      'Assign each role to a named person or post and record it (RACI matrix, job descriptions or an ISMS roles register).',
      'Make sure people in those roles have the authority and time to carry them out.',
      'Update assignments when people move, leave or the organisation restructures.',
    ],
    evidence: [
      'A roles and responsibilities document or RACI covering the ISMS',
      'Job descriptions that include security duties for key roles',
      'Interviews showing role holders understand their responsibilities',
      'Records of reassignment after staff changes',
    ],
    ncs: [
      'Risk owners in the risk register are people who have left the organisation.',
      'No one is assigned responsibility for monitoring supplier security.',
      'Role holders interviewed do not know they hold the role.',
    ],
    related: ['5.1', '5.3', '5.4', '6.2'],
  },
  {
    id: '5.3', title: 'Segregation of duties',
    purpose: 'Reduces the chance of error or fraud by making sure no single person can complete a sensitive process end to end without a check by someone else.',
    implement: [
      'Identify conflicting duties — for example raising and approving payments, requesting and granting access, developing and deploying code.',
      'Split those duties across different people or teams, enforced in system permissions where possible.',
      'Where staffing makes full separation impossible, add compensating controls such as independent review of logs or activity reports.',
      'Review role combinations periodically, especially after reorganisations.',
    ],
    evidence: [
      'A documented list of conflicting duties and how each is separated',
      'Role and permission configurations in key systems (ERP, IAM, CI/CD)',
      'Compensating-control records such as reviewed activity reports',
      'Results of periodic segregation-of-duties reviews',
    ],
    ncs: [
      'The same administrator can create users and approve their own access.',
      'Developers can deploy their own unreviewed changes to production.',
      'Compensating reviews are claimed but no evidence of them exists.',
    ],
    related: ['5.2', '5.15', '5.18', '8.2', '8.31'],
  },
  {
    id: '5.4', title: 'Management responsibilities',
    purpose: 'Requires managers to actively make staff follow security policies and procedures, rather than treating security as the security team\'s job alone.',
    implement: [
      'Make following security policy an explicit expectation in management objectives.',
      'Have managers brief their teams on relevant policies and confirm awareness training is completed.',
      'Give managers a clear route to raise security concerns and report non-compliance.',
      'Include security behaviour in performance conversations where appropriate.',
    ],
    evidence: [
      'Management communications reinforcing security expectations',
      'Training completion tracked and chased by line managers',
      'Interviews with managers describing how they enforce policy',
      'Examples of managers escalating security concerns',
    ],
    ncs: [
      'Managers are unaware of policies their teams must follow.',
      'Overdue mandatory training is never followed up by line management.',
      'Known policy breaches in a team were never acted on.',
    ],
    related: ['5.1', '5.2', '6.3', '6.4'],
  },
  {
    id: '5.5', title: 'Contact with authorities',
    purpose: 'Ensures the organisation knows which authorities to contact — regulators, law enforcement, data protection authorities — and can reach them quickly when an incident or legal obligation requires it.',
    implement: [
      'List the authorities relevant to your sector and jurisdictions, with contact details and when each must be contacted.',
      'Assign who is allowed to make contact on the organisation\'s behalf.',
      'Link the list into incident response and breach notification procedures, including notification deadlines.',
      'Review the contact list periodically so details stay current.',
    ],
    evidence: [
      'A maintained register of authority contacts with owners and review dates',
      'Incident or breach procedures that reference when and how to notify authorities',
      'Records of past notifications or regulatory correspondence',
    ],
    ncs: [
      'The incident procedure says "notify the regulator" but does not say which one or within what time.',
      'Contact details are out of date or the named contact has left.',
      'No one is authorised to make regulatory notifications.',
    ],
    related: ['5.6', '5.24', '5.26', '5.31', '5.34'],
  },
  {
    id: '5.6', title: 'Contact with special interest groups',
    purpose: 'Keeps the security team connected to professional forums, industry groups and information-sharing communities so it learns about emerging threats and good practice early.',
    implement: [
      'Join relevant groups — sector ISACs, CERT mailing lists, professional associations, vendor security advisories.',
      'Assign someone to monitor these sources and pass on relevant information.',
      'Agree what information can be shared outward and under what confidentiality rules.',
      'Feed useful intelligence into risk assessment and awareness content.',
    ],
    evidence: [
      'A list of memberships and subscriptions with owners',
      'Examples where information from these groups changed a control or prompted action',
      'Rules for sharing information with external groups',
    ],
    ncs: [
      'Memberships exist on paper but no one reads or acts on the information.',
      'Sensitive internal information was shared in a forum without approval.',
      'Vendor security advisories for critical systems are not subscribed to.',
    ],
    related: ['5.5', '5.7', '8.8'],
  },
  {
    id: '5.7', title: 'Threat intelligence', isNew: true,
    purpose: 'Collects and analyses information about threats relevant to the organisation so defences and risk decisions are based on what attackers are actually doing, not guesswork.',
    implement: [
      'Decide what intelligence you need: strategic (trends for leadership), tactical (attacker techniques) and operational (indicators of compromise).',
      'Choose sources — government advisories, ISACs, vendor feeds, open-source intelligence — that fit your sector.',
      'Analyse incoming intelligence for relevance and turn it into actions: new detections, patch priorities, risk register updates.',
      'Share relevant findings with the people who need them, at the right level of detail.',
    ],
    evidence: [
      'A documented threat intelligence process with sources and owners',
      'Intelligence reports or summaries produced for different audiences',
      'Examples of intelligence driving changes (detection rules, risk updates, patching)',
    ],
    ncs: [
      'Feeds are subscribed to but nothing shows the information is analysed or used.',
      'Threat intelligence is not considered in the risk assessment.',
      'Indicators of compromise are received but never loaded into monitoring tools.',
    ],
    related: ['5.6', '5.25', '8.8', '8.16'],
  },
  {
    id: '5.8', title: 'Information security in project management',
    purpose: 'Builds security into projects from the start, so risks are assessed and requirements agreed before money is spent and designs are fixed — not bolted on before go-live.',
    implement: [
      'Add security checkpoints to the project methodology: initiation, design, pre-go-live.',
      'Require a security risk assessment for projects that touch sensitive information or critical systems.',
      'Record security requirements alongside functional ones and track them to completion.',
      'Get security sign-off before go-live for in-scope projects.',
    ],
    evidence: [
      'Project methodology documents showing security gates',
      'Risk assessments and security requirements for recent projects',
      'Go-live approvals that include security sign-off',
    ],
    ncs: [
      'A new customer-facing system went live without any security assessment.',
      'Security requirements were identified but never verified before launch.',
      'Projects run by business units bypass the security gates used by IT.',
    ],
    related: ['5.1', '8.25', '8.26', '8.27'],
  },
  {
    id: '5.9', title: 'Inventory of information and other associated assets',
    purpose: 'You cannot protect what you do not know you have. An accurate inventory of information and the systems, devices and services that hold it is the foundation for risk assessment and most other controls.',
    implement: [
      'Build an inventory that covers information assets, hardware, software, cloud services and key suppliers.',
      'Give every asset an owner responsible for its protection.',
      'Record attributes that drive controls: classification, location, criticality, personal data.',
      'Keep it current — update on purchase, deployment, change and disposal, and reconcile periodically against discovery tools.',
    ],
    evidence: [
      'The asset inventory with owners, classifications and last-updated dates',
      'Reconciliation records against network scans, MDM or cloud console exports',
      'Onboarding and disposal procedures that update the inventory',
    ],
    ncs: [
      'Cloud services used by the business are missing from the inventory.',
      'Assets have no owner or the owner has left.',
      'The inventory was built once for certification and never updated.',
    ],
    related: ['5.10', '5.11', '5.12', '7.14', '8.1'],
  },
  {
    id: '5.10', title: 'Acceptable use of information and other associated assets',
    purpose: 'Tells people clearly what they may and may not do with the organisation\'s information, devices and services, so expectations are known and breaches can be acted on.',
    implement: [
      'Publish acceptable use rules covering email, internet, devices, cloud apps, personal use and handling of classified information.',
      'Align the rules with the classification scheme so handling expectations scale with sensitivity.',
      'Have staff and contractors acknowledge the rules before getting access.',
      'Back the rules with technical controls where practical (web filtering, DLP, device management).',
    ],
    evidence: [
      'The acceptable use policy and handling rules',
      'Signed or electronic acknowledgements from users',
      'Technical configurations that enforce key rules',
    ],
    ncs: [
      'Contractors were given access without accepting the acceptable use rules.',
      'Rules forbid personal cloud storage but nothing prevents or detects it.',
      'Handling rules for "Confidential" information are not defined.',
    ],
    related: ['5.9', '5.12', '6.2', '8.12'],
  },
  {
    id: '5.11', title: 'Return of assets',
    purpose: 'Makes sure laptops, phones, access cards and information held by leavers and departing contractors come back to the organisation when the relationship ends or changes.',
    implement: [
      'Include asset return in the leaver and contract-end checklist, linked to the asset inventory.',
      'Cover information held on personal devices as well as company equipment.',
      'Assign responsibility for confirming return (usually the line manager plus IT).',
      'Escalate and disable access when assets are not returned.',
    ],
    evidence: [
      'Leaver checklists showing assets returned and signed off',
      'Inventory updates matching returned equipment',
      'Records of follow-up for unreturned assets',
    ],
    ncs: [
      'Leavers\' laptops are still assigned to them in the inventory months later.',
      'There is no process for information stored on personal devices (BYOD).',
      'Contractor equipment returns are not tracked.',
    ],
    related: ['5.9', '6.5', '5.18'],
  },
  {
    id: '5.12', title: 'Classification of information',
    purpose: 'Groups information by sensitivity so protection matches the harm its loss or exposure would cause — spending effort where it matters instead of treating everything the same.',
    implement: [
      'Define a small number of levels (for example Public, Internal, Confidential, Restricted) with clear criteria.',
      'Base classification on confidentiality, integrity, availability and legal requirements.',
      'Make information owners responsible for classifying their information.',
      'Link each level to handling rules for storage, sharing, transfer and disposal.',
    ],
    evidence: [
      'A classification scheme with criteria and handling rules',
      'Classified entries in the asset inventory',
      'Staff able to explain the levels in interviews',
    ],
    ncs: [
      'The scheme has levels but no handling rules for any of them.',
      'Highly sensitive data sets in the inventory are unclassified.',
      'Staff apply labels inconsistently because criteria are unclear.',
    ],
    related: ['5.9', '5.10', '5.13', '5.14'],
  },
  {
    id: '5.13', title: 'Labelling of information',
    purpose: 'Puts a visible or machine-readable label on information so people and systems know how to handle it — the practical follow-through of classification.',
    implement: [
      'Define how each classification level is labelled: document headers and footers, email tags, metadata, physical stamps.',
      'Use tools to apply or suggest labels automatically where possible.',
      'Decide what is exempt from labelling (for example Public information) to keep the burden reasonable.',
      'Train staff on applying and respecting labels.',
    ],
    evidence: [
      'Labelling procedures for each format',
      'Sample documents and emails carrying the correct labels',
      'Configuration of labelling tools such as sensitivity labels in Microsoft 365',
    ],
    ncs: [
      'Confidential documents shared externally carry no label.',
      'The labelling procedure covers documents but not email or removable media.',
      'Automated labelling is configured but disabled for most users.',
    ],
    related: ['5.12', '5.14', '8.12'],
  },
  {
    id: '5.14', title: 'Information transfer',
    purpose: 'Protects information when it moves — by email, file transfer, removable media, courier or conversation — whether inside the organisation or to outside parties.',
    implement: [
      'Set rules for each transfer method, scaled to classification (encryption, approved channels, recipient checks).',
      'Use agreements with external parties that cover how shared information must be protected.',
      'Provide approved secure transfer tools so people do not improvise.',
      'Cover verbal and physical transfers, not just electronic ones.',
    ],
    evidence: [
      'Information transfer rules or procedures',
      'Secure transfer tools in use (encrypted email, managed file transfer)',
      'Information sharing agreements with partners',
    ],
    ncs: [
      'Customer data is routinely sent to partners as unencrypted email attachments.',
      'There is no agreement covering data shared with a key processing partner.',
      'Staff use personal file-sharing services because no approved tool exists.',
    ],
    related: ['5.12', '5.13', '6.6', '8.24'],
  },
  {
    id: '5.15', title: 'Access control',
    purpose: 'Sets the rules for who may access what, based on business need and least privilege. It is the policy layer; identity, authentication and access rights controls put it into practice.',
    implement: [
      'Write an access control policy built on need-to-know and least privilege.',
      'Define access by role where possible rather than person by person.',
      'Cover both logical (systems, data) and physical access.',
      'Align the policy with how access is requested, approved, reviewed and removed.',
    ],
    evidence: [
      'An access control policy approved by management',
      'Role definitions or access matrices for key systems',
      'Alignment between policy and actual provisioning practice',
    ],
    ncs: [
      'The policy requires least privilege but all staff have access to the whole file share.',
      'Access rules exist for IT systems but not for SaaS applications run by business teams.',
      'The policy has not been updated since the move to cloud services.',
    ],
    related: ['5.16', '5.17', '5.18', '8.2', '8.3'],
  },
  {
    id: '5.16', title: 'Identity management',
    purpose: 'Manages the full life cycle of identities — people, service accounts and devices — so every access can be traced to a unique, valid identity.',
    implement: [
      'Issue unique identities; limit shared accounts to justified, documented cases.',
      'Link identity creation, change and removal to HR and contractor processes (joiners, movers, leavers).',
      'Manage non-human identities such as service accounts and API keys with named owners.',
      'Periodically find and remove orphaned or duplicate identities.',
    ],
    evidence: [
      'Joiner-mover-leaver procedures linked to HR events',
      'Identity lists from directories with owners for service accounts',
      'Records of orphaned-account clean-ups',
    ],
    ncs: [
      'Shared generic accounts are used for daily work with no accountability.',
      'Service accounts have no owner and never expire.',
      'Accounts of contractors who finished months ago are still active.',
    ],
    related: ['5.15', '5.17', '5.18', '6.5'],
  },
  {
    id: '5.17', title: 'Authentication information',
    purpose: 'Controls how passwords, PINs, keys and other secrets are issued and handled, so they cannot easily be guessed, shared or stolen.',
    implement: [
      'Issue initial secrets securely and force change on first use.',
      'Set password rules that follow current guidance — length over complexity, blocklists of breached passwords.',
      'Provide a password manager and tell users never to share or reuse credentials.',
      'Store secrets securely in systems (hashed passwords, vaults for keys).',
    ],
    evidence: [
      'Password and authentication policy',
      'System configuration showing password settings and hashing',
      'Use of a password manager or secrets vault',
    ],
    ncs: [
      'Initial passwords are emailed in plain text and never changed.',
      'API keys are hard-coded in source code repositories.',
      'Administrators share a single password kept in a spreadsheet.',
    ],
    related: ['5.16', '8.5', '8.24'],
  },
  {
    id: '5.18', title: 'Access rights',
    purpose: 'Makes sure access is granted with approval, reviewed regularly and removed promptly, so people only keep the access they still need.',
    implement: [
      'Require documented approval from the asset or system owner before granting access.',
      'Review access rights periodically — more often for privileged and sensitive systems.',
      'Adjust access when people change roles, removing what they no longer need.',
      'Remove access promptly when people leave, ideally triggered automatically by HR.',
    ],
    evidence: [
      'Access request and approval records',
      'Completed access reviews with actions taken',
      'Leaver access-removal records matched to HR leaving dates',
    ],
    ncs: [
      'Access reviews are signed off without any changes ever being made.',
      'Movers keep access from previous roles indefinitely.',
      'Leavers\' accounts remain active weeks after departure.',
    ],
    related: ['5.15', '5.16', '6.5', '8.2'],
  },
  {
    id: '5.19', title: 'Information security in supplier relationships',
    purpose: 'Manages the risk that comes with suppliers who access, process or affect your information — from selection through to exit.',
    implement: [
      'Define a supplier security process: classify suppliers by risk, set requirements per tier.',
      'Assess higher-risk suppliers before contract (questionnaires, certifications, evidence).',
      'Keep a register of suppliers with their risk tier and what information they handle.',
      'Plan for exit, including return or deletion of information.',
    ],
    evidence: [
      'Supplier security policy and risk tiering criteria',
      'Supplier register with risk ratings',
      'Due-diligence records for critical suppliers',
    ],
    ncs: [
      'A supplier processing customer personal data was onboarded without any assessment.',
      'The supplier register omits SaaS tools bought by business teams.',
      'No exit process ensures suppliers delete data at contract end.',
    ],
    related: ['5.20', '5.21', '5.22', '5.23'],
  },
  {
    id: '5.20', title: 'Addressing information security within supplier agreements',
    purpose: 'Turns security requirements into contractual obligations so suppliers are bound to protect your information and you have rights to verify and enforce it.',
    implement: [
      'Use standard security clauses scaled by supplier risk tier.',
      'Cover confidentiality, data protection, incident notification timelines, sub-processors, right to audit and data return or deletion.',
      'Have security or legal review contracts for high-risk suppliers before signature.',
      'Keep signed agreements retrievable and linked to the supplier register.',
    ],
    evidence: [
      'Contract templates with security clauses',
      'Signed agreements for critical suppliers containing those clauses',
      'Data processing agreements where personal data is involved',
    ],
    ncs: [
      'A critical SaaS contract has no incident notification clause.',
      'Click-through terms were accepted for a service holding sensitive data with no review.',
      'Right-to-audit clauses exist but no one knows which contracts contain them.',
    ],
    related: ['5.19', '5.21', '5.22', '5.31'],
  },
  {
    id: '5.21', title: 'Managing information security in the ICT supply chain',
    purpose: 'Addresses risks deeper in the supply chain — the components, software and sub-suppliers your ICT suppliers depend on.',
    implement: [
      'Require key ICT suppliers to manage security in their own supply chains and flow down requirements.',
      'Ask for transparency on critical components and sub-processors.',
      'Assess software components for known vulnerabilities and provenance (for example SBOMs where available).',
      'Plan for the failure or compromise of a critical upstream provider.',
    ],
    evidence: [
      'Contract clauses requiring flow-down of security requirements',
      'Lists of sub-processors or critical components for key services',
      'Component or dependency vulnerability checks',
    ],
    ncs: [
      'No visibility of which sub-processors a critical supplier uses.',
      'Third-party libraries in products are never checked for known vulnerabilities.',
      'Supplier contracts do not require notification of upstream breaches.',
    ],
    related: ['5.19', '5.20', '8.8', '8.30'],
  },
  {
    id: '5.22', title: 'Monitoring, review and change management of supplier services',
    purpose: 'Keeps supplier security under watch after the contract is signed, and manages the risk when a supplier changes its service.',
    implement: [
      'Review critical suppliers periodically — performance reports, certifications, audit results, incidents.',
      'Track supplier SLA and security obligations against what is actually delivered.',
      'Assess the security impact of supplier service changes before accepting them.',
      'Escalate and act when suppliers fall short.',
    ],
    evidence: [
      'Supplier review records and meeting minutes',
      'Collected certificates or assurance reports (for example SOC 2, ISO 27001) with expiry tracking',
      'Change impact assessments for supplier changes',
    ],
    ncs: [
      'Suppliers are assessed at onboarding but never reviewed again.',
      'An expired supplier certificate went unnoticed for over a year.',
      'A supplier moved data to a new region without any assessment.',
    ],
    related: ['5.19', '5.20', '5.23'],
  },
  {
    id: '5.23', title: 'Information security for use of cloud services', isNew: true,
    purpose: 'Governs how cloud services are bought, used, managed and exited, recognising that security is shared between the organisation and the cloud provider.',
    implement: [
      'Define which cloud services are approved and how new ones are requested.',
      'Document the shared responsibility split for each significant service.',
      'Set baseline configurations for identity, logging, encryption and network exposure.',
      'Plan exit — data export, deletion and transition — before relying on a service.',
    ],
    evidence: [
      'Cloud security policy and approved service list',
      'Shared responsibility matrices for key services',
      'Configuration baselines and posture reports',
      'Exit plans for critical cloud services',
    ],
    ncs: [
      'Teams create cloud accounts with no central visibility or baseline.',
      'Storage buckets with sensitive data are publicly accessible.',
      'No exit strategy exists for a service the business cannot run without.',
    ],
    related: ['5.19', '5.22', '8.9', '8.16'],
  },
  {
    id: '5.24', title: 'Information security incident management planning and preparation',
    purpose: 'Prepares the organisation to handle incidents before they happen: defined roles, procedures, contacts and tools ready to use under pressure.',
    implement: [
      'Write an incident management plan covering detection, triage, escalation, response, communication and recovery.',
      'Define roles and on-call contacts, and keep them current.',
      'Prepare playbooks for likely scenarios (ransomware, data leak, account compromise).',
      'Exercise the plan through tabletop or technical tests and improve it from the results.',
    ],
    evidence: [
      'The incident management plan and playbooks',
      'Up-to-date contact and escalation lists',
      'Records of exercises and the improvements made',
    ],
    ncs: [
      'The incident plan names people who have left.',
      'No exercise has ever been run, so the plan is untested.',
      'Third-party incident response support is assumed but not contracted.',
    ],
    related: ['5.25', '5.26', '5.27', '6.8'],
  },
  {
    id: '5.25', title: 'Assessment and decision on information security events',
    purpose: 'Decides consistently which reported events are actual incidents, so real incidents get a response and noise does not overwhelm the team.',
    implement: [
      'Define criteria for classifying events as incidents, and severity levels with examples.',
      'Assign who makes the call and how quickly.',
      'Record every assessment and decision, including events judged not to be incidents.',
      'Review classification decisions periodically for consistency.',
    ],
    evidence: [
      'Triage criteria and severity definitions',
      'Event and incident logs showing decisions and timestamps',
      'Examples of escalation following the defined criteria',
    ],
    ncs: [
      'Events are closed without any record of why they were not incidents.',
      'Severity is assigned inconsistently because no criteria exist.',
      'Triage takes days because no one owns the decision.',
    ],
    related: ['5.24', '5.26', '6.8', '8.16'],
  },
  {
    id: '5.26', title: 'Response to information security incidents',
    purpose: 'Responds to incidents according to documented procedures, so containment, eradication, recovery and communication happen quickly and consistently.',
    implement: [
      'Follow the documented procedures and playbooks during incidents.',
      'Contain first, preserve evidence, then eradicate and recover.',
      'Communicate with stakeholders, customers and authorities as required by law and contract.',
      'Keep an incident record from detection to closure.',
    ],
    evidence: [
      'Incident tickets or reports showing actions and timelines',
      'Communications and notifications sent',
      'Closure records confirming recovery',
    ],
    ncs: [
      'A confirmed incident was handled informally with no record.',
      'Regulatory notification deadlines were missed.',
      'Systems were rebuilt before evidence was preserved.',
    ],
    related: ['5.24', '5.25', '5.27', '5.28', '5.5'],
  },
  {
    id: '5.27', title: 'Learning from information security incidents',
    purpose: 'Uses what incidents reveal to strengthen controls and reduce the chance or impact of the next one.',
    implement: [
      'Hold post-incident reviews for significant incidents and record root causes.',
      'Turn lessons into tracked actions with owners and dates.',
      'Look for patterns across incidents to spot systemic weaknesses.',
      'Feed lessons into risk assessment, training and controls.',
    ],
    evidence: [
      'Post-incident review reports',
      'Action trackers showing completed improvements',
      'Trend analysis of incidents over time',
    ],
    ncs: [
      'The same root cause appears in several incidents with no corrective action.',
      'Post-incident reviews are written but their actions are never tracked.',
      'Incident lessons are not reflected in the risk register.',
    ],
    related: ['5.24', '5.26', '5.7'],
  },
  {
    id: '5.28', title: 'Collection of evidence',
    purpose: 'Collects and preserves evidence about incidents in a way that would stand up in disciplinary, legal or regulatory proceedings.',
    implement: [
      'Define procedures for identifying, collecting and preserving digital and physical evidence.',
      'Maintain chain of custody records for anything collected.',
      'Use forensically sound methods or qualified third parties for serious cases.',
      'Consider legal requirements in each relevant jurisdiction.',
    ],
    evidence: [
      'Evidence handling procedures',
      'Chain of custody forms from past incidents',
      'Contracts with forensic providers if used',
    ],
    ncs: [
      'Logs needed for an investigation were overwritten before being preserved.',
      'No chain of custody was kept for a seized laptop.',
      'Staff investigating incidents have no evidence-handling guidance.',
    ],
    related: ['5.26', '8.15', '8.17'],
  },
  {
    id: '5.29', title: 'Information security during disruption',
    purpose: 'Keeps information security at an appropriate level during a crisis or disruption, when normal processes are under strain and shortcuts are tempting.',
    implement: [
      'Identify which security controls must keep working during disruption.',
      'Include security requirements in business continuity and disaster recovery plans.',
      'Define secure alternatives for emergency working (temporary access, alternate sites).',
      'Test that security holds during continuity exercises.',
    ],
    evidence: [
      'Continuity plans that address security requirements',
      'Exercise reports covering security during disruption',
      'Procedures for emergency access and their review afterwards',
    ],
    ncs: [
      'Emergency access granted during an outage was never reviewed or removed.',
      'The disaster recovery site lacks the logging and access controls of production.',
      'Continuity plans ignore security completely.',
    ],
    related: ['5.30', '8.13', '8.14'],
  },
  {
    id: '5.30', title: 'ICT readiness for business continuity', isNew: true,
    purpose: 'Makes sure IT services can be recovered within the times the business needs, based on business impact analysis.',
    implement: [
      'Use business impact analysis to set recovery time and recovery point objectives for key services.',
      'Design ICT recovery capabilities to meet those objectives (backups, redundancy, failover).',
      'Document recovery procedures and test them regularly.',
      'Close gaps between required and tested recovery capability.',
    ],
    evidence: [
      'Business impact analysis with RTO/RPO values',
      'ICT continuity and recovery plans',
      'Recovery test results compared with objectives',
    ],
    ncs: [
      'Recovery objectives are defined but recovery has never been tested.',
      'Tested recovery time far exceeds the agreed objective with no action plan.',
      'Critical systems are missing from the continuity plan.',
    ],
    related: ['5.29', '8.13', '8.14'],
  },
  {
    id: '5.31', title: 'Legal, statutory, regulatory and contractual requirements',
    purpose: 'Identifies the laws, regulations and contractual obligations that affect information security, and keeps them up to date so the ISMS meets them.',
    implement: [
      'Maintain a register of applicable legal, regulatory and contractual requirements with owners.',
      'Map each requirement to the controls that satisfy it.',
      'Monitor for new or changed requirements — new laws, new customer contracts.',
      'Review the register periodically with legal or compliance input.',
    ],
    evidence: [
      'Legal and contractual requirements register with owners and review dates',
      'Mapping of requirements to controls',
      'Evidence of updates after legal or contractual change',
    ],
    ncs: [
      'A new data protection law in a key market is not in the register.',
      'Customer contractual security requirements are not tracked anywhere.',
      'The register has not been reviewed in years.',
    ],
    related: ['5.32', '5.33', '5.34', '5.36'],
  },
  {
    id: '5.32', title: 'Intellectual property rights',
    purpose: 'Protects intellectual property — the organisation\'s own and that of others — and ensures software and content are used within licence terms.',
    implement: [
      'Track software licences and check usage against entitlements.',
      'Only acquire software and content from reputable, legitimate sources.',
      'Set rules for use of third-party content, open-source licences and code.',
      'Protect the organisation\'s own IP with appropriate agreements and controls.',
    ],
    evidence: [
      'Software asset management or licence records',
      'Policy on software installation and open-source use',
      'Licence compliance reviews',
    ],
    ncs: [
      'More copies of a licensed product are installed than were purchased.',
      'Open-source components are used with no review of licence obligations.',
      'Unlicensed software was found on several workstations.',
    ],
    related: ['5.31', '8.19'],
  },
  {
    id: '5.33', title: 'Protection of records',
    purpose: 'Protects records from loss, destruction, falsification and unauthorised access, and keeps them for as long as law, contract and business need require.',
    implement: [
      'Define a retention schedule for record types with legal or business justification.',
      'Store records so they stay readable and unaltered for the full retention period.',
      'Control access and changes to records.',
      'Dispose of records securely at the end of retention.',
    ],
    evidence: [
      'Records retention schedule',
      'Storage and access controls for key records',
      'Disposal logs for records past retention',
    ],
    ncs: [
      'No retention schedule exists, so records are kept forever or deleted at random.',
      'Audit records can be edited by the people they relate to.',
      'Records past retention are not disposed of.',
    ],
    related: ['5.31', '5.34', '8.10', '8.13'],
  },
  {
    id: '5.34', title: 'Privacy and protection of PII',
    purpose: 'Meets privacy and data protection obligations for personally identifiable information (PII) across its whole life cycle.',
    implement: [
      'Identify applicable privacy laws and the PII the organisation processes.',
      'Assign privacy responsibilities (for example a data protection officer where required).',
      'Apply privacy principles: lawful basis, data minimisation, retention limits, subject rights.',
      'Integrate privacy into security controls, supplier management and incident response.',
    ],
    evidence: [
      'Privacy policy and record of processing activities',
      'Data protection impact assessments for high-risk processing',
      'Procedures for data subject requests and breach notification',
    ],
    ncs: [
      'No record exists of what personal data is processed or where.',
      'A high-risk processing activity started without an impact assessment.',
      'Data subject requests are handled ad hoc and miss legal deadlines.',
    ],
    related: ['5.31', '5.33', '8.11', '8.12'],
  },
  {
    id: '5.35', title: 'Independent review of information security',
    purpose: 'Has the organisation\'s approach to security reviewed by someone independent of the area being reviewed, at planned intervals and after significant change.',
    implement: [
      'Plan independent reviews — by internal audit, a separate team or external assessors.',
      'Make sure reviewers are independent of the work they review.',
      'Report results to management and track corrective actions.',
      'Trigger additional reviews after major changes or incidents.',
    ],
    evidence: [
      'Independent review plans and reports',
      'Evidence of reviewer independence',
      'Management responses and action tracking',
    ],
    ncs: [
      'The only review of the ISMS was performed by the ISMS manager.',
      'Review findings were reported but never acted on.',
      'No independent review followed a major organisational change.',
    ],
    related: ['5.36', '8.34'],
  },
  {
    id: '5.36', title: 'Compliance with policies, rules and standards for information security',
    purpose: 'Checks regularly that the organisation actually follows its own security policies, rules and standards — and acts when it does not.',
    implement: [
      'Have managers and control owners check compliance in their areas periodically.',
      'Use technical checks (configuration scans, compliance dashboards) where possible.',
      'Record non-compliance, its cause and the corrective action.',
      'Report compliance status to management.',
    ],
    evidence: [
      'Compliance check records and results',
      'Technical compliance reports',
      'Corrective action records for identified non-compliance',
    ],
    ncs: [
      'No one checks whether the configuration standard is applied.',
      'Known policy exceptions are not recorded or approved.',
      'Compliance issues are found repeatedly without root-cause action.',
    ],
    related: ['5.1', '5.35', '8.9'],
  },
  {
    id: '5.37', title: 'Documented operating procedures',
    purpose: 'Documents how information processing facilities are operated, so tasks are done consistently, securely and by more than one person.',
    implement: [
      'Document procedures for key operational tasks: backups, patching, user administration, monitoring, start-up and shut-down.',
      'Keep procedures where operators can use them, under version control.',
      'Review and update procedures when systems or processes change.',
      'Use procedures to train and cover for staff absence.',
    ],
    evidence: [
      'Operating procedures with owners and review dates',
      'Evidence procedures are followed (logs, checklists, tickets)',
      'Updates following system changes',
    ],
    ncs: [
      'Backup restoration depends on one engineer with no written procedure.',
      'Procedures describe a system that has since been replaced.',
      'Operators do not know procedures exist.',
    ],
    related: ['5.1', '8.13', '8.32'],
  },
]

const PEOPLE = [
  {
    id: '6.1', title: 'Screening',
    purpose: 'Checks the background of people before they join, proportionate to the role, the information they will access and the law — so trust is earned before access is granted.',
    implement: [
      'Define screening levels by role risk: identity and right-to-work for everyone, deeper checks for privileged or sensitive roles.',
      'Cover contractors and agency staff, either directly or through contractual requirements on the supplier.',
      'Follow local employment and privacy law on what may be checked and how results are stored.',
      'Re-screen when people move into higher-risk roles, and periodically where the law allows.',
    ],
    evidence: [
      'Screening policy with checks per role category',
      'Completed screening records for a sample of recent joiners (held securely by HR)',
      'Contract clauses requiring suppliers to screen their staff',
    ],
    ncs: [
      'A privileged administrator started work before checks were completed.',
      'Contractors with access to customer data were never screened.',
      'Screening records cannot be found for several recent joiners.',
    ],
    related: ['6.2', '5.19', '8.2'],
  },
  {
    id: '6.2', title: 'Terms and conditions of employment',
    purpose: 'Puts each person\'s information security responsibilities into their employment or engagement contract, so obligations are agreed and enforceable from day one.',
    implement: [
      'Include security, confidentiality and acceptable use obligations in employment contracts and contractor agreements.',
      'Reference the relevant policies and state that they form part of the terms.',
      'Make clear which responsibilities continue after the person leaves.',
      'Obtain signed agreement before access is granted.',
    ],
    evidence: [
      'Contract templates with security clauses',
      'Signed contracts for a sample of staff and contractors',
      'Policy acknowledgement records linked to onboarding',
    ],
    ncs: [
      'Contractor agreements contain no security or confidentiality obligations.',
      'Contracts reference policies that no longer exist.',
      'Staff were granted access before signing their contract.',
    ],
    related: ['6.1', '6.5', '6.6', '5.10'],
  },
  {
    id: '6.3', title: 'Information security awareness, education and training',
    purpose: 'Gives people the knowledge they need to protect information in their role — not one induction slide deck, but ongoing awareness plus deeper training where roles need it.',
    implement: [
      'Run awareness for everyone at induction and at regular intervals afterwards.',
      'Add role-based training for higher-risk roles: developers, administrators, finance, HR.',
      'Use varied, current content — phishing simulations, short modules, incident lessons.',
      'Measure effectiveness (quiz results, simulation click rates) and adjust the programme.',
    ],
    evidence: [
      'Awareness and training plan with audiences and frequency',
      'Completion records, with overdue training followed up',
      'Effectiveness measures such as phishing simulation results over time',
    ],
    ncs: [
      'Training happens only at induction; long-serving staff have had none for years.',
      'Developers get the same generic training as everyone else.',
      'Completion is tracked but effectiveness is never measured.',
    ],
    related: ['5.1', '5.4', '6.8', '7.7'],
  },
  {
    id: '6.4', title: 'Disciplinary process',
    purpose: 'Provides a fair, known process for dealing with people who breach security policy, which both deters breaches and makes the response consistent.',
    implement: [
      'Make sure the disciplinary process explicitly covers information security breaches.',
      'Communicate the process so people know the consequences.',
      'Apply it proportionately and consistently, considering intent and impact.',
      'Coordinate with HR and legal, and preserve evidence where needed.',
    ],
    evidence: [
      'HR disciplinary policy referencing security breaches',
      'Communication of the process (handbook, training)',
      'Anonymised records of cases handled under it',
    ],
    ncs: [
      'Repeated deliberate policy breaches have had no consequences.',
      'The disciplinary policy does not mention information security.',
      'Similar breaches were treated very differently with no rationale.',
    ],
    related: ['5.4', '6.2', '5.28'],
  },
  {
    id: '6.5', title: 'Responsibilities after termination or change of employment',
    purpose: 'Makes sure security obligations that outlast employment — such as confidentiality — are communicated and enforced when someone leaves or changes role.',
    implement: [
      'Remind leavers of continuing obligations at exit, in writing.',
      'Coordinate leaver steps across HR, IT, facilities and line management (access removal, asset return).',
      'Treat role changes as both a leave and a join: remove old access, grant new.',
      'Cover contractors and suppliers\' staff when engagements end.',
    ],
    evidence: [
      'Exit checklist and leaver letters referencing ongoing obligations',
      'Access removal and asset return records for recent leavers',
      'Mover process records showing old access removed',
    ],
    ncs: [
      'Leavers are not reminded of their confidentiality obligations.',
      'Staff who changed departments still hold their previous access.',
      'Contractor departures are not communicated to IT.',
    ],
    related: ['5.11', '5.18', '6.2', '6.6'],
  },
  {
    id: '6.6', title: 'Confidentiality or non-disclosure agreements',
    purpose: 'Uses confidentiality or non-disclosure agreements to protect information shared with staff, contractors and third parties, reflecting what actually needs protecting.',
    implement: [
      'Identify where NDAs are needed: staff, contractors, consultants, partners, visitors to sensitive areas.',
      'Make sure terms cover what is confidential, permitted use, duration and return or destruction.',
      'Get NDAs signed before confidential information is shared.',
      'Review templates periodically and when requirements change.',
    ],
    evidence: [
      'NDA templates reviewed by legal',
      'Signed NDAs for a sample of contractors and partners',
      'A register or record of NDAs in place',
    ],
    ncs: [
      'Confidential designs were shared with a contractor before any NDA was signed.',
      'The NDA template has not been reviewed in many years.',
      'No one can find the NDAs for a key outsourced team.',
    ],
    related: ['6.2', '5.14', '5.20'],
  },
  {
    id: '6.7', title: 'Remote working',
    purpose: 'Protects information accessed, processed or stored outside the organisation\'s premises — at home, while travelling or in shared spaces.',
    implement: [
      'Set remote working rules: approved devices, secure connections, screen privacy, home network basics.',
      'Provide secure access (VPN or zero-trust access, MFA) and managed devices.',
      'Address printing, storage and disposal of information at home.',
      'Include remote working risks in awareness training.',
    ],
    evidence: [
      'Remote working policy',
      'Device management and secure access configurations',
      'Training content covering remote working',
    ],
    ncs: [
      'Staff access sensitive systems from unmanaged personal devices with no controls.',
      'Remote access does not require MFA.',
      'There are no rules for confidential paperwork printed at home.',
    ],
    related: ['7.9', '8.1', '8.5', '6.3'],
  },
  {
    id: '6.8', title: 'Information security event reporting',
    purpose: 'Gives everyone a quick, easy way to report suspected security events, so problems are found early by the people who see them first.',
    implement: [
      'Provide simple reporting channels — a phish-report button, service desk category, email address or phone line.',
      'Tell staff what to report and reassure them that reporting in good faith is welcome.',
      'Make sure reports reach the people who triage events promptly.',
      'Give reporters feedback so reporting feels worthwhile.',
    ],
    evidence: [
      'Published reporting channels and guidance',
      'Records of reported events and their handling',
      'Awareness content encouraging reporting',
    ],
    ncs: [
      'Staff interviewed do not know how to report a suspected incident.',
      'Reports to the shared mailbox sat unread for days.',
      'Contractors have no way to report events.',
    ],
    related: ['5.24', '5.25', '6.3'],
  },
]

const PHYSICAL = [
  {
    id: '7.1', title: 'Physical security perimeters',
    purpose: 'Defines and protects the physical boundaries around areas that hold information and processing facilities, so unauthorised people cannot simply walk in.',
    implement: [
      'Identify the perimeters to protect: buildings, floors, server rooms, records stores.',
      'Make perimeters physically sound — walls, doors, windows and roof access without obvious gaps.',
      'Match the strength of the perimeter to the sensitivity of what is inside.',
      'Consider shared buildings and the controls owned by landlords or co-tenants.',
    ],
    evidence: [
      'Site plans showing defined secure areas',
      'Physical inspection of doors, windows and access points',
      'Agreements with landlords covering shared perimeter controls',
    ],
    ncs: [
      'A fire exit to the server room is propped open for ventilation.',
      'Secure areas are not defined, so controls are applied inconsistently.',
      'Ground-floor windows into the records room are not secured.',
    ],
    related: ['7.2', '7.3', '7.4'],
  },
  {
    id: '7.2', title: 'Physical entry',
    purpose: 'Controls who can enter secure areas through entry points — staff, visitors and deliveries — so only authorised people get in.',
    implement: [
      'Use access control (badges, keys, biometrics) at entry points, with rights based on need.',
      'Manage visitors: sign-in, identification, visitor badges, escorts in sensitive areas.',
      'Handle deliveries in controlled areas away from sensitive facilities.',
      'Review physical access rights periodically and remove them for leavers.',
    ],
    evidence: [
      'Access control system configuration and access lists',
      'Visitor logs and visitor badge process',
      'Physical access reviews and leaver removals',
    ],
    ncs: [
      'Leavers\' badges remain active in the access system.',
      'Visitors enter the server room without signing in.',
      'Tailgating through secure doors is common and unchallenged.',
    ],
    related: ['7.1', '7.3', '7.4', '5.18'],
  },
  {
    id: '7.3', title: 'Securing offices, rooms and facilities',
    purpose: 'Applies physical security to the offices, rooms and facilities inside the perimeter, especially those that hold sensitive information or equipment.',
    implement: [
      'Lock rooms that hold sensitive equipment or records when unattended.',
      'Avoid signs that advertise what sensitive rooms contain.',
      'Position sensitive work so it cannot be seen or overheard from public areas.',
      'Control keys and access codes to these rooms.',
    ],
    evidence: [
      'Inspection of locks and room security',
      'Key and access code registers',
      'Observation of sensitive work areas',
    ],
    ncs: [
      'The comms room is unlocked and used for storing cleaning supplies.',
      'Keys to the records store are kept in an unlocked drawer.',
      'HR interviews are held where conversations can be overheard.',
    ],
    related: ['7.1', '7.2', '7.6'],
  },
  {
    id: '7.4', title: 'Physical security monitoring', isNew: true,
    purpose: 'Continuously monitors premises for unauthorised physical access, so intrusions are detected and responded to rather than discovered later.',
    implement: [
      'Use monitoring proportionate to risk: CCTV, intruder alarms, guards, door-held-open alerts.',
      'Make sure alarms and footage are actually watched or reviewed, with a defined response.',
      'Protect monitoring systems and footage from tampering and unauthorised access.',
      'Respect privacy law on CCTV placement and retention.',
    ],
    evidence: [
      'Monitoring system coverage and maintenance records',
      'Alarm response procedures and logs',
      'CCTV retention settings and access controls',
    ],
    ncs: [
      'CCTV records but no one reviews footage or alerts.',
      'Intruder alarms are routinely left unset.',
      'The CCTV recorder sits in an unlocked cupboard.',
    ],
    related: ['7.1', '7.2', '5.28'],
  },
  {
    id: '7.5', title: 'Protecting against physical and environmental threats',
    purpose: 'Protects facilities against natural and man-made threats — fire, flood, heat, power surges, storms, civil unrest — based on a realistic assessment of the site.',
    implement: [
      'Assess site-specific threats when choosing and designing facilities.',
      'Install appropriate protection: fire detection and suppression, leak detection, temperature monitoring.',
      'Keep sensitive equipment away from water pipes and flood-prone areas.',
      'Test and maintain protective systems.',
    ],
    evidence: [
      'Site risk assessment covering environmental threats',
      'Fire suppression and detection test records',
      'Environmental monitoring alerts and responses',
    ],
    ncs: [
      'The server room sits beneath washrooms with no leak detection.',
      'Fire suppression has not been inspected within its required interval.',
      'Temperature alarms go to a mailbox nobody monitors.',
    ],
    related: ['7.8', '7.11', '5.29'],
  },
  {
    id: '7.6', title: 'Working in secure areas',
    purpose: 'Sets rules for behaviour inside secure areas, so the controls that protect them are not undermined by the people working there.',
    implement: [
      'Tell people working in secure areas only what they need to know about the area.',
      'Supervise unsupervised work, especially by third parties.',
      'Restrict photography, recording devices and removable media where appropriate.',
      'Lock and check vacant secure areas.',
    ],
    evidence: [
      'Secure area working rules',
      'Supervision records for third-party work',
      'Signage or rules on recording devices',
    ],
    ncs: [
      'Contractors work alone in the data centre without supervision.',
      'Staff photograph secure area equipment for social media.',
      'Rules for secure areas exist but no one working there knows them.',
    ],
    related: ['7.3', '7.2'],
  },
  {
    id: '7.7', title: 'Clear desk and clear screen',
    purpose: 'Reduces exposure of information left on desks and screens, including printed material, removable media and unlocked sessions.',
    implement: [
      'Require sensitive papers and media to be locked away when not in use.',
      'Enforce automatic screen locking and teach people to lock screens when they step away.',
      'Clear printers and meeting rooms of sensitive material promptly.',
      'Spot-check compliance and give feedback.',
    ],
    evidence: [
      'Clear desk and clear screen policy',
      'Screen lock configuration in device management',
      'Spot-check records and results',
    ],
    ncs: [
      'Printed customer data was left on desks overnight.',
      'Screen locking is not enforced on laptops.',
      'Whiteboards in meeting rooms show sensitive information after meetings.',
    ],
    related: ['6.3', '7.3', '8.1'],
  },
  {
    id: '7.8', title: 'Equipment siting and protection',
    purpose: 'Places and protects equipment to reduce risks from environmental threats and unauthorised access or viewing.',
    implement: [
      'Site equipment away from hazards such as water, heat and dust.',
      'Position screens that show sensitive information so they cannot be overlooked.',
      'Secure equipment in racks or enclosures in shared spaces.',
      'Control eating, drinking and smoking near critical equipment.',
    ],
    evidence: [
      'Inspection of equipment placement and racks',
      'Positioning of screens in public or shared areas',
      'Facility rules near critical equipment',
    ],
    ncs: [
      'A reception screen showing customer records faces the waiting area.',
      'Network equipment sits on the floor in an open office corridor.',
      'Servers are located under a known roof leak.',
    ],
    related: ['7.5', '7.3', '7.9'],
  },
  {
    id: '7.9', title: 'Security of assets off-premises',
    purpose: 'Protects equipment and information taken outside the organisation\'s premises, where theft, loss and overlooking are more likely.',
    implement: [
      'Set rules for taking equipment and information off-site, including approval where needed.',
      'Encrypt laptops and mobile devices and enable remote wipe.',
      'Advise people on safe travel practice — not leaving devices unattended, privacy screens.',
      'Track off-site equipment in the asset inventory.',
    ],
    evidence: [
      'Off-site equipment rules',
      'Device encryption and remote wipe status from device management',
      'Lost or stolen device reports and their handling',
    ],
    ncs: [
      'Laptops used off-site are not encrypted.',
      'A lost phone could not be wiped because it was not enrolled.',
      'Equipment at a permanent off-site location is not in the inventory.',
    ],
    related: ['6.7', '8.1', '5.9'],
  },
  {
    id: '7.10', title: 'Storage media',
    purpose: 'Manages removable and other storage media through its life — acquisition, use, transport, re-use and disposal — so information on it is not lost or exposed.',
    implement: [
      'Decide whether removable media is allowed and enforce the decision technically.',
      'Encrypt sensitive information on media and keep a register of media holding it.',
      'Protect media in transit with approved couriers and packaging.',
      'Securely erase or destroy media before re-use or disposal.',
    ],
    evidence: [
      'Removable media policy and technical enforcement settings',
      'Media register for sensitive media',
      'Destruction certificates or erasure records',
    ],
    ncs: [
      'USB storage is allowed on all devices with no encryption or logging.',
      'Backup tapes are shipped without tracking.',
      'Old hard drives were reused without secure erasure.',
    ],
    related: ['7.14', '8.10', '8.12'],
  },
  {
    id: '7.11', title: 'Supporting utilities',
    purpose: 'Protects information processing facilities from failures of supporting utilities such as power, cooling and telecommunications.',
    implement: [
      'Identify the utilities critical facilities depend on.',
      'Provide resilience where justified: UPS, generators, redundant cooling, diverse network links.',
      'Monitor utilities and alert on faults.',
      'Test failover equipment and maintain it on schedule.',
    ],
    evidence: [
      'UPS and generator test and maintenance records',
      'Utility monitoring alerts',
      'Diverse supply or link documentation',
    ],
    ncs: [
      'The UPS battery has not been tested and fails on load.',
      'The generator has never been started under load.',
      'All network links share a single physical route into the building.',
    ],
    related: ['7.5', '7.12', '8.14'],
  },
  {
    id: '7.12', title: 'Cabling security',
    purpose: 'Protects power and data cabling from interception, interference and damage.',
    implement: [
      'Route cables through protected paths — conduits, ceilings, floors — not public areas.',
      'Separate power and data cables to avoid interference.',
      'Label and document cabling, and lock patch panels and cabinets.',
      'Inspect periodically for unauthorised devices or damage.',
    ],
    evidence: [
      'Cabling documentation and labelling',
      'Locked patch panels and cabinets',
      'Inspection records',
    ],
    ncs: [
      'Network ports in public reception areas are live.',
      'Patch cabinets are unlocked in open areas.',
      'No documentation shows where critical links run.',
    ],
    related: ['7.11', '7.8', '8.20'],
  },
  {
    id: '7.13', title: 'Equipment maintenance',
    purpose: 'Keeps equipment correctly maintained so it stays available and secure, and makes sure maintenance itself does not expose information.',
    implement: [
      'Maintain equipment according to supplier recommendations and schedules.',
      'Use authorised maintenance personnel and record all maintenance.',
      'Supervise on-site maintenance and control what leaves the site.',
      'Check equipment after maintenance before returning it to service.',
    ],
    evidence: [
      'Maintenance schedules and service records',
      'Approved maintenance supplier list',
      'Records of equipment sent off-site for repair and how data was protected',
    ],
    ncs: [
      'A failed drive was sent for repair with unencrypted customer data on it.',
      'Maintenance is reactive only, with no schedule.',
      'Unvetted engineers maintain equipment unsupervised.',
    ],
    related: ['7.14', '7.11', '8.10'],
  },
  {
    id: '7.14', title: 'Secure disposal or re-use of equipment',
    purpose: 'Makes sure information and licensed software are removed from equipment before it is disposed of or re-used.',
    implement: [
      'Erase storage with verified methods or physically destroy it before disposal or re-use.',
      'Use certified disposal providers and obtain destruction certificates.',
      'Track equipment from decommissioning to final disposal.',
      'Verify that erasure actually succeeded on a sample basis.',
    ],
    evidence: [
      'Disposal procedure and approved providers',
      'Destruction or erasure certificates matched to asset records',
      'Verification checks on wiped devices',
    ],
    ncs: [
      'Old laptops were donated without verified wiping.',
      'Destruction certificates cannot be matched to specific assets.',
      'Drives removed from servers are stored in an unlocked box awaiting disposal.',
    ],
    related: ['7.10', '8.10', '5.9'],
  },
]

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function withMeta(theme, list) {
  return list.map((c) => ({
    ...c,
    theme,
    isNew: Boolean(c.isNew),
    slug: `${c.id.replace('.', '-')}-${slugify(c.title)}`,
  }))
}

export const CONTROLS = [
  ...withMeta('organizational', ORGANIZATIONAL),
  ...withMeta('people', PEOPLE),
  ...withMeta('physical', PHYSICAL),
]

export const CONTROLS_BY_ID = Object.fromEntries(CONTROLS.map((c) => [c.id, c]))
export const CONTROLS_BY_SLUG = Object.fromEntries(CONTROLS.map((c) => [c.slug, c]))
