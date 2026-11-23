import type {
  ExclusiveOption,
  FlavorItem,
  GratinOption,
  OrderRecord,
  PotatoConfig,
  SauceItem,
  SizeOption,
  StoreConfig,
  ToppingItem,
} from '../types';

export const HERO_DEFAULT_IMAGE = '/assets/aistudio/image_134c1d38.png';

export const GALLERY_IMAGES = [
  {
    id: 'img-1',
    href: 'https://ibb.co/s8nDY0Z',
    src: 'https://i.ibb.co/c40pnGj/c60bd02709ca19b2ca726d71bb4ef73c.jpg',
    alt: 'Batata recheada artesanal — foto 1',
  },
  {
    id: 'img-2',
    href: 'https://ibb.co/rGKJcZC4',
    src: 'https://i.ibb.co/svpr6F0y/65ef1c65f67fa59bd525ed567aa6cbc9.jpg',
    alt: 'Batata recheada artesanal — foto 2',
  },
  {
    id: 'img-3',
    href: 'https://ibb.co/GfQCkr8h',
    src: 'https://i.ibb.co/CpKVvSYr/2c4f5ff804e226af6fe03f200fe934fb.jpg',
    alt: 'Batata recheada artesanal — foto 3',
  },
  {
    id: 'img-4',
    href: 'https://ibb.co/pvbdNggV',
    src: 'https://i.ibb.co/rGFHqgg8/d1d0750540e59edb2d78a02669965f3d.jpg',
    alt: 'Batata recheada artesanal — foto 4',
  },
  {
    id: 'img-5',
    href: 'https://ibb.co/FkTztCQk',
    src: 'https://i.ibb.co/cKnQdVWK/6f35756e5d66044f0202e98cb1dd4065.jpg',
    alt: 'Batata recheada artesanal — foto 5',
  },
];

export const FLAVORS: FlavorItem[] = [
  {
    id: 'calabresa-queijo',
    name: 'Calabresa com Queijo',
    shortName: 'Calabresa c/ Queijo',
    subtitle: 'Calabresa selada · Catupiry ou Cheddar',
    description: '',
    basePrice: 33.9,
    weightLabel: '450g base',
    prepTime: '20 min',
    calories: '660 kcal',
    image: '/src/assets/images/batata_calabresa_queijo_1795372125480.jpg',
    highlights: [
      'Linguiça calabresa defumada selada na chapa',
      'Muçarela derretida e orégano fresco',
      'Acompanha Catupiry ou Cheddar cremoso',
    ],
  },
  {
    id: 'frango-desfiado',
    name: 'Frango Desfiado',
    shortName: 'Frango Desfiado',
    subtitle: 'Peito temperado · Catupiry ou Cheddar',
    description: '',
    basePrice: 32.9,
    weightLabel: '450g base',
    prepTime: '20 min',
    calories: '590 kcal',
    image: '/src/assets/images/batata_frango_desfiado_1795369202168.jpg',
    highlights: [
      'Frango desfiado em caldo de ervas',
      'Milho doce e orégano gratinado',
      'Acompanha Catupiry ou Cheddar cremoso',
    ],
  },
  {
    id: 'bacon-queijo',
    name: 'Bacon com Queijo',
    shortName: 'Bacon c/ Queijo',
    subtitle: 'Bacon crocante + queijo · Catupiry ou Cheddar',
    description: '',
    basePrice: 34.9,
    weightLabel: '450g base',
    prepTime: '22 min',
    calories: '680 kcal',
    image: '/src/assets/images/batata_bacon_crocante_1795369202046.jpg',
    highlights: [
      'Bacon suíno defumado em cubos crocantes',
      'Muçarela fatiada derretida e cebolinha',
      'Acompanha Catupiry ou Cheddar cremoso',
    ],
  },
  {
    id: 'strogonofe',
    name: 'Strogonoff de Frango ou Carne',
    shortName: 'Strogonoff',
    subtitle: 'Frango ou Carne · Catupiry ou Cheddar',
    description: '',
    basePrice: 36.9,
    weightLabel: '470g base',
    prepTime: '24 min',
    calories: '710 kcal',
    image: '/src/assets/images/batata_estrogonofe_1795369202261.jpg',
    hasProteinChoice: true,
    highlights: [
      'Escolha Strogonofe de Frango ou de Carne',
      'Molho cremoso com champignon e batata palha',
      'Acompanha Catupiry ou Cheddar cremoso',
    ],
  },
];

