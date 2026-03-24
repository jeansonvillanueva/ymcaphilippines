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
const placeholderLogo = new URL('../assets/images/logo.webp', import.meta.url).href;

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

const ormocHero = placeholderHero;
const ormocLogo = placeholderLogo;


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
        { bullets: ['Dishwashing and perfume making'] },
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
        { bullets: ['Dishwashing and perfume making'] },
      ],
    },
    {
      key: 'world',
      label: 'Just World',
      color: '#C41E3A',
      programs: [
        { bullets: ['Dishwashing and perfume making'] },
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
        { bullets: ['Dishwashing and perfume making'] },
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
        { bullets: ['Dishwashing and perfume making'] },
      ],
    },
    {
      key: 'world',
      label: 'Just World',
      color: '#C41E3A',
      programs: [
        { bullets: ['Dishwashing and perfume making'] },
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
        { bullets: ['Dishwashing and perfume making'] },
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
        { bullets: ['Dishwashing and perfume making'] },
      ],
    },
    {
      key: 'world',
      label: 'Just World',
      color: '#C41E3A',
      programs: [
        { bullets: ['Dishwashing and perfume making'] },
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
        { bullets: ['Dishwashing and perfume making'] },
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
        { bullets: ['Dishwashing and perfume making'] },
      ],
    },
    {
      key: 'world',
      label: 'Just World',
      color: '#C41E3A',
      programs: [
        { bullets: ['Dishwashing and perfume making'] },
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
          { bullets: ['Dishwashing and perfume making'] },
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
          { bullets: ['Dishwashing and perfume making'] },
        ],
      },
      {
        key: 'world',
        label: 'Just World',
        color: '#C41E3A',
        programs: [
          { bullets: ['Dishwashing and perfume making'] },
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
          { bullets: ['Dishwashing and perfume making'] },
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
          { bullets: ['Dishwashing and perfume making'] },
        ],
      },
      {
        key: 'world',
        label: 'Just World',
        color: '#C41E3A',
        programs: [
          { bullets: ['Dishwashing and perfume making'] },
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
        key: 'community',
        label: 'Community Wellbeing',
        color: '#C41E3A',
        programs: [
          { bullets: ['Dishwashing and perfume making'] },
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
          { bullets: ['Dishwashing and perfume making'] },
        ],
      },
      {
        key: 'world',
        label: 'Just World',
        color: '#C41E3A',
        programs: [
          { bullets: ['Dishwashing and perfume making'] },
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
          { bullets: ['Dishwashing and perfume making'] },
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
          { bullets: ['Dishwashing and perfume making'] },
        ],
      },
      {
        key: 'world',
        label: 'Just World',
        color: '#C41E3A',
        programs: [
          { bullets: ['Dishwashing and perfume making'] },
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
          { bullets: ['Dishwashing and perfume making'] },
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
          { bullets: ['Dishwashing and perfume making'] },
        ],
      },
      {
        key: 'world',
        label: 'Just World',
        color: '#C41E3A',
        programs: [
          { bullets: ['Dishwashing and perfume making'] },
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
          { bullets: ['Dishwashing and perfume making'] },
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
          { bullets: ['Dishwashing and perfume making'] },
        ],
      },
      {
        key: 'world',
        label: 'Just World',
        color: '#C41E3A',
        programs: [
          { bullets: ['Dishwashing and perfume making'] },
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
          { bullets: ['Dishwashing and perfume making'] },
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
          { bullets: ['Dishwashing and perfume making'] },
        ],
      },
      {
        key: 'world',
        label: 'Just World',
        color: '#C41E3A',
        programs: [
          { bullets: ['Dishwashing and perfume making'] },
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
        { bullets: ['Dishwashing and perfume making'] },
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
        { bullets: ['Dishwashing and perfume making'] },
      ],
    },
    {
      key: 'world',
      label: 'Just World',
      color: '#C41E3A',
      programs: [
        { bullets: ['Dishwashing and perfume making'] },
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
        { bullets: ['Dishwashing and perfume making'] },
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
        { bullets: ['Dishwashing and perfume making'] },
      ],
    },
    {
      key: 'world',
      label: 'Just World',
      color: '#C41E3A',
      programs: [
        { bullets: ['Dishwashing and perfume making'] },
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
        { bullets: ['Dishwashing and perfume making'] },
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
        { bullets: ['Dishwashing and perfume making'] },
      ],
    },
    {
      key: 'world',
      label: 'Just World',
      color: '#C41E3A',
      programs: [
        { bullets: ['Dishwashing and perfume making'] },
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
        { bullets: ['Dishwashing and perfume making'] },
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
        { bullets: ['Dishwashing and perfume making'] },
      ],
    },
    {
      key: 'world',
      label: 'Just World',
      color: '#C41E3A',
      programs: [
        { bullets: ['Dishwashing and perfume making'] },
      ],
    },
  ],
},

ormoc : {
  id: 'ormoc',
  name: 'City of Ormoc YMCA',
  established: '####',
  facebookUrl: 'https://www.facebook.com/ymca.ormocchapter/',
  heroImageUrl: ormocHero,
  logoImageUrl: ormocLogo,
  stats: {
    corporate: 0,
    youth: 0,
    totalMembersAsOf: '2025',
  },
  pillars: [
    {
      key: 'community',
      label: 'Community Wellbeing',
      color: '#C41E3A',
      programs: [
        { bullets: ['Dishwashing and perfume making'] },
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
        { bullets: ['Dishwashing and perfume making'] },
      ],
    },
    {
      key: 'world',
      label: 'Just World',
      color: '#C41E3A',
      programs: [
        { bullets: ['Dishwashing and perfume making'] },
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
        { bullets: ['Dishwashing and perfume making'] },
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
        { bullets: ['Dishwashing and perfume making'] },
      ],
    },
    {
      key: 'world',
      label: 'Just World',
      color: '#C41E3A',
      programs: [
        { bullets: ['Dishwashing and perfume making'] },
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
        { bullets: ['Dishwashing and perfume making'] },
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
        { bullets: ['Dishwashing and perfume making'] },
      ],
    },
    {
      key: 'world',
      label: 'Just World',
      color: '#C41E3A',
      programs: [
        { bullets: ['Dishwashing and perfume making'] },
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

