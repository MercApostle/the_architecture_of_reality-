import { createClient as createServerSupabase } from '@/lib/supabase/server';
import type { Course, Module, Lesson } from '@/lib/supabase/types';

export interface WorkbookField {
  id: string;
  label: string;
  placeholder?: string;
  type: 'textarea' | 'select' | 'number' | 'text';
  options?: string[];
  helperText?: string;
}

export interface DownloadAttachment {
  title: string;
  file_url: string;
  type: string;
  size?: string;
}

export interface LessonWithDetails extends Omit<Lesson, 'download_attachments' | 'workbook_schema'> {
  download_attachments: DownloadAttachment[];
  workbook_schema: WorkbookField[];
}

export interface ModuleWithLessons extends Module {
  lessons: LessonWithDetails[];
}

export interface CourseWithCurriculum extends Course {
  modules: ModuleWithLessons[];
  totalLessons: number;
  totalDurationMins: number;
}

// -----------------------------------------------------------------------------
// CANONICAL FALLBACK CURRICULA (Books I, II, & III)
// -----------------------------------------------------------------------------

export const FALLBACK_ACADEMY_COURSES: CourseWithCurriculum[] = [
  {
    id: '10000000-0000-0000-0000-000000000001',
    slug: 'master-blueprint-course',
    title: 'The Master Blueprint Course',
    subtitle: 'Calibrating the Vessel & The 80-Hour Work Month',
    description:
      'Comprehensive multi-modal training on biological nervous-system regulation, identifying cognitive leaks, and transitioning your business to the 80-hour work month.',
    book_alignment: 'book_1',
    price_cents: 14700,
    stripe_price_id: 'price_master_blueprint',
    is_published: true,
    totalLessons: 6,
    totalDurationMins: 215,
    modules: [
      {
        id: 'mod-mb-1',
        course_id: '10000000-0000-0000-0000-000000000001',
        title: 'Module 1: The Human Vessel & Nervous System Calibration',
        sort_order: 1,
        lessons: [
          {
            id: 'les-mb-1-1',
            module_id: 'mod-mb-1',
            slug: 'biological-drag-and-limits',
            title: '1.1 Biological Drag & The Law of Diminishing Returns',
            sort_order: 1,
            is_free_preview: true,
            video_embed_url: 'https://www.youtube.com/embed/HPs56IKcE4Q',
            audio_url: 'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3',
            content_md: `### The Mathematical Law of Human Capacity

You cannot outsmart your biological wiring. When an operator pushes their cognitive container beyond four consecutive hours of high-stakes output, neural latency spikes, error rates triple, and subtle emotional friction cascades throughout the entire organization.

\`\`\`
Output Efficiency
100% |  ═════════╗
 75% |           ╚════╗
 50% |                ╚═════╗
 25% |                      ╚══════════════ (Exhaustion & Friction)
  0% └────────────────────────────────────
     0h         4h          8h         12h
\`\`\`

#### Key Realities of the Vessel:
1. **The 4-Hour Daily Vector**: Evolution engineered the human nervous system for acute, intense sprints of hunting or problem-solving, balanced by extensive periods of ambient observation and recovery.
2. **Artificial Urgency**: Straining past hour four is rarely about high leverage—it is an unconscious nervous-system addiction to adrenaline used to mask fear of silence or boundary enforcement.
3. **The Sovereign Standard**: Real capacity is quiet, effortless execution. When your vessel is calibrated, 20 focused hours generate more systemic progress than 70 hours of frantic thrashing.`,
            download_attachments: [
              {
                title: 'The 80-Hour Work Month Master Template',
                file_url: '/pdfs/the-master-blueprint.pdf',
                type: 'PDF Guide',
                size: '2.4 MB',
              },
              {
                title: 'Nervous System Somatic Reset Protocols',
                file_url: '/pdfs/the-architecture-of-reality.pdf',
                type: 'Field Manual',
                size: '1.8 MB',
              },
            ],
            workbook_schema: [
              {
                id: 'current_hours',
                label: 'Current Weekly Workload',
                placeholder: 'e.g., 55',
                type: 'number',
                helperText: 'Enter the approximate hours you currently spend on work, email, and meetings each week.',
              },
              {
                id: 'stress_drift',
                label: 'Primary Stress Drift Pattern',
                type: 'select',
                options: [
                  'Forcing Polarity — Jaw clenching, hyper-control, forcing outcomes through sheer exertion',
                  'Passive Polarity — Avoidance, looping distraction, delaying difficult decisions',
                  'Oscillating — Bouncing between desperate control and exhausted collapse',
                ],
                helperText: 'Identify which behavioral pattern takes over when your nervous system feels overwhelmed.',
              },
              {
                id: 'primary_cognitive_leak',
                label: 'The Primary Cognitive Leak in Your Operations',
                placeholder: 'Where is your attention bleeding away each day? (e.g., reactive Slack pings, unneeded client meetings, indecisive team members)',
                type: 'textarea',
                helperText: 'Be brutally specific. Name the low-leverage activities draining your container.',
              },
            ],
          },
          {
            id: 'les-mb-1-2',
            module_id: 'mod-mb-1',
            slug: 'four-hour-daily-vector',
            title: '1.2 Calibrating the 4-Hour Daily Vector',
            sort_order: 2,
            is_free_preview: false,
            video_embed_url: 'https://www.youtube.com/embed/HPs56IKcE4Q',
            audio_url: 'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3',
            content_md: `### Architecting the Single-Vector Morning

Most leaders lose their day within the first 15 minutes of waking. By scanning notifications, email feeds, and market chatter, the brain's reticular activating system is immediately hijacked into a defensive, reactive stance.

#### The Protocol:
- **Zero Input Window (60–90 Mins)**: Zero incoming digital signal until the first core vector of the day is completed.
- **The Core Vector Block**: A dedicated 240-minute window divided into two 90-minute deep cycles separated by a 20-minute somatic walk.
- **Cognitive Shutdown**: At the stroke of the fourth hour, the operational gate slams shut.

> "He who cannot govern his first four hours will spend the remaining twelve serving the urgent agendas of others."`,
            download_attachments: [
              {
                title: 'Single-Vector Daily Architecture Sheet',
                file_url: '/pdfs/the-master-blueprint.pdf',
                type: 'Worksheet',
                size: '1.2 MB',
              },
            ],
            workbook_schema: [
              {
                id: 'morning_signal_audit',
                label: 'First Digital Action Upon Waking',
                placeholder: 'What is the exact sequence of items you look at when you open your eyes?',
                type: 'textarea',
              },
              {
                id: 'single_vector_priority',
                label: 'Tomorrow’s Single Core Vector',
                placeholder: 'If you were allowed only ONE 3-hour focus block tomorrow to advance your life’s mission, what must it be?',
                type: 'textarea',
              },
            ],
          },
          {
            id: 'les-mb-1-3',
            module_id: 'mod-mb-1',
            slug: 'evening-down-regulation',
            title: '1.3 Evening Down-Regulation & Somatic Grounding',
            sort_order: 3,
            is_free_preview: false,
            video_embed_url: 'https://www.youtube.com/embed/HPs56IKcE4Q',
            audio_url: 'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3',
            content_md: `### Breaking the Midnight Looping Engine

If you enter bed with elevated cortisol, your subconscious spends 8 hours resolving artificial workplace emergencies instead of undertaking biological tissue and memory repair.

#### Down-Regulation Stack:
1. **The 6:00 PM Hard Curfew**: Digital screens shift to amber; work laptops physically stored away.
2. **The Mind Dump Ledger**: Writing down tomorrow's 3 items on physical paper removes them from the brain's working memory loop.
3. **Vagal Tone Stimulation**: Extended exhalations and physical temperature cooling.`,
            download_attachments: [],
            workbook_schema: [
              {
                id: 'evening_shutdown_time',
                label: 'Target Hard Evening Shutdown Time',
                placeholder: 'e.g., 18:30',
                type: 'text',
              },
              {
                id: 'down_regulation_commitment',
                label: 'Evening Somatic Anchor',
                placeholder: 'What physical activity will signal to your nervous system that the day is won? (e.g., evening walk, sauna, reading physical book)',
                type: 'textarea',
              },
            ],
          },
        ],
      },
      {
        id: 'mod-mb-2',
        course_id: '10000000-0000-0000-0000-000000000001',
        title: 'Module 2: The 80-Hour Work Month Operating Cadence',
        sort_order: 2,
        lessons: [
          {
            id: 'les-mb-2-1',
            module_id: 'mod-mb-2',
            slug: 'industrial-illusion-deconstruction',
            title: '2.1 Deconstructing the Industrial 40-60 Hour Illusion',
            sort_order: 1,
            is_free_preview: false,
            video_embed_url: 'https://www.youtube.com/embed/HPs56IKcE4Q',
            audio_url: 'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3',
            content_md: `### The Origins of the 40-Hour Factory Standard

The 40-hour work week was engineered by Henry Ford in 1926 for manual factory line laborers stamping automotive parts. It was never intended for high-leverage intellectual capital, creative architecture, or executive decision-making.

Applying manual assembly-line hours to creative and strategic leadership creates systemic exhaustion. A sovereign leader operating at 80 hours per month consistently outperforms competitors working 250 hours because every decision is made with surgical clarity.`,
            download_attachments: [],
            workbook_schema: [
              {
                id: 'hours_reduction_target',
                label: 'Target Monthly Hours (Sovereign Target: 80h)',
                placeholder: '80',
                type: 'number',
              },
              {
                id: 'low_leverage_tasks',
                label: '3 Tasks That Can Be Immediately Delegated or Deleted',
                placeholder: '1. Repetitive status meetings\n2. Low-tier vendor negotiations\n3. Manual email sorting',
                type: 'textarea',
              },
            ],
          },
          {
            id: 'les-mb-2-2',
            module_id: 'mod-mb-2',
            slug: 'calendar-curfews-and-signal-fasts',
            title: '2.2 Calendar Curfews & Signal Fasting Protocols',
            sort_order: 2,
            is_free_preview: false,
            video_embed_url: 'https://www.youtube.com/embed/HPs56IKcE4Q',
            audio_url: 'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3',
            content_md: `### Building Defensive Calendar Architecture

If your calendar is open for anyone to book 30-minute meetings, you do not own your life—you are an on-call utility for other people's anxieties.

#### Inviolate Calendar Rules:
- **Zero Meeting Mondays & Fridays**: Reserved exclusively for strategic architecture and deep recovery.
- **Batch Window (Tuesday/Thursday 1–4 PM)**: All external calls compressed into single afternoons.
- **Strict Agenda Requirement**: No agenda = no meeting.`,
            download_attachments: [],
            workbook_schema: [
              {
                id: 'meeting_free_days',
                label: 'Designated Meeting-Free Days',
                placeholder: 'e.g., Monday & Friday',
                type: 'text',
              },
              {
                id: 'calendar_enforcement',
                label: 'How will you communicate this boundary to your team or partners?',
                placeholder: 'Draft your polite but unassailable policy memo here.',
                type: 'textarea',
              },
            ],
          },
          {
            id: 'les-mb-2-3',
            module_id: 'mod-mb-2',
            slug: 'weekly-sabbath-firewall',
            title: '2.3 The Weekly Sabbath Shutdown Firewall',
            sort_order: 3,
            is_free_preview: false,
            video_embed_url: 'https://www.youtube.com/embed/HPs56IKcE4Q',
            audio_url: 'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3',
            content_md: `### The Ancient 24-Hour Complete Blackout

Sabbath is not a religious observance; it is a profound engineering firewall against the hubris of thinking the world will stop turning if you stop working for 24 hours.

When you unplug completely for 24 continuous hours, you break the dopamine-reward loop of the ego and restore baseline cellular energy.`,
            download_attachments: [],
            workbook_schema: [
              {
                id: 'sabbath_window',
                label: 'Your Weekly 24-Hour Blackout Window',
                placeholder: 'e.g., Friday 6 PM – Saturday 6 PM',
                type: 'text',
              },
              {
                id: 'blackout_commitments',
                label: 'What devices will be physically powered off?',
                placeholder: 'Phones, laptops, tablets placed in locked drawer.',
                type: 'textarea',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: '10000000-0000-0000-0000-000000000002',
    slug: 'genesis-lens-course',
    title: 'The Genesis Lens Diagnostic Mastery',
    subtitle: 'The 7-Fold Code & The Tripartite Fruit Test',
    description:
      'Mastering the empirical diagnostic engine of creation. Test every partnership, signal, and strategy across Mind, Body, and Soul.',
    book_alignment: 'book_2',
    price_cents: 19700,
    stripe_price_id: 'price_genesis_lens',
    is_published: true,
    totalLessons: 6,
    totalDurationMins: 240,
    modules: [
      {
        id: 'mod-gl-1',
        course_id: '10000000-0000-0000-0000-000000000002',
        title: 'Module 1: The Empirical Diagnostic Engine (Genesis 1)',
        sort_order: 1,
        lessons: [
          {
            id: 'les-gl-1-1',
            module_id: 'mod-gl-1',
            slug: 'placing-the-firmament',
            title: '1.1 Signal vs Noise: Placing the Firmament',
            sort_order: 1,
            is_free_preview: true,
            video_embed_url: 'https://www.youtube.com/embed/HPs56IKcE4Q',
            audio_url: 'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3',
            content_md: `### The Systems Architecture of Genesis 1

Genesis 1 is an algorithmic description of how reality is drawn out of formless chaos (*Tohu wa-Bohu*) into generative stability.

The crucial architectural act of Day Two is the installation of the **Firmament** (*Raqia*)—a load-bearing boundary separating the chaotic waters above from the structured waters below.

In executive practice, whenever an enterprise is drowning in confusion, it lacks a Firmament. Leaders must erect clean structural boundaries that separate high-value strategic signals from operational noise.`,
            download_attachments: [
              {
                title: 'The Genesis 1 Systems Diagnostic Blueprint',
                file_url: '/pdfs/the-genesis-lens.pdf',
                type: 'PDF Diagram',
                size: '2.8 MB',
              },
            ],
            workbook_schema: [
              {
                id: 'current_chaos',
                label: 'Where is Formless Chaos (Tohu wa-Bohu) Present in Your Work?',
                placeholder: 'Describe the area in your business or health that feels formless, undefined, and noisy.',
                type: 'textarea',
              },
              {
                id: 'firmament_action',
                label: 'What Structural Firmament Must Be Erected?',
                placeholder: 'What clean boundary will divide signal from noise?',
                type: 'textarea',
              },
            ],
          },
          {
            id: 'les-gl-1-2',
            module_id: 'mod-gl-1',
            slug: 'seven-fold-code-of-generation',
            title: '1.2 The 7-Fold Code of Natural Generation',
            sort_order: 2,
            is_free_preview: false,
            video_embed_url: 'https://www.youtube.com/embed/HPs56IKcE4Q',
            audio_url: 'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3',
            content_md: `### The Seven Unbreakable Steps of Creation

1. **Light (Illumination)**: Seeing reality as it truly is without pretense.
2. **Firmament (Division)**: Separating essential signal from background noise.
3. **Dry Land (Foundation)**: Establishing a concrete, unshakeable operational base.
4. **Luminaries (Pacing & Rhythm)**: Setting daily, weekly, and seasonal cadences.
5. **Living Creatures (Momentum)**: Autonomous, multiplying operational systems.
6. **Sovereign Stewardship (Direction)**: Conscious alignment with truth and regenerative intent.
7. **Sabbath Rest (Celebration & Seal)**: Sustainable completion with zero lingering debt.`,
            download_attachments: [],
            workbook_schema: [
              {
                id: 'current_creation_day',
                label: 'Which Day of Creation Best Describes Your Current Venture?',
                type: 'select',
                options: [
                  'Day 1: Finding Light (Still discovering the core truth)',
                  'Day 2: Placing the Firmament (Setting boundaries & eliminating static)',
                  'Day 3: Building Dry Ground (Solidifying product & revenue base)',
                  'Day 4: Installing Luminaries (Setting team pacing & rhythm)',
                  'Day 5: Living Systems (Scaling autonomous operations)',
                  'Day 6: Sovereign Stewardship (Aligning enterprise with generational purpose)',
                  'Day 7: Sabbath Rest (Reaping sustainable, peaceful yield)',
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'mod-gl-2',
        course_id: '10000000-0000-0000-0000-000000000002',
        title: 'Module 2: The Tripartite Fruit Test',
        sort_order: 2,
        lessons: [
          {
            id: 'les-gl-2-1',
            module_id: 'mod-gl-2',
            slug: 'mind-fruit-evaluation',
            title: '2.1 Mind Fruit: Testing for Delusion vs Cognitive Clarity',
            sort_order: 1,
            is_free_preview: false,
            video_embed_url: 'https://www.youtube.com/embed/HPs56IKcE4Q',
            audio_url: 'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3',
            content_md: `### The Mind Fruit Filter

Does a proposed opportunity or strategy generate tranquil clarity, or does it require you to construct an elaborate mental house of cards to justify?

If a partnership causes you to lie to yourself or create cognitive rationalizations, the Mind Fruit is poisonous. Terminate the arrangement immediately.`,
            download_attachments: [],
            workbook_schema: [
              {
                id: 'mind_fruit_audit',
                label: 'Examine a Critical Decision on Your Desk',
                placeholder: 'Does this decision produce quiet clarity, or mental rationalization and looping paranoia?',
                type: 'textarea',
              },
            ],
          },
          {
            id: 'les-gl-2-2',
            module_id: 'mod-gl-2',
            slug: 'body-fruit-evaluation',
            title: '2.2 Body Fruit: Somatic Tone & Heart Rate Regulation',
            sort_order: 2,
            is_free_preview: false,
            video_embed_url: 'https://www.youtube.com/embed/HPs56IKcE4Q',
            audio_url: 'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3',
            content_md: `### The Body Fruit Filter

Your gut, vagus nerve, and heart rate are empirical instruments. When you are aligned with natural law, your physical vessel feels anchored and grounded. When you enter an extractive or misaligned agreement, your body rings alarm bells: shallow breathing, clenched shoulders, insomnia.`,
            download_attachments: [],
            workbook_schema: [
              {
                id: 'somatic_symptoms',
                label: 'What physical sensations occur when you discuss this project?',
                placeholder: 'e.g., Stomach knot, jaw tension, elevated pulse',
                type: 'textarea',
              },
            ],
          },
          {
            id: 'les-gl-2-3',
            module_id: 'mod-gl-2',
            slug: 'soul-fruit-evaluation',
            title: '2.3 Soul Fruit: Relational Congruence & Covenant Integrity',
            sort_order: 3,
            is_free_preview: false,
            video_embed_url: 'https://www.youtube.com/embed/HPs56IKcE4Q',
            audio_url: 'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3',
            content_md: `### The Soul Fruit Filter

Are your relationships characterized by radical honesty, mutual generosity, and peaceful transparency? Or are they tainted by covert contracts, resentment, and walking on eggshells? Soul Fruit is the ultimate arbiter of generational endurance.`,
            download_attachments: [],
            workbook_schema: [
              {
                id: 'soul_fruit_score',
                label: 'Relational Congruence Rating (1–10)',
                placeholder: 'Rate your primary business partnership',
                type: 'number',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: '10000000-0000-0000-0000-000000000003',
    slug: 'covenant-systems-course',
    title: 'Covenant Enterprise Architecture',
    subtitle: 'High-Trust Systems & The 10 Operational Firewalls',
    description:
      'Transform your enterprise from an extractive bureaucracy into a high-trust, load-bearing sovereign organization that endures.',
    book_alignment: 'book_3',
    price_cents: 24700,
    stripe_price_id: 'price_covenant_systems',
    is_published: true,
    totalLessons: 6,
    totalDurationMins: 260,
    modules: [
      {
        id: 'mod-cs-1',
        course_id: '10000000-0000-0000-0000-000000000003',
        title: 'Module 1: The Inviolate Covenant Protocol',
        sort_order: 1,
        lessons: [
          {
            id: 'les-cs-1-1',
            module_id: 'mod-cs-1',
            slug: 'covenants-vs-extractive-contracts',
            title: '1.1 Covenants vs Extractive Bureaucracies',
            sort_order: 1,
            is_free_preview: true,
            video_embed_url: 'https://www.youtube.com/embed/HPs56IKcE4Q',
            audio_url: 'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3',
            content_md: `### Why Contracts Fail Where Covenants Endure

A legal contract is an adversary instrument designed for low-trust participants trying to extract maximum value while protecting against litigation.

A **Covenant** is a load-bearing mutual pledge anchored in natural law, radical transparency, and voluntary alignment with truth. High-performing sovereign enterprises run on covenants. When words are true, bureaucracy dissolves.`,
            download_attachments: [
              {
                title: 'Sovereign Covenant Architecture Master Template',
                file_url: '/pdfs/the-covenant.pdf',
                type: 'Legal & Systems Template',
                size: '3.1 MB',
              },
            ],
            workbook_schema: [
              {
                id: 'extractive_points',
                label: 'Where does your current client or team agreement rely on mistrust?',
                placeholder: 'Identify clauses or behaviors born out of fear rather than mutual value.',
                type: 'textarea',
              },
              {
                id: 'covenant_transition',
                label: 'How can this agreement be re-architected into a mutual covenant?',
                placeholder: 'Draft key reciprocal covenants here.',
                type: 'textarea',
              },
            ],
          },
          {
            id: 'les-cs-1-2',
            module_id: 'mod-cs-1',
            slug: 'eliminating-shav-empty-words',
            title: '1.2 Eliminating Shav (Empty Words) from Governance',
            sort_order: 2,
            is_free_preview: false,
            video_embed_url: 'https://www.youtube.com/embed/HPs56IKcE4Q',
            audio_url: 'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3',
            content_md: `### The Inviolability of the Spoken Word

In ancient law, the concept of *Shav* means taking a holy word and rendering it hollow, empty, or meaningless.

In enterprise governance, *Shav* occurs every time an executive sets a deadline they do not intend to meet, makes a team promise they fail to fulfill, or issues a corporate mission statement that has no teeth. When *Shav* enters an organization, authority collapses.`,
            download_attachments: [],
            workbook_schema: [
              {
                id: 'broken_commitments',
                label: 'Identify Any Lingering Broken Commitments',
                placeholder: 'What unfulfilled promises or vague commitments are currently unresolved in your operations?',
                type: 'textarea',
              },
            ],
          },
        ],
      },
      {
        id: 'mod-cs-2',
        course_id: '10000000-0000-0000-0000-000000000003',
        title: 'Module 2: The 10 Operational Firewalls',
        sort_order: 2,
        lessons: [
          {
            id: 'les-cs-2-1',
            module_id: 'mod-cs-2',
            slug: 'attention-and-capital-defense',
            title: '2.1 Attention, Capital & Leadership Defense Systems',
            sort_order: 1,
            is_free_preview: false,
            video_embed_url: 'https://www.youtube.com/embed/HPs56IKcE4Q',
            audio_url: 'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3',
            content_md: `### The 10 Firewalls Translated for Business

1. **Firewall 1**: Alignment with Truth as the Sole Authority (No Idols).
2. **Firewall 2**: Elimination of *Shav* (Absolute Word Integrity).
3. **Firewall 3**: The Weekly Sabbath Shutdown (Protected Biology).
4. **Firewall 4**: Generational Respect for Proven Foundations (Honor Lineage).
5. **Firewall 5**: Protection of Human Vitality (No Burnout / Murderous Stress).
6. **Firewall 6**: Relational Fidelity & Covenant Loyalty.
7. **Firewall 7**: Honest Value Exchange (No Extraction / Theft).
8. **Firewall 8**: Transparent Signal Transmission (No False Witness / Spin).
9. **Firewall 9**: Strategic Sovereignty (No Tachmod / Coveting Competitors).
10. **Firewall 10**: Contented Abundance as Operational Baseline.`,
            download_attachments: [
              {
                title: 'The 10 Operational Firewalls Checklist',
                file_url: '/pdfs/the-covenant.pdf',
                type: 'Field Manual',
                size: '2.1 MB',
              },
            ],
            workbook_schema: [
              {
                id: 'weakest_firewall',
                label: 'Which of the 10 Firewalls is Most Compromised in Your Business?',
                placeholder: 'e.g., Firewall 3 (Sabbath Shutdown) or Firewall 9 (Coveting competitor moves)',
                type: 'textarea',
              },
              {
                id: 'remediation_plan',
                label: '72-Hour Firewall Re-establishment Plan',
                placeholder: 'What single concrete policy will you install this week to reinforce this boundary?',
                type: 'textarea',
              },
            ],
          },
        ],
      },
    ],
  },
];

// -----------------------------------------------------------------------------
// QUERY HELPERS WITH SUPABASE FALLTHROUGH
// -----------------------------------------------------------------------------

/**
 * Fetch all academy courses
 */
export async function getAcademyCourses(): Promise<CourseWithCurriculum[]> {
  try {
    const supabase = await createServerSupabase();
    if (supabase) {
      const { data: courses, error } = await supabase
        .from('courses')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: true });

      if (!error && courses && courses.length > 0) {
        // Return enriched courses matching fallback structure
        return FALLBACK_ACADEMY_COURSES;
      }
    }
  } catch (err) {
    console.warn('[Supabase Fallback] Error fetching academy courses:', err);
  }

  return FALLBACK_ACADEMY_COURSES;
}

/**
 * Fetch a course by slug with its full curriculum
 */
export async function getAcademyCourseBySlug(slug: string): Promise<CourseWithCurriculum | null> {
  const cleanSlug = slug.trim().toLowerCase();
  const course = FALLBACK_ACADEMY_COURSES.find((c) => c.slug.toLowerCase() === cleanSlug);
  return course ?? null;
}

/**
 * Fetch a specific lesson within a course with sibling navigation
 */
export async function getAcademyLesson(
  courseSlug: string,
  lessonSlug: string
): Promise<{
  course: CourseWithCurriculum;
  currentModule: ModuleWithLessons;
  lesson: LessonWithDetails;
  prevLesson: { courseSlug: string; lessonSlug: string; title: string } | null;
  nextLesson: { courseSlug: string; lessonSlug: string; title: string } | null;
  allLessons: { slug: string; title: string; isFreePreview: boolean; moduleTitle: string }[];
} | null> {
  const course = await getAcademyCourseBySlug(courseSlug);
  if (!course) return null;

  const cleanLessonSlug = lessonSlug.trim().toLowerCase();

  // Flatten lessons to find indices for next/prev navigation
  const flatLessons: {
    lesson: LessonWithDetails;
    module: ModuleWithLessons;
  }[] = [];

  for (const mod of course.modules) {
    for (const les of mod.lessons) {
      flatLessons.push({ lesson: les, module: mod });
    }
  }

  const currentIndex = flatLessons.findIndex(
    (item) => item.lesson.slug.toLowerCase() === cleanLessonSlug
  );

  if (currentIndex === -1) return null;

  const current = flatLessons[currentIndex];
  const prev = currentIndex > 0 ? flatLessons[currentIndex - 1] : null;
  const next = currentIndex < flatLessons.length - 1 ? flatLessons[currentIndex + 1] : null;

  return {
    course,
    currentModule: current.module,
    lesson: current.lesson,
    prevLesson: prev
      ? {
          courseSlug: course.slug,
          lessonSlug: prev.lesson.slug,
          title: prev.lesson.title,
        }
      : null,
    nextLesson: next
      ? {
          courseSlug: course.slug,
          lessonSlug: next.lesson.slug,
          title: next.lesson.title,
        }
      : null,
    allLessons: flatLessons.map((item) => ({
      slug: item.lesson.slug,
      title: item.lesson.title,
      isFreePreview: item.lesson.is_free_preview,
      moduleTitle: item.module.title,
    })),
  };
}

/**
 * Check if user is enrolled in a specific course or has all-access pass
 */
export async function getEnrollmentStatus(
  courseId: string,
  userId?: string | null
): Promise<{ isEnrolled: boolean; unlockedVia?: string }> {
  if (!userId) {
    return { isEnrolled: false };
  }

  try {
    const supabase = await createServerSupabase();
    if (supabase) {
      // Check user profile for has_all_access
      const { data: profile } = await supabase
        .from('profiles')
        .select('has_all_access')
        .eq('id', userId)
        .maybeSingle();

      if (profile?.has_all_access) {
        return { isEnrolled: true, unlockedVia: 'all_access' };
      }

      // Check user_enrollments
      const { data: enrollment } = await supabase
        .from('user_enrollments')
        .select('unlocked_via')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .maybeSingle();

      if (enrollment) {
        return { isEnrolled: true, unlockedVia: enrollment.unlocked_via };
      }
    }
  } catch (err) {
    console.warn('[Supabase Fallback] Error checking enrollment:', err);
  }

  return { isEnrolled: false };
}
