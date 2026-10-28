/* ============================================================
   MAVUNOBRIDGE — RESPONSIVE GLASS TOUR ASSISTANT
   Complete replacement: website-tour.js

   FEATURES
   - Compact translucent helper panel; no full-screen overlay
   - Compass button fixed at the bottom-left
   - Panel repositions away from the highlighted content
   - Responsive layout for narrow and regular phones
   - Four original illustrated dark-skinned guide characters
   - Character-specific static backgrounds
   - Only eyes blink and mouth moves during speech
   - Automatic, English, Kiswahili and Sheng language modes
   - Selectable browser voice + Test voice button
   - Character-based voice-gender preference (best effort)
   - Skippable step-by-step tour with Back/Next/Finish
   - Smart Assist/SACCO/category/search/listing target support
   - Optional avatar mounts for dedicated avatar placeholders
   - Public API for connecting Smart Assist speech
   - No automatic opening and no page-wide overlay

   NOTE: Voice options and Kiswahili pronunciation depend on
   voices installed in the browser/operating system.
   ============================================================ */

(() => {
  "use strict";

  if (window.__MAVUNOBRIDGE_RESPONSIVE_GLASS_GUIDE_V8__) return;
  window.__MAVUNOBRIDGE_RESPONSIVE_GLASS_GUIDE_V8__ = true;

  /* ----------------------------------------------------------
     1. STORAGE AND STATE
     ---------------------------------------------------------- */

  const STORAGE = {
    character: "mavunobridge_guide_character_v8",
    voice: "mavunobridge_guide_voice_v8",
    language: "mavunobridge_guide_language_v8",
    readAloud: "mavunobridge_guide_read_aloud_v8",
    completed: "mavunobridge_guide_completed_v8"
  };

  const CHARACTERS = {
    akinyi: {
      name: "Akinyi",
      role: "Farmer Guide",
      genderPreference: "female",
      defaultLanguage: "sw",
      scene: "farm",
      hairstyle: "afro",
      skin: "#70452F",
      shadow: "#4B2C20",
      highlight: "#966448",
      hair: "#171313",
      shirt: "#607B43",
      shirtLight: "#8DA763"
    },
    wanjiku: {
      name: "Wanjiku",
      role: "Marketplace Guide",
      genderPreference: "female",
      defaultLanguage: "en",
      scene: "market",
      hairstyle: "braids",
      skin: "#5D3528",
      shadow: "#3D211A",
      highlight: "#89533B",
      hair: "#171313",
      shirt: "#BE8334",
      shirtLight: "#E9BC65"
    },
    kamau: {
      name: "Kamau",
      role: "Smart Assist Guide",
      genderPreference: "male",
      defaultLanguage: "sheng",
      scene: "smart",
      hairstyle: "twists",
      skin: "#693E2C",
      shadow: "#44251C",
      highlight: "#925C41",
      hair: "#171313",
      shirt: "#347258",
      shirtLight: "#67A17D"
    },
    otieno: {
      name: "Otieno",
      role: "SACCO Guide",
      genderPreference: "male",
      defaultLanguage: "sw",
      scene: "sacco",
      hairstyle: "fade",
      skin: "#512E23",
      shadow: "#341D17",
      highlight: "#794A34",
      hair: "#151313",
      shirt: "#B85F3D",
      shirtLight: "#DE8A5D"
    }
  };

  let selectedCharacter = "akinyi";
  let selectedLanguageMode = "auto"; // auto | en | sw | sheng
  let selectedVoiceURI = "";
  let readAloud = true;
  let guideOpen = false;
  let tourStarted = false;
  let currentStep = 0;
  let voiceList = [];
  let activeGuideUtterance = null;
  let mouthTimer = null;
  let avatarCounter = 0;
  let highlightTarget = null;
  let observer = null;
  let observerQueued = false;
  let externalSpeechHooksInstalled = false;

  function storageGet(key, fallback = "") {
    try {
      const value = localStorage.getItem(key);
      return value === null ? fallback : value;
    } catch {
      return fallback;
    }
  }

  function storageSet(key, value) {
    try {
      localStorage.setItem(key, String(value));
    } catch {
      // The helper still works when browser storage is unavailable.
    }
  }

  function loadPreferences() {
    const savedCharacter = storageGet(STORAGE.character, "akinyi");
    if (CHARACTERS[savedCharacter]) selectedCharacter = savedCharacter;

    const savedLanguage = storageGet(STORAGE.language, "auto");
    if (["auto", "en", "sw", "sheng"].includes(savedLanguage)) {
      selectedLanguageMode = savedLanguage;
    }

    selectedVoiceURI = storageGet(STORAGE.voice, "");
    readAloud = storageGet(STORAGE.readAloud, "true") !== "false";
  }

  /* ----------------------------------------------------------
     2. STATIC, CHARACTER-SPECIFIC BACKGROUNDS
     ---------------------------------------------------------- */

  function createBackground(character) {
    if (character.scene === "farm") {
      return `
        <rect width="240" height="270" fill="#F4CF87"/>
        <circle cx="186" cy="48" r="23" fill="#FFF1BD"/>
        <path d="M0 130 Q40 92 90 124 Q142 83 190 121 Q218 102 240 121 L240 270 L0 270Z" fill="#9DAD67"/>
        <path d="M0 171 Q65 135 120 173 Q180 135 240 169 L240 270 L0 270Z" fill="#597A43"/>
        <path d="M0 204 L80 171 L122 270 L0 270Z" fill="#B29A4C"/>
        <path d="M240 205 L160 171 L120 270 L240 270Z" fill="#8F9545"/>
        <g fill="#3E6339">
          <path d="M14 164 l12 -27 l12 27Z"/>
          <path d="M32 167 l10 -23 l10 23Z"/>
          <path d="M190 155 l12 -27 l12 27Z"/>
          <path d="M209 159 l10 -23 l10 23Z"/>
        </g>
      `;
    }

    if (character.scene === "market") {
      return `
        <rect width="240" height="270" fill="#F2C28C"/>
        <rect x="14" y="69" width="212" height="110" rx="4" fill="#F4E1BE" stroke="#60412B" stroke-width="3"/>
        <path d="M8 74 L232 74 L210 37 L30 37Z" fill="#46744B" stroke="#39271E" stroke-width="3"/>
        <path d="M30 37 L66 37 L58 74 L8 74Z" fill="#E4AF4A"/>
        <path d="M66 37 L102 37 L94 74 L58 74Z" fill="#C86248"/>
        <path d="M102 37 L138 37 L130 74 L94 74Z" fill="#E4AF4A"/>
        <path d="M138 37 L174 37 L166 74 L130 74Z" fill="#C86248"/>
        <path d="M174 37 L210 37 L232 74 L166 74Z" fill="#E4AF4A"/>
        <g stroke="#6F482B" stroke-width="2">
          <rect x="26" y="91" width="54" height="45" fill="#D7BE90"/>
          <rect x="93" y="91" width="54" height="45" fill="#D7BE90"/>
          <rect x="160" y="91" width="43" height="45" fill="#D7BE90"/>
        </g>
        <g fill="#B95138"><circle cx="39" cy="104" r="7"/><circle cx="53" cy="104" r="7"/><circle cx="67" cy="104" r="7"/></g>
        <g fill="#E6B64E"><circle cx="106" cy="104" r="7"/><circle cx="120" cy="104" r="7"/><circle cx="134" cy="104" r="7"/></g>
        <g fill="#688C46"><circle cx="173" cy="104" r="7"/><circle cx="188" cy="104" r="7"/></g>
        <rect x="0" y="179" width="240" height="91" fill="#B68B5A"/>
      `;
    }

    if (character.scene === "smart") {
      return `
        <rect width="240" height="270" fill="#526A86"/>
        <circle cx="189" cy="42" r="30" fill="#E7D9FF" opacity=".85"/>
        <g fill="#354B64">
          <rect x="8" y="110" width="39" height="104" rx="3"/>
          <rect x="54" y="83" width="34" height="131" rx="3"/>
          <rect x="153" y="90" width="36" height="124" rx="3"/>
          <rect x="195" y="124" width="34" height="90" rx="3"/>
        </g>
        <g fill="#DDE9F5">
          <rect x="17" y="124" width="7" height="9"/><rect x="30" y="124" width="7" height="9"/>
          <rect x="17" y="142" width="7" height="9"/><rect x="30" y="142" width="7" height="9"/>
          <rect x="62" y="96" width="7" height="9"/><rect x="75" y="96" width="7" height="9"/>
          <rect x="62" y="114" width="7" height="9"/><rect x="75" y="114" width="7" height="9"/>
        </g>
        <path d="M0 204 Q60 184 120 204 Q180 185 240 204 L240 270 L0 270Z" fill="#4D7962"/>
        <g fill="none" stroke="#EFE4FF" stroke-width="2">
          <circle cx="29" cy="44" r="10"/><path d="M29 34 V54 M19 44 H39"/>
          <circle cx="218" cy="75" r="8"/><path d="M218 67 V83 M210 75 H226"/>
        </g>
      `;
    }

    return `
      <rect width="240" height="270" fill="#9AB6A4"/>
      <circle cx="190" cy="44" r="25" fill="#F5DDA2"/>
      <path d="M0 145 Q65 116 120 144 Q180 112 240 143 L240 270 L0 270Z" fill="#6F9978"/>
      <path d="M22 87 L120 35 L218 87Z" fill="#47724F" stroke="#354C39" stroke-width="3"/>
      <rect x="35" y="87" width="170" height="97" fill="#F1D6A8" stroke="#44392D" stroke-width="3"/>
      <rect x="96" y="124" width="48" height="60" fill="#A46C42" stroke="#44392D" stroke-width="3"/>
      <rect x="53" y="104" width="31" height="28" fill="#B9D9D1" stroke="#44392D" stroke-width="3"/>
      <rect x="156" y="104" width="31" height="28" fill="#B9D9D1" stroke="#44392D" stroke-width="3"/>
      <path d="M68 104 V132 M53 118 H84 M171 104 V132 M156 118 H187" stroke="#44392D" stroke-width="2"/>
      <path d="M0 205 Q120 186 240 205 L240 270 L0 270Z" fill="#4D7A54"/>
    `;
  }

  /* ----------------------------------------------------------
     3. HAIRSTYLES
     ---------------------------------------------------------- */

  function createHairBack(character) {
    if (character.hairstyle === "afro") {
      return `
        <g fill="${character.hair}" stroke="#211816" stroke-width="3">
          <circle cx="88" cy="79" r="20"/><circle cx="103" cy="57" r="20"/>
          <circle cx="127" cy="48" r="21"/><circle cx="151" cy="54" r="20"/>
          <circle cx="171" cy="73" r="19"/><circle cx="177" cy="94" r="16"/>
          <circle cx="82" cy="101" r="15"/>
        </g>
      `;
    }

    if (character.hairstyle === "braids") {
      return `
        <path d="M78 83 Q79 48 120 41 Q161 39 176 75 L176 155 L156 171 L148 111 L103 111 L96 171 L78 155Z" fill="${character.hair}" stroke="#211816" stroke-width="3"/>
        <g fill="none" stroke="#302321" stroke-width="6" stroke-linecap="round">
          <path d="M86 67 Q82 111 91 158"/><path d="M98 51 Q96 112 103 163"/>
          <path d="M111 45 Q112 110 115 159"/><path d="M125 43 Q128 106 128 162"/>
          <path d="M139 47 Q144 106 141 159"/><path d="M153 56 Q161 106 154 155"/>
          <path d="M165 70 Q176 111 165 145"/>
        </g>
      `;
    }

    if (character.hairstyle === "twists") {
      return `
        <path d="M80 92 Q72 55 111 45 Q142 33 164 56 Q179 73 174 102 L165 131 L91 130Z" fill="${character.hair}" stroke="#211816" stroke-width="3"/>
        <g fill="#211A18"><circle cx="91" cy="62" r="10"/><circle cx="108" cy="49" r="10"/><circle cx="128" cy="45" r="10"/><circle cx="147" cy="52" r="10"/><circle cx="163" cy="68" r="10"/></g>
      `;
    }

    return `
      <path d="M79 89 Q75 49 116 42 Q152 36 173 66 L176 104 L162 124 L91 124Z" fill="${character.hair}" stroke="#211816" stroke-width="3"/>
      <path d="M84 81 Q99 53 129 59 Q151 55 168 79 L169 91 Q144 77 125 85 Q103 79 84 94Z" fill="#29201C"/>
    `;
  }

  function createHairFront(character) {
    if (character.hairstyle === "afro") {
      return `
        <path d="M87 93 Q90 57 119 54 Q148 51 170 77 L175 100 Q155 85 145 95 Q131 106 119 92 Q106 104 94 97Z" fill="${character.hair}" stroke="#211816" stroke-width="3"/>
      `;
    }

    if (character.hairstyle === "braids") {
      return `
        <path d="M87 92 Q91 57 119 52 Q148 49 169 76 L174 98 Q155 84 143 94 Q132 102 119 93 Q103 101 88 98Z" fill="${character.hair}" stroke="#211816" stroke-width="3"/>
        <g stroke="#553729" stroke-width="2" fill="none"><path d="M101 69 Q106 82 102 95"/><path d="M115 60 Q123 80 118 95"/><path d="M131 59 Q139 79 134 96"/><path d="M146 66 Q155 81 151 95"/></g>
      `;
    }

    if (character.hairstyle === "twists") {
      return `
        <path d="M83 93 Q87 60 113 52 Q143 44 165 70 L174 96 L156 90 L144 97 L131 87 L118 98 L104 89 L91 97Z" fill="${character.hair}" stroke="#211816" stroke-width="3"/>
      `;
    }

    return `
      <path d="M84 93 Q91 61 117 55 Q145 48 166 75 L174 95 L156 89 L143 97 L130 88 L116 96 L101 89 L90 96Z" fill="${character.hair}" stroke="#211816" stroke-width="3"/>
    `;
  }

  /* ----------------------------------------------------------
     4. AVATAR SVG: STATIC EXCEPT EYES AND MOUTH
     ---------------------------------------------------------- */

  function createAvatarSVG(characterKey) {
    const character = CHARACTERS[characterKey] || CHARACTERS.akinyi;
    avatarCounter += 1;

    return `
      <svg viewBox="0 0 240 270" role="img"
           aria-label="${character.name}, ${character.role}"
           xmlns="http://www.w3.org/2000/svg"
           data-mb-avatar-svg="true"
           data-mb-character="${characterKey}"
           preserveAspectRatio="xMidYMid meet">
        ${createBackground(character)}

        <path d="M35 270 L45 214 Q49 195 75 187 L97 181 L143 181 L165 187 Q191 195 195 214 L205 270Z" fill="${character.shirt}" stroke="#241A17" stroke-width="4" stroke-linejoin="round"/>
        <path d="M88 187 L106 210 L120 199 L134 210 L152 187" fill="none" stroke="${character.shirtLight}" stroke-width="4" stroke-linecap="round"/>
        <path d="M101 151 L101 187 Q120 201 139 187 L139 151Z" fill="${character.skin}" stroke="#251A16" stroke-width="3"/>

        ${createHairBack(character)}

        <path d="M86 107 Q73 100 75 119 Q78 134 91 130Z" fill="${character.skin}" stroke="#251A16" stroke-width="3"/>
        <path d="M154 107 Q167 100 165 119 Q162 134 149 130Z" fill="${character.skin}" stroke="#251A16" stroke-width="3"/>

        <path d="M87 80 Q91 58 120 58 Q149 58 153 80 L149 130 Q143 159 120 166 Q97 159 91 130Z" fill="${character.skin}" stroke="#251A16" stroke-width="4" stroke-linejoin="round"/>
        <path d="M120 63 Q146 65 150 87 L145 130 Q139 151 124 160 Q142 134 137 103 Q136 78 120 63Z" fill="${character.shadow}" opacity=".28"/>
        <path d="M96 87 Q103 77 113 77" stroke="${character.highlight}" stroke-width="3" fill="none" stroke-linecap="round"/>

        <path d="M95 103 Q106 96 114 103 M126 103 Q136 96 145 103" stroke="#211715" stroke-width="5" fill="none" stroke-linecap="round"/>

        <g data-mb-eye-open="true">
          <path d="M95 112 Q105 102 115 112 Q106 124 95 112Z" fill="#FFF7E9" stroke="#241A17" stroke-width="2.5"/>
          <ellipse cx="105" cy="113" rx="4" ry="6" fill="#271C18"/>
          <circle cx="106.5" cy="110.5" r="1.5" fill="#FFFFFF"/>
          <path d="M125 112 Q135 102 145 112 Q134 124 125 112Z" fill="#FFF7E9" stroke="#241A17" stroke-width="2.5"/>
          <ellipse cx="135" cy="113" rx="4" ry="6" fill="#271C18"/>
          <circle cx="136.5" cy="110.5" r="1.5" fill="#FFFFFF"/>
        </g>

        <g data-mb-eye-closed="true" style="display:none">
          <path d="M96 113 Q105 118 114 113 M126 113 Q135 118 144 113" stroke="#241A17" stroke-width="3" fill="none" stroke-linecap="round"/>
        </g>

        <path d="M120 114 L116 130 Q120 133 125 130" fill="none" stroke="${character.shadow}" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M95 129 Q101 133 107 129 M133 129 Q139 133 145 129" fill="none" stroke="${character.highlight}" stroke-width="3" opacity=".55"/>

        <g data-mb-mouth-frame="0"><path d="M109 142 Q120 148 131 142" fill="none" stroke="#2C1715" stroke-width="3.5" stroke-linecap="round"/></g>
        <g data-mb-mouth-frame="1" style="display:none">
          <path d="M110 141 Q120 147 130 141 Q127 151 120 151 Q113 151 110 141Z" fill="#311719" stroke="#261714" stroke-width="2.5"/>
          <path d="M115 144 Q120 147 125 144" fill="none" stroke="#FFF0D9" stroke-width="2" stroke-linecap="round"/>
        </g>
        <g data-mb-mouth-frame="2" style="display:none">
          <path d="M108 140 Q120 147 132 140 Q130 154 120 155 Q110 154 108 140Z" fill="#281315" stroke="#261714" stroke-width="2.5"/>
          <path d="M114 145 Q120 148 126 145 L124 149 Q120 151 116 149Z" fill="#FFF0D9"/>
        </g>

        ${createHairFront(character)}

        ${characterKey === "akinyi" || characterKey === "wanjiku" ? '<circle cx="82" cy="131" r="3" fill="#E9C36D"/><circle cx="158" cy="131" r="3" fill="#E9C36D"/>' : ""}
      </svg>
    `;
  }

  /* ----------------------------------------------------------
     5. RESPONSIVE GLASS UI STYLES
     ---------------------------------------------------------- */

  const style = document.createElement("style");
  style.id = "mavunobridge-responsive-glass-guide-styles";
  style.textContent = `
    #mb-guide-compass,
    #mb-guide-widget,
    #mb-guide-widget * {
      box-sizing: border-box;
    }

    #mb-guide-compass {
      position: fixed;
      left: 14px;
      right: auto;
      bottom: 14px;
      z-index: 99980;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      min-width: 48px;
      min-height: 46px;
      padding: 9px 13px;
      border: 1px solid rgba(255,255,255,.82);
      border-radius: 14px;
      background: #244B30;
      color: #FFFFFF;
      font: 800 13px Arial, Helvetica, sans-serif;
      box-shadow: 0 5px 18px rgba(24,50,29,.23);
      cursor: pointer;
      touch-action: manipulation;
    }

    #mb-guide-compass:hover { background: #193B24; }
    #mb-guide-compass:focus-visible { outline: 3px solid #D0A54E; outline-offset: 3px; }
    #mb-guide-compass svg { width: 23px; height: 23px; flex: 0 0 23px; }

    #mb-guide-widget {
      position: fixed;
      z-index: 99979;
      left: 14px;
      right: auto;
      bottom: 70px;
      top: auto;
      width: min(370px, calc(100vw - 28px));
      max-height: min(620px, calc(100dvh - 86px));
      display: none;
      flex-direction: column;
      overflow: hidden;
      border: 1px solid rgba(255,255,255,.76);
      border-radius: 16px;
      background: rgba(248,251,245,.72);
      color: #24382A;
      box-shadow: 0 12px 38px rgba(20,35,23,.17), 0 2px 8px rgba(20,35,23,.07);
      backdrop-filter: blur(9px) saturate(125%);
      -webkit-backdrop-filter: blur(9px) saturate(125%);
      font-family: Arial, Helvetica, sans-serif;
      transition: left .16s ease, right .16s ease, top .16s ease, bottom .16s ease;
    }

    #mb-guide-widget.mb-guide-open { display: flex; }

    #mb-guide-widget .mb-guide-header,
    #mb-guide-widget .mb-guide-settings,
    #mb-guide-widget .mb-guide-voice-row,
    #mb-guide-widget .mb-guide-voice-status,
    #mb-guide-widget .mb-guide-progress,
    #mb-guide-widget .mb-guide-footer {
      background: rgba(255,255,255,.45);
    }

    .mb-guide-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex: 0 0 auto;
      gap: 8px;
      padding: 10px 12px;
      border-bottom: 1px solid rgba(225,233,220,.65);
    }

    .mb-guide-brand { display:flex; align-items:center; gap:8px; min-width:0; color:#244B30; font-size:13px; font-weight:800; }
    .mb-guide-mark { display:grid; place-items:center; width:29px; height:29px; flex:0 0 29px; border-radius:9px; background:rgba(230,239,221,.86); }
    .mb-guide-header-actions { display:flex; flex:0 0 auto; gap:5px; }
    .mb-guide-icon-button { display:grid; place-items:center; width:31px; height:31px; border:0; border-radius:8px; background:rgba(237,242,232,.86); color:#304733; font-size:18px; cursor:pointer; touch-action:manipulation; }

    .mb-guide-scroll { min-height:0; flex:1 1 auto; overflow-y:auto; overscroll-behavior:contain; background:transparent; }

    .mb-guide-character-row {
      display:grid;
      grid-template-columns:100px minmax(0,1fr);
      align-items:center;
      gap:11px;
      padding:11px 12px 8px;
      background:transparent;
    }

    .mb-guide-avatar { width:100px; aspect-ratio:240/270; max-height:120px; overflow:hidden; border:1px solid rgba(90,113,77,.28); border-radius:12px; background:transparent; }
    .mb-guide-avatar svg { display:block; width:100%; height:100%; }
    .mb-guide-character-name { margin:0 0 3px; color:#263B2B; font-size:16px; line-height:1.2; font-weight:800; }
    .mb-guide-character-role { margin:0 0 7px; color:#536653; font-size:11px; line-height:1.35; }
    .mb-guide-label { display:block; margin-bottom:4px; color:#3F5341; font-size:10px; line-height:1.3; font-weight:800; }

    .mb-guide-select { display:block; width:100%; min-width:0; min-height:33px; border:1px solid rgba(193,207,184,.95); border-radius:8px; padding:5px 7px; background:rgba(255,255,255,.87); color:#293D2C; font:12px Arial, Helvetica, sans-serif; }
    .mb-guide-select:focus-visible, .mb-guide-button:focus-visible, .mb-guide-test-button:focus-visible { outline:2px solid #73985E; outline-offset:2px; }

    .mb-guide-copy { padding:0 12px 10px; background:transparent; }
    .mb-guide-eyebrow { margin:3px 0 5px; color:#54753E; font-size:9px; font-weight:800; letter-spacing:1.1px; text-transform:uppercase; }
    .mb-guide-title { margin:0 0 7px; color:#203A28; font-size:20px; line-height:1.17; font-weight:850; overflow-wrap:anywhere; }
    .mb-guide-description { margin:0; color:#344936; font-size:12px; line-height:1.55; overflow-wrap:anywhere; }
    .mb-guide-tip { margin-top:9px; padding:8px 10px; border-left:3px solid #79945B; border-radius:0 8px 8px 0; background:rgba(231,241,220,.76); color:#3E5640; font-size:10px; line-height:1.5; }

    .mb-guide-settings { display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1fr); gap:8px; padding:9px 12px 8px; border-top:1px solid rgba(225,233,220,.65); }
    .mb-guide-setting { min-width:0; }
    .mb-guide-voice-row { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:7px; padding:0 12px 8px; }
    .mb-guide-read-toggle { display:flex; align-items:center; gap:5px; color:#405643; font-size:10px; font-weight:700; }
    .mb-guide-read-toggle input { accent-color:#315C38; }
    .mb-guide-test-button { min-height:30px; border:1px solid rgba(193,207,184,.95); border-radius:8px; padding:5px 9px; background:rgba(255,255,255,.88); color:#2B4B31; font-size:10px; font-weight:800; cursor:pointer; }
    .mb-guide-voice-status { padding:0 12px 8px; color:#586A58; font-size:9px; line-height:1.4; }

    .mb-guide-progress { padding:0 12px 9px; }
    .mb-guide-progress-label { display:flex; justify-content:space-between; gap:8px; margin-bottom:5px; color:#536353; font-size:9px; font-weight:800; }
    .mb-guide-progress-track { height:4px; overflow:hidden; border-radius:99px; background:rgba(217,226,209,.9); }
    .mb-guide-progress-value { width:0; height:100%; border-radius:99px; background:#648749; transition:width .15s ease; }

    .mb-guide-footer { display:flex; align-items:center; justify-content:space-between; gap:6px; padding:8px 10px; border-top:1px solid rgba(225,233,220,.7); }
    .mb-guide-footer-right { display:flex; align-items:center; gap:5px; }
    .mb-guide-button { min-height:33px; min-width:0; border:1px solid rgba(193,207,184,.95); border-radius:8px; padding:7px 9px; background:rgba(255,255,255,.88); color:#304832; font:800 10px Arial, Helvetica, sans-serif; white-space:nowrap; cursor:pointer; touch-action:manipulation; }
    .mb-guide-button:disabled { opacity:.42; cursor:not-allowed; }
    .mb-guide-primary { border-color:#244B30; background:#244B30; color:#FFFFFF; }
    .mb-guide-primary:hover { background:#193B24; }
    .mb-guide-skip { border:0; padding:7px 3px; background:transparent; color:#4F624F; font-size:10px; font-weight:800; cursor:pointer; }

    .mb-guide-mounted-avatar { display:block; width:min(155px,100%); max-width:100%; aspect-ratio:240/270; overflow:hidden; }
    .mb-guide-mounted-avatar svg { display:block; width:100%; height:100%; }

    /* Regular phones: a narrow bottom/upper sheet with internal scrolling. */
    @media (max-width:600px) {
      #mb-guide-compass { left:10px; bottom:10px; }
      #mb-guide-widget { left:8px; right:8px; width:auto; max-height:calc(100dvh - 82px); border-radius:14px; }
      .mb-guide-character-row { grid-template-columns:clamp(76px,25vw,98px) minmax(0,1fr); gap:9px; padding:10px 10px 7px; }
      .mb-guide-avatar { width:100%; max-height:116px; }
      .mb-guide-copy { padding:0 10px 9px; }
      .mb-guide-settings { padding:8px 10px 7px; gap:7px; }
      .mb-guide-voice-row { padding:0 10px 7px; }
      .mb-guide-voice-status { padding:0 10px 7px; }
      .mb-guide-progress { padding:0 10px 8px; }
      .mb-guide-footer { padding:7px 8px; }
    }

    /* Narrow phones: single-column settings and smaller controls. */
    @media (max-width:360px) {
      #mb-guide-widget { left:6px; right:6px; width:auto; max-height:calc(100dvh - 74px); }
      .mb-guide-character-row { grid-template-columns:74px minmax(0,1fr); gap:8px; padding:8px 8px 6px; }
      .mb-guide-avatar { width:74px; max-height:89px; }
      .mb-guide-character-name { font-size:14px; }
      .mb-guide-character-role { font-size:10px; margin-bottom:5px; }
      .mb-guide-label { font-size:9px; }
      .mb-guide-select { min-height:31px; padding:4px 5px; font-size:11px; }
      .mb-guide-copy { padding:0 8px 8px; }
      .mb-guide-title { font-size:18px; }
      .mb-guide-description { font-size:11px; line-height:1.45; }
      .mb-guide-tip { font-size:9px; padding:7px 8px; margin-top:7px; }
      .mb-guide-settings { grid-template-columns:minmax(0,1fr); gap:6px; padding:7px 8px; }
      .mb-guide-voice-row { padding:0 8px 7px; }
      .mb-guide-voice-status { padding:0 8px 7px; }
      .mb-guide-progress { padding:0 8px 7px; }
      .mb-guide-footer { padding:6px 7px; }
      .mb-guide-button { min-height:31px; padding:6px 7px; font-size:10px; }
      .mb-guide-skip { font-size:9px; }
    }

    /* Very short screens: allow the card body to scroll, not the page. */
    @media (max-height:520px) {
      #mb-guide-widget { max-height:calc(100dvh - 66px); }
      .mb-guide-character-row { padding-top:7px; padding-bottom:5px; }
      .mb-guide-avatar { max-height:82px; }
      .mb-guide-copy { padding-bottom:6px; }
      .mb-guide-title { font-size:17px; }
      .mb-guide-description { line-height:1.4; }
      .mb-guide-tip { margin-top:6px; padding:6px 8px; }
      .mb-guide-settings { padding-top:6px; padding-bottom:5px; }
      .mb-guide-voice-status { padding-bottom:5px; }
      .mb-guide-progress { padding-bottom:6px; }
    }

    @media (prefers-reduced-motion:reduce) {
      #mb-guide-widget, #mb-guide-compass, .mb-guide-progress-value { transition:none !important; }
    }
  `;
  document.head.appendChild(style);

  /* ----------------------------------------------------------
     6. BUILD COMPASS AND PANEL
     ---------------------------------------------------------- */

  const compass = document.createElement("button");
  compass.type = "button";
  compass.id = "mb-guide-compass";
  compass.setAttribute("aria-label", "Open MavunoBridge guide");
  compass.setAttribute("aria-controls", "mb-guide-widget");
  compass.setAttribute("aria-expanded", "false");
  compass.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="12" cy="12" r="9.2" stroke="currentColor" stroke-width="1.8"/>
      <path d="M15.7 7.7 L13.5 13.5 L7.7 15.7 L10 10Z" fill="#F3CB72" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/>
      <circle cx="12" cy="12" r="1.3" fill="currentColor"/>
    </svg>
    <span>Guide</span>
  `;

  const widget = document.createElement("section");
  widget.id = "mb-guide-widget";
  widget.setAttribute("aria-label", "MavunoBridge tour assistant");
  widget.innerHTML = `
    <header class="mb-guide-header">
      <div class="mb-guide-brand"><span class="mb-guide-mark" aria-hidden="true">🌱</span><span>MavunoBridge Guide</span></div>
      <div class="mb-guide-header-actions">
        <button type="button" class="mb-guide-icon-button" id="mb-guide-stop" title="Stop speaking" aria-label="Stop speaking">■</button>
        <button type="button" class="mb-guide-icon-button" id="mb-guide-close" title="Close guide" aria-label="Close guide">×</button>
      </div>
    </header>
    <div class="mb-guide-scroll">
      <div class="mb-guide-character-row">
        <div class="mb-guide-avatar" id="mb-guide-avatar"></div>
        <div>
          <p class="mb-guide-character-name" id="mb-guide-character-name">Akinyi</p>
          <p class="mb-guide-character-role" id="mb-guide-character-role">Farmer Guide</p>
          <label class="mb-guide-label" for="mb-guide-character-select">Choose your guide</label>
          <select class="mb-guide-select" id="mb-guide-character-select">
            <option value="akinyi">Akinyi</option><option value="wanjiku">Wanjiku</option>
            <option value="kamau">Kamau</option><option value="otieno">Otieno</option>
          </select>
        </div>
      </div>
      <div class="mb-guide-copy">
        <p class="mb-guide-eyebrow" id="mb-guide-eyebrow">YOUR WEBSITE TOUR</p>
        <h2 class="mb-guide-title" id="mb-guide-title">Karibu to MavunoBridge!</h2>
        <p class="mb-guide-description" id="mb-guide-description">Explore the website with your own guide.</p>
        <div class="mb-guide-tip" id="mb-guide-tip">Choose Start tour to begin.</div>
      </div>
      <div class="mb-guide-settings">
        <div class="mb-guide-setting">
          <label class="mb-guide-label" for="mb-guide-language">Speaking language</label>
          <select class="mb-guide-select" id="mb-guide-language">
            <option value="auto">Automatic — character default</option>
            <option value="en">English</option>
            <option value="sw">Kiswahili</option>
            <option value="sheng">Sheng — English + Kiswahili</option>
          </select>
        </div>
        <div class="mb-guide-setting">
          <label class="mb-guide-label" for="mb-guide-voice">Voice</label>
          <select class="mb-guide-select" id="mb-guide-voice"><option value="">Automatic — match character</option></select>
        </div>
      </div>
      <div class="mb-guide-voice-row">
        <label class="mb-guide-read-toggle"><input type="checkbox" id="mb-guide-read-aloud" checked><span>Read steps aloud</span></label>
        <button class="mb-guide-test-button" id="mb-guide-test-voice" type="button">Test voice</button>
      </div>
      <div class="mb-guide-voice-status" id="mb-guide-voice-status" aria-live="polite">Automatic voice will try to match your selected character.</div>
      <div class="mb-guide-progress">
        <div class="mb-guide-progress-label"><span id="mb-guide-step-count">Ready to begin</span><span id="mb-guide-progress-percent">0%</span></div>
        <div class="mb-guide-progress-track" id="mb-guide-progress-track" role="progressbar" aria-label="Tour progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><div class="mb-guide-progress-value" id="mb-guide-progress-value"></div></div>
      </div>
    </div>
    <footer class="mb-guide-footer">
      <button class="mb-guide-skip" id="mb-guide-skip" type="button">Skip tour</button>
      <div class="mb-guide-footer-right">
        <button class="mb-guide-button" id="mb-guide-back" type="button" disabled>Back</button>
        <button class="mb-guide-button mb-guide-primary" id="mb-guide-next" type="button">Start tour</button>
      </div>
    </footer>
  `;

  document.body.appendChild(compass);
  document.body.appendChild(widget);

  const ui = {
    avatar: widget.querySelector("#mb-guide-avatar"),
    characterName: widget.querySelector("#mb-guide-character-name"),
    characterRole: widget.querySelector("#mb-guide-character-role"),
    characterSelect: widget.querySelector("#mb-guide-character-select"),
    language: widget.querySelector("#mb-guide-language"),
    voice: widget.querySelector("#mb-guide-voice"),
    readAloud: widget.querySelector("#mb-guide-read-aloud"),
    testVoice: widget.querySelector("#mb-guide-test-voice"),
    voiceStatus: widget.querySelector("#mb-guide-voice-status"),
    stop: widget.querySelector("#mb-guide-stop"),
    close: widget.querySelector("#mb-guide-close"),
    eyebrow: widget.querySelector("#mb-guide-eyebrow"),
    title: widget.querySelector("#mb-guide-title"),
    description: widget.querySelector("#mb-guide-description"),
    tip: widget.querySelector("#mb-guide-tip"),
    count: widget.querySelector("#mb-guide-step-count"),
    percent: widget.querySelector("#mb-guide-progress-percent"),
    progressTrack: widget.querySelector("#mb-guide-progress-track"),
    progressValue: widget.querySelector("#mb-guide-progress-value"),
    skip: widget.querySelector("#mb-guide-skip"),
    back: widget.querySelector("#mb-guide-back"),
    next: widget.querySelector("#mb-guide-next")
  };

  /* ----------------------------------------------------------
     7. TOUR STEPS — ENGLISH, KISWAHILI AND SHENG
     ---------------------------------------------------------- */

  const STEPS = [
    {
      targets: ["#marketplace", "#marketplaceSection", "[data-marketplace]", "main"],
      en: {
        title: "Karibu to MavunoBridge!",
        body: "This is your connection between farmers and buyers. Explore products, compare offers and discover agricultural services.",
        tip: "Choose Next to explore the website step by step."
      },
      sw: {
        title: "Karibu MavunoBridge!",
        body: "Hii ni sehemu ambapo wakulima na wanunuzi wanaunganishwa. Angalia bidhaa, linganisha bei na upate huduma za kilimo.",
        tip: "Bonyeza Next kuendelea. Unaweza kuacha tour wakati wowote."
      },
      sheng: {
        title: "Karibu MavunoBridge!",
        body: "Hapa farmers na buyers wana-connect. Check products, compare bei na upate farming services.",
        tip: "Bonyeza Next tukupitishe website step by step."
      }
    },
    {
      targets: ["#searchInput", "#marketSearch", "#search", "input[type='search']", "[data-marketplace-search]", ".search-bar input"],
      en: {
        title: "Search for products",
        body: "Use the search bar to find produce, farm supplies, tools and other agricultural products.",
        tip: "Try searching for tomatoes, maize, beans or avocados."
      },
      sw: {
        title: "Tafuta bidhaa",
        body: "Tumia sehemu ya kutafuta kupata mazao, vifaa vya shamba, tools na bidhaa nyingine za kilimo.",
        tip: "Unaweza kutafuta nyanya, mahindi, maharagwe au parachichi."
      },
      sheng: {
        title: "Search bidhaa unahitaji",
        body: "Tumia search bar kupata produce, farm supplies, tools na agricultural products zingine.",
        tip: "Try ku-search tomatoes, maize, beans ama avocados."
      }
    },
    {
      targets: ["#categories", "#categoryGrid", ".category-grid", "[data-category-grid]", "#categoriesSection", ".categories"],
      en: {
        title: "Explore categories",
        body: "Browse fruits, vegetables, grains, cereals, legumes, livestock, farm equipment and agricultural services.",
        tip: "Choose a category to narrow down your search."
      },
      sw: {
        title: "Angalia makundi ya bidhaa",
        body: "Angalia matunda, mboga, nafaka, mifugo, vifaa vya shamba na huduma za kilimo.",
        tip: "Chagua kundi linalokufaa kupata bidhaa kwa urahisi."
      },
      sheng: {
        title: "Explore categories",
        body: "Check fruits, vegetables, grains, cereals, livestock, farm tools na services za kilimo.",
        tip: "Chagua category yako upate products faster."
      }
    },
    {
      targets: ["#listingGrid", "#productGrid", ".listing-grid", ".product-grid", "[data-listing-grid]", "#marketplaceListings"],
      en: {
        title: "Compare product listings",
        body: "Check product details, quantities, prices and locations before choosing a seller.",
        tip: "Read the listing details before you make a decision."
      },
      sw: {
        title: "Linganisha bidhaa",
        body: "Angalia maelezo ya bidhaa, kiasi, bei na eneo la muuzaji kabla ya kuchagua.",
        tip: "Soma maelezo yote ya bidhaa kwanza."
      },
      sheng: {
        title: "Compare listings",
        body: "Angalia product details, quantities, prices na location kabla uchague seller.",
        tip: "Read listing details kwanza ndio ufanye decision."
      }
    },
    {
      targets: ["#sellButton", "#heroSellButton", "[data-open-sell]", "[data-action='sell']", ".sell-button"],
      en: {
        title: "List your products",
        body: "Farmers can list their produce for potential buyers. Add accurate descriptions, quantities and prices.",
        tip: "Clear information helps buyers understand your offer."
      },
      sw: {
        title: "Weka bidhaa zako sokoni",
        body: "Wakulima wanaweza kuweka mazao yao ili wanunuzi wayaone. Weka maelezo, kiasi na bei sahihi.",
        tip: "Maelezo mazuri yanasaidia wanunuzi kuelewa bidhaa zako."
      },
      sheng: {
        title: "List bidhaa zako",
        body: "Farmers wanaweza kuweka produce yao online. Weka description, quantity na bei yenye iko accurate.",
        tip: "Maelezo clear yanasaidia buyers kuelewa offer yako."
      }
    },
    {
      targets: ["#smartAssist", "#smartAssistButton", "#smart-assist", "#smart-assist-nav", "[data-nav='smart-assist']", "a[href*='smart-assist']", "a[href*='smart_assist']"],
      en: {
        title: "Meet Smart Assist",
        body: "Smart Assist is designed to offer farming guidance, crop ideas and useful agricultural information.",
        tip: "Open Smart Assist to explore the features available."
      },
      sw: {
        title: "Kutana na Smart Assist",
        body: "Smart Assist imeundwa kusaidia wakulima kupata ushauri wa kilimo, mawazo ya mazao na taarifa muhimu.",
        tip: "Fungua Smart Assist uangalie huduma zinazopatikana."
      },
      sheng: {
        title: "Meet Smart Assist",
        body: "Smart Assist inaweza kusaidia farmers na farming tips, crop ideas na information ya kilimo.",
        tip: "Open Smart Assist page ucheck features zilizopo."
      }
    },
    {
      targets: ["#sacco", "#saccoHub", "#saccoButton", "#sacco-hub", "[data-nav='sacco']", "a[href*='sacco']"],
      en: {
        title: "Explore the SACCO Hub",
        body: "Visit the SACCO Hub to explore available SACCO information and opportunities.",
        tip: "Check each organisation's requirements before joining."
      },
      sw: {
        title: "Angalia SACCO Hub",
        body: "Tembelea SACCO Hub kuangalia taarifa za SACCO na fursa zinazopatikana.",
        tip: "Soma masharti ya kila organisation kabla ya kujiunga."
      },
      sheng: {
        title: "Explore SACCO Hub",
        body: "Tembelea SACCO Hub uone information na opportunities za SACCO zinazopatikana.",
        tip: "Check requirements vizuri kabla ya kujiunga."
      }
    }
  ];

  /* ----------------------------------------------------------
     8. LANGUAGE AND VOICE PICKING
     ---------------------------------------------------------- */

  function effectiveLanguage(characterKey = selectedCharacter) {
    if (selectedLanguageMode !== "auto") return selectedLanguageMode;
    return (CHARACTERS[characterKey] || CHARACTERS.akinyi).defaultLanguage || "en";
  }

  function stepWording(step) {
    return step[effectiveLanguage()] || step.en;
  }

  function languageTag(language) {
    if (language === "sw") return "sw-KE";
    return "en-KE"; // Sheng is mixed speech; browser voice language is English-Kenya when available.
  }

  const FEMALE_HINTS = ["female", "woman", "zira", "samantha", "karen", "moira", "tessa", "victoria", "aria", "jenny", "salli", "joanna", "ava", "serena", "susan", "hazel", "heera", "neerja", "natasha", "sara", "emma", "amy", "olivia", "nicole"];
  const MALE_HINTS = ["male", "man", "david", "mark", "george", "james", "guy", "ryan", "daniel", "fred", "thomas", "matthew", "aaron", "liam", "rishi", "prabhat", "charles", "oliver", "andrew", "brian", "eric", "alex"];

  function guessedGender(voice) {
    const label = ((voice.name || "") + " " + (voice.voiceURI || "")).toLowerCase();
    if (FEMALE_HINTS.some((hint) => label.includes(hint))) return "female";
    if (MALE_HINTS.some((hint) => label.includes(hint))) return "male";
    return "unknown";
  }

  function voiceLanguageMatches(voice, language) {
    const code = (voice.lang || "").toLowerCase();
    if (language === "sw") return code.startsWith("sw");
    return code.startsWith("en");
  }

  function automaticVoice(language, characterKey = selectedCharacter) {
    if (!voiceList.length) return null;
    const character = CHARACTERS[characterKey] || CHARACTERS.akinyi;
    const matchesLanguage = voiceList.filter((voice) => voiceLanguageMatches(voice, language));
    const matchingGender = matchesLanguage.find((voice) => guessedGender(voice) === character.genderPreference);
    if (matchingGender) return matchingGender;
    if (matchesLanguage.length) return matchesLanguage[0];
    const anyMatchingGender = voiceList.find((voice) => guessedGender(voice) === character.genderPreference);
    return anyMatchingGender || voiceList[0];
  }

  function selectedVoiceFor(language, characterKey = selectedCharacter) {
    if (selectedVoiceURI) {
      const manualVoice = voiceList.find((voice) => voice.voiceURI === selectedVoiceURI);
      if (manualVoice) return manualVoice;
    }
    return automaticVoice(language, characterKey);
  }

  function updateVoiceStatus() {
    if (!("speechSynthesis" in window)) {
      ui.voiceStatus.textContent = "Speech is not supported in this browser; written guidance still works.";
      return;
    }
    const language = effectiveLanguage();
    const label = { en: "English", sw: "Kiswahili", sheng: "Sheng" }[language] || "English";
    if (language === "sw" && !voiceList.some((voice) => (voice.lang || "").toLowerCase().startsWith("sw"))) {
      ui.voiceStatus.textContent = "Kiswahili is selected, but no dedicated Swahili voice was detected. The browser will try its closest available voice; pronunciation may vary.";
      return;
    }
    const voice = selectedVoiceFor(language);
    ui.voiceStatus.textContent = voice
      ? label + " • " + voice.name + (selectedVoiceURI ? " • manually selected" : " • automatic match")
      : "Speaking language: " + label + ". Select Test voice to check audio.";
  }

  function populateVoices() {
    if (!("speechSynthesis" in window)) {
      ui.voice.innerHTML = '<option value="">Speech unavailable</option>';
      ui.testVoice.disabled = true;
      updateVoiceStatus();
      return;
    }

    voiceList = window.speechSynthesis.getVoices() || [];
    ui.voice.innerHTML = "";

    const automaticOption = document.createElement("option");
    automaticOption.value = "";
    automaticOption.textContent = "Automatic — match character";
    ui.voice.appendChild(automaticOption);

    voiceList.forEach((voice) => {
      const option = document.createElement("option");
      option.value = voice.voiceURI;
      option.textContent = voice.name + (voice.lang ? " (" + voice.lang + ")" : "");
      ui.voice.appendChild(option);
    });

    if (!voiceList.some((voice) => voice.voiceURI === selectedVoiceURI)) {
      selectedVoiceURI = "";
      storageSet(STORAGE.voice, "");
    }
    ui.voice.value = selectedVoiceURI;
    updateVoiceStatus();
  }

  /* ----------------------------------------------------------
     9. BLINKING AND MOUTH MOVEMENT
     ---------------------------------------------------------- */

  function allAvatarSVGs() {
    return Array.from(document.querySelectorAll("svg[data-mb-avatar-svg]"));
  }

  function setEyeState(svg, open) {
    const openEyes = svg.querySelector("[data-mb-eye-open]");
    const closedEyes = svg.querySelector("[data-mb-eye-closed]");
    if (openEyes) openEyes.style.display = open ? "" : "none";
    if (closedEyes) closedEyes.style.display = open ? "none" : "";
  }

  function initialiseBlinking(svg) {
    if (svg.dataset.mbBlinkInitialised === "true") return;
    svg.dataset.mbBlinkInitialised = "true";
    setEyeState(svg, true);

    function scheduleBlink() {
      if (!svg.isConnected) return;
      svg._mbBlinkTimer = setTimeout(() => {
        if (!svg.isConnected) return;
        setEyeState(svg, false);
        svg._mbBlinkCloseTimer = setTimeout(() => {
          if (!svg.isConnected) return;
          setEyeState(svg, true);
          scheduleBlink();
        }, 95);
      }, 2500 + Math.random() * 3300);
    }
    scheduleBlink();
  }

  function initialiseAllAvatars() {
    allAvatarSVGs().forEach(initialiseBlinking);
  }

  function setMouthFrame(svg, frame) {
    svg.querySelectorAll("[data-mb-mouth-frame]").forEach((mouth) => {
      mouth.style.display = Number(mouth.getAttribute("data-mb-mouth-frame")) === frame ? "" : "none";
    });
  }

  function setAllMouths(frame) {
    allAvatarSVGs().forEach((svg) => setMouthFrame(svg, frame));
  }

  function startMouthMovement() {
    if (mouthTimer) return;
    let index = 0;
    const sequence = [1, 2, 1, 0, 1, 2];
    setAllMouths(1);
    mouthTimer = setInterval(() => {
      setAllMouths(sequence[index]);
      index = (index + 1) % sequence.length;
    }, 125);
  }

  function stopMouthMovement() {
    if (mouthTimer) clearInterval(mouthTimer);
    mouthTimer = null;
    setAllMouths(0);
  }

  /* ----------------------------------------------------------
     10. SPEECH CONTROL AND OPTIONAL SMART ASSIST CONNECTION
     ---------------------------------------------------------- */

  function stopSpeech() {
    if ("speechSynthesis" in window) {
      try { window.speechSynthesis.cancel(); } catch { /* ignore */ }
    }
    activeGuideUtterance = null;
    stopMouthMovement();
  }

  function speak(text, options = {}) {
    if (!readAloud && !options.force) return;
    if (!("speechSynthesis" in window)) {
      ui.voiceStatus.textContent = "Your browser cannot play spoken audio.";
      return;
    }
    if (!text || !String(text).trim()) return;

    stopSpeech();

    const characterKey = options.character || selectedCharacter;
    const language = options.language || effectiveLanguage(characterKey);
    const utterance = new SpeechSynthesisUtterance(String(text));
    const voice = selectedVoiceFor(language, characterKey);

    if (voice) utterance.voice = voice;
    utterance.lang = languageTag(language);
    utterance.rate = 0.92;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      activeGuideUtterance = utterance;
      startMouthMovement();
      ui.voiceStatus.textContent = "Speaking in " + language.toUpperCase() + ".";
    };

    utterance.onend = () => {
      if (activeGuideUtterance === utterance) {
        activeGuideUtterance = null;
        stopMouthMovement();
        updateVoiceStatus();
      }
    };

    utterance.onerror = (event) => {
      if (activeGuideUtterance === utterance) {
        activeGuideUtterance = null;
        stopMouthMovement();
        if (event.error !== "canceled" && event.error !== "interrupted") {
          ui.voiceStatus.textContent = "Speech could not play. Try another installed voice.";
        }
      }
    };

    activeGuideUtterance = utterance;
    try {
      window.speechSynthesis.speak(utterance);
    } catch {
      activeGuideUtterance = null;
      stopMouthMovement();
      ui.voiceStatus.textContent = "Unable to start speech in this browser.";
    }
  }

  function connectExternalSpeech() {
    if (!("speechSynthesis" in window) || externalSpeechHooksInstalled) return;
    const synthesis = window.speechSynthesis;

    try {
      const nativeSpeak = synthesis.speak;
      if (typeof nativeSpeak !== "function") return;

      synthesis.speak = function (utterance) {
        if (utterance && typeof utterance === "object") {
          // Preserve caller-selected languages and voices.
          if (!utterance.voice) {
            const lang = (utterance.lang || "").toLowerCase();
            const inferred = lang.startsWith("sw") ? "sw" : (lang.startsWith("en") ? "en" : effectiveLanguage());
            const voice = selectedVoiceFor(inferred);
            if (voice) {
              try { utterance.voice = voice; } catch { /* ignore */ }
            }
          }

          const start = () => startMouthMovement();
          const finish = () => stopMouthMovement();
          try {
            utterance.addEventListener("start", start, { once: true });
            utterance.addEventListener("end", finish, { once: true });
            utterance.addEventListener("error", finish, { once: true });
          } catch { /* tour speech has its own handlers */ }
        }
        return nativeSpeak.call(this, utterance);
      };
      externalSpeechHooksInstalled = true;
    } catch {
      // The guide continues working if the browser prevents this integration.
    }
  }

  /* ----------------------------------------------------------
     11. AVATAR MOUNTING
     ---------------------------------------------------------- */

  function renderSelectedCharacter() {
    const character = CHARACTERS[selectedCharacter] || CHARACTERS.akinyi;
    ui.avatar.innerHTML = createAvatarSVG(selectedCharacter);
    ui.characterName.textContent = character.name;
    ui.characterRole.textContent = character.role;
    ui.characterSelect.value = selectedCharacter;
    initialiseAllAvatars();
  }

  const AVATAR_CONTAINER_SELECTOR = [
    "[data-mavuno-avatar]", "[data-tour-avatar]",
    "#smartAssistantAvatar", "#smart-assistant-avatar",
    "#smartAssistAvatar", "#smart-assist-avatar",
    ".mavuno-assistant-avatar", ".smart-assistant-avatar", ".smart-assist-avatar"
  ].join(",");

  function characterForContainer(element) {
    const configured = (
      element.getAttribute("data-character") ||
      element.getAttribute("data-mavuno-avatar") ||
      element.getAttribute("data-avatar") || ""
    ).toLowerCase().trim();

    if (CHARACTERS[configured]) return configured;
    const hint = (element.id + " " + element.className).toLowerCase();
    if (hint.includes("sacco")) return "otieno";
    if (hint.includes("smart") || hint.includes("assist")) return "kamau";
    if (hint.includes("market") || hint.includes("buyer")) return "wanjiku";
    return "akinyi";
  }

  function mountAvatar(target, characterKey = "akinyi") {
    const element = typeof target === "string" ? document.querySelector(target) : target;
    if (!(element instanceof HTMLElement)) return false;
    if (element === widget || widget.contains(element) || element === compass) return false;
    if (element.dataset.mbGuideAvatarMounted === "true") return false;
    if (!CHARACTERS[characterKey]) return false;

    // Only the dedicated avatar container is changed; parent page content is untouched.
    element.innerHTML = createAvatarSVG(characterKey);
    element.classList.add("mb-guide-mounted-avatar");
    element.dataset.mbGuideAvatarMounted = "true";
    initialiseAllAvatars();
    return true;
  }

  function mountExistingAvatars() {
    document.querySelectorAll(AVATAR_CONTAINER_SELECTOR).forEach((element) => {
      mountAvatar(element, characterForContainer(element));
    });
  }

  function watchForAvatars() {
    if (!("MutationObserver" in window) || !document.body) return;
    observer = new MutationObserver(() => {
      if (observerQueued) return;
      observerQueued = true;
      setTimeout(() => {
        observerQueued = false;
        mountExistingAvatars();
        initialiseAllAvatars();
      }, 100);
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  /* ----------------------------------------------------------
     12. TARGET FINDING, HIGHLIGHTING AND SMART POSITIONING
     ---------------------------------------------------------- */

  function findTarget(step) {
    if (!step || !Array.isArray(step.targets)) return null;
    for (const selector of step.targets) {
      try {
        const element = document.querySelector(selector);
        if (element && element !== widget && !widget.contains(element) && element !== compass) return element;
      } catch { /* Ignore invalid selectors. */ }
    }
    return null;
  }

  function clearTargetHighlight() {
    if (!highlightTarget) return;
    highlightTarget.classList.remove("mb-guide-highlighted");
    highlightTarget.style.removeProperty("outline");
    highlightTarget.style.removeProperty("outline-offset");
    highlightTarget.style.removeProperty("border-radius");
    highlightTarget = null;
  }

  function resetGuidePosition() {
    widget.style.removeProperty("left");
    widget.style.removeProperty("right");
    widget.style.removeProperty("top");
    widget.style.removeProperty("bottom");
    widget.style.removeProperty("width");
  }

  function positionGuideAwayFromTarget(target) {
    if (!target || !guideOpen) {
      resetGuidePosition();
      return;
    }

    const rect = target.getBoundingClientRect();
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const mobile = screenWidth <= 600;
    const targetCenterX = rect.left + rect.width / 2;
    const targetCenterY = rect.top + rect.height / 2;

    if (mobile) {
      // Phones do not have enough width for side-by-side placement.
      widget.style.left = screenWidth <= 360 ? "6px" : "8px";
      widget.style.right = screenWidth <= 360 ? "6px" : "8px";
      widget.style.width = "auto";
      if (targetCenterY > screenHeight * 0.50) {
        widget.style.top = "8px";
        widget.style.bottom = "auto";
      } else {
        widget.style.top = "auto";
        widget.style.bottom = screenWidth <= 360 ? "66px" : "70px";
      }
      return;
    }

    widget.style.width = "min(370px, calc(100vw - 28px))";

    // Opposite side of the target, unless the target spans nearly all the width.
    if (rect.width > screenWidth * 0.68) {
      widget.style.left = "14px";
      widget.style.right = "auto";
      if (targetCenterY > screenHeight / 2) {
        widget.style.top = "12px";
        widget.style.bottom = "auto";
      } else {
        widget.style.top = "auto";
        widget.style.bottom = "70px";
      }
      return;
    }

    if (targetCenterX < screenWidth / 2) {
      widget.style.left = "auto";
      widget.style.right = "14px";
    } else {
      widget.style.left = "14px";
      widget.style.right = "auto";
    }

    if (targetCenterY > screenHeight / 2) {
      widget.style.top = "12px";
      widget.style.bottom = "auto";
    } else {
      widget.style.top = "auto";
      widget.style.bottom = "70px";
    }
  }

  function highlightStep(step) {
    clearTargetHighlight();
    const target = findTarget(step);
    if (!target) {
      resetGuidePosition();
      return;
    }

    highlightTarget = target;
    target.classList.add("mb-guide-highlighted");
    target.style.setProperty("outline", "3px solid #D7AA4D", "important");
    target.style.setProperty("outline-offset", "3px", "important");
    target.style.setProperty("border-radius", "6px", "important");

    try {
      target.scrollIntoView({ behavior: "auto", block: "nearest", inline: "nearest" });
    } catch { /* Written guidance remains available. */ }

    // Let the browser finish scrolling and laying out before measuring positions.
    requestAnimationFrame(() => {
      if (guideOpen && highlightTarget === target) positionGuideAwayFromTarget(target);
    });
  }

  /* ----------------------------------------------------------
     13. TOUR TEXT AND CONTROLS
     ---------------------------------------------------------- */

  function renderStep(index, shouldSpeak = false) {
    if (index < 0 || index >= STEPS.length) return;
    currentStep = index;
    const step = STEPS[currentStep];
    const wording = stepWording(step);
    stopSpeech();

    ui.eyebrow.textContent = effectiveLanguage() === "sw" ? "TOUR YA WEBSITE" : "YOUR WEBSITE TOUR";
    ui.title.textContent = wording.title;
    ui.description.textContent = wording.body;
    ui.tip.textContent = wording.tip;

    const stepNumber = currentStep + 1;
    const percentage = Math.round((stepNumber / STEPS.length) * 100);
    ui.count.textContent = "Step " + stepNumber + " of " + STEPS.length;
    ui.percent.textContent = percentage + "%";
    ui.progressValue.style.width = percentage + "%";
    ui.progressTrack.setAttribute("aria-valuenow", String(percentage));
    ui.back.disabled = currentStep === 0;
    ui.next.textContent = tourStarted ? (currentStep === STEPS.length - 1 ? "Finish" : "Next") : "Start tour";

    highlightStep(step);
    updateVoiceStatus();

    if (shouldSpeak && readAloud) {
      speak(wording.title + ". " + wording.body, {
        character: selectedCharacter,
        language: effectiveLanguage()
      });
    }
  }

  function openGuide() {
    guideOpen = true;
    widget.classList.add("mb-guide-open");
    compass.setAttribute("aria-expanded", "true");
    if (currentStep >= STEPS.length) {
      currentStep = 0;
      tourStarted = false;
    }
    renderStep(currentStep, false);
    ui.next.focus({ preventScroll: true });
  }

  function closeGuide() {
    guideOpen = false;
    widget.classList.remove("mb-guide-open");
    compass.setAttribute("aria-expanded", "false");
    stopSpeech();
    clearTargetHighlight();
    resetGuidePosition();
    storageSet(STORAGE.completed, "yes");
  }

  function nextStep() {
    if (!tourStarted) {
      tourStarted = true;
      renderStep(currentStep, true);
      return;
    }

    if (currentStep < STEPS.length - 1) {
      renderStep(currentStep + 1, true);
      return;
    }

    stopSpeech();
    clearTargetHighlight();
    resetGuidePosition();
    currentStep = STEPS.length;

    ui.title.textContent = selectedLanguageMode === "sw" ? "Uko tayari kuendelea!" : "You're ready to explore!";
    ui.description.textContent = selectedLanguageMode === "sw"
      ? "Tumia compass hapa chini kufungua guide tena wakati wowote."
      : "Use the compass button whenever you need help again.";
    ui.tip.textContent = selectedLanguageMode === "sw"
      ? "Asante kwa kutumia MavunoBridge."
      : "Thanks for exploring MavunoBridge.";
    ui.count.textContent = "Tour completed";
    ui.percent.textContent = "100%";
    ui.progressValue.style.width = "100%";
    ui.progressTrack.setAttribute("aria-valuenow", "100");
    ui.back.disabled = false;
    ui.next.textContent = "Close";
    storageSet(STORAGE.completed, "yes");
  }

  function previousStep() {
    if (currentStep >= STEPS.length) {
      currentStep = STEPS.length - 1;
      tourStarted = true;
      renderStep(currentStep, true);
      return;
    }
    if (currentStep > 0) renderStep(currentStep - 1, true);
  }

  /* ----------------------------------------------------------
     14. CONTROL EVENTS
     ---------------------------------------------------------- */

  ui.characterSelect.addEventListener("change", () => {
    if (!CHARACTERS[ui.characterSelect.value]) return;
    selectedCharacter = ui.characterSelect.value;
    storageSet(STORAGE.character, selectedCharacter);
    stopSpeech();
    renderSelectedCharacter();
    if (guideOpen && tourStarted && currentStep < STEPS.length) {
      renderStep(currentStep, readAloud);
    } else {
      updateVoiceStatus();
    }
  });

  ui.language.addEventListener("change", () => {
    selectedLanguageMode = ui.language.value;
    storageSet(STORAGE.language, selectedLanguageMode);
    stopSpeech();
    if (guideOpen && currentStep < STEPS.length) {
      renderStep(currentStep, tourStarted && readAloud);
    }
    updateVoiceStatus();
  });

  ui.voice.addEventListener("change", () => {
    selectedVoiceURI = ui.voice.value;
    storageSet(STORAGE.voice, selectedVoiceURI);
    stopSpeech();
    updateVoiceStatus();
  });

  ui.readAloud.addEventListener("change", () => {
    readAloud = ui.readAloud.checked;
    storageSet(STORAGE.readAloud, readAloud);
    if (!readAloud) {
      stopSpeech();
      ui.voiceStatus.textContent = "Read-aloud is off. The guide will show text only.";
    } else {
      updateVoiceStatus();
    }
  });

  ui.testVoice.addEventListener("click", () => {
    const language = effectiveLanguage();
    const samples = {
      en: "Hello! Welcome to MavunoBridge. Let me show you around.",
      sw: "Habari! Karibu MavunoBridge. Nitakusaidia kutumia tovuti hii.",
      sheng: "Sasa! Karibu MavunoBridge. Niko hapa kukuonyesha vile website inawork."
    };
    speak(samples[language], { force: true, character: selectedCharacter, language });
  });

  compass.addEventListener("click", () => guideOpen ? closeGuide() : openGuide());
  ui.close.addEventListener("click", closeGuide);
  ui.stop.addEventListener("click", stopSpeech);
  ui.skip.addEventListener("click", closeGuide);
  ui.back.addEventListener("click", previousStep);
  ui.next.addEventListener("click", () => currentStep >= STEPS.length ? closeGuide() : nextStep());

  document.addEventListener("keydown", (event) => {
    if (guideOpen && event.key === "Escape") closeGuide();
  });

  const EXISTING_TRIGGER_SELECTOR = [
    "[data-open-tour]", "[data-tour-open]", "#tourButton",
    "#websiteTourButton", "#tutorialButton", "#guideButton",
    "#helpTourButton", "#openTutorial", ".website-tour-trigger", ".tour-trigger"
  ].join(",");

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!target || typeof target.closest !== "function") return;
    const trigger = target.closest(EXISTING_TRIGGER_SELECTOR);
    if (!trigger || trigger === compass) return;
    event.preventDefault();
    openGuide();
  });

  /* ----------------------------------------------------------
     15. KEEP POSITION RESPONSIVE ON RESIZE/ROTATION
     ---------------------------------------------------------- */

  function repositionAfterResize() {
    if (!guideOpen) return;
    if (highlightTarget && highlightTarget.isConnected) {
      positionGuideAwayFromTarget(highlightTarget);
    } else {
      resetGuidePosition();
    }
  }

  window.addEventListener("resize", repositionAfterResize, { passive: true });
  window.addEventListener("orientationchange", () => setTimeout(repositionAfterResize, 120), { passive: true });

  /* ----------------------------------------------------------
     16. PUBLIC API FOR SMART ASSIST
     ---------------------------------------------------------- */

  window.MavunoBridgeAvatars = {
    speak(text, options = {}) { speak(text, options); },
    stopSpeech() { stopSpeech(); },
    startTalking() { startMouthMovement(); },
    stopTalking() { stopMouthMovement(); },
    openGuide() { openGuide(); },
    closeGuide() { closeGuide(); },
    setCharacter(characterKey) {
      if (!CHARACTERS[characterKey]) return false;
      selectedCharacter = characterKey;
      storageSet(STORAGE.character, characterKey);
      renderSelectedCharacter();
      if (guideOpen && tourStarted && currentStep < STEPS.length) renderStep(currentStep, readAloud);
      return true;
    },
    setLanguage(language) {
      if (!["auto", "en", "sw", "sheng"].includes(language)) return false;
      selectedLanguageMode = language;
      ui.language.value = language;
      storageSet(STORAGE.language, language);
      if (guideOpen && currentStep < STEPS.length) renderStep(currentStep, false);
      updateVoiceStatus();
      return true;
    },
    renderInto(target, characterKey = "akinyi") { return mountAvatar(target, characterKey); },
    getCharacters() {
      return Object.keys(CHARACTERS).map((key) => ({
        id: key,
        name: CHARACTERS[key].name,
        role: CHARACTERS[key].role,
        voiceGenderPreference: CHARACTERS[key].genderPreference,
        defaultLanguage: CHARACTERS[key].defaultLanguage
      }));
    }
  };

  /* ----------------------------------------------------------
     17. INITIALISE
     ---------------------------------------------------------- */

  function initialiseGuide() {
    loadPreferences();
    ui.characterSelect.value = selectedCharacter;
    ui.language.value = selectedLanguageMode;
    ui.readAloud.checked = readAloud;

    renderSelectedCharacter();
    populateVoices();
    connectExternalSpeech();
    mountExistingAvatars();
    initialiseAllAvatars();
    watchForAvatars();

    if ("speechSynthesis" in window) {
      window.speechSynthesis.addEventListener?.("voiceschanged", populateVoices);
      setTimeout(populateVoices, 500);
      setTimeout(populateVoices, 1500);
    }

    // The guide stays closed until the user selects the compass/button.
    widget.classList.remove("mb-guide-open");
    compass.setAttribute("aria-expanded", "false");
    guideOpen = false;
    resetGuidePosition();
    updateVoiceStatus();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialiseGuide, { once: true });
  } else {
    initialiseGuide();
  }
})();
