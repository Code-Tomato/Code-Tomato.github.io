// Content model synced to the September 2026 résumé.
// The SOSP '26 paper is public: title, venue, author position and results are
// all stated on the résumé, so the site states them too.
export interface Publication {
  venue: string;
  note: string;
  title: string;
  authorship: string;
  paper: string;
  repo: string;
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
  note: 'published',
  title: 'Beyond Utilization: Energy-Conscious GPU Sharing for Inference Serving',
  authorship: '3rd author',
  paper: 'https://dl.acm.org/doi/10.1145/3830418.3843913',
  repo: 'https://github.com/UT-SysML/EnerTune',
  line: "EnerTune, from UT Austin's systems-for-ML group. I rebuilt the four GPU-sharing serving systems it is measured against, ported them to our 16-A100 cluster, and did the evaluation behind its 1.4-2.3x lower energy and 7.3x average profiling-time reduction."
};

export const experience: ExperienceEntry[] = [
  {
    org: 'UT Austin Research',
    role: 'Machine Learning for Systems',
    period: 'Aug 2026 - Ongoing',
    track: 'research',
    bullets: [
      "Building a harness that streams live vLLM scheduler and memory-manager stats to an LLM agent, which tunes vLLM's load balancer across replicas."
    ]
  },
  {
    org: 'UT Austin Research',
    role: 'Systems for Machine Learning',
    period: 'Aug 2025 - May 2026',
    track: 'research',
    bullets: [
      'Rebuilt 4 state-of-the-art GPU-sharing inference serving systems (GPULets, Usher, FGD, ParvaGPU) to benchmark EnerTune.',
      "Debugged and ported each baseline's research prototype onto our 16-A100 cluster, enabling the 1.4-2.3x lower energy result.",
      "Profiled all 4 baselines to show EnerTune's analytical model cuts profiling time 7.3x on average, up to 17.3x, over brute force."
    ]
  },
  {
    org: 'UT Austin Research',
    role: 'Computer Architecture & FPGAs',
    period: 'Mar 2024 - Dec 2024',
    track: 'research',
    bullets: [
      'Built an instruction-accurate RISC-V simulator in C++ so the team could test the Primate compiler without slow FPGA synthesis.',
      'Designed I/O instruction handling and compiler-checking tools that sped up developing the hardware and software side by side.'
    ]
  },
  {
    org: 'Caterpillar Inc.',
    role: 'Data Acquisition & Analytics Team',
    period: 'Summer 2026, part-time ongoing',
    track: 'industry',
    bullets: [
      'Building a tool attributing cellular data costs across 20,000+ Caterpillar machines, raising cost accuracy 34% on average and up to 55%.',
      'Processing a 100 GB daily load from a 30-50 PB pipeline to replace whole-SIM-bill accounting with per-megabyte attribution.',
      'Deploying a nightly AWS Lambda that calls carrier APIs to locate each machine, aggregate usage, and compute its actual cost.'
    ]
  },
  {
    org: 'Caterpillar Inc.',
    role: 'System Diagnostics Team',
    period: 'Summer 2025, part-time through 2025-26',
    track: 'industry',
    bullets: [
      'Wrote hardware-in-the-loop tests covering 30 I/O types (PWM, analog, digital) to set a baseline for the whole diagnostic suite.',
      'Automated key steps in the firmware build process used daily by 15+ engineers, cutting their configuration time by 10%.'
    ]
  },
  {
    org: 'Caterpillar Inc.',
    role: 'Platform Software Team',
    period: 'Summer 2024, part-time through 2024-25',
    track: 'industry',
    bullets: [
      'Designed hardware-abstraction (HAL) and API layers for engine control modules (NVM, analog, digital I/O), now in production.',
      'Developed firmware in C and Python that cut new I/O support time by 15%, verified via .elf memory-layout checks.'
    ]
  },
  {
    org: 'Longhorn Racing (Formula SAE)',
    role: 'Battery Management Developer',
    period: 'Aug 2023 - May 2025',
    track: 'community',
    bullets: [
      "Led design of the car's battery monitoring system and wrote RTOS firmware modules handling drivers, I/O and scheduling.",
      'Built the State-of-Charge algorithm that cut the driving-range margin of error to under 5%.'
    ]
  }
];

export const skills: SkillGroup[] = [
  {
    group: 'Systems & Languages',
    items: ['C', 'C++', 'CUDA', 'Python', 'SQL', 'Bash']
  },
  {
    group: 'ML Systems & GPU',
    items: ['vLLM', 'Nsight Compute', 'GPU sharing & multi-tenant serving', 'Energy-aware inference']
  },
  {
    group: 'Backend & Cloud',
    items: ['.NET', 'ASP.NET', 'AWS Lambda', 'Supabase', 'React', 'Tailwind', 'Oracle', 'MySQL']
  },
  {
    group: 'Tools',
    items: ['gdb', 'QEMU', 'Docker', 'Git']
  }
];
