// Generated from the July 2026 content model (publication, experience timeline, skills).
// The SOSP '26 paper is unpublished and Nathan is a contributor, not first
// author. Site policy: one-line mention only — no paper title, no result
// numbers, no mechanism details. His public contribution is the baselines.
export interface Publication {
  venue: string;
  note: string;
  line: string;
}

export interface ExperienceEntry {
  org: string;
  role: string;
  period: string;
  bullets: string[];
  track: 'research' | 'industry' | 'community';
}

export interface SkillGroup {
  group: string;
  items: string[];
}

export const publication: Publication = {
  venue: "SOSP '26",
  note: 'to appear',
  line: "Contributor to EnerTune, a paper on energy-efficient multi-tenant GPU inference serving from UT Austin's systems-for-ML group — I designed and tested the baseline serving systems its evaluation runs against. More once it's published."
};

export const experience: ExperienceEntry[] = [
  {
    org: 'UT Austin ECE — Systems for ML Group',
    role: 'Undergraduate Research Assistant, Systems for ML',
    period: 'Fall 2025 – Spring 2026',
    track: 'research',
    bullets: [
      'Research on GPU scheduling for ML training and inference that treats power and energy as first-class resources.',
      "Rebuilt the GPUlets and USHER serving systems from their papers as faithful, reproducible evaluation baselines — contributing to a paper accepted to SOSP '26.",
      'Hundreds of hours of baseline design, validation, and testing on shared multi-GPU hardware.'
    ]
  },
  {
    org: 'UT Austin ECE — FAST Group',
    role: 'Undergraduate Research Assistant, Computer Architecture & FPGAs',
    period: 'Spring 2024 – Fall 2024',
    track: 'research',
    bullets: [
      'Built an instruction-accurate RISC-V simulator for the Primate compiler, including I/O instruction handling.',
      'Wrote compiler-checking tools and a testing app that eliminates redundant FPGA synthesis runs from the development loop.'
    ]
  },
  {
    org: 'Caterpillar Inc.',
    role: 'Software Engineering Intern, Data Acquisition & Analytics',
    period: 'May 2026 – Present',
    track: 'industry',
    bullets: [
      "Building a .NET + AWS Lambda tool that measures each team's diagnostic-data usage to the exact megabyte, replacing a manual billing process.",
      'Automating data-request handling, saving roughly 20 engineering hours per week.'
    ]
  },
  {
    org: 'Caterpillar Inc.',
    role: 'Systems Software Intern, System Diagnostics',
    period: 'Summer 2025 – Spring 2026',
    track: 'industry',
    bullets: [
      'Developed hardware-in-the-loop tests covering 30 I/O types (PWM, analog, digital) plus embedded regression-test modules.',
      'Automated firmware build steps for 15+ engineers, cutting configuration time by about 10%.'
    ]
  },
  {
    org: 'Caterpillar Inc.',
    role: 'Embedded Software Intern, Platform Software',
    period: 'Summer 2024 – Spring 2025',
    track: 'industry',
    bullets: [
      'Built HAL and API layers for engine control modules (NVM, analog, and digital I/O) — now running in production.',
      'Debugged firmware at the .elf level and shipped C and Python firmware that makes adding future I/O support about 15% faster.'
    ]
  },
  {
    org: 'SEO (Sponsors for Educational Opportunity)',
    role: 'Tech Developer Fellow',
    period: 'May 2025 – Aug 2025',
    track: 'community',
    bullets: [
      'Built GoodEats (React, Supabase, Tailwind), a restaurant-matching app used by 50+ UT students, with preference matching ranked by price, distance, and category.',
      'Shipped on an Agile team with pull-request review and CI.'
    ]
  },
  {
    org: 'Longhorn Racing (FSAE Electric)',
    role: 'Battery Management System Lead',
    period: 'Aug 2023 – May 2025',
    track: 'community',
    bullets: [
      "Led design of the battery management system for UT's Formula SAE electric race car.",
      'Developed a State-of-Charge algorithm with under 5% range error, plus RTOS firmware modules for the BMS.'
    ]
  }
];

export const skills: SkillGroup[] = [
  {
    group: 'Systems & Languages',
    items: ['C', 'C++', 'Python', 'SQL', 'Bash']
  },
  {
    group: 'ML Systems & GPU',
    items: [
      'CUDA',
      'vLLM',
      'Nsight Compute',
      'GPU scheduling & multi-tenant serving',
      'Energy/carbon-aware inference'
    ]
  },
  {
    group: 'Backend & Cloud',
    items: ['.NET', 'AWS Lambda', 'Supabase', 'React', 'Tailwind', 'Oracle', 'MySQL']
  },
  {
    group: 'Tools',
    items: ['gdb', 'Docker', 'Git', 'QEMU', 'LLVM IR']
  }
];
