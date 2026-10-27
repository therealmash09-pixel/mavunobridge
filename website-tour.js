/* ============================================================
   MAVUNOBRIDGE — CHARACTER TOUR & AVATAR SYSTEM
   Complete replacement: website-tour.js

   AVATAR DESIGN
   - Original, bold, cel-shaded cartoon characters
   - Dark-skinned Kenyan-inspired characters
   - Individual illustrated backgrounds for each character
   - Strong outlines and expressive, friendly faces
   - No body movement
   - No head movement
   - No floating or bouncing
   - Eyes blink naturally
   - Mouth moves only while speech is playing

   WEBSITE TOUR
   - Skippable step-by-step tutorial
   - Back and Next controls
   - English and casual Kiswahili-English wording
   - Browser speech synthesis when available
   - Responsive desktop and mobile layout
   - Can work on marketplace, Smart Assist and SACCO pages
   - Safe checks for missing page elements

   IMPORTANT:
   This file uses original vector-drawn characters with a
   bold cartoon aesthetic. It does not use copied characters
   from a television show or image files from the internet.
   ============================================================ */

(() => {
  "use strict";

  /* ------------------------------------------------------------
     1. PREVENT THE SCRIPT FROM RUNNING TWICE
     ------------------------------------------------------------ */

  if (window.__MAVUNOBRIDGE_CHARACTER_TOUR_V5__) {
    return;
  }

  window.__MAVUNOBRIDGE_CHARACTER_TOUR_V5__ = true;


  /* ------------------------------------------------------------
     2. BASIC CONFIGURATION
     ------------------------------------------------------------ */

  const TOUR_SEEN_KEY = "mavunobridge_tour_seen_v5";

  const TOUR_TRIGGER_SELECTOR = [
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


  /* ------------------------------------------------------------
     3. CHARACTER DEFINITIONS
     ------------------------------------------------------------ */

  const CHARACTERS = {
    akinyi: {
      name: "Akinyi",
      role: "Farmer Guide",
      skin: "#70402E",
      skinShadow: "#4B281F",
      skinLight: "#965D43",
      hair: "#171313",
      shirt: "#647D3F",
      shirtLight: "#8CA45B",
      scene: "farm",
      hairstyle: "afro"
    },

    wanjiku: {
      name: "Wanjiku",
      role: "Market Guide",
      skin: "#5E3528",
      skinShadow: "#3D211A",
      skinLight: "#89523B",
      hair: "#171313",
      shirt: "#C58A35",
      shirtLight: "#E7B65B",
      scene: "market",
      hairstyle: "braids"
    },

    kamau: {
      name: "Kamau",
      role: "Smart Assist Guide",
      skin: "#693B2B",
      skinShadow: "#47261D",
      skinLight: "#92583D",
      hair: "#151313",
      shirt: "#326B50",
      shirtLight: "#57936B",
      scene: "smart",
      hairstyle: "twists"
    },

    otieno: {
      name: "Otieno",
      role: "SACCO Guide",
      skin: "#512D22",
      skinShadow: "#351D18",
      skinLight: "#794832",
      hair: "#151313",
      shirt: "#B45D3B",
      shirtLight: "#D98558",
      scene: "sacco",
      hairstyle: "fade"
    }
  };


  /* ------------------------------------------------------------
     4. CHARACTER-SPECIFIC BACKGROUNDS

     Each background is part of the SVG artwork.

     These are completely static illustrations. They do not
     move or animate.
     ------------------------------------------------------------ */

  function createScene(character, id) {
    if (character.scene === "farm") {
      return `
        <defs>
          <linearGradient id="${id}-sky"
                          x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#F6C36F"/>
            <stop offset="100%" stop-color="#FFE5A8"/>
          </linearGradient>
        </defs>

        <rect width="420" height="420"
              fill="url(#${id}-sky)"/>

        <circle cx="323" cy="77" r="34"
                fill="#FFF2BD"/>

        <path d="M0 222
                 Q75 154 145 208
                 Q235 139 315 206
                 Q372 170 420 210
                 L420 420 L0 420Z"
              fill="#94A85C"/>

        <path d="M0 267
                 Q90 219 173 267
                 Q273 214 420 269
                 L420 420 L0 420Z"
              fill="#54763F"/>

        <path d="M0 331 L170 257 L218 420 L0 420Z"
              fill="#9E9A49"/>

        <path d="M420 326 L260 258 L210 420 L420 420Z"
              fill="#8C9345"/>

        <g fill="#42633A">
          <path d="M40 274 l13 -29 l13 29Z"/>
          <path d="M65 281 l12 -26 l12 26Z"/>
          <path d="M338 257 l14 -31 l14 31Z"/>
          <path d="M364 265 l12 -27 l12 27Z"/>
        </g>

        <g fill="#E3C36D" opacity=".9">
          <path d="M12 351 L125 420 L100 420Z"/>
          <path d="M408 351 L295 420 L320 420Z"/>
        </g>
      `;
    }

    if (character.scene === "market") {
      return `
        <defs>
          <linearGradient id="${id}-sky"
                          x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#F4BC78"/>
            <stop offset="100%" stop-color="#F7DFAD"/>
          </linearGradient>
        </defs>

        <rect width="420" height="420"
              fill="url(#${id}-sky)"/>

        <rect x="24" y="82" width="372" height="164"
              rx="8" fill="#F7E4C2"
              stroke="#64402B" stroke-width="4"/>

        <path d="M16 103 L404 103 L382 61
                 L38 61Z"
              fill="#47784B"
              stroke="#30271F" stroke-width="4"/>

        <path d="M38 61 L91 61 L78 103 L25 103Z"
              fill="#E9B456"/>

        <path d="M91 61 L144 61 L131 103 L78 103Z"
              fill="#D46748"/>

        <path d="M144 61 L197 61 L184 103 L131 103Z"
              fill="#E9B456"/>

        <path d="M197 61 L250 61 L237 103 L184 103Z"
              fill="#D46748"/>

        <path d="M250 61 L303 61 L290 103 L237 103Z"
              fill="#E9B456"/>

        <path d="M303 61 L356 61 L343 103 L290 103Z"
              fill="#D46748"/>

        <path d="M356 61 L382 61 L404 103 L343 103Z"
              fill="#E9B456"/>

        <rect x="49" y="128" width="105" height="68"
              rx="4" fill="#D7BF8E"
              stroke="#64402B" stroke-width="3"/>

        <rect x="170" y="128" width="105" height="68"
              rx="4" fill="#D7BF8E"
              stroke="#64402B" stroke-width="3"/>

        <rect x="291" y="128" width="79" height="68"
              rx="4" fill="#D7BF8E"
              stroke="#64402B" stroke-width="3"/>

        <g fill="#B74D36">
          <circle cx="74" cy="151" r="11"/>
          <circle cx="98" cy="151" r="11"/>
          <circle cx="122" cy="151" r="11"/>
        </g>

        <g fill="#E7B84C">
          <circle cx="195" cy="151" r="11"/>
          <circle cx="219" cy="151" r="11"/>
          <circle cx="243" cy="151" r="11"/>
        </g>

        <g fill="#648B46">
          <circle cx="313" cy="151" r="11"/>
          <circle cx="338" cy="151" r="11"/>
          <circle cx="350" cy="176" r="11"/>
        </g>

        <rect x="0" y="246" width="420" height="174"
              fill="#B98A57"/>

        <path d="M0 285 Q210 250 420 285"
              fill="none" stroke="#E0B47B"
              stroke-width="7"/>
      `;
    }

    if (character.scene === "smart") {
      return `
        <defs>
          <linearGradient id="${id}-sky"
                          x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#455E78"/>
            <stop offset="100%" stop-color="#C1B6DB"/>
          </linearGradient>
        </defs>

        <rect width="420" height="420"
              fill="url(#${id}-sky)"/>

        <circle cx="332" cy="83" r="55"
                fill="#E9DCFF" opacity=".45"/>

        <g fill="#314660" opacity=".8">
          <rect x="16" y="170" width="62" height="138"
                rx="5"/>
          <rect x="87" y="132" width="54" height="176"
                rx="5"/>
          <rect x="291" y="144" width="54" height="164"
                rx="5"/>
          <rect x="353" y="185" width="50" height="123"
                rx="5"/>
        </g>

        <g fill="#DDE5F2" opacity=".85">
          <rect x="28" y="190" width="10" height="12"/>
          <rect x="48" y="190" width="10" height="12"/>
          <rect x="28" y="215" width="10" height="12"/>
          <rect x="48" y="215" width="10" height="12"/>

          <rect x="100" y="154" width="10" height="12"/>
          <rect x="120" y="154" width="10" height="12"/>
          <rect x="100" y="179" width="10" height="12"/>
          <rect x="120" y="179" width="10" height="12"/>

          <rect x="304" y="165" width="10" height="12"/>
          <rect x="324" y="165" width="10" height="12"/>

          <rect x="365" y="203" width="10" height="12"/>
          <rect x="384" y="203" width="10" height="12"/>
        </g>

        <path d="M0 302 Q105 279 210 300
                 Q320 276 420 302
                 L420 420 L0 420Z"
              fill="#4E7964"/>

        <g stroke="#E8E0FF" stroke-width="3" fill="none"
           opacity=".8">
          <circle cx="52" cy="80" r="17"/>
          <path d="M52 63 V97 M35 80 H69"/>

          <circle cx="365" cy="120" r="14"/>
          <path d="M365 106 V134 M351 120 H379"/>

          <path d="M80 115 L118 89 L148 115"/>
        </g>

        <g fill="#E8E0FF" opacity=".9">
          <circle cx="148" cy="115" r="4"/>
          <circle cx="80" cy="115" r="4"/>
          <circle cx="118" cy="89" r="4"/>
        </g>
      `;
    }

    return `
      <defs>
        <linearGradient id="${id}-sky"
                        x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#80B5AC"/>
          <stop offset="100%" stop-color="#DCE9C9"/>
        </linearGradient>
      </defs>

      <rect width="420" height="420"
            fill="url(#${id}-sky)"/>

      <circle cx="330" cy="73" r="45"
              fill="#F8E5A9" opacity=".9"/>

      <path d="M0 210 Q120 163 220 210
               Q325 164 420 210
               L420 420 L0 420Z"
            fill="#7CA080"/>

      <rect x="56" y="113" width="308" height="151"
            rx="7" fill="#F1D7AB"
            stroke="#483A2C" stroke-width="4"/>

      <path d="M35 117 L385 117 L354 73
               L66 73Z"
            fill="#4D7351"
            stroke="#483A2C" stroke-width="4"/>

      <rect x="180" y="171" width="60" height="93"
            fill="#A56B40"
            stroke="#483A2C" stroke-width="4"/>

      <circle cx="229" cy="215" r="4"
              fill="#F5DDA9"/>

      <rect x="80" y="148" width="62" height="54"
            fill="#B9D7CD"
            stroke="#483A2C" stroke-width="4"/>

      <rect x="278" y="148" width="62" height="54"
            fill="#B9D7CD"
            stroke="#483A2C" stroke-width="4"/>

      <path d="M111 148 V202 M80 175 H142"
            stroke="#483A2C" stroke-width="3"/>

      <path d="M309 148 V202 M278 175 H340"
            stroke="#483A2C" stroke-width="3"/>

      <path d="M0 290 Q210 255 420 290
               L420 420 L0 420Z"
            fill="#537C57"/>

      <g fill="#D7C376">
        <path d="M36 315 Q48 294 60 315 Q48 305 36 315Z"/>
        <path d="M350 324 Q362 303 374 324 Q362 314 350 324Z"/>
      </g>
    `;
  }


  /* ------------------------------------------------------------
     5. HAIRSTYLES

     All faces use original vector artwork. Hairstyles are
     different but remain static.
     ------------------------------------------------------------ */

  function createHairBack(character) {
    if (character.hairstyle === "afro") {
      return `
        <path d="M126 174
                 C105 158 110 133 122 117
                 C116 95 142 70 164 80
                 C178 53 209 57 222 72
                 C247 57 272 83 273 101
                 C300 117 303 148 285 173
                 L276 202 L139 201Z"
              fill="${character.hair}"
              stroke="#211815" stroke-width="5"
              stroke-linejoin="round"/>

        <g fill="#252020">
          <circle cx="145" cy="102" r="20"/>
          <circle cx="170" cy="82" r="17"/>
          <circle cx="197" cy="75" r="19"/>
          <circle cx="226" cy="81" r="19"/>
          <circle cx="254" cy="99" r="19"/>
          <circle cx="273" cy="126" r="17"/>
          <circle cx="132" cy="132" r="16"/>
        </g>
      `;
    }

    if (character.hairstyle === "braids") {
      return `
        <path d="M132 160
                 C119 122 139 76 180 72
                 C220 56 263 82 282 118
                 L282 225 L262 251 L248 189
                 L163 194 L151 250 L130 226Z"
              fill="${character.hair}"
              stroke="#211815" stroke-width="5"
              stroke-linejoin="round"/>

        <g fill="none" stroke="#302424"
           stroke-width="8" stroke-linecap="round">
          <path d="M143 119 Q131 168 143 230"/>
          <path d="M158 99 Q148 159 160 240"/>
          <path d="M175 88 Q170 155 180 245"/>
          <path d="M191 81 Q190 150 198 247"/>
          <path d="M209 81 Q214 150 213 246"/>
          <path d="M229 88 Q239 156 228 243"/>
          <path d="M248 99 Q266 164 247 233"/>
          <path d="M267 117 Q284 166 265 219"/>
        </g>

        <g fill="none" stroke="#644031"
           stroke-width="2" stroke-linecap="round">
          <path d="M143 132 Q139 174 145 218"/>
          <path d="M159 120 Q154 176 162 226"/>
          <path d="M177 107 Q176 172 182 226"/>
          <path d="M195 102 Q196 174 199 228"/>
          <path d="M215 104 Q220 174 213 229"/>
          <path d="M234 115 Q244 174 229 226"/>
          <path d="M253 127 Q270 174 248 218"/>
        </g>
      `;
    }

    if (character.hairstyle === "twists") {
      return `
        <path d="M133 158
                 C119 123 137 87 161 81
                 C179 61 209 65 220 77
                 C244 67 270 87 279 114
                 L284 166 L266 191
                 L147 190Z"
              fill="${character.hair}"
              stroke="#211815" stroke-width="5"
              stroke-linejoin="round"/>

        <g fill="#201A18">
          <circle cx="146" cy="106" r="13"/>
          <circle cx="165" cy="83" r="12"/>
          <circle cx="187" cy="76" r="12"/>
          <circle cx="208" cy="77" r="12"/>
          <circle cx="232" cy="83" r="12"/>
          <circle cx="253" cy="100" r="12"/>
          <circle cx="271" cy="124" r="12"/>
        </g>

        <g fill="#44302A">
          <circle cx="164" cy="89" r="4"/>
          <circle cx="190" cy="82" r="4"/>
          <circle cx="212" cy="82" r="4"/>
          <circle cx="235" cy="91" r="4"/>
        </g>
      `;
    }

    return `
      <path d="M134 166
               L132 132
               Q128 93 169 78
               Q207 61 246 79
               Q281 94 282 132
               L279 173 L259 187
               L151 186Z"
            fill="${character.hair}"
            stroke="#211815" stroke-width="5"
            stroke-linejoin="round"/>

      <path d="M146 112
               Q166 83 200 88
               Q238 81 266 112
               L273 137
               Q236 115 209 122
               Q177 117 143 139Z"
            fill="#28201D"/>

      <path d="M147 130 Q158 113 169 115"
            stroke="#493128" stroke-width="4"
            fill="none" stroke-linecap="round"/>

      <path d="M229 113 Q243 111 257 126"
            stroke="#493128" stroke-width="4"
            fill="none" stroke-linecap="round"/>
    `;
  }


  function createHairFront(character) {
    if (character.hairstyle === "afro") {
      return `
        <path d="M139 145
                 Q145 106 177 99
                 Q207 88 237 103
                 Q260 113 272 145
                 Q254 127 238 132
                 Q220 143 209 125
                 Q195 148 176 132
                 Q159 140 139 145Z"
              fill="${character.hair}"
              stroke="#211815" stroke-width="4"
              stroke-linejoin="round"/>

        <g fill="#272020">
          <circle cx="158" cy="117" r="10"/>
          <circle cx="180" cy="104" r="10"/>
          <circle cx="203" cy="103" r="10"/>
          <circle cx="228" cy="111" r="10"/>
          <circle cx="250" cy="125" r="10"/>
        </g>
      `;
    }

    if (character.hairstyle === "braids") {
      return `
        <path d="M139 146
                 Q144 104 180 93
                 Q219 81 252 107
                 Q266 121 273 146
                 Q251 130 236 133
                 Q219 131 209 146
                 Q193 132 178 138
                 Q157 136 139 146Z"
              fill="${character.hair}"
              stroke="#211815" stroke-width="4"
              stroke-linejoin="round"/>

        <g fill="none" stroke="#503026"
           stroke-width="3" stroke-linecap="round">
          <path d="M159 110 Q164 126 158 137"/>
          <path d="M179 100 Q187 119 180 135"/>
          <path d="M201 96 Q207 118 204 136"/>
          <path d="M222 100 Q232 117 229 135"/>
          <path d="M242 110 Q252 124 252 139"/>
        </g>
      `;
    }

    if (character.hairstyle === "twists") {
      return `
        <path d="M137 145
                 Q146 105 175 95
                 Q210 80 242 98
                 Q263 109 274 142
                 L256 133 L240 139 L224 127
                 L209 138 L192 126
                 L177 138 L161 131Z"
              fill="${character.hair}"
              stroke="#211815" stroke-width="4"
              stroke-linejoin="round"/>
      `;
    }

    return `
      <path d="M139 145
               Q144 111 177 99
               Q210 84 244 100
               Q266 113 273 144
               L255 136 L236 140
               L221 130 L204 139
               L187 132 L171 139 L153 135Z"
            fill="${character.hair}"
            stroke="#211815" stroke-width="4"
            stroke-linejoin="round"/>
    `;
  }


  /* ------------------------------------------------------------
     6. MAIN AVATAR SVG

     The only moving parts are the two eye groups and the
     three mouth frames controlled by JavaScript.
     ------------------------------------------------------------ */

  let avatarCounter = 0;

  function createAvatarSVG(characterKey) {
    const character = CHARACTERS[characterKey] || CHARACTERS.akinyi;

    avatarCounter += 1;

    const id = "mb-avatar-" + avatarCounter;

    return `
      <svg
        data-mb-avatar-svg="true"
        data-mb-character="${characterKey}"
        viewBox="0 0 420 420"
        width="100%"
        height="100%"
        role="img"
        aria-label="${character.name}, ${character.role}"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >

        <!-- CHARACTER-SPECIFIC STATIC BACKGROUND -->
        ${createScene(character, id)}

        <!-- BODY: STATIC -->
        <path
          d="M82 420
             L96 350
             Q105 320 145 310
             L178 299
             L242 299
             L275 310
             Q315 320 324 350
             L338 420Z"
          fill="${character.shirt}"
          stroke="#241A17"
          stroke-width="6"
          stroke-linejoin="round"
        />

        <path
          d="M154 315 L190 344 L210 330
             L230 344 L266 315"
          fill="none"
          stroke="${character.shirtLight}"
          stroke-width="6"
          stroke-linecap="round"
        />

        <!-- NECK: STATIC -->
        <path
          d="M176 258
             L176 305
             Q210 329 244 305
             L244 258Z"
          fill="${character.skin}"
          stroke="#241A17"
          stroke-width="5"
          stroke-linejoin="round"
        />

        <!-- BACK OF HAIR -->
        ${createHairBack(character)}

        <!-- EARS -->
        <path
          d="M151 181
             Q132 171 132 194
             Q135 216 154 216"
          fill="${character.skin}"
          stroke="#241A17"
          stroke-width="5"
        />

        <path
          d="M269 181
             Q288 171 288 194
             Q285 216 266 216"
          fill="${character.skin}"
          stroke="#241A17"
          stroke-width="5"
        />

        <!-- EAR DETAILS -->
        <path
          d="M146 190 Q139 196 149 205"
          fill="none"
          stroke="${character.skinShadow}"
          stroke-width="4"
          stroke-linecap="round"
        />

        <path
          d="M274 190 Q281 196 271 205"
          fill="none"
          stroke="${character.skinShadow}"
          stroke-width="4"
          stroke-linecap="round"
        />

        <!-- FACE SHAPE -->
        <path
          d="M146 137
             Q152 100 210 98
             Q268 100 274 137
             L268 215
             Q260 260 210 270
             Q160 260 152 215Z"
          fill="${character.skin}"
          stroke="#241A17"
          stroke-width="5"
          stroke-linejoin="round"
        />

        <!-- FACE SHADING: STATIC -->
        <path
          d="M210 105
             Q256 106 265 143
             L260 211
             Q253 247 222 262
             Q252 228 246 187
             Q244 142 210 105Z"
          fill="${character.skinShadow}"
          opacity=".22"
        />

        <path
          d="M156 148
             Q168 126 188 126"
          fill="none"
          stroke="${character.skinLight}"
          stroke-width="6"
          stroke-linecap="round"
          opacity=".7"
        />

        <!-- EYEBROWS -->
        <path
          d="M163 162 Q180 151 195 163"
          fill="none"
          stroke="#211715"
          stroke-width="7"
          stroke-linecap="round"
        />

        <path
          d="M225 163 Q241 151 257 162"
          fill="none"
          stroke="#211715"
          stroke-width="7"
          stroke-linecap="round"
        />

        <!-- OPEN EYES -->
        <g data-mb-eye-open="true">
          <path
            d="M163 180
               Q179 165 196 180
               Q181 197 163 180Z"
            fill="#FFF7E9"
            stroke="#211715"
            stroke-width="4"
            stroke-linejoin="round"
          />

          <ellipse
            cx="180"
            cy="180"
            rx="6.5"
            ry="9"
            fill="#2B201C"
          />

          <circle
            cx="182"
            cy="176"
            r="2.5"
            fill="#FFFFFF"
          />

          <path
            d="M225 180
               Q241 165 257 180
               Q239 197 225 180Z"
            fill="#FFF7E9"
            stroke="#211715"
            stroke-width="4"
            stroke-linejoin="round"
          />

          <ellipse
            cx="242"
            cy="180"
            rx="6.5"
            ry="9"
            fill="#2B201C"
          />

          <circle
            cx="244"
            cy="176"
            r="2.5"
            fill="#FFFFFF"
          />
        </g>

        <!-- CLOSED EYES: SHOWN DURING BLINKS -->
        <g data-mb-eye-closed="true" style="display:none">
          <path
            d="M164 182 Q180 188 195 182"
            fill="none"
            stroke="#211715"
            stroke-width="5"
            stroke-linecap="round"
          />

          <path
            d="M226 182 Q241 188 256 182"
            fill="none"
            stroke="#211715"
            stroke-width="5"
            stroke-linecap="round"
          />
        </g>

        <!-- NOSE: STATIC -->
        <path
          d="M208 181
             L202 207
             Q208 213 217 208"
          fill="none"
          stroke="${character.skinShadow}"
          stroke-width="4"
          stroke-linecap="round"
          stroke-linejoin="round"
        />

        <!-- NOSE HIGHLIGHT -->
        <path
          d="M208 185 L205 203"
          fill="none"
          stroke="${character.skinLight}"
          stroke-width="2"
          stroke-linecap="round"
          opacity=".75"
        />

        <!-- CHEEK SHADING: STATIC -->
        <path
          d="M158 208 Q168 216 182 209"
          fill="none"
          stroke="${character.skinLight}"
          stroke-width="5"
          stroke-linecap="round"
          opacity=".4"
        />

        <path
          d="M238 209 Q251 216 261 208"
          fill="none"
          stroke="${character.skinLight}"
          stroke-width="5"
          stroke-linecap="round"
          opacity=".4"
        />

        <!-- CLOSED MOUTH -->
        <path
          data-mb-mouth-frame="0"
          d="M190 232
             Q210 243 230 232"
          fill="none"
          stroke="#2B1715"
          stroke-width="5"
          stroke-linecap="round"
        />

        <!-- SPEAKING MOUTH: SMALL OPEN -->
        <g data-mb-mouth-frame="1" style="display:none">
          <path
            d="M192 231
               Q210 244 228 231
               Q225 248 210 249
               Q195 248 192 231Z"
            fill="#311719"
            stroke="#241715"
            stroke-width="4"
            stroke-linejoin="round"
          />

          <path
            d="M198 235 Q210 239 222 235"
            fill="none"
            stroke="#FFF0D9"
            stroke-width="3"
            stroke-linecap="round"
          />
        </g>

        <!-- SPEAKING MOUTH: OPEN -->
        <g data-mb-mouth-frame="2" style="display:none">
          <path
            d="M190 230
               Q210 243 230 230
               Q227 254 210 255
               Q193 254 190 230Z"
            fill="#281315"
            stroke="#241715"
            stroke-width="4"
            stroke-linejoin="round"
          />

          <path
            d="M197 235
               Q210 240 223 235
               L220 241
               Q210 244 200 241Z"
            fill="#FFF0D9"
          />

          <path
            d="M202 248 Q210 244 218 248"
            fill="none"
            stroke="#A84C4A"
            stroke-width="3"
            stroke-linecap="round"
          />
        </g>

        <!-- HAIR IN FRONT -->
        ${createHairFront(character)}

        <!-- FINISHING DETAILS -->
        ${
          character.hairstyle === "braids"
            ? `
              <g fill="#D7A74D"
                 stroke="#39271D"
                 stroke-width="3">
                <circle cx="143" cy="216" r="6"/>
                <circle cx="265" cy="215" r="6"/>
              </g>
            `
            : ""
        }

        ${
          characterKey === "akinyi"
            ? `
              <g fill="none"
                 stroke="#E8BE62"
                 stroke-width="4">
                <circle cx="144" cy="221" r="7"/>
                <circle cx="276" cy="221" r="7"/>
              </g>
            `
            : ""
        }

      </svg>
    `;
  }


  /* ------------------------------------------------------------
     7. AVATAR STYLES

     Notice that there are no keyframe animations here.

     The JavaScript changes only the eyes and the mouth SVGs.
     ------------------------------------------------------------ */

  const style = document.createElement("style");

  style.id = "mavunobridge-character-tour-styles";

  style.textContent = `
    .mb-tour-root,
    .mb-tour-root *,
    .mb-avatar-mount,
    .mb-avatar-mount * {
      box-sizing: border-box;
    }

    .mb-tour-root {
      position: fixed;
      inset: 0;
      z-index: 99990;
      display: none;
      font-family: Arial, Helvetica, sans-serif;
      color: #203526;
    }

    .mb-tour-root.mb-tour-visible {
      display: block;
    }

    .mb-tour-backdrop {
      position: absolute;
      inset: 0;
      background: rgba(13, 23, 16, .70);
    }

    .mb-tour-dialog {
      position: absolute;
      width: min(930px, calc(100% - 30px));
      max-height: min(700px, calc(100dvh - 32px));
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      overflow-y: auto;
      background: #FFFFFF;
      border: 2px solid #DCE5D6;
      border-radius: 20px;
      box-shadow: 0 20px 65px rgba(0, 0, 0, .28);
    }

    .mb-tour-header {
      min-height: 60px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 14px 20px;
      border-bottom: 1px solid #E7EDE3;
    }

    .mb-tour-brand {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 15px;
      font-weight: 800;
      color: #244B30;
    }

    .mb-tour-brand-mark {
      display: grid;
      place-items: center;
      width: 34px;
      height: 34px;
      flex: 0 0 34px;
      border-radius: 10px;
      background: #E9F0DF;
      color: #244B30;
      font-size: 19px;
    }

    .mb-tour-close {
      width: 38px;
      height: 38px;
      flex: 0 0 38px;
      border: 0;
      border-radius: 10px;
      background: #F0F3ED;
      color: #27382B;
      font-size: 25px;
      line-height: 1;
      cursor: pointer;
    }

    .mb-tour-close:hover {
      background: #E1E9DC;
    }

    .mb-tour-main {
      display: grid;
      grid-template-columns: minmax(0, .92fr) minmax(0, 1.08fr);
      gap: 25px;
      padding: 22px;
    }

    .mb-tour-character-card {
      min-width: 0;
      align-self: stretch;
      overflow: hidden;
      border: 1px solid #DFE6D9;
      border-radius: 17px;
      background: #F5F2E7;
    }

    .mb-tour-avatar-stage {
      width: 100%;
      aspect-ratio: 1 / 1;
      overflow: hidden;
      background: #EDE8D8;
    }

    .mb-tour-avatar-stage svg {
      display: block;
      width: 100%;
      height: 100%;
    }

    .mb-tour-character-info {
      padding: 14px 16px 17px;
      background: #FFFFFF;
      border-top: 1px solid #E2E7DC;
    }

    .mb-tour-character-name {
      margin: 0;
      color: #243B2A;
      font-size: 20px;
      font-weight: 800;
    }

    .mb-tour-character-role {
      margin: 5px 0 0;
      color: #657564;
      font-size: 13px;
      font-weight: 600;
    }

    .mb-tour-content {
      display: flex;
      min-width: 0;
      flex-direction: column;
      justify-content: center;
      padding: 6px 0;
    }

    .mb-tour-eyebrow {
      margin: 0 0 12px;
      color: #537744;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 1.5px;
      text-transform: uppercase;
    }

    .mb-tour-title {
      margin: 0 0 15px;
      color: #203A28;
      font-size: clamp(24px, 3vw, 34px);
      line-height: 1.16;
      font-weight: 850;
      overflow-wrap: anywhere;
    }

    .mb-tour-description {
      margin: 0;
      color: #526154;
      font-size: 16px;
      line-height: 1.75;
      overflow-wrap: anywhere;
    }

    .mb-tour-tip {
      margin-top: 22px;
      padding: 13px 15px;
      border-left: 4px solid #749454;
      border-radius: 0 9px 9px 0;
      background: #F3F6EE;
      color: #3F5742;
      font-size: 13px;
      line-height: 1.6;
    }

    .mb-tour-progress-area {
      margin-top: 25px;
    }

    .mb-tour-progress-label {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 9px;
      color: #667568;
      font-size: 12px;
      font-weight: 700;
    }

    .mb-tour-progress-track {
      width: 100%;
      height: 6px;
      overflow: hidden;
      border-radius: 99px;
      background: #E6EADF;
    }

    .mb-tour-progress-value {
      height: 100%;
      width: 0;
      background: #547D3D;
      border-radius: 99px;
    }

    .mb-tour-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      padding: 15px 20px;
      border-top: 1px solid #E7EDE3;
      background: #FBFCF9;
    }

    .mb-tour-skip {
      border: 0;
      background: transparent;
      color: #566857;
      font-size: 13px;
      font-weight: 700;
      padding: 10px 4px;
      cursor: pointer;
    }

    .mb-tour-actions {
      display: flex;
      align-items: center;
      gap: 9px;
    }

    .mb-tour-button {
      min-height: 43px;
      border: 1px solid #D8E0D2;
      border-radius: 10px;
      padding: 10px 16px;
      background: #FFFFFF;
      color: #29412E;
      font-size: 14px;
      font-weight: 800;
      cursor: pointer;
    }

    .mb-tour-button:disabled {
      opacity: .43;
      cursor: not-allowed;
    }

    .mb-tour-button-primary {
      border-color: #244B30;
      background: #244B30;
      color: #FFFFFF;
    }

    .mb-tour-button-primary:hover {
      background: #193B24;
    }

    .mb-tour-button-secondary:hover {
      background: #EFF3EB;
    }

    .mb-tour-sound-note {
      margin-top: 13px;
      color: #758074;
      font-size: 11px;
      line-height: 1.5;
    }

    .mb-tour-help-button {
      position: fixed;
      right: 18px;
      bottom: 18px;
      z-index: 9990;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      min-height: 44px;
      border: 1px solid #DAE4D5;
      border-radius: 13px;
      padding: 11px 16px;
      background: #244B30;
      color: #FFFFFF;
      font: 800 13px Arial, Helvetica, sans-serif;
      box-shadow: 0 5px 20px rgba(25, 46, 29, .18);
      cursor: pointer;
    }

    .mb-tour-help-button:hover {
      background: #193B24;
    }

    .mb-avatar-mount {
      position: relative;
      display: block;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    .mb-avatar-mount svg {
      display: block;
      width: 100%;
      height: 100%;
    }

    @media (max-width: 680px) {
      .mb-tour-dialog {
        width: calc(100% - 18px);
        max-height: calc(100dvh - 18px);
        border-radius: 15px;
      }

      .mb-tour-header {
        min-height: 52px;
        padding: 10px 13px;
      }

      .mb-tour-brand {
        font-size: 13px;
      }

      .mb-tour-main {
        grid-template-columns: minmax(0, 1fr);
        gap: 16px;
        padding: 13px;
      }

      .mb-tour-character-card {
        display: grid;
        grid-template-columns: minmax(0, 150px) minmax(0, 1fr);
        align-items: center;
      }

      .mb-tour-avatar-stage {
        aspect-ratio: 1 / 1;
      }

      .mb-tour-character-info {
        padding: 12px;
        border-top: 0;
        border-left: 1px solid #E2E7DC;
      }

      .mb-tour-character-name {
        font-size: 18px;
      }

      .mb-tour-character-role {
        font-size: 12px;
        line-height: 1.5;
      }

      .mb-tour-content {
        padding: 3px 2px;
      }

      .mb-tour-eyebrow {
        margin-bottom: 8px;
      }

      .mb-tour-title {
        font-size: 24px;
        margin-bottom: 10px;
      }

      .mb-tour-description {
        font-size: 14px;
        line-height: 1.65;
      }

      .mb-tour-tip {
        margin-top: 13px;
        padding: 10px 12px;
      }

      .mb-tour-progress-area {
        margin-top: 16px;
      }

      .mb-tour-footer {
        align-items: center;
        padding: 10px 12px;
        gap: 6px;
      }

      .mb-tour-skip {
        max-width: 100px;
        font-size: 12px;
      }

      .mb-tour-actions {
        gap: 6px;
      }

      .mb-tour-button {
        min-height: 40px;
        padding: 9px 12px;
        font-size: 12px;
      }
    }

    @media (max-width: 360px) {
      .mb-tour-character-card {
        grid-template-columns: minmax(0, 112px) minmax(0, 1fr);
      }

      .mb-tour-character-name {
        font-size: 16px;
      }

      .mb-tour-title {
        font-size: 21px;
      }

      .mb-tour-description {
        font-size: 13px;
      }

      .mb-tour-skip {
        max-width: 80px;
      }

      .mb-tour-button {
        padding: 8px 9px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .mb-tour-root *,
      .mb-avatar-mount * {
        scroll-behavior: auto !important;
      }
    }
  `;

  document.head.appendChild(style);


  /* ------------------------------------------------------------
     8. FIND AND CONTROL AVATAR PARTS
     ------------------------------------------------------------ */

  let mouthTimer = null;
  let mouthFrameIndex = 0;
  let currentlyTalking = false;

  function getAvatarElements() {
    return Array.from(
      document.querySelectorAll("svg[data-mb-avatar-svg]")
    );
  }


  function setEyesOpen(svg, open) {
    if (!svg) return;

    const openGroup = svg.querySelector("[data-mb-eye-open]");
    const closedGroup = svg.querySelector("[data-mb-eye-closed]");

    if (openGroup) {
      openGroup.style.display = open ? "" : "none";
    }

    if (closedGroup) {
      closedGroup.style.display = open ? "none" : "";
    }
  }


  function setMouthFrame(svg, frame) {
    if (!svg) return;

    const frames = svg.querySelectorAll("[data-mb-mouth-frame]");

    frames.forEach((mouth) => {
      mouth.style.display =
        Number(mouth.getAttribute("data-mb-mouth-frame")) === frame
          ? ""
          : "none";
    });
  }


  function setAllMouths(frame) {
    getAvatarElements().forEach((svg) => {
      setMouthFrame(svg, frame);
    });
  }


  /* ------------------------------------------------------------
     9. NATURAL BLINKING

     Blinking is the only eye animation.

     Every blink is brief, with a random delay before the next
     blink. There is no constant rapid blinking.
     ------------------------------------------------------------ */

  function initializeBlinking(svg) {
    if (!svg || svg.dataset.mbBlinkInitialized === "true") {
      return;
    }

    svg.dataset.mbBlinkInitialized = "true";

    function scheduleBlink() {
      if (!svg.isConnected) return;

      const nextDelay = 2300 + Math.random() * 3300;

      svg._mbNextBlinkTimer = window.setTimeout(() => {
        if (!svg.isConnected) return;

        setEyesOpen(svg, false);

        const blinkDuration = 85 + Math.random() * 55;

        svg._mbBlinkCloseTimer = window.setTimeout(() => {
          if (!svg.isConnected) return;

          setEyesOpen(svg, true);

          scheduleBlink();
        }, blinkDuration);
      }, nextDelay);
    }

    setEyesOpen(svg, true);
    scheduleBlink();
  }


  function initializeAllAvatars() {
    getAvatarElements().forEach(initializeBlinking);
  }


  /* ------------------------------------------------------------
     10. MOUTH MOVEMENT WHILE SPEAKING

     Only the mouth changes between three drawn frames.

     The mouth stays closed when speech ends.
     ------------------------------------------------------------ */

  function startMouthMovement() {
    if (currentlyTalking) return;

    currentlyTalking = true;
    mouthFrameIndex = 0;

    setAllMouths(1);

    if (mouthTimer) {
      clearInterval(mouthTimer);
    }

    mouthTimer = window.setInterval(() => {
      if (!currentlyTalking) return;

      const sequence = [1, 2, 1, 0, 1, 2];

      mouthFrameIndex =
        (mouthFrameIndex + 1) % sequence.length;

      setAllMouths(sequence[mouthFrameIndex]);
    }, 125);
  }


  function stopMouthMovement() {
    currentlyTalking = false;

    if (mouthTimer) {
      clearInterval(mouthTimer);
      mouthTimer = null;
    }

    setAllMouths(0);
  }


  /* ------------------------------------------------------------
     11. CONNECT AVATAR MOVEMENT TO SPEECH SYNTHESIS

     Any assistant code using browser speech synthesis can
     trigger the same mouth movement.

     The original speech function is preserved and called.
     ------------------------------------------------------------ */

  function connectSpeechToAvatars() {
    if (!("speechSynthesis" in window)) return;

    const synthesis = window.speechSynthesis;

    if (synthesis.__mbAvatarSpeechConnected) return;

    try {
      const originalSpeak = synthesis.speak;

      if (typeof originalSpeak !== "function") return;

      const wrappedSpeak = function (utterance) {
        if (
          utterance &&
          typeof utterance.addEventListener === "function"
        ) {
          let finished = false;

          const onStart = () => {
            startMouthMovement();
          };

          const onFinish = () => {
            if (finished) return;

            finished = true;
            stopMouthMovement();
          };

          utterance.addEventListener("start", onStart, {
            once: true
          });

          utterance.addEventListener("end", onFinish, {
            once: true
          });

          utterance.addEventListener("error", onFinish, {
            once: true
          });
        }

        return originalSpeak.call(this, utterance);
      };

      synthesis.speak = wrappedSpeak;
      synthesis.__mbAvatarSpeechConnected = true;
    } catch (error) {
      /*
        If the browser doesn't allow wrapping its speech
        function, the website tour still handles its own
        mouth movement separately.
      */
    }
  }


  /* ------------------------------------------------------------
     12. LANGUAGE PREFERENCE

     Supports commonly used language-storage names from the
     project. The default wording is simple English.
     ------------------------------------------------------------ */

  function getPreferredLanguage() {
    const possibleKeys = [
      "mavunobridge_language",
      "mavunobridge_language_v1",
      "shambamarket_language_v2",
      "mb_language",
      "preferredLanguage"
    ];

    for (const key of possibleKeys) {
      try {
        const value = localStorage.getItem(key);

        if (value) {
          const normalized = value.toLowerCase().trim();

          if (
            normalized.includes("sw") ||
            normalized.includes("kiswahili") ||
            normalized.includes("swahili") ||
            normalized.includes("sheng")
          ) {
            return "sw";
          }

          if (
            normalized.includes("en") ||
            normalized.includes("english")
          ) {
            return "en";
          }
        }
      } catch (error) {
        // Continue with the next possible preference.
      }
    }

    return "en";
  }


  /* ------------------------------------------------------------
     13. TOUR CONTENT
     ------------------------------------------------------------ */

  const TOUR_STEPS = [
    {
      character: "akinyi",

      target: [
        "main",
        "#marketplace",
        "#marketplaceSection",
        "[data-marketplace]"
      ],

      en: {
        title: "Karibu to MavunoBridge!",
        body:
          "This is your connection between farmers and buyers. " +
          "Explore products, compare offers and discover more " +
          "ways to make agriculture work for you.",
        tip:
          "Take the tour step by step. You can skip it anytime."
      },

      sw: {
        title: "Karibu MavunoBridge!",
        body:
          "Hapa farmers na buyers wana-connect. Unaweza ku-explore " +
          "products, compare bei na kupata opportunities za farming.",
        tip:
          "Pitia steps hizi polepole. Unaweza kuskip tutorial anytime."
      }
    },

    {
      character: "wanjiku",

      target: [
        "#searchInput",
        "#marketSearch",
        "#search",
        "input[type='search']",
        "[data-marketplace-search]",
        ".search-bar input"
      ],

      en: {
        title: "Search for what you need",
        body:
          "Use the search bar to find produce, farm supplies, " +
          "tools and other agricultural products. Search by name " +
          "to narrow down the available listings.",
        tip:
          "Try searching for tomatoes, maize, beans or avocados."
      },

      sw: {
        title: "Search bidhaa unahitaji",
        body:
          "Tumia search bar kupata produce, farm supplies, tools " +
          "na agricultural products zingine. Andika jina la kitu " +
          "unatafuta ili upate listings zinazofaa.",
        tip:
          "Try ku-search tomatoes, maize, beans ama avocados."
      }
    },

    {
      character: "akinyi",

      target: [
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
          "Browse different categories such as fruits, vegetables, " +
          "grains, cereals, legumes, livestock, farm tools and " +
          "agricultural services.",
        tip:
          "Choose a category to make browsing easier."
      },

      sw: {
        title: "Explore categories tofauti",
        body:
          "Browse fruits, vegetables, grains, cereals, legumes, " +
          "livestock, farm tools na agricultural services. " +
          "Choose category yenye inakufaa.",
        tip:
          "Category inakusaidia kupata products faster."
      }
    },

    {
      character: "wanjiku",

      target: [
        "#listingGrid",
        "#productGrid",
        ".listing-grid",
        ".product-grid",
        "[data-listing-grid]",
        "#marketplaceListings"
      ],

      en: {
        title: "Compare products and prices",
        body:
          "Check the available listings and compare prices, " +
          "quantities and locations before choosing a seller. " +
          "Read the listing details before making a decision.",
        tip:
          "Availability and seller details may differ between listings."
      },

      sw: {
        title: "Compare bidhaa na bei",
        body:
          "Angalia listings, compare prices, quantities na locations " +
          "kabla uchague seller. Read details za listing kwanza " +
          "ili ufanye decision poa.",
        tip:
          "Seller details na availability zinaweza kutofautiana."
      }
    },

    {
      character: "akinyi",

      target: [
        "#sellButton",
        "#heroSellButton",
        "[data-open-sell]",
        "[data-action='sell']",
        "a[href*='sell']",
        ".sell-button"
      ],

      en: {
        title: "Got products to sell?",
        body:
          "Farmers can use the selling feature to share their " +
          "produce with potential buyers. Add the required details " +
          "carefully so buyers understand what you are offering.",
        tip:
          "Use clear product information and accurate quantities."
      },

      sw: {
        title: "Una bidhaa za kuuza?",
        body:
          "Farmers wanaweza kutumia selling feature kuonyesha " +
          "produce yao kwa buyers. Weka product details vizuri " +
          "ili wanunuzi waelewe unauza nini.",
        tip:
          "Weka details na quantities zilizo accurate."
      }
    },

    {
      character: "kamau",

      target: [
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
          "Smart Assist is designed to help farmers explore farming " +
          "guidance, crop ideas and other useful information. " +
          "Open the Smart Assist page to see the features available.",
        tip:
          "Recommendations can depend on location, weather data " +
          "and the information available."
      },

      sw: {
        title: "Meet Smart Assist",
        body:
          "Smart Assist imeundwa kusaidia farmers kupata farming " +
          "guidance, crop ideas na useful information. Fungua " +
          "Smart Assist page uone features zilizopo.",
        tip:
          "Recommendations zinategemea data na information available."
      }
    },

    {
      character: "otieno",

      target: [
        "#sacco",
        "#saccoHub",
        "#saccoButton",
        "#sacco-hub",
        "[data-nav='sacco']",
        "a[href*='sacco']"
      ],

      en: {
        title: "Discover the SACCO Hub",
        body:
          "Visit the SACCO Hub to explore the SACCO-related " +
          "information and opportunities provided by the website. " +
          "Read the requirements carefully before taking action.",
        tip:
          "Check each organisation's details and eligibility conditions."
      },

      sw: {
        title: "Explore SACCO Hub",
        body:
          "Tembelea SACCO Hub ku-explore information na opportunities " +
          "zinazopatikana. Soma requirements za kila organisation " +
          "carefully kabla ya kuchukua hatua.",
        tip:
          "Confirm details na eligibility requirements kwanza."
      }
    }
  ];


  /* ------------------------------------------------------------
     14. CREATE THE TOUR INTERFACE
     ------------------------------------------------------------ */

  const tourRoot = document.createElement("div");

  tourRoot.id = "mavunobridge-character-tour";
  tourRoot.className = "mb-tour-root";
  tourRoot.setAttribute("aria-hidden", "true");

  tourRoot.innerHTML = `
    <div
      class="mb-tour-backdrop"
      data-mb-tour-close
    ></div>

    <section
      class="mb-tour-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mb-tour-title"
      aria-describedby="mb-tour-description"
    >

      <header class="mb-tour-header">
        <div class="mb-tour-brand">
          <span class="mb-tour-brand-mark" aria-hidden="true">
            🌱
          </span>

          <span>MavunoBridge Guide</span>
        </div>

        <button
          class="mb-tour-close"
          type="button"
          aria-label="Close tutorial"
          data-mb-tour-close
        >
          ×
        </button>
      </header>

      <div class="mb-tour-main">

        <div class="mb-tour-character-card">

          <div
            class="mb-tour-avatar-stage"
            id="mb-tour-avatar-stage"
          ></div>

          <div class="mb-tour-character-info">
            <p
              class="mb-tour-character-name"
              id="mb-tour-character-name"
            >
              Akinyi
            </p>

            <p
              class="mb-tour-character-role"
              id="mb-tour-character-role"
            >
              Farmer Guide
            </p>
          </div>

        </div>

        <div class="mb-tour-content">

          <p
            class="mb-tour-eyebrow"
            id="mb-tour-eyebrow"
          >
            WEBSITE TOUR
          </p>

          <h2
            class="mb-tour-title"
            id="mb-tour-title"
          >
            Karibu to MavunoBridge!
          </h2>

          <p
            class="mb-tour-description"
            id="mb-tour-description"
          >
            Discover how to use the marketplace.
          </p>

          <div
            class="mb-tour-tip"
            id="mb-tour-tip"
          ></div>

          <div class="mb-tour-progress-area">

            <div class="mb-tour-progress-label">
              <span id="mb-tour-step-label">
                Step 1 of 7
              </span>

              <span id="mb-tour-percent">
                14%
              </span>
            </div>

            <div
              class="mb-tour-progress-track"
              role="progressbar"
              aria-label="Tutorial progress"
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow="14"
              id="mb-tour-progress-track"
            >
              <div
                class="mb-tour-progress-value"
                id="mb-tour-progress-value"
              ></div>
            </div>

          </div>

          <p class="mb-tour-sound-note">
            Audio depends on your browser's speech support and settings.
          </p>

        </div>

      </div>

      <footer class="mb-tour-footer">

        <button
          class="mb-tour-skip"
          id="mb-tour-skip"
          type="button"
        >
          Skip tutorial
        </button>

        <div class="mb-tour-actions">

          <button
            class="mb-tour-button mb-tour-button-secondary"
            id="mb-tour-back"
            type="button"
          >
            Back
          </button>

          <button
            class="mb-tour-button mb-tour-button-primary"
            id="mb-tour-next"
            type="button"
          >
            Next
          </button>

        </div>

      </footer>

    </section>
  `;

  document.body.appendChild(tourRoot);


  /* ------------------------------------------------------------
     15. TOUR ELEMENT REFERENCES
     ------------------------------------------------------------ */

  const tourElements = {
    root: tourRoot,

    avatarStage:
      tourRoot.querySelector("#mb-tour-avatar-stage"),

    characterName:
      tourRoot.querySelector("#mb-tour-character-name"),

    characterRole:
      tourRoot.querySelector("#mb-tour-character-role"),

    eyebrow:
      tourRoot.querySelector("#mb-tour-eyebrow"),

    title:
      tourRoot.querySelector("#mb-tour-title"),

    description:
      tourRoot.querySelector("#mb-tour-description"),

    tip:
      tourRoot.querySelector("#mb-tour-tip"),

    stepLabel:
      tourRoot.querySelector("#mb-tour-step-label"),

    percent:
      tourRoot.querySelector("#mb-tour-percent"),

    progressTrack:
      tourRoot.querySelector("#mb-tour-progress-track"),

    progressValue:
      tourRoot.querySelector("#mb-tour-progress-value"),

    back:
      tourRoot.querySelector("#mb-tour-back"),

    next:
      tourRoot.querySelector("#mb-tour-next"),

    skip:
      tourRoot.querySelector("#mb-tour-skip")
  };


  /* ------------------------------------------------------------
     16. TOUR STATE
     ------------------------------------------------------------ */

  let currentStep = 0;
  let tourIsOpen = false;
  let currentFocusTarget = null;


  /* ------------------------------------------------------------
     17. STORAGE HELPERS
     ------------------------------------------------------------ */

  function hasSeenTour() {
    try {
      return localStorage.getItem(TOUR_SEEN_KEY) === "yes";
    } catch (error) {
      return false;
    }
  }


  function markTourSeen() {
    try {
      localStorage.setItem(TOUR_SEEN_KEY, "yes");
    } catch (error) {
      // The tour remains usable if browser storage is unavailable.
    }
  }


  /* ------------------------------------------------------------
     18. CHARACTER RENDERING
     ------------------------------------------------------------ */

  function renderTourCharacter(characterKey) {
    const character = CHARACTERS[characterKey] || CHARACTERS.akinyi;

    tourElements.avatarStage.innerHTML =
      createAvatarSVG(characterKey);

    tourElements.characterName.textContent =
      character.name;

    tourElements.characterRole.textContent =
      character.role;

    initializeAllAvatars();
  }


  /* ------------------------------------------------------------
     19. FIND OPTIONAL PAGE ELEMENTS
     ------------------------------------------------------------ */

  function findStepTarget(step) {
    if (!step || !Array.isArray(step.target)) {
      return null;
    }

    for (const selector of step.target) {
      try {
        const element = document.querySelector(selector);

        if (
          element &&
          !tourRoot.contains(element) &&
          element !== tourRoot
        ) {
          return element;
        }
      } catch (error) {
        // Ignore invalid selectors and check the next one.
      }
    }

    return null;
  }


  function clearFocusedTarget() {
    if (currentFocusTarget) {
      currentFocusTarget.classList.remove(
        "mb-tour-current-target"
      );
    }

    currentFocusTarget = null;
  }


  function updateFocusedTarget(step) {
    clearFocusedTarget();

    const target = findStepTarget(step);

    if (!target) return;

    currentFocusTarget = target;

    try {
      target.scrollIntoView({
        block: "nearest",
        inline: "nearest",
        behavior: "auto"
      });
    } catch (error) {
      // Continue without scrolling if the browser doesn't support it.
    }
  }


  /* ------------------------------------------------------------
     20. TOUR SPEECH
     ------------------------------------------------------------ */

  function stopTourSpeech() {
    try {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    } catch (error) {
      // Text remains visible even if speech is unavailable.
    }

    stopMouthMovement();
  }


  function speakTourText(text) {
    if (!("speechSynthesis" in window)) return;

    if (!text || !text.trim()) return;

    stopTourSpeech();

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      const language = getPreferredLanguage();

      utterance.lang = language === "sw" ? "sw-KE" : "en-KE";
      utterance.rate = 0.94;
      utterance.pitch = 1;
      utterance.volume = 1;

      const voices = window.speechSynthesis.getVoices();

      if (voices && voices.length) {
        let voice = null;

        if (language === "sw") {
          voice = voices.find((item) =>
            item.lang.toLowerCase().startsWith("sw")
          );
        }

        if (!voice) {
          voice = voices.find((item) =>
            item.lang.toLowerCase().startsWith(
              language === "sw" ? "sw" : "en"
            )
          );
        }

        if (voice) {
          utterance.voice = voice;
        }
      }

      /*
       * These handlers ensure the tour avatar still moves its
       * mouth if the browser does not allow the speech wrapper.
       */
      utterance.onstart = () => {
        startMouthMovement();
      };

      utterance.onend = () => {
        stopMouthMovement();
      };

      utterance.onerror = () => {
        stopMouthMovement();
      };

      window.speechSynthesis.speak(utterance);
    } catch (error) {
      stopMouthMovement();
    }
  }


  /* ------------------------------------------------------------
     21. DISPLAY A TOUR STEP
     ------------------------------------------------------------ */

  function renderTourStep(index, shouldSpeak = true) {
    if (index < 0 || index >= TOUR_STEPS.length) return;

    currentStep = index;

    const step = TOUR_STEPS[currentStep];
    const language = getPreferredLanguage();

    const wording = language === "sw" ? step.sw : step.en;

    stopTourSpeech();

    renderTourCharacter(step.character);

    tourElements.eyebrow.textContent =
      "WEBSITE TOUR";

    tourElements.title.textContent =
      wording.title;

    tourElements.description.textContent =
      wording.body;

    tourElements.tip.textContent =
      wording.tip;

    const stepNumber = currentStep + 1;
    const totalSteps = TOUR_STEPS.length;
    const percentage = Math.round(
      (stepNumber / totalSteps) * 100
    );

    tourElements.stepLabel.textContent =
      "Step " + stepNumber + " of " + totalSteps;

    tourElements.percent.textContent =
      percentage + "%";

    tourElements.progressValue.style.width =
      percentage + "%";

    tourElements.progressTrack.setAttribute(
      "aria-valuenow",
      String(percentage)
    );

    tourElements.back.disabled =
      currentStep === 0;

    tourElements.next.textContent =
      currentStep === totalSteps - 1
        ? "Finish"
        : "Next";

    tourElements.skip.textContent =
      "Skip tutorial";

    updateFocusedTarget(step);

    if (shouldSpeak) {
      speakTourText(
        wording.title + ". " + wording.body
      );
    }
  }


  /* ------------------------------------------------------------
     22. OPEN AND CLOSE THE TOUR
     ------------------------------------------------------------ */

  function openTour() {
    if (tourIsOpen) return;

    tourIsOpen = true;

    tourElements.root.classList.add("mb-tour-visible");

    tourElements.root.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";

    renderTourStep(0, true);

    tourElements.back.focus({
      preventScroll: true
    });
  }


  function closeTour(markAsSeen = true) {
    tourIsOpen = false;

    tourElements.root.classList.remove("mb-tour-visible");

    tourElements.root.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";

    stopTourSpeech();

    clearFocusedTarget();

    if (markAsSeen) {
      markTourSeen();
    }
  }


  function goToNextStep() {
    if (currentStep < TOUR_STEPS.length - 1) {
      renderTourStep(currentStep + 1, true);
      return;
    }

    closeTour(true);
  }


  function goToPreviousStep() {
    if (currentStep > 0) {
      renderTourStep(currentStep - 1, true);
    }
  }


  /* ------------------------------------------------------------
     23. TOUR CONTROLS
     ------------------------------------------------------------ */

  tourElements.next.addEventListener("click", () => {
    goToNextStep();
  });


  tourElements.back.addEventListener("click", () => {
    goToPreviousStep();
  });


  tourElements.skip.addEventListener("click", () => {
    closeTour(true);
  });


  tourRoot
    .querySelectorAll("[data-mb-tour-close]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        closeTour(true);
      });
    });


  document.addEventListener("keydown", (event) => {
    if (!tourIsOpen) return;

    if (event.key === "Escape") {
      closeTour(true);
    }

    if (event.key === "ArrowRight") {
      goToNextStep();
    }

    if (event.key === "ArrowLeft") {
      goToPreviousStep();
    }
  });


  /* ------------------------------------------------------------
     24. HOOK UP EXISTING TOUR BUTTONS
     ------------------------------------------------------------ */

  document.addEventListener("click", (event) => {
    const target = event.target;

    if (!target || typeof target.closest !== "function") {
      return;
    }

    const trigger = target.closest(TOUR_TRIGGER_SELECTOR);

    if (!trigger) return;

    event.preventDefault();

    openTour();
  });


  /* ------------------------------------------------------------
     25. ADD A TOUR BUTTON WHEN THE PAGE HAS NO TOUR BUTTON
     ------------------------------------------------------------ */

  function addFallbackTourButton() {
    if (document.querySelector(TOUR_TRIGGER_SELECTOR)) {
      return;
    }

    if (document.getElementById("mb-tour-help-button")) {
      return;
    }

    const button = document.createElement("button");

    button.type = "button";
    button.id = "mb-tour-help-button";
    button.className = "mb-tour-help-button";

    button.textContent = "Guide";

    button.setAttribute(
      "aria-label",
      "Open the MavunoBridge website tutorial"
    );

    button.addEventListener("click", openTour);

    document.body.appendChild(button);
  }


  /* ------------------------------------------------------------
     26. OPTIONAL AVATAR MOUNTS FOR SMART ASSIST

     These selectors target dedicated avatar containers only.

     Existing page features and text outside these containers
     are left alone.
     ------------------------------------------------------------ */

  const EXISTING_AVATAR_SELECTOR = [
    "[data-mavuno-avatar]",
    "[data-tour-avatar]",
    "#smartAssistantAvatar",
    "#smart-assistant-avatar",
    "#smartAssistAvatar",
    "#smart-assist-avatar",
    ".mavuno-assistant-avatar",
    ".smart-assistant-avatar",
    ".smart-assist-avatar",
    ".assistant-avatar",
    ".farmer-avatar"
  ].join(",");


  function chooseCharacterForElement(element) {
    const preferred =
      element.getAttribute("data-character") ||
      element.getAttribute("data-mavuno-avatar") ||
      element.getAttribute("data-avatar") ||
      "";

    const normalized = preferred.toLowerCase().trim();

    if (CHARACTERS[normalized]) {
      return normalized;
    }

    const identifyingText = (
      element.id + " " + element.className + " " + normalized
    ).toLowerCase();

    if (
      identifyingText.includes("sacco") ||
      identifyingText.includes("cooperative")
    ) {
      return "otieno";
    }

    if (
      identifyingText.includes("smart") ||
      identifyingText.includes("assist") ||
      identifyingText.includes("tech")
    ) {
      return "kamau";
    }

    if (
      identifyingText.includes("market") ||
      identifyingText.includes("buyer")
    ) {
      return "wanjiku";
    }

    return "akinyi";
  }


  function mountAvatarInto(element) {
    if (!(element instanceof HTMLElement)) return;

    if (element.tagName === "IMG" || element.tagName === "SVG") {
      return;
    }

    if (tourRoot.contains(element)) return;

    if (element.dataset.mbAvatarMounted === "true") {
      return;
    }

    /*
     * Only this avatar container is replaced. No surrounding
     * Smart Assist content or page layout is replaced.
     */
    const characterKey = chooseCharacterForElement(element);

    element.innerHTML = createAvatarSVG(characterKey);

    element.dataset.mbAvatarMounted = "true";

    element.classList.add("mb-avatar-mount");

    initializeAllAvatars();
  }


  function mountExistingAvatars() {
    let elements = [];

    try {
      elements = Array.from(
        document.querySelectorAll(EXISTING_AVATAR_SELECTOR)
      );
    } catch (error) {
      return;
    }

    elements.forEach(mountAvatarInto);
  }


  /* ------------------------------------------------------------
     27. WATCH FOR A SMART ASSIST AVATAR ADDED LATER

     If Smart Assist adds a dedicated avatar placeholder after
     page load, this tries to mount the cartoon in that spot.

     Already-mounted elements are ignored.
     ------------------------------------------------------------ */

  let avatarObserver = null;
  let observerQueued = false;

  function startAvatarObserver() {
    if (!("MutationObserver" in window)) return;

    if (!document.body) return;

    avatarObserver = new MutationObserver(() => {
      if (observerQueued) return;

      observerQueued = true;

      window.setTimeout(() => {
        observerQueued = false;

        mountExistingAvatars();

        initializeAllAvatars();
      }, 100);
    });

    avatarObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }


  /* ------------------------------------------------------------
     28. PUBLIC AVATAR API

     This lets other MavunoBridge scripts tell the characters
     when their own speech starts or finishes.

     Example:
       window.MavunoBridgeAvatars.startTalking();
       window.MavunoBridgeAvatars.stopTalking();
     ------------------------------------------------------------ */

  window.MavunoBridgeAvatars = {
    renderInto(element, characterKey = "akinyi") {
      if (typeof element === "string") {
        element = document.querySelector(element);
      }

      if (!(element instanceof HTMLElement)) {
        return false;
      }

      if (!CHARACTERS[characterKey]) {
        characterKey = "akinyi";
      }

      element.innerHTML = createAvatarSVG(characterKey);

      element.dataset.mbAvatarMounted = "true";

      element.classList.add("mb-avatar-mount");

      initializeAllAvatars();

      return true;
    },

    startTalking() {
      startMouthMovement();
    },

    stopTalking() {
      stopMouthMovement();
    },

    setCharacter(element, characterKey) {
      if (typeof element === "string") {
        element = document.querySelector(element);
      }

      return this.renderInto(element, characterKey);
    },

    listCharacters() {
      return Object.keys(CHARACTERS).map((key) => ({
        id: key,
        name: CHARACTERS[key].name,
        role: CHARACTERS[key].role
      }));
    }
  };


  /* ------------------------------------------------------------
     29. INITIALIZE
     ------------------------------------------------------------ */

  function initializeMavunoBridgeTour() {
    mountExistingAvatars();

    initializeAllAvatars();

    connectSpeechToAvatars();

    addFallbackTourButton();

    startAvatarObserver();

    /*
     * A new visitor sees the tutorial automatically once.
     * They can skip it. The Guide button remains available for
     * visitors who have already completed or skipped the tour.
     */
    if (!hasSeenTour()) {
      window.setTimeout(() => {
        if (!hasSeenTour()) {
          openTour();
        }
      }, 900);
    }
  }


  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeMavunoBridgeTour,
      { once: true }
    );
  } else {
    initializeMavunoBridgeTour();
  }

})();
