export const blogPosts = [
  {
    id: '1',
    slug: 'what-is-iso-27001-2022-practical-guide',
    title: 'What is ISO 27001:2022? A Practical Guide for ISMS Teams',
    excerpt: 'A practical walkthrough of ISO 27001 clauses, risk treatment workflow, Statement of Applicability, and internal audit readiness.',
    content: `
      <h2>The Foundation of Information Security</h2>
      <p>ISO/IEC 27001 is the world's best-known standard for information security management systems (ISMS). It defines the requirements an ISMS must meet. The standard provides companies of any size and from all sectors of activity with guidance for establishing, implementing, maintaining and continually improving an information security management system.</p>
      
      <h2>What's New in the 2022 Update?</h2>
      <p>The 2022 revision brought several crucial changes to how organizations approach security:</p>
      <ul>
        <li><strong>Structural Consolidation:</strong> Annex A controls were reorganized from 14 domains down to 4 themes: Organizational, People, Physical, and Technological.</li>
        <li><strong>Total Controls:</strong> The number of controls decreased from 114 to 93, largely through merging redundant controls rather than removing security requirements.</li>
        <li><strong>New Threats adderssed:</strong> 11 entirely new controls were introduced, including Threat Intelligence, Data Leakage Prevention, and Cloud Services Security.</li>
      </ul>

      <h2>The Risk Treatment Workflow</h2>
      <p>At the core of an ISMS is the risk assessment and treatment process. You cannot secure what you don't understand. A compliant organization must:</p>
      <ol>
        <li>Identify information security risks based on business context.</li>
        <li>Analyze and evaluate those risks against established criteria.</li>
        <li>Select appropriate risk treatment options (Accept, Avoid, Transfer, Mitigate).</li>
        <li>Produce a Statement of Applicability (SoA).</li>
      </ol>

      <div class="bg-surface-container rounded-lg p-5 my-6 border-l-4 border-gold">
        <p class="font-semibold text-gold mb-2">Audit Pro Tip</p>
        <p class="text-white/70">Auditors won't just look for empty templates. They want to see <strong>evidence</strong> that the board reviews risks and that the treatment plan is actively monitored.</p>
      </div>

      <h2>Internal Audit Readiness</h2>
      <p>Before inviting the external auditors for Stage 1 or Stage 2, your internal audit team must review the ISMS independently. This includes checking documentation validity, conducting interviews with process owners, and verifying the efficacy of implemented controls.</p>
    `,
    author: '27001certified Team',
    date: '2026-03-17',
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    readTime: '5 min read'
  },
  {
    id: '2',
    slug: 'mastering-annex-a-controls',
    title: 'Demystifying Annex A: The 93 Controls You Need to Know',
    excerpt: 'An overview of the new Annex A control structure in the 2022 revision, covering Organizational, People, Physical, and Technological controls.',
    content: `
      <h2>The Shift to Four Themes</h2>
      <p>Previously grouped into 14 unwieldy domains, the 2022 update to ISO 27001 reorganized Annex A into 4 logical themes. This makes scoping and assigning ownership significantly easier for ISMS managers.</p>
      
      <h3>1. Organizational Controls (37 controls)</h3>
      <p>These relate to rules, processes, and procedures. Examples include Information Security Policies, Asset Inventory, and Return of Assets. Management and governance sit heavily here.</p>
      
      <h3>2. People Controls (8 controls)</h3>
      <p>Focusing on the human element, these controls address terms and conditions of employment, awareness training, screening, and disciplinary processes. Security is only as strong as your weakest link.</p>
      
      <h3>3. Physical Controls (14 controls)</h3>
      <p>Protecting the physical perimeter. This covers physical security perimeters, physical entry controls, securing offices, and equipment siting and protection. Even if your architecture is in the cloud, how do you handle physical laptops?</p>
      
      <h3>4. Technological Controls (34 controls)</h3>
      <p>The technical implementation: access control, cryptography, secure coding, network security, and data leakage prevention. This is where your IT and DevSecOps teams will spend the most time.</p>

      <h2>Attributes: The Game Changer</h2>
      <p>A massive improvement in 2022 is the introduction of Attributes. Now, controls can be filtered by: Control Type, Information Security Properties (CIA), Cybersecurity Concepts, Operational Capabilities, and Security Domains. This allows organizations to build custom views of their SoA instantly.</p>
    `,
    author: 'Security Architect',
    date: '2026-03-24',
    imageUrl: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    readTime: '6 min read'
  },
  {
    id: '3',
    slug: 'top-reasons-audits-fail',
    title: 'Top 5 Reasons Internal Audits Uncover Major Nonconformities',
    excerpt: 'Avoid these common mistakes when preparing your ISMS. From missing management reviews to poor evidence collection.',
    content: `
      <h2>Where Do Organizations Stumble?</h2>
      <p>Achieving certification requires dedication. However, many organizations trip over the same hurdles during their internal and external audits.</p>
      
      <ul>
        <li><strong>1. Inadequate Management Review:</strong> Clause 9.3 mandates that top management must review the ISMS at planned intervals. Missing meeting minutes or failure to address previous action items is a frequent major nonconformity.</li>
        <li><strong>2. Outdated Asset Registers:</strong> A spreadsheet generated six months ago and never updated won't survive an audit. Your asset inventory must reflect the current operating reality, including shadowy SaaS tools.</li>
        <li><strong>3. Poor Access Review (User Access Provisioning):</strong> Failing to revoke access for terminated employees is a critical error. Auditors will almost certainly sample a list of recent terminations and ask you to prove when their access was disabled.</li>
        <li><strong>4. Non-Functional Incident Response:</strong> Having a policy is not enough. Have you tested it? Who is on the response team? Do they know their roles? Lack of evidence showing an incident response test is a common failure point.</li>
        <li><strong>5. Ignoring Supplier Risk:</strong> Clause 15 demands you evaluate and manage the security risks of your suppliers. Have your critical vendors filled out a security questionnaire? Are DPA's in place?</li>
      </ul>

      <p>Don't wait until the external audit to find these skeletons. A rigorous internal audit is your best defense against major nonconformities.</p>
    `,
    author: 'Lead Auditor',
    date: '2026-04-02',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    readTime: '4 min read'
  }
]
