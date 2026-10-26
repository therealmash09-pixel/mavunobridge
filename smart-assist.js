/* ============================================================
   MAVUNOBRIDGE SMART ASSIST v3
   - Kenyan crop guide
   - Symptom-based pest/disease matching
   - Image upload and preview
   - Optional connected image-analysis endpoint
   - Farm report, saved reports and printable report
   - English / Sheng + English / Kiswahili
   - Offline-first demo; no Supabase required
============================================================ */

(() => {
  "use strict";

  if (window.__MAVUNO_SMART_ASSIST_V3__) return;
  window.__MAVUNO_SMART_ASSIST_V3__ = true;

  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];

  const STORAGE = {
    reports: "mavunobridge_crop_health_reports_v1",
    languageV1: "mavunobridge_language_v1",
    languageV2: "mavunobridge_language_v2"
  };

  const MAX_PHOTO_BYTES = 8 * 1024 * 1024;
  const MAX_PHOTO_DIMENSION = 1100;

  let currentLanguage = "mix";
  let currentReport = null;
  let currentPhotoData = "";
  let currentPhotoName = "";
  let currentMatches = [];
  let isGenerating = false;

  /* -------------------- LANGUAGES -------------------- */

  const TEXT = {
    en: {
      heroEyebrow: "YOUR FARM, YOUR PLAN",
      heroDescription: "Choose a crop, county and farm condition. Get practical tips, possible symptom matches and a report you can save.",
      heroNotice: "Demo guidance only. No live weather feed or automatic diagnosis unless an analysis service is connected.",
      plannerEyebrow: "PERSONALISED FARM PLANNER",
      plannerTitle: "Tell us about your farm",
      plannerDescription: "More details help make your rule-based demo report more relevant.",
      county: "County *",
      area: "Town / area (optional)",
      crop: "Crop *",
      stage: "Growth stage",
      issue: "Main concern",
      soil: "Soil type (if known)",
      water: "Water access",
      farmSize: "Farm size in acres (optional)",
      notes: "Extra farm details (optional)",
      symptomLegend: "Visible signs or symptoms (select any)",
      symptomHelp: "Select what you can see on the plant.",
      symptoms: "Describe the problem",
      photo: "Upload a crop photo (optional)",
      photoHelp: "Choose a clear photo of the affected leaf, stem, fruit or root.",
      photoAttached: "Photo attached as supporting evidence.",
      photoNotAnalysed: "No image-analysis service is connected; this demo does not identify pests from pixels.",
      removePhoto: "Remove photo",
      generate: "Generate my farm report →",
      generating: "Preparing report…",
      clear: "Clear form",
      reportEyebrow: "YOUR PERSONAL FARM REPORT",
      reportTitle: "Your farm report",
      reportSubhead: "Your selected crop, observations and next steps.",
      emptyReportTitle: "Your report will appear here",
      emptyReportDescription: "Complete the farm planner and select Generate my farm report.",
      context: "Farm context",
      nextSteps: "Recommended next steps",
      cropTips: "Growing tips",
      possibleMatches: "Possible pest or disease matches",
      noMatch: "No close match was found from the symptoms entered.",
      noMatchExplain: "That does not rule out a pest or disease. Add more details, select other signs or consult a local agricultural extension officer.",
      possibleOnly: "Possible match only — not a diagnosis.",
      matchDisclaimer: "Different problems can produce similar symptoms. A photo or a short description cannot reliably confirm every disease.",
      photoEvidence: "Photo evidence",
      imageNotAnalysed: "The photo is attached for reference but has not been visually analysed by this offline demo.",
      imageServiceReady: "Image-analysis service connected. Suggested visual matches still need local confirmation.",
      save: "Save report on this device",
      download: "Download text report",
      print: "Print / Save as PDF",
      saved: "Report saved in this browser.",
      savedFail: "Could not save the report in this browser.",
      downloaded: "Text report prepared.",
      removed: "Photo removed.",
      questionTitle: "Farm Assistant",
      questionIntro: "Ask a follow-up about this crop or the report above.",
      questionPlaceholder: "Ask about pests, symptoms, water, soil or harvest...",
      ask: "Ask",
      responding: "Checking your farm notes…",
      offline: "Offline assistant. Replies are based on built-in crop guidance, not a live agronomist.",
      answerPrefix: "Here is a starting point based on your farm details:",
      needSymptoms: "Choose at least one visible sign or describe the symptoms to improve matching.",
      symptomMatches: "Possible matches based on your selected signs",
      urgent: "Important: if the problem is spreading quickly, affects many plants, or may be a serious disease, contact a county agricultural extension officer promptly. Avoid moving suspect planting material.",
      sourcesTitle: "Reference material",
      libraryTitle: "Kenyan crop guide library",
      libraryDescription: "Search crop groups and read general tips for common Kenyan crops.",
      noCrops: "No crops match that filter.",
      useCrop: "Use this crop",
      plantTip: "Growing tip",
      watchTip: "What to watch for",
      harvestTip: "Harvest and handling",
      countyNote: "County selected for context",
      localVariation: "Conditions differ by ward, altitude, farm and season. This county selection does not establish live weather or farm conditions.",
      generatedAt: "Report prepared",
      reportSaved: "Saved report",
      viewReport: "View report",
      deleteReport: "Delete",
      noSaved: "No reports saved yet. Generate a report and save it on this device.",
      deleteSaved: "Saved report deleted.",
      allGroups: "All crop groups",
      searchCrop: "Search maize, coffee, cassava...",
      chooseCounty: "All counties",
      cropGroup: "Crop group",
      symptomWord: "Symptoms entered",
      photoName: "Selected photo",
      badPhoto: "Please choose a valid image file under 8 MB.",
      photoReadFail: "Could not read this photo. Try another image.",
      endpointFail: "Visual analysis could not complete. Showing the local symptom matches instead.",
      noActiveReport: "Generate a farm report first so I can answer about your selected crop.",
      noDiagnosis: "I cannot confirm a pest or disease from symptoms alone. Here are possible matches; compare the signs and get local confirmation.",
      waterAdvice: "Check soil moisture before watering. Avoid waterlogging; mulch and conserve water where suitable.",
      dryAdvice: "Check moisture below the surface. Water management, mulch and locally suitable varieties may help, but choose actions for your crop and conditions.",
      wetAdvice: "Check drainage and avoid working saturated soil. Prolonged wetness may encourage some diseases.",
      pestAdvice: "Inspect several plants and both sides of leaves. Photograph the affected parts and confirm the cause before choosing a control measure.",
      diseaseAdvice: "Record which plant parts are affected and how quickly symptoms are spreading. Do not assume every spot or wilt is the same disease.",
      yellowAdvice: "Yellowing may be caused by water stress, nutrients, root damage, pests or disease. Check soil moisture, roots and the pattern of affected leaves.",
      soilAdvice: "A soil test is more reliable than guessing fertiliser needs from leaf colour alone. Check pH and nutrient recommendations locally.",
      harvestAdvice: "Handle produce gently, separate damaged items and follow crop-specific maturity and storage guidance.",
      unknownQuestion: "Ask about the crop selected in your report, symptoms, watering, soil health, pest scouting or harvest. For diagnosis or treatment decisions, check with a qualified local agricultural adviser."
    },

    mix: {
      heroEyebrow: "SHAMBA YAKO, PLAN YAKO",
      heroDescription: "Chagua crop, county na hali ya shamba. Pata tips, possible symptom matches na report ya kuhifadhi.",
      heroNotice: "Demo guidance tu. Hakuna live weather au automatic diagnosis bila analysis service kuunganishwa.",
      plannerEyebrow: "PERSONALISED FARM PLANNER",
      plannerTitle: "Tuambie kuhusu shamba lako",
      plannerDescription: "Details zaidi zinasaidia report ya demo iwe relevant zaidi.",
      county: "County *",
      area: "Town / area (si lazima)",
      crop: "Crop *",
      stage: "Growth stage",
      issue: "Main concern",
      soil: "Soil type (ukijua)",
      water: "Water access",
      farmSize: "Ukubwa wa shamba kwa acres (si lazima)",
      notes: "Maelezo mengine ya shamba (si lazima)",
      symptomLegend: "Dalili unazoona (chagua zote zinazofaa)",
      symptomHelp: "Chagua signs unazoona kwa plant.",
      symptoms: "Describe tatizo",
      photo: "Weka picha ya crop (si lazima)",
      photoHelp: "Chagua picha clear ya leaf, stem, fruit au root iliyoathirika.",
      photoAttached: "Picha imeongezwa kama supporting evidence.",
      photoNotAnalysed: "Hakuna image-analysis service. Demo hii haiwezi kutambua pest kutoka pixels pekee.",
      removePhoto: "Ondoa picha",
      generate: "Tengeneza farm report →",
      generating: "Inatengeneza report…",
      clear: "Clear form",
      reportEyebrow: "REPORT YA SHAMBA LAKO",
      reportTitle: "Farm report yako",
      reportSubhead: "Crop yako, observations na steps za kufuata.",
      emptyReportTitle: "Report yako itaonekana hapa",
      emptyReportDescription: "Jaza planner kisha bonyeza Tengeneza farm report.",
      context: "Farm context",
      nextSteps: "Next steps zinazopendekezwa",
      cropTips: "Growing tips",
      possibleMatches: "Possible pest au disease matches",
      noMatch: "Hakuna close match iliyopatikana kwa dalili ulizoandika.",
      noMatchExplain: "Haimaanishi kwamba hakuna pest au disease. Ongeza details, chagua signs zaidi au ongea na agricultural extension officer.",
      possibleOnly: "Possible match tu — si diagnosis.",
      matchDisclaimer: "Matatizo tofauti yanaweza kuonyesha dalili zinazofanana. Picha au description fupi haiwezi kuthibitisha kila disease.",
      photoEvidence: "Photo evidence",
      imageNotAnalysed: "Picha iko kwa reference lakini haijafanyiwa visual analysis na offline demo hii.",
      imageServiceReady: "Image-analysis service imeunganishwa. Matches bado zinahitaji kuthibitishwa locally.",
      save: "Save report kwa kifaa hiki",
      download: "Download text report",
      print: "Print / Save as PDF",
      saved: "Report imehifadhiwa kwa browser hii.",
      savedFail: "Imeshindikana kuhifadhi report kwa browser hii.",
      downloaded: "Text report iko tayari.",
      removed: "Picha imeondolewa.",
      questionTitle: "Farm Assistant",
      questionIntro: "Uliza follow-up kuhusu crop hii au report iliyo juu.",
      questionPlaceholder: "Uliza kuhusu pests, symptoms, maji, soil au harvest...",
      ask: "Uliza",
      responding: "Inaangalia maelezo ya shamba…",
      offline: "Offline assistant. Majibu yan
