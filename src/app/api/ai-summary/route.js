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
              content:
                'You explain workplace safety equipment clearly and concisely.',
            },
            {
              role: 'user',
              content: `Explain what a ${objectName} is and how it is used in workplace safety training. Keep it under 3 sentences.`,
            },
          ],
          temperature: 0.7,
          max_tokens: 120,
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

    const summary =
      data?.choices?.[0]?.message?.content?.trim() ??
      'No summary available.';

    return Response.json({ summary });
  } catch (err) {
    console.error('AI summary error:', err);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
