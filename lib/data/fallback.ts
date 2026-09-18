import type {
  BlogPost,
  Booking,
  Category,
  CmsPage,
  Faq,
  Lead,
  Partner,
  Product,
  ProductVariant,
  Testimonial,
} from "@/lib/types";

const img = (id: string, alt: string) => ({
  url: `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=80`,
  alt,
  thumbnailUrl: `https://images.unsplash.com/${id}?auto=format&fit=crop&w=400&q=80`,
});

export const categories: Category[] = [
  {
    id: "cat-curtains",
    name: "Curtains & Drapes",
    slug: "curtains-and-drapes",
    description:
      "Floor-to-ceiling drapes, sheer layers and blackout curtains tailored for villas, apartments and commercial interiors across Dubai and Abu Dhabi.",
    image_url: img("photo-1618221195710-dd6b41faaea6", "Ivory living room drapes").url,
    image_alt: "Ivory living room drapes in a Dubai villa",
    parent_id: null,
    sort_order: 1,
    seo_title: "Custom Curtains & Drapes in Dubai & Abu Dhabi | Maison Drape",
    seo_description:
      "Bespoke curtains and drapes with blackout linings, sheers and designer fabrics. Free in-home measuring in Dubai and Abu Dhabi.",
  },
  {
    id: "cat-blinds",
    name: "Blinds & Shades",
    slug: "blinds-and-shades",
    description:
      "Roller, zebra, roman and Venetian blinds engineered for UAE heat, glare control and effortless daily use.",
    image_url: img("photo-1560185007-cde436f6a4d0", "Modern roller blinds").url,
    image_alt: "Modern roller blinds in a bright apartment",
    parent_id: null,
    sort_order: 2,
    seo_title: "Blinds & Shades Dubai | Roller, Zebra, Roman | Maison Drape",
    seo_description:
      "Heat-ready roller, zebra, roman and Venetian blinds with blackout and sunscreen fabrics. Same-week installation across the UAE.",
  },
  {
    id: "cat-motorized",
    name: "Motorized",
    slug: "motorized",
    description:
      "Quiet motorised tracks and blinds with smart-home integration for Lutron, Control4, Apple Home and Google Home.",
    image_url: img("photo-1600607687939-ce8a6c25118c", "Motorized curtain track").url,
    image_alt: "Motorized curtain track in a luxury penthouse",
    parent_id: null,
    sort_order: 3,
    seo_title: "Motorized Curtains & Blinds UAE | Smart Home Ready",
    seo_description:
      "Silent motorised curtains and blinds with smart-home pairing. Professional installation in Dubai and Abu Dhabi.",
  },
];

const variants = (
  productId: string,
  prices: [string, number, string][]
): ProductVariant[] =>
  prices.map(([size_label, price, sku], i) => ({
    id: `${productId}-v${i + 1}`,
    product_id: productId,
    size_label,
    price,
    sku,
  }));

