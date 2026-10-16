-- ==============================================================================
-- The Architecture of Reality — Master Database Seed
-- Initial Seed for 4 Free Volumes, Chapters & Flagship Courses
-- ==============================================================================

-- 1. SEED VOLUMES (100% Free Reading Room)
INSERT INTO public.volumes (id, slug, volume_label, title, subtitle, description, pdf_url, sort_order)
VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    'the-architecture-of-reality',
    'FOUNDATION VOLUME',
    'The Architecture of Reality',
    'A Systems Philosophy for the Sovereign Human Being',
    'An introduction to universal law, human energy management, and the structural foundations of sustainable life. Bridges ancient metaphysical wisdom and biological reality.',
    '/pdfs/the-architecture-of-reality.pdf',
    0
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'the-master-blueprint',
    'BOOK I',
    'The Master Blueprint',
    'A Guide to Sovereign Alignment and Sustainable Living',
    'A practical systems manual tracking human energy, how we get worn down by bad habits, and how to reset ourselves into a healthy, sovereign state. Bridges ancient metaphysical texts into biological nervous-system regulation and introduces the 80-hour work month.',
    '/pdfs/the-master-blueprint.pdf',
    1
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    'the-genesis-lens',
    'BOOK II',
    'The Genesis Lens',
    'The Seven-Fold Code of Creation & Practical Discernment',
    'The diagnostic operating system, the Tripartite Fruit Test across Mind, Body, and Soul, and the 7-fold empirical code of creation.',
    '/pdfs/the-genesis-lens.pdf',
    2
  ),
  (
    '00000000-0000-0000-0000-000000000004',
    'the-covenant',
    'BOOK III',
    'The Covenant',
    'Load-Bearing Social Architecture & High-Trust Enterprise Mechanics',
    'Load-bearing social architecture, non-extractive enterprise mechanics, and the 10 Operational Firewalls for sustainable sovereignty.',
    '/pdfs/the-covenant.pdf',
    3
  )
ON CONFLICT (slug) DO UPDATE
SET
  volume_label = EXCLUDED.volume_label,
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  pdf_url = EXCLUDED.pdf_url,
  sort_order = EXCLUDED.sort_order;

-- 2. SEED CHAPTERS FOR FOUNDATION VOLUME
INSERT INTO public.chapters (volume_id, chapter_number, slug, title, content_md, principle_number, estimated_read_mins)
VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    1,
    'core-premise',
    'I. The Core Premise: Ancient Architecture for Modern Systems',
    '# I. The Core Premise: Ancient Architecture for Modern Systems

For generations, human knowledge has been artificially fractured into two disconnected worlds. We look to religion and ancient philosophy to tell us how we ought to live, and we look to science, mechanics, and economics to explain how the world actually works.

We treat morality as a set of arbitrary rules enforced by guilt, and we treat physical reality as an indifferent, chaotic machine.

The result of that fracture is everywhere around us: chronic exhaustion, mental burnout, fractured families, and systems designed to extract maximum output until human hardware breaks down. Most people spend their lives locked in survival mode—grinding their teeth, forcing outcomes through sheer ego, and wondering why life feels like an unyielding uphill battle against the current.

**Life feels like a battle because we are building against the grain of reality.**

When you strip away religious moralizing, cultural dogma, and authoritarian threats, ancient wisdom and modern physics describe the exact same underlying mechanics. Reality is not random, and it is not vindictive. It functions as an unbending, living operating system governed by natural laws of balance, rhythm, and consequence.

Living a sovereign, flourishing life is not about being rescued, nor is it about straining for an impossible, rigid perfection. It is about stepping into a clean, functional relationship with universal life energy.',
    1,
    8
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    2,
    'tripartite-vessel',
    'II. The Tripartite Vessel: Mind, Body, and Soul',
    '# II. The Tripartite Vessel: Mind, Body, and Soul

To understand where your energy goes, you have to understand the instrument you inhabit. You are not a random assortment of thoughts and meat; you are a precision three-part vessel engineered to process and express life energy:

### 1. The Mind (Cognitive Clarity & Signal)
The steering wheel and navigational compass. The Mind formulates intention, filters external signal from noise, and holds the internal mental model of reality. When misaligned, it fragments into overthinking, anxiety loops, and defensive ego preservation.

### 2. The Body (Biological Hardware & Battery)
The somatic engine and biological battery. The Body regulates nervous system tone, hormonal pacing, physical stamina, and circadian rhythms. When forced beyond design limits, it locks into chronic fight-or-flight, spikes cortisol, and eventually forces a shutdown through exhaustion or illness.

### 3. The Soul (Relational Integrity & Deep Alignment)
The relational core and boundary anchor. The Soul governs high-trust connection, congruence between inner truth and outer speech, and sovereign self-containment. When compromised, it manifests as people-pleasing, boundary failure, and manipulative extraction.

