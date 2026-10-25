/*
 * MAVUNOBRIDGE OPTIONAL AI WORKER
 *
 * Before using:
 * 1. Deploy this file as a Cloudflare Worker.
 * 2. Add OPENAI_API_KEY as a Worker secret.
 * 3. Configure the allowed website origin.
 * 4. Put the deployed Worker URL in ai-config.js.
 *
 * Never expose the API key in browser code.
 */

export default {
  async fetch(request, env) {
    const allowedOrigin = env.ALLOWED_ORIGIN || "";

    const requestOrigin = request.headers.get("Origin") || "";

    const headers = {
      "Access-Control-Allow-Origin":
        allowedOrigin && requestOrigin === allowedOrigin
          ? allowedOrigin
          : "null",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json; charset=utf-8",
      "Vary": "Origin"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers });
    }

    if (allowedOrigin && requestOrigin !== allowedOrigin) {
      return new Response(
        JSON.stringify({ error: "Origin not allowed." }),
        { status: 403, headers }
      );
    }

    if (request.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Use POST." }),
        { status: 405, headers }
      );
    }

    if (!env.OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({
          error: "AI is not configured. Use the offline Smart Assist demo."
        }),
        { status: 503, headers }
      );
    }

    try {
      const body = await request.json();
      const question = String(body.question || "").trim().slice(0, 4000);

      if (!question) {
        return new Response(
          JSON.stringify({ error: "Please enter a question." }),
          { status: 400, headers }
        );
      }

      const response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-4.1-mini",
          instructions:
            "You are MavunoBridge, an agricultural information assistant for Kenyan farmers. " +
            "Use clear, practical English and light Kiswahili when helpful. " +
            "State uncertainty. Do not claim to know live weather, current pest outbreaks, " +
            "or current market prices unless the information is provided. " +
            "For crop disease or pest problems, suggest safe observation steps and recommend " +
            "local agricultural extension advice before pesticide use. Never recommend mixing chemicals. " +
            "Keep answers concise.",
          input: question,
          max_output_tokens: 650
        })
      });

      if (!response.ok) {
        return new Response(
          JSON.stringify({ error: "The AI provider request failed." }),
          { status: 502, headers }
        );
      }

      const data = await response.json();

      let answer = "";

      for (const item of data.output || []) {
        for (const content of item.content || []) {
          if (content.type === "output_text") {
            answer += content.text;
          }
        }
      }

      return new Response(
        JSON.stringify({
          answer: answer || "Sorry, I could not create a reply."
        }),
        { status: 200, headers }
      );
    } catch {
      return new Response(
        JSON.stringify({ error: "The request could not be processed." }),
        { status: 400, headers }
      );
    }
  }
};
