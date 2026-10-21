import type {
  BlogPost,
  Category,
  CmsPage,
  Faq,
  Partner,
  Product,
  ProductVariant,
  Testimonial,
} from "@/lib/types";

export const categories: Category[] = [
  {
    id: "eed6f449-6253-5989-bb7d-291a52721012",
    name: "Curtains & Drapes",
    slug: "curtains-and-drapes",
    description:
      "Floor-to-ceiling drapes, sheer layers and blackout curtains tailored for villas, apartments and commercial interiors across Dubai and Abu Dhabi.",
    image_url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80",
    image_alt: "Ivory living room drapes in a Dubai villa",
    parent_id: null,
    sort_order: 1,
    seo_title: "Custom Curtains & Drapes in Dubai & Abu Dhabi | Maison Drape",
    seo_description:
      "Bespoke curtains and drapes with blackout linings, sheers and designer fabrics. Free in-home measuring in Dubai and Abu Dhabi.",
    seo_keywords: "custom curtains Dubai, blackout drapes Dubai, sheer curtains UAE, pinch pleat curtains, S-wave drapes",
  },
  {
    id: "357b6c7b-fa42-5f49-abc2-68a1dcec5420",
    name: "Blinds & Shades",
    slug: "blinds-and-shades",
    description: "Roller, zebra, roman and Venetian blinds engineered for UAE heat, glare control and effortless daily use.",
    image_url: "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=1600&q=80",
    image_alt: "Modern roller blinds in a bright apartment",
    parent_id: null,
    sort_order: 2,
    seo_title: "Blinds & Shades Dubai | Roller, Zebra, Roman | Maison Drape",
    seo_description:
      "Heat-ready roller, zebra, roman and Venetian blinds with blackout and sunscreen fabrics. Same-week installation across the UAE.",
    seo_keywords: "roller blinds Dubai, zebra blinds UAE, roman shades Abu Dhabi, sunscreen blinds, blackout blinds Dubai",
  },
  {
    id: "5d2db8ee-97f8-5418-8b81-ff0082d646ab",
    name: "Motorized",
    slug: "motorized",
    description:
      "Quiet motorised tracks and blinds with smart-home integration for Lutron, Control4, Apple Home and Google Home.",
    image_url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80",
    image_alt: "Motorized curtain track in a luxury penthouse",
    parent_id: null,
    sort_order: 3,
    seo_title: "Motorized Curtains & Blinds UAE | Smart Home Ready",
    seo_description: "Silent motorised curtains and blinds with smart-home pairing. Professional installation in Dubai and Abu Dhabi.",
    seo_keywords: "motorized curtains Dubai, motorised tracks UAE, smart blinds Dubai, Lutron curtains, battery roller motors",
  },
];

