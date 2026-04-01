export type LocalPillarKey = 'community' | 'work' | 'planet' | 'world';

export type LocalProgram = {
  title?: string;
  bullets?: string[];
};

export type LocalPillar = {
  key: LocalPillarKey;
  label: string;
  color: string;
  programs: LocalProgram[];
};

export type LocalStats = {
  corporate: number;
  nonCorporate?: number;
  youth: number;
  others?: number;
  totalMembersAsOf: string;
};

export type LocalConfig = {
  id: string; // matches markerId from Where_We_Are.tsx (e.g. "manila")
  name: string;
  established?: string;
  facebookUrl?: string;
  heroImageUrl?: string; // background image for the top area
  logoImageUrl?: string; // local logo image (clickable to facebook)
  stats?: LocalStats;
  pillars: LocalPillar[];
};

const manilaHero = new URL(
  '../assets/images/local_Y/Manila/651252800_1244340891210365_7254344077608894654_n.jpg',
  import.meta.url,
).href;

const manilaLogo = new URL(
  '../assets/images/local_Y/Manila/Manila_Logo.png',
  import.meta.url,
).href;

const placeholderHero = new URL('../assets/images/Philippine-Map.png', import.meta.url).href;

export function resolveLocalHeroImage(local: LocalConfig): string {
  const hero = local.heroImageUrl;
  if (hero && hero !== placeholderHero) return hero;
  return local.logoImageUrl ?? hero ?? '';
}

const baguioHero = new URL(
  '../assets/images/local_Y/Baguio/602382575_1303432731829104_4353432870511116094_n.jpg',
  import.meta.url,
).href;

const baguioLogo = new URL(
  '../assets/images/local_Y/Baguio/Baguio_Logo.jpg',
  import.meta.url,
).href;

const tuguegaraoHero = new URL(
  '../assets/images/local_Y/Tuguegarao/517983205_122232736898242751_6589037590649966650_n.jpg',
  import.meta.url,
).href;

const tuguegaraoLogo = new URL(
  '../assets/images/local_Y/Tuguegarao/Tuguegarao_Logo.jpg',
  import.meta.url,
).href;

const pangasinanHero = new URL(
  '../assets/images/local_Y/Pangasinan/486866202_1098460535658863_5333548913586507666_n.jpg',
  import.meta.url,
).href;

const pangasinanLogo = new URL(
  '../assets/images/local_Y/Pangasinan/Pangasinan_Logo.jpg',
  import.meta.url,
).href;

const nuevaEcijaHero = new URL(
  '../assets/images/local_Y/Nueva_Ecija/Nueva_Ecija_Logo.jpg',
  import.meta.url,
).href;

const nuevaEcijaLogo = new URL(
  '../assets/images/local_Y/Nueva_Ecija/Nueva_Ecija_Logo.jpg',
  import.meta.url,
).href;

const cagayanDeOroHero = new URL(
  '../assets/images/local_Y/Cagayan_de_Oro/625221260_1420307216782319_4351019908662108339_n.jpg',
  import.meta.url,
).href;

const cagayanDeOroLogo = new URL(
  '../assets/images/local_Y/Cagayan_de_Oro/Cagayan_de_Oro_Logo.jpg',
  import.meta.url,
).href;

const makatiHero = new URL(
  '../assets/images/local_Y/Makati/639472196_1356228213196135_3135375505880380370_n.jpg',
  import.meta.url,
).href;

const makatiLogo = new URL('../assets/images/local_Y/Makati/Makati_Logo.png', import.meta.url).href;

const manilaDowntownHero = new URL(
  '../assets/images/local_Y/Manila_Downtown/34394816_1795525770514316_4021561905708531712_n.jpg',
  import.meta.url,
).href;

const manilaDowntownLogo = new URL(
  '../assets/images/local_Y/Manila_Downtown/Manila_Downton_Logo.jpg',
  import.meta.url,
).href;

const quezonCityHero = new URL(
  '../assets/images/local_Y/Quezon_City/480395648_1037971645032407_3239840903837948452_n.jpg',
  import.meta.url,
).href;

const quezonCityLogo = new URL('../assets/images/local_Y/Quezon_City/Quezon_Logo.jpg', import.meta.url).href;

const albayHero = placeholderHero;
const albayLogo = new URL('../assets/images/local_Y/Albay/Albay_Logo.jpg', import.meta.url).href;

const losbanosHero = new URL(
  '../assets/images/local_Y/Los_Banos/639207121_1379325430901221_1827035227254402564_n.jpg',
  import.meta.url,
).href;

const losbanosLogo = new URL('../assets/images/local_Y/Los_Banos/Los_Banos_Logo.jpg', import.meta.url).href;

const nuevaCaceresHero = new URL(
  '../assets/images/local_Y/Nueva_Caceres/491842361_1099934165505642_7985162661201583724_n.jpg',
  import.meta.url,
).href;

const nuevaCaceresLogo = new URL(
  '../assets/images/local_Y/Nueva_Caceres/Nueva_Caceres_Logo.jpg',
  import.meta.url,
).href;

const sanPabloHero = new URL('../assets/images/local_Y/San_Pablo/San_Pablo_Logo.jpg', import.meta.url).href;
const sanPabloLogo = new URL('../assets/images/local_Y/San_Pablo/San_Pablo_Logo.jpg', import.meta.url).href;

const cebuHero = new URL('../assets/images/local_Y/Cebu/Cebu_Logo.jpg', import.meta.url).href;
const cebuLogo = new URL('../assets/images/local_Y/Cebu/Cebu_Logo.jpg', import.meta.url).href;