> *"If any one of these three chambers springs a leak, the entire vessel loses pressure."*',
    2,
    9
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    3,
    'seven-code',
    'III. The 7-Fold Code of Reality',
    '# III. The 7-Fold Code of Reality

From the geometry of a single cell to the orbital mechanics of the solar system, reality builds using a repeatable, seven-fold master code:

1. **Mentalism (Day One / The Origin Point)**: Consciousness is the primary substrate of reality. Every physical structure, enterprise, and conflict is the downstream manifestation of a root thought.
2. **Correspondence (Day Two / The Mirror)**: Reality is fractal and holographic. Your physical daily habits on the ground ("below") must match the high standards you profess in your mind ("above") for your life to hold structural integrity.
3. **Vibration (Day Three / Living Resonance)**: The universe is fundamentally acoustic and energetic. Words, attitudes, and intentions carry measurable kinetic frequency. Truth resonates with steady calm; deception and malice create destructive static.
4. **Polarity (Day Four / The Dynamic Fulcrum)**: Sitting at the exact center of the laws, polarity provides the magnetic tension required to generate power. You master life not by destroying your opposite, but by holding the healthy tension between output and rest, truth and mercy.
5. **Rhythm (Day Five / The Cycles of Time)**: There are no straight lines in nature. Life moves in tides, seasons, and waves. Sovereignty means refusing to panic during low tides, trusting natural timing rather than forcing an artificial harvest out of season.
6. **Cause and Effect (Day Six / The Law of the Seed)**: There is no moral vacuum and no blind luck. Every action, word, and habit is a causal seed planted into the timeline that will organically yield a harvest matching its exact nature.
7. **Generation (Day Seven / The Rest Container)**: All enduring life requires the union of the active seed and the quiet, receptive container. Lasting power cannot happen through endless striving; it demands the quiet stillness of protected rest to incubate and take root.',
    4,
    12
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    4,
    'roadmap',
    'IV. The Roadmap of the Trilogy',
    '# IV. The Roadmap of the Trilogy

To master your reality, you must build from the inside out:

- **Book 1: The Master Blueprint** — Calibrating the human vessel, stopping internal leaks, and mastering biological energy management. Introduces the 80-hour work month.
- **Book 2: The Genesis Lens** — The diagnostic operating system, the Tripartite Fruit Test across Mind, Body, and Soul, and the 7-fold empirical code of creation.
- **Book 3: The Covenant** — Load-bearing social architecture, high-trust enterprise mechanics, and the 10 Operational Firewalls.

Step into dynamic balance, and let that steady current organize your health, your home, and your enterprise.',
    6,
    7
  )
ON CONFLICT (volume_id, slug) DO UPDATE
SET
  chapter_number = EXCLUDED.chapter_number,
  title = EXCLUDED.title,
  content_md = EXCLUDED.content_md,
  principle_number = EXCLUDED.principle_number,
  estimated_read_mins = EXCLUDED.estimated_read_mins;

