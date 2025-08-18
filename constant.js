// =========================
// QUIZ LOGIC & SCORING
// =========================
const quizLogic = {
  // Age range question
  ageRange: {
    0: {
      // 24 & Under
      wildExplorer: 2,
      hybridNomad: 2,
      creativeMaverick: 1,
      hedonist: 1,
    },
    1: {
      // 25 - 30
      socialButterfly: 2,
      creativeMaverick: 2,
      hybridNomad: 1,
      hedonist: 1,
    },
    2: {
      // 30 - 40
      culturalConnoisseur: 2,
      mindfulMinimalist: 2,
      luxeSeeker: 1,
      holisticRebalancer: 1,
    },
    3: {
      // 40 - 50
      soulfulNomad: 2,
      familyConnector: 2,
      academicAdventurer: 1,
      romanticEscapist: 1,
    },
    4: {
      // 50 - 60
      culturalConnoisseur: 2,
      holisticRebalancer: 2,
      luxeSeeker: 2,
      mindfulMinimalist: 1,
    },
    5: {
      // 60+
      soulfulNomad: 2,
      culturalConnoisseur: 2,
      comfortTraveler: 2,
      wildExplorer: -1,
    },
  },

  // Personality type question
  personalityType: {
    1: {
      // Introvert
      soulfulNomad: 3,
      mindfulMinimalist: 2,
      holisticRebalancer: 2,
      culturalConnoisseur: 1,
      socialButterfly: -2,
    },
    5: {
      // Ambivert
      creativeMaverick: 2,
      hybridNomad: 2,
      academicAdventurer: 1,
      familyConnector: 1,
    },
    10: {
      // Extravert
      socialButterfly: 3,
      hedonist: 2,
      creativeMaverick: 2,
      romanticEscapist: 1,
      soulfulNomad: -1,
    },
  },

  // Languages question (multiselect)
  languages: {
    english: { culturalConnoisseur: 1, hybridNomad: 1 },
    spanish: { creativeMaverick: 1, local: 1 },
    french: { luxeSeeker: 1, culturalConnoisseur: 1 },
    mandarin: { academicAdventurer: 1, mindfulMinimalist: 1 },
    japanese: { academicAdventurer: 2, culturalConnoisseur: 1 },
    arabic: { culturalConnoisseur: 1, soulfulNomad: 1 },
    portuguese: { creativeMaverick: 1, wildExplorer: 1 },
    italian: { romanticEscapist: 2, culturalConnoisseur: 1 },
    german: { mindfulMinimalist: 1, academicAdventurer: 1 },
    russian: { academicAdventurer: 1, culturalConnoisseur: 1 },
  },

  // Relationship status question
  relationshipStatus: {
    0: {
      // Single - Not Looking
      wildExplorer: 2,
      hybridNomad: 2,
      hedonist: 1,
      romanticEscapist: -2,
    },
    1: {
      // Single - Looking
      socialButterfly: 2,
      creativeMaverick: 1,
      hedonist: 1,
      romanticEscapist: 1,
    },
    2: {
      // In a relationship
      romanticEscapist: 2,
      soulfulNomad: 1,
      holisticRebalancer: 1,
      socialButterfly: 1,
    },
    3: {
      // Married
      romanticEscapist: 2,
      familyConnector: 2,
      culturalConnoisseur: 1,
      mindfulMinimalist: 1,
    },
  },

  // Values question (tag-multiselect)
  values: {
    hometown: { familyConnector: 1, local: 1 },
    ethnicity: { culturalConnoisseur: 2, soulfulNomad: 1 },
    income: { luxeSeeker: 2, mindfulMinimalist: -1 },
    languageFluency: { culturalConnoisseur: 2, hybridNomad: 1 },
    occupation: { academicAdventurer: 1, mindfulMinimalist: 1 },
    religiousAffiliation: { soulfulNomad: 2, culturalConnoisseur: 1 },
    preferredSocialSettings: { socialButterfly: 2, creativeMaverick: 1 },
    age: { familyConnector: 1, mindfulMinimalist: 1 },
    availability: { hybridNomad: 1, wildExplorer: 1 },
    class: { mindfulMinimalist: 1, comfortTraveler: 1 },
    culturalBackground: { culturalConnoisseur: 2, local: 1 },
    educationLevel: { academicAdventurer: 2, culturalConnoisseur: 1 },
    genderIdentity: { socialButterfly: 1, creativeMaverick: 1 },
    hobbies: { wildExplorer: 1, creativeMaverick: 1 },
    moralValues: { soulfulNomad: 2, holisticRebalancer: 1 },
    musicTaste: { creativeMaverick: 1, socialButterfly: 1 },
    politicalAffiliation: { mindfulMinimalist: 1, academicAdventurer: 1 },
    senseOfHumor: { socialButterfly: 2, hedonist: 1 },
    sexualOrientation: { socialButterfly: 1, creativeMaverick: 1 },
    substanceUse: { hedonist: 1, wildExplorer: 1 },
  },

  // Humor importance question
  humor: {
    0: {
      // Essential
      socialButterfly: 3,
      hedonist: 1,
      creativeMaverick: 1,
    },
    1: {
      // Like occasionally
      socialButterfly: 1,
      culturalConnoisseur: 1,
      mindfulMinimalist: 1,
    },
    2: {
      // Don't mind
      soulfulNomad: 1,
      holisticRebalancer: 1,
      academicAdventurer: 1,
    },
    3: {
      // Don't find funny
      soulfulNomad: 1,
      mindfulMinimalist: 1,
      socialButterfly: -2,
    },
  },

  // Loneliness question
  loneliness: {
    1: { soulfulNomad: 2, mindfulMinimalist: 1 },
    5: { hybridNomad: 1, academicAdventurer: 1 },
    10: { socialButterfly: 2, familyConnector: 1 },
  },

  // Group speaking question
  groupSpeaking: {
    1: { soulfulNomad: 2, mindfulMinimalist: 1 },
    5: { hybridNomad: 1, academicAdventurer: 1 },
    10: { socialButterfly: 2, hedonist: 1 },
  },

  // Advice style question
  adviceStyle: {
    1: { academicAdventurer: 2, mindfulMinimalist: 1 },
    5: { hybridNomad: 1, culturalConnoisseur: 1 },
    10: { soulfulNomad: 2, romanticEscapist: 1 },
  },

  // Sleep schedule question
  sleepSchedule: {
    0: { hedonist: 2, creativeMaverick: 1 }, // Nocturnal
    1: { mindfulMinimalist: 2, holisticRebalancer: 1 }, // Early riser
  },

  // Change question
  change: {
    0: { comfortTraveler: 2, mindfulMinimalist: 1 }, // Hate change
    1: { comfortTraveler: 1, familyConnector: 1 }, // Prefer things the way they are
    2: { hybridNomad: 1, culturalConnoisseur: 1 }, // Can adjust to some change
    3: { creativeMaverick: 1, wildExplorer: 1 }, // Like variation
    4: { wildExplorer: 2, hedonist: 1 }, // Love constant change
  },

  // Comfort question
  comfort: {
    0: { comfortTraveler: 2, mindfulMinimalist: 1 }, // Like what I like
    1: { hybridNomad: 1, familyConnector: 1 }, // Some familiar, some new
    2: { wildExplorer: 2, creativeMaverick: 1 }, // Throw me in the deep end
  },

  // Family question
  family: {
    0: { wildExplorer: 2, hybridNomad: 1 }, // Not a big family person
    1: { hybridNomad: 1, mindfulMinimalist: 1 }, // Love family in doses
    2: { familyConnector: 2, comfortTraveler: 1 }, // Very family oriented
  },

  // Appearance question
  appearance: {
    0: { mindfulMinimalist: 2, wildExplorer: 1 }, // Don't care what I look like
    1: { hybridNomad: 1, familyConnector: 1 }, // Make sure I'm presentable
    2: { luxeSeeker: 2, romanticEscapist: 1 }, // Take great pride in appearance
  },

  // Non-conformity question
  nonConformity: {
    0: { creativeMaverick: 2, wildExplorer: 1 }, // 100% myself everywhere
    1: { hybridNomad: 1, culturalConnoisseur: 1 }, // Fluid depending on situation
    2: { comfortTraveler: 2, familyConnector: 1 }, // Like to blend in
  },

  // Physical attraction question
  physicalAttraction: {
    0: { mindfulMinimalist: 2, academicAdventurer: 1 }, // Don't care about looks
    1: { hybridNomad: 1, culturalConnoisseur: 1 }, // Looks important but not everything
    2: { hedonist: 2, romanticEscapist: 1 }, // Love a bit of eye candy
  },

  // Building wealth question
  buildingWealth: {
    0: { mindfulMinimalist: 2, academicAdventurer: 1 }, // Save and invest like life depends on it
    1: { hybridNomad: 1, familyConnector: 1 }, // Save some and spend some
    2: { hedonist: 2, wildExplorer: 1 }, // Life is short, spend as I please
    3: { luxeSeeker: 2, comfortTraveler: 1 }, // Spend what I need to save time
  },

  // Spirituality question
  spirituality: {
    0: { academicAdventurer: 2, mindfulMinimalist: 1 }, // Believe in science
    1: { soulfulNomad: 2, creativeMaverick: 1 }, // Create own practices and beliefs
    2: { holisticRebalancer: 2, soulfulNomad: 1 }, // Believe in meditation and mindfulness
    3: { culturalConnoisseur: 1, familyConnector: 1 }, // Believe in one true religion
    4: { wildExplorer: 1, hedonist: 1 }, // Don't believe in anything
  },

  // Creativity question
  creativity: {
    0: { mindfulMinimalist: 2, comfortTraveler: 1 }, // Not creative at all
    1: { hybridNomad: 1, familyConnector: 1 }, // Like being creative sometimes
    2: { creativeMaverick: 2, romanticEscapist: 1 }, // Feel lost when not creating
  },

  // Friendships question
  friendships: {
    0: { mindfulMinimalist: 2, soulfulNomad: 1 }, // Prefer to be by myself
    1: { academicAdventurer: 1, culturalConnoisseur: 1 }, // Find it hard to make friends
    2: { familyConnector: 1, comfortTraveler: 1 }, // Wish I had more friends
    3: { familyConnector: 1, comfortTraveler: 1 }, // Love my friends
    4: { socialButterfly: 2, hedonist: 1 }, // Make friends everywhere I go
  },

  // Living well question
  livingWell: {
    0: { holisticRebalancer: 2, mindfulMinimalist: 1 }, // Health and wellness are everything
    1: { soulfulNomad: 2, holisticRebalancer: 1 }, // Investing in spiritual health is vital
    2: { mindfulMinimalist: 2, comfortTraveler: 1 }, // Simple things keep me happy
    3: { socialButterfly: 2, hedonist: 1 }, // Love, laugh, live
    4: { luxeSeeker: 2, romanticEscapist: 1 }, // Live to pamper myself
    5: { wildExplorer: 2, creativeMaverick: 1 }, // Discovering new things makes me feel alive
  },

  // Foreign environments question
  foreignEnvironments: {
    0: { comfortTraveler: 2, familyConnector: 1 }, // Not very comfortable, prefer guided tours
    1: { hybridNomad: 1, culturalConnoisseur: 1 }, // Comfortable with some help or guidance
    2: { wildExplorer: 2, local: 1 }, // Very comfortable, love to explore independently
  },

  // World view question
  worldView: {
    0: { wildExplorer: 2, creativeMaverick: 1 }, // Place full of adventure waiting to be explored
    1: { academicAdventurer: 2, culturalConnoisseur: 1 }, // Complex place, want to understand more
    2: { comfortTraveler: 2, mindfulMinimalist: 1 }, // Overwhelming, prefer simple curated experiences
    3: { soulfulNomad: 2, holisticRebalancer: 1 }, // Live in my own world
  },

  // Biggest fear question
  biggestFear: {
    0: { wildExplorer: -1, local: -1 }, // Getting lost
    1: { culturalConnoisseur: -1, local: -1 }, // Experiencing culture shock
    2: { hedonist: -1, socialButterfly: -1 }, // Missing out on memorable experiences
    3: { socialButterfly: -1, familyConnector: -1 }, // Feeling isolated or traveling alone
    4: { creativeMaverick: -1, academicAdventurer: -1 }, // Not finding activities that interest me
    5: { holisticRebalancer: -1, mindfulMinimalist: -1 }, // Getting sick or injured
    6: { comfortTraveler: -1, familyConnector: -1 }, // Missing flight or connections
    7: { luxeSeeker: -1, comfortTraveler: -1 }, // Losing luggage or belongings
    8: { wildExplorer: -1, hedonist: -1 }, // Getting into legal trouble
    9: { mindfulMinimalist: -1, comfortTraveler: -1 }, // Running out of money
    10: { familyConnector: -1, comfortTraveler: -1 }, // Not feeling safe or secure
    11: { culturalConnoisseur: -1, local: -1 }, // Language barriers
  },

  // Comfort zone question
  comfortZone: {
    0: { comfortTraveler: 2, familyConnector: 1 }, // Prefer sticking to what I know
    1: { familyConnector: 1, comfortTraveler: 1 }, // Consider with experienced guide
    2: { hybridNomad: 1, culturalConnoisseur: 1 }, // Sometimes open to new things
    3: { wildExplorer: 2, local: 1 }, // Thrive in unfamiliar environments
  },

  // Challenge reaction question
  challengeReaction: {
    0: { academicAdventurer: 2, mindfulMinimalist: 1 }, // Stay calm, embrace change, problem solve
    1: { wildExplorer: 2, hedonist: 1 }, // Don't mind chaos, find it exciting
    2: { hybridNomad: 1, familyConnector: 1 }, // Adapt but can be stressful
    3: { comfortTraveler: 2, familyConnector: 1 }, // Get upset, require immediate help
  },

  // Problem solving question
  problemSolving: {
    0: { academicAdventurer: 2, culturalConnoisseur: 1 }, // Research and gather information
    1: { creativeMaverick: 2, wildExplorer: 1 }, // Think outside the box, creative approach
    2: { culturalConnoisseur: 1, local: 1 }, // Look at how others solved similar problems
    3: { wildExplorer: 2, soulfulNomad: 1 }, // Follow instincts, adjust as you go
    4: { mindfulMinimalist: 2, familyConnector: 1 }, // Create long-term plan with backup options
  },

  // First notice question
  firstNotice: {
    0: { academicAdventurer: 2, culturalConnoisseur: 1 }, // Small details that seem out of place
    1: { creativeMaverick: 2, romanticEscapist: 1 }, // Overall vibe, colors, visual feel
    2: { comfortTraveler: 2, familyConnector: 1 }, // What needs to be done right away
    3: { socialButterfly: 2, local: 1 }, // How people are behaving, interacting
    4: { culturalConnoisseur: 2, academicAdventurer: 1 }, // How everything connects, layout, culture
  },

  // Destination values question
  destinationValues: {
    0: { mindfulMinimalist: 2, holisticRebalancer: 1 }, // Sustainability & supporting local region
    1: { culturalConnoisseur: 2, local: 1 }, // Authenticity
    2: { luxeSeeker: 2, comfortTraveler: 1 }, // Comfort and Luxury
    3: { holisticRebalancer: 2, soulfulNomad: 1 }, // Relaxation & Wellness
    4: { wildExplorer: 2, hedonist: 1 }, // Adventure and excitement
    5: { soulfulNomad: 2, academicAdventurer: 1 }, // Personal Growth
    6: { culturalConnoisseur: 2, academicAdventurer: 1 }, // Learning about new cultures
    7: { familyConnector: 2, socialButterfly: 1 }, // Making memories & bonding with others
    8: { romanticEscapist: 2, hedonist: 1 }, // Finding love
  },

  // Travel experience question
  travelExperience: {
    0: { wildExplorer: 2, holisticRebalancer: 1 }, // Trekking through remote mountains
    1: { luxeSeeker: 2, hedonist: 1 }, // Exclusive cocktail party on yacht
    2: { luxeSeeker: 2, romanticEscapist: 1 }, // Private island luxury villa
    3: { mindfulMinimalist: 2, holisticRebalancer: 1 }, // Volunteer project
    4: { academicAdventurer: 2, culturalConnoisseur: 1 }, // Walking ancient ruins
    5: { hedonist: 2, socialButterfly: 1 }, // Dancing at vibrant festival
    6: { holisticRebalancer: 2, soulfulNomad: 1 }, // Wellness retreat
    7: { familyConnector: 2, comfortTraveler: 1 }, // All-inclusive adventure park
    8: { comfortTraveler: 2, familyConnector: 1 }, // Taking pictures at attractions
    9: { wildExplorer: 2, creativeMaverick: 1 }, // Sailing, surfing, snorkeling
    10: { culturalConnoisseur: 2, local: 1 }, // Locally hosted art class
    11: { hedonist: 2, wildExplorer: 1 }, // There's nothing I haven't done
  },

  // Accommodation preference question
  accommodationPreference: {
    0: { luxeSeeker: 2, romanticEscapist: 1 }, // Luxury hotels and homes
    1: { creativeMaverick: 2, mindfulMinimalist: 1 }, // Unique boutique stays or eco-lodges
    2: { comfortTraveler: 2, familyConnector: 1 }, // All-Inclusive resorts
    3: { local: 2, culturalConnoisseur: 1 }, // Homestays or immersive local guesthouses
    4: { wildExplorer: 2, budgetBackpacker: 1 }, // Group hostels or campsites
    5: { familyConnector: 2, comfortTraveler: 1 }, // Vacation rentals & villas
  },

  // Climate preference question
  climatePreference: {
    0: { hedonist: 2, familyConnector: 1 }, // Warm and tropical
    1: { wildExplorer: 2, holisticRebalancer: 1 }, // Cold and snowy
    2: { mindfulMinimalist: 2, academicAdventurer: 1 }, // Cool and temperate
    3: { wildExplorer: 2, creativeMaverick: 1 }, // Dry arid deserts
    4: { hybridNomad: 2, wildExplorer: 1 }, // Different climates depending on activity
  },

  // Trip pace question
  tripPace: {
    0: { comfortTraveler: 2, familyConnector: 1 }, // Keep me busy, follow set itinerary
    1: { hybridNomad: 2, mindfulMinimalist: 1 }, // Plan a few things, leave time flexible
    2: { culturalConnoisseur: 2, academicAdventurer: 1 }, // Browse through vetted recommendations
    3: { wildExplorer: 2, creativeMaverick: 1 }, // Prefer to be spontaneous and explore freely
  },

  // Travel companions question
  travelCompanions: {
    0: { familyConnector: 2, comfortTraveler: 1 }, // Love it, creates great memories
    1: { socialButterfly: 2, hedonist: 1 }, // Prefer to travel with people I don't know yet
    2: { hybridNomad: 1, wildExplorer: 1 }, // Never traveled with anyone, but open to it
    3: { hybridNomad: 2, mindfulMinimalist: 1 }, // Enjoy it sometimes but value alone time
    4: { soulfulNomad: 2, academicAdventurer: 1 }, // Prefer traveling solo
  },

  // Priority rating question (slider values)
  priorityRating: {
    // Flight & Transport priority
    0: { wildExplorer: 2, hybridNomad: 1 }, // Low priority
    5: { hybridNomad: 1, culturalConnoisseur: 1 }, // Medium priority
    10: { comfortTraveler: 2, familyConnector: 1 }, // High priority
  },

  // Spending preferences question (slider values)
  spendingPreferences: {
    // Accommodation spending
    0: { mindfulMinimalist: 2, wildExplorer: 1 }, // Low spending
    5: { hybridNomad: 1, familyConnector: 1 }, // Medium spending
    10: { luxeSeeker: 2, romanticEscapist: 1 }, // High spending
  },
};