export const products: Product[] = [
  {
    id: "6de7d6e6-1bdc-5054-8861-5dbb9900bae6",
    category_id: "eed6f449-6253-5989-bb7d-291a52721012",
    name: "Belgian Linen Pinch-Pleat Drape",
    slug: "belgian-linen-pinch-pleat-drape",
    description:
      "Full-bodied Belgian linen with a classic pinch pleat, cotton sateen lining and optional blackout interlining. Tailored to your exact drop.",
    base_price: 890,
    images: [
      {
        url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80",
        alt: "Belgian linen pinch-pleat drapes in a living room",
        thumbnailUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=400&q=80",
      },
    ],
    fabric_options: ["Natural flax", "Sand", "Stone grey", "Ivory"],
    faqs: [
      {
        question: "Is Belgian linen pinch-pleat made to measure?",
        answer: "Yes. Each drape is cut to your exact drop after a complimentary measuring visit, with cotton sateen lining and optional blackout interlining.",
      },
      {
        question: "Which colours are available?",
        answer: "Natural flax, sand, stone grey and ivory. Your consultant brings the full linen book so you can match existing interiors.",
      },
      {
        question: "How long does installation take?",
        answer: "Standard lead time is 7–12 working days after fabric confirmation. Villa drops to 340cm follow the same schedule.",
      },
    ],
    is_bestseller: true,
    is_active: true,
    seo_title: "Belgian Linen Pinch-Pleat Drapes Dubai | From AED 890",
    seo_description: "Custom Belgian linen pinch-pleat drapes with blackout lining. Free measuring visit in Dubai and Abu Dhabi.",
    seo_keywords: "Belgian linen curtains Dubai, pinch pleat drapes UAE, linen blackout curtains",
    created_at: "2026-01-12T00:00:00.000Z",
  },
  {
    id: "f2d60ffb-41b2-58aa-8ee0-05602af56f37",
    category_id: "eed6f449-6253-5989-bb7d-291a52721012",
    name: "S-Wave Sheer Voile",
    slug: "s-wave-sheer-voile",
    description: "Soft S-fold sheers that diffuse Gulf sunlight without losing the view. Available on discreet ceiling or wall tracks.",
    base_price: 420,
    images: [
      {
        url: "https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1600&q=80",
        alt: "Sheer voile curtains in a bright bedroom",
        thumbnailUrl: "https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=400&q=80",
      },
    ],
    fabric_options: ["Cloud white", "Warm ivory", "Pale taupe"],
    faqs: [
      {
        question: "Will S-wave sheers still keep the view?",
        answer: "Yes. The voile diffuses Gulf sunlight without blocking the skyline, and it sits on a discreet ceiling or wall track.",
      },
      {
        question: "Can I pair this with blackout drapes?",
        answer: "That is the usual specification: sheer S-wave in front, blackout behind, so bedrooms stay dark at night and dressed by day.",
      },
    ],
    is_bestseller: true,
    is_active: true,
    seo_title: "S-Wave Sheer Curtains Dubai | Light-Filtering Voile",
    seo_description: "S-fold sheer voile curtains for villas and apartments. Pair with blackout drapes. From AED 420.",
    seo_keywords: "sheer curtains Dubai, S-wave voile, light filtering curtains UAE",
    created_at: "2026-02-02T00:00:00.000Z",
  },
  {
    id: "345558bc-ba74-59a3-a778-17329e2fd59b",
    category_id: "eed6f449-6253-5989-bb7d-291a52721012",
    name: "Triple-Weave Blackout Drape",
    slug: "triple-weave-blackout-drape",
    description: "Hotel-grade triple-weave blackout that blocks heat and light for bedrooms, media rooms and nurseries.",
    base_price: 560,
    images: [
      {
        url: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1600&q=80",
        alt: "Blackout bedroom curtains",
        thumbnailUrl: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=400&q=80",
      },
    ],
    fabric_options: ["Charcoal", "Navy", "Taupe", "Cream"],
    faqs: [
      {
        question: "How dark is the triple-weave blackout?",
        answer: "Hotel-grade triple-weave blocks both light and radiant heat, so bedrooms, nurseries and media rooms can go fully dark without a separate lining.",
      },
      {
        question: "Does it help with UAE afternoon heat?",
        answer: "Yes. The dense weave cuts glare and heat on west and south elevations. We still recommend a 20cm overlap past the frame to stop edge leaks.",
      },
    ],
    is_bestseller: false,
    is_active: true,
    seo_title: "Blackout Curtains Dubai | Triple-Weave Heat Control",
    seo_description: "Triple-weave blackout drapes for UAE bedrooms. Heat and glare control with a tailored finish. From AED 560.",
    seo_keywords: "blackout curtains Dubai, bedroom blackout drapes, heat control curtains UAE",
    created_at: "2026-03-08T00:00:00.000Z",
  },
  {
    id: "88236b8c-7c9f-5874-8229-eafe2f20f6ff",
    category_id: "357b6c7b-fa42-5f49-abc2-68a1dcec5420",
    name: "Solar Sunscreen Roller Blind",
    slug: "solar-sunscreen-roller-blind",
    description: "Openness-factor 5% sunscreen mesh that cuts glare and UV while keeping the skyline. Cassette or open-roll hardware.",
    base_price: 380,
    images: [
      {
        url: "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=1600&q=80",
        alt: "Sunscreen roller blinds in a living room",
        thumbnailUrl: "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=400&q=80",
      },
    ],
    fabric_options: ["Pearl", "Greige", "Graphite"],
    faqs: [
      {
        question: "Does sunscreen mesh keep the skyline?",
        answer: "Yes. 5% openness cuts UV and glare while keeping the view. Cassette or open-roll hardware is specified to the window.",
      },
      {
        question: "Can I add a blackout layer later?",
        answer: "A dual cassette is the usual upgrade: sunscreen by day, blackout by night, one fascia. Ask on the measuring visit.",
      },
    ],
    is_bestseller: true,
    is_active: true,
    seo_title: "Sunscreen Roller Blinds Dubai | UV & Glare Control",
    seo_description: "Solar sunscreen roller blinds for UAE apartments and offices. UV protection with a view. From AED 380.",
    seo_keywords: "sunscreen roller blinds Dubai, UV blinds UAE, solar mesh blinds",
    created_at: "2026-01-20T00:00:00.000Z",
  },
  {
    id: "25ba0a5a-a8ac-51f7-94ba-cd554bdfab18",
    category_id: "357b6c7b-fa42-5f49-abc2-68a1dcec5420",
    name: "Dual-Layer Zebra Blind",
    slug: "dual-layer-zebra-blind",
    description: "Alternating sheer and opaque bands for instant privacy or daylight. Low-maintenance finish for kitchens and studies.",
    base_price: 340,
    images: [
      {
        url: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1600&q=80",
        alt: "Zebra blinds in a modern kitchen",
        thumbnailUrl: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=400&q=80",
      },
    ],
    fabric_options: ["White", "Beige", "Grey"],
    faqs: [
      {
        question: "How do zebra blinds control privacy?",
        answer: "Alternating sheer and opaque bands align to open for daylight or close for privacy, without raising the blind.",
      },
      {
        question: "Are they practical in kitchens?",
        answer: "Yes. The finish is low-maintenance and suited to kitchens and studies where you want fast day-to-night control.",
      },
    ],
    is_bestseller: true,
    is_active: true,
    seo_title: "Zebra Blinds Dubai | Dual-Layer Day & Night Shades",
    seo_description: "Dual-layer zebra blinds with day and night control. Fast installation in Dubai and Abu Dhabi. From AED 340.",
    seo_keywords: "zebra blinds Dubai, day night blinds UAE, dual layer shades",
    created_at: "2026-02-18T00:00:00.000Z",
  },
  {
    id: "22606548-d81e-5efa-aea6-f83e30338076",
    category_id: "357b6c7b-fa42-5f49-abc2-68a1dcec5420",
    name: "Soft-Fold Roman Shade",
    slug: "soft-fold-roman-shade",
    description: "Tailored roman shades with even, architectural folds. Choose linen, cotton or blackout interlining.",
    base_price: 640,
    images: [
      {
        url: "https://images.unsplash.com/photo-1615874959474-d453134d8ba8?auto=format&fit=crop&w=1600&q=80",
        alt: "Roman shades in a bedroom",
        thumbnailUrl: "https://images.unsplash.com/photo-1615874959474-d453134d8ba8?auto=format&fit=crop&w=400&q=80",
      },
    ],
    fabric_options: ["Linen oatmeal", "Cotton sage", "Velvet moss"],
    faqs: [
      {
        question: "Do roman shades stack neatly?",
        answer: "Yes. Soft-fold romans are tailored for even, architectural folds and a precise stack when raised.",
      },
      {
        question: "Can I specify blackout?",
        answer: "Choose linen, cotton or blackout interlining. We confirm the lining on the complimentary measuring visit.",
      },
    ],
    is_bestseller: false,
    is_active: true,
    seo_title: "Roman Shades Dubai | Soft-Fold Custom Fabric Blinds",
    seo_description: "Custom roman shades with blackout options. Soft folds, precise stacking. From AED 640 in the UAE.",
    seo_keywords: "roman shades Dubai, fabric roman blinds UAE, blackout roman shade",
    created_at: "2026-04-01T00:00:00.000Z",
  },
  {
    id: "f107b3b2-4097-5f24-8e05-37eef89bc39a",
    category_id: "5d2db8ee-97f8-5418-8b81-ff0082d646ab",
    name: "Silent Motorised Curtain Track",
    slug: "silent-motorised-curtain-track",
    description: "Ultra-quiet tubular motor on a curved or straight aluminium track. Control via wall switch, remote or smart home.",
    base_price: 1450,
    images: [
      {
        url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80",
        alt: "Motorized curtain track in a penthouse",
        thumbnailUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=400&q=80",
      },
    ],
    fabric_options: ["Works with all Maison fabrics"],
    faqs: [
      {
        question: "Which smart home systems does the silent track work with?",
        answer: "The motor pairs with Lutron, Control4, Apple Home, Google Home and most RF remotes. We commission it with your integrator when needed.",
      },
      {
        question: "How quiet is the motor at night?",
        answer: "It is a tubular motor on an aluminium track specified for bedrooms and penthouses. Clients typically report it stays unobtrusive after lights-out.",
      },
    ],
    is_bestseller: true,
    is_active: true,
    seo_title: "Motorized Curtain Tracks Dubai | Silent Smart Home",
    seo_description: "Silent motorised curtain tracks with smart-home integration. Professional fitting in Dubai and Abu Dhabi.",
    seo_keywords: "motorized curtain track Dubai, silent curtain motor UAE, smart home drapes",
    created_at: "2026-03-15T00:00:00.000Z",
  },
  {
    id: "b6ad8e49-92c1-5eeb-90d5-843c0748cf75",
    category_id: "5d2db8ee-97f8-5418-8b81-ff0082d646ab",
    name: "Battery Motor Roller Blind",
    slug: "battery-motor-roller-blind",
    description: "Wire-free rechargeable motor roller for finished apartments where chasing cables is not an option.",
    base_price: 980,
    images: [
      {
        url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80",
        alt: "Motorized roller blinds on large glass",
        thumbnailUrl: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=400&q=80",
      },
    ],
    fabric_options: ["Sunscreen 5%", "Blackout", "Dim-out"],
    faqs: [
      {
        question: "Do I need an electrician for battery motors?",
        answer: "No. The rechargeable motor is wire-free, which is why it suits finished apartments where chasing cables is not an option.",
      },
      {
        question: "How often do I charge it?",
        answer: "Typical use is months between charges. Your consultant will confirm battery size against window width and fabric weight.",
      },
    ],
    is_bestseller: false,
    is_active: true,
    seo_title: "Battery Motor Roller Blinds UAE | Wire-Free Automation",
    seo_description: "Rechargeable motorised roller blinds without electrical chasing. Smart control. From AED 980.",
    seo_keywords: "battery motor roller blinds Dubai, wire free blinds UAE, rechargeable roller motor",
    created_at: "2026-04-12T00:00:00.000Z",
  },
];