-- 3. SEED CHAPTERS FOR BOOK I (The Master Blueprint)
INSERT INTO public.chapters (volume_id, chapter_number, slug, title, content_md, principle_number, estimated_read_mins)
VALUES
  (
    '00000000-0000-0000-0000-000000000002',
    1,
    'blueprint-setup',
    'I. The Blueprint: How the System is Set Up',
    '# I. The Blueprint: How the System is Set Up

Ancient texts are not a collection of moralistic stories meant to keep people obedient through fear and guilt. At their core, they serve as a practical, longitudinal case study in how life actually works—tracking human energy, how we get worn down by bad habits, and how to reset ourselves back into a healthy state.

- **Universal Life Energy (The Source)**: The steady, uncorrupted baseline of truth, order, and ongoing life. It doesn''t fluctuate, panic, or play favorites; it simply supplies the baseline current of existence.
- **The Sovereign Human Being**: You were engineered to be a living, breathing channel for that life energy. When your Mind, Body, and Soul work in harmony with the rules of life, you operate with almost zero internal drag.',
    1,
    9
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    2,
    'breakdown-friction',
    'II. The Breakdown: What Happens When We Lose Connection',
    '# II. The Breakdown: What Happens When We Lose Connection

"Sin" is simply operational misalignment—choosing to fall out of relationship with how life energy actually flows.

- **The Disconnection**: Breakdown happens whenever ego tries to play god—hoarding resources, forcing outcomes, lying to get ahead, or letting bad habits take the wheel.
- **The Natural Friction**:
  - **Mind**: Fills with overthinking, paranoia, and endless mental maintenance to protect a fragile ego.
  - **Body**: Locks into chronic survival mode, flooding your system with adrenaline and cortisol until you hit burnout or illness.
  - **Soul**: Collapses into isolation, distrust, and shallow relationships that leave you completely drained.
- **Boundaries as Step-Down Transformers**: Early historical interventions were step-down transformers designed to protect compromised, exhausted people from burning out their wiring.',
    3,
    11
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    3,
    'reset-channel',
    'III. The Reset: Clearing the Channel',
    '# III. The Reset: Clearing the Channel

When a system is clogged up with accumulated static, you cannot just think your way out of the hole. The channel has to be cleared from the root.

- **Setting the Standard**: Moving through life fully grounded, bringing immediate calm to chaotic spaces, and reorganizing broken situations.
- **Grounding the Static**: Like a heavy-duty grounding rod absorbing a massive power surge, absorbing the toxic momentum without striking back or passing on vengeance. That breaks the chain reaction of toxic habits and opens a clean, direct path for sustainable restoration.',
    5,
    10
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    4,
    'operator-protocol',
    'IV. The Operational Standard: The Sovereign Operator Protocol',
    '# IV. The Operational Standard: The Sovereign Operator Protocol

For a sovereign operator navigating today''s high-speed, noisy world, this framework is a practical blueprint for how you run your mind, your calendar, and your enterprise:

- **Quiet Capacity Over Straining**: True strength is not jaw-clenching, teeth-grinding striving driven by fear. It is the quiet, zero-resistance capacity of an instrument that has been tuned properly.
- **Engineering for Biology**: Practical sovereignty means designing boundaries that respect human limits. It means setting up decentralized, supportive team dynamics rather than extractive hierarchies. It means enforcing rhythmic rest constraints—like targeting an **80-hour work month (20 focused hours a week)**—to protect your biological battery.
- **Anchoring in Contented Peace**: The primary objective of your daily life is to anchor yourself in steady, contented goodwill. Step into dynamic balance, and let that steady current organize your health, your home, and your enterprise.',
    7,
    12
  )
ON CONFLICT (volume_id, slug) DO UPDATE
SET
  chapter_number = EXCLUDED.chapter_number,
  title = EXCLUDED.title,
  content_md = EXCLUDED.content_md,
  principle_number = EXCLUDED.principle_number,
  estimated_read_mins = EXCLUDED.estimated_read_mins;

-- 4. SEED CHAPTERS FOR BOOK II (The Genesis Lens)
INSERT INTO public.chapters (volume_id, chapter_number, slug, title, content_md, principle_number, estimated_read_mins)
VALUES
  (
    '00000000-0000-0000-0000-000000000003',
    1,
    'genesis-engine',
    'I. The Genesis Diagnostic Engine',
    '# I. The Genesis Diagnostic Engine

Genesis 1 is not a primitive scientific myth or a theological puzzle; it is an empirical systems architecture blueprint mapping the unfolding of reality from chaos to generative rest.

When you look at your life, your team, or your enterprise through the Genesis Lens, you are asking:
1. What state of formlessness and void is currently present?
2. Where is light required to delineate signal from noise?
3. Where must a firmament be placed to separate the waters above from the waters below?',
    1,
    10
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    2,
    'tripartite-fruit-test',
    'II. The Tripartite Fruit Test: Testing Every Signal',
    '# II. The Tripartite Fruit Test: Testing Every Signal

Never judge a philosophy, an enterprise, or a relationship by its marketing promises or charismatic rhetoric. Judge it strictly by the quality of its biological and systemic fruit across three specific test sites:

1. **Mind Fruit**: Does this system produce calm, acute clarity and sound judgment, or paranoia, looping rumination, and chronic urgency?
2. **Body Fruit**: Does this pace lead to regulated heart rates, deep sleep, and sustained stamina, or adrenaline spikes and nervous-system exhaustion?
3. **Soul Fruit**: Does this structure foster transparent, high-trust covenants, or political eggshell-walking and covert extraction?',
    3,
    12
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    3,
    'dynamic-polarity',
    'III. Dynamic Polarity & Counter-Actions',
    '# III. Dynamic Polarity & Counter-Actions

Sitting at the center of the seven laws is Polarity. Under sustained stress, every vessel tilts either toward Forcing (over-control, tension, aggressive striving) or Passive (withdrawal, procrastination, decision avoidance).

Recognizing your default stress drift is the first step toward recalibration. Counter-balancing drift requires applying the opposite polar vector with clean intentionality.',
    4,
    11
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    4,
    'seventh-day-rest',
    'IV. The Seventh Day: Generative Rest as Systemic Requirement',
    '# IV. The Seventh Day: Generative Rest as Systemic Requirement

The culmination of creation is not an eighth day of infinite productivity. It is the Seventh Day: the sacred, non-negotiable container of Rest.

In modern enterprise, rest is treated as an embarrassing concession to physical weakness. Under natural law, rest is the generative soil in which structural integrity, creative innovation, and sovereign endurance take root.',
    7,
    10
  )