// =========================
// INTERNATIONALIZATION
// =========================
const i18n = {
  en: {
    startQuiz: "Start Quiz",
    next: "Next",
    back: "Back",
    complete: "Complete",
    loading: "Calculating your results...",
    mainArchetype: "Your Main Archetype",
    secondaryArchetypes: "Secondary Archetypes",
    viewDetails: "View Details",
    shareResults: "Share Your Results",
    emailResults: "Email Me My Results",
    retakeQuiz: "Retake Quiz",
    peopleShare: "people share your archetype",
    thankYou: "Thank you for completing the quiz!",
    resumeQuiz: "Resume Quiz",
    clearSaved: "Clear Saved",
    select: "Select...",
    typeAnswer: "Type your answer...",
    community: "Community",
  },
  es: {
    startQuiz: "Comenzar Quiz",
    next: "Siguiente",
    back: "Atrás",
    complete: "Completar",
    loading: "Calculando tus resultados...",
    mainArchetype: "Tu Arquetipo Principal",
    secondaryArchetypes: "Arquetipos Secundarios",
    viewDetails: "Ver Detalles",
    shareResults: "Compartir Resultados",
    emailResults: "Enviar Resultados por Email",
    retakeQuiz: "Repetir Quiz",
    peopleShare: "personas comparten tu arquetipo",
    thankYou: "¡Gracias por completar el quiz!",
    resumeQuiz: "Reanudar Quiz",
    clearSaved: "Borrar Guardado",
    select: "Seleccionar...",
    typeAnswer: "Escribe tu respuesta...",
    community: "Comunidad",
  },
  fr: {
    startQuiz: "Commencer le Quiz",
    next: "Suivant",
    back: "Retour",
    complete: "Terminer",
    loading: "Calcul de vos résultats...",
    mainArchetype: "Votre Archétype Principal",
    secondaryArchetypes: "Archétypes Secondaires",
    viewDetails: "Voir les Détails",
    shareResults: "Partager Vos Résultats",
    emailResults: "Envoyez-moi Mes Résultats",
    retakeQuiz: "Refaire le Quiz",
    peopleShare: "personnes partagent votre archétype",
    thankYou: "Merci d'avoir terminé le quiz !",
    resumeQuiz: "Reprendre le Quiz",
    clearSaved: "Effacer Sauvegardé",
    select: "Sélectionner...",
    typeAnswer: "Tapez votre réponse...",
    community: "Communauté",
  },
};

// =========================
// APP CONFIGURATION
// =========================
const appConfig = {
  maxSelections: 5,
  animationDuration: 300,
  language: "en",
  saveProgress: true,
  showProgress: true,
};
