// Generated from the July 2026 content model (tiered project data, verified links only).
import { publication } from './experience';

export type Tier = 'featured' | 'current' | 'archived';

export interface ProjectLinks {
  github?: string;
  documentation?: string;
  paper?: string;
}

export interface Project {
  slug: string;
  tier: Tier;
  title: string;
  summary: string;
  date: string;
  dateDisplay: string;
  tags: string[];
  category: string[];
  links: ProjectLinks;
  description: string;
  teamProject: boolean;
}

export const projects: Project[] = [
  {
    slug: 'serving-baselines',
    tier: 'featured',
    title: 'EnerTune Baselines',
    summary:
      "Four published GPU-sharing serving systems rebuilt from their papers and ported to a 16-A100 cluster to serve as EnerTune's baselines.",
    date: '2026-06',
    dateDisplay: 'Fall 2025 - Spring 2026',
    tags: [
      'GPU Scheduling',
      'ML Inference Serving',
      'Multi-Tenant GPUs',
      'Systems Research',
      'Python'
    ],
    category: ['Research/Academic', 'Machine Learning Systems'],
    links: {
      github: 'https://github.com/Code-Tomato/sus-gpus-baselines',
      paper: publication.paper
    },
    description:
      "<strong>Third author on EnerTune (SOSP '26)</strong>, as an undergraduate research assistant in UT Austin's ECE systems-for-ML group. I rebuilt <strong>four GPU-sharing serving systems</strong> (GPULets, Usher, FGD, ParvaGPU) from their papers and ported each onto our <strong>16-A100 cluster</strong>, which is what made a fair comparison possible and enabled EnerTune's <strong>1.4-2.3x lower energy</strong> result. Profiling all four then showed its model cuts profiling time <strong>7.3x on average</strong>.",
    teamProject: true
  },
  {
    slug: 'mllm-energy',
    tier: 'featured',
    title: 'MLLM-Energy',
    summary:
      '1,080 profiled configurations of multimodal LLM serving on an A100, showing that a one-size GPU split across phases wastes energy.',
    date: '2026-05',
    dateDisplay: 'Spring 2026',
    tags: ['CUDA', 'vLLM', 'Nsight Compute', 'GPU Profiling', 'LLM Inference', 'Energy Efficiency'],
    category: ['Research/Academic', 'Machine Learning Systems'],
    links: {
      github: 'https://github.com/mllm-energy/MLLM-Energy',
      documentation: 'https://mllm-energy.github.io/MLLM-Energy/',
      paper: 'https://github.com/mllm-energy/MLLM-Energy/blob/main/paper.pdf'
    },
    description:
      "<strong>Graduate course research (ECE 382V)</strong> with a public paper and project site. We profiled InternVL3-8B serving on an NVIDIA A100 with vLLM and Nsight Compute, splitting every request into its four inference phases. <strong>Decode takes 88.7% of the wall clock</strong> while sustaining only <strong>14% SM and 23% DRAM throughput</strong>, performance and power both saturate at about a third of the GPU's cores, and batching is a <strong>12.9x energy lever</strong> on output-heavy work but only 1.9x on input-heavy work. The measurement groundwork for energy-first serving.",
    teamProject: true
  },
  {
    slug: 'cht-radix',
    tier: 'featured',
    title: 'CHT-Radix',
    summary:
      'Seven concurrent hash tables and radix trees in C++, benchmarked against both synthetic traffic and a real ShareGPT prefix-cache trace.',
    date: '2026-05',
    dateDisplay: 'Spring 2026',
    tags: ['C++', 'Concurrency', 'Multicore', 'Data Structures', 'Benchmarking', 'LLM Caching'],
    category: ['Systems Programming', 'Research/Academic'],
    links: {
      github: 'https://github.com/Code-Tomato/CHT_Radix',
      documentation: 'https://code-tomato.github.io/CHT_Radix/',
      paper: 'https://github.com/Code-Tomato/CHT_Radix/blob/main/paper/CHT_Radix.pdf'
    },
    description:
      "<strong>EE 361C (Multicore Algorithms)</strong> project run like a research artifact, with a paper, a reproducibility recipe and citable metadata. Concurrent structures are almost always benchmarked on random keys, so we built <strong>five hash-table variants and two radix trees</strong> behind one interface and replayed a ShareGPT-derived trace against them. Peak throughput reached <strong>88.36M ops/sec</strong>, a <strong>13x gain</strong> over the coarse-locked baseline, but on the real trace <strong>p99 tail latency ran up to 40x worse</strong> than random keys suggested.",
    teamProject: true
  },
  {
    slug: 'pintos',
    tier: 'featured',
    title: 'Pintos',
    summary:
      'The Pintos teaching kernel built out in C: user processes, system calls, demand-paged virtual memory, and full file system support.',
    date: '2025-12',
    dateDisplay: 'Fall 2025',
    tags: ['C', 'Operating Systems', 'Kernel', 'Virtual Memory', 'QEMU'],
    category: ['Systems Programming'],
    links: {},
    description:
      "<strong>UT Operating Systems course project.</strong> Starting from the bare Pintos kernel I implemented the core of a working operating system: <strong>loading and managing user processes</strong>, a <strong>system-call layer</strong> with validation on every user pointer, <strong>demand-paged virtual memory with swap</strong>, and <strong>file system support</strong>, with locks, semaphores and condition variables underneath. Developed on macOS against QEMU and debugged with gdb. The code stays private under academic integrity policy, but the design is mine to walk through.",
    teamProject: false
  },
  {
    slug: 'yash',
    tier: 'current',
    title: 'YASH',
    summary:
      'A Unix shell written from scratch in C: command parsing, pipes, redirection, and job control.',
    date: '2025-09',
    dateDisplay: 'September 2025',
    tags: ['C', 'Systems Programming', 'Unix', 'Shell'],
    category: ['Systems Programming'],
    links: {
      github: 'https://github.com/Code-Tomato/YASH',
      documentation: 'https://code-tomato.github.io/YASH/'
    },
    description:
      "Written from scratch <strong>in C</strong> as the process-management groundwork for the <strong>Pintos kernel</strong> work that followed. YASH handles <strong>command parsing and execution</strong>, <strong>pipelines</strong> between commands, <strong>I/O redirection</strong> across stdin, stdout and stderr, <strong>job control</strong> with background processes and fg/bg/jobs, and <strong>signal handling</strong> with process-group control. Every shell feature you stop noticing is a special case somebody had to write down, and this is the project where I wrote them.",
    teamProject: false
  },
  {
    slug: 'goodeats',
    tier: 'current',
    title: 'GoodEats',
    summary:
      'Community platform for local food deals, built in the SEO Tech fellowship and used by 50+ UT students.',
    date: '2025-08',
    dateDisplay: 'August 2025',
    tags: ['React', 'Tailwind CSS', 'Flask', 'Supabase', 'Google Maps API'],
    category: ['Web Applications'],
    links: {
      github: 'https://github.com/YahirSalas/goodeats'
    },
    description:
      "<strong>SEO Tech Developer fellowship capstone</strong>, built and shipped with a team to real users. The best deals near campus belong to family-owned restaurants with no website, so GoodEats collects them: <strong>map-based discovery</strong> through the Google Maps and Places APIs, community submissions, and <strong>preference matching</strong> that ranks results by price, distance and category. <strong>React and Tailwind</strong> on the front, <strong>Flask and Supabase</strong> behind it, worked Agile with pull-request reviews and CI. <strong>More than 50 UT students use it.</strong>",
    teamProject: true
  },
  {
    slug: 'ecolens',
    tier: 'archived',
    title: 'EcoLens',
    summary:
      'A pantry scanner that recognizes food items and scores their environmental impact.',
    date: '2025-08',
    dateDisplay: 'August 2025',
    tags: ['Python', 'JavaScript', 'Computer Vision', 'Sustainability'],
    category: ['Web Applications'],
    links: {
      github: 'https://github.com/Noel-Lozano/EcoLens'
    },
    description:
      "Team project putting a number on a choice people make without thinking. EcoLens scans pantry items with <strong>computer vision</strong>, matches them against <strong>sustainability databases</strong>, and returns an <strong>eco-score</strong> for each item alongside a lower-impact alternative, with carbon-footprint calculations and visual analytics over the results. The recognition was never the hard part; the packaging a camera has to read is designed to be read by people, not by models, and that is where most of the work went.",
    teamProject: true
  },
  {
    slug: 'ps-amperes',
    tier: 'archived',
    title: 'PS-Amperes',
    summary:
      "A custom current-sensing board designed for the UT Longhorn Racing electric vehicle's battery system.",
    date: '2025-02',
    dateDisplay: 'February 2025',
    tags: ['Hardware Design', 'PCB', 'KiCAD', 'Embedded Systems', 'Automotive'],
    category: ['Hardware/Electronics', 'Embedded Systems'],
    links: {
      github: 'https://github.com/lhr-solar/PS-Amperes'
    },
    description:
      "Part of <strong>leading battery-management design</strong> for UT Longhorn Racing's electric vehicle program. PS-Amperes is a <strong>precision current-sensing board</strong> laid out in KiCAD, and every power-management and safety decision the BMS makes starts from the measurement it supplies, which makes it the quiet dependency underneath the whole pack. It came out of my wider BMS work on the team, where I wrote <strong>RTOS firmware modules</strong> and built the <strong>state-of-charge algorithm</strong> that kept range estimates <strong>within 5%</strong>.",
    teamProject: true
  },
  {
    slug: 'primate-sim',
    tier: 'archived',
    title: 'Primate-Sim',
    summary:
      "An instruction-accurate RISC-V simulator built in UT's FAST group to validate the Primate compiler.",
    date: '2025-01',
    dateDisplay: 'January 2025',
    tags: ['Python', 'RISC-V', 'Simulation', 'FPGA', 'Compilers', 'Research'],
    category: ['Research/Academic'],
    links: {
      github: 'https://github.com/FAST-Research-Group/primate-sim'
    },
    description:
      "Contributed to the <strong>FAST Research Group's Primate compiler</strong> work before the group concluded. As a research assistant I worked on an <strong>instruction-accurate RISC-V simulator</strong> the team used to validate the compiler: handling <strong>I/O instructions</strong>, building the tools that checked compiler output against the simulator, and writing a testing app that <strong>removed redundant FPGA synthesis runs</strong> so the hardware and software sides could be developed side by side instead of waiting on each other.",
    teamProject: true
  },
  {
    slug: 'astro-party',
    tier: 'archived',
    title: 'Astro Party Embedded',
    summary:
      'An Astro Party clone for ECE 319K, with real-time gameplay running bare-metal on a microcontroller.',
    date: '2024-05',
    dateDisplay: 'May 2024',
    tags: ['C', 'Embedded Systems', 'Microcontroller', 'Real-time', 'Game Development'],
    category: ['Embedded Systems'],
    links: {
      github: 'https://github.com/samienr/Astro-Party-Embedded'
    },
    description:
      "<strong>ECE 319K course project</strong> in embedded systems design and real-time programming. A clone of Astro Party running <strong>bare-metal on a microcontroller</strong>: the gameplay loop, <strong>LCD graphics rendering</strong>, <strong>physics and collision detection</strong>, input handling and audio output, with <strong>no operating system, no allocator</strong> and nothing underneath to absorb a mistake. Games are a good way to learn real-time constraints, because the deadline arrives many times a second and a missed one is something you can see.",
    teamProject: true
  },
  {
    slug: 'keyboard2x2',
    tier: 'archived',
    title: 'Keyboard2x2',
    summary:
      'My first PCB: a 2x2 mechanical macro pad designed in KiCAD to learn hardware design.',
    date: '2024-01',
    dateDisplay: 'January 2024',
    tags: ['KiCAD', 'PCB Design', 'Hardware', 'ATmega32U4', 'QMK'],
    category: ['Hardware/Electronics'],
    links: {
      github: 'https://github.com/Code-Tomato/Keyboard2x2'
    },
    description:
      "<strong>First hardware project</strong> and the foundation for the embedded work that followed. Keyboard2x2 is a custom <strong>2x2 mechanical keyboard PCB</strong>, built in <strong>KiCAD</strong> around an <strong>ATmega32U4</strong> with Cherry MX switches, USB connectivity and custom firmware. Four keys is not a useful keyboard, but it is a complete one, and it made me walk the whole path <strong>from schematic capture through to a fabricated board</strong>. Everything hardware I have built since traces back to it.",
    teamProject: false
  },
  {
    slug: 'variational-quantum-eigensolver',
    tier: 'archived',
    title: 'Variational Quantum Eigensolver',
    summary:
      'A high school team project implementing a quantum algorithm for molecular ground-state energies.',
    date: '2022-08',
    dateDisplay: 'August 2022',
    tags: ['Python', 'Quantum Computing', 'Qiskit', 'Chemistry', 'Research'],
    category: ['Research/Academic'],
    links: {
      github: 'https://github.com/Code-Tomato/Variational-Quantum-Eigensolver'
    },
    description:
      "<strong>Early exposure to quantum computing</strong> during high school, and the first problem I could not finish in one sitting. A <strong>Variational Quantum Eigensolver</strong> built with a team in <strong>Qiskit</strong>: a <strong>hybrid quantum-classical algorithm</strong> where a quantum circuit proposes a state, a classical optimizer adjusts the parameters, and the loop repeats until the <strong>estimated ground-state energy</strong> of the molecule stops falling. Circuit design and molecular Hamiltonian mapping were the substance of it.",
    teamProject: true
  }
];


export function getFeaturedProjects(): Project[] {
  return projects.filter(p => p.tier === 'featured');
}