export const products: Product[] = [
  {
    id: "p-linen-drape",
    category_id: "cat-curtains",
    name: "Belgian Linen Pinch-Pleat Drape",
    slug: "belgian-linen-pinch-pleat-drape",
    description:
      "Full-bodied Belgian linen with a classic pinch pleat, cotton sateen lining and optional blackout interlining. Tailored to your exact drop, with hand-finished headings and weighted hems that fall cleanly in UAE villas.",
    base_price: 890,
    images: [
      img("photo-1618221195710-dd6b41faaea6", "Belgian linen pinch-pleat drapes in a living room"),
      img("photo-1618221195710-dd6b41faaea6", "Close-up of linen curtain fabric and heading"),
      img("photo-1600210492486-724fe5c67fb0", "Linen drapes framing a villa window"),
    ],
    fabric_options: ["Natural flax", "Sand", "Stone grey", "Ivory"],
    is_bestseller: true,
    is_active: true,
    seo_title: "Belgian Linen Pinch-Pleat Drapes Dubai | From AED 890",
    seo_description:
      "Custom Belgian linen pinch-pleat drapes with blackout lining. Free measuring visit in Dubai and Abu Dhabi.",
    created_at: "2026-01-12T00:00:00.000Z",
  },
  {
    id: "p-sheer-wave",
    category_id: "cat-curtains",
    name: "S-Wave Sheer Voile",
    slug: "s-wave-sheer-voile",
    description:
      "Soft S-fold sheers that diffuse Gulf sunlight without losing the view. Available in washable polyester voile or silk-blend, on discreet ceiling or wall tracks.",
    base_price: 420,
    images: [
      img("photo-1600210492493-0946911123ea", "Sheer voile curtains in a bright bedroom"),
      img("photo-1616594039964-ae9021a400a0", "Layered sheers and drapes"),
    ],
    fabric_options: ["Cloud white", "Warm ivory", "Pale taupe"],
    is_bestseller: true,
    is_active: true,
    seo_title: "S-Wave Sheer Curtains Dubai | Light-Filtering Voile",
    seo_description:
      "S-fold sheer voile curtains for villas and apartments. Pair with blackout drapes. From AED 420.",
    created_at: "2026-02-02T00:00:00.000Z",
  },
  {
    id: "p-blackout-triple",
    category_id: "cat-curtains",
    name: "Triple-Weave Blackout Drape",
    slug: "triple-weave-blackout-drape",
    description:
      "Hotel-grade triple-weave blackout that blocks heat and light for bedrooms, media rooms and nurseries. No bulky lining required, with a clean contemporary fall.",
    base_price: 560,
    images: [
      img("photo-1616046229478-9901c5536a45", "Blackout bedroom curtains"),
      img("photo-1505693416388-ac5ce068fe85", "Dark drapes in a modern bedroom"),
    ],
    fabric_options: ["Charcoal", "Navy", "Taupe", "Cream"],
    is_bestseller: false,
    is_active: true,
    seo_title: "Blackout Curtains Dubai | Triple-Weave Heat Control",
    seo_description:
      "Triple-weave blackout drapes for UAE bedrooms. Heat and glare control with a tailored finish. From AED 560.",
    created_at: "2026-03-08T00:00:00.000Z",
  },
  {
    id: "p-roller-sunscreen",
    category_id: "cat-blinds",
    name: "Solar Sunscreen Roller Blind",
    slug: "solar-sunscreen-roller-blind",
    description:
      "Openness-factor 5% sunscreen mesh that cuts glare and UV while keeping the skyline. Cassette or open-roll hardware, child-safe chain or motor.",
    base_price: 380,
    images: [
      img("photo-1560185007-cde436f6a4d0", "Sunscreen roller blinds in a living room"),
      img("photo-1600585154340-be6161a56a0c", "Floor-to-ceiling roller blinds"),
    ],
    fabric_options: ["Pearl", "Greige", "Graphite"],
    is_bestseller: true,
    is_active: true,
    seo_title: "Sunscreen Roller Blinds Dubai | UV & Glare Control",
    seo_description:
      "Solar sunscreen roller blinds for UAE apartments and offices. UV protection with a view. From AED 380.",
    created_at: "2026-01-20T00:00:00.000Z",
  },
  {
    id: "p-zebra",
    category_id: "cat-blinds",
    name: "Dual-Layer Zebra Blind",
    slug: "dual-layer-zebra-blind",
    description:
      "Alternating sheer and opaque bands for instant privacy or daylight. Popular in kitchens, studies and rental apartments that need a polished, low-maintenance finish.",
    base_price: 340,
    images: [
      img("photo-1595526114035-0d45ed16cfbf", "Zebra blinds in a modern kitchen"),
      img("photo-1556912173-3bb406ef7e77", "Striped dual-layer window blinds"),
    ],
    fabric_options: ["White", "Beige", "Grey"],
    is_bestseller: true,
    is_active: true,
    seo_title: "Zebra Blinds Dubai | Dual-Layer Day & Night Shades",
    seo_description:
      "Dual-layer zebra blinds with day and night control. Fast installation in Dubai and Abu Dhabi. From AED 340.",
    created_at: "2026-02-18T00:00:00.000Z",
  },
  {
    id: "p-roman",
    category_id: "cat-blinds",
    name: "Soft-Fold Roman Shade",
    slug: "soft-fold-roman-shade",
    description:
      "Tailored roman shades with even, architectural folds. Choose linen, cotton or blackout interlining for bedrooms that need both softness and sleep quality.",
    base_price: 640,
    images: [
      img("photo-1615874959474-d453134d8ba8", "Roman shades in a bedroom"),
      img("photo-1618220179428-22790b461013", "Fabric roman blind close-up"),
    ],
    fabric_options: ["Linen oatmeal", "Cotton sage", "Velvet moss"],
    is_bestseller: false,
    is_active: true,
    seo_title: "Roman Shades Dubai | Soft-Fold Custom Fabric Blinds",
    seo_description:
      "Custom roman shades with blackout options. Soft folds, precise stacking. From AED 640 in the UAE.",
    created_at: "2026-04-01T00:00:00.000Z",
  },
  {
    id: "p-motor-track",
    category_id: "cat-motorized",
    name: "Silent Motorised Curtain Track",
    slug: "silent-motorised-curtain-track",
    description:
      "Ultra-quiet tubular motor on a curved or straight aluminium track. Pair with any Maison drape, control via wall switch, remote, or smart home.",
    base_price: 1450,
    images: [
      img("photo-1600607687939-ce8a6c25118c", "Motorized curtain track in a penthouse"),
      img("photo-1600566753190-17f0baa2a6c3", "Smart living room with automated drapes"),
    ],
    fabric_options: ["Works with all Maison fabrics"],
    is_bestseller: true,
    is_active: true,
    seo_title: "Motorized Curtain Tracks Dubai | Silent Smart Home",
    seo_description:
      "Silent motorised curtain tracks with smart-home integration. Professional fitting in Dubai and Abu Dhabi. From AED 1,450.",
    created_at: "2026-03-15T00:00:00.000Z",
  },
  {
    id: "p-motor-roller",
    category_id: "cat-motorized",
    name: "Battery Motor Roller Blind",
    slug: "battery-motor-roller-blind",
    description:
      "Wire-free rechargeable motor roller — ideal for finished apartments where chasing cables is not an option. Solar charging optional on south-facing glass.",
    base_price: 980,
    images: [
      img("photo-1600585154526-990dced4db0d", "Motorized roller blinds on large glass"),
      img("photo-1600607687644-c7171b42498b", "Automated blinds in a contemporary home"),
    ],
    fabric_options: ["Sunscreen 5%", "Blackout", "Dim-out"],
    is_bestseller: false,
    is_active: true,
    seo_title: "Battery Motor Roller Blinds UAE | Wire-Free Automation",
    seo_description:
      "Rechargeable motorised roller blinds without electrical chasing. Smart control. From AED 980.",
    created_at: "2026-04-12T00:00:00.000Z",
  },
];