export const productVariants: ProductVariant[] = [
  { id: "51db15d1-6bde-596f-8d01-6945a0adddfb", product_id: "6de7d6e6-1bdc-5054-8861-5dbb9900bae6", size_label: "Standard drop to 280cm", price: 890, sku: "MD-LIN-280" },
  { id: "61ef7f80-9ef6-57e7-8394-e0ad5009ef51", product_id: "6de7d6e6-1bdc-5054-8861-5dbb9900bae6", size_label: "Villa drop to 340cm", price: 1180, sku: "MD-LIN-340" },
  { id: "6230f8a3-ebac-57f2-a933-295933830ab5", product_id: "f2d60ffb-41b2-58aa-8ee0-05602af56f37", size_label: "Per linear metre", price: 420, sku: "MD-SHR-M" },
  { id: "204f0c4b-041d-5791-a6d8-2bb2c6dff3b5", product_id: "345558bc-ba74-59a3-a778-17329e2fd59b", size_label: "Single panel to 280cm", price: 560, sku: "MD-BLK-280" },
  { id: "9ce21db6-2c1d-5817-b3ba-f4ace19b5bc7", product_id: "88236b8c-7c9f-5874-8229-eafe2f20f6ff", size_label: "Up to 150cm wide", price: 380, sku: "MD-ROL-150" },
  { id: "578097d8-8242-5737-a629-5539b0092908", product_id: "88236b8c-7c9f-5874-8229-eafe2f20f6ff", size_label: "Up to 250cm wide", price: 620, sku: "MD-ROL-250" },
  { id: "31295d3c-2640-55da-b7c9-c841ab14aee0", product_id: "25ba0a5a-a8ac-51f7-94ba-cd554bdfab18", size_label: "Up to 140cm wide", price: 340, sku: "MD-ZEB-140" },
  { id: "bfe29388-e90c-5206-b35a-17625e804e71", product_id: "22606548-d81e-5efa-aea6-f83e30338076", size_label: "Up to 120cm wide", price: 640, sku: "MD-ROM-120" },
  { id: "8ed5d804-d5a8-5a24-97fc-5c4ed5e0b1ae", product_id: "f107b3b2-4097-5f24-8e05-37eef89bc39a", size_label: "Up to 3m track", price: 1450, sku: "MD-MOT-3" },
  { id: "18dee9f5-e166-5de0-a6a4-81f6d158c0ba", product_id: "b6ad8e49-92c1-5eeb-90d5-843c0748cf75", size_label: "Standard motor", price: 980, sku: "MD-BMR-STD" },
];

