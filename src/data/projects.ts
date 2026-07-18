// Generated from the July 2026 content model (tiered project data, verified links only).
export type Tier = 'featured' | 'current' | 'archived';

export interface ProjectLinks {
  github?: string;
  demo?: string;
  documentation?: string;
  paper?: string;
}

export interface Project {
  slug: string;
  tier: Tier;
  title: string;
  description: string;
  longDescription: string;
  date: string;
  dateDisplay: string;
  tags: string[];
  category: string[];
  status: string;
  links: ProjectLinks;
  keyFeatures: string[];
  impact?: string;
  headline: string;
  teamProject: boolean;
  /** Process id in the ps index. serving-baselines is pid 1 (init); the rest follow recency. */
  pid: number;
  /** Man-page section: 1 research/user commands · 2 kernel · 4 hardware · 6 games · 7 misc/web. */
  manSection: number;
  /** Slugs cross-referenced in the SEE ALSO section of the detail page. */
  seeAlso: string[];
}

export const projects: Project[] = [
  {
    slug: 'serving-baselines',
    tier: 'featured',
    title: 'Multi-GPU Serving Baselines',
    description:
      "Faithful reimplementations of two published multi-tenant GPU inference serving systems — GPUlets and USHER — built as the evaluation baselines for a SOSP '26 paper.",
    longDescription:
      "The paper's evaluation needed baselines it could trust, so I rebuilt GPUlets and USHER, two published multi-tenant GPU serving systems, from their papers: scheduling policies, GPU partitioning, and serving paths, validated against the published behavior. I spent hundreds of hours designing, testing, and hardening them on shared multi-GPU hardware so the comparison would be fair and reproducible. They are the comparison floor for a UT Austin systems-for-ML paper accepted to SOSP '26.",
    date: '2026-06',
    dateDisplay: 'Fall 2025 - Spring 2026',
    tags: [
      'GPU Scheduling',
      'ML Inference Serving',
      'Multi-Tenant GPUs',
      'Systems Research',
      'Reproducibility',
      'Python'
    ],
    category: ['Research/Academic', 'Machine Learning Systems'],
    status: 'Active',
    links: {
      github: 'https://github.com/Code-Tomato/sus-gpus-baselines'
    },
    keyFeatures: [
      'GPUlets and USHER rebuilt from their papers — policies, partitioning, and serving paths',
      'Validated against the published behavior of both systems',
      'Reproducible setup and experiment scripts for shared multi-GPU hardware',
      "The evaluation baselines for a paper accepted to SOSP '26",
      'Both reimplementations public: sus-gpus-baselines and UsherRemake'
    ],
    impact:
      "Baseline design and testing that a SOSP '26 evaluation stands on — done as an undergraduate RA in UT Austin's ECE systems-for-ML group.",
    headline: "Two published serving systems rebuilt from their papers — the comparison floor for a SOSP '26 evaluation",
    teamProject: true,
    pid: 1,
    manSection: 1,
    seeAlso: ['mllm-energy', 'cht-radix']
  },
  {
    slug: 'mllm-energy',
    tier: 'featured',
    title: 'MLLM-Energy',
    description:
      'Phase-level profiling of multimodal LLM inference (InternVL3-8B on an NVIDIA A100) showing where time, compute, power, and energy actually go.',
    longDescription:
      "For ECE 382V we profiled InternVL3-8B serving on an NVIDIA A100 with vLLM and Nsight Compute, breaking every request into its four inference phases. Decode dominates wall-clock time (88.7% of a request) while sustaining only 14% SM and 23% DRAM throughput; performance and power both saturate at about a third of the GPU's cores; and batching is a 12.9× energy lever for output-heavy workloads but only 1.9× for input-heavy ones. The findings motivate phase-aware, energy-first serving policies.",
    date: '2026-05',
    dateDisplay: 'Spring 2026',
    tags: ['CUDA', 'vLLM', 'Nsight Compute', 'GPU Profiling', 'LLM Inference', 'Energy Efficiency'],
    category: ['Research/Academic', 'Machine Learning Systems'],
    status: 'Completed',
    links: {
      github: 'https://github.com/mllm-energy/MLLM-Energy',
      documentation: 'https://mllm-energy.github.io/MLLM-Energy/',
      paper: 'https://github.com/mllm-energy/MLLM-Energy/blob/main/paper.pdf'
    },
    keyFeatures: [
      'Phase-level characterization of InternVL3-8B on an NVIDIA A100 using vLLM and Nsight Compute',
      'Decode dominates: 88.7% of request wall-clock time at only 14% SM and 23% DRAM throughput',
      'Throughput and power saturate at ~36 SMs — giving up 67% of cores costs under 9% performance',
      "Power plateaus near 230 W, below the A100's 250 W TDP, so SM masking alone can't reclaim stranded capacity",
      'Batching is asymmetric: 12.9× energy reduction for output-heavy jobs vs 1.9× for input-heavy ones',
      'Full paper plus an interactive project page with all figures and results'
    ],
    impact:
      'Graduate course research (ECE 382V) with a public paper and project site — the measurement groundwork behind energy-first serving policies.',
    headline: 'Decode takes 88.7% of request time at only 14% GPU core utilization',
    teamProject: true,
    pid: 2,
    manSection: 1,
    seeAlso: ['serving-baselines', 'cht-radix']
  },
  {
    slug: 'cht-radix',
    tier: 'featured',
    title: 'CHT-Radix',
    description:
      'A C++17 benchmarking suite that puts five concurrent hash tables and two concurrent radix trees on the same footing, under both synthetic and LLM-derived prefix-caching workloads.',
    longDescription:
      'Most concurrent data-structure benchmarks stop at synthetic traffic; CHT-Radix asks whether the rankings change when the workload looks like a real LLM prefix cache. We implemented five hash-table variants (coarse and fine chaining, optimistic and striped cuckoo, hopscotch) and two radix trees behind one interface, then replayed a ShareGPT-derived trace against them. Peak throughput hit 88.36M ops/sec — a 13× gain over the coarse-locked baseline — while the real trace exposed p99 tail latencies up to 40× worse than random keys.',
    date: '2026-05',
    dateDisplay: 'Spring 2026',
    tags: ['C++', 'Concurrency', 'Multicore', 'Data Structures', 'Benchmarking', 'LLM Caching'],
    category: ['Systems Programming', 'Research/Academic'],
    status: 'Completed',
    links: {
      github: 'https://github.com/Code-Tomato/CHT_Radix',
      documentation: 'https://code-tomato.github.io/CHT_Radix/',
      paper: 'https://github.com/Code-Tomato/CHT_Radix/blob/main/paper/CHT_Radix.pdf'
    },
    keyFeatures: [
      'Five concurrent hash-table variants: coarse/fine chaining, optimistic cuckoo, striped cuckoo, and hopscotch',
      'Two concurrent radix trees: a coarse-locked 256-way trie and an atomic-pointer-walk fine-grained version',
      'LLM-style workload replayed from real ShareGPT prefixes, alongside uniform, skewed, and read-heavy traffic',
      '40× worse p99 tail latency on the real ShareGPT trace vs random keys — a cost synthetic benchmarks hide',
      'Benchmark harness measuring throughput vs threads, p99 vs threads, and read-fraction sweeps',
      'Fully reproducible: canonical CSVs, experiment scripts, REPRODUCIBILITY.md, and CITATION.cff',
      'Interactive architecture explorer and full write-up hosted on GitHub Pages'
    ],
    impact:
      'EE 361C (Multicore Algorithms) project run like a research artifact: paper, reproducibility recipe, and citable metadata.',
    headline: '88.36M ops/sec peak — 13× throughput over the coarse-locked baseline',
    teamProject: true,
    pid: 3,
    manSection: 1,
    seeAlso: ['mllm-energy', 'pintos']
  },
  {
    slug: 'pintos',
    tier: 'featured',
    title: 'Pintos Operating System',
    description:
      'Built out the Pintos teaching OS in C: user process management, system calls, virtual memory, and file system support.',
    longDescription:
      "Starting from the bare Pintos kernel, I implemented the core of a working operating system: loading and managing user processes, a full system-call layer with safe user-memory access, demand-paged virtual memory with swap, and file system support. The code stays private under UT Austin's academic integrity policy — no public repo — but I'm glad to walk through the design decisions.",
    date: '2025-12',
    dateDisplay: 'Fall 2025',
    tags: ['C', 'Operating Systems', 'Kernel', 'Virtual Memory', 'QEMU'],
    category: ['Systems Programming'],
    status: 'Completed',
    links: {},
    keyFeatures: [
      'User process management: program loading, argument passing, and exec/wait/exit semantics',
      'System-call layer with user-pointer validation and safe kernel/user memory access',
      'Virtual memory: demand paging, page-fault handling, and swap',
      'File system support built on the Pintos filesystem layer',
      'Kernel synchronization with locks, semaphores, and condition variables',
      'Developed and debugged against QEMU with GDB'
    ],
    impact:
      'UT Operating Systems course project; code is private per academic integrity policy, so there is intentionally no public repo.',
    headline: 'Four kernel subsystems built from a bare kernel: processes, syscalls, virtual memory, file system',
    teamProject: false,
    pid: 4,
    manSection: 2,
    seeAlso: ['yash', 'cht-radix']
  },
  {
    slug: 'yash',
    tier: 'current',
    title: 'YASH',
    description:
      'Yet Another Shell — a custom Unix shell implementation in C with full command parsing, piping, redirection, and process management.',
    longDescription:
      'YASH (Yet Another Shell) is a Unix shell written from scratch in C. It handles command parsing, pipelines, I/O redirection, job control with background processes, and signals. Writing it was the process-management groundwork for the Pintos kernel work that followed.',
    date: '2025-09',
    dateDisplay: 'September 2025',
    tags: ['C', 'Systems Programming', 'Unix', 'Shell'],
    category: ['Systems Programming'],
    status: 'Completed',
    links: {
      github: 'https://github.com/Code-Tomato/YASH',
      documentation: 'https://code-tomato.github.io/YASH/'
    },
    keyFeatures: [
      'Full command parsing and execution',
      'Piping between commands',
      'I/O redirection (stdin, stdout, stderr)',
      'Job control: background processes, fg/bg/jobs',
      'Signal handling and process-group control',
      'Documented with a dedicated GitHub Pages site'
    ],
    headline: 'A complete job-control shell in C: pipes, redirection, signals, and background jobs',
    teamProject: false,
    pid: 5,
    manSection: 1,
    seeAlso: ['pintos']
  },
  {
    slug: 'goodeats',
    tier: 'current',
    title: 'GoodEats',
    description:
      'A community platform for finding affordable local food deals, built during the SEO Tech Developer fellowship and used by 50+ UT students.',
    longDescription:
      'GoodEats surfaces deals from local and family-owned restaurants that never make it online, with map-based discovery and preference matching that ranks results by price, distance, and category. I built it with a team during the SEO Tech Developer fellowship using React, Tailwind, Flask, and Supabase with the Google Maps and Places APIs, working Agile with pull-request reviews and CI. More than 50 UT students use it.',
    date: '2025-08',
    dateDisplay: 'August 2025',
    tags: ['React', 'Tailwind CSS', 'Flask', 'Supabase', 'Google Maps API'],
    category: ['Web Applications'],
    status: 'Completed',
    links: {
      github: 'https://github.com/YahirSalas/goodeats'
    },
    keyFeatures: [
      'Map-based deal discovery via the Google Maps and Places APIs',
      'Preference matching that ranks deals by price, distance, and category',
      "Community submissions that surface family-owned restaurants that don't advertise online",
      'React + Tailwind frontend, Flask backend, Supabase database',
      'Agile team workflow with pull-request reviews and CI'
    ],
    impact: 'SEO Tech Developer fellowship capstone, built and shipped with a team to real users.',
    headline: '50+ UT students use it to find affordable local food deals',
    teamProject: true,
    pid: 6,
    manSection: 7,
    seeAlso: ['ecolens']
  },
  {
    slug: 'ecolens',
    tier: 'archived',
    title: 'EcoLens',
    description:
      'A pantry scanner that recognizes food items and scores their environmental impact.',
    longDescription:
      'EcoLens scans pantry items with computer vision, matches them against sustainability databases, and gives each item an eco-score plus lower-impact alternatives.',
    date: '2025-08',
    dateDisplay: 'August 2025',
    tags: ['Python', 'JavaScript', 'Computer Vision', 'Sustainability'],
    category: ['Web Applications'],
    status: 'Completed',
    links: {
      github: 'https://github.com/Noel-Lozano/EcoLens'
    },
    keyFeatures: [
      'Pantry item scanning and recognition',
      'Environmental impact scoring system',
      'Product alternative suggestions',
      'Carbon footprint calculations',
      'Visual analytics and dashboards'
    ],
    impact: 'Team project that shows users the environmental impact of their food choices.',
    headline: 'Scans pantry items and scores their environmental impact with computer vision',
    teamProject: true,
    pid: 7,
    manSection: 7,
    seeAlso: ['goodeats']
  },
  {
    slug: 'ps-amperes',
    tier: 'archived',
    title: 'PS-Amperes',
    description:
      "A custom current-sensing board designed for the UT Longhorn Racing electric vehicle's battery system.",
    longDescription:
      "PS-Amperes is a precision current-sensing board designed for UT Longhorn Racing's electric vehicle. It supplies the current measurements the battery management system depends on for power management and safety. It came out of my Longhorn Racing battery work, where I led BMS design, built a state-of-charge algorithm with under 5% range error, and wrote RTOS firmware modules.",
    date: '2025-02',
    dateDisplay: 'February 2025',
    tags: ['Hardware Design', 'PCB', 'KiCAD', 'Embedded Systems', 'Automotive'],
    category: ['Hardware/Electronics', 'Embedded Systems'],
    status: 'Completed',
    links: {
      github: 'https://github.com/lhr-solar/PS-Amperes'
    },
    keyFeatures: [
      'High-precision current sensing for a safety-critical EV battery system',
      'Custom PCB layout in KiCAD',
      'Feeds the BMS state-of-charge algorithm (under 5% range error)',
      'Integration with the vehicle power system',
      'Real-time current monitoring',
      'Companion RTOS firmware modules for the BMS'
    ],
    impact: "Part of leading BMS design for UT Longhorn Racing's electric vehicle program.",
    headline: 'Current sensing feeding a BMS state-of-charge algorithm with under 5% range error',
    teamProject: true,
    pid: 8,
    manSection: 4,
    seeAlso: ['keyboard2x2', 'astro-party']
  },
  {
    slug: 'primate-sim',
    tier: 'archived',
    title: 'Primate-Sim',
    description:
      "An instruction-accurate RISC-V simulator built in the FAST Research Group to check the Primate compiler, dedicated to Dr. Chiou's memory.",
    longDescription:
      "As a research assistant in UT's FAST group, I worked on an instruction-accurate RISC-V simulator used to validate the Primate compiler: handling I/O instructions, building compiler-checking tools, and writing a testing app that removed redundant FPGA synthesis runs. The group concluded following Dr. Chiou's passing; this project is preserved in his memory.",
    date: '2025-01',
    dateDisplay: 'January 2025',
    tags: ['Python', 'RISC-V', 'Simulation', 'FPGA', 'Compilers', 'Research'],
    category: ['Research/Academic'],
    status: 'Completed',
    links: {
      github: 'https://github.com/FAST-Research-Group/primate-sim'
    },
    keyFeatures: [
      'Instruction-accurate RISC-V simulation for the Primate compiler',
      'I/O instruction handling in the simulator',
      'Compiler-checking tools to validate Primate output',
      'Testing app that removed redundant FPGA synthesis runs',
      "Research contribution within UT's FAST group"
    ],
    impact:
      "In memory of Dr. Chiou — contributed to the FAST Research Group's Primate compiler work before the group concluded.",
    headline: 'Instruction-accurate RISC-V simulation that eliminated redundant FPGA synthesis runs',
    teamProject: true,
    pid: 9,
    manSection: 1,
    seeAlso: ['pintos']
  },
  {
    slug: 'astro-party',
    tier: 'archived',
    title: 'Astro Party Embedded',
    description:
      'An embedded systems project recreating the Astro Party game for EE 319K, with real-time gameplay on a microcontroller.',
    longDescription:
      'Astro Party Embedded is a clone of the popular Astro Party game, implemented on embedded hardware for the EE 319K Embedded Systems course. It runs real-time gameplay, LCD graphics rendering, physics and collision detection, and input handling bare-metal on a microcontroller.',
    date: '2024-05',
    dateDisplay: 'May 2024',
    tags: ['C', 'Embedded Systems', 'Microcontroller', 'Real-time', 'Game Development'],
    category: ['Embedded Systems'],
    status: 'Completed',
    links: {
      github: 'https://github.com/samienr/Astro-Party-Embedded'
    },
    keyFeatures: [
      'Real-time embedded game implementation',
      'Bare-metal microcontroller gameplay loop',
      'Graphics rendering on an LCD',
      'Input handling and controls',
      'Game physics and collision detection',
      'Sound effects and audio output'
    ],
    impact: 'EE 319K course project in embedded systems design and real-time programming.',
    headline: 'Real-time arcade game running bare-metal on a microcontroller with LCD graphics and sound',
    teamProject: true,
    pid: 10,
    manSection: 6,
    seeAlso: ['keyboard2x2', 'ps-amperes']
  },
  {
    slug: 'keyboard2x2',
    tier: 'archived',
    title: 'Keyboard2x2',
    description:
      'My first custom mechanical keyboard — a 2x2 macro pad designed in KiCAD to learn PCB design and hardware development.',
    longDescription:
      'Keyboard2x2 is a custom 2x2 mechanical keyboard PCB that was my introduction to hardware design and PCB layout. Built with KiCAD around the ATmega32U4 microcontroller with mechanical switches and custom firmware, it taught me the full path from schematic capture to PCB manufacturing.',
    date: '2024-01',
    dateDisplay: 'January 2024',
    tags: ['KiCAD', 'PCB Design', 'Hardware', 'ATmega32U4', 'QMK'],
    category: ['Hardware/Electronics'],
    status: 'Completed',
    links: {
      github: 'https://github.com/Code-Tomato/Keyboard2x2'
    },
    keyFeatures: [
      'Custom 2x2 mechanical keyboard PCB designed from scratch',
      'ATmega32U4 microcontroller',
      'Compatible with Cherry MX switches',
      'USB connectivity via Mini USB',
      'Custom firmware',
      'Full hardware documentation'
    ],
    impact: 'First hardware project — the foundation for the embedded and systems work that followed.',
    headline: 'First PCB: from KiCAD schematic to a fabricated 2x2 macro pad on an ATmega32U4',
    teamProject: false,
    pid: 11,
    manSection: 4,
    seeAlso: ['ps-amperes']
  },
  {
    slug: 'variational-quantum-eigensolver',
    tier: 'archived',
    title: 'Variational Quantum Eigensolver',
    description:
      'A high school team project implementing a quantum algorithm for finding ground state energies in computational chemistry.',
    longDescription:
      'Developed a Variational Quantum Eigensolver (VQE) as part of a high school team project. VQE is a hybrid quantum-classical algorithm that estimates the ground-state energy of molecules.',
    date: '2022-08',
    dateDisplay: 'August 2022',
    tags: ['Python', 'Quantum Computing', 'Qiskit', 'Chemistry', 'Research'],
    category: ['Research/Academic'],
    status: 'Completed',
    links: {
      github: 'https://github.com/Code-Tomato/Variational-Quantum-Eigensolver'
    },
    keyFeatures: [
      'Implementation of the VQE algorithm',
      'Quantum circuit design',
      'Ground state energy calculations',
      'Molecular Hamiltonian mapping',
      'Hybrid quantum-classical optimization',
      'High school team collaboration'
    ],
    impact: 'Early exposure to quantum computing concepts and algorithms during high school.',
    headline: 'Hybrid quantum-classical VQE estimating molecular ground-state energies in Qiskit',
    teamProject: true,
    pid: 12,
    manSection: 1,
    seeAlso: ['primate-sim']
  }
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find(p => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter(p => p.tier === 'featured');
}

export function getCurrentProjects(): Project[] {
  return projects.filter(p => p.tier === 'current');
}

export function getArchivedProjects(): Project[] {
  return projects.filter(p => p.tier === 'archived');
}

/** All projects in pid order — the `ps -u nathan` index. */
export function getProcessTable(): Project[] {
  return [...projects].sort((a, b) => a.pid - b.pid);
}

/** ps STAT column by tier: R running · S sleeping · T stopped. Z is banned — children are always reaped. */
export function getStat(project: Project): string {
  return project.tier === 'featured' ? 'R' : project.tier === 'current' ? 'S' : 'T';
}

export function getRecentProjects(count: number = 3): Project[] {
  return projects
    .filter(p => p.tier === 'featured' || p.tier === 'current')
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, count);
}
