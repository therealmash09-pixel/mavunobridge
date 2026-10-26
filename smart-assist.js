/* ============================================================
   MAVUNOBRIDGE SMART ASSIST
   Crop guide • County filters • Symptom matching • Photo preview
   Farm reports • Responsive assistant • Three languages
   Offline-first demonstration; no Supabase required.
============================================================ */

(() => {
  "use strict";

  if (window.__MAVUNO_SMART_ASSIST_V3__) return;
  window.__MAVUNO_SMART_ASSIST_V3__ = true;

  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];

  const STORAGE = {
    reports: "mavunobridge_crop_health_reports_v1",
    language1: "mavunobridge_language_v1",
    language2: "mavunobridge_language_v2"
  };

  const MAX_PHOTO_BYTES = 8 * 1024 * 1024;
  const MAX_PHOTO_DIMENSION = 1100;

  let language = "mix";
  let currentReport = null;
  let currentPhotoData = "";
  let currentPhotoName = "";
  let photoAnalysis = [];
  let photoConsent = null;
  let photoAnalysisStatus = "";
  let generating = false;

  /* ==========================================================
     1. LANGUAGE SETTINGS
  ========================================================== */

  const LANG = {
    en: {
      eyebrow: "YOUR FARM, YOUR PLAN",
      hero: "Grow with a plan.",
      hero2: "Harvest with confidence.",
      heroDescription: "Choose a crop, county and farm condition. Get practical tips, possible symptom matches and a farm report you can save.",
      demoNotice: "Demo guidance only. This is not a live weather forecast or a confirmed disease diagnosis.",
      planner: "Tell us about your farm",
      plannerIntro: "Add the details you know. You can leave optional fields blank.",
      county: "County",
      area: "Town / area",
      crop: "Crop",
      stage: "Growth stage",
      concern: "Main concern",
      soil: "Soil type",
      water: "Water access",
      farmSize: "Farm size in acres",
      notes: "Extra farm details",
      signs: "Visible signs or symptoms",
      signsHelp: "Select any signs you can see on the crop.",
      describeSymptoms: "Describe the problem",
      photo: "Upload a crop photo (optional)",
      photoHelp: "Use a clear photo of the affected leaf, stem, fruit or root.",
      createReport: "Generate my farm report",
      generating: "Preparing report...",
      clear: "Clear form",
      report: "Your farm report",
      reportIntro: "Your selected crop, observations and recommended next steps.",
      noReport: "Your report will appear here",
      noReportHint: "Complete the farm planner and select Generate my farm report.",
      context: "Farm context",
      growingTips: "Growing tips",
      possibleMatches: "Possible pest or disease matches",
      nextSteps: "Recommended next steps",
      noMatches: "No close match was found from the symptoms entered.",
      noMatchesHint: "This does not rule out pests or disease. Add more details or consult a local agricultural extension officer.",
      possibleOnly: "Possible match only — not a diagnosis.",
      photoEvidence: "Photo evidence",
      photoWaiting: "Photo preview only. No image-analysis service is connected.",
      photoConnected: "Image-analysis results are suggestions that need local confirmation.",
      saveReport: "Save report on this device",
      downloadReport: "Download text report",
      printReport: "Print / Save as PDF",
      saveSuccess: "Report saved in this browser.",
      saveError: "Could not save the report in this browser.",
      downloadSuccess: "Text report downloaded.",
      deleteReport: "Delete",
      viewReport: "View report",
      savedReports: "Saved farm reports",
      savedIntro: "Saved reports stay in this browser and are not shared across devices.",
      noSavedReports: "No saved reports yet.",
      questionTitle: "Farm Assistant",
      questionIntro: "Ask a follow-up about your selected crop or report.",
      askPlaceholder: "Ask about pests, symptoms, water, soil or harvest...",
      ask: "Ask",
      offlineNote: "Offline assistant. Answers use built-in crop guidance, not a live agronomist.",
      answering: "Checking your farm notes...",
      symptomsEntered: "Symptoms entered",
      urgent: "Important: if damage is spreading quickly or affects many plants, seek help from a county agricultural extension officer. Avoid moving suspect planting material.",
      references: "Agricultural learning resources",
      library: "Kenyan crop guide library",
      libraryIntro: "Filter by crop group and county, or search for a crop.",
      searchCrop: "Search maize, coffee, cassava...",
      cropGroup: "Crop group",
      libraryCounty: "County context",
      allGroups: "All crop groups",
      allCounties: "All counties",
      noCrops: "No crops match these filters.",
      useCrop: "Use this crop",
      cropTips: "General growing tips",
      locallyVariable: "Conditions vary within each county and by season. County selection does not establish current weather or soil conditions.",
      generatedAt: "Report prepared",
      sourceNote: "Built-in demonstration content. Confirm crop-specific decisions with a qualified local adviser.",
      badPhoto: "Choose an image file under 8 MB.",
      photoError: "The selected image could not be opened. Try another image.",
      photoRemoved: "Photo removed.",
      photoConsent: "I agree to send this photo to the configured image-analysis service.",
      analysePhoto: "Analyse photo",
      analysingPhoto: "Analysing photo...",
      noImageService: "Photo preview works offline. Visual matching needs an image-analysis service.",
      imageFailed: "Image analysis failed. Showing local symptom matches instead.",
      noQuestionReport: "Create a farm report first so I can answer about the crop you selected.",
      followUp: "Here is some general guidance for",
      matchCaution: "Different pests and diseases can produce similar symptoms. Confirm the cause before treating.",
      waterAdvice: "Check soil moisture before watering. Avoid waterlogging and conserve water where appropriate.",
      dryAdvice: "Check moisture below the surface. Consider suitable mulch and water-saving methods for your crop.",
      wetAdvice: "Check drainage and avoid working saturated soil. Prolonged wetness can encourage some diseases.",
      pestAdvice: "Inspect several plants and both sides of leaves. Record damage before choosing a control method.",
      diseaseAdvice: "Record which plant parts are affected and how quickly symptoms are spreading. Similar signs can have different causes.",
      yellowAdvice: "Yellowing can result from water stress, nutrients, root damage, pests or disease. Check the whole plant and soil.",
      soilAdvice: "A soil test is more reliable than guessing fertiliser needs from leaf colour alone.",
      harvestAdvice: "Handle produce carefully, separate damaged items and follow crop-specific maturity and storage guidance.",
      questionFallback: "Ask about crop care, symptom matching, watering, soil health, pest scouting or harvesting. For important diagnoses and treatments, consult an agricultural extension officer.",
      stagePlanning: "Planning / before planting",
      stageSeedling: "Seeds / seedlings",
      stageVegetative: "Leaf and stem growth",
      stageFlowering: "Flowering / fruiting",
      stageHarvest: "Harvest / storage",
      issueNormal: "General crop planning",
      issueDry: "Dry soil / water shortage",
      issueWet: "Heavy rain / waterlogged soil",
      issuePest: "Pests or insect damage",
      issueDisease: "Possible disease symptoms",
      issueYellow: "Yellowing or weak growth",
      issueHarvest: "Harvest / storage problem",
      issueSoil: "Soil fertility question",
      soilUnknown: "Not sure",
      soilLoam: "Loam",
      soilClay: "Clay / heavy soil",
      soilSandy: "Sandy / light soil",
      soilVolcanic: "Volcanic / dark soil",
      waterRain: "Mainly rainfall",
      waterIrrigation: "Irrigation available",
      waterLimited: "Limited water",
      waterUncertain: "Not sure",
      groupCereals: "Cereals",
      groupLegumes: "Legumes",
      groupHorticulture: "Vegetables and fruits",
      groupRoots: "Root crops",
      groupCash: "Cash crops",
      groupOther: "Other crops"
    },

    mix: {
      eyebrow: "SHAMBA YAKO, PLAN YAKO",
      hero: "Grow with a plan.",
      hero2: "Harvest ukiwa confident.",
      heroDescription: "Chagua crop, county na hali ya shamba. Pata practical tips, possible symptom matches na report ya kuhifadhi.",
      demoNotice: "Demo guidance tu. Hii si live weather forecast wala confirmed disease diagnosis.",
      planner: "Tuambie kuhusu shamba lako",
      plannerIntro: "Jaza details unazojua. Optional fields unaweza kuacha wazi.",
      county: "County",
      area: "Town / area",
      crop: "Crop",
      stage: "Growth stage",
      concern: "Main concern",
      soil: "Soil type",
      water: "Water access",
      farmSize: "Ukubwa wa shamba kwa acres",
      notes: "Extra farm details",
      signs: "Dalili unazoona kwa crop",
      signsHelp: "Chagua signs zote unazoona kwa plant.",
      describeSymptoms: "Describe tatizo",
      photo: "Weka picha ya crop (si lazima)",
      photoHelp: "Chagua picha clear ya leaf, stem, fruit au root iliyoathirika.",
      createReport: "Tengeneza farm report",
      generating: "Inatengeneza report...",
      clear: "Clear form",
      report: "Farm report yako",
      reportIntro: "Crop yako, observations na steps za kufuata.",
      noReport: "Report yako itaonekana hapa",
      noReportHint: "Jaza planner kisha bonyeza Tengeneza farm report.",
      context: "Farm context",
      growingTips: "Growing tips",
      possibleMatches: "Possible pest au disease matches",
      nextSteps: "Next steps zinazopendekezwa",
      noMatches: "Hakuna close match kwa symptoms ulizoandika.",
      noMatchesHint: "Hii haimaanishi hakuna pest au disease. Ongeza details au ongea na agricultural extension officer.",
      possibleOnly: "Possible match tu — si diagnosis.",
      photoEvidence: "Photo evidence",
      photoWaiting: "Photo preview tu. Hakuna image-analysis service imeunganishwa.",
      photoConnected: "Image-analysis results ni suggestions zinazohitaji confirmation locally.",
      saveReport: "Save report kwa kifaa hiki",
      downloadReport: "Download text report",
      printReport: "Print / Save as PDF",
      saveSuccess: "Report imehifadhiwa kwa browser hii.",
      saveError: "Imeshindikana kuhifadhi report kwa browser hii.",
      downloadSuccess: "Text report imedownloadiwa.",
      deleteReport: "Delete",
      viewReport: "View report",
      savedReports: "Saved farm reports",
      savedIntro: "Reports zinabaki kwa browser hii na hazishirikiwi kwa devices zingine.",
      noSavedReports: "Hakuna reports zilizohifadhiwa bado.",
      questionTitle: "Farm Assistant",
      questionIntro: "Uliza follow-up kuhusu crop yako au report.",
      askPlaceholder: "Uliza kuhusu pests, symptoms, maji, soil ama harvest...",
      ask: "Uliza",
      offlineNote: "Offline assistant. Majibu yanatoka kwa built-in crop guide, si live agronomist.",
      answering: "Inaangalia farm notes...",
      symptomsEntered: "Symptoms ulizoingiza",
      urgent: "Muhimu: kama damage inaenea haraka au inaathiri mimea mingi, ongea na county agricultural extension officer. Epuka kusafirisha planting material inayoshukiwa kuwa na disease.",
      references: "Agricultural learning resources",
      library: "Kenyan crop guide library",
      libraryIntro: "Filter kwa crop group na county, ama search crop.",
      searchCrop: "Tafuta maize, coffee, cassava...",
      cropGroup: "Crop group",
      libraryCounty: "County context",
      allGroups: "Crop groups zote",
      allCounties: "Counties zote",
      noCrops: "Hakuna crops zinazolingana na filters hizi.",
      useCrop: "Tumia crop hii",
      cropTips: "General growing tips",
      locallyVariable: "Conditions zinatofautiana ndani ya county na season. County pekee haithibitishi live weather ama soil conditions.",
      generatedAt: "Report imetengenezwa",
      sourceNote: "Demo content. Confirm crop-specific decisions na qualified local adviser.",
      badPhoto: "Chagua image file chini ya 8 MB.",
      photoError: "Picha haikuweza kufunguliwa. Jaribu picha nyingine.",
      photoRemoved: "Picha imeondolewa.",
      photoConsent: "Nakubali kutuma picha kwa configured image-analysis service.",
      analysePhoto: "Analyse photo",
      analysingPhoto: "Inaanalyse picha...",
      noImageService: "Photo preview inafanya offline. Visual matching inahitaji image-analysis service.",
      imageFailed: "Image analysis imeshindikana. Tunaonyesha local symptom matches.",
      noQuestionReport: "Tengeneza farm report kwanza ili nijibu kuhusu crop uliyochagua.",
      followUp: "Hii ni general guidance kuhusu",
      matchCaution: "Pests na diseases tofauti zinaweza kuwa na symptoms zinazofanana. Confirm cause kabla ya treatment.",
      waterAdvice: "Check soil moisture kabla ya kumwagilia. Epuka waterlogging na conserve water inapowezekana.",
      dryAdvice: "Check moisture chini ya surface. Fikiria mulch inayofaa na water-saving methods kwa crop yako.",
      wetAdvice: "Check drainage na epuka kufanya kazi kwa soil iliyolowa sana. Wetness ya muda mrefu inaweza kuongeza baadhi ya diseases.",
      pestAdvice: "Inspect plants kadhaa na sides zote za majani. Record damage kabla ya kuchagua control method.",
      diseaseAdvice: "Record sehemu za plant zilizoathirika na jinsi symptoms zinaenea. Signs zinazofanana zinaweza kuwa na causes tofauti.",
      yellowAdvice: "Majani kuwa yellow kunaweza kutokana na maji, nutrients, roots, pests ama disease. Check plant yote pamoja na soil.",
      soilAdvice: "Soil test ni bora kuliko kukisia fertiliser needs kupitia rangi ya majani pekee.",
      harvestAdvice: "Handle produce vizuri, tenga zilizoharibika na follow crop-specific harvesting na storage guidance.",
      questionFallback: "Uliza kuhusu crop care, symptom matching, watering, soil health, pest scouting ama harvest. Kwa diagnosis muhimu, ongea na agricultural extension officer.",
      stagePlanning: "Planning / kabla ya kupanda",
      stageSeedling: "Mbegu / seedlings",
      stageVegetative: "Majani na shina kukua",
      stageFlowering: "Maua / matunda",
      stageHarvest: "Harvest / storage",
      issueNormal: "General crop planning",
      issueDry: "Soil kavu / upungufu wa maji",
      issueWet: "Mvua nyingi / soil kulowa sana",
      issuePest: "Pests ama damage ya wadudu",
      issueDisease: "Possible disease symptoms",
      issueYellow: "Majani yellow ama growth dhaifu",
      issueHarvest: "Tatizo la harvest / storage",
      issueSoil: "Swali la soil fertility",
      soilUnknown: "Sijui",
      soilLoam: "Loam",
      soilClay: "Clay / soil nzito",
      soilSandy: "Sandy / soil nyepesi",
      soilVolcanic: "Volcanic / soil nyeusi",
      waterRain: "Mainly rainfall",
      waterIrrigation: "Irrigation iko",
      waterLimited: "Maji ni machache",
      waterUncertain: "Sijui",
      groupCereals: "Cereals",
      groupLegumes: "Legumes",
      groupHorticulture: "Mboga na matunda",
      groupRoots: "Root crops",
      groupCash: "Cash crops",
      groupOther: "Crops zingine"
    },

    sw: {
      eyebrow: "SHAMBA LAKO, MPANGO WAKO",
      hero: "Lima kwa mpango.",
      hero2: "Vuna kwa uhakika.",
      heroDescription: "Chagua zao, kaunti na hali ya shamba. Pata maelekezo ya kilimo, dalili zinazoweza kufanana na ripoti unayoweza kuhifadhi.",
      demoNotice: "Maelekezo ya mfano pekee. Huu si utabiri wa hali ya hewa wa moja kwa moja wala utambuzi wa ugonjwa.",
      planner: "Tuambie kuhusu shamba lako",
      plannerIntro: "Jaza maelezo unayojua. Unaweza kuacha sehemu zisizo za lazima wazi.",
      county: "Kaunti",
      area: "Mji / eneo",
      crop: "Zao",
      stage: "Hatua ya ukuaji",
      concern: "Tatizo kuu",
      soil: "Aina ya udongo",
      water: "Upatikanaji wa maji",
      farmSize: "Ukubwa wa shamba kwa ekari",
      notes: "Maelezo mengine ya shamba",
      signs: "Dalili zinazoonekana",
      signsHelp: "Chagua dalili unazoziona kwenye zao.",
      describeSymptoms: "Eleza tatizo",
      photo: "Weka picha ya zao (si lazima)",
      photoHelp: "Chagua picha wazi ya jani, shina, tunda au mzizi ulioathirika.",
      createReport: "Tengeneza ripoti ya shamba",
      generating: "Inaandaa ripoti...",
      clear: "Futa fomu",
      report: "Ripoti ya shamba lako",
      reportIntro: "Zao ulilochagua, dalili na hatua zinazopendekezwa.",
      noReport: "Ripoti yako itaonekana hapa",
      noReportHint: "Jaza mpango wa shamba kisha uchague Tengeneza ripoti.",
      context: "Maelezo ya shamba",
      growingTips: "Maelekezo ya kilimo",
      possibleMatches: "Wadudu au magonjwa yanayoweza kufanana",
      nextSteps: "Hatua zinazopendekezwa",
      noMatches: "Hakuna tatizo lililolingana kwa karibu na dalili ulizoingiza.",
      noMatchesHint: "Hii haimaanishi kuwa hakuna wadudu au ugonjwa. Ongeza maelezo au wasiliana na afisa wa ugani wa kilimo.",
      possibleOnly: "Uwezekano tu — si utambuzi wa ugonjwa.",
      photoEvidence: "Picha ya ushahidi",
      photoWaiting: "Picha imeonyeshwa tu. Hakuna huduma ya uchambuzi wa picha iliyounganishwa.",
      photoConnected: "Matokeo ya uchambuzi wa picha ni mapendekezo yanayohitaji kuthibitishwa eneo husika.",
      saveReport: "Hifadhi ripoti kwenye kifaa hiki",
      downloadReport: "Pakua ripoti ya maandishi",
      printReport: "Chapisha / Hifadhi kama PDF",
      saveSuccess: "Ripoti imehifadhiwa kwenye kivinjari hiki.",
      saveError: "Imeshindikana kuhifadhi ripoti kwenye kivinjari hiki.",
      downloadSuccess: "Ripoti ya maandishi imepakuliwa.",
      deleteReport: "Futa",
      viewReport: "Tazama ripoti",
      savedReports: "Ripoti zilizohifadhiwa",
      savedIntro: "Ripoti hubaki kwenye kivinjari hiki na hazishirikiwi kati ya vifaa.",
      noSavedReports: "Hakuna ripoti zilizohifadhiwa bado.",
      questionTitle: "Msaidizi wa Kilimo",
      questionIntro: "Uliza swali la ziada kuhusu zao au ripoti yako.",
      askPlaceholder: "Uliza kuhusu wadudu, dalili, maji, udongo au mavuno...",
      ask: "Uliza",
      offlineNote: "Msaidizi wa nje ya mtandao. Majibu yanatumia maelekezo yaliyowekwa, si mtaalamu wa moja kwa moja.",
      answering: "Inaangalia maelezo ya shamba...",
      symptomsEntered: "Dalili ulizoingiza",
      urgent: "Muhimu: tatizo likisambaa haraka au kuathiri mimea mingi, tafuta afisa wa ugani wa kilimo wa kaunti. Epuka kusafirisha miche inayoshukiwa kuwa na ugonjwa.",
      references: "Rasilimali za kujifunza kilimo",
      library: "Mwongozo wa mazao ya Kenya",
      libraryIntro: "Chuja kwa kundi la zao na kaunti, au tafuta zao.",
      searchCrop: "Tafuta mahindi, kahawa, muhogo...",
      cropGroup: "Kundi la zao",
      libraryCounty: "Kaunti",
      allGroups: "Makundi yote ya mazao",
      allCounties: "Kaunti zote",
      noCrops: "Hakuna mazao yanayolingana na vichujio hivi.",
      useCrop: "Tumia zao hili",
      cropTips: "Maelekezo ya jumla ya kilimo",
      locallyVariable: "Hali hutofautiana ndani ya kaunti na kulingana na msimu. Kuchagua kaunti hakuthibitishi hali ya sasa ya hewa au udongo.",
      generatedAt: "Ripoti imeandaliwa",
      sourceNote: "Maudhui ya mfano. Thibitisha maamuzi muhimu na mshauri wa kilimo aliyehitimu.",
      badPhoto: "Chagua picha iliyo chini ya MB 8.",
      photoError: "Picha haikuweza kufunguliwa. Jaribu picha nyingine.",
      photoRemoved: "Picha imeondolewa.",
      photoConsent: "Ninakubali kutuma picha kwa huduma ya uchambuzi iliyosanidiwa.",
      analysePhoto: "Chambua picha",
      analysingPhoto: "Inachambua picha...",
      noImageService: "Mwonekano wa picha unafanya kazi bila mtandao. Ulinganisho wa picha unahitaji huduma maalumu.",
      imageFailed: "Uchambuzi wa picha umeshindikana. Inaonyesha ulinganisho wa dalili uliofanyika ndani ya kifaa.",
      noQuestionReport: "Tengeneza ripoti kwanza ili nijibu kuhusu zao ulilochagua.",
      followUp: "Haya ni maelekezo ya jumla kuhusu",
      matchCaution: "Wadudu na magonjwa tofauti yanaweza kusababisha dalili zinazofanana. Thibitisha chanzo kabla ya matibabu.",
      waterAdvice: "Kagua unyevu wa udongo kabla ya kumwagilia. Epuka maji kusimama na hifadhi maji inapofaa.",
      dryAdvice: "Kagua unyevu chini ya uso wa udongo. Tumia matandazo na njia za kuokoa maji zinazofaa kwa zao.",
      wetAdvice: "Kagua mifereji ya maji na epuka kufanya kazi kwenye udongo uliojaa maji. Unyevu wa muda mrefu unaweza kuongeza magonjwa.",
      pestAdvice: "Kagua mimea kadhaa na pande zote za majani. Rekodi uharibifu kabla ya kuchagua njia ya kudhibiti.",
      diseaseAdvice: "Rekodi sehemu zilizoathirika na kasi ya dalili. Dalili zinazofanana zinaweza kuwa na sababu tofauti.",
      yellowAdvice: "Majani kuwa ya njano kunaweza kutokana na maji, virutubisho, mizizi, wadudu au ugonjwa. Kagua mmea na udongo.",
      soilAdvice: "Kipimo cha udongo ni bora kuliko kukisia mahitaji ya mbolea kutokana na rangi ya majani pekee.",
      harvestAdvice: "Shughulikia mazao kwa uangalifu, tenga yaliyoharibika na fuata maelekezo ya uvunaji na uhifadhi wa zao husika.",
      questionFallback: "Uliza kuhusu utunzaji wa zao, dalili, maji, afya ya udongo, ukaguzi wa wadudu au uvunaji. Kwa utambuzi muhimu, wasiliana na afisa wa ugani.",
      stagePlanning: "Kupanga / kabla ya kupanda",
      stageSeedling: "Mbegu / miche",
      stageVegetative: "Ukuaji wa majani na shina",
      stageFlowering: "Maua / kutengeneza matunda",
      stageHarvest: "Uvunaji / uhifadhi",
      issueNormal: "Mpango wa jumla wa zao",
      issueDry: "Udongo mkavu / uhaba wa maji",
      issueWet: "Mvua nyingi / udongo wenye maji mengi",
      issuePest: "Wadudu au uharibifu wa wadudu",
      issueDisease: "Dalili zinazoweza kuwa ugonjwa",
      issueYellow: "Majani kuwa ya njano au ukuaji dhaifu",
      issueHarvest: "Tatizo la uvunaji / uhifadhi",
      issueSoil: "Swali la rutuba ya udongo",
      soilUnknown: "Sijui",
      soilLoam: "Udongo wa mchanganyiko",
      soilClay: "Udongo wa mfinyanzi / mzito",
      soilSandy: "Udongo wa mchanga / mwepesi",
      soilVolcanic: "Udongo wa volkeno / mweusi",
      waterRain: "Mvua hasa",
      waterIrrigation: "Umwagiliaji upo",
      waterLimited: "Maji ni machache",
      waterUncertain: "Sijui",
      groupCereals: "Nafaka",
      groupLegumes: "Mikunde",
      groupHorticulture: "Mboga na matunda",
      groupRoots: "Mizizi",
      groupCash: "Mazao ya biashara",
      groupOther: "Mazao mengine"
    }
  };

  function tr(key) {
    return (LANG[language] || LANG.mix)[key] ?? LANG.en[key] ?? key;
  }

  /* ==========================================================
     2. COUNTIES & CROP DATA
  ========================================================== */

  const COUNTIES = [
    "Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo-Marakwet",
    "Embu", "Garissa", "Homa Bay", "Isiolo", "Kajiado", "Kakamega",
    "Kericho", "Kiambu", "Kilifi", "Kirinyaga", "Kisii", "Kisumu",
    "Kitui", "Kwale", "Laikipia", "Lamu", "Machakos", "Makueni",
    "Mandera", "Marsabit", "Meru", "Migori", "Mombasa", "Murang'a",
    "Nairobi City", "Nakuru", "Nandi", "Narok", "Nyamira",
    "Nyandarua", "Nyeri", "Samburu", "Siaya", "Taita-Taveta",
    "Tana River", "Tharaka-Nithi", "Trans Nzoia", "Turkana",
    "Uasin Gishu", "Vihiga", "Wajir", "West Pokot"
  ];

  /*
    Signs use shared IDs so matching works across languages.
    This database is a starting library, not every pest or disease
    in Kenya. Match results are possibilities, not diagnoses.
  */

  const SIGNS = [
    { id: "holes", en: "Holes in leaves", mix: "Holes kwa majani", sw: "Mashimo kwenye majani", terms: ["hole", "holes", "chewed", "chewing", "eaten leaves", "shredded"] },
    { id: "whorl", en: "Damage in the growing whorl", mix: "Damage kwa whorl ya mmea", sw: "Uharibifu kwenye sehemu changa ya mmea", terms: ["whorl", "frass", "sawdust", "faeces", "feces"] },
    { id: "yellow", en: "Yellowing leaves", mix: "Majani kuwa yellow", sw: "Majani kuwa ya njano", terms: ["yellow", "yellowing", "chlorosis", "pale leaves"] },
    { id: "wilting", en: "Wilting / drooping", mix: "Plant kunyauka", sw: "Mmea kunyauka", terms: ["wilt", "wilting", "drooping", "floppy", "suddenly collapsed"] },
    { id: "spots", en: "Leaf spots or lesions", mix: "Spots kwa majani", sw: "Madoa kwenye majani", terms: ["spots", "spot", "lesion", "lesions", "brown patches", "dark patches"] },
    { id: "streaks", en: "Yellow / pale streaks", mix: "Yellow streaks", sw: "Mistari ya njano au kupauka", terms: ["streak", "streaks", "striping", "parallel lines"] },
    { id: "mosaic", en: "Mottled / mosaic leaves", mix: "Majani na mosaic pattern", sw: "Majani yenye rangi mchanganyiko", terms: ["mosaic", "mottled", "mottling", "patchy colour", "vein clearing"] },
    { id: "curling", en: "Curled / distorted leaves", mix: "Majani kujikunja", sw: "Majani kujikunja au kupinda", terms: ["curl", "curled", "curling", "distorted", "twisted", "deformed"] },
    { id: "insects", en: "Visible insects / larvae", mix: "Wadudu wanaonekana", sw: "Wadudu wanaonekana", terms: ["insects", "larva", "larvae", "caterpillar", "aphids", "whitefly", "thrips", "maggot"] },
    { id: "sticky", en: "Sticky leaves / honeydew", mix: "Majani kushika / sticky", sw: "Majani kuwa na ute unaonata", terms: ["sticky", "honeydew", "sooty mould", "sooty mold", "black mould", "black mold"] },
    { id: "webbing", en: "Fine webs / webbing", mix: "Webs nyembamba", sw: "Utando mwembamba", terms: ["webbing", "webs", "web", "mite"] },
    { id: "fruitDamage", en: "Fruit holes / rotting fruit", mix: "Matunda kutoboka au kuoza", sw: "Matunda kutoboka au kuoza", terms: ["fruit hole", "fruit holes", "fruit rot", "rotting fruit", "fruit damage", "maggot"] },
    { id: "stemDamage", en: "Stem damage / dead heart", mix: "Shina kuharibika / dead heart", sw: "Shina kuharibika", terms: ["stem damage", "dead heart", "deadheart", "stem bore", "hollow stem", "tunnel"] },
    { id: "rootRot", en: "Root rot / dark roots", mix: "Mizizi kuoza", sw: "Mizizi kuoza au kuwa myeusi", terms: ["root rot", "roots rotting", "dark roots", "rotted roots", "root damage"] },
    { id: "powder", en: "White powdery growth", mix: "White powder kwa majani", sw: "Unga mweupe kwenye majani", terms: ["powdery", "white powder", "powder", "mildew"] },
    { id: "mould", en: "Mould / fuzzy growth", mix: "Mould kwa crop", sw: "Ukungu wenye manyoya", terms: ["mould", "mold", "fuzzy", "fungal growth", "white growth"] },
    { id: "galls", en: "Galls / abnormal swellings", mix: "Swelling zisizo kawaida", sw: "Vimbe zisizo za kawaida", terms: ["gall", "galls", "swelling", "swellings", "abnormal growth"] },
    { id: "stunting", en: "Stunted growth", mix: "Crop kudumaa", sw: "Ukuaji kudumaa", terms: ["stunt", "stunted", "dwarf", "small plants", "poor growth"] },
    { id: "fruitDrop", en: "Flowers or fruit dropping", mix: "Maua au matunda kudondoka", sw: "Maua au matunda kudondoka", terms: ["drop", "dropping", "flower drop", "fruit drop", "flowers fall"] },
    { id: "rot", en: "Soft rot / bad smell", mix: "Kuoza / harufu mbaya", sw: "Kuoza au harufu mbaya", terms: ["soft rot", "rotting", "rot", "bad smell", "foul smell"] },
    { id: "drying", en: "Drying / scorched leaves", mix: "Majani kukauka", sw: "Majani kukauka", terms: ["drying", "dry leaves", "scorched", "burnt leaves", "blight"] },
    { id: "orangePustules", en: "Orange / reddish pustules", mix: "Orange spots / pustules", sw: "Vimbe vidogo vya rangi ya chungwa", terms: ["orange pustules", "rust", "reddish pustules", "rust spots"] },
    { id: "bunchy", en: "Small narrow leaves / bunchy top", mix: "Majani madogo / bunchy top", sw: "Majani madogo yanayokusanyika juu", terms: ["bunchy top", "narrow leaves", "bunchy", "rosette"] },
    { id: "poorHarvest", en: "Poor flowering / low yield", mix: "Maua kidogo / yield ndogo", sw: "Maua machache au mavuno kidogo", terms: ["poor yield", "low yield", "poor flowering", "no flowers", "poor grain filling"] }
  ];

  const P = (name, type, signs, keywords) => ({
    name, type, signs, keywords
  });

  const CROPS = [
    {
      id: "maize", name: "Maize", sw: "Mahindi", group: "Cereals",
      counties: ["Trans Nzoia", "Uasin Gishu", "Nakuru", "Bungoma", "Kitui", "Meru", "Kakamega", "Nandi"],
      planting: "Use quality seed suited to local conditions. Follow the seed label for spacing, planting depth and plant population.",
      scouting: "Inspect the growing whorl, leaves and stems regularly. Record fresh damage and how it spreads.",
      harvest: "Check maturity and drying before storage. Keep grain dry and protected from insects and mould.",
      issues: [
        P("Fall armyworm", "Pest", ["holes", "whorl", "insects"], ["fall armyworm", "whorl", "frass", "caterpillar", "chewed leaves"]),
        P("Maize lethal necrosis", "Disease", ["mosaic", "yellow", "stunting", "drying"], ["maize lethal necrosis", "mlnd", "mottling", "dead heart", "poor grain filling"]),
        P("Maize streak disease", "Disease", ["streaks", "yellow", "stunting"], ["maize streak", "yellow streaks", "parallel streaks"]),
        P("Stem borers", "Pest", ["stemDamage", "wilting", "drying"], ["stem borer", "stem tunnel", "dead heart", "hollow stem"]),
        P("Head smut", "Disease", ["galls", "poorHarvest"], ["head smut", "smut gall", "black spores"])
      ]
    },
    {
      id: "beans", name: "Dry beans", sw: "Maharagwe", group: "Legumes",
      counties: ["Meru", "Kiambu", "Nakuru", "Bungoma", "Kakamega", "Nyeri", "Machakos"],
      planting: "Use healthy seed and a variety suited to the area. Good drainage and rotation can help reduce some diseases.",
      scouting: "Check leaf surfaces, stems and pods for spots, insects and unusual colour changes.",
      harvest: "Harvest at the right maturity and dry safely before storage. Keep grain away from moisture and pests.",
      issues: [
        P("Bean rust", "Disease", ["orangePustules", "drying"], ["bean rust", "rust pustules", "orange pustules"]),
        P("Bean anthracnose", "Disease", ["spots", "fruitDamage"], ["anthracnose", "dark sunken lesions", "pod lesions"]),
        P("Bean fly", "Pest", ["wilting", "stemDamage", "yellow"], ["bean fly", "stem maggot", "stem tunnelling"]),
        P("Bean aphids", "Pest", ["insects", "curling", "sticky"], ["aphids", "aphid colony", "sticky honeydew"]),
        P("Angular leaf spot", "Disease", ["spots", "drying"], ["angular leaf spot", "angular lesions", "vein-limited spots"])
      ]
    },
    {
      id: "tomato", name: "Tomatoes", sw: "Nyanya", group: "Horticulture",
      counties: ["Nakuru", "Kiambu", "Kirinyaga", "Meru", "Kajiado", "Machakos"],
      planting: "Start with healthy seedlings and suitable spacing. Avoid prolonged leaf wetness and manage watering carefully.",
      scouting: "Inspect leaf undersides, new shoots and fruit. Note whether spots begin on older or younger leaves.",
      harvest: "Pick at the maturity stage required by the buyer. Handle fruit gently and remove damaged fruit from healthy produce.",
      issues: [
        P("Tomato leaf miner (Tuta absoluta)", "Pest", ["holes", "fruitDamage", "insects"], ["tuta absoluta", "tomato leaf miner", "leaf mines", "pinholes in fruit"]),
        P("Late blight", "Disease", ["spots", "drying", "mould"], ["late blight", "water soaked lesions", "white growth underneath", "phytophthora"]),
        P("Early blight", "Disease", ["spots", "drying"], ["early blight", "concentric rings", "target spots"]),
        P("Bacterial wilt", "Disease", ["wilting", "drying"], ["bacterial wilt", "sudden wilt", "brown vascular tissue"]),
        P("Whiteflies", "Pest", ["insects", "yellow", "sticky"], ["whitefly", "whiteflies", "tiny white insects", "honeydew"])
      ]
    },
    {
      id: "potato", name: "Irish potatoes", sw: "Viazi", group: "Roots",
      counties: ["Nyandarua", "Nakuru", "Kiambu", "Meru", "Elgeyo-Marakwet"],
      planting: "Use certified seed potatoes and suitable rotation. Avoid waterlogging and follow locally recommended ridging practices.",
      scouting: "Inspect leaves for fast-spreading dark patches and stems for wilting. Examine stored tubers for damage.",
      harvest: "Avoid handling wet or damaged tubers roughly. Store in suitable conditions and remove rotting produce.",
      issues: [
        P("Potato late blight", "Disease", ["spots", "drying", "mould"], ["potato late blight", "water soaked leaf spots", "white growth underside"]),
        P("Potato bacterial wilt", "Disease", ["wilting", "yellow"], ["potato bacterial wilt", "bacterial wilt", "brown vascular tissue"]),
        P("Potato tuber moth", "Pest", ["holes", "fruitDamage"], ["potato tuber moth", "tuber tunnels", "tuber holes", "leaf mines"])
      ]
    },
    {
      id: "avocado", name: "Avocado", sw: "Parachichi", group: "Horticulture",
      counties: ["Kiambu", "Murang'a", "Meru", "Nyeri", "Kisii", "Nakuru"],
      planting: "Use healthy planting material and ensure drainage. Avoid damaging roots and monitor moisture during dry periods.",
      scouting: "Inspect young shoots, leaves and fruit. Note black spots, fruit lesions, scarring or root decline.",
      harvest: "Use maturity guidance for the variety and market. Harvest carefully to avoid bruising and unnecessary stem damage.",
      issues: [
        P("Avocado thrips", "Pest", ["insects", "fruitDamage"], ["avocado thrips", "thrips", "fruit scarring", "silvering"]),
        P("Phytophthora root rot", "Disease", ["rootRot", "yellow", "wilting"], ["phytophthora root rot", "root rot", "dark roots", "root decay"]),
        P("Avocado anthracnose", "Disease", ["spots", "fruitDamage", "rot"], ["avocado anthracnose", "dark fruit lesions", "fruit rot"]),
        P("Fruit flies", "Pest", ["fruitDamage", "rot"], ["fruit fly", "maggot in fruit", "fruit punctures"])
      ]
    },
    {
      id: "green-gram", name: "Green grams", sw: "Ndengu", group: "Legumes",
      counties: ["Machakos", "Kitui", "Makueni", "Tharaka-Nithi", "Embu"],
      planting: "Choose a locally suitable variety and well-drained field. Plan around the expected rainfall and avoid prolonged waterlogging.",
      scouting: "Check leaves, flowers and pods for insects, spots or powdery growth.",
      harvest: "Harvest mature pods at the right time and dry grain properly before safe storage.",
      issues: [
        P("Green gram aphids", "Pest", ["insects", "curling", "sticky"], ["green gram aphid", "aphids", "curled leaves", "honeydew"]),
        P("Pod borers", "Pest", ["fruitDamage", "holes", "insects"], ["pod borer", "pod holes", "caterpillar in pods"]),
        P("Powdery mildew", "Disease", ["powder", "drying"], ["powdery mildew", "white powdery growth"]),
        P("Cercospora leaf spot", "Disease", ["spots", "drying"], ["cercospora", "cercospora leaf spot", "brown leaf spots"])
      ]
    },
    {
      id: "kale", name: "Kale / Sukuma wiki", sw: "Sukuma wiki", group: "Horticulture",
      counties: ["Nairobi City", "Kiambu", "Nakuru", "Nyeri", "Kakamega", "Meru"],
      planting: "Use healthy seedlings and maintain consistent moisture without waterlogging. Suitable spacing supports airflow.",
      scouting: "Inspect the undersides of leaves for caterpillars, aphids and irregular feeding holes.",
      harvest: "Harvest clean outer leaves regularly and keep harvested leaves shaded and handled gently.",
      issues: [
        P("Diamondback moth", "Pest", ["holes", "insects"], ["diamondback moth", "small green caterpillar", "windowing leaves"]),
        P("Cabbage aphids", "Pest", ["insects", "curling", "sticky"], ["cabbage aphid", "aphid colonies", "sticky leaves"]),
        P("Black rot", "Disease", ["yellow", "spots", "drying"], ["black rot", "v shaped yellow lesions", "black veins"]),
        P("Downy mildew", "Disease", ["spots", "mould", "yellow"], ["downy mildew", "grey growth underneath leaves"])
      ]
    },
    {
      id: "banana", name: "Bananas", sw: "Ndizi", group: "Horticulture",
      counties: ["Kisumu", "Kakamega", "Busia", "Meru", "Kirinyaga", "Migori"],
      planting: "Use healthy planting material, maintain soil moisture and protect the field from standing water.",
      scouting: "Inspect leaves, stems and bunches for spots, unusual yellowing or reduced leaf size.",
      harvest: "Harvest at the maturity stage needed for the market and handle bunches gently.",
      issues: [
        P("Banana weevil", "Pest", ["stemDamage", "wilting", "stunting"], ["banana weevil", "corm tunnelling", "corm tunnels"]),
        P("Fusarium wilt", "Disease", ["yellow", "wilting", "drying"], ["fusarium wilt", "panama disease", "split pseudostem", "brown vascular"]),
        P("Black Sigatoka", "Disease", ["spots", "drying"], ["black sigatoka", "black streaks", "leaf streaks"]),
        P("Banana bunchy top", "Disease", ["bunchy", "stunting", "curling"], ["banana bunchy top", "bunchy top", "narrow upright leaves"])
      ]
    },
    {
      id: "cassava", name: "Cassava", sw: "Muhogo", group: "Roots",
      counties: ["Kilifi", "Kwale", "Busia", "Siaya", "Migori", "Kitui", "Makueni"],
      planting: "Use healthy planting stakes from reliable sources. Select varieties recommended for the area and keep weeds under control.",
      scouting: "Check leaves for mosaics or distortion and inspect stems for unusual damage or poor growth.",
      harvest: "Harvest according to the variety and intended use. Keep harvested roots shaded and process or market promptly as appropriate.",
      issues: [
        P("Cassava mosaic disease", "Disease", ["mosaic", "curling", "stunting"], ["cassava mosaic", "leaf mosaic", "yellow mosaic"]),
        P("Cassava brown streak disease", "Disease", ["yellow", "rot", "stunting"], ["cassava brown streak", "brown root necrosis", "root necrosis"]),
        P("Cassava green mite", "Pest", ["yellow", "curling", "drying"], ["cassava green mite", "mite damage", "leaf distortion"]),
        P("Cassava mealybugs", "Pest", ["insects", "curling", "stunting"], ["cassava mealybug", "mealybugs", "white cottony insects"])
      ]
    },
    {
      id: "sweet-potato", name: "Sweet potatoes", sw: "Viazi vitamu", group: "Roots",
      counties: ["Busia", "Bungoma", "Migori", "Siaya", "Homa Bay", "Kitui"],
      planting: "Use healthy vines and varieties suited to the local area. Manage weeds early and avoid waterlogged ground.",
      scouting: "Inspect leaves and stems, and check tubers for feeding tunnels or rotting.",
      harvest: "Avoid bruising roots and protect harvested produce from excessive moisture and physical damage.",
      issues: [
        P("Sweet potato weevils", "Pest", ["holes", "rot", "wilting"], ["sweet potato weevil", "tuber tunnels", "root tunnels"]),
        P("Sweet potato virus disease", "Disease", ["mosaic", "curling", "yellow"], ["sweet potato virus", "feathery mottle", "leaf mosaic"]),
        P("Sweet potato scab", "Disease", ["spots", "drying"], ["sweet potato scab", "raised scabby lesions"])
      ]
    },
    {
      id: "sorghum", name: "Sorghum", sw: "Mtama", group: "Cereals",
      counties: ["Kitui", "Makueni", "Machakos", "Tharaka-Nithi", "Baringo"],
      planting: "Choose varieties suited to local rainfall and the intended use. Follow locally recommended seed rate and spacing.",
      scouting: "Inspect young shoots, stems and heads for insect damage and unusual spots.",
      harvest: "Harvest mature heads and dry grain properly before storage.",
      issues: [
        P("Sorghum shoot fly", "Pest", ["stemDamage", "wilting", "drying"], ["sorghum shoot fly", "dead heart", "central shoot dries"]),
        P("Sorghum anthracnose", "Disease", ["spots", "drying"], ["sorghum anthracnose", "leaf lesions"]),
        P("Sorghum smut", "Disease", ["galls", "poorHarvest"], ["sorghum smut", "smut sori", "black powdery heads"])
      ]
    },
    {
      id: "finger-millet", name: "Finger millet", sw: "Wimbi", group: "Cereals",
      counties: ["Kakamega", "Bungoma", "Busia", "Kitui", "Machakos"],
      planting: "Use seed and planting practices recommended for your locality. Keep the seedbed prepared and manage weeds early.",
      scouting: "Check leaves and heads for spots, drying or abnormal growth.",
      harvest: "Harvest mature heads at the right stage and dry the grain safely.",
      issues: [
        P("Finger millet blast", "Disease", ["spots", "drying", "stemDamage"], ["finger millet blast", "blast lesions", "neck blast"]),
        P("Aphids", "Pest", ["insects", "curling", "sticky"], ["aphids", "aphid colony", "honeydew"]),
        P("Head smut", "Disease", ["galls", "poorHarvest"], ["head smut", "smut heads", "black spores"])
      ]
    },
    {
      id: "rice", name: "Rice", sw: "Mchele", group: "Cereals",
      counties: ["Kirinyaga", "Kisumu", "Busia", "Tana River"],
      planting: "Follow local rice scheme guidance for variety, planting method and water management.",
      scouting: "Inspect leaf lesions, stems and panicles. Record whether damage is concentrated in patches.",
      harvest: "Harvest at recommended maturity and dry grain to suitable storage moisture.",
      issues: [
        P("Rice blast", "Disease", ["spots", "drying"], ["rice blast", "diamond shaped lesions", "neck blast"]),
        P("Bacterial leaf blight", "Disease", ["yellow", "drying"], ["bacterial leaf blight", "yellow leaf margins", "wavy leaf lesions"]),
        P("Rice stem borers", "Pest", ["stemDamage", "drying"], ["rice stem borer", "dead heart", "white head"])
      ]
    },
    {
      id: "onion", name: "Onions", sw: "Vitunguu", group: "Horticulture",
      counties: ["Nakuru", "Kiambu", "Meru", "Laikipia", "Kajiado"],
      planting: "Use healthy seedlings and follow recommended spacing. Avoid prolonged leaf wetness and improve airflow.",
      scouting: "Check narrow leaves for silvery feeding marks, spots, wilting or downy growth.",
      harvest: "Allow the crop to reach suitable maturity and cure bulbs under appropriate dry, ventilated conditions.",
      issues: [
        P("Onion thrips", "Pest", ["insects", "drying", "yellow"], ["onion thrips", "silvery streaks", "thrips"]),
        P("Purple blotch", "Disease", ["spots", "drying"], ["purple blotch", "purple oval lesions"]),
        P("Downy mildew", "Disease", ["mould", "yellow", "drying"], ["onion downy mildew", "grey violet growth"])
      ]
    },
    {
      id: "cabbage", name: "Cabbage", sw: "Kabichi", group: "Horticulture",
      counties: ["Nakuru", "Nyandarua", "Kiambu", "Meru", "Nyeri"],
      planting: "Use healthy seedlings and maintain spacing and drainage. Rotate away from related crops where practical.",
      scouting: "Check leaf undersides and heads for caterpillars, feeding holes, yellowing and decay.",
      harvest: "Harvest firm heads at the appropriate stage and keep produce clean and shaded.",
      issues: [
        P("Diamondback moth", "Pest", ["holes", "insects"], ["diamondback moth", "windowing leaves", "small green caterpillar"]),
        P("Cabbage aphids", "Pest", ["insects", "curling", "sticky"], ["cabbage aphid", "aphids", "sticky leaves"]),
        P("Black rot", "Disease", ["yellow", "drying", "spots"], ["black rot", "v shaped lesions", "black veins"]),
        P("Clubroot", "Disease", ["rootRot", "wilting", "stunting"], ["clubroot", "swollen roots", "clubbed roots"])
      ]
    },
    {
      id: "mango", name: "Mango", sw: "Embe", group: "Horticulture",
      counties: ["Makueni", "Machakos", "Kilifi", "Kwale", "Murang'a", "Kitui"],
      planting: "Use healthy planting material and maintain appropriate tree spacing. Pruning and sanitation should follow local guidance.",
      scouting: "Inspect flowers, young fruit and leaves for spots, powdery growth or insect punctures.",
      harvest: "Follow variety-specific maturity guidance and handle fruit gently to avoid bruising.",
      issues: [
        P("Mango fruit fly", "Pest", ["fruitDamage", "rot"], ["mango fruit fly", "fruit fly punctures", "maggots in fruit"]),
        P("Mango anthracnose", "Disease", ["spots", "fruitDamage", "rot"], ["mango anthracnose", "dark fruit spots", "flower blight"]),
        P("Powdery mildew", "Disease", ["powder", "fruitDrop"], ["mango powdery mildew", "white powder", "flower drop"]),
        P("Mango seed weevil", "Pest", ["fruitDamage", "holes"], ["mango seed weevil", "seed damage", "weevil in seed"])
      ]
    },
    {
      id: "coffee", name: "Coffee", sw: "Kahawa", group: "Cash crops",
      counties: ["Kiambu", "Murang'a", "Nyeri", "Kirinyaga", "Meru", "Nakuru"],
      planting: "Use recommended varieties and keep the field well managed. Follow local guidance on pruning, nutrition and shade.",
      scouting: "Inspect leaves, berries and branches for rust-like spots, damaged berries and unusual dieback.",
      harvest: "Pick according to local quality requirements and handle harvested cherries promptly.",
      issues: [
        P("Coffee leaf rust", "Disease", ["orangePustules", "yellow", "drying"], ["coffee leaf rust", "orange powder underside leaves"]),
        P("Coffee berry disease", "Disease", ["fruitDamage", "spots", "rot"], ["coffee berry disease", "dark sunken berry lesions"]),
        P("Coffee berry borer", "Pest", ["fruitDamage", "holes"], ["coffee berry borer", "berry entry hole", "borer damage"])
      ]
    },
    {
      id: "tea", name: "Tea", sw: "Chai", group: "Cash crops",
      counties: ["Kericho", "Nandi", "Kakamega", "Kiambu", "Nyeri", "Murang'a"],
      planting: "Use planting material and pruning cycles recommended for your production area. Maintain soil cover and appropriate nutrition.",
      scouting: "Inspect shoots and leaves for unusual blisters, mite damage, discolouration or dieback.",
      harvest: "Follow local plucking standards and keep fresh leaf clean and handled as required by the processor.",
      issues: [
        P("Tea mosquito bug", "Pest", ["spots", "stemDamage", "drying"], ["tea mosquito bug", "shoot lesions", "blackened shoots"]),
        P("Blister blight", "Disease", ["spots", "mould"], ["tea blister blight", "translucent spots", "blisters on young leaves"]),
        P("Red spider mites", "Pest", ["yellow", "drying", "insects"], ["red spider mite", "fine stippling", "bronzing"])
      ]
    },
    {
      id: "cowpea", name: "Cowpeas", sw: "Kunde", group: "Legumes",
      counties: ["Kitui", "Machakos", "Makueni", "Kilifi", "Tana River"],
      planting: "Select seed suited to local conditions and use well-drained soil. Check variety recommendations before planting.",
      scouting: "Inspect leaves, flowers and pods for insects, spots and abnormal growth.",
      harvest: "Pods may mature unevenly. Harvest and dry at appropriate stages to reduce loss and mould.",
      issues: [
        P("Cowpea aphids", "Pest", ["insects", "curling", "sticky"], ["cowpea aphid", "black aphids", "honeydew"]),
        P("Legume pod borer", "Pest", ["fruitDamage", "holes", "insects"], ["legume pod borer", "maruca", "pod holes"]),
        P("Cowpea bacterial blight", "Disease", ["spots", "yellow", "drying"], ["cowpea bacterial blight", "water soaked lesions"]),
        P("Cowpea powdery mildew", "Disease", ["powder", "drying"], ["cowpea powdery mildew", "white powder"])
      ]
    },
    {
      id: "pigeon-pea", name: "Pigeon peas", sw: "Mbaazi", group: "Legumes",
      counties: ["Kitui", "Machakos", "Makueni", "Embu", "Tharaka-Nithi"],
      planting: "Use locally recommended planting material and manage weeds early. Check the local planting window.",
      scouting: "Look for pod damage, insect larvae, yellowing and wilting.",
      harvest: "Harvest mature pods at the appropriate stage and dry grain properly before storage.",
      issues: [
        P("Pod fly", "Pest", ["fruitDamage", "holes"], ["pigeon pea pod fly", "pod fly", "larvae in pods"]),
        P("Pod borer", "Pest", ["fruitDamage", "insects", "holes"], ["pigeon pea pod borer", "pod holes", "caterpillar"]),
        P("Fusarium wilt", "Disease", ["wilting", "yellow"], ["fusarium wilt", "vascular browning", "one sided wilt"])
      ]
    },
    {
      id: "wheat", name: "Wheat", sw: "Ngano", group: "Cereals",
      counties: ["Narok", "Uasin Gishu", "Nakuru", "Laikipia", "Trans Nzoia"],
      planting: "Use certified seed and planting dates recommended for the production area. Maintain field hygiene and suitable nutrition.",
      scouting: "Inspect leaves and stems for rust pustules, spots and insect colonies.",
      harvest: "Harvest at suitable maturity and dry grain to appropriate storage moisture.",
      issues: [
        P("Wheat stem rust", "Disease", ["orangePustules", "drying"], ["wheat stem rust", "rust pustules", "reddish brown pustules"]),
        P("Wheat leaf rust", "Disease", ["orangePustules", "yellow"], ["wheat leaf rust", "orange leaf pustules"]),
        P("Aphids", "Pest", ["insects", "sticky", "yellow"], ["wheat aphids", "aphid colonies", "honeydew"])
      ]
    },
    {
      id: "sugarcane", name: "Sugarcane", sw: "Miwa", group: "Cash crops",
      counties: ["Kakamega", "Kisumu", "Busia", "Bungoma", "Migori"],
      planting: "Use healthy planting material and follow local recommendations on variety, spacing and field preparation.",
      scouting: "Inspect stems and leaves for tunnelling, dead hearts, streaks and drying.",
      harvest: "Follow mill or local maturity guidance and avoid leaving harvested cane exposed longer than necessary.",
      issues: [
        P("Sugarcane borers", "Pest", ["stemDamage", "wilting", "drying"], ["sugarcane borer", "stem tunnel", "dead heart"]),
        P("Sugarcane smut", "Disease", ["drying", "stunting"], ["sugarcane smut", "black whip"]),
        P("Leaf scald", "Disease", ["streaks", "drying"], ["leaf scald", "white pencil lines", "white leaf streaks"])
      ]
    }
  ];

  const CROP_BY_ID = Object.fromEntries(CROPS.map(crop => [crop.id, crop]));

  /* ==========================================================
     3. FORM OPTIONS
  ========================================================== */

  const STAGES = [
    ["planning", "stagePlanning"],
    ["seedling", "stageSeedling"],
    ["vegetative", "stageVegetative"],
    ["flowering", "stageFlowering"],
    ["harvest", "stageHarvest"]
  ];

  const ISSUES = [
    ["normal", "issueNormal"],
    ["dry", "issueDry"],
    ["wet", "issueWet"],
    ["pests", "issuePest"],
    ["disease", "issueDisease"],
    ["yellow", "issueYellow"],
    ["harvest", "issueHarvest"],
    ["soil", "issueSoil"]
  ];

  const SOILS = [
    ["unknown", "soilUnknown"],
    ["loam", "soilLoam"],
    ["clay", "soilClay"],
    ["sandy", "soilSandy"],
    ["volcanic", "soilVolcanic"]
  ];

  const WATERS = [
    ["rain", "waterRain"],
    ["irrigation", "waterIrrigation"],
    ["limited", "waterLimited"],
    ["uncertain", "waterUncertain"]
  ];

  function addOptions(select, pairs, selectedValue = "") {
    if (!select) return;
    select.innerHTML = "";

    pairs.forEach(([value, label]) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = label;
      select.appendChild(option);
    });

    if (pairs.some(pair => pair[0] === selectedValue)) {
      select.value = selectedValue;
    }
  }

  function renderCountyOptions() {
    const selected = $("#saCounty")?.value || "Nakuru";
    const librarySelected = $("#saLibraryCounty")?.value || "all";

    const mainPairs = COUNTIES.map(county => [county, county]);
    addOptions($("#saCounty"), mainPairs, selected);

    addOptions(
      $("#saLibraryCounty"),
      [["all", tr("allCounties")], ...COUNTIES.map(county => [county, county])],
      librarySelected
    );
  }

  function renderCropOptions() {
    const selected = $("#saCrop")?.value || "maize";
    const pairs = CROPS.map(crop => [
      crop.id,
      language === "sw" ? `${crop.name} (${crop.sw})` : language === "mix" ? `${crop.name} (${crop.sw})` : crop.name
    ]);
    addOptions($("#saCrop"), pairs, selected);
  }

  function renderFormOptions() {
    addOptions($("#saStage"), STAGES.map(([value, label]) => [value, tr(label)]), $("#saStage")?.value || "planning");
    addOptions($("#saIssue"), ISSUES.map(([value, label]) => [value, tr(label)]), $("#saIssue")?.value || "normal");
    addOptions($("#saSoil"), SOILS.map(([value, label]) => [value, tr(label)]), $("#saSoil")?.value || "unknown");
    addOptions($("#saWater"), WATERS.map(([value, label]) => [value, tr(label)]), $("#saWater")?.value || "rain");

    const groupPairs = [
      ["all", tr("allGroups")],
      ["Cereals", tr("groupCereals")],
      ["Legumes", tr("groupLegumes")],
      ["Horticulture", tr("groupHorticulture")],
      ["Roots", tr("groupRoots")],
      ["Cash crops", tr("groupCash")],
      ["Other crops", tr("groupOther")]
    ];

    addOptions($("#saCropGroup"), groupPairs, $("#saCropGroup")?.value || "all");

    if ($("#saCropSearch")) $("#saCropSearch").placeholder = tr("searchCrop");
  }

  /* ==========================================================
     4. SYMPTOM PICKER
  ========================================================== */

  function selectedSigns() {
    return $$("#saSymptomChecks input[type='checkbox']:checked").map(input => input.value);
  }

  function renderSymptomChecks() {
    const container = $("#saSymptomChecks");
    if (!container) return;

    const selected = new Set(selectedSigns());
    container.innerHTML = "";

    SIGNS.forEach(sign => {
      const label = document.createElement("label");
      label.className = "sa-symptom-chip";

      const input = document.createElement("input");
      input.type = "checkbox";
      input.value = sign.id;
      input.checked = selected.has(sign.id);

      const text = document.createElement("span");
      text.textContent = sign[language] || sign.en;

      label.append(input, text);
      container.appendChild(label);
    });
  }

  function signLabel(id) {
    const sign = SIGNS.find(item => item.id === id);
    return sign ? (sign[language] || sign.en) : id;
  }

  function normalise(text) {
    return String(text || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  /* ==========================================================
     5. RULE-BASED PEST & DISEASE MATCHING
  ========================================================== */

  function symptomMatch(crop, freeText, checkedSigns) {
    const text = normalise(freeText);
    const selected = new Set(checkedSigns || []);
    const results = [];

    for (const issue of crop.issues) {
      let score = 0;
      const reasons = [];

      issue.signs.forEach(id => {
        if (selected.has(id)) {
          score += 4;
          reasons.push(signLabel(id));
        }
      });

      issue.keywords.forEach(keyword => {
        const phrase = normalise(keyword);
        if (phrase && text.includes(phrase)) {
          score += phrase.includes(" ") ? 3 : 2;
          reasons.push(keyword);
        }
      });

      if (score > 0) {
        results.push({
          name: issue.name,
          type: issue.type,
          score,
          signIds: issue.signs,
          reasons: [...new Set(reasons)].slice(0, 6)
        });
      }
    }

    results.sort((a, b) => b.score - a.score);

    /*
      Do not present every possible pest for a crop. Show the strongest
      few candidates and label them as possible matches, not diagnoses.
    */
    return results.slice(0, 4);
  }

  function cropTips(crop, reportData) {
    const tips = [
      crop.planting,
      crop.scouting,
      crop.harvest
    ];

    const issue = reportData.issue;
    const soil = reportData.soil;
    const water = reportData.water;

    const generic = LANG[language] || LANG.mix;

    if (issue === "dry" || water === "limited") tips.unshift(generic.dryAdvice);
    if (issue === "wet") tips.unshift(generic.wetAdvice);
    if (issue === "pests") tips.unshift(generic.pestAdvice);
    if (issue === "disease") tips.unshift(generic.diseaseAdvice);
    if (issue === "yellow") tips.unshift(generic.yellowAdvice);
    if (issue === "soil" || soil === "sandy" || soil === "clay") tips.unshift(generic.soilAdvice);
    if (issue === "harvest" || reportData.stage === "harvest") tips.unshift(generic.harvestAdvice);
    if (water === "rain") tips.push(generic.waterAdvice);

    return [...new Set(tips)];
  }

  function contextNote(county, area) {
    const base = tr("locallyVariable");
    return area ? `${area}, ${county} County. ${base}` : `${county} County. ${base}`;
  }

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]);
  }

  function getFormData() {
    return {
      county: $("#saCounty")?.value || "Nakuru",
      area: $("#saArea")?.value.trim() || "",
      cropId: $("#saCrop")?.value || "maize",
      stage: $("#saStage")?.value || "planning",
      issue: $("#saIssue")?.value || "normal",
      soil: $("#saSoil")?.value || "unknown",
      water: $("#saWater")?.value || "rain",
      farmSize: $("#saFarmSize")?.value || "",
      notes: $("#saNotes")?.value.trim() || "",
      symptoms: $("#saSymptoms")?.value.trim() || "",
      signs: selectedSigns(),
      photoName: currentPhotoName
    };
  }

  function createReport() {
    const data = getFormData();
    const crop = CROP_BY_ID[data.cropId];

    if (!crop) {
      throw new Error("Please choose a supported crop.");
    }

    const matches = symptomMatch(crop, data.symptoms, data.signs);
    const tips = cropTips(crop, data);

    const report = {
      id: `report-${Date.now()}`,
      createdAt: new Date().toISOString(),
      language,
      cropId: crop.id,
      cropName: crop.name,
      county: data.county,
      area: data.area,
      stage: data.stage,
      issue: data.issue,
      soil: data.soil,
      water: data.water,
      farmSize: data.farmSize,
      notes: data.notes,
      symptoms: data.symptoms,
      signs: data.signs,
      matches,
      tips,
      photoName: data.photoName,
      photoAnalysis: photoAnalysis.map(match => ({
        name: String(match.name || "Possible match"),
        type: String(match.type || "Possible issue"),
        confidence: match.confidence ? String(match.confidence) : ""
      }))
    };

    return report;
  }

  /* ==========================================================
     6. REPORT RENDERING
  ========================================================== */

  function renderReport(report) {
    const output = $("#saReportOutput");
    if (!output) return;

    if (!report) {
      output.innerHTML = `
        <div class="sa-empty-report">
          <span class="sa-empty-icon" aria-hidden="true">📋</span>
          <h3>${escapeHTML(tr("noReport"))}</h3>
          <p>${escapeHTML(tr("noReportHint"))}</p>
        </div>
      `;

      if ($("#saReportActions")) $("#saReportActions").hidden = true;
      return;
    }

    const crop = CROP_BY_ID[report.cropId] || CROPS[0];
    const date = new Date(report.createdAt).toLocaleString(
      language === "sw" ? "sw-KE" : "en-KE"
    );

    const matchCards = report.matches.length
      ? report.matches.map(match => `
          <article class="sa-match-card">
            <div class="sa-match-heading">
              <span class="sa-match-type">${escapeHTML(match.type)}</span>
              <strong>${escapeHTML(match.name)}</strong>
            </div>
            <p>${escapeHTML(tr("possibleOnly"))}</p>
            ${
              match.reasons.length
                ? `<p class="sa-match-signs"><strong>${escapeHTML(tr("symptomsEntered"))}:</strong> ${escapeHTML(match.reasons.join(", "))}</p>`
                : ""
            }
          </article>
        `).join("")
      : `<div class="sa-no-match">
          <strong>${escapeHTML(tr("noMatches"))}</strong>
          <p>${escapeHTML(tr("noMatchesHint"))}</p>
        </div>`;

    const photoCards = report.photoAnalysis.length
      ? report.photoAnalysis.map(item => `
          <li><strong>${escapeHTML(item.name)}</strong> (${escapeHTML(item.type)})</li>
        `).join("")
      : "";

    const matchDisclaimer = report.matches.length
      ? `<p class="sa-disclaimer">${escapeHTML(tr("matchCaution"))}</p>`
      : "";

    output.innerHTML = `
      <article class="sa-report-card" id="saPrintableReport">
        <header class="sa-report-header">
          <div>
            <span class="sa-eyebrow">${escapeHTML(tr("report"))}</span>
            <h3>${escapeHTML(crop.name)} · ${escapeHTML(report.county)} County</h3>
            <p>${escapeHTML(contextNote(report.county, report.area))}</p>
          </div>
          <div class="sa-report-stamp">MAVUNOBRIDGE<br>SMART ASSIST</div>
        </header>

        <div class="sa-report-meta">
          <div><small>${escapeHTML(tr("generatedAt"))}</small><strong>${escapeHTML(date)}</strong></div>
          <div><small>${escapeHTML(tr("stage"))}</small><strong>${escapeHTML(stageLabel(report.stage))}</strong></div>
          <div><small>${escapeHTML(tr("concern"))}</small><strong>${escapeHTML(issueLabel(report.issue))}</strong></div>
        </div>

        <section class="sa-report-block">
          <h4>${escapeHTML(tr("context"))}</h4>
          <p>${escapeHTML(contextNote(report.county, report.area))}</p>
          ${report.farmSize ? `<p><strong>${escapeHTML(tr("farmSize"))}:</strong> ${escapeHTML(report.farmSize)} acres</p>` : ""}
          ${report.notes ? `<p><strong>${escapeHTML(tr("notes"))}:</strong> ${escapeHTML(report.notes)}</p>` : ""}
        </section>

        <section class="sa-report-block">
          <h4>${escapeHTML(tr("possibleMatches"))}</h4>
          <p class="sa-match-caveat">${escapeHTML(tr("possibleOnly"))}</p>
          <div class="sa-match-list">${matchCards}</div>
          ${matchDisclaimer}
        </section>

        ${report.photoName ? `
          <section class="sa-report-block">
            <h4>${escapeHTML(tr("photoEvidence"))}</h4>
            <p>${escapeHTML(report.photoName)}</p>
            <p>${escapeHTML(photoAnalysisStatus || tr("photoWaiting"))}</p>
            ${photoCards ? `<ul>${photoCards}</ul>` : ""}
          </section>
        ` : ""}

        <section class="sa-report-block">
          <h4>${escapeHTML(tr("growingTips"))}</h4>
          <ul class="sa-report-tips">
            ${report.tips.map(tip => `<li>${escapeHTML(tip)}</li>`).join("")}
          </ul>
        </section>

        <section class="sa-report-block">
          <h4>${escapeHTML(tr("nextSteps"))}</h4>
          <ol class="sa-report-tips">
            ${makeNextSteps(report).map(step => `<li>${escapeHTML(step)}</li>`).join("")}
          </ol>
        </section>

        <p class="sa-report-warning">${escapeHTML(tr("urgent"))}</p>
        <p class="sa-report-footer">${escapeHTML(tr("sourceNote"))}</p>
      </article>
    `;

    if ($("#saReportActions")) $("#saReportActions").hidden = false;
  }

  function stageLabel(value) {
    const map = {
      planning: "stagePlanning",
      seedling: "stageSeedling",
      vegetative: "stageVegetative",
      flowering: "stageFlowering",
      harvest: "stageHarvest"
    };
    return tr(map[value] || "stagePlanning");
  }

  function issueLabel(value) {
    const map = {
      normal: "issueNormal",
      dry: "issueDry",
      wet: "issueWet",
      pests: "issuePest",
      disease: "issueDisease",
      yellow: "issueYellow",
      harvest: "issueHarvest",
      soil: "issueSoil"
    };
    return tr(map[value] || "issueNormal");
  }

  function makeNextSteps(report) {
    const result = [];
    const answers = LANG[language] || LANG.mix;

    if (report.matches.length) {
      result.push(answers.pestAdvice);
      result.push(answers.diseaseAdvice);
    } else {
      result.push(answers.questionFallback);
    }

    if (report.issue === "dry" || report.water === "limited") result.push(answers.dryAdvice);
    if (report.issue === "wet") result.push(answers.wetAdvice);
    if (report.issue === "soil" || report.soil === "sandy" || report.soil === "clay") result.push(answers.soilAdvice);
    if (report.issue === "harvest" || report.stage === "harvest") result.push(answers.harvestAdvice);

    result.push(answers.urgent);

    return [...new Set(result)].slice(0, 5);
  }

  function reportAsText(report) {
    const crop = CROP_BY_ID[report.cropId] || CROPS[0];

    return [
      "MAVUNOBRIDGE SMART ASSIST — FARM REPORT",
      "========================================",
      `${tr("generatedAt")}: ${new Date(report.createdAt).toLocaleString()}`,
      `${tr("crop")}: ${crop.name}`,
      `${tr("county")}: ${report.county}`,
      `${tr("area")}: ${report.area || "—"}`,
      `${tr("stage")}: ${stageLabel(report.stage)}`,
      `${tr("concern")}: ${issueLabel(report.issue)}`,
      `${tr("soil")}: ${report.soil}`,
      `${tr("water")}: ${report.water}`,
      `${tr("symptomsEntered")}: ${report.symptoms || "—"}`,
      "",
      `${tr("possibleMatches")}:`,
      ...(report.matches.length
        ? report.matches.map(match => `- ${match.name} (${match.type}): possible match only`)
        : [`- ${tr("noMatches")}`]),
      "",
      `${tr("growingTips")}:`,
      ...report.tips.map(tip => `- ${tip}`),
      "",
      `${tr("nextSteps")}:`,
      ...makeNextSteps(report).map(tip => `- ${tip}`),
      "",
      tr("matchCaution"),
      tr("urgent"),
      tr("sourceNote")
    ].join("\n");
  }

  /* ==========================================================
     7. CROP LIBRARY & FILTERS
  ========================================================== */

  function cropMatchesCounty(crop, county) {
    if (county === "all") return true;
    return crop.counties.includes(county) || crop.counties.length === 0;
  }

  function renderCropLibrary() {
    const grid = $("#saCropLibraryGrid");
    if (!grid) return;

    const search = normalise($("#saCropSearch")?.value || "");
    const group = $("#saCropGroup")?.value || "all";
    const county = $("#saLibraryCounty")?.value || "all";

    const filtered = CROPS.filter(crop => {
      const text = normalise(`${crop.name} ${crop.sw} ${crop.group} ${crop.counties.join(" ")}`);
      const matchesSearch = !search || text.includes(search);
      const matchesGroup = group === "all" || crop.group === group;
      const matchesCounty = cropMatchesCounty(crop, county);

      return matchesSearch && matchesGroup && matchesCounty;
    });

    grid.innerHTML = "";

    if (!filtered.length) {
      const empty = document.createElement("p");
      empty.className = "sa-empty-report";
      empty.textContent = tr("noCrops");
      grid.appendChild(empty);
      return;
    }

    filtered.forEach(crop => {
      const card = document.createElement("article");
      card.className = "sa-crop-card";

      const groupLabel = crop.group;
      const title = document.createElement("h3");
      title.textContent = language === "en" ? crop.name : `${crop.name} (${crop.sw})`;

      const groupBadge = document.createElement("span");
      groupBadge.className = "sa-crop-group";
      groupBadge.textContent = groupLabel;

      const cropHint = document.createElement("p");
      cropHint.textContent = crop.planting;

      const pestList = document.createElement("p");
      pestList.className = "sa-crop-issues";
      pestList.textContent = `${crop.issues.length} common issue guides: ${crop.issues.slice(0, 3).map(issue => issue.name).join(", ")}`;

      const button = document.createElement("button");
      button.type = "button";
      button.className = "sa-button sa-button-secondary";
      button.textContent = tr("useCrop");
      button.addEventListener("click", () => {
        const cropSelect = $("#saCrop");
        if (cropSelect) cropSelect.value = crop.id;

        renderSymptomChecks();

        $("#farmPlanner")?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

        cropSelect?.focus();
      });

      card.append(groupBadge, title, cropHint, pestList, button);
      grid.appendChild(card);
    });

    const countBadge = $("#cropLibrary .sa-step-tag");
    if (countBadge) countBadge.textContent = `${filtered.length} / ${CROPS.length} CROPS`;
  }

  /* ==========================================================
     8. PHOTO PREVIEW AND OPTIONAL IMAGE SERVICE
  ========================================================== */

  function imageToDataURL(file) {
    return new Promise((resolve, reject) => {
      if (!file || !file.type.startsWith("image/")) {
        reject(new Error(tr("badPhoto")));
        return;
      }

      if (file.size > MAX_PHOTO_BYTES) {
        reject(new Error(tr("badPhoto")));
        return;
      }

      const reader = new FileReader();

      reader.onerror = () => reject(new Error(tr("photoError")));

      reader.onload = () => {
        const image = new Image();

        image.onerror = () => reject(new Error(tr("photoError")));

        image.onload = () => {
          const ratio = Math.min(
            1,
            MAX_PHOTO_DIMENSION / Math.max(image.width, image.height)
          );

          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(image.width * ratio));
          canvas.height = Math.max(1, Math.round(image.height * ratio));

          const context = canvas.getContext("2d");

          if (!context) {
            reject(new Error(tr("photoError")));
            return;
          }

          context.drawImage(image, 0, 0, canvas.width, canvas.height);

          try {
            resolve(canvas.toDataURL("image/jpeg", 0.82));
          } catch (error) {
            reject(new Error(tr("photoError")));
          }
        };

        image.src = String(reader.result);
      };

      reader.readAsDataURL(file);
    });
  }

  function getImageEndpoint() {
    return String(window.MAVUNO_IMAGE_ANALYSIS_ENDPOINT || "").trim();
  }

  function setupPhotoAnalysisControls() {
    const preview = $("#saPhotoPreview");
    if (!preview || preview.querySelector(".sa-photo-analysis-controls")) return;

    const controls = document.createElement("div");
    controls.className = "sa-photo-analysis-controls";

    controls.innerHTML = `
      <label class="sa-photo-consent">
        <input type="checkbox" id="saPhotoConsent">
        <span>${escapeHTML(tr("photoConsent"))}</span>
      </label>
      <button type="button" class="sa-button sa-button-secondary" id="saAnalysePhotoButton">
        ${escapeHTML(tr("analysePhoto"))}
      </button>
      <p class="sa-status" id="saPhotoAnalysisStatus">${escapeHTML(tr("noImageService"))}</p>
    `;

    preview.appendChild(controls);

    $("#saAnalysePhotoButton")?.addEventListener("click", analysePhoto);
  }

  async function analysePhoto() {
    const endpoint = getImageEndpoint();
    const consent = $("#saPhotoConsent");

    if (!currentPhotoData) {
      showStatus("saPhotoAnalysisStatus", tr("badPhoto"));
      return;
    }

    if (!endpoint) {
      showStatus("saPhotoAnalysisStatus", tr("noImageService"));
      return;
    }

    if (!consent?.checked) {
      showStatus("saPhotoAnalysisStatus", tr("photoConsent"));
      return;
    }

    const button = $("#saAnalysePhotoButton");
    if (button) {
      button.disabled = true;
      button.textContent = tr("analysingPhoto");
    }

    try {
      const details = getFormData();

      /*
        Expected optional endpoint request:
        {
          imageDataUrl: "...",
          crop: "tomato",
          county: "Nakuru",
          symptoms: "...",
          selectedSigns: ["holes", "yellow"]
        }

        Expected JSON response can include:
        { matches: [{ name, type, confidence, signs }] }
        or { answer: "..." }

        No API key should be placed in this public JavaScript file.
      */
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageDataUrl: currentPhotoData,
          crop: details.cropId,
          county: details.county,
          symptoms: details.symptoms,
          selectedSigns: details.signs
        })
      });

      if (!response.ok) throw new Error("Image service request failed.");

      const result = await response.json();

      if (Array.isArray(result.matches)) {
        photoAnalysis = result.matches.slice(0, 4).map(match => ({
          name: String(match.name || "Possible match"),
          type: String(match.type || "Possible issue"),
          confidence: match.confidence ? String(match.confidence) : ""
        }));
      } else {
        throw new Error("Image service did not return matches.");
      }

      photoAnalysisStatus = tr("imageConnected");
      showStatus("saPhotoAnalysisStatus", photoAnalysisStatus);

      if (currentReport) {
        currentReport.photoAnalysis = photoAnalysis;
        renderReport(currentReport);
      }
    } catch (error) {
      console.warn("MavunoBridge image analysis:", error);
      showStatus("saPhotoAnalysisStatus", tr("imageFailed"));
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = tr("analysePhoto");
      }
    }
  }

  function showPhotoPreview(dataURL, fileName) {
    const preview = $("#saPhotoPreview");
    const image = $("#saPhotoPreviewImage");
    const name = $("#saPhotoName");
    const message = $("#saPhotoMessage");

    if (!preview || !image) return;

    preview.hidden = false;
    image.src = dataURL;
    image.alt = `${fileName} photo preview`;
    if (name) name.textContent = fileName;
    if (message) message.textContent = tr("photoWaiting");

    setupPhotoAnalysisControls();

    const consentLabel = $("#saPhotoConsent")?.closest("label");
    const analyzeButton = $("#saAnalysePhotoButton");
    const hasEndpoint = Boolean(getImageEndpoint());

    if (consentLabel) consentLabel.hidden = !hasEndpoint;
    if (analyzeButton) analyzeButton.hidden = !hasEndpoint;

    showStatus("saPhotoAnalysisStatus", tr("noImageService"));
  }

  function removePhoto() {
    currentPhotoData = "";
    currentPhotoName = "";
    photoAnalysis = [];
    photoAnalysisStatus = "";

    if ($("#saPhoto")) $("#saPhoto").value = "";

    const preview = $("#saPhotoPreview");
    if (preview) preview.hidden = true;

    if ($("#saPhotoPreviewImage")) $("#saPhotoPreviewImage").removeAttribute("src");
    if ($("#saPhotoName")) $("#saPhotoName").textContent = "";
    showStatus("saReportStatus", tr("photoRemoved"));
  }

  /* ==========================================================
     9. REPORT SAVE / DOWNLOAD / PRINT
  ========================================================== */

  function readSavedReports() {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE.reports) || "[]");
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

  function saveReport() {
    if (!currentReport) return;

    try {
      const reports = readSavedReports();

      /*
        Photos are not persisted with reports to avoid filling up
        localStorage. A file name is retained as a reference only.
      */
      const savedCopy = {
        ...currentReport,
        savedAt: new Date().toISOString(),
        photoAnalysis: currentReport.photoAnalysis || []
      };

      reports.unshift(savedCopy);
      localStorage.setItem(STORAGE.reports, JSON.stringify(reports.slice(0, 15)));

      showStatus("saReportStatus", tr("saveSuccess"));
      renderSavedReports();
    } catch (error) {
      console.warn("Could not save report:", error);
      showStatus("saReportStatus", tr("saveError"));
    }
  }

  function downloadReport() {
    if (!currentReport) return;

    const blob = new Blob([reportAsText(currentReport)], {
      type: "text/plain;charset=utf-8"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `mavunobridge-${currentReport.cropId}-report.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
    showStatus("saReportStatus", tr("downloadSuccess"));
  }

  function printReport() {
    if (!currentReport) return;

    const reportHtml = $("#saPrintableReport")?.outerHTML;
    if (!reportHtml) return;

    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      showStatus("saReportStatus", "Allow pop-ups to print or save the report as PDF.");
      return;
    }

    printWindow.document.open();
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="${language === "sw" ? "sw" : "en"}">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <title>MavunoBridge Farm Report</title>
        <style>
          body{margin:24px;font:14px/1.6 Arial,sans-serif;color:#26372b}
          h3,h4{color:#173421}
          article{max-width:900px;margin:auto}
          .sa-report-meta{display:flex;flex-wrap:wrap;gap:12px;margin:20px 0}
          .sa-report-meta div{padding:10px;border:1px solid #ddd;border-radius:8px}
          .sa-report-meta small,.sa-report-meta strong{display:block}
          .sa-report-block{margin:18px 0;padding:15px;border:1px solid #ddd;border-radius:10px;break-inside:avoid}
          .sa-match-card{padding:10px;border:1px solid #ddd;margin:8px 0;border-radius:8px}
          .sa-report-warning{padding:12px;background:#fff5e9;border:1px solid #e5c79e}
          .sa-report-stamp{font-size:10px;color:#4a724d;font-weight:bold}
          .sa-eyebrow{color:#416d45;font-weight:bold}
          @media print{body{margin:10mm}.sa-report-block{break-inside:avoid}}
        </style>
      </head>
      <body>${reportHtml}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }

  function renderSavedReports() {
    const container = $("#saSavedReports");
    if (!container) return;

    const saved = readSavedReports();
    container.innerHTML = "";

    if (!saved.length) {
      const empty = document.createElement("p");
      empty.className = "sa-muted-note";
      empty.textContent = tr("noSavedReports");
      container.appendChild(empty);
      return;
    }

    saved.forEach(report => {
      const card = document.createElement("article");
      card.className = "sa-saved-report-card";

      const title = document.createElement("strong");
      title.textContent = `${report.cropName || report.cropId} · ${report.county}`;

      const date = document.createElement("small");
      date.textContent = new Date(report.createdAt).toLocaleString();

      const actions = document.createElement("div");
      actions.className = "sa-saved-report-actions";

      const view = document.createElement("button");
      view.type = "button";
      view.className = "sa-button sa-button-secondary";
      view.textContent = tr("viewReport");
      view.addEventListener("click", () => {
        currentReport = report;
        renderReport(currentReport);
        $("#reportSection")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "sa-button sa-button-danger";
      remove.textContent = tr("deleteReport");
      remove.addEventListener("click", () => {
        const next = readSavedReports().filter(item => item.id !== report.id);
        localStorage.setItem(STORAGE.reports, JSON.stringify(next));
        renderSavedReports();
      });

      actions.append(view, remove);
      card.append(title, date, actions);
      container.appendChild(card);
    });
  }

  /* ==========================================================
     10. FARM ASSISTANT
  ========================================================== */

  function addChatMessage(text, role = "bot") {
    const container = $("#saChatMessages");
    if (!container) return;

    const message = document.createElement("div");
    message.className = role === "user"
      ? "sa-chat-message sa-chat-user"
      : "sa-chat-message sa-chat-bot";
    message.textContent = text;

    container.appendChild(message);
    container.scrollTop = container.scrollHeight;
  }

  function assistantAnswer(question) {
    const q = normalise(question);
    const answers = LANG[language] || LANG.mix;

    if (!currentReport) return tr("noQuestionReport");

    const crop = CROP_BY_ID[currentReport.cropId] || CROPS[0];

    if (/pest|disease|symptom|match|diagnos|what is it/.test(q)) {
      if (currentReport.matches.length) {
        const matchText = currentReport.matches
          .slice(0, 3)
          .map(match => `${match.name} (${match.type})`)
          .join("; ");

        return `${answers.followUp} ${crop.name}: ${matchText}. ${answers.matchCaution} ${answers.pestAdvice}`;
      }

      return `${answers.noDiagnosis} ${answers.pestAdvice}`;
    }

    if (/water|dry|irrigat|rain/.test(q)) {
      return `${answers.followUp} ${crop.name}. ${answers.waterAdvice} ${answers.dryAdvice}`;
    }

    if (/soil|fertili|nutrient|yellow|fertility/.test(q)) {
      return `${answers.followUp} ${crop.name}. ${answers.soilAdvice} ${answers.yellowAdvice}`;
    }

    if (/harvest|storage|store|yield/.test(q)) {
      return `${answers.followUp} ${crop.name}. ${crop.harvest} ${answers.harvestAdvice}`;
    }

    if (/plant|seed|spacing|planting/.test(q)) {
      return `${answers.followUp} ${crop.name}. ${crop.planting}`;
    }

    if (/county|location|area|weather|forecast/.test(q)) {
      return `${currentReport.county}${currentReport.area ? ` (${currentReport.area})` : ""}: ${answers.locallyVariable} This demo does not fetch a live forecast.`;
    }

    if (/report|next step|what should i do/.test(q)) {
      return `${answers.followUp} ${crop.name}. ${answers.pestAdvice} ${answers.waterAdvice} ${answers.urgent}`;
    }

    return `${answers.followUp} ${crop.name}. ${crop.scouting} ${answers.questionFallback}`;
  }

  async function askAssistant(question) {
    const text = String(question || "").trim();
    if (!text) return;

    addChatMessage(text, "user");

    const input = $("#saQuestionInput");
    if (input) input.value = "";

    showStatus("saReportStatus", tr("answering"));

    /*
      Optional connected text assistant uses the same endpoint shape
      as the project's configured guide:
      POST { question: "..." } -> { answer: "..." }

      With no endpoint configured, it answers immediately offline.
    */
    const endpoint = String(window.MAVUNO_AI_ENDPOINT || "").trim();

    if (endpoint) {
      try {
        const prompt = [
          "You are MavunoBridge Smart Assist for Kenyan smallholder farmers.",
          `Respond in ${language === "en" ? "English" : language === "sw" ? "Kiswahili" : "casual Sheng mixed with English"}.`,
          "Give practical, cautious general crop guidance. Do not claim a confirmed diagnosis from symptoms alone. Do not recommend a pesticide product or dosage. Recommend local agricultural extension advice for important crop-health decisions.",
          `Current report: ${currentReport ? reportAsText(currentReport) : "No report yet"}`,
          `Farmer question: ${text}`
        ].join("\n\n");

        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: prompt })
        });

        if (!response.ok) throw new Error("Assistant endpoint failed.");

        const data = await response.json();

        if (typeof data.answer === "string" && data.answer.trim()) {
          addChatMessage(data.answer.trim(), "bot");
          return;
        }

        throw new Error("Assistant response missing answer.");
      } catch (error) {
        console.warn("Using offline assistant:", error);
      }
    }

    addChatMessage(assistantAnswer(text), "bot");
  }

  /* ==========================================================
     11. APPLY LANGUAGE
  ========================================================== */

  function updateText(selector, text) {
    const el = $(selector);
    if (el) el.textContent = text;
  }

  function applyLanguage(nextLanguage) {
    language = ["en", "mix", "sw"].includes(nextLanguage) ? nextLanguage : "mix";

    try {
      localStorage.setItem(STORAGE.language1, language);
      localStorage.setItem(STORAGE.language2, language);
    } catch {}

    document.documentElement.lang = language === "sw" ? "sw" : "en";

    if ($("#languageSelect")) $("#languageSelect").value = language;

    updateText("#heroEyebrow", tr("eyebrow"));
    const heroTitle = $("#heroTitle");
    if (heroTitle) {
      heroTitle.innerHTML = `${escapeHTML(tr("hero"))}<br><span>${escapeHTML(tr("hero2"))}</span>`;
    }

    updateText("#heroDescription", tr("heroDescription"));
    updateText("#heroNotice", tr("demoNotice"));
    updateText("#plannerEyebrow", tr("plannerEyebrow") || "PERSONALISED FARM PLANNER");
    updateText("#plannerTitle", tr("planner"));
    updateText("#plannerDescription", tr("plannerIntro"));
    updateText("#countyLabel", `${tr("county")} *`);
    updateText("#areaLabel", tr("area"));
    updateText("#cropLabel", `${tr("crop")} *`);
    updateText("#stageLabel", tr("stage"));
    updateText("#issueLabel", tr("concern"));
    updateText("#soilLabel", tr("soil"));
    updateText("#waterLabel", tr("water"));
    updateText("#farmSizeLabel", tr("farmSize"));
    updateText("#notesLabel", tr("notes"));
    updateText("#symptomLegend", tr("signs"));
    updateText("#symptomHelp", tr("signsHelp"));
    updateText("#symptomsLabel", tr("describeSymptoms"));
    updateText("#photoLabel", tr("photo"));
    updateText("#photoHelp", tr("photoHelp"));
    updateText("#generateReportButton", tr("createReport"));
    updateText("#resetPlanButton", tr("clear"));
    updateText("#reportEyebrow", tr("report"));
    updateText("#reportTitle", tr("report"));
    updateText("#reportSubhead", tr("reportIntro"));
    updateText("#emptyReportTitle", tr("noReport"));
    updateText("#emptyReportDescription", tr("noReportHint"));
    updateText("#assistantTitle", tr("questionTitle"));
    updateText("#assistantDescription", tr("questionIntro"));
    updateText("#questionInputLabel", tr("questionTitle"));
    updateText("#askQuestionButton", tr("ask"));
    updateText("#chatFootnote", tr("offlineNote"));
    updateText("#libraryEyebrow", tr("library"));
    updateText("#cropLibraryTitle", tr("library"));
    updateText("#libraryDescription", tr("libraryIntro"));
    updateText("#librarySearchLabel", tr("searchCrop"));
    updateText("#libraryTypeLabel", tr("cropGroup"));
    updateText("#libraryCountyLabel", tr("libraryCounty"));
    updateText("#savedReportsTitle", tr("savedReports"));
    updateText("#savedDescription", tr("savedIntro"));
    updateText("#referenceTitle", tr("references"));
    updateText("#marketCtaText", tr("libraryIntro"));
    updateText("#footerNotice", tr("urgent"));

    if ($("#saQuestionInput")) $("#saQuestionInput").placeholder = tr("askPlaceholder");
    if ($("#saCropSearch")) $("#saCropSearch").placeholder = tr("searchCrop");
    if ($("#saNotes")) $("#saNotes").placeholder = tr("notes");
    if ($("#saSymptoms")) $("#saSymptoms").placeholder = tr("describeSymptoms");

    renderCountyOptions();
    renderCropOptions();
    renderFormOptions();
    renderSymptomChecks();
    renderCropLibrary();
    renderSavedReports();

    if (currentReport) renderReport(currentReport);
  }

  /* ==========================================================
     12. FORM EVENTS
  ========================================================== */

  async function handlePhotoChange() {
    const file = $("#saPhoto")?.files?.[0];
    if (!file) {
      removePhoto();
      return;
    }

    try {
      currentPhotoData = await imageToDataURL(file);
      currentPhotoName = file.name;
      photoAnalysis = [];
      photoAnalysisStatus = "";
      showPhotoPreview(currentPhotoData, file.name);
    } catch (error) {
      removePhoto();
      showStatus("saReportStatus", error.message || tr("badPhoto"));
    }
  }

  function handleGenerate(event) {
    event.preventDefault();

    const form = $("#smartPlanForm");
    if (form && !form.reportValidity()) return;
    if (generating) return;

    generating = true;

    const button = $("#generateReportButton");
    if (button) {
      button.disabled = true;
      button.textContent = tr("generating");
    }

    try {
      currentMatches = [];
      currentReport = createReport();
      renderReport(currentReport);

      $("#reportSection")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

      showStatus("saReportStatus", tr("reportIntro"));
    } catch (error) {
      console.error("Smart Assist report error:", error);
      showStatus("saReportStatus", error.message || tr("questionFallback"));
    } finally {
      generating = false;
      if (button) {
        button.disabled = false;
        button.textContent = tr("createReport");
      }
    }
  }

  function resetPlanner() {
    currentReport = null;
    currentMatches = [];
    removePhoto();
    renderReport(null);
    renderSymptomChecks();
  }

  function showStatus(id, message) {
    const el = document.getElementById(id);
    if (el) el.textContent = message;
  }

  function bindEvents() {
    $("#smartPlanForm")?.addEventListener("submit", handleGenerate);
    $("#smartPlanForm")?.addEventListener("reset", () => {
      window.setTimeout(resetPlanner, 0);
    });

    $("#saCrop")?.addEventListener("change", renderSymptomChecks);
    $("#saCropSearch")?.addEventListener("input", renderCropLibrary);
    $("#saCropGroup")?.addEventListener("change", renderCropLibrary);
    $("#saLibraryCounty")?.addEventListener("change", renderCropLibrary);

    $("#saPhoto")?.addEventListener("change", handlePhotoChange);
    $("#saRemovePhoto")?.addEventListener("click", removePhoto);

    $("#saveReportButton")?.addEventListener("click", saveReport);
    $("#downloadReportButton")?.addEventListener("click", downloadReport);
    $("#printReportButton")?.addEventListener("click", printReport);

    $("#saQuestionForm")?.addEventListener("submit", event => {
      event.preventDefault();
      askAssistant($("#saQuestionInput")?.value || "");
    });

    $$("#saQuickQuestions [data-question]").forEach(button => {
      button.addEventListener("click", () => {
        askAssistant(button.dataset.question);
      });
    });

    $("#languageSelect")?.addEventListener("change", event => {
      applyLanguage(event.target.value);
    });

    $("#menuButton")?.addEventListener("click", () => {
      const nav = $("#mainNav");
      const button = $("#menuButton");

      if (!nav || !button) return;

      const isOpen = nav.classList.toggle("open");
      button.setAttribute("aria-expanded", String(isOpen));
    });

    $("#mainNav")?.addEventListener("click", event => {
      if (event.target.closest("a")) {
        $("#mainNav")?.classList.remove("open");
        $("#menuButton")?.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ==========================================================
     13. STARTUP
  ========================================================== */

  function init() {
    if (!$("#smartPlanForm") || !$("#saReportOutput")) {
      console.error("Smart Assist HTML fields are missing. Check smart-assist.html.");
      return;
    }

    let savedLanguage = "mix";

    try {
      savedLanguage =
        localStorage.getItem(STORAGE.language1) ||
        localStorage.getItem(STORAGE.language2) ||
        "mix";
    } catch {}

    applyLanguage(savedLanguage);
    bindEvents();
    renderReport(null);
    renderSavedReports();

    /*
      Let the crop library display the true count.
    */
    const libraryTag = $("#cropLibrary .sa-step-tag");
    if (libraryTag) libraryTag.textContent = `${CROPS.length} CROPS`;

    console.info(`MavunoBridge Smart Assist ready: ${CROPS.length} crops, ${CROPS.reduce((n, c) => n + c.issues.length, 0)} crop-health entries.`);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