const leyteHero = placeholderHero;
const leyteLogo = new URL(
  '../assets/images/local_Y/Leyte/Leyte_Logo.jpg',
  import.meta.url,
).href;

const negrosOccidentalHero = new URL(
  '../assets/images/local_Y/Negros_Occidental/Negros_Occidental_Logo.jpg',
  import.meta.url,
).href;

const negrosOccidentalLogo = new URL(
  '../assets/images/local_Y/Negros_Occidental/Negros_Occidental_Logo.jpg',
  import.meta.url,
).href;

const negrosOrientalHero = new URL(
  '../assets/images/local_Y/Negros_Oriental/474124851_1088815029948336_4872417670695837632_n.jpg',
  import.meta.url,
).href;

const negrosOrientalLogo = new URL(
  '../assets/images/local_Y/Negros_Oriental/Negros_Oriental_Logo.jpg',
  import.meta.url,
).href;

const davaoHero = new URL(
  '../assets/images/local_Y/Davao/588009835_1264023549084569_2080991013782010839_n.jpg',
  import.meta.url,
).href;

const davaoLogo = new URL('../assets/images/local_Y/Davao/Davao_Logo.jpg', import.meta.url).href;

const DEFAULT_PILLARS: LocalPillar[] = [
  {
    key: 'community',
    label: 'Community Wellbeing',
    color: '#C41E3A',
    programs: [],
  },
  {
    key: 'work',
    label: 'Meaningful Work',
    color: '#C41E3A',
    programs: [],
  },
  {
    key: 'planet',
    label: 'Sustainable Planet',
    color: '#C41E3A',
    programs: [],
  },
  {
    key: 'world',
    label: 'Just World',
    color: '#C41E3A',
    programs: [],
  },
];