export const SIZES: SizeOption[] = [
  {
    id: 'media-450',
    name: 'Clássica 450g',
    weight: '450g',
    description: 'Porção individual generosa, assada inteira no forno.',
    extraPrice: 0,
  },
  {
    id: 'grande-650',
    name: 'Dupla da Casa 650g',
    weight: '650g',
    description: 'Batata selecionada extra grande com +40% de recheio.',
    extraPrice: 9,
  },
];

export const GRATINS: GratinOption[] = [
  {
    id: 'mucarela',
    name: 'Muçarela Gratinada & Orégano',
    description: 'Cobertura tradicional dourada no forno alto.',
    extraPrice: 0,
  },
  {
    id: 'borda-requeijao',
    name: 'Borda Dupla de Requeijão Cremoso',
    description: 'Fitas generosas nas laterais com centro de muçarela.',
    extraPrice: 4.5,
  },
  {
    id: 'quatro-queijos',
    name: 'Mix Quatro Queijos Artesanal',
    description: 'Muçarela, provolone, parmesão ralado e gorgonzola suave.',
    extraPrice: 6,
  },
];

export const DEFAULT_TOPPINGS: ToppingItem[] = [
  {
    id: 'extra-bacon',
    name: 'Cubos de Bacon',
    category: 'Proteínas',
    price: 5.5,
    detail: '50g defumado e crocante',
  },
  {
    id: 'frango-extra',
    name: 'Porção Frango',
    category: 'Proteínas',
    price: 5.5,
    detail: '60g desfiado no caldo',
  },
  {
    id: 'batata-palha',
    name: 'Batata Palha',
    category: 'Crocantes & Vegetais',
    price: 2.5,
    detail: 'Crocância enviada à parte',
  },
];

export const SAUCES: SauceItem[] = [
  {
    id: 'aioli-alho-assado',
    name: 'Aioli de Alho Assado & Ervas',
    intensity: 'Suave',
    description: 'Alho confitado lentamente com cebolinha e limão-siciliano.',
    price: 3.5,
  },
  {
    id: 'chipotle-defumado',
    name: 'Molho Chipotle Defumado',
    intensity: 'Picante médio',
    description: 'Pimenta chipotle defumada com toque adocicado de melado.',
    price: 3.5,
  },
  {
    id: 'pesto-manjericao',
    name: 'Pesto de Manjericão & Castanha',
    intensity: 'Aromático',
    description: 'Manjericão fresco, azeite extravirgem, parmesão e castanha-de-caju.',
    price: 4,
  },
  {
    id: 'gorgonzola-cremoso',
    name: 'Creme de Gorgonzola & Nozes',
    intensity: 'Intenso',
    description: 'Molho encorpado de queijo azul com leve toque de noz-moscada.',
    price: 4,
  },
  {
    id: 'mostarda-mel',
    name: 'Mostarda Dijon & Mel Silvestre',
    intensity: 'Agridoce',
    description: 'Equilíbrio entre acidez suave e doçura floral.',
    price: 3.5,
  },
  {
    id: 'ketchup-goiabada',
    name: 'Ketchup Rústico de Goiabada',
    intensity: 'Agridoce',
    description: 'Tomates assados com goiabada cascão e vinagre de maçã.',
    price: 3.5,
  },
];

export const EXCLUSIVES: ExclusiveOption[] = [
  {
    id: 'borda-vulcao-catupiry',
    name: 'Borda Vulcão de Catupiry Original',
    description:
      'Anel duplo de Catupiry legítimo aplicado no bico de confeitar ao redor de toda a marmita antes da gratinagem.',
    price: 7.5,
    tag: 'Mais pedida',
  },
  {
    id: 'crosta-macarico-parmesao',
    name: 'Crosta no Maçarico com Parmesão 12 Meses',
    description:
      'Finalização direta na chama com queijo parmesão curado ralado grosso para formar casquinha dourada.',
    price: 6,
    tag: 'Edição Chef',
  },
  {
    id: 'azeite-trufado-flor-sal',
    name: 'Azeite Trufado & Flor de Sal',
    description:
      'Fio generoso de azeite italiano de trufa branca e cristais de flor de sal de Mossoró.',
    price: 8.5,
    tag: 'Reserva Especial',
  },
  {
    id: 'combo-pao-alho-termica',
    name: 'Embalagem Térmica + Pão de Alho Cortesia',
    description:
      'Caixa térmica reforçada que mantém o calor por até 45 min acompanhada de 1 mini baguete de alho na brasa.',
    price: 5,
    tag: 'Para viagem',
  },
];

