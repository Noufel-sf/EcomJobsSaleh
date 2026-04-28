'use client';

import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';

export type Language = 'en' | 'fr' | 'ar';

type TopBarMessages = {
  shipping: string;
  about: string;
  contact: string;
  helpCenter: string;
};

type NavbarMessages = {
  logoPrefix: string;
  logoAccent: string;
  searchLabel: string;
  searchPlaceholder: string;
  searchResultsLabel: string;
  noProductsFound: string;
  aboutUs: string;
  helpCenter: string;
  categories: string;
  myAccount: string;
  logout: string;
  login: string;
  register: string;
  accountOptions: string;
  userMenu: string;
  cartLabel: string;
  cartItemsLabel: string;
  toggleTheme: string;
  light: string;
  dark: string;
  system: string;
  mobileAccountHint: string;
  mobileCreateAccountHint: string;
  mobileMenuLabel: string;
};

type FooterMessages = {
  tagline: string;
  quickLinks: string;
  products: string;
  jobs: string;
  categories: string;
  electronics: string;
  fashion: string;
  homeGarden: string;
  sports: string;
  support: string;
  contactUs: string;
  faqs: string;
  shippingInfo: string;
  returns: string;
  copyright: string;
  privacyPolicy: string;
  termsOfService: string;
};

type AboutMessages = {
  badge: string;
  heroTitlePrefix: string;
  heroTitleAccent: string;
  heroDescription: string;
  heroShopNow: string;
  missionBadge: string;
  missionTitle: string;
  missionParagraph1: string;
  missionParagraph2: string;
  missionPoints: [string, string];
  valuesTitle: string;
  valuesDescription: string;
  values: Array<{ title: string; description: string }>;
  ctaTitle: string;
  ctaDescription: string;
  ctaStartShopping: string;
  ctaHelpCenter: string;
};

type CartMessages = {
  continueShopping: string;
  shoppingCart: string;
  loading: string;
  cartCount: string;
  item: string;
  items: string;
  clearCart: string;
  cartEmptyTitle: string;
  cartEmptyDescription: string;
  startShopping: string;
  orderSummary: string;
  subtotal: string;
  shipping: string;
  free: string;
  tax: string;
  total: string;
  proceedToCompleteOrder: string;
  secureCheckout: string;
  itemRemoved: string;
  failedToUpdateCart: string;
  failedToRemoveItem: string;
  cartCleared: string;
  failedToClearCart: string;
  removeItem: string;
  remove: string;
  decreaseQuantity: string;
  increaseQuantity: string;
};

type CheckoutMessages = {
  cartEmptyTitle: string;
  cartEmptyDescription: string;
  continueShopping: string;
  backToCart: string;
  completeOrderTitle: string;
  completeOrderSubtitle: string;
  contactInformation: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  shippingDetails: string;
  city: string;
  state: string;
  selectState: string;
  orderNotes: string;
  orderNotesPlaceholder: string;
  processingOrder: string;
  placeOrder: string;
  placeOrderWithAmount: string;
  termsNotice: string;
  orderSummary: string;
  cartItems: string;
  quantityLabel: string;
  subtotalWithCount: string;
  shipping: string;
  free: string;
  total: string;
  secureCheckout: string;
  orderPlacedSuccess: string;
  orderFailed: string;
};

type UnauthorizedMessages = {
  title: string;
  description: string;
  loginHint: string;
  goBack: string;
  goHome: string;
  supportHint: string;
};

type TranslationMessages = {
  topBar: TopBarMessages;
  navbar: NavbarMessages;
  footer: FooterMessages;
  about: AboutMessages;
  cart: CartMessages;
  checkout: CheckoutMessages;
  unauthorized: UnauthorizedMessages;
};

type I18nContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  messages: TranslationMessages;
};

const STORAGE_KEY = 'saleh-language';