export const productVariants: ProductVariant[] = [
  ...variants("p-linen-drape", [
    ["Standard drop to 280cm", 890, "MD-LIN-280"],
    ["Villa drop to 340cm", 1180, "MD-LIN-340"],
    ["Double-width panel", 1620, "MD-LIN-DW"],
  ]),
  ...variants("p-sheer-wave", [
    ["Per linear metre", 420, "MD-SHR-M"],
    ["Full-height villa drop", 560, "MD-SHR-V"],
  ]),
  ...variants("p-blackout-triple", [
    ["Single panel to 280cm", 560, "MD-BLK-280"],
    ["Pair to 340cm", 980, "MD-BLK-340"],
  ]),
  ...variants("p-roller-sunscreen", [
    ["Up to 150cm wide", 380, "MD-ROL-150"],
    ["Up to 250cm wide", 620, "MD-ROL-250"],
    ["Oversize cassette", 890, "MD-ROL-OS"],
  ]),
  ...variants("p-zebra", [
    ["Up to 140cm wide", 340, "MD-ZEB-140"],
    ["Up to 220cm wide", 520, "MD-ZEB-220"],
  ]),
  ...variants("p-roman", [
    ["Up to 120cm wide", 640, "MD-ROM-120"],
    ["Up to 180cm wide", 890, "MD-ROM-180"],
  ]),
  ...variants("p-motor-track", [
    ["Up to 3m track", 1450, "MD-MOT-3"],
    ["Up to 6m track", 2180, "MD-MOT-6"],
    ["Curved bay track", 2680, "MD-MOT-BAY"],
  ]),
  ...variants("p-motor-roller", [
    ["Standard motor", 980, "MD-BMR-STD"],
    ["Solar kit", 1280, "MD-BMR-SOL"],
  ]),
];

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    customer_name: "Layla Al Maktoum",
    rating: 5,
    review_text:
      "The team measured our Palm villa in a single visit and installed motorised linen drapes that actually stay quiet at night. Finish quality is hotel-level.",
    source: "Google",
    is_featured: true,
    created_at: "2026-05-02T00:00:00.000Z",
  },
  {
    id: "t2",
    customer_name: "James Whitaker",
    rating: 5,
    review_text:
      "We needed blackout for a Marina apartment nursery. Same-week visit, precise fit on tricky sliding doors, and they cleaned up every pin.",
    source: "Google",
    is_featured: true,
    created_at: "2026-06-11T00:00:00.000Z",
  },
  {
    id: "t3",
    customer_name: "Noura Hassan",
    rating: 5,
    review_text:
      "Trade pricing for our interior studio has been consistent, and the S-wave sheers photograph beautifully for client presentations.",
    source: "Houzz",
    is_featured: true,
    created_at: "2026-07-19T00:00:00.000Z",
  },
  {
    id: "t4",
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
  { id: "pt1", name: "Emaar Interiors", logo_url: "", logo_alt: "Emaar Interiors partner logo", sort_order: 1 },
  { id: "pt2", name: "Aldar Living", logo_url: "", logo_alt: "Aldar Living partner logo", sort_order: 2 },
  { id: "pt3", name: "Lutron UAE", logo_url: "", logo_alt: "Lutron UAE partner logo", sort_order: 3 },
  { id: "pt4", name: "Control4 Gulf", logo_url: "", logo_alt: "Control4 Gulf partner logo", sort_order: 4 },
  { id: "pt5", name: "Design District Studios", logo_url: "", logo_alt: "Design District Studios partner logo", sort_order: 5 },
];

