export async function POST(req) {
  try {
    const { objectName } = await req.json();

    if (!process.env.GROQ_API_KEY) {
      return Response.json(
        { error: 'GROQ_API_KEY not set' },
        { status: 500 }
      );
    }

    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            {
              role: 'system',
              content: `
                You are a workplace safety assistant.

                Your task:
                1. Classify the object into ONE of these keys only:
                  - fire_extinguisher
                  - drill
                  - toolbox
                  - wet_floor_sign
                  - measuring_tape
                  - unsupported

                2. Provide a short educational summary (max 3 sentences).

                Return ONLY valid JSON in this format:
                {
                  "assetKey": "...",
                  "summary": "..."
                }
                `,
            },
            {
              role: 'user',
              content: objectName,
            },
          ],
          temperature: 0.3,
          max_tokens: 150,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error:', errorText);
      return Response.json(
        { error: 'AI request failed' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const raw = data?.choices?.[0]?.message?.content;

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = {
        assetKey: 'unsupported',
        summary: 'No summary available.',
      };
    }

    return Response.json(parsed);
  } catch (err) {
    console.error('AI summary error:', err);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