const translations: Record<Language, TranslationMessages> = {
  en: {
    topBar: {
      shipping: 'Chelghoom laid (mila)',
      about: 'About Us',
      contact: 'Contact',
      helpCenter: 'Help Center',
    },
    navbar: {
      logoPrefix: 'Shopping',
      logoAccent: 'Jobs',
      searchLabel: 'Search products',
      searchPlaceholder: 'Search products...',
      searchResultsLabel: 'Search results',
      noProductsFound: 'No products found',
      aboutUs: 'About Us',
      helpCenter: 'Help Center',
      categories: 'Categories',
      myAccount: 'My Account',
      logout: 'Logout',
      login: 'Login',
      register: 'Register',
      accountOptions: 'Account options',
      userMenu: 'User account menu',
      cartLabel: 'Shopping cart with {count} items',
      cartItemsLabel: '{count} items in cart',
      toggleTheme: 'Toggle theme',
      light: 'Light',
      dark: 'Dark',
      system: 'System',
      mobileAccountHint: 'Access your orders, wishlist, and more.',
      mobileCreateAccountHint: 'Create a new account to start shopping.',
      mobileMenuLabel: 'Toggle mobile menu',
    },
    footer: {
      tagline: 'Your trusted marketplace for quality products at great prices.',
      quickLinks: 'Quick Links',
      products: 'Products',
      jobs: 'Jobs',
      categories: 'Categories',
      electronics: 'Electronics',
      fashion: 'Fashion',
      homeGarden: 'Home & Garden',
      sports: 'Sports',
      support: 'Support',
      contactUs: 'Contact Us',
      faqs: 'FAQs',
      shippingInfo: 'Shipping Info',
      returns: 'Returns',
      copyright: 'All rights reserved.',
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service',
    },
    about: {
      badge: 'Est. 2026',
      heroTitlePrefix: 'Transforming Shopping in',
      heroTitleAccent: 'Algeria',
      heroDescription:
        "We're on a mission to make online shopping accessible, affordable, and delightful for everyone. From tech gadgets to home essentials, we bring quality products to your doorstep.",
      heroShopNow: 'Shop Now',
      missionBadge: 'Our Mission',
      missionTitle: 'Making Quality Products Accessible to Everyone',
      missionParagraph1:
        'We started with a simple question: Why should online shopping be complicated? In 2020, we set out to build a platform that combines the best products, competitive prices, and exceptional customer service.',
      missionParagraph2:
        "Today, we're proud to serve over 200,000 customers across all 48 wilayas in Algeria, delivering everything from electronics to fashion, all with a smile.",
      missionPoints: [
        'Free shipping on orders over 5,000 DA',
        '24/7 customer support in Arabic and French',
      ],
      valuesTitle: 'Our Core Values',
      valuesDescription:
        'These principles guide every decision we make and every product we deliver',
      values: [
        {
          title: 'Customer First',
          description:
            'Every decision we make starts with our customers. We listen, adapt, and deliver solutions that truly matter.',
        },
        {
          title: 'Innovation',
          description:
            'We embrace change and continuously push boundaries to create better shopping experiences.',
        },
        {
          title: 'Trust and Integrity',
          description:
            'Transparency and honesty guide our operations. We build lasting relationships through reliability.',
        },
        {
          title: 'Community',
          description:
            'We believe in giving back and supporting the communities that support us.',
        },
      ],
      ctaTitle: 'Join Our Growing Community',
      ctaDescription:
        "Get exclusive deals, early access to new products, and be part of Algeria's favorite shopping destination",
      ctaStartShopping: 'Start Shopping',
      ctaHelpCenter: 'Help Center',
    },
    cart: {
      continueShopping: 'Continue Shopping',
      shoppingCart: 'Shopping Cart',
      loading: 'Loading...',
      cartCount: '{count} {label} in your cart',
      item: 'item',
      items: 'items',
      clearCart: 'Clear Cart',
      cartEmptyTitle: 'Your cart is empty',
      cartEmptyDescription: "Looks like you haven't added anything to your cart yet",
      startShopping: 'Start Shopping',
      orderSummary: 'Order Summary',
      subtotal: 'Subtotal',
      shipping: 'Shipping',
      free: 'FREE',
      tax: 'Tax',
      total: 'Total',
      proceedToCompleteOrder: 'Proceed to Complete Order',
      secureCheckout: 'Secure checkout - Your data is protected',
      itemRemoved: 'Item removed from cart',
      failedToUpdateCart: 'Failed to update cart',
      failedToRemoveItem: 'Failed to remove item',
      cartCleared: 'Cart cleared',
      failedToClearCart: 'Failed to clear cart',
      removeItem: 'Remove item',
      remove: 'remove',
      decreaseQuantity: 'Decrease quantity',
      increaseQuantity: 'Increase quantity',
    },
    checkout: {
      cartEmptyTitle: 'Your cart is empty',
      cartEmptyDescription: 'Add items to your cart before checking out',
      continueShopping: 'Continue Shopping',
      backToCart: 'Back to Cart',
      completeOrderTitle: 'Complete Your Order',
      completeOrderSubtitle: 'Fill in your details to complete your purchase',
      contactInformation: 'Contact Information',
      firstName: 'First Name *',
      lastName: 'Last Name *',
      phoneNumber: 'Phone Number *',
      shippingDetails: 'Shipping Details',
      city: 'City *',
      state: 'State *',
      selectState: 'Select state',
      orderNotes: 'Order Notes (Optional)',
      orderNotesPlaceholder: 'Any special instructions for your order...',
      processingOrder: 'Processing Order...',
      placeOrder: 'Place Order',
      placeOrderWithAmount: 'Place Order - {amount} DZ',
      termsNotice:
        'By placing your order, you agree to our terms and conditions. Payment will be collected on delivery.',
      orderSummary: 'Order Summary',
      cartItems: 'Cart items',
      quantityLabel: 'Quantity: {count}',
      subtotalWithCount: 'Subtotal ({count} items)',
      shipping: 'Shipping',
      free: 'FREE',
      total: 'Total',
      secureCheckout: 'Secure checkout guaranteed',
      orderPlacedSuccess: 'Order placed successfully!',
      orderFailed: 'Order failed',
    },
    unauthorized: {
      title: 'Access Denied',
      description: "You don't have permission to access this page.",
      loginHint: 'Please log in with an authorized account',
      goBack: 'Go Back',
      goHome: 'Go Home',
      supportHint: 'If you believe this is an error, please contact support.',
    },
  },
  fr: {
    topBar: {
      shipping: 'chelghoom laid (mila)',
      about: 'A propos',
      contact: 'Contact',
      helpCenter: "Centre d'aide",
    },
    navbar: {
      logoPrefix: 'Shopping',
      logoAccent: 'Jobs',
      searchLabel: 'Rechercher des produits',
      searchPlaceholder: 'Rechercher des produits...',
      searchResultsLabel: 'Resultats de recherche',
      noProductsFound: 'Aucun produit trouve',
      aboutUs: 'A propos',
      helpCenter: "Centre d'aide",
      categories: 'Categories',
      myAccount: 'Mon compte',
      logout: 'Se deconnecter',
      login: 'Connexion',
      register: "S'inscrire",
      accountOptions: 'Options du compte',
      userMenu: 'Menu utilisateur',
      cartLabel: 'Panier avec {count} articles',
      cartItemsLabel: '{count} articles dans le panier',
      toggleTheme: 'Changer le theme',
      light: 'Clair',
      dark: 'Sombre',
      system: 'Systeme',
      mobileAccountHint: 'Accedez a vos commandes, favoris et plus.',
      mobileCreateAccountHint: 'Creez un compte pour commencer vos achats.',
      mobileMenuLabel: 'Afficher le menu mobile',
    },
    footer: {
      tagline: 'Votre place de marche de confiance pour des produits de qualite a bon prix.',
      quickLinks: 'Liens rapides',
      products: 'Produits',
      jobs: 'Emplois',
      categories: 'Categories',
      electronics: 'Electronique',
      fashion: 'Mode',
      homeGarden: 'Maison et jardin',
      sports: 'Sports',
      support: 'Support',
      contactUs: 'Nous contacter',
      faqs: 'FAQ',
      shippingInfo: 'Infos livraison',
      returns: 'Retours',
      copyright: 'Tous droits reserves.',
      privacyPolicy: 'Politique de confidentialite',
      termsOfService: "Conditions d'utilisation",
    },
    about: {
      badge: 'Depuis 2026',
      heroTitlePrefix: 'Transformer le shopping en',
      heroTitleAccent: 'Algerie',
      heroDescription:
        "Notre mission est de rendre les achats en ligne accessibles, abordables et agreables pour tous. Des gadgets tech aux essentiels de la maison, nous livrons des produits de qualite chez vous.",
      heroShopNow: 'Acheter maintenant',
      missionBadge: 'Notre mission',
      missionTitle: 'Rendre les produits de qualite accessibles a tous',
      missionParagraph1:
        "Nous avons commence avec une question simple: pourquoi l'achat en ligne devrait-il etre complique? En 2020, nous avons cree une plateforme qui combine les meilleurs produits, des prix competitifs et un service client exceptionnel.",
      missionParagraph2:
        "Aujourd'hui, nous sommes fiers de servir plus de 200 000 clients dans les 48 wilayas d'Algerie, en livrant de l'electronique a la mode, toujours avec le sourire.",
      missionPoints: [
        'Livraison gratuite pour les commandes de plus de 5 000 DA',
        'Support client 24h/24 et 7j/7 en arabe et en francais',
      ],
      valuesTitle: 'Nos valeurs fondamentales',
      valuesDescription:
        'Ces principes guident chaque decision et chaque produit que nous livrons',
      values: [
        {
          title: 'Le client avant tout',
          description:
            'Chaque decision commence par nos clients. Nous ecoutons, nous adaptons et nous livrons des solutions utiles.',
        },
        {
          title: 'Innovation',
          description:
            "Nous adoptons le changement et repoussons sans cesse les limites pour ameliorer l'experience d'achat.",
        },
        {
          title: 'Confiance et integrite',
          description:
            'La transparence et l-honnetete guident nos operations. Nous construisons des relations durables.',
        },
        {
          title: 'Communaute',
          description:
            'Nous croyons au soutien des communautes qui nous soutiennent.',
        },
      ],
      ctaTitle: 'Rejoignez notre communaute grandissante',
      ctaDescription:
        "Profitez d'offres exclusives, d'un acces anticipe aux nouveaux produits et faites partie de la destination shopping preferee en Algerie",
      ctaStartShopping: 'Commencer vos achats',
      ctaHelpCenter: "Centre d'aide",
    },
    cart: {
      continueShopping: 'Continuer vos achats',
      shoppingCart: 'Panier',
      loading: 'Chargement...',
      cartCount: '{count} {label} dans votre panier',
      item: 'article',
      items: 'articles',
      clearCart: 'Vider le panier',
      cartEmptyTitle: 'Votre panier est vide',
      cartEmptyDescription: "Vous n'avez encore rien ajoute au panier",
      startShopping: 'Commencer vos achats',
      orderSummary: 'Resume de commande',
      subtotal: 'Sous-total',
      shipping: 'Livraison',
      free: 'GRATUIT',
      tax: 'Taxe',
      total: 'Total',
      proceedToCompleteOrder: 'Passer a la finalisation',
      secureCheckout: 'Paiement securise - Vos donnees sont protegees',
      itemRemoved: 'Article retire du panier',
      failedToUpdateCart: 'Echec de mise a jour du panier',
      failedToRemoveItem: "Echec de suppression de l'article",
      cartCleared: 'Panier vide',
      failedToClearCart: 'Echec du vidage du panier',
      removeItem: "Retirer l'article",
      remove: 'retirer',
      decreaseQuantity: 'Diminuer la quantite',
      increaseQuantity: 'Augmenter la quantite',
    },
    checkout: {
      cartEmptyTitle: 'Votre panier est vide',
      cartEmptyDescription: 'Ajoutez des articles avant de finaliser votre commande',
      continueShopping: 'Continuer vos achats',
      backToCart: 'Retour au panier',
      completeOrderTitle: 'Finaliser votre commande',
      completeOrderSubtitle: 'Renseignez vos informations pour terminer votre achat',
      contactInformation: 'Informations de contact',
      firstName: 'Prenom *',
      lastName: 'Nom *',
      phoneNumber: 'Numero de telephone *',
      shippingDetails: 'Details de livraison',
      city: 'Ville *',
      state: 'Wilaya *',
      selectState: 'Selectionnez la wilaya',
      orderNotes: 'Notes de commande (Optionnel)',
      orderNotesPlaceholder: 'Instructions speciales pour votre commande...',
      processingOrder: 'Traitement de la commande...',
      placeOrder: 'Passer la commande',
      placeOrderWithAmount: 'Passer la commande - {amount} DZ',
      termsNotice:
        'En passant votre commande, vous acceptez nos conditions. Le paiement sera collecte a la livraison.',
      orderSummary: 'Resume de commande',
      cartItems: 'Articles du panier',
      quantityLabel: 'Quantite: {count}',
      subtotalWithCount: 'Sous-total ({count} articles)',
      shipping: 'Livraison',
      free: 'GRATUIT',
      total: 'Total',
      secureCheckout: 'Paiement securise garanti',
      orderPlacedSuccess: 'Commande validee avec succes !',
      orderFailed: 'Echec de la commande',
    },
    unauthorized: {
      title: 'Acces refuse',
      description: "Vous n'avez pas l'autorisation d'acceder a cette page.",
      loginHint: 'Veuillez vous connecter avec un compte autorise',
      goBack: 'Retour',
      goHome: 'Accueil',
      supportHint: "Si vous pensez qu'il s'agit d'une erreur, contactez le support.",
    },
  },
  ar: {
    topBar: {
      shipping: 'شلغوم لعيد (ميلا)',
      about: 'من نحن',
      contact: 'اتصل بنا',
      helpCenter: 'مركز المساعدة',
    },
    navbar: {
      logoPrefix: 'تسوق',
      logoAccent: 'جوبز',
      searchLabel: 'ابحث عن المنتجات',
      searchPlaceholder: 'ابحث عن المنتجات...',
      searchResultsLabel: 'نتائج البحث',
      noProductsFound: 'لم يتم العثور على منتجات',
      aboutUs: 'من نحن',
      helpCenter: 'مركز المساعدة',
      categories: 'الفئات',
      myAccount: 'حسابي',
      logout: 'تسجيل الخروج',
      login: 'تسجيل الدخول',
      register: 'انشاء حساب',
      accountOptions: 'خيارات الحساب',
      userMenu: 'قائمة حساب المستخدم',
      cartLabel: 'سلة التسوق تحتوي على {count} عناصر',
      cartItemsLabel: 'يوجد {count} عناصر في السلة',
      toggleTheme: 'تبديل المظهر',
      light: 'فاتح',
      dark: 'داكن',
      system: 'النظام',
      mobileAccountHint: 'الوصول إلى الطلبات والمفضلة والمزيد.',
      mobileCreateAccountHint: 'انشئ حسابا جديدا لبدء التسوق.',
      mobileMenuLabel: 'تبديل قائمة الهاتف',
    },
    footer: {
      tagline: 'متجرك الموثوق لمنتجات عالية الجودة وباسعار ممتازة.',
      quickLinks: 'روابط سريعة',
      products: 'المنتجات',
      jobs: 'الوظائف',
      categories: 'الفئات',
      electronics: 'إلكترونيات',
      fashion: 'الموضة',
      homeGarden: 'المنزل والحديقة',
      sports: 'الرياضة',
      support: 'الدعم',
      contactUs: 'اتصل بنا',
      faqs: 'الاسئلة الشائعة',
      shippingInfo: 'معلومات الشحن',
      returns: 'الارجاع',
      copyright: 'جميع الحقوق محفوظة.',
      privacyPolicy: 'سياسة الخصوصية',
      termsOfService: 'شروط الخدمة',
    },
    about: {
      badge: 'منذ 2026',
      heroTitlePrefix: 'نعيد تعريف التسوق في',
      heroTitleAccent: 'الجزائر',
      heroDescription:
        'مهمتنا هي جعل التسوق عبر الانترنت متاحا وميسورا وممتعا للجميع. من الاجهزة التقنية الى احتياجات المنزل، نوصل منتجات عالية الجودة إلى باب منزلك.',
      heroShopNow: 'تسوق الآن',
      missionBadge: 'مهمتنا',
      missionTitle: 'جعل المنتجات عالية الجودة متاحة للجميع',
      missionParagraph1:
        'بدانا بسؤال بسيط: لماذا يجب ان يكون التسوق عبر الانترنت معقدا؟ في 2020 انطلقنا لبناء منصة تجمع افضل المنتجات واسعار تنافسية وخدمة عملاء ممتازة.',
      missionParagraph2:
        'اليوم نفخر بخدمة اكثر من 200000 عميل في جميع ولايات الجزائر الـ 48، مع توصيل كل شيء من الالكترونيات الى الازياء.',
      missionPoints: [
        'شحن مجاني للطلبات التي تزيد عن 5000 دج',
        'دعم عملاء 24/7 بالعربية والفرنسية',
      ],
      valuesTitle: 'قيمنا الاساسية',
      valuesDescription: 'هذه المبادئ توجه كل قرار نتخذه وكل منتج نقدمه',
      values: [
        {
          title: 'العميل اولا',
          description: 'كل قرار نتخذه يبدأ من احتياجات عملائنا. نستمع ونتطور ونقدم حلولا فعالة.',
        },
        {
          title: 'الابتكار',
          description: 'نتبنى التغيير وندفع الحدود باستمرار لصناعة تجربة تسوق افضل.',
        },
        {
          title: 'الثقة والنزاهة',
          description: 'الشفافية والصدق اساس عملنا، ونبني علاقات طويلة المدى بالاعتمادية.',
        },
        {
          title: 'المجتمع',
          description: 'نؤمن برد الجميل ودعم المجتمعات التي تدعمنا.',
        },
      ],
      ctaTitle: 'انضم إلى مجتمعنا المتنامي',
      ctaDescription:
        'احصل على عروض حصرية ووصول مبكر للمنتجات الجديدة وكن جزءا من وجهة التسوق المفضلة في الجزائر',
      ctaStartShopping: 'ابدأ التسوق',
      ctaHelpCenter: 'مركز المساعدة',
    },
    cart: {
      continueShopping: 'متابعة التسوق',
      shoppingCart: 'سلة التسوق',
      loading: 'جار التحميل...',
      cartCount: 'لديك {count} {label} في السلة',
      item: 'عنصر',
      items: 'عناصر',
      clearCart: 'تفريغ السلة',
      cartEmptyTitle: 'سلتك فارغة',
      cartEmptyDescription: 'يبدو انك لم تضف اي منتج الى السلة بعد',
      startShopping: 'ابدأ التسوق',
      orderSummary: 'ملخص الطلب',
      subtotal: 'المجموع الفرعي',
      shipping: 'الشحن',
      free: 'مجاني',
      tax: 'الضريبة',
      total: 'المجموع',
      proceedToCompleteOrder: 'المتابعة لاتمام الطلب',
      secureCheckout: 'دفع آمن - بياناتك محمية',
      itemRemoved: 'تمت إزالة المنتج من السلة',
      failedToUpdateCart: 'فشل تحديث السلة',
      failedToRemoveItem: 'فشل حذف المنتج',
      cartCleared: 'تم تفريغ السلة',
      failedToClearCart: 'فشل تفريغ السلة',
      removeItem: 'إزالة المنتج',
      remove: 'إزالة',
      decreaseQuantity: 'تقليل الكمية',
      increaseQuantity: 'زيادة الكمية',
    },
    checkout: {
      cartEmptyTitle: 'سلتك فارغة',
      cartEmptyDescription: 'أضف منتجات إلى السلة قبل إتمام الطلب',
      continueShopping: 'متابعة التسوق',
      backToCart: 'العودة إلى السلة',
      completeOrderTitle: 'إتمام الطلب',
      completeOrderSubtitle: 'املأ بياناتك لإكمال عملية الشراء',
      contactInformation: 'معلومات التواصل',
      firstName: 'الاسم *',
      lastName: 'اللقب *',
      phoneNumber: 'رقم الهاتف *',
      shippingDetails: 'تفاصيل الشحن',
      city: 'المدينة *',
      state: 'الولاية *',
      selectState: 'اختر الولاية',
      orderNotes: 'ملاحظات الطلب (اختياري)',
      orderNotesPlaceholder: 'اي تعليمات خاصة بطلبك...',
      processingOrder: 'جار معالجة الطلب...',
      placeOrder: 'تأكيد الطلب',
      placeOrderWithAmount: 'تأكيد الطلب - {amount} دج',
      termsNotice: 'بإتمام الطلب، فإنك توافق على الشروط والأحكام. يتم الدفع عند الاستلام.',
      orderSummary: 'ملخص الطلب',
      cartItems: 'عناصر السلة',
      quantityLabel: 'الكمية: {count}',
      subtotalWithCount: 'المجموع الفرعي ({count} عناصر)',
      shipping: 'الشحن',
      free: 'مجاني',
      total: 'المجموع',
      secureCheckout: 'دفع آمن مضمون',
      orderPlacedSuccess: 'تم تأكيد الطلب بنجاح!',
      orderFailed: 'فشل تنفيذ الطلب',
    },
    unauthorized: {
      title: 'تم رفض الوصول',
      description: 'ليس لديك صلاحية الوصول إلى هذه الصفحة.',
      loginHint: 'يرجى تسجيل الدخول بحساب مصرح له',
      goBack: 'الرجوع',
      goHome: 'الصفحة الرئيسية',
      supportHint: 'إذا كنت تعتقد أن هذا خطأ، يرجى التواصل مع الدعم.',
    },
  },
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

function formatMessage(template: string, values?: Record<string, string | number>) {
  if (!values) {
    return template;
  }

  return Object.entries(values).reduce((output, [key, value]) => {
    return output.replaceAll(`{${key}}`, String(value));
  }, template);
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  const hasLoadedStoredLanguageRef = useRef(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Language | null;
    if (stored === 'en' || stored === 'fr' || stored === 'ar') {
      const timeoutId = window.setTimeout(() => {
        hasLoadedStoredLanguageRef.current = true;
        setLanguage(stored);
      }, 0);

      return () => {
        window.clearTimeout(timeoutId);
      };
    }

    hasLoadedStoredLanguageRef.current = true;
  }, []);

  useEffect(() => {
    if (!hasLoadedStoredLanguageRef.current) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, language);
    window.document.documentElement.lang = language;
    window.document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const messages = useMemo(() => translations[language], [language]);

  const value = useMemo<I18nContextValue>(
    () => ({
      language,
      setLanguage,
      messages,
    }),
    [language, messages],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }

  const t = (template: string, values?: Record<string, string | number>) => {
    return formatMessage(template, values);
  };

  return {
    ...context,
    t,
  };
}