export const faqs: Faq[] = [
  {
    id: "f1",
    question: "Do you offer a free in-home measuring visit?",
    answer:
      "Yes. We offer a complimentary measuring visit across Dubai and Abu Dhabi. A consultant brings fabric books, discusses blackout and motorisation, and leaves you with a written estimate.",
    category: "visits",
    sort_order: 1,
  },
  {
    id: "f2",
    question: "How long does made-to-measure take?",
    answer:
      "Standard curtains and blinds are typically 7–12 working days after fabric confirmation. Motorised tracks and imported designer textiles can take 14–21 days. We confirm lead times on every quote.",
    category: "orders",
    sort_order: 2,
  },
  {
    id: "f3",
    question: "Are your fabrics suitable for UAE heat and sun?",
    answer:
      "We specify UV-stable weaves, sunscreen meshes and blackout interlinings tested for Gulf glare. South and west elevations are always quoted with heat-control options.",
    category: "products",
    sort_order: 3,
  },
  {
    id: "f4",
    question: "Can you integrate with existing smart home systems?",
    answer:
      "Yes. Our motors pair with Lutron, Control4, Apple Home, Google Home and most RF remotes. We coordinate with your systems integrator when needed.",
    category: "motorized",
    sort_order: 4,
  },
  {
    id: "f5",
    question: "What warranty do you provide?",
    answer:
      "Every installation includes a 12-month workmanship warranty. Motors carry the manufacturer warranty of 3–5 years depending on the range.",
    category: "orders",
    sort_order: 5,
  },
  {
    id: "f6",
    question: "Do you work with interior designers and developers?",
    answer:
      "Yes. Our trade programme offers project pricing, sample libraries and dedicated account support. Apply on the Partnerships page.",
    category: "trade",
    sort_order: 6,
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: "b1",
    title: "How to choose blackout curtains for Dubai bedrooms",
    slug: "blackout-curtains-dubai-bedrooms",
    excerpt:
      "Not all blackout is equal in 45-degree summers. Here is how lining, weave and track type change sleep quality in UAE apartments.",
    content: `<p>Dubai bedrooms fight two problems at once: late sunsets over west-facing glass and HVAC that works harder when fabric cannot stop radiant heat. A cheap coated lining often cracks within a season. A triple-weave or a proper interlined drape does not.</p>
<p>Start with the window. Sliding doors need a full wrap-around or a ceiling track that overshoots the frame by at least 20cm each side so morning light cannot leak. For nurseries, specify a 100% dim-out and a silent motor so night feeds do not rattle the heading.</p>
<p>If you still want a dressed look by day, layer an S-wave sheer in front of the blackout. You keep the skyline, then close the drape when it is time to sleep. Maison Drape consultants bring both options on the free measuring visit.</p>`,
    cover_image_url: img("photo-1505693416388-ac5ce068fe85", "Bedroom with blackout drapes").url,
    cover_image_alt: "Bedroom with tailored blackout drapes in Dubai",
    author: "Maison Drape Studio",
    published_at: "2026-06-04T00:00:00.000Z",
    seo_title: "Blackout Curtains for Dubai Bedrooms | Buying Guide",
    seo_description:
      "Choose the right blackout curtains for UAE heat, glare and sliding doors. Lining types, tracks and motorisation explained.",
  },
  {
    id: "b2",
    title: "Sunscreen vs blackout roller blinds for Abu Dhabi glass",
    slug: "sunscreen-vs-blackout-roller-blinds",
    excerpt:
      "A practical comparison of openness factors, UV ratings and when to specify a dual-blind cassette on Corniche apartments.",
    content: `<p>Floor-to-ceiling glass is beautiful until 3pm. Sunscreen mesh with a 5% openness cuts glare while keeping the water view. Blackout rollers are better for media rooms and guest suites that must go dark on demand.</p>
<p>Many Abu Dhabi apartments now take a dual cassette: sunscreen by day, blackout by night, one elegant fascia. Battery motors avoid chasing cables in a finished unit.</p>
<p>We measure reveal depths carefully — shallow aluminium frames need a face-fix cassette or the fabric will scrub the handle. Book a visit and we will show both fabrics against your actual glass.</p>`,
    cover_image_url: img("photo-1600585154340-be6161a56a0c", "Roller blinds on large windows").url,
    cover_image_alt: "Sunscreen roller blinds on large apartment glass",
    author: "Maison Drape Studio",
    published_at: "2026-07-16T00:00:00.000Z",
    seo_title: "Sunscreen vs Blackout Roller Blinds in Abu Dhabi",
    seo_description:
      "Compare sunscreen and blackout roller blinds for UAE apartments. Dual cassettes, motors and fit notes for large glass.",
  },
  {
    id: "b3",
    title: "Motorised curtains: what interior designers specify in 2026",
    slug: "motorised-curtains-interior-designers-2026",
    excerpt:
      "Tracks, curves, smart-home protocols and the quiet motors that now ship as standard on villa projects.",
    content: `<p>Designers no longer treat motors as a luxury add-on. On 4m sliding stacks they are the only way a client will actually close the drape every evening. Specify a quiet motor, overlapping masters, and a track that can take a gentle curve around a bay.</p>
<p>Integration is simpler than it used to be. Dry-contact or RS485 into Control4, HomeKit bridges for Apple households, and RF remotes as a fallback for guests. We document scenes — sunset close, cinema blackout, cleaning open — so the hand-over is clean.</p>`,
    cover_image_url: img("photo-1600566753190-17f0baa2a6c3", "Automated drapes in a luxury living room").url,
    cover_image_alt: "Motorised drapes in a luxury living room",
    author: "Maison Drape Studio",
    published_at: "2026-08-21T00:00:00.000Z",
    seo_title: "Motorised Curtains for Interior Designers in the UAE",
    seo_description:
      "What to specify for motorised curtains in 2026: tracks, smart-home protocols and quiet motors for villa projects.",
  },
];

