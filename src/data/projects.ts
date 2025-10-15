// Centralized project data - sorted newest to oldest
export interface Project {
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  date: string;
  dateDisplay: string;
  tags: string[];
  category: string[];
  status: 'Active' | 'Completed' | 'Archived' | 'In Maintenance';
  statusColor: 'live' | 'completed' | 'developing' | 'ongoing' | 'archived';
  github: string;
  demo?: string;
  documentation?: string;
  size: 'large' | 'medium' | 'small';
  gradient: string;
  featured: boolean;
  teamProject: boolean;
  keyFeatures: string[];
  impact?: string;
}

export const projects: Project[] = [
  {
    slug: 'yash',
    title: 'YASH',
    description: 'Yet Another Shell - A custom Unix shell implementation in C with full command parsing, piping, redirection, and process management.',
    longDescription: 'YASH (Yet Another Shell) is a fully functional Unix shell built from scratch in C. It features comprehensive command parsing, execution pipelines, I/O redirection, and robust process management, demonstrating low-level systems programming expertise.',
    date: '2025-09',
    dateDisplay: 'September 2025',
    tags: ['C', 'Systems Programming', 'Unix', 'Shell'],
    category: ['Systems Programming'],
    status: 'Completed',
    statusColor: 'completed',
    github: 'https://github.com/Code-Tomato/YASH',
    documentation: 'https://code-tomato.github.io/YASH/',
    size: 'large',
    gradient: 'gradient-1',
    featured: true,
    teamProject: false,
    keyFeatures: [
      'Full command parsing and execution',
      'Built-in commands (cd, pwd, exit, etc.)',
      'Piping between multiple commands',
      'I/O redirection (stdin, stdout, stderr)',
      'Background process management',
      'Signal handling and process control',
      'Environment variable support'
    ]
  },
  {
    slug: 'goodeats',
    title: 'GoodEats',
    description: 'A web application that helps users discover affordable and local food deals near them, making dining out accessible for everyone.',
    longDescription: 'GoodEats is a community-driven platform that aggregates local restaurant deals and promotions, helping budget-conscious diners find the best value near them. Features location-based search, deal filtering, and social sharing.',
    date: '2025-08',
    dateDisplay: 'August 2025',
    tags: ['Python', 'HTML', 'CSS', 'JavaScript', 'Web Development'],
    category: ['Web Applications'],
    status: 'Completed',
    statusColor: 'completed',
    github: 'https://github.com/YahirSalas/goodeats',
    size: 'medium',
    gradient: 'gradient-2',
    featured: true,
    teamProject: true,
    keyFeatures: [
      'Location-based deal discovery',
      'Restaurant and promotion database',
      'Filter by cuisine, price, and distance',
      'User-friendly interface for browsing deals',
      'Mobile-responsive design',
      'Real-time deal updates'
    ],
    impact: 'Collaborated with team to help students and budget-conscious diners save money on local dining.'
  },
  {
    slug: 'ecolens',
    title: 'EcoLens',
    description: 'An intelligent pantry scanner that analyzes your food items and calculates the environmental impact score of your pantry.',
    longDescription: 'EcoLens uses computer vision and sustainability databases to scan pantry items and provide users with comprehensive eco-scores. The app helps users make more environmentally conscious food choices.',
    date: '2025-08',
    dateDisplay: 'August 2025',
    tags: ['Python', 'HTML', 'CSS', 'JavaScript', 'Computer Vision', 'Sustainability'],
    category: ['Web Applications'],
    status: 'Completed',
    statusColor: 'completed',
    github: 'https://github.com/Noel-Lozano/EcoLens',
    size: 'medium',
    gradient: 'gradient-3',
    featured: true,
    teamProject: true,
    keyFeatures: [
      'Pantry item scanning and recognition',
      'Environmental impact scoring system',
      'Sustainability metrics and insights',
      'Product alternatives suggestions',
      'Carbon footprint calculations',
      'Visual analytics and dashboards'
    ],
    impact: 'Empowers users to make sustainable food choices by providing transparency on environmental impact.'
  },
  {
    slug: 'ps-amperes',
    title: 'PS-Amperes',
    description: 'A custom hardware board designed to sense current for the UT Longhorn Racing Formula SAE electric vehicle.',
    longDescription: 'PS-Amperes is a precision current sensing board designed for UT Longhorn Racing\'s Formula SAE electric vehicle. The board provides accurate current measurements critical for power management and safety in high-performance electric racing.',
    date: '2025-02',
    dateDisplay: 'February 2025',
    tags: ['Hardware Design', 'PCB', 'KiCAD', 'Embedded Systems', 'Automotive'],
    category: ['Hardware/Electronics', 'Embedded Systems'],
    status: 'Completed',
    statusColor: 'completed',
    github: 'https://github.com/lhr-solar/PS-Amperes',
    size: 'large',
    gradient: 'gradient-4',
    featured: false,
    teamProject: true,
    keyFeatures: [
      'High-precision current sensing',
      'Designed for Formula SAE electric vehicle',
      'Custom PCB layout in KiCAD',
      'Safety-critical automotive application',
      'Integration with vehicle power system',
      'Real-time current monitoring'
    ],
    impact: 'Contributes to UT Longhorn Racing\'s competitive electric vehicle by providing critical power monitoring.'
  },
  {
    slug: 'primate-sim',
    title: 'Primate-Sim',
    description: 'A research simulator developed for the FAST Research Group. Dedicated to Dr. Chiou\'s memory and contributions to research.',
    longDescription: 'Primate-Sim is a specialized simulation tool developed for the FAST Research Group to model and analyze complex systems. This project represents academic research contributions and collaboration. The research group has since concluded following Dr. Chiou\'s passing.',
    date: '2025-01',
    dateDisplay: 'January 2025',
    tags: ['Python', 'Research', 'Simulation', 'Academic'],
    category: ['Research/Academic'],
    status: 'Completed',
    statusColor: 'completed',
    github: 'https://github.com/FAST-Research-Group/primate-sim',
    size: 'medium',
    gradient: 'gradient-5',
    featured: false,
    teamProject: true,
    keyFeatures: [
      'Research-grade simulation framework',
      'Complex system modeling',
      'Data analysis and visualization',
      'Configurable simulation parameters',
      'Academic research contribution'
    ],
    impact: 'In memory of Dr. Chiou - contributed to research efforts of the FAST Research Group before its conclusion.'
  },
  {
    slug: 'astro-party',
    title: 'Astro Party Embedded',
    description: 'An embedded systems project recreating Astro Party game for EE 319K course, featuring real-time gameplay on microcontroller.',
    longDescription: 'Astro Party Embedded is a clone of the popular Astro Party game, implemented on embedded hardware for the EE 319K Embedded Systems course. Features real-time gameplay, graphics rendering, and input handling on a microcontroller platform.',
    date: '2024-05',
    dateDisplay: 'May 2024',
    tags: ['C', 'Embedded Systems', 'Microcontroller', 'Real-time', 'Game Development'],
    category: ['Embedded Systems'],
    status: 'Completed',
    statusColor: 'completed',
    github: 'https://github.com/samienr/Astro-Party-Embedded',
    size: 'large',
    gradient: 'gradient-6',
    featured: false,
    teamProject: true,
    keyFeatures: [
      'Real-time embedded game implementation',
      'Microcontroller-based gameplay',
      'Graphics rendering on LCD',
      'Input handling and controls',
      'Game physics and collision detection',
      'Sound effects and audio output'
    ],
    impact: 'EE 319K course project demonstrating embedded systems design and real-time programming skills.'
  },
  {
    slug: 'keyboard2x2',
    title: 'Keyboard2x2',
    description: 'My first custom mechanical keyboard - a 2x2 macro pad designed with KiCAD to learn PCB design and hardware development.',
    longDescription: 'Keyboard2x2 is a custom 2x2 mechanical keyboard PCB that served as my introduction to hardware design and PCB layout. Built with KiCAD, it features the ATmega32U4 microcontroller, mechanical switches, and custom firmware. This project taught me the fundamentals of hardware design, from schematic capture to PCB manufacturing.',
    date: '2024-01',
    dateDisplay: 'January 2024',
    tags: ['KiCAD', 'PCB Design', 'Hardware', 'ATmega32U4', 'QMK'],
    category: ['Hardware/Electronics'],
    status: 'Completed',
    statusColor: 'completed',
    github: 'https://github.com/Code-Tomato/Keyboard2x2',
    size: 'medium',
    gradient: 'gradient-1',
    featured: false,
    teamProject: false,
    keyFeatures: [
      'Custom 2x2 mechanical keyboard PCB',
      'ATmega32U4 microcontroller',
      'Compatible with Cherry MX switches',
      'USB connectivity via Mini USB',
      'Custom PCB design from scratch',
      'Full hardware documentation'
    ],
    impact: 'First hardware project that introduced me to PCB design - foundation for future hardware work.'
  },
  {
    slug: 'variational-quantum-eigensolver',
    title: 'Variational Quantum Eigensolver',
    description: 'A high school team project implementing a quantum algorithm for finding ground state energies in computational chemistry.',
    longDescription: 'Developed a Variational Quantum Eigensolver (VQE) algorithm as part of a high school team project. VQE is a hybrid quantum-classical algorithm used to find the ground state energy of molecules, with applications in computational chemistry and quantum computing research.',
    date: '2022-08',
    dateDisplay: 'August 2022',
    tags: ['Python', 'Quantum Computing', 'Qiskit', 'Chemistry', 'Research'],
    category: ['Research/Academic'],
    status: 'Completed',
    statusColor: 'completed',
    github: 'https://github.com/Code-Tomato/Variational-Quantum-Eigensolver',
    size: 'small',
    gradient: 'gradient-2',
    featured: false,
    teamProject: true,
    keyFeatures: [
      'Implementation of VQE algorithm',
      'Quantum circuit design',
      'Ground state energy calculations',
      'Molecular Hamiltonian mapping',
      'Hybrid quantum-classical optimization',
      'High school team collaboration'
    ],
    impact: 'Early exposure to quantum computing concepts and algorithms during high school.'
  }
];

// Helper functions
export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find(p => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter(p => p.featured);
}

export function getProjectsByCategory(category: string): Project[] {
  return projects.filter(p => p.category.includes(category));
}

export function getRecentProjects(count: number = 3): Project[] {
  return projects.slice(0, count);
}

