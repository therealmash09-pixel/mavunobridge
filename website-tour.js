/* ============================================================
   MAVUNOBRIDGE — COMPACT TOUR ASSISTANT
   Complete replacement: website-tour.js

   FEATURES
   - Compact helper panel instead of a full-screen overlay
   - Compass button fixed to the bottom-left
   - Four selectable, dark-skinned cartoon farmer characters
   - A different illustrated background for each character
   - Selectable system voices
   - Voice preview button
   - English and Kenyan-style Kiswahili-English wording
   - Read-aloud toggle
   - Back, Next, Skip and Close controls
   - Highlights relevant website sections when available
   - Natural eye blinking
   - Mouth movement only when speech is playing
   - Can connect to existing Smart Assist avatar containers
   - Does not replace the entire webpage
   - Does not require Supabase or another backend

   NOTE
   Speech options depend on the voices installed in the
   user's browser or operating system.
   ============================================================ */

(() => {
  "use strict";

  if (window.__MAVUNOBRIDGE_COMPACT_GUIDE__) {
    return;
  }

  window.__MAVUNOBRIDGE_COMPACT_GUIDE__ = true;


  /* =========================================================
     1. SETTINGS
     ========================================================= */

  const GUIDE_STORAGE_KEY = "mavunobridge_guide_seen_v6";

  const CHARACTER_STORAGE_KEY = "mavunobridge_guide_character_v6";

  const VOICE_STORAGE_KEY = "mavunobridge_guide_voice_v6";

  const LANGUAGE_STORAGE_KEY = "mavunobridge_guide_language_v6";

  const SPEECH_STORAGE_KEY = "mavunobridge_guide_speech_v6";

  let selectedCharacter = "akinyi";

  let selectedVoiceURI = "";

  let selectedLanguage = "en";

  let readAloudEnabled = true;

  let speechIsActive = false;

  let activeUtterance = null;

  let tourIsOpen = false;

  let currentStep = 0;

  let mouthTimer = null;

  let voiceList = [];

  let avatarCounter = 0;

  let observer = null;

  let observerScheduled = false;

  let lastSpeakingUtterance = null;


  /* =========================================================
     2. CHARACTER INFORMATION
     ========================================================= */

  const CHARACTERS = {
    akinyi: {
      name: "Akinyi",
      role: "Farmer Guide",

      skin: "#70452F",
      skinDark: "#4B2C20",
      skinLight: "#966448",

      hair: "#171313",

      clothing: "#607B43",
      clothingDark: "#3F572E",
      clothingLight: "#8DA763",

      scene: "farm",
      hairstyle: "afro"
    },

    wanjiku: {
      name: "Wanjiku",
      role: "Marketplace Guide",

      skin: "#5D3528",
      skinDark: "#3D211A",
      skinLight: "#89533B",

      hair: "#171313",

      clothing: "#BE8334",
      clothingDark: "#81531E",
      clothingLight: "#E9BC65",

      scene: "market",
      hairstyle: "braids"
    },

    kamau: {
      name: "Kamau",
      role: "Smart Assist Guide",

      skin: "#693E2C",
      skinDark: "#44251C",
      skinLight: "#925C41",

      hair: "#171313",

      clothing: "#347258",
      clothingDark: "#244D3A",
      clothingLight: "#67A17D",

      scene: "smart",
      hairstyle: "twists"
    },

    otieno: {
      name: "Otieno",
      role: "SACCO Guide",

      skin: "#512E23",
      skinDark: "#341D17",
      skinLight: "#794A34",

      hair: "#151313",

      clothing: "#B85F3D",
      clothingDark: "#7D3B27",
      clothingLight: "#DE8A5D",

      scene: "sacco",
      hairstyle: "fade"
    }
  };


  /* =========================================================
     3. STORAGE
     ========================================================= */

  function readStorage(key, fallback = "") {
    try {
      return localStorage.getItem(key) ?? fallback;
    } catch (error) {
      return fallback;
    }
  }

  function saveStorage(key, value) {
    try {
      localStorage.setItem(key, String(value));
    } catch (error) {
      // The guide still works when storage is unavailable.
    }
  }

  function loadPreferences() {
    const savedCharacter = readStorage(
      CHARACTER_STORAGE_KEY,
      "akinyi"
    );

    if (CHARACTERS[savedCharacter]) {
      selectedCharacter = savedCharacter;
    }

    selectedVoiceURI = readStorage(VOICE_STORAGE_KEY, "");

    const savedLanguage = readStorage(
      LANGUAGE_STORAGE_KEY,
      ""
    );

    if (savedLanguage === "en" || savedLanguage === "sw") {
      selectedLanguage = savedLanguage;
    } else {
      const appLanguage = [
        readStorage("mavunobridge_language"),
        readStorage("mavunobridge_language_v1"),
        readStorage("shambamarket_language_v2"),
        readStorage("mb_language"),
        readStorage("preferredLanguage")
      ].join(" ").toLowerCase();

      selectedLanguage =
        appLanguage.includes("swahili") ||
        appLanguage.includes("kiswahili") ||
        appLanguage.includes("sheng") ||
        /(^|\s)sw(\s|$)/.test(appLanguage)
          ? "sw"
          : "en";
    }

    readAloudEnabled =
      readStorage(SPEECH_STORAGE_KEY, "true") !== "false";
  }


  /* =========================================================
     4. ILLUSTRATED BACKGROUNDS
     ========================================================= */

  function createBackground(character, id) {
    if (character.scene === "farm") {
      return `
        <rect width="240" height="270" fill="#F4CF87"/>

        <circle cx="186" cy="48" r="23" fill="#FFF1BD"/>

        <path d="M0 130
                 Q40 92 90 124
                 Q142 83 190 121
                 Q218 102 240 121
                 L240 270 L0 270Z"
              fill="#9DAD67"/>

        <path d="M0 171
                 Q65 135 120 173
                 Q180 135 240 169
                 L240 270 L0 270Z"
              fill="#597A43"/>

        <path d="M0 204 L80 171 L122 270 L0 270Z"
              fill="#B29A4C"/>

        <path d="M240 205 L160 171 L120 270 L240 270Z"
              fill="#8F9545"/>

        <g fill="#3E6339">
          <path d="M14 164 l12 -27 l12 27Z"/>
          <path d="M32 167 l10 -23 l10 23Z"/>
          <path d="M190 155 l12 -27 l12 27Z"/>
          <path d="M209 159 l10 -23 l10 23Z"/>
        </g>

        <g fill="#F4D47A">
          <circle cx="19" cy="218" r="3"/>
          <circle cx="32" cy="232" r="3"/>
          <circle cx="211" cy="220" r="3"/>
          <circle cx="198" cy="238" r="3"/>
        </g>
      `;
    }

    if (character.scene === "market") {
      return `
        <rect width="240" height="270" fill="#F2C28C"/>

        <rect x="14" y="69" width="212" height="110"
              rx="4" fill="#F4E1BE"
              stroke="#60412B" stroke-width="3"/>

        <path d="M8 74 L232 74 L210 37 L30 37Z"
              fill="#46744B"
              stroke="#39271E" stroke-width="3"/>

        <path d="M30 37 L66 37 L58 74 L8 74Z"
              fill="#E4AF4A"/>

        <path d="M66 37 L102 37 L94 74 L58 74Z"
              fill="#C86248"/>

        <path d="M102 37 L138 37 L130 74 L94 74Z"
              fill="#E4AF4A"/>

        <path d="M138 37 L174 37 L166 74 L130 74Z"
              fill="#C86248"/>

        <path d="M174 37 L210 37 L232 74 L166 74Z"
              fill="#E4AF4A"/>

        <g stroke="#6F482B" stroke-width="2">
          <rect x="26" y="91" width="54" height="45"
                fill="#D7BE90"/>
          <rect x="93" y="91" width="54" height="45"
                fill="#D7BE90"/>
          <rect x="160" y="91" width="43" height="45"
                fill="#D7BE90"/>
        </g>

        <g fill="#B95138">
          <circle cx="39" cy="104" r="7"/>
          <circle cx="53" cy="104" r="7"/>
          <circle cx="67" cy="104" r="7"/>
        </g>

        <g fill="#E6B64E">
          <circle cx="106" cy="104" r="7"/>
          <circle cx="120" cy="104" r="7"/>
          <circle cx="134" cy="104" r="7"/>
        </g>

        <g fill="#688C46">
          <circle cx="173" cy="104" r="7"/>
          <circle cx="188" cy="104" r="7"/>
        </g>

        <rect x="0" y="179" width="240" height="91"
              fill="#B68B5A"/>

        <path d="M0 208 Q120 185 240 208"
              stroke="#E0B97D" stroke-width="5"
              fill="none"/>
      `;
    }

    if (character.scene === "smart") {
      return `
        <rect width="240" height="270" fill="#526A86"/>

        <circle cx="189" cy="42" r="30"
                fill="#E7D9FF" opacity=".85"/>

        <g fill="#354B64">
          <rect x="8" y="110" width="39" height="104" rx="3"/>
          <rect x="54" y="83" width="34" height="131" rx="3"/>
          <rect x="153" y="90" width="36" height="124" rx="3"/>
          <rect x="195" y="124" width="34" height="90" rx="3"/>
        </g>

        <g fill="#DDE9F5">
          <rect x="17" y="124" width="7" height="9"/>
          <rect x="30" y="124" width="7" height="9"/>
          <rect x="17" y="142" width="7" height="9"/>
          <rect x="30" y="142" width="7" height="9"/>

          <rect x="62" y="96" width="7" height="9"/>
          <rect x="75" y="96" width="7" height="9"/>
          <rect x="62" y="114" width="7" height="9"/>
          <rect x="75" y="114" width="7" height="9"/>

          <rect x="162" y="104" width="7" height="9"/>
          <rect x="175" y="104" width="7" height="9"/>

          <rect x="204" y="138" width="7" height="9"/>
          <rect x="217" y="138" width="7" height="9"/>
        </g>

        <path d="M0 204
                 Q60 184 120 204
                 Q180 185 240 204
                 L240 270 L0 270Z"
              fill="#4D7962"/>

        <g fill="none" stroke="#EFE4FF" stroke-width="2">
          <circle cx="29" cy="44" r="10"/>
          <path d="M29 34 V54 M19 44 H39"/>

          <circle cx="218" cy="75" r="8"/>
          <path d="M218 67 V83 M210 75 H226"/>
        </g>
      `;
    }

    return `
      <rect width="240" height="270" fill="#9AB6A4"/>

      <circle cx="190" cy="44" r="25"
              fill="#F5DDA2"/>

      <path d="M0 145
               Q65 116 120 144
               Q180 112 240 143
               L240 270 L0 270Z"
              fill="#6F9978"/>

      <path d="M22 87 L120 35 L218 87Z"
              fill="#47724F"
              stroke="#354C39" stroke-width="3"/>

      <rect x="35" y="87" width="170" height="97"
            fill="#F1D6A8"
            stroke="#44392D" stroke-width="3"/>

      <rect x="96" y="124" width="48" height="60"
            fill="#A46C42"
            stroke="#44392D" stroke-width="3"/>

      <rect x="53" y="104" width="31" height="28"
            fill="#B9D9D1"
            stroke="#44392D" stroke-width="3"/>

      <rect x="156" y="104" width="31" height="28"
            fill="#B9D9D1"
            stroke="#44392D" stroke-width="3"/>

      <path d="M68 104 V132 M53 118 H84"
            stroke="#44392D" stroke-width="2"/>

      <path d="M171 104 V132 M156 118 H187"
            stroke="#44392D" stroke-width="2"/>

      <path d="M0 205 Q120 186 240 205
               L240 270 L0 270Z"
            fill="#4D7A54"/>
    `;
  }


  /* =========================================================
     5. CHARACTER HAIR
     ========================================================= */

  function createHairBack(character) {
    if (character.hairstyle === "afro") {
      return `
        <g fill="#171313"
           stroke="#211816"
           stroke-width="3">
          <circle cx="88" cy="79" r="20"/>
          <circle cx="103" cy="57" r="20"/>
          <circle cx="127" cy="48" r="21"/>
          <circle cx="151" cy="54" r="20"/>
          <circle cx="171" cy="73" r="19"/>
          <circle cx="177" cy="94" r="16"/>
          <circle cx="82" cy="101" r="15"/>
        </g>
      `;
    }

    if (character.hairstyle === "braids") {
      return `
        <path d="M78 83
                 Q79 48 120 41
                 Q161 39 176 75
                 L176 155
                 L156 171
                 L148 111
                 L103 111
                 L96 171
                 L78 155Z"
              fill="#171313"
              stroke="#211816" stroke-width="3"/>

        <g fill="none" stroke="#302321" stroke-width="6"
           stroke-linecap="round">
          <path d="M86 67 Q82 111 91 158"/>
          <path d="M98 51 Q96 112 103 163"/>
          <path d="M111 45 Q112 110 115 159"/>
          <path d="M125 43 Q128 106 128 162"/>
          <path d="M139 47 Q144 106 141 159"/>
          <path d="M153 56 Q161 106 154 155"/>
          <path d="M165 70 Q176 111 165 145"/>
        </g>
      `;
    }

    if (character.hairstyle === "twists") {
      return `
        <path d="M80 92
                 Q72 55 111 45
                 Q142 33 164 56
                 Q179 73 174 102
                 L165 131 L91 130Z"
              fill="#171313"
              stroke="#211816" stroke-width="3"/>

        <g fill="#211A18">
          <circle cx="91" cy="62" r="10"/>
          <circle cx="108" cy="49" r="10"/>
          <circle cx="128" cy="45" r="10"/>
          <circle cx="147" cy="52" r="10"/>
          <circle cx="163" cy="68" r="10"/>
        </g>
      `;
    }

    return `
      <path d="M79 89
               Q75 49 116 42
               Q152 36 173 66
               L176 104 L162 124 L91 124Z"
            fill="#171313"
            stroke="#211816" stroke-width="3"/>

      <path d="M84 81
               Q99 53 129 59
               Q151 55 168 79
               L169 91
               Q144 77 125 85
               Q103 79 84 94Z"
            fill="#29201C"/>
    `;
  }


  function createHairFront(character) {
    if (character.hairstyle === "afro") {
      return `
        <path d="M87 93
                 Q90 57 119 54
                 Q148 51 170 77
                 L175 100
                 Q155 85 145 95
                 Q131 106 119 92
                 Q106 104 94 97Z"
              fill="#171313"
              stroke="#211816" stroke-width="3"/>
      `;
    }

    if (character.hairstyle === "braids") {
      return `
        <path d="M87 92
                 Q91 57 119 52
                 Q148 49 169 76
                 L174 98
                 Q155 84 143 94
                 Q132 102 119 93
                 Q103 101 88 98Z"
              fill="#171313"
              stroke="#211816" stroke-width="3"/>

        <g stroke="#553729" stroke-width="2" fill="none">
          <path d="M101 69 Q106 82 102 95"/>
          <path d="M115 60 Q123 80 118 95"/>
          <path d="M131 59 Q139 79 134 96"/>
          <path d="M146 66 Q155 81 151 95"/>
        </g>
      `;
    }

    if (character.hairstyle === "twists") {
      return `
        <path d="M83 93
                 Q87 60 113 52
                 Q143 44 165 70
                 L174 96
                 L156 90 L144 97
                 L131 87 L118 98
                 L104 89 L91 97Z"
              fill="#171313"
              stroke="#211816" stroke-width="3"/>
      `;
    }

    return `
      <path d="M84 93
               Q91 61 117 55
               Q145 48 166 75
               L174 95
               L156 89 L143 97
               L130 88 L116 96
               L101 89 L90 96Z"
            fill="#171313"
            stroke="#211816" stroke-width="3"/>
    `;
  }


  /* =========================================================
     6. COMPLETE STATIC CHARACTER ILLUSTRATION

     All drawing stays still except:
       - open/closed eyes
       - closed/open mouth frames

     The illustration occupies a small panel, not the whole
     browser window.
     ========================================================= */

  function createAvatarSVG(characterKey) {
    const character = CHARACTERS[characterKey] || CHARACTERS.akinyi;

    avatarCounter += 1;

    const avatarId = "mb-character-" + avatarCounter;

    return `
      <svg
        viewBox="0 0 240 270"
        role="img"
        aria-label="${character.name}, ${character.role}"
        xmlns="http://www.w3.org/2000/svg"
        data-mb-avatar-svg="true"
        data-mb-character="${characterKey}"
        preserveAspectRatio="xMidYMid meet"
      >

        <!-- INDIVIDUAL BACKGROUND -->
        ${createBackground(character, avatarId)}

        <!-- CLOTHING -->
        <path d="M35 270
                 L45 214
                 Q49 195 75 187
                 L97 181
                 L143 181
                 L165 187
                 Q191 195 195 214
                 L205 270Z"
              fill="${character.clothing}"
              stroke="#241A17"
              stroke-width="4"
              stroke-linejoin="round"/>

        <path d="M88 187 L106 210 L120 199
                 L134 210 L152 187"
              fill="none"
              stroke="${character.clothingLight}"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"/>

        <!-- NECK -->
        <path d="M101 151 L101 187
                 Q120 201 139 187 L139 151Z"
              fill="${character.skin}"
              stroke="#251A16"
              stroke-width="3"/>

        <!-- HAIR BEHIND HEAD -->
        ${createHairBack(character)}

        <!-- EARS -->
        <path d="M86 107
                 Q73 100 75 119
                 Q78 134 91 130Z"
              fill="${character.skin}"
              stroke="#251A16"
              stroke-width="3"/>

        <path d="M154 107
                 Q167 100 165 119
                 Q162 134 149 130Z"
              fill="${character.skin}"
              stroke="#251A16"
              stroke-width="3"/>

        <!-- FACE -->
        <path d="M87 80
                 Q91 58 120 58
                 Q149 58 153 80
                 L149 130
                 Q143 159 120 166
                 Q97 159 91 130Z"
              fill="${character.skin}"
              stroke="#251A16"
              stroke-width="4"
              stroke-linejoin="round"/>

        <!-- FACE SHADING -->
        <path d="M120 63
                 Q146 65 150 87
                 L145 130
                 Q139 151 124 160
                 Q142 134 137 103
                 Q136 78 120 63Z"
              fill="${character.skinDark}"
              opacity=".28"/>

        <path d="M96 87 Q103 77 113 77"
              stroke="${character.skinLight}"
              stroke-width="3"
              fill="none"
              stroke-linecap="round"/>

        <!-- EYEBROWS -->
        <path d="M95 103 Q106 96 114 103"
              stroke="#211715"
              stroke-width="5"
              fill="none"
              stroke-linecap="round"/>

        <path d="M126 103 Q136 96 145 103"
              stroke="#211715"
              stroke-width="5"
              fill="none"
              stroke-linecap="round"/>

        <!-- OPEN EYES -->
        <g data-mb-eye-open="true">

          <path d="M95 112
                   Q105 102 115 112
                   Q106 124 95 112Z"
                fill="#FFF7E9"
                stroke="#241A17"
                stroke-width="2.5"
                stroke-linejoin="round"/>

          <ellipse cx="105" cy="113"
                   rx="4" ry="6"
                   fill="#271C18"/>

          <circle cx="106.5" cy="110.5"
                  r="1.5" fill="#FFFFFF"/>

          <path d="M125 112
                   Q135 102 145 112
                   Q134 124 125 112Z"
                fill="#FFF7E9"
                stroke="#241A17"
                stroke-width="2.5"
                stroke-linejoin="round"/>

          <ellipse cx="135" cy="113"
                   rx="4" ry="6"
                   fill="#271C18"/>

          <circle cx="136.5" cy="110.5"
                  r="1.5" fill="#FFFFFF"/>

        </g>

        <!-- CLOSED EYES USED FOR BLINKING -->
        <g data-mb-eye-closed="true" style="display:none">

          <path d="M96 113 Q105 118 114 113"
                stroke="#241A17"
                stroke-width="3"
                fill="none"
                stroke-linecap="round"/>

          <path d="M126 113 Q135 118 144 113"
                stroke="#241A17"
                stroke-width="3"
                fill="none"
                stroke-linecap="round"/>

        </g>

        <!-- NOSE -->
        <path d="M120 114
                 L116 130
                 Q120 133 125 130"
              fill="none"
              stroke="${character.skinDark}"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"/>

        <!-- STATIC CHEEK SHADING -->
        <path d="M95 129 Q101 133 107 129"
              fill="none"
              stroke="${character.skinLight}"
              stroke-width="3"
              stroke-linecap="round"
              opacity=".55"/>

        <path d="M133 129 Q139 133 145 129"
              fill="none"
              stroke="${character.skinLight}"
              stroke-width="3"
              stroke-linecap="round"
              opacity=".55"/>

        <!-- CLOSED MOUTH -->
        <g data-mb-mouth-frame="0">

          <path d="M109 142 Q120 148 131 142"
                fill="none"
                stroke="#2C1715"
                stroke-width="3.5"
                stroke-linecap="round"/>

        </g>

        <!-- SPEAKING MOUTH: SMALL OPEN -->
        <g data-mb-mouth-frame="1" style="display:none">

          <path d="M110 141
                   Q120 147 130 141
                   Q127 151 120 151
                   Q113 151 110 141Z"
                fill="#311719"
                stroke="#261714"
                stroke-width="2.5"
                stroke-linejoin="round"/>

          <path d="M115 144 Q120 147 125 144"
                fill="none"
                stroke="#FFF0D9"
                stroke-width="2"
                stroke-linecap="round"/>

        </g>

        <!-- SPEAKING MOUTH: OPEN -->
        <g data-mb-mouth-frame="2" style="display:none">

          <path d="M108 140
                   Q120 147 132 140
                   Q130 154 120 155
                   Q110 154 108 140Z"
                fill="#281315"
                stroke="#261714"
                stroke-width="2.5"
                stroke-linejoin="round"/>

          <path d="M114 145
                   Q120 148 126 145
                   L124 149
                   Q120 151 116 149Z"
                fill="#FFF0D9"/>

        </g>

        <!-- HAIR IN FRONT -->
        ${createHairFront(character)}

        <!-- SIMPLE STATIC CHARACTER DETAIL -->
        ${
          characterKey === "akinyi"
            ? `
              <circle cx="82" cy="131" r="3"
                      fill="#E9C36D"/>
              <circle cx="158" cy="131" r="3"
                      fill="#E9C36D"/>
            `
            : ""
        }

        ${
          characterKey === "wanjiku"
            ? `
              <circle cx="80" cy="145" r="4"
                      fill="#E8B550"
                      stroke="#39271D"
                      stroke-width="1.5"/>
              <circle cx="160" cy="145" r="4"
                      fill="#E8B550"
                      stroke="#39271D"
                      stroke-width="1.5"/>
            `
            : ""
        }

      </svg>
    `;
  }


  /* =========================================================
     7. COMPACT HELPER STYLES

     No backdrop.
     No full-screen modal.
     No avatar-sized page overlay.
     ========================================================= */

  const style = document.createElement("style");

  style.id = "mavunobridge-compact-guide-styles";

  style.textContent = `
    #mb-guide-widget,
    #mb-guide-widget *,
    .mb-guide-mounted-avatar,
    .mb-guide-mounted-avatar * {
      box-sizing: border-box;
    }

    /* BOTTOM-LEFT COMPASS */

    #mb-guide-compass {
      position: fixed;
      left: 16px;
      bottom: 16px;
      z-index: 99980;

      display: flex;
      align-items: center;
      justify-content: center;
      gap: 9px;

      min-height: 48px;
      min-width: 48px;
      padding: 10px 15px;

      border: 2px solid #DDE7D5;
      border-radius: 15px;

      background: #244B30;
      color: #FFFFFF;

      font-family: Arial, Helvetica, sans-serif;
      font-size: 13px;
      font-weight: 800;

      box-shadow: 0 5px 18px rgba(24, 50, 29, .23);

      cursor: pointer;
    }

    #mb-guide-compass:hover {
      background: #193B24;
    }

    #mb-guide-compass:focus-visible {
      outline: 3px solid #D0A54E;
      outline-offset: 3px;
    }

    #mb-guide-compass svg {
      width: 23px;
      height: 23px;
      flex: 0 0 23px;
    }

    /* COMPACT PANEL */

    #mb-guide-widget {
      position: fixed;
      z-index: 99979;

      left: 16px;
      bottom: 76px;

      width: min(370px, calc(100vw - 32px));

      max-height: min(610px, calc(100dvh - 105px));

      display: none;
      flex-direction: column;

      overflow: hidden;

      border: 1px solid #DCE5D6;
      border-radius: 16px;

      background: #FFFFFF;
      color: #24382A;

      box-shadow: 0 12px 38px rgba(20, 35, 23, .25);

      font-family: Arial, Helvetica, sans-serif;
    }

    #mb-guide-widget.mb-guide-open {
      display: flex;
    }

    .mb-guide-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;

      flex: 0 0 auto;

      padding: 12px 14px;

      border-bottom: 1px solid #E6EBE1;
      background: #F9FBF7;
    }

    .mb-guide-brand {
      display: flex;
      align-items: center;
      gap: 9px;

      min-width: 0;

      color: #244B30;
      font-size: 13px;
      font-weight: 800;
    }

    .mb-guide-brand-mark {
      display: grid;
      place-items: center;

      width: 30px;
      height: 30px;
      flex: 0 0 30px;

      border-radius: 9px;
      background: #E6EFDD;

      font-size: 17px;
    }

    .mb-guide-header-actions {
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .mb-guide-icon-button {
      display: grid;
      place-items: center;

      width: 32px;
      height: 32px;
      flex: 0 0 32px;

      border: 0;
      border-radius: 8px;

      background: #EDF2E8;
      color: #304733;

      font-size: 18px;

      cursor: pointer;
    }

    .mb-guide-icon-button:hover {
      background: #DFE8D8;
    }

    .mb-guide-scroll {
      min-height: 0;
      flex: 1 1 auto;
      overflow-y: auto;
      overscroll-behavior: contain;
    }

    /* COMPACT CHARACTER AREA */

    .mb-guide-character-row {
      display: grid;
      grid-template-columns: 110px minmax(0, 1fr);
      align-items: center;
      gap: 13px;

      padding: 13px 14px 10px;
    }

    .mb-guide-avatar-stage {
      width: 110px;
      height: 125px;

      overflow: hidden;

      border: 1px solid #DADFD2;
      border-radius: 12px;

      background: #EFE8D5;
    }

    .mb-guide-avatar-stage svg {
      display: block;
      width: 100%;
      height: 100%;
    }

    .mb-guide-character-text {
      min-width: 0;
    }

    .mb-guide-character-name {
      margin: 0 0 5px;

      color: #263B2B;
      font-size: 17px;
      font-weight: 800;
    }

    .mb-guide-character-role {
      margin: 0 0 9px;

      color: #677666;
      font-size: 11px;
      line-height: 1.5;
    }

    .mb-guide-label {
      display: block;

      margin-bottom: 5px;

      color: #4C5C4D;
      font-size: 11px;
      font-weight: 800;
    }

    .mb-guide-select {
      display: block;
      width: 100%;
      min-width: 0;
      min-height: 34px;

      border: 1px solid #D5DFD0;
      border-radius: 8px;

      padding: 6px 8px;

      background: #FFFFFF;
      color: #293D2C;

      font-family: Arial, Helvetica, sans-serif;
      font-size: 12px;
    }

    .mb-guide-select:focus-visible {
      outline: 2px solid #73985E;
      outline-offset: 2px;
    }

    /* GUIDE TEXT */

    .mb-guide-copy {
      padding: 0 14px 13px;
    }

    .mb-guide-eyebrow {
      margin: 4px 0 6px;

      color: #68854F;
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 1.2px;
      text-transform: uppercase;
    }

    .mb-guide-title {
      margin: 0 0 8px;

      color: #233C2A;
      font-size: 21px;
      line-height: 1.2;
      font-weight: 850;

      overflow-wrap: anywhere;
    }

    .mb-guide-description {
      margin: 0;

      color: #526153;
      font-size: 13px;
      line-height: 1.65;

      overflow-wrap: anywhere;
    }

    .mb-guide-tip {
      margin-top: 12px;
      padding: 10px 11px;

      border-left: 3px solid #79945B;
      border-radius: 0 8px 8px 0;

      background: #F2F6ED;
      color: #455B43;

      font-size: 11px;
      line-height: 1.55;
    }

    /* VOICE SETTINGS */

    .mb-guide-settings {
      display: grid;
      grid-template-columns: minmax(0, .8fr) minmax(0, 1.2fr);
      gap: 10px;

      padding: 11px 14px 12px;

      border-top: 1px solid #E6EBE1;
      background: #FBFCF9;
    }

    .mb-guide-setting {
      min-width: 0;
    }

    .mb-guide-voice-row {
      display: flex;
      align-items: center;
      gap: 8px;

      padding: 0 14px 12px;

      background: #FBFCF9;
    }

    .mb-guide-read-toggle {
      display: flex;
      align-items: center;
      gap: 7px;

      color: #4F604F;
      font-size: 11px;
      font-weight: 700;
    }

    .mb-guide-read-toggle input {
      accent-color: #315C38;
    }

    .mb-guide-preview {
      min-height: 32px;

      border: 1px solid #D4DFCF;
      border-radius: 8px;

      padding: 6px 10px;

      background: #FFFFFF;
      color: #2B4B31;

      font-size: 11px;
      font-weight: 800;

      cursor: pointer;
    }

    .mb-guide-preview:hover {
      background: #EDF4E7;
    }

    .mb-guide-voice-status {
      padding: 0 14px 10px;

      background: #FBFCF9;
      color: #778275;

      font-size: 10px;
      line-height: 1.4;
    }

    /* PROGRESS */

    .mb-guide-progress {
      padding: 0 14px 11px;
      background: #FBFCF9;
    }

    .mb-guide-progress-label {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;

      margin-bottom: 6px;

      color: #697668;
      font-size: 10px;
      font-weight: 800;
    }

    .mb-guide-progress-track {
      height: 5px;
      overflow: hidden;

      border-radius: 99px;
      background: #E4EADF;
    }

    .mb-guide-progress-value {
      width: 0;
      height: 100%;

      border-radius: 99px;
      background: #648749;
    }

    /* BUTTONS */

    .mb-guide-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;

      padding: 10px 12px;

      border-top: 1px solid #E2E9DD;
      background: #FFFFFF;
    }

    .mb-guide-footer-left,
    .mb-guide-footer-right {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .mb-guide-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;

      min-height: 35px;
      min-width: 0;

      border: 1px solid #D9E1D4;
      border-radius: 8px;

      padding: 8px 10px;

      background: #FFFFFF;
      color: #304832;

      font-family: Arial, Helvetica, sans-serif;
      font-size: 11px;
      font-weight: 800;

      white-space: nowrap;

      cursor: pointer;
    }

    .mb-guide-button:hover {
      background: #F0F4EC;
    }

    .mb-guide-button:disabled {
      opacity: .4;
      cursor: not-allowed;
    }

    .mb-guide-primary {
      border-color: #244B30;
      background: #244B30;
      color: #FFFFFF;
    }

    .mb-guide-primary:hover {
      background: #193B24;
    }

    .mb-guide-skip {
      border: 0;
      background: transparent;
      color: #637264;
      font-size: 10px;
      font-weight: 800;
      cursor: pointer;
    }

    .mb-guide-skip:hover {
      color: #244B30;
    }

    /* OTHER PAGE AVATAR CONTAINERS */

    .mb-guide-mounted-avatar {
      width: min(155px, 100%);
      max-width: 100%;
      aspect-ratio: 240 / 270;
      overflow: hidden;
    }

    .mb-guide-mounted-avatar svg {
      display: block;
      width: 100%;
      height: 100%;
    }

    /* MOBILE */

    @media (max-width: 430px) {
      #mb-guide-compass {
        left: 12px;
        bottom: 12px;
      }

      #mb-guide-widget {
        left: 12px;
        bottom: 70px;

        width: calc(100vw - 24px);
        max-height: calc(100dvh - 86px);
      }

      .mb-guide-character-row {
        grid-template-columns: 94px minmax(0, 1fr);
        gap: 10px;
      }

      .mb-guide-avatar-stage {
        width: 94px;
        height: 108px;
      }

      .mb-guide-title {
        font-size: 19px;
      }

      .mb-guide-description {
        font-size: 12px;
      }

      .mb-guide-footer {
        padding: 9px;
      }

      .mb-guide-button {
        padding: 7px 8px;
      }
    }

    @media (max-width: 330px) {
      .mb-guide-character-row {
        grid-template-columns: 80px minmax(0, 1fr);
      }

      .mb-guide-avatar-stage {
        width: 80px;
        height: 94px;
      }

      .mb-guide-character-name {
        font-size: 15px;
      }

      .mb-guide-settings {
        grid-template-columns: minmax(0, 1fr);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      #mb-guide-widget,
      #mb-guide-compass {
        scroll-behavior: auto;
      }
    }
  `;

  document.head.appendChild(style);


  /* =========================================================
     8. COMPASS BUTTON AND GUIDE PANEL
     ========================================================= */

  const compass = document.createElement("button");

  compass.id = "mb-guide-compass";
  compass.type = "button";

  compass.setAttribute(
    "aria-label",
    "Open MavunoBridge website guide"
  );

  compass.setAttribute(
    "aria-controls",
    "mb-guide-widget"
  );

  compass.setAttribute(
    "aria-expanded",
    "false"
  );

  compass.innerHTML = `
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9.2"
              stroke="currentColor" stroke-width="1.8"/>

      <path d="M15.7 7.7 L13.5 13.5 L7.7 15.7 L10 10Z"
            fill="#F3CB72"
            stroke="currentColor"
            stroke-width="1.2"
            stroke-linejoin="round"/>

      <circle cx="12" cy="12" r="1.3"
              fill="currentColor"/>
    </svg>

    <span>Guide</span>
  `;


  const widget = document.createElement("section");

  widget.id = "mb-guide-widget";

  widget.setAttribute(
    "aria-label",
    "MavunoBridge website guide"
  );

  widget.innerHTML = `
    <header class="mb-guide-header">

      <div class="mb-guide-brand">

        <span class="mb-guide-brand-mark" aria-hidden="true">
          🌱
        </span>

        <span>MavunoBridge Guide</span>

      </div>

      <div class="mb-guide-header-actions">

        <button
          type="button"
          class="mb-guide-icon-button"
          id="mb-guide-stop-speech"
          aria-label="Stop speaking"
          title="Stop speaking"
        >
          ■
        </button>

        <button
          type="button"
          class="mb-guide-icon-button"
          id="mb-guide-close"
          aria-label="Close guide"
          title="Close guide"
        >
          ×
        </button>

      </div>

    </header>

    <div class="mb-guide-scroll">

      <div class="mb-guide-character-row">

        <div
          class="mb-guide-avatar-stage"
          id="mb-guide-avatar-stage"
        ></div>

        <div class="mb-guide-character-text">

          <p
            class="mb-guide-character-name"
            id="mb-guide-character-name"
          >
            Akinyi
          </p>

          <p
            class="mb-guide-character-role"
            id="mb-guide-character-role"
          >
            Farmer Guide
          </p>

          <label
            class="mb-guide-label"
            for="mb-guide-character-select"
          >
            Choose your guide
          </label>

          <select
            class="mb-guide-select"
            id="mb-guide-character-select"
          >
            <option value="akinyi">Akinyi</option>
            <option value="wanjiku">Wanjiku</option>
            <option value="kamau">Kamau</option>
            <option value="otieno">Otieno</option>
          </select>

        </div>

      </div>

      <div class="mb-guide-copy">

        <p
          class="mb-guide-eyebrow"
          id="mb-guide-eyebrow"
        >
          YOUR WEBSITE TOUR
        </p>

        <h2
          class="mb-guide-title"
          id="mb-guide-title"
        >
          Karibu to MavunoBridge!
        </h2>

        <p
          class="mb-guide-description"
          id="mb-guide-description"
        >
          Explore the website with your own guide.
        </p>

        <div
          class="mb-guide-tip"
          id="mb-guide-tip"
        >
          Choose Next to start exploring.
        </div>

      </div>

      <div class="mb-guide-settings">

        <div class="mb-guide-setting">

          <label
            class="mb-guide-label"
            for="mb-guide-language"
          >
            Language
          </label>

          <select
            class="mb-guide-select"
            id="mb-guide-language"
          >
            <option value="en">English</option>
            <option value="sw">Kiswahili + English</option>
          </select>

        </div>

        <div class="mb-guide-setting">

          <label
            class="mb-guide-label"
            for="mb-guide-voice"
          >
            Select voice
          </label>

          <select
            class="mb-guide-select"
            id="mb-guide-voice"
          >
            <option value="">System default voice</option>
          </select>

        </div>

      </div>

      <div class="mb-guide-voice-row">

        <label class="mb-guide-read-toggle">
          <input
            type="checkbox"
            id="mb-guide-read-aloud"
            checked
          />

          <span>Read steps aloud</span>
        </label>

        <button
          type="button"
          class="mb-guide-preview"
          id="mb-guide-test-voice"
        >
          Test voice
        </button>

      </div>

      <div
        class="mb-guide-voice-status"
        id="mb-guide-voice-status"
        aria-live="polite"
      >
        Choose a voice and press Test voice.
      </div>

      <div class="mb-guide-progress">

        <div class="mb-guide-progress-label">

          <span id="mb-guide-step-count">
            Ready to begin
          </span>

          <span id="mb-guide-progress-percent">
            0%
          </span>

        </div>

        <div
          class="mb-guide-progress-track"
          role="progressbar"
          aria-label="Tour progress"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow="0"
          id="mb-guide-progress-track"
        >
          <div
            class="mb-guide-progress-value"
            id="mb-guide-progress-value"
          ></div>
        </div>

      </div>

    </div>

    <footer class="mb-guide-footer">

      <div class="mb-guide-footer-left">

        <button
          type="button"
          class="mb-guide-skip"
          id="mb-guide-skip"
        >
          Skip tour
        </button>

      </div>

      <div class="mb-guide-footer-right">

        <button
          type="button"
          class="mb-guide-button"
          id="mb-guide-back"
          disabled
        >
          Back
        </button>

        <button
          type="button"
          class="mb-guide-button mb-guide-primary"
          id="mb-guide-next"
        >
          Start tour
        </button>

      </div>

    </footer>
  `;


  document.body.appendChild(compass);
  document.body.appendChild(widget);


  /* =========================================================
     9. ELEMENT REFERENCES
     ========================================================= */

  const ui = {
    compass,

    widget,

    avatarStage:
      widget.querySelector("#mb-guide-avatar-stage"),

    characterName:
      widget.querySelector("#mb-guide-character-name"),

    characterRole:
      widget.querySelector("#mb-guide-character-role"),

    characterSelect:
      widget.querySelector("#mb-guide-character-select"),

    language:
      widget.querySelector("#mb-guide-language"),

    voice:
      widget.querySelector("#mb-guide-voice"),

    readAloud:
      widget.querySelector("#mb-guide-read-aloud"),

    testVoice:
      widget.querySelector("#mb-guide-test-voice"),

    voiceStatus:
      widget.querySelector("#mb-guide-voice-status"),

    stopSpeech:
      widget.querySelector("#mb-guide-stop-speech"),

    close:
      widget.querySelector("#mb-guide-close"),

    eyebrow:
      widget.querySelector("#mb-guide-eyebrow"),

    title:
      widget.querySelector("#mb-guide-title"),

    description:
      widget.querySelector("#mb-guide-description"),

    tip:
      widget.querySelector("#mb-guide-tip"),

    count:
      widget.querySelector("#mb-guide-step-count"),

    percent:
      widget.querySelector("#mb-guide-progress-percent"),

    progressTrack:
      widget.querySelector("#mb-guide-progress-track"),

    progressValue:
      widget.querySelector("#mb-guide-progress-value"),

    skip:
      widget.querySelector("#mb-guide-skip"),

    back:
      widget.querySelector("#mb-guide-back"),

    next:
      widget.querySelector("#mb-guide-next")
  };


  /* =========================================================
     10. TOUR STEPS
     ========================================================= */

  const STEPS = [
    {
      targets: [
        "#marketplace",
        "#marketplaceSection",
        "[data-marketplace]",
        "main"
      ],

      en: {
        title: "Karibu to MavunoBridge!",
        body:
          "This is your connection between farmers and buyers. " +
          "Explore agricultural products, compare offers and " +
          "discover useful farming services.",

        tip:
          "Use the Next button to explore the website step by step."
      },

      sw: {
        title: "Karibu MavunoBridge!",
        body:
          "Hapa farmers na buyers wana-connect. Explore products, " +
          "compare bei na discover farming services zinazokufaa.",

        tip:
          "Bonyeza Next kuendelea na tour. Unaweza ku-skip anytime."
      }
    },

    {
      targets: [
        "#searchInput",
        "#marketSearch",
        "#search",
        "input[type='search']",
        "[data-marketplace-search]",
        ".search-bar input"
      ],

      en: {
        title: "Search for products",
        body:
          "Use the search bar to find produce, farm supplies, " +
          "tools and other available agricultural products.",

        tip:
          "Try searching for tomatoes, maize, beans or avocados."
      },

      sw: {
        title: "Search bidhaa unahitaji",
        body:
          "Tumia search bar kutafuta produce, farm supplies, tools " +
          "na agricultural products zingine.",

        tip:
          "Try ku-search tomatoes, maize, beans ama avocados."
      }
    },

    {
      targets: [
        "#categories",
        "#categoryGrid",
        ".category-grid",
        "[data-category-grid]",
        "#categoriesSection",
        ".categories"
      ],

      en: {
        title: "Explore the categories",
        body:
          "Browse fruits, vegetables, grains, cereals, legumes, " +
          "livestock, farm equipment and agricultural services.",

        tip:
          "Choose a category to narrow down the products you see."
      },

      sw: {
        title: "Explore categories",
        body:
          "Browse fruits, vegetables, grains, cereals, legumes, " +
          "livestock, farm equipment na agricultural services.",

        tip:
          "Chagua category kupata products unatafuta faster."
      }
    },

    {
      targets: [
        "#listingGrid",
        "#productGrid",
        ".listing-grid",
        ".product-grid",
        "[data-listing-grid]",
        "#marketplaceListings"
      ],

      en: {
        title: "Compare listings",
        body:
          "Check product details, quantities, prices and seller " +
          "locations before making a choice.",

        tip:
          "Read the complete listing and check seller information."
      },

      sw: {
        title: "Compare listings",
        body:
          "Angalia product details, quantities, prices na seller " +
          "locations kabla ya kuchagua bidhaa.",

        tip:
          "Soma details zote za listing kwanza."
      }
    },

    {
      targets: [
        "#sellButton",
        "#heroSellButton",
        "[data-open-sell]",
        "[data-action='sell']",
        ".sell-button"
      ],

      en: {
        title: "List your own products",
        body:
          "Farmers can use the selling feature to show their " +
          "produce to potential buyers. Enter accurate product " +
          "details and quantities.",

        tip:
          "Clear descriptions and accurate information help buyers."
      },

      sw: {
        title: "Sell your products",
        body:
          "Farmers wanaweza kuweka listings za produce yao ili " +
          "buyers waone wanachouza. Weka details na quantities " +
          "zilizo accurate.",

        tip:
          "Product descriptions nzuri zinasaidia buyers kuelewa."
      }
    },

    {
      targets: [
        "#smartAssist",
        "#smartAssistButton",
        "#smart-assist",
        "#smart-assist-nav",
        "[data-nav='smart-assist']",
        "a[href*='smart-assist']",
        "a[href*='smart_assist']"
      ],

      en: {
        title: "Meet Smart Assist",
        body:
          "Smart Assist is designed to offer farming guidance, " +
          "crop ideas and other useful agricultural information. " +
          "Open its page to explore the available features.",

        tip:
          "Advice depends on the features and information available."
      },

      sw: {
        title: "Meet Smart Assist",
        body:
          "Smart Assist imeundwa kusaidia farmers kupata farming " +
          "guidance, crop ideas na information useful kwa shamba.",

        tip:
          "Fungua Smart Assist page kuangalia features zilizopo."
      }
    },

    {
      targets: [
        "#sacco",
        "#saccoHub",
        "#saccoButton",
        "#sacco-hub",
        "[data-nav='sacco']",
        "a[href*='sacco']"
      ],

      en: {
        title: "Explore the SACCO Hub",
        body:
          "Visit the SACCO Hub to explore the information and " +
          "opportunities made available through the website.",

        tip:
          "Check each organisation's requirements and eligibility."
      },

      sw: {
        title: "Explore SACCO Hub",
        body:
          "Tembelea SACCO Hub ku-explore information na " +
          "opportunities zinazopatikana kwenye website.",

        tip:
          "Confirm requirements na eligibility kabla ya kujiunga."
      }
    }
  ];


  /* =========================================================
     11. AVATAR RENDERING
     ========================================================= */

  function renderSelectedCharacter() {
    const character =
      CHARACTERS[selectedCharacter] || CHARACTERS.akinyi;

    ui.avatarStage.innerHTML =
      createAvatarSVG(selectedCharacter);

    ui.characterName.textContent = character.name;

    ui.characterRole.textContent = character.role;

    ui.characterSelect.value = selectedCharacter;

    initializeAllAvatars();
  }


  /* =========================================================
     12. NATURAL BLINKING
     ========================================================= */

  function getAvatarSVGs() {
    return Array.from(
      document.querySelectorAll("svg[data-mb-avatar-svg]")
    );
  }


  function setEyeState(svg, eyesOpen) {
    const openGroup =
      svg.querySelector("[data-mb-eye-open]");

    const closedGroup =
      svg.querySelector("[data-mb-eye-closed]");

    if (openGroup) {
      openGroup.style.display = eyesOpen ? "" : "none";
    }

    if (closedGroup) {
      closedGroup.style.display = eyesOpen ? "none" : "";
    }
  }


  function initializeBlinking(svg) {
    if (svg.dataset.mbBlinkStarted === "true") {
      return;
    }

    svg.dataset.mbBlinkStarted = "true";

    setEyeState(svg, true);

    function scheduleNextBlink() {
      if (!svg.isConnected) return;

      // A relaxed interval between blinks.
      const delay = 2500 + Math.random() * 3300;

      svg._mbBlinkTimer = setTimeout(() => {
        if (!svg.isConnected) return;

        setEyeState(svg, false);

        const blinkDuration = 85 + Math.random() * 50;

        svg._mbBlinkCloseTimer = setTimeout(() => {
          if (!svg.isConnected) return;

          setEyeState(svg, true);

          scheduleNextBlink();
        }, blinkDuration);

      }, delay);
    }

    scheduleNextBlink();
  }


  function initializeAllAvatars() {
    getAvatarSVGs().forEach(initializeBlinking);
  }


  /* =========================================================
     13. TALKING MOUTH

     This is the only mouth animation.

     The mouth stays closed when the speech ends.
     ========================================================= */

  function setMouthFrame(svg, frame) {
    svg.querySelectorAll("[data-mb-mouth-frame]")
      .forEach((mouth) => {
        const mouthFrame = Number(
          mouth.getAttribute("data-mb-mouth-frame")
        );

        mouth.style.display =
          mouthFrame === frame ? "" : "none";
      });
  }


  function setAllMouthFrames(frame) {
    getAvatarSVGs().forEach((svg) => {
      setMouthFrame(svg, frame);
    });
  }


  function startMouthAnimation() {
    if (speechIsActive) return;

    speechIsActive = true;

    if (mouthTimer) {
      clearInterval(mouthTimer);
    }

    let index = 0;

    const sequence = [1, 2, 1, 0, 2, 1];

    setAllMouthFrames(1);

    mouthTimer = setInterval(() => {
      if (!speechIsActive) return;

      setAllMouthFrames(sequence[index]);

      index = (index + 1) % sequence.length;

    }, 125);
  }


  function stopMouthAnimation() {
    speechIsActive = false;

    if (mouthTimer) {
      clearInterval(mouthTimer);
      mouthTimer = null;
    }

    setAllMouthFrames(0);
  }


  /* =========================================================
     14. SELECTABLE VOICES

     Uses voices available in the browser or operating system.
     ========================================================= */

  function getSelectedVoice() {
    if (!selectedVoiceURI) return null;

    return voiceList.find(
      (voice) => voice.voiceURI === selectedVoiceURI
    ) || null;
  }


  function populateVoiceSelector() {
    if (!("speechSynthesis" in window)) {
      ui.voice.innerHTML =
        '<option value="">Speech is not supported here</option>';

      ui.voiceStatus.textContent =
        "Your browser does not support speech synthesis.";

      ui.testVoice.disabled = true;

      return;
    }

    voiceList = window.speechSynthesis.getVoices() || [];

    const previousVoice = selectedVoiceURI;

    ui.voice.innerHTML = "";

    const defaultOption = document.createElement("option");

    defaultOption.value = "";
    defaultOption.textContent = "System default voice";

    ui.voice.appendChild(defaultOption);

    voiceList.forEach((voice) => {
      const option = document.createElement("option");

      option.value = voice.voiceURI;

      const languageLabel = voice.lang
        ? " (" + voice.lang + ")"
        : "";

      option.textContent = voice.name + languageLabel;

      ui.voice.appendChild(option);
    });

    const voiceStillExists = voiceList.some(
      (voice) => voice.voiceURI === previousVoice
    );

    if (voiceStillExists) {
      ui.voice.value = previousVoice;
    } else {
      selectedVoiceURI = "";
      ui.voice.value = "";

      saveStorage(VOICE_STORAGE_KEY, "");
    }

    if (voiceList.length === 0) {
      ui.voiceStatus.textContent =
        "The browser has not loaded its voices yet. Try again shortly.";
    } else {
      ui.voiceStatus.textContent =
        voiceList.length +
        " voices available. Choose one, then press Test voice.";
    }
  }


  /* =========================================================
     15. GLOBAL SPEECH CONNECTION

     Existing browser-speech assistant scripts can trigger
     mouth movement too. This wraps the browser method without
     replacing the other assistant's voice callbacks.

     The chosen voice is applied to speech utterances when
     the selected voice is available.
     ========================================================= */

  function connectSpeechToWebsite() {
    if (!("speechSynthesis" in window)) return;

    const synthesis = window.speechSynthesis;

    if (synthesis.__mbGuideSpeechConnected) return;

    try {
      const nativeSpeak = synthesis.speak;

      if (typeof nativeSpeak !== "function") return;

      synthesis.speak = function (utterance) {
        if (
          utterance &&
          typeof utterance === "object"
        ) {
          const chosenVoice = getSelectedVoice();

          if (chosenVoice) {
            try {
              utterance.voice = chosenVoice;
            } catch (error) {
              // Some browser implementations may reject the assignment.
            }
          }

          try {
            utterance.addEventListener("start", () => {
              lastSpeakingUtterance = utterance;
              startMouthAnimation();
            });

            const endHandler = () => {
              if (lastSpeakingUtterance === utterance) {
                lastSpeakingUtterance = null;
                stopMouthAnimation();
              }
            };

            utterance.addEventListener("end", endHandler);
            utterance.addEventListener("error", endHandler);

          } catch (error) {
            // Tour speech has its own start and stop callbacks.
          }
        }

        return nativeSpeak.call(this, utterance);
      };

      const nativeCancel = synthesis.cancel;

      synthesis.cancel = function (...args) {
        const result = nativeCancel.apply(this, args);

        lastSpeakingUtterance = null;
        stopMouthAnimation();

        return result;
      };

      synthesis.__mbGuideSpeechConnected = true;

    } catch (error) {
      // Keep the tour usable if modifying these browser methods fails.
    }
  }


  /* =========================================================
     16. SPEAK A SENTENCE

     Selected voice and language are used for the guide.
     ========================================================= */

  function stopSpeech() {
    if ("speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (error) {
        // Ignore unsupported cancellation.
      }
    }

    activeUtterance = null;

    lastSpeakingUtterance = null;

    stopMouthAnimation();
  }


  function speak(text) {
    if (!readAloudEnabled) return;

    if (!("speechSynthesis" in window)) {
      ui.voiceStatus.textContent =
        "Your browser cannot play the guide's spoken voice.";

      return;
    }

    if (!text || !text.trim()) return;

    stopSpeech();

    try {
      const utterance = new SpeechSynthesisUtterance(text);

      const voice = getSelectedVoice();

      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang || "en-KE";
      } else {
        utterance.lang =
          selectedLanguage === "sw" ? "sw-KE" : "en-KE";
      }

      utterance.rate = 0.94;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => {
        activeUtterance = utterance;
        startMouthAnimation();

        ui.voiceStatus.textContent =
          "The guide is speaking.";
      };

      utterance.onend = () => {
        if (activeUtterance === utterance) {
          activeUtterance = null;
          stopMouthAnimation();

          ui.voiceStatus.textContent =
            "Finished speaking.";
        }
      };

      utterance.onerror = (event) => {
        if (activeUtterance === utterance) {
          activeUtterance = null;
          stopMouthAnimation();

          if (event.error !== "canceled") {
            ui.voiceStatus.textContent =
              "Speech did not play. Try selecting another voice.";
          }
        }
      };

      activeUtterance = utterance;

      window.speechSynthesis.speak(utterance);

    } catch (error) {
      stopMouthAnimation();

      ui.voiceStatus.textContent =
        "Unable to start speech in this browser.";
    }
  }


  /* =========================================================
     17. PAGE TARGET HIGHLIGHTING

     The website is never covered by a full-screen layer.
     The current section receives a temporary outline.
     ========================================================= */

  let highlightedElement = null;

  function clearHighlight() {
    if (!highlightedElement) return;

    highlightedElement.classList.remove("mb-guide-highlighted");

    highlightedElement.style.removeProperty("outline");
    highlightedElement.style.removeProperty("outline-offset");
    highlightedElement.style.removeProperty("border-radius");

    highlightedElement = null;
  }


  function locateStepTarget(step) {
    if (!step || !Array.isArray(step.targets)) {
      return null;
    }

    for (const selector of step.targets) {
      try {
        const element = document.querySelector(selector);

        if (
          element &&
          element !== widget &&
          !widget.contains(element) &&
          element !== compass
        ) {
          return element;
        }
      } catch (error) {
        // Ignore invalid selectors.
      }
    }

    return null;
  }


  function highlightStepTarget(step) {
    clearHighlight();

    const target = locateStepTarget(step);

    if (!target) {
      return;
    }

    highlightedElement = target;

    target.classList.add("mb-guide-highlighted");

    target.style.setProperty(
      "outline",
      "3px solid #D7AA4D",
      "important"
    );

    target.style.setProperty(
      "outline-offset",
      "3px",
      "important"
    );

    target.style.setProperty(
      "border-radius",
      "6px",
      "important"
    );

    try {
      target.scrollIntoView({
        behavior: "auto",
        block: "nearest",
        inline: "nearest"
      });
    } catch (error) {
      // Continue with the written instructions if scrolling fails.
    }
  }


  /* =========================================================
     18. STEP RENDERING
     ========================================================= */

  function getCurrentWording(step) {
    return selectedLanguage === "sw"
      ? step.sw
      : step.en;
  }


  function renderStep(index, shouldSpeak = true) {
    if (index < 0 || index >= STEPS.length) return;

    currentStep = index;

    const step = STEPS[currentStep];

    const wording = getCurrentWording(step);

    stopSpeech();

    ui.title.textContent = wording.title;

    ui.description.textContent = wording.body;

    ui.tip.textContent = wording.tip;

    ui.eyebrow.textContent =
      selectedLanguage === "sw"
        ? "TOUR YA WEBSITE"
        : "YOUR WEBSITE TOUR";

    const stepNumber = currentStep + 1;

    const percentage = Math.round(
      (stepNumber / STEPS.length) * 100
    );

    ui.count.textContent =
      "Step " + stepNumber + " of " + STEPS.length;

    ui.percent.textContent =
      percentage + "%";

    ui.progressValue.style.width =
      percentage + "%";

    ui.progressTrack.setAttribute(
      "aria-valuenow",
      String(percentage)
    );

    ui.back.disabled = currentStep === 0;

    ui.next.textContent =
      currentStep === STEPS.length - 1
        ? "Finish"
        : "Next";

    highlightStepTarget(step);

    if (shouldSpeak && readAloudEnabled) {
      speak(wording.title + ". " + wording.body);
    }
  }


  /* =========================================================
     19. OPEN AND CLOSE THE COMPACT HELPER
     ========================================================= */

  function openGuide() {
    if (tourIsOpen) return;

    tourIsOpen = true;

    widget.classList.add("mb-guide-open");

    compass.setAttribute("aria-expanded", "true");

    if (currentStep < 0 || currentStep >= STEPS.length) {
      currentStep = 0;
    }

    renderStep(currentStep, false);

    ui.next.focus({
      preventScroll: true
    });
  }


  function closeGuide() {
    tourIsOpen = false;

    widget.classList.remove("mb-guide-open");

    compass.setAttribute("aria-expanded", "false");

    stopSpeech();

    clearHighlight();

    saveStorage(GUIDE_STORAGE_KEY, "yes");
  }


  function toggleGuide() {
    if (tourIsOpen) {
      closeGuide();
    } else {
      openGuide();
    }
  }


  function nextStep() {
    if (currentStep < STEPS.length - 1) {
      renderStep(currentStep + 1, true);
      return;
    }

    ui.title.textContent =
      selectedLanguage === "sw"
        ? "Uko ready kuendelea!"
        : "You're ready to explore!";

    ui.description.textContent =
      selectedLanguage === "sw"
        ? "Unaweza kutumia compass hapa chini kufungua guide tena anytime."
        : "Use the compass button whenever you need the guide again.";

    ui.tip.textContent =
      selectedLanguage === "sw"
        ? "Asante kwa kutumia MavunoBridge."
        : "Thanks for exploring MavunoBridge.";

    ui.count.textContent = "Tour completed";

    ui.percent.textContent = "100%";

    ui.progressValue.style.width = "100%";

    ui.progressTrack.setAttribute("aria-valuenow", "100");

    ui.next.textContent = "Close";

    ui.back.disabled = false;

    stopSpeech();

    clearHighlight();

    saveStorage(GUIDE_STORAGE_KEY, "yes");

    // Mark completion so the next click on Back opens the final real step.
    currentStep = STEPS.length;
  }


  function previousStep() {
    if (currentStep >= STEPS.length) {
      currentStep = STEPS.length - 1;
      renderStep(currentStep, true);
      return;
    }

    if (currentStep > 0) {
      renderStep(currentStep - 1, true);
    }
  }


  /* =========================================================
     20. CHARACTER SELECTOR
     ========================================================= */

  ui.characterSelect.addEventListener("change", () => {
    const requestedCharacter = ui.characterSelect.value;

    if (!CHARACTERS[requestedCharacter]) return;

    selectedCharacter = requestedCharacter;

    saveStorage(
      CHARACTER_STORAGE_KEY,
      selectedCharacter
    );

    stopSpeech();

    renderSelectedCharacter();

    if (tourIsOpen && readAloudEnabled) {
      const wording = getCurrentWording(STEPS[currentStep]);

      if (wording) {
        speak(
          wording.title + ". " + wording.body
        );
      }
    }
  });


  /* =========================================================
     21. VOICE SELECTOR
     ========================================================= */

  ui.voice.addEventListener("change", () => {
    selectedVoiceURI = ui.voice.value;

    saveStorage(
      VOICE_STORAGE_KEY,
      selectedVoiceURI
    );

    stopSpeech();

    if (selectedVoiceURI) {
      const chosenVoice = getSelectedVoice();

      ui.voiceStatus.textContent = chosenVoice
        ? "Selected: " + chosenVoice.name +
          (chosenVoice.lang ? " (" + chosenVoice.lang + ")" : "")
        : "The selected voice is unavailable.";
    } else {
      ui.voiceStatus.textContent =
        "Using the system default voice.";
    }
  });


  /* =========================================================
     22. LANGUAGE SELECTOR
     ========================================================= */

  ui.language.addEventListener("change", () => {
    selectedLanguage = ui.language.value === "sw"
      ? "sw"
      : "en";

    saveStorage(
      LANGUAGE_STORAGE_KEY,
      selectedLanguage
    );

    stopSpeech();

    if (tourIsOpen && currentStep < STEPS.length) {
      renderStep(currentStep, readAloudEnabled);
    }
  });


  /* =========================================================
     23. READ-ALOUD TOGGLE
     ========================================================= */

  ui.readAloud.addEventListener("change", () => {
    readAloudEnabled = ui.readAloud.checked;

    saveStorage(
      SPEECH_STORAGE_KEY,
      readAloudEnabled
    );

    if (!readAloudEnabled) {
      stopSpeech();

      ui.voiceStatus.textContent =
        "Read-aloud is off. You can still use the written guide.";
    } else {
      ui.voiceStatus.textContent =
        "Read-aloud is on.";
    }
  });


  /* =========================================================
     24. TEST SELECTED VOICE
     ========================================================= */

  ui.testVoice.addEventListener("click", () => {
    if (!("speechSynthesis" in window)) {
      ui.voiceStatus.textContent =
        "Speech synthesis is not supported by this browser.";
      return;
    }

    const sample = selectedLanguage === "sw"
      ? "Karibu MavunoBridge! Niko hapa kukusaidia kutumia website."
      : "Hello! Welcome to MavunoBridge. Let me show you around.";

    speak(sample);
  });


  /* =========================================================
     25. CONNECT BUTTONS
     ========================================================= */

  compass.addEventListener("click", toggleGuide);

  ui.close.addEventListener("click", closeGuide);

  ui.stopSpeech.addEventListener("click", stopSpeech);

  ui.next.addEventListener("click", () => {
    if (currentStep >= STEPS.length) {
      closeGuide();
      return;
    }

    nextStep();
  });

  ui.back.addEventListener("click", previousStep);

  ui.skip.addEventListener("click", closeGuide);


  /* =========================================================
     26. CONNECT EXISTING TOUR BUTTONS
     ========================================================= */

  const EXISTING_TRIGGER_SELECTOR = [
    "[data-open-tour]",
    "[data-tour-open]",
    "#tourButton",
    "#websiteTourButton",
    "#tutorialButton",
    "#guideButton",
    "#helpTourButton",
    "#openTutorial",
    ".website-tour-trigger",
    ".tour-trigger"
  ].join(",");

  document.addEventListener("click", (event) => {
    const clicked = event.target;

    if (!clicked || typeof clicked.closest !== "function") {
      return;
    }

    const trigger = clicked.closest(EXISTING_TRIGGER_SELECTOR);

    if (!trigger) return;

    if (trigger === compass) return;

    event.preventDefault();

    openGuide();
  });


  /* =========================================================
     27. ESCAPE KEY
     ========================================================= */

  document.addEventListener("keydown", (event) => {
    if (!tourIsOpen) return;

    if (event.key === "Escape") {
      closeGuide();
    }
  });


  /* =========================================================
     28. OPTIONAL SMART ASSIST AVATAR CONTAINERS

     Only dedicated avatar containers are selected here.

     This deliberately avoids general selectors like "main",
     ".container", or ".assistant", which can accidentally
     replace large parts of a website.
     ========================================================= */

  const SMART_AVATAR_SELECTOR = [
    "[data-mavuno-avatar]",
    "[data-tour-avatar]",
    "#smartAssistantAvatar",
    "#smart-assistant-avatar",
    "#smartAssistAvatar",
    "#smart-assist-avatar",
    ".mavuno-assistant-avatar",
    ".smart-assistant-avatar",
    ".smart-assist-avatar"
  ].join(",");


  function chooseCharacterForContainer(element) {
    const requested = (
      element.getAttribute("data-character") ||
      element.getAttribute("data-mavuno-avatar") ||
      element.getAttribute("data-avatar") ||
      ""
    ).toLowerCase().trim();

    if (CHARACTERS[requested]) {
      return requested;
    }

    const hint = (
      element.id + " " + element.className
    ).toLowerCase();

    if (hint.includes("sacco")) return "otieno";

    if (hint.includes("smart") || hint.includes("assist")) {
      return "kamau";
    }

    if (hint.includes("market") || hint.includes("buyer")) {
      return "wanjiku";
    }

    return "akinyi";
  }


  function mountAvatar(element, characterKey) {
    if (!(element instanceof HTMLElement)) return false;

    if (element === widget || widget.contains(element)) {
      return false;
    }

    if (element === compass) return false;

    if (element.dataset.mbGuideAvatarMounted === "true") {
      return false;
    }

    /*
     * The selected element must be a dedicated avatar holder.
     * This replaces only that holder's contents.
     */
    const character = CHARACTERS[characterKey]
      ? characterKey
      : "akinyi";

    element.innerHTML = createAvatarSVG(character);

    element.dataset.mbGuideAvatarMounted = "true";

    element.classList.add("mb-guide-mounted-avatar");

    initializeAllAvatars();

    return true;
  }


  function mountExistingAvatarContainers() {
    let containers = [];

    try {
      containers = Array.from(
        document.querySelectorAll(SMART_AVATAR_SELECTOR)
      );
    } catch (error) {
      return;
    }

    containers.forEach((element) => {
      const characterKey = chooseCharacterForContainer(element);

      mountAvatar(element, characterKey);
    });
  }


  /* =========================================================
     29. WATCH FOR AVATAR PLACEHOLDERS ADDED LATER
     ========================================================= */

  function observeAvatarContainers() {
    if (!("MutationObserver" in window)) return;

    if (!document.body) return;

    observer = new MutationObserver(() => {
      if (observerScheduled) return;

      observerScheduled = true;

      setTimeout(() => {
        observerScheduled = false;

        mountExistingAvatarContainers();

        initializeAllAvatars();
      }, 100);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }


  /* =========================================================
     30. PUBLIC API FOR OTHER WEBSITE SCRIPTS

     Other code can use:

       window.MavunoBridgeAvatars.startTalking();
       window.MavunoBridgeAvatars.stopTalking();

     To place a character into a dedicated container:

       window.MavunoBridgeAvatars.renderInto(
         "#myAvatarContainer",
         "akinyi"
       );

     Available character IDs:
       akinyi
       wanjiku
       kamau
       otieno
     ========================================================= */

  window.MavunoBridgeAvatars = {
    startTalking() {
      startMouthAnimation();
    },

    stopTalking() {
      stopMouthAnimation();
    },

    speak(text) {
      speak(String(text || ""));
    },

    stopSpeech() {
      stopSpeech();
    },

    openGuide() {
      openGuide();
    },

    closeGuide() {
      closeGuide();
    },

    setCharacter(characterKey) {
      if (!CHARACTERS[characterKey]) {
        return false;
      }

      selectedCharacter = characterKey;

      saveStorage(
        CHARACTER_STORAGE_KEY,
        characterKey
      );

      renderSelectedCharacter();

      return true;
    },

    renderInto(target, characterKey = "akinyi") {
      const element = typeof target === "string"
        ? document.querySelector(target)
        : target;

      if (!element || !CHARACTERS[characterKey]) {
        return false;
      }

      return mountAvatar(element, characterKey);
    },

    getCharacters() {
      return Object.keys(CHARACTERS).map((key) => ({
        id: key,
        name: CHARACTERS[key].name,
        role: CHARACTERS[key].role
      }));
    }
  };


  /* =========================================================
     31. INITIALIZE
     ========================================================= */

  function initializeGuide() {
    loadPreferences();

    ui.characterSelect.value = selectedCharacter;

    ui.language.value = selectedLanguage;

    ui.readAloud.checked = readAloudEnabled;

    renderSelectedCharacter();

    populateVoiceSelector();

    connectSpeechToWebsite();

    mountExistingAvatarContainers();

    initializeAllAvatars();

    observeAvatarContainers();

    if ("speechSynthesis" in window) {
      window.speechSynthesis.addEventListener?.(
        "voiceschanged",
        populateVoiceSelector
      );

      // Some browsers populate their voices shortly after page load.
      setTimeout(populateVoiceSelector, 500);
      setTimeout(populateVoiceSelector, 1500);
    }

    // Keep the website visible; never auto-open the panel.
    widget.classList.remove("mb-guide-open");

    compass.setAttribute("aria-expanded", "false");

    tourIsOpen = false;
  }


  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeGuide,
      { once: true }
    );
  } else {
    initializeGuide();
  }

})();
