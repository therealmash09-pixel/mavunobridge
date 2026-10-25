
const MODEL = "gpt-4.1-mini";

const SYSTEM_PROMPT = `
You are MavunoBridge AI, an assistant inside a Kenyan agricultural marketplace.

Use friendly, simple English and light Kiswahili or Sheng when natural.
Help farmers and buyers navigate the site, find products, compare available
listings and understand agriculture.

Use only the supplied listing data for current product availability and prices.
Never invent products, seller details, stock, weather or market prices.

You can request only these website actions:
1. navigate: home, marketplace, smartAssist, community, messages
2. search_products: search the available marketplace
3. open_listing_form: open the listing form for the farmer
4. none: answer without an action

Never execute arbitrary JavaScript or URLs.
Never publish listings, send messages, purchase products or make payments.
The user must review and confirm any important changes.

Return valid JSON only:
{
  "reply": "Your helpful response",
  "action": {
    "type": "none",
    "destination": "",
    "query": "",
    "category": ""
  }
}

Allowed categories: fruits, vegetables, nuts, starchy, grains,
legumes, livestock, inputs.

Choose an action only when it clearly matches the user's request.
`;

const ALLOWED_DESTINATIONS = [
  "home", "marketplace", "smartAssist", "community", "messages"
];

const ALLOWED_CATEGORIES = [
  "fruits", "vegetables", "nuts", "starchy",
  "grains", "legumes", "livestock", "inputs"
];

function responseJSON(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Cache-Control": "no-store",
      "Vary": "Origin"
    }
  });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const allowedOrigin = env.ALLOWED_ORIGIN || "*";

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin":
            allowedOrigin === "*" ? origin || "*" : allowedOrigin,
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Vary": "Origin"
        }
      });
    }

    if (request.method !== "POST") {
      return responseJSON(
        { error: "Use POST to contact MavunoBridge AI." },
        405,
        allowedOrigin
      );
    }

    if (
      allowedOrigin !== "*" &&
      origin &&
      origin !== allowedOrigin
    ) {
      return responseJSON(
        { error: "This website is not authorised." },
        403,
        allowedOrigin
      );
    }

    if (!env.OPENAI_API_KEY) {
      return responseJSON(
        { error: "AI is not configured. Add the OPENAI_API_KEY secret." },
        503,
        allowedOrigin
      );
    }

    let body;

    try {
      body = await request.json();
    } catch {
      return responseJSON({ error: "Invalid JSON request." }, 400, allowedOrigin);
    }

    const message = String(body.message || "").trim().slice(0, 1200);

    if (!message) {
      return responseJSON({ error: "Enter a message first." }, 400, allowedOrigin);
    }

    const listings = Array.isArray(body.listings)
      ? body.listings.slice(0, 80).map(item => ({
          name: String(item.name || "").slice(0, 100),
          category: String(item.category || "").slice(0, 40),
          location: String(item.location || "").slice(0, 80),
          seller: String(item.seller || "").slice(0, 80),
          retailPrice: item.retailPrice ?? null,
          retailUnit: String(item.retailUnit || "unit").slice(0, 20),
          bulkPrice: item.bulkPrice ?? null,
          bulkUnit: String(item.bulkUnit || "unit").slice(0, 20),
          quantity: item.quantity ?? null,
          description: String(item.description || "").slice(0, 200)
        }))
      : [];

    const history = Array.isArray(body.history)
      ? body.history.slice(-8).map(item => ({
          role: item.role === "assistant" ? "assistant" : "user",
          content: String(item.content || "").slice(0, 700)
        }))
      : [];

    const input = [
      {
        role: "system",
        content:
          SYSTEM_PROMPT +
          "\nCurrent website page: " +
          String(body.page || "home").slice(0, 100) +
          "\nMarketplace listings supplied by the website: " +
          JSON.stringify(listings)
      },
      ...history,
      { role: "user", content: message }
    ];

    let apiResponse;

    try {
      apiResponse = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: MODEL,
          input,
          text: { format: { type: "json_object" } },
          max_output_tokens: 600,
          store: false
        })
      });
    } catch {
      return responseJSON(
        { error: "Could not reach the AI service. Try again." },
        502,
        allowedOrigin
      );
    }

    const result = await apiResponse.json().catch(() => ({}));

    if (!apiResponse.ok) {
      return responseJSON(
        { error: result.error?.message || "The AI request failed." },
        502,
        allowedOrigin
      );
    }

    const outputText = (result.output || [])
      .filter(item => item.type === "message")
      .flatMap(item => item.content || [])
      .filter(item => item.type === "output_text")
      .map(item => item.text)
      .join("");

    let parsed;

    try {
      parsed = JSON.parse(outputText);
    } catch {
      return responseJSON(
        { error: "The AI response could not be read. Try again." },
        502,
        allowedOrigin
      );
    }

    const action = parsed.action || {};
    const types = [
      "none", "navigate", "search_products", "open_listing_form"
    ];

    return responseJSON({
      reply: String(parsed.reply || "How can I help you?").slice(0, 1500),
      action: {
        type: types.includes(action.type) ? action.type : "none",
        destination: ALLOWED_DESTINATIONS.includes(action.destination)
          ? action.destination : "",
        query: String(action.query || "").slice(0, 100),
        category: ALLOWED_CATEGORIES.includes(action.category)
          ? action.category : ""
      }
    }, 200, allowedOrigin);
  }
};
