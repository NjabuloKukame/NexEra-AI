export async function POST(req) {
  try {
    const { imageBase64 } = await req.json();

    if (!process.env.IMAGGA_KEY || !process.env.IMAGGA_SECRET) {
      return Response.json({ error: 'Imagga credentials not set' }, { status: 500 });
    }

    const credentials = `${process.env.IMAGGA_KEY}:${process.env.IMAGGA_SECRET}`;
    const encodedCredentials = Buffer.from(credentials).toString('base64');

    const base64Image = imageBase64.split(',')[1];

    const formData = new FormData();
    formData.append('image_base64', base64Image);

    const response = await fetch("https://api.imagga.com/v2/tags", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${encodedCredentials}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Imagga Error:', errorData);
      return Response.json({ error: 'Identification failed' }, { status: response.status });
    }

    const data = await response.json();
    
    const label = data?.result?.tags[0]?.tag?.en?.toLowerCase() ?? null;

    return Response.json({ label });
  } catch (err) {
    console.error('Route error:', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}