export const testimonials: Testimonial[] = [
  {
    id: "6f2e8fe2-c714-5b71-bdb0-9e9704023906",
    customer_name: "Layla Al Maktoum",
    rating: 5,
    review_text:
      "The team measured our Palm villa in a single visit and installed motorised linen drapes that actually stay quiet at night. Finish quality is hotel-level.",
    source: "Google",
    is_featured: true,
    created_at: "2026-05-02T00:00:00.000Z",
  },
  {
    id: "1efdca17-324e-5071-b7af-0661070641fc",
    customer_name: "James Whitaker",
    rating: 5,
    review_text:
      "We needed blackout for a Marina apartment nursery. Same-week visit, precise fit on tricky sliding doors, and they cleaned up every pin.",
    source: "Google",
    is_featured: true,
    created_at: "2026-06-11T00:00:00.000Z",
  },
  {
    id: "1e064c11-fd9b-5318-9433-5720eca0fb1c",
    customer_name: "Noura Hassan",
    rating: 5,
    review_text:
      "Trade pricing for our interior studio has been consistent, and the S-wave sheers photograph beautifully for client presentations.",
    source: "Houzz",
    is_featured: true,
    created_at: "2026-07-19T00:00:00.000Z",
  },
  {
    id: "eb7bc3df-87cd-51dc-9194-06e07e504771",
    customer_name: "Omar Farouk",
    rating: 4,
    review_text:
      "Zebra blinds in the kitchen and sunscreen rollers in the living room. Good advice on fabrics that can handle Abu Dhabi afternoon sun.",
    source: "Google",
    is_featured: true,
    created_at: "2026-08-03T00:00:00.000Z",
  },
];