ON CONFLICT (volume_id, slug) DO UPDATE
SET
  chapter_number = EXCLUDED.chapter_number,
  title = EXCLUDED.title,
  content_md = EXCLUDED.content_md,
  principle_number = EXCLUDED.principle_number,
  estimated_read_mins = EXCLUDED.estimated_read_mins;

-- 5. SEED CHAPTERS FOR BOOK III (The Covenant)
INSERT INTO public.chapters (volume_id, chapter_number, slug, title, content_md, principle_number, estimated_read_mins)
VALUES
  (
    '00000000-0000-0000-0000-000000000004',
    1,
    'covenant-vs-contract',
    'I. Covenant vs. Contract: Foundations of High-Trust Systems',
    '# I. Covenant vs. Contract: Foundations of High-Trust Systems

A contract is an adversarial document engineered for mutual distrust, specifying the minimum legal performance required before one party sues the other.

A Covenant is a load-bearing mutual pledge anchored in shared truth, transparent boundaries, and voluntary alignment with natural law. High-performing sovereign enterprises run on covenants, not bureaucratic surveillance.',
    2,
    11
  ),
  (
    '00000000-0000-0000-0000-000000000004',
    2,
    'ten-operational-firewalls',
    'II. The 10 Operational Firewalls',
    '# II. The 10 Operational Firewalls

Ancient commandments were structural boundary walls engineered to prevent human communities from cannibalizing themselves through envy, theft, deceit, and over-work.

Translated into modern enterprise architecture, the 10 Operational Firewalls establish absolute protection for attention, intellectual capital, capital reserves, and leadership nervous systems.',
    6,
    14
  ),
  (
    '00000000-0000-0000-0000-000000000004',
    3,
    'eighty-hour-work-month',
    'III. The 80-Hour Work Month: High-Leverage Architecture',
    '# III. The 80-Hour Work Month: High-Leverage Architecture

The 40-to-60 hour work week is an industrial factory artifact designed for interchangeable physical laborers, not sovereign decision-makers.

A sovereign operator targets an 80-hour work month—roughly 20 focused, uninterrupted hours per week. By eliminating low-leverage busywork and protecting the biological battery, 20 hours of high-clarity execution produces 10x the systemic value of 60 hours of exhausted grinding.',
    5,
    13
  ),
  (
    '00000000-0000-0000-0000-000000000004',
    4,
    'generational-endurance',
    'IV. Generational Endurance & The Sovereign Enterprise',
    '# IV. Generational Endurance & The Sovereign Enterprise

Enterprises built on extraction burn out their founders, alienate their customers, and collapse within a decade.

Enterprises built on natural order, fair exchange, and rhythmic regeneration endure for generations. Sovereignty is not an escape from society; it is the capacity to build unshakable islands of trust and stability in an ocean of noise.',
    7,
    12
  )
ON CONFLICT (volume_id, slug) DO UPDATE
SET
  chapter_number = EXCLUDED.chapter_number,
  title = EXCLUDED.title,
  content_md = EXCLUDED.content_md,
  principle_number = EXCLUDED.principle_number,
  estimated_read_mins = EXCLUDED.estimated_read_mins;

-- 6. SEED FLAGSHIP COURSES FOR SOVEREIGN ACADEMY (Phase 3 Foundation)
INSERT INTO public.courses (id, slug, title, subtitle, description, book_alignment, price_cents, is_published)
VALUES
  (
    '10000000-0000-0000-0000-000000000001',
    'master-blueprint-course',
    'The Master Blueprint Course',
    'Calibrating the Vessel & The 80-Hour Work Month',
    'Comprehensive multi-modal training on biological nervous-system regulation, identifying cognitive leaks, and transitioning your business to the 80-hour work month.',
    'book_1',
    14700,
    true
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    'genesis-lens-course',
    'The Genesis Lens Diagnostic Mastery',
    'The 7-Fold Code & The Tripartite Fruit Test',
    'Mastering the empirical diagnostic engine of creation. Test every partnership, signal, and strategy across Mind, Body, and Soul.',
    'book_2',
    19700,
    true
  ),
  (
    '10000000-0000-0000-0000-000000000003',
    'covenant-systems-course',
    'Covenant Enterprise Architecture',
    'High-Trust Systems & The 10 Operational Firewalls',
    'Transform your enterprise from an extractive bureaucracy into a high-trust, load-bearing sovereign organization that endures.',
    'book_3',
    24700,
    true
  )
ON CONFLICT (slug) DO UPDATE
SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  book_alignment = EXCLUDED.book_alignment,
  price_cents = EXCLUDED.price_cents,
  is_published = EXCLUDED.is_published;
