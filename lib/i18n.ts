export type Locale = "en" | "ar";

export const LOCALE_COOKIE = "md_locale";

const ar: Record<string, string> = {
  Products: "المنتجات",
  "Get Estimate": "اطلب عرض سعر",
  "Book a Visit": "احجز زيارة",
  About: "من نحن",
  FAQs: "الأسئلة",
  Blog: "المدونة",
  Partnerships: "الشراكات",
  "Get estimate": "اطلب عرض سعر",
  "Book a free visit": "احجز زيارة مجانية",
  "Browse collections": "تصفح المجموعات",
  "Open menu": "افتح القائمة",
  "Close menu": "أغلق القائمة",
  "Chat on WhatsApp": "تواصل عبر واتساب",
  WhatsApp: "واتساب",
  Explore: "استكشف",
  Visit: "زورونا",
  Contact: "تواصل",
  "Privacy Policy": "سياسة الخصوصية",
  "Terms of Use": "شروط الاستخدام",
  Accept: "قبول",
  Reject: "رفض",
  "We use essential cookies to run this site and optional analytics after you accept. Read our":
    "نستخدم ملفات تعريف ضرورية لتشغيل الموقع وتحليلات اختيارية بعد موافقتك. اقرأ",
  "privacy policy": "سياسة الخصوصية",
  "Dubai · Abu Dhabi · Trade programme": "دبي · أبوظبي · برنامج الشركاء",
  "Curtains and blinds that actually belong in a Gulf home.": "ستائر وبلاندز تليق فعلاً بمنزل خليجي.",
  "Made-to-measure drapes, sheers, rollers and silent motors. One complimentary visit, a written estimate, installation that respects your floors.":
    "ستائر مفصلة، شيفون، رولر ومحركات صامتة. زيارة مجانية، عرض سعر مكتوب، وتركيب يحترم أرضياتك.",
  "Free measuring visit": "زيارة قياس مجانية",
  "Consultants bring fabric books to your villa or apartment.": "يستحضر المستشارون عينات الأقمشة إلى فيلتك أو شقتك.",
  "12-month warranty": "ضمان 12 شهراً",
  "Workmanship cover on every install, plus motor manufacturer warranty.": "ضمان عمل على كل تركيب، إضافة إلى ضمان المحرك من الشركة المصنعة.",
  "UAE-ready fabrics": "أقمشة مناسبة للإمارات",
  "UV-stable weaves, blackout and sunscreen specified for Gulf glare.": "نسيج مقاوم للأشعة، تعتيم وحماية شمس مصممة لوهج الخليج.",
  "Same-week visit": "زيارة خلال الأسبوع",
  "Dubai and Abu Dhabi diaries typically open within 48 hours.": "مواعيد دبي وأبوظبي تتوفر عادة خلال 48 ساعة.",
  Collections: "المجموعات",
  "Window treatments for every elevation": "معالجات نوافذ لكل واجهة",
  "Curtains, blinds and motors specified for villas, apartments and commercial interiors.":
    "ستائر وبلاندز ومحركات محددة للفلل والشقق والمساحات التجارية.",
  Bestsellers: "الأكثر طلباً",
  "Pieces clients reorder": "قطع يعيد العملاء طلبها",
  Reviews: "آراء العملاء",
  "Homes we have dressed": "منازل ألبسناها أناقة",
  "Need a number before we visit?": "تحتاج سعراً قبل الزيارة؟",
  "Share room count, product type and budget. We reply the same working day.":
    "أرسل عدد الغرف ونوع المنتج والميزانية. نرد في نفس يوم العمل.",
  "Get an estimate": "احصل على عرض سعر",
  Partners: "الشركاء",
  "Studios and developers we supply": "استوديوهات ومطورون نورد لهم",
  "Before you book": "قبل أن تحجز",
  "Visits, lead times, motors and trade pricing — answered in plain language.":
    "الزيارات ومواعيد التسليم والمحركات وأسعار الشركاء — بلغة واضحة.",
  "Custom curtains and blinds across the UAE": "ستائر وبلاندز مفصلة في أنحاء الإمارات",
  "Maison Drape is a made-to-measure curtains and blinds atelier serving Dubai and Abu Dhabi. We specify pinch-pleat and S-wave drapes, zebra and sunscreen rollers, roman shades and silent motorised tracks for villas, apartments, hotels and offices. Every project starts with a free in-home measuring visit so blackout, UV and stack-back are designed around your actual glass — not a catalogue sketch.":
    "ميزون دريب مشغل ستائر وبلاندز مفصل يخدم دبي وأبوظبي. نحدد الستائر ذات الثنيات وموجة S، رولر زebra وواقي الشمس، الرومان والمسارات الآلية الصامتة للفلل والشقق والفنادق والمكاتب. كل مشروع يبدأ بزيارة قياس مجانية حتى يُصمم التعتيم والأشعة والتكدس حول زجاجك الحقيقي — لا رسم كتالوج.",
  "Looking for custom curtains in Dubai, heat-ready blinds in Abu Dhabi, or smart motorised window treatments? Book a visit or request an estimate. Interior designers can join our trade programme.":
    "تبحث عن ستائر مفصلة في دبي، بلاندز مقاومة للحرارة في أبوظبي، أو معالجات نوافذ ذكية؟ احجز زيارة أو اطلب عرض سعر. يمكن للمصممين الانضمام لبرنامج الشركاء.",
  English: "English",
  Arabic: "العربية",
  "Switch language": "تبديل اللغة",
  "All rights reserved.": "جميع الحقوق محفوظة.",
  "From AED": "من",
  Rated: "تقييم",
  from: "من",
  reviews: "مراجعة",
  Bestseller: "الأكثر طلباً",
  "View details": "عرض التفاصيل",
  From: "من",
  "Bespoke curtains, blinds and motorised window treatments across the UAE.":
    "ستائر وبلاندز ومعالجات نوافذ آلية مفصلة في أنحاء الإمارات.",
  "12-month workmanship warranty": "ضمان عمل لمدة 12 شهراً",
  "Floor-to-ceiling linen drapes in a bright Dubai living room": "ستائر كتان من الأرض للسقف في صالة مضيئة بدبي",
  "Previous testimonial": "الرأي السابق",
  "Next testimonial": "الرأي التالي",
};

export function translate(locale: Locale, value: string) {
  if (locale !== "ar") return value;
  return ar[value] || value;
}

export function localeDir(locale: Locale): "ltr" | "rtl" {
  return locale === "ar" ? "rtl" : "ltr";
}