export const partners: Partner[] = [
  { id: "10ac7605-98bd-5076-911f-3ea83d8dadc3", name: "Emaar Interiors", logo_url: "", logo_alt: "Emaar Interiors partner logo", sort_order: 1 },
  { id: "bbeac5f1-9830-5cc5-b905-f465d702fe2d", name: "Aldar Living", logo_url: "", logo_alt: "Aldar Living partner logo", sort_order: 2 },
  { id: "efd7334f-f3e6-59ec-a003-b4f868652a2c", name: "Lutron UAE", logo_url: "", logo_alt: "Lutron UAE partner logo", sort_order: 3 },
  { id: "d71f6a0c-38de-5647-8491-9cb5e185bb8d", name: "Control4 Gulf", logo_url: "", logo_alt: "Control4 Gulf partner logo", sort_order: 4 },
];

export const faqs: Faq[] = [
  {
    id: "de70fafa-9ff8-5d49-830e-0f23e890c58f",
    question: "Do you offer a free in-home measuring visit?",
    answer:
      "Yes. We offer a complimentary measuring visit across Dubai and Abu Dhabi. A consultant brings fabric books, discusses blackout and motorisation, and leaves you with a written estimate.",
    category: "visits",
    sort_order: 1,
  },
  {
    id: "c0ba28e4-00bf-50bf-81e4-9089839865a5",
    question: "How long does made-to-measure take?",
    answer:
      "Standard curtains and blinds are typically 7–12 working days after fabric confirmation. Motorised tracks and imported designer textiles can take 14–21 days.",
    category: "orders",
    sort_order: 2,
  },
  {
    id: "5cd69860-08e0-559b-9f10-deeb007a6b38",
    question: "Are your fabrics suitable for UAE heat and sun?",
    answer:
      "We specify UV-stable weaves, sunscreen meshes and blackout interlinings tested for Gulf glare. South and west elevations are always quoted with heat-control options.",
    category: "products",
    sort_order: 3,
  },
  {
    id: "98546d60-9b6d-5db5-9401-fca529f12482",
    question: "Can you integrate with existing smart home systems?",
    answer:
      "Yes. Our motors pair with Lutron, Control4, Apple Home, Google Home and most RF remotes. We coordinate with your systems integrator when needed.",
    category: "motorized",
    sort_order: 4,
  },
  {
    id: "d7d545ce-e568-52a2-bb39-a474965330da",
    question: "What warranty do you provide?",
    answer: "Every installation includes a 12-month workmanship warranty. Motors carry the manufacturer warranty of 3–5 years depending on the range.",
    category: "orders",
    sort_order: 5,
  },
  {
    id: "26e4776c-b4aa-5577-b2a9-350e9c88987e",
    question: "Do you work with interior designers and developers?",
    answer: "Yes. Our trade programme offers project pricing, sample libraries and dedicated account support.",
    category: "trade",
    sort_order: 6,
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: "789e93f4-0952-51a4-a8ca-aca313aaad5f",
    title: "How to choose blackout curtains for Dubai bedrooms",
    slug: "blackout-curtains-dubai-bedrooms",
    excerpt: "Not all blackout is equal in 45-degree summers. Here is how lining, weave and track type change sleep quality in UAE apartments.",
    content:
      "<p>Dubai bedrooms fight two problems at once: late sunsets over west-facing glass and HVAC that works harder when fabric cannot stop radiant heat.</p><p>Start with the window. Sliding doors need a full wrap-around or a ceiling track that overshoots the frame by at least 20cm each side so morning light cannot leak.</p><p>If you still want a dressed look by day, layer an S-wave sheer in front of the blackout. Maison Drape consultants bring both options on the free measuring visit.</p>",
    cover_image_url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80",
    cover_image_alt: "Bedroom with tailored blackout drapes in Dubai",
    author: "Maison Drape Studio",
    published_at: "2026-06-04T00:00:00.000Z",
    seo_title: "Blackout Curtains for Dubai Bedrooms | Buying Guide",
    seo_description: "Choose the right blackout curtains for UAE heat, glare and sliding doors. Lining types, tracks and motorisation explained.",
    seo_keywords: "blackout curtains Dubai bedrooms, UAE heat curtains, bedroom blackout guide",
  },
  {
    id: "84bb6506-5ca8-505f-96e7-6a2c964dbb40",
    title: "Sunscreen vs blackout roller blinds for Abu Dhabi glass",
    slug: "sunscreen-vs-blackout-roller-blinds",
    excerpt: "A practical comparison of openness factors, UV ratings and when to specify a dual-blind cassette on Corniche apartments.",
    content:
      "<p>Floor-to-ceiling glass is beautiful until 3pm. Sunscreen mesh with a 5% openness cuts glare while keeping the water view. Blackout rollers are better for media rooms and guest suites that must go dark on demand.</p><p>Many Abu Dhabi apartments now take a dual cassette: sunscreen by day, blackout by night, one elegant fascia.</p>",
    cover_image_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
    cover_image_alt: "Sunscreen roller blinds on large apartment glass",
    author: "Maison Drape Studio",
    published_at: "2026-07-16T00:00:00.000Z",
    seo_title: "Sunscreen vs Blackout Roller Blinds in Abu Dhabi",
    seo_description: "Compare sunscreen and blackout roller blinds for UAE apartments. Dual cassettes, motors and fit notes for large glass.",
    seo_keywords: "sunscreen vs blackout blinds, Abu Dhabi roller blinds, dual cassette blinds UAE",
  },
];

export const cmsPages: CmsPage[] = [
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    content:
      "<p>We collect contact details you submit on estimate and booking forms, plus technical cookies required to run this site. We use that information only to respond to your enquiry, schedule visits and improve our service.</p><p>We do not sell personal data. Analytics and marketing scripts load only after you accept cookies.</p>",
    seo_title: "Privacy Policy | Maison Drape",
    seo_description: "How we collect, store and use personal data from website visitors, leads and bookings.",
  },
  {
    slug: "terms-of-use",
    title: "Terms of Use",
    content:
      "<p>Website content is provided for information. Product images and prices are indicative; a written estimate after measuring is the contractual offer.</p><p>Lead and booking submissions must contain accurate contact details.</p>",
    seo_title: "Terms of Use | Maison Drape",
    seo_description: "Terms governing use of the website, estimates and booking requests.",
  },
];

export const leads = [];
export const bookings = [];