export const TIME_SLOTS = [
  'O mais rápido possível (35–45 min)',
  '12:00 – 12:30',
  '12:30 – 13:00',
  '18:30 – 19:00',
  '19:00 – 19:30',
  '19:30 – 20:00',
  '20:00 – 20:30',
  '20:30 – 21:00',
  '21:00 – 21:30',
];

export const STORE_CONFIG_STORAGE_KEY = 'bahtata_recheada_store_config_v1';

export const DEFAULT_STORE_CONFIG: StoreConfig = {
  whatsappNumber: '5554984161837',
  deliveryFee: 6.9,
  freeDeliveryThreshold: 70,
  flavorPrices: {
    'calabresa-queijo': 33.9,
    'frango-desfiado': 32.9,
    'bacon-queijo': 34.9,
    'strogonofe-frango': 36.9,
    'strogonofe-carne': 36.9,
  },
  creamyPrices: {
    catupiry: 0,
    cheddar: 0,
  },
  toppings: DEFAULT_TOPPINGS,
};

export const INITIAL_CONFIG: PotatoConfig = {
  flavorId: 'calabresa-queijo',
  creamyChoice: 'catupiry',
  strogonoffProtein: 'carne',
  sizeId: 'media-450',
  gratinId: 'mucarela',
  toppingIds: [],
  sauceIds: [],
  exclusiveIds: [],
  notes: '',
};

export const SEED_ORDERS: OrderRecord[] = [
  {
    id: '#BR-2041',
    createdAt: '19 Nov 2026 · 20:14',
    status: 'Entregue',
    items: [
      {
        uid: 'seed-1',
        quantity: 1,
        config: {
          flavorId: 'strogonofe',
          creamyChoice: 'catupiry',
          strogonoffProtein: 'carne',
          sizeId: 'media-450',
          gratinId: 'mucarela',
          toppingIds: ['batata-palha'],
          sauceIds: [],
          exclusiveIds: ['borda-vulcao-catupiry'],
          notes: 'Mandar batata palha bem embalada à parte.',
        },
        unitPrice: 46.9,
      },
    ],
    scheduling: {
      mode: 'delivery',
      dayLabel: 'Hoje',
      timeSlot: '20:30 – 21:00',
    },
    customer: {
      name: 'Camila Ferreira',
      phone: '(11) 98421-3309',
      street: 'Rua dos Pinheiros',
      number: '842',
      complement: 'Apto 64',
      neighborhood: 'Pinheiros',
    },
    paymentMethod: 'pix',
    subtotal: 46.9,
    deliveryFee: 6.9,
    total: 53.8,
  },
  {
    id: '#BR-1988',
    createdAt: '12 Nov 2026 · 12:40',
    status: 'Retirado',
    items: [
      {
        uid: 'seed-2a',
        quantity: 1,
        config: {
          flavorId: 'calabresa-queijo',
          creamyChoice: 'cheddar',
          strogonoffProtein: 'carne',
          sizeId: 'media-450',
          gratinId: 'mucarela',
          toppingIds: [],
          sauceIds: [],
          exclusiveIds: ['crosta-macarico-parmesao'],
          notes: '',
        },
        unitPrice: 39.9,
      },
      {
        uid: 'seed-2b',
        quantity: 1,
        config: {
          flavorId: 'bacon-queijo',
          creamyChoice: 'catupiry',
          strogonoffProtein: 'carne',
          sizeId: 'media-450',
          gratinId: 'mucarela',
          toppingIds: ['extra-bacon'],
          sauceIds: [],
          exclusiveIds: [],
          notes: 'Bastante orégano por cima.',
        },
        unitPrice: 40.4,
      },
    ],
    scheduling: {
      mode: 'pickup',
      dayLabel: 'Hoje',
      timeSlot: '12:30 – 13:00',
    },
    customer: {
      name: 'Camila Ferreira',
      phone: '(11) 98421-3309',
    },
    paymentMethod: 'card',
    subtotal: 80.3,
    deliveryFee: 0,
    total: 80.3,
  },
];