export const LOCALS_BY_ID: Record<string, LocalConfig> = {
  // NORTHERN LUZON REGION YMCAs
  baguio: {
    id: 'baguio',
    name: 'YMCA of the City of Baguio',
    established: '1941',
    facebookUrl: 'https://www.facebook.com/ymcabaguiocity',
    heroImageUrl: baguioHero,
    logoImageUrl: baguioLogo,
    stats: {
      corporate: 1244,
      nonCorporate: 0,
      youth: 769,
      totalMembersAsOf: '2025',
    },
    pillars: [
      {
        key: 'community',
        label: 'Community Wellbeing',
        color: '#C41E3A',
        programs: [
          {
            bullets: [
              'YMCA Parking Renovation',
              'Theoretical Driving Exam',
              'Construction of a YMCA Shower Room adjacent to the Gymnasium',
              'YMCA Pre-School Annual In-Service Training',
              'Regular Board Meeting',
              'Rewards and Recreation to YMCA Pre-school Staff',
              'Annual Maintenance of Pre-School Facility',
              'Attendance to the First National Pickleball Tournament in CDO',
              'World Fitness Federation Asia',
              'YMCA North Luzon Region Regular Meeting',
              'Manila YMCA Scholars Variety Show for a Cause',
              'YMCA Baguio Staff Appreciation Day',
            ],
          },
        ],
      },
      {
        key: 'work',
        label: 'Meaningful Work',
        color: '#C41E3A',
        programs: [
          {
            bullets: [
              '(NCMB CAR) National Conciliation Mediation Board 2nd Semester',
              'Area Wide Seminar',
              'Formation of the Labor and Management Committee Orientation',
              "Christ's Praise Chorale",
              'Repair Of YMCA Main Entrance Door',
              'Social Concern Services',
              'Rizal Youth Leadership Training Institute (RYLTI) 2024',
              'Brigada Eskuwela 2024-2025',
              'Pickleball Pre-Qualifier Tournament',
              'PNP Capacity Building of the Enhanced Panio Team',
              'Giving of Free Secondhand Laptop to Indigent Mother',
              '53rd Annual Corporate Meeting 2025',
              'Vigil Service',
              'Local Academic Olympics',
              'Partnership Collaboration of Team Lakay and YMCA',
              'YWCA-YMCA of the Philippines National Youth Summit 2025',
            ],
          },
        ],
      },
      {
        key: 'planet',
        label: 'Sustainable Planet',
        color: '#C41E3A',
        programs: [
          {
            bullets: [
              'Barangay YMCA',
              'Environment Forum (Koalisyong Nga Maka-Kalikasang Novo Ecijanos KOMANE)',
              'Environmental Committee Regular Cleaning',
              "APAY Climate Auditor's Workshop",
              'YMCA National Eco Heroes Training',
              'Irisan Eco Park Cleaning & Weeding',
              'YMCA International Green Ambassadors Training',
            ],
          },
        ],
      },
      {
        key: 'world',
        label: 'Just World',
        color: '#C41E3A',
        programs: [
          {
            bullets: [
              '(NCMB CAR) National Conciliation Mediation Board 2nd Semester',
              'Area Wide Seminar',
              'Formation of the Labor and Management Committee Orientation',
              "Christ's Praise Chorale",
              "Children's Month YMCA Pre-School",
            ],
          },
        ],
      },
    ],
  },

tuguegarao: {
  id: 'tuguegarao',
  name: 'YMCA of the City of Tuguegarao',
  established: '1957',
  facebookUrl: 'https://www.facebook.com/ymcatuguegarao/',
  heroImageUrl: tuguegaraoHero,
  logoImageUrl: tuguegaraoLogo,
  stats: {
    corporate: 601,
    nonCorporate: 42,
    youth: 1447,
    totalMembersAsOf: '2025',
  },
  pillars: [
    {
      key: 'community',
      label: 'Community Wellbeing',
      color: '#C41E3A',
      programs: [
        { bullets: [
          'Relief Operation for Typhoon Kristine, Arce and Pepito',
          'City Development Council Meeting',
          'Civil Society Organization Forum',
          'Provincial Development Council Meeting'
        ] },
      ],
    },
    {
      key: 'work',
      label: 'Meaningful Work',
      color: '#C41E3A',
      programs: [
        { bullets: [
          'Re-organization of the Hi-Y Clubs in the different schools',
          'Hi-Y Club Orientation at Cagayan National High School (Jr & Sr)',
          'North Luzon Regional Meeting',
          'Monthly Board Meeting',
          'CSO Night'
        ] },
      ],
    },
    {
      key: 'planet',
      label: 'Sustainable Planet',
      color: '#C41E3A',
      programs: [
        { bullets: [
          'National Eco-Heroes Training'
        ] },
      ],
    },
    {
      key: 'world',
      label: 'Just World',
      color: '#C41E3A',
      programs: [
        { bullets: [
          'Unity Walk (Tuguegarao Town Fiesta'
        ] },
      ],
    },
  ],
},

nueva_ecija: {
  id: 'nueva_ecija',
  name: 'YMCA of Nueva Ecija',
  established: '1957',
  facebookUrl: 'https://www.facebook.com/ymca.nuevaecija.2024/',
  heroImageUrl: nuevaEcijaHero,
  logoImageUrl: nuevaEcijaLogo,
  stats: {
    corporate: 365,
    youth: 647,
    totalMembersAsOf: '2025',
  },
  pillars: [
    {
      key: 'community',
      label: 'Community Wellbeing',
      color: '#C41E3A',
      programs: [
        { bullets: [
          'Kanlungan sa Y',
          'Zumba Fitness Program',
          'Chess Clinic',
          'Local Academic Olympics',
          'Chess Summer Program Tournament',
          'Induction Ceremony'
        ] },
      ],
    },
    {
      key: 'work',
      label: 'Meaningful Work',
      color: '#C41E3A',
      programs: [
        { bullets: [
          'Partnership with DepEd Alternative Learning System',
          'Project Tinola',
          'Referral Pathway'
        ] },
      ],
    },
    {
      key: 'planet',
      label: 'Sustainable Planet',
      color: '#C41E3A',
      programs: [
        { bullets: [
          'Eco Hero Training',
          'Vertical Gardening',
          'Environment Forum (Koalisyong nga Maka-Kalikasang Novo Ecijanos - KOMANE)'
        ] },
      ],
    },
    {
      key: 'world',
      label: 'Just World',
      color: '#C41E3A',
      programs: [
        { bullets: [
          'Scholarship Program',
          'Kilos Kabataan Program'
        ] },
      ],
    },
  ],
},


pangasinan: {
  id: 'pangasinan',
  name: 'YMCA of Pangasinan',
  established: '1957',
  facebookUrl: 'https://www.facebook.com/p/YMCA-of-Pangasinan-Inc-100064847794128/',
  heroImageUrl: pangasinanHero,
  logoImageUrl: pangasinanLogo,
  stats: {
    corporate: 669,
    youth: 725,
    totalMembersAsOf: '2025',
  },
  pillars: [
    {
      key: 'community',
      label: 'Community Wellbeing',
      color: '#C41E3A',
      programs: [
        { bullets: [
          'Attendance on 3rd Quarter meeting ABSNET Pangasinan',
          'Flood Disaster Relief Operation',
          'Provision for Social Concern',
          'GS JCB Sponsorship Program'
        ] },
      ],
    },
    {
      key: 'work',
      label: 'Meaningful Work',
      color: '#C41E3A',
      programs: [
        { bullets: [
          'YMCA Staff Monthly Regular Meeting',
          'YMCA Preschool Teachers Association Officers',
          'YMCA Head Meetings',
          'YMCA Local Regular Board Meeting',
          'YMCA Standing Committee Meetings',
          'Attendance to NCM 2024',
          'Annual Corporate Meeting',
          'Kamustaha',
          'Attendance to National Collaboration Meeting'
        ] },
      ],
    },
    {
      key: 'planet',
      label: 'Sustainable Planet',
      color: '#C41E3A',
      programs: [
        { bullets: [
          'YMCA Waste Management',
          'YMCA Joins Brigada Eskwela 2025'
        ] },
      ],
    },
    {
      key: 'world',
      label: 'Just World',
      color: '#C41E3A',
      programs: [
        { bullets: [
          'In-Service and Team Planning',
          'REECE Trip',
          'Online Engagement with NTUMSPERBAYUOE 2025',
          'YMCA & YWCA National Youth Summit'
        ] },
      ],
    },
  ],
},

// MANILA BAY REGION YMCAs
makati : {
  id: 'makati',
  name: 'YMCA of Makati',
  established: '1971',
  facebookUrl: 'https://www.facebook.com/ymcamakati',
  heroImageUrl: makatiHero,
  logoImageUrl: makatiLogo,
  stats: {
    corporate: 298,
    nonCorporate: 1769,
    youth: 1735,
    totalMembersAsOf: '2025',
  },
  pillars: [
    {
      key: 'community',
      label: 'Community Wellbeing',
      color: '#C41E3A',
      programs: [
        { bullets: [
          'Uni Y Club of University of Makati',
          'Liturgical Bible Study (LBS)',
          'Angklung Ensemble'
        ] },
      ],
    },
    {
      key: 'work',
      label: 'Meaningful Work',
      color: '#C41E3A',
      programs: [
        { bullets: [
          'Makati YMCA Scholarship',
          'Y Speak',
        ] },
      ],
    },
    {
      key: 'planet',
      label: 'Sustainable Planet',
      color: '#C41E3A',
      programs: [
        { bullets: [
          'Tree Musketeers: Soldiers of the Trees',
          'Kalakalikasan 2.0 (ArtVocacy)',
          'YMCA OF MAKA',
          'Green YMCA, Green Community x Ecology Ministry',
          'Bokashi Composting'
        ] },
      ],
    },
    {
      key: 'world',
      label: 'Just World',
      color: '#C41E3A',
      programs: [
        { bullets: [
          'Gabay Aral',
          'Love Meals Program'
        ] },
      ],
    },
  ],
},

manila: {
    id: 'manila',
    name: 'YMCA of Manila',
    established: '1907',
    facebookUrl: 'https://www.facebook.com/YmcaOfManilaOfficial',
    heroImageUrl: manilaHero,
    logoImageUrl: manilaLogo,
    stats: {
      corporate: 737,
      nonCorporate: 2509,
      youth: 16932,
      others: 6265,
      totalMembersAsOf: '2025',
    },
    pillars: [
      {
        key: 'community',
        label: 'Community Wellbeing',
        color: '#C41E3A',
        programs: [
          { bullets: [
            'YMCA Academic Meet',
            'Youth Values Formation',
            '10th YMCA Fitness Camp of the Red Triangle Club',
            'Y-Kids Coloring, Spelling, Solo and Group Story Telling Contest',
            'HI-Y Sportsfest & College Y Sportsfest',
            '2025 Recollection and Thanksgiving Mass',
            'Summer Rural Workcamp',
            'Brigada Eskwela',
            'YMCA Friendly Swimming Competition',
            'Leptospirosis Health Campaign'
          ] },
        ],
      },
      {
        key: 'work',
        label: 'Meaningful Work',
        color: '#C41E3A',
        programs: [
          { bullets: [
            'Blood Donation Drive',
            'Basketball Y Camp',
            '1st Women\'s Basketball Tournament',
            'Livelihood Program "Dishwashing and Perfume Making"',
            'Reproductive Health Seminar',
            'Seminar on SOGIESC'
          ] },
        ],
      },
      {
        key: 'planet',
        label: 'Sustainable Planet',
        color: '#C41E3A',
        programs: [
          { bullets: [
            'Tree Growing Activity (Earth Day)',
            'A Seminar and Workshop on Carbon Footprint Auditing',
            'Exposure at Don Bosco School of Theology Environmental Programs'
          ] },
        ],
      },
      {
        key: 'world',
        label: 'Just World',
        color: '#C41E3A',
        programs: [
          { bullets: [
            'College Y Club Management Training',
            'Red Triangle Club (RTC) Joint Leadership Day Camp',
            'Hi-Y Club Management Training',
            'Club Advisers Training',
            '46th National Congress of College Students and the 26th YMCA Club Advisers',
            'Seminar Workshop',
            'Hi-Y Joint Leadership Camp for District',
            '32nd YMCA National Assembly of the High School students and 25th YMCA',
            'Y-Kids Club Cultural Talent Presentation "Philippine Festival"',
            'High School Club Adviser Seminar.',
            'College - Y Assembly and Induction of CSCY officers',
            '"Kabataang Pinuno Para sa Bayan, Para sa Pilipino Series 1,2,3 & 4'
          ] },
        ],
      },
    ],
},

manila_downtown : {
    id: 'manila_downtown',
    name: 'Manila Downtown YMCA',
    established: '1920',
    facebookUrl: 'https://www.facebook.com/mdymca/',
    heroImageUrl: manilaDowntownHero,
    logoImageUrl: manilaDowntownLogo,
    stats: {
      corporate: 900,
      nonCorporate: 2314,
      youth: 1089,
      totalMembersAsOf: '2025',
    },
    pillars: [
      {
        key: 'community',
        label: 'Community Wellbeing',
        color: '#C41E3A',
        programs: [
          { bullets: [
            'Humans Of YC', 
            'Emotion Drive: Aligning the Heart and Mind', 
            'I Got You',
            'Joker\'s House'
          ] },
        ],
      },
      {
        key: 'work',
        label: 'Meaningful Work',
        color: '#C41E3A',
        programs: [
          { bullets: [
            'Hosting & Photography: Snap 7 Snack',
            'Youth Club Protege Program',
            'Create-101'
          ] },
        ],
      },
      {
        key: 'planet',
        label: 'Sustainable Planet',
        color: '#C41E3A',
        programs: [
          { bullets: [
            'Tree Growing Activity (Earth Day)',
            'A Seminar and Workshop on Carbon Footprint Auditing',
            'Exposure at Don Bosco School of Theology Environmental Programs',
            'Youth Cares'

          ] },
        ],
      },
      {
        key: 'world',
        label: 'Just World',
        color: '#C41E3A',
        programs: [
          { bullets: [
            'Strand-Up for Cancers',
            'Know It All Challenge',
            'Youth Club Summer Camp',
            'General Assembly',
            'Youth Clubsports Fest',
            'Lai Kong Hokkien',
            'Bee A Spelling Champion',
            'Artbokasiya'
          ] },
        ],
      },

    ],
  },
  
  quezon_city : {
    id: 'quezon_city',
    name: 'YMCA of Quezon City',
    established: '1959',
    facebookUrl: 'https://www.facebook.com/p/YMCA-of-Quezon-City-Inc-100064587435993/',
    heroImageUrl: quezonCityHero,
    logoImageUrl: quezonCityLogo,
    stats: {
      corporate: 157,
      others: 164,
      youth: 1173,
      totalMembersAsOf: '2025',
    },
    pillars: [
      {
        key: 'work',
        label: 'Meaningful Work',
        color: '#C41E3A',
        programs: [
          { bullets: [
            '51st Annual Corporate Meeting & Election Of 15 Board of A Directors',
            'Annual Christmas Fellowship Program',
            '2025 Induction and Installation of The Officers and Members of the Board',
            '66th Anniversary Celebration Featuring: Teenage Singing Contests',
            'Organization Of the College-Y Club of Technological Institute of the Philippines (TIP), Quezon City Campus Induction Of Officer and Members of The Board of YMCA Women\'s Club Of QC',
            'Participation To the National Youth Assembly & 53rd National Council Meeting And 113rd YMCA Of the Philippines Anniversary Celebration',
            'Induction Of Officers & Members of The YMCA Women\'s Club of Quezon City.'
          ] },
        ],
      },
    ],
  },

// SOUTHERN LUZON REGION YMCAs
  albay : {
    id: 'albay',
    name: 'YMCA of Albay',
    established: '1953',
    facebookUrl: 'https://www.facebook.com/albay.ymca',
    heroImageUrl: albayHero,
    logoImageUrl: albayLogo,
    stats: {
      corporate: 102,
      others: 3,
      youth: 709,
      totalMembersAsOf: '2025',
    },
    pillars: [
      {
        key: 'community',
        label: 'Community Wellbeing',
        color: '#C41E3A',
        programs: [
          { bullets: [
            'Albay YMCA Board & Volunteers Christmas Fellowship',
            'Bukluran sa Kabuhayan Christmas Fellowship Program',
            '1st YMCA Overnight Summer Camp',
            '1st Albay YMCA Novice Swim Cup',
            'YMCA Leam to Swim',
            'YMCA Shotokan Karate',
            'YMCA Basketball Clinic'
          ] },
        ],
      },
      {
        key: 'work',
        label: 'Meaningful Work',
        color: '#C41E3A',
        programs: [
          { bullets: [
            'Training On Business Appreciation and Financial Literacy',
            'Leadership And Project Design Training',
            'National Youth Assembly',
            'Resource Mobilization Workshop of YMCA Clubs',
            'International Youth Day Membership Information Caravan of United',
            'Nations Association of The Philippines',
            'YMCA-YWCA Youth Summit',
            'Albay YMCA Labor Day Job Fair Services 2025',
            'Camp Counselor Training'
          ] },
        ],
      },
      {
        key: 'planet',
        label: 'Sustainable Planet',
        color: '#C41E3A',
        programs: [
          { bullets: [
            'Youth-Led Solutions Climate Action Global Summit',
            'National Green Team Meeting',
            'Relief Operation to Typhoon Affected Communities in Tiwi, Albay & Catanduanes',
            'Climate Auditors Workshop',
            'National Eco-Heroes Training'
          ] },
        ],
      },
      {
        key: 'world',
        label: 'Just World',
        color: '#C41E3A',
        programs: [
          { bullets: [
            'Youth Empowerment Seminar (YES)',
            'Christmas Party of BRHMC Pediatric Carnicer Patients',
            'Youth Empowerment Seminar (YES)',
            '1st YMCA Women\'s Basketball League'
          ] },
        ],
      },
    ],
  },

  los_banos : {
    id: 'los-banos',
    name: 'YMCA of Los Baños',
    established: '1923',
    facebookUrl: 'https://www.facebook.com/ymcalb/',
    heroImageUrl: losbanosHero,
    logoImageUrl: losbanosLogo,
    stats: {
      corporate: 118,
      others: 214,
      youth: 711,
      totalMembersAsOf: '2025',
    },
    pillars: [
      {
        key: 'community',
        label: 'Community Wellbeing',
        color: '#C41E3A',
        programs: [
          { bullets: [
            '1st YMCA Los Baños Open Chess Tournament',
            'Michael "Jako" Concio" Chess Clinic',
            'YMCA-LB\'s 2025 Academic Olympics with the theme "YMCA Inspiring Resilience with Hope in Today\'s World"'
          ] },
        ],
      },
      {
        key: 'work',
        label: 'Meaningful Work',
        color: '#C41E3A',
        programs: [
          { bullets: [
            'The YMCA-LB operates a dormitory which sustains its operation and current personnel',
            'The Scholar\'s Dormitory built at Lot 1 owned by YMCA-LB opens employment opportunities',
            'The YMCA-LB maintains commercial spaces for canteen operations w/c employs people',
            'YMCA-LB CSO Representation in the Municipal School Board Participation in the APD Mid-Year Conference'
          ] },
        ],
      },
      {
        key: 'planet',
        label: 'Sustainable Planet',
        color: '#C41E3A',
        programs: [
          { bullets: [
            'Waste Segregation Program',
            'Participation of YMCA-LB delegates in the 53rd National Council Mtg. and 113th Anniv.'
          ] },
        ],
      },
      {
        key: 'world',
        label: 'Just World',
        color: '#C41E3A',
        programs: [
          { bullets: [
            'Participation in the 409th Founding Anniv. And 23rd Bañamos Civic Parade',
            'Participation of YMCA-LB delegates in the 53rd National Council Mtg. and 113th Anniv. Celebration of YMCA Phils'
          ] },
        ],
      },
    ],
  },

  nueva_caceres: {
    id: 'nueva_caceres',
    name: 'YMCA of Nueva Caceres',
    established: '2014',
    facebookUrl: 'https://www.facebook.com/YMCACamarinesSur/',
    heroImageUrl: nuevaCaceresHero,
    logoImageUrl: nuevaCaceresLogo,
    stats: {
      corporate: 111,
      others: 1,
      youth: 69,
      totalMembersAsOf: '2025',
    },
    pillars: [
      {
        key: 'community',
        label: 'Community Wellbeing',
        color: '#C41E3A',
        programs: [
          { bullets: [
            'Albay YMCA 4 Day In-House Summer Camp - Camp Counselor',
            'KAAGAPAY: Arts and Poetry Workshop for Mental Wellness',
            'Typhoon Kristine Relief Operation',
            'YMCA Call for Donations',
            '44th Rizal Youth Leadership Training Institute (RYLTI)',
            'Y CARES: Balik Eskwela Donation Drive'
          ] },
        ],
      },
      {
        key: 'work',
        label: 'Meaningful Work',
        color: '#C41E3A',
        programs: [
          { bullets: [
            'HP Access-Project- Equipment Grantee',
            'Advancing Meaningful Work with WORLD YMCA - Attendance and Participation',
            'Regional Committee Meeting (Zoom)',
            'College Y Club Membership Drive',
            'YMCA CamSur Membership Drive',
            '53rd National Council Meeting Annual Corporate Meeting',
            '7th National Youth Assembly',
            'College Y Club Membership Drive'
          ] },
        ],
      },
      {
        key: 'planet',
        label: 'Sustainable Planet',
        color: '#C41E3A',
        programs: [
          { bullets: [
            'National Eco-Heroes Training',
            'YMCA Youth Led Solutions Global Summit with YMCA of USA'
          ] },
        ],
      },
      {
        key: 'world',
        label: 'Just World',
        color: '#C41E3A',
        programs: [
          { bullets: [
            'Youth Dialogue on the Christian identity of the 21st Century'
          ] },
        ],
      },
    ],
  },

  san_pablo : {
    id: 'san_pablo',
    name: 'YMCA of San Pablo',
    established: '1947',
    facebookUrl: 'https://www.facebook.com/YMCASanPablo',
    heroImageUrl: sanPabloHero,
    logoImageUrl: sanPabloLogo,
    stats: {
      corporate: 447,
      youth: 6040,
      others: 178,
      totalMembersAsOf: '2025',
    },
    pillars: [
      {
        key: 'community',
        label: 'Community Wellbeing',
        color: '#C41E3A',
        programs: [
          { bullets: [
            'YMCA Basketball Training Camp and League',
            'YMCA Special One on One/After School Basketball Training',
            'YMCA Basketball Club',
            'YMCA Basketball League',
            'YMCA Samurai Karatedo Club',
            'Taekwondo Chargers YMCA'
          ] },
        ],
      },
      {
        key: 'work',
        label: 'Meaningful Work',
        color: '#C41E3A',
        programs: [
          { bullets: [
            'Batang Y Volunteer Internship and Scholarship Program',
            'Adopt a Community Program',
            'Adopt a School Program'
          ] },
        ],
      },
      {
        key: 'planet',
        label: 'Sustainable Planet',
        color: '#C41E3A',
        programs: [
          { bullets: [
            'PIL sa Y Planting is Life in The Y',
            '10K Narra Tree Planting Challenge',
            'TREEP with a Green Talk',
            'Organization of YMCA-SCFA Young Green Minds "Future Great Eco Heroes"',
            'CARE for Climate Change Training',
            'National Eco Heroes Training',
            'YMCA Multi-Sports Green Court',
            'Happy Birthday Tree Planting',
            'Bayanihan Sagip Lawa',
            'Project HUGS (Hydroponics Urban Gardening in School)',

          ] },
        ],
      },
      {
        key: 'world',
        label: 'Just World',
        color: '#C41E3A',
        programs: [
          { bullets: ['Alternative Learning System (ALS)'] },
        ],
      },
    ],
  },

// VISAYAS REGION YMCAs
cebu : {
  id: 'cebu',
  name: 'YMCA of Cebu',
  established: '1926',
  facebookUrl: 'https://www.facebook.com/ymca.cebu.inc/',
  heroImageUrl: cebuHero,
  logoImageUrl: cebuLogo,
  stats: {
    corporate: 311,
    others: 4185,
    youth: 150,
    totalMembersAsOf: '2025',
  },
  pillars: [
    {
      key: 'community',
      label: 'Community Wellbeing',
      color: '#C41E3A',
      programs: [
        { bullets: [
          'LILY Feeding Program',
          'INTERNATIONAL PARTNERSHIP / PROGRAM & OTHER ACTIVITIES',
          'Workcamp (Rotary Club & YMCA of Honolulu, YMCA of Hiroshima & YMCA of Cebu)'
        ] },
      ],
    },
    {
      key: 'work',
      label: 'Meaningful Work',
      color: '#C41E3A',
      programs: [
        { bullets: [
          'Christmas Camping in the City',
          'Summer Learn to Swim',
          'Karate Lesson'
        ] },
      ],
    },
    {
      key: 'planet',
      label: 'Sustainable Planet',
      color: '#C41E3A',
      programs: [
        { bullets: ['Tree Planting'] },
      ],
    },
    {
      key: 'world',
      label: 'Just World',
      color: '#C41E3A',
      programs: [
        { bullets: ['PWD (Person with Disabilities) Swimming Lessons'] },
      ],
    },
  ],
},

leyte : {
  id: 'leyte',
  name: 'YMCA of Leyte',
  established: '1976',
  facebookUrl: 'https://www.facebook.com/ymcaofleyte',
  heroImageUrl: leyteHero,
  logoImageUrl: leyteLogo,
  stats: {
    corporate: 286,
    others: 70,
    youth: 193,
    totalMembersAsOf: '2025',
  },
  pillars: [
    {
      key: 'community',
      label: 'Community Wellbeing',
      color: '#C41E3A',
      programs: [
        { bullets: [
          'Rising Faster than Sea Levels: Focused Group Discussion',
          'Vibe and Thrive: Breaking the Ice and Building the Trust Activity'
        ] },
      ],
    },
    {
      key: 'work',
      label: 'Meaningful Work',
      color: '#C41E3A',
      programs: [
        { bullets: ['YMCA 21st Century Christian Identity Conversation'] },
      ],
    },
    {
      key: 'planet',
      label: 'Sustainable Planet',
      color: '#C41E3A',
      programs: [
        { bullets: [
          'APAY Climate Auditors\' Workshop',
          'Property Clean Up Drive'
        ] },
      ],
    },
    {
      key: 'world',
      label: 'Just World',
      color: '#C41E3A',
      programs: [
        { bullets: [
          'YMCA Outstanding Student Award 2025',
          'Brigada Eskwela/Pagbasa 2025',
          'YLeyte Membership Campaign',
          'YMCA Leyte Youth Council General Assembly'
        ] },
      ],
    },
  ],
},

negros_occidental : {
  id: 'negros_occidental',
  name: 'YMCA of Negros Occidental',
  established: '1972',
  facebookUrl: 'https://www.facebook.com/ymcanegrosoccidental/',
  heroImageUrl: negrosOccidentalHero,
  logoImageUrl: negrosOccidentalLogo,
  stats: {
    corporate: 182,
    others: 53,
    youth: 973,
    totalMembersAsOf: '2025',
  },
  pillars: [
    {
      key: 'community',
      label: 'Community Wellbeing',
      color: '#C41E3A',
      programs: [
        { bullets: [
          'YMCA Feeding Program',
          'YMCA Medical Mission'
        ] },
      ],
    },
    {
      key: 'work',
      label: 'Meaningful Work',
      color: '#C41E3A',
      programs: [
        { bullets: [
          'YMCA Raffle for a Cause',
          'YMCA Gift Giving'
        ] },
      ],
    },
    {
      key: 'planet',
      label: 'Sustainable Planet',
      color: '#C41E3A',
      programs: [
        { bullets: [
          'YMCA Clean-up Drive',
          'YMCA Trees for Life Project'
        ] },
      ],
    },
    {
      key: 'world',
      label: 'Just World',
      color: '#C41E3A',
      programs: [
        { bullets: [
          'YMCA Leadership Training',
          'First Aid: Safety Seminar'
        ] },
      ],
    },
  ],
},

negros_oriental : {
  id: 'negros_oriental',
  name: 'YMCA of Negros Oriental',
  established: '1968',
  facebookUrl: 'https://www.facebook.com/ymcadumaguete.negrosor/',
  heroImageUrl: negrosOrientalHero,
  logoImageUrl: negrosOrientalLogo,
  stats: {
    corporate: 901,
    youth: 320,
    totalMembersAsOf: '2025',
  },
  pillars: [
    {
      key: 'community',
      label: 'Community Wellbeing',
      color: '#C41E3A',
      programs: [
        { bullets: [
          '19th Provincial Children\'s Art Drawing Contest',
          '33rd Community Student Awards Program',
          '53rd Annual Corporate Members Assembly',
          'YMCA Membership Enrollment Campaign',
          'YMCA Day of Prayer for Peace & Family Fun Day'
        ] },
      ],
    },
    {
      key: 'work',
      label: 'Meaningful Work',
      color: '#C41E3A',
      programs: [
        { bullets: ['Christmas Camp for Under-privileged Children',
          '1st HS Student Council Leaders Conference'
        ] },
      ],
    },
    {
      key: 'planet',
      label: 'Sustainable Planet',
      color: '#C41E3A',
      programs: [
        { bullets: ['18th Provincial Children\'s Art Drawing Contest International Coastal Clean-Up'] },
      ],
    },
    {
      key: 'world',
      label: 'Just World',
      color: '#C41E3A',
      programs: [
        { bullets: [
          'Monthly Ecumenical Bible Study Sharing & Reflection',
          'Monthly Meeting of Youth Volunteer Leaders Corp',
          'Organization of the YMCA Leaders Corp'
        ] },
      ],
    },
  ],
},


// MINDANAO REGION YMCAs
'cagayan_de_oro': {
  id: 'cagayan_de_oro',
  name: 'YMCA Cagayan de Oro',
  established: '1987',
  facebookUrl: 'https://www.facebook.com/cagayandeoroymca',
  heroImageUrl: cagayanDeOroHero,
  logoImageUrl: cagayanDeOroLogo,
  stats: {
    corporate: 360,
    others: 15,
    youth: 7708,
    totalMembersAsOf: '2025',
  },
  pillars: [
    {
      key: 'community',
      label: 'Community Wellbeing',
      color: '#C41E3A',
      programs: [
        { bullets: [
          'International Youth Celebration',
          'Leadership Training and Workshop for Tagpangi National High School Leaders',
          'Kagay-An Civic Higalaay Parade',
          'Y\'ers Online Chickahan: Youth Program',
          'School Upplier Support to Indigenous Students at DIS',
          'Poster Making Contest (Youth)',
          'YMCA Basketball League',
          'YMCA Community Zumbathon',
          'National Academic Olympics',
          'Mural Art Contest',
          'YMCA Table Tennis Opening and Blessing',
          'YMCA/YWCA National Youth Summit',
          'PANAGTAGBO 2025'
        ] },
      ],
    },
    {
      key: 'work',
      label: 'Meaningful Work',
      color: '#C41E3A',
      programs: [
        { bullets: ['Dishwashing and perfume making'] },
      ],
    },
    {
      key: 'planet',
      label: 'Sustainable Planet',
      color: '#C41E3A',
      programs: [
        { bullets: [
          'Tree Growing at the YMCA Campsite with YMCA of Manila',
          'Waste Segregation Orientation and the Importance of Waste Management Seminar and Workshop at CDO NHS with YES-O',
          'Re-organization of Green Team Philippines',
          'Tree Growing Activity with the Metro Rotary Club of Cagayan de Oro',
          'City Attendance at the National Eco-Heroes Training',
          'YMCA Cagayan de Oro\'s Community Clean-Up Drive',
          'YMCA Tree Growing and Seminar on Environmental Action for a Sustainable Planet with CDO NHS Student Leaders on Arbor Day',
          'YMCA CDO and YMCA Davao Fruit-Bearing Tree Growing'
        ] },
      ],
    },
    {
      key: 'world',
      label: 'Just World',
      color: '#C41E3A',
      programs: [
        { bullets: [
          'Indigenous Schools Brigada Eskwela Attendance and Support',
          'Volunteer Expo 2024'
        ] },
      ],
    },
  ],
},

davao : {
  id: 'davao',
  name: 'YMCA of Davao',
  established: '1971',
  facebookUrl: 'https://www.facebook.com/ymcanegrosoccidental/',
  heroImageUrl: davaoHero,
  logoImageUrl: davaoLogo,
  stats: {
    corporate: 498,
    others: 106,
    youth: 1931,
    totalMembersAsOf: '2025',
  },
  pillars: [
    {
      key: 'community',
      label: 'Community Wellbeing',
      color: '#C41E3A',
      programs: [
        { bullets: [
          'Karate Program',
          'Members Fellowship 2025'
        ] },
      ],
    },
    {
      key: 'work',
      label: 'Meaningful Work',
      color: '#C41E3A',
      programs: [
        { bullets: [
          'Operation TULI',
          'DCAOSYD Collaboration and Partnership Uprise',
          'School Supplies Distribution for the 546 Pupils from Grade 1 To Grade 12 Of Carmen Integrated School: (SKWELAKALSADA)',
          'Medical And Dental Mission 2025 Induction of Officers',
          'Local Academic Olympic',
          'National Academic Olympics',
          '2nd National Collaboration Meeting for Local Presidents and General Secretaries',
          'Mid-Year Conference: Association of Professional Directors (APD)',
          'First Inter-School Christian Band Competition',
          'Building Development',
          'Regular Board Meeting'
        ] },
      ],
    },
    {
      key: 'planet',
      label: 'Sustainable Planet',
      color: '#C41E3A',
      programs: [
        { bullets: [
          'Tree Planting',
          '1st YMCAS Mindanao Regional Committee Meeting 2025 - Tree Planting Activity',
          'Proper Waste Recycling'
        ] },
      ],
    },
    {
      key: 'world',
      label: 'Just World',
      color: '#C41E3A',
      programs: [
        { bullets: [
          'Training Of Trainers: Integrating Mental Health and Psychosocial Support into Peacebuilding', 
          'SKWELAKALSADA Caravan'
        ] },
      ],
    },
  ],
},








  // Other locals can be added here using the same interface.
  // If a local is missing, the LocalDetails page will show a simple fallback message.
};

export function getLocalById(id: string | undefined | null): LocalConfig | null {
  if (!id) return null;
  const direct = LOCALS_BY_ID[id];
  if (direct) return direct;
  const underscored = id.replace(/-/g, '_');
  return LOCALS_BY_ID[underscored] ?? null;
}

export function getLocalsAggregateStats(): {
  corporate: number;
  nonCorporate: number;
  youth: number;
  others: number;
  total: number;
} {
  let corporate = 0;
  let nonCorporate = 0;
  let youth = 0;
  let others = 0;
  for (const local of Object.values(LOCALS_BY_ID)) {
    const s = local.stats;
    if (!s) continue;
    corporate += s.corporate;
    nonCorporate += s.nonCorporate ?? 0;
    youth += s.youth;
    others += s.others ?? 0;
  }
  return {
    corporate,
    nonCorporate,
    youth,
    others,
    total: corporate + nonCorporate + youth + others,
  };
}

export function getDefaultPillars(): LocalPillar[] {
  // return a fresh copy so callers can safely merge/override
  return DEFAULT_PILLARS.map((p) => ({ ...p, programs: [...p.programs] }));
}