export const cmsPages: CmsPage[] = [
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    seo_title: "Privacy Policy | Maison Drape",
    seo_description: "How Maison Drape collects, stores and uses personal data from website visitors, leads and bookings.",
    content: `<p>Maison Drape ("we") collects contact details you submit on estimate and booking forms, plus technical cookies required to run this site. We use that information only to respond to your enquiry, schedule visits and improve our service.</p>
<p>We do not sell personal data. Analytics and marketing scripts load only after you accept cookies. You may reject non-essential cookies at any time via the banner.</p>
<p>To request access or deletion of your data, email hello@maisondrape.ae.</p>`,
  },
  {
    slug: "terms-of-use",
    title: "Terms of Use",
    seo_title: "Terms of Use | Maison Drape",
    seo_description: "Terms governing use of the Maison Drape website, estimates and booking requests.",
    content: `<p>Website content is provided for information. Product images and prices are indicative; a written estimate after measuring is the contractual offer.</p>
<p>Lead and booking submissions must contain accurate contact details. We may decline visits outside Dubai and Abu Dhabi service areas.</p>
<p>All original site copy, photographs and trademarks remain the property of Maison Drape.</p>`,
  },
];

export const leads: Lead[] = [
  {
    id: "l1",
    name: "Sara Ibrahim",
    phone: "+971 50 111 2233",
    email: "sara@example.com",
    product_interest: "curtains-and-drapes",
    budget_range: "aed-5k-15k",
    message: "Three bedrooms plus lounge, Palm Jumeirah.",
    source: "get-estimate",
    status: "new",
    created_at: "2026-09-10T10:00:00.000Z",
  },
  {
    id: "l2",
    name: "Daniel Cho",
    phone: "+971 55 222 8899",
    email: "daniel@example.com",
    product_interest: "motorized",
    budget_range: "aed-15k-plus",
    message: "Need Lutron integration for a Downtown penthouse.",
    source: "get-estimate",
    status: "contacted",
    created_at: "2026-09-12T08:30:00.000Z",
  },
];

export const bookings: Booking[] = [
  {
    id: "bk1",
    name: "Hessa Mansoor",
    phone: "+971 50 444 7788",
    email: "hessa@example.com",
    location: "Dubai",
    address: "Villa 12, Al Barsha 2",
    preferred_date: "2026-09-20",
    preferred_time_slot: "10:00–12:00",
    status: "confirmed",
    created_at: "2026-09-14T09:00:00.000Z",
  },
  {
    id: "bk2",
    name: "Peter Lang",
    phone: "+971 52 333 1100",
    email: "peter@example.com",
    location: "Abu Dhabi",
    address: "Al Reem Island, Tower 8, Apt 420",
    preferred_date: "2026-09-22",
    preferred_time_slot: "16:00–18:00",
    status: "new",
    created_at: "2026-09-15T14:20:00.000Z",
  },
];
