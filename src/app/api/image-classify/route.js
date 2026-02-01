export async function POST(req) {
  try {
    const { imageBase64 } = await req.json();

    if (!process.env.HF_TOKEN) {
      return Response.json(
        { error: 'HF_TOKEN not set' },
        { status: 500 }
      );
    }

    const base64Image = imageBase64.split(',')[1];

    const response = await fetch(
      'https://router.huggingface.co/hf-inference/models/google/vit-base-patch16-224',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: base64Image,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('HF image classify error:', errorText);
      return Response.json(
        { error: 'Image classification failed' },
        { status: response.status }
      );
    }

    const data = await response.json();

    const label = data?.[0]?.label?.toLowerCase() ?? null;

    return Response.json({ label });
  } catch (err) {
    console.error('Image classify route error:', err);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
