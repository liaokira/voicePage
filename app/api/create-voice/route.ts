import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { apiKey, apiVersion, voices } = body;

    if (!apiKey || !apiVersion || !voices || !Array.isArray(voices) || voices.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Step 1: Mix voices to get embedding
    const mixResponse = await fetch('https://api.cartesia.ai/voices/mix', {
      method: 'POST',
      headers: {
        'X-API-Key': apiKey,
        'Cartesia-Version': apiVersion,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ voices }),
    });

    if (!mixResponse.ok) {
      const errorText = await mixResponse.text();
      let errorMessage = `Mix API error: ${mixResponse.statusText}`;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error?.message || errorData.message || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }
      return NextResponse.json(
        { error: errorMessage },
        { status: mixResponse.status }
      );
    }

    const mixData = await mixResponse.json();
    const embedding = mixData.embedding;

    if (!embedding || !Array.isArray(embedding)) {
      return NextResponse.json(
        { error: 'Invalid embedding received from mix API' },
        { status: 500 }
      );
    }

    // Step 2: Create voice from embedding
    // According to Cartesia's \"Create Voice\" docs, the body should include
    // at least: name, description, language, and embedding.
    const createBody = {
      name: body.name ?? 'Mixed Voice',
      description: body.description ?? 'A voice created by mixing multiple voices',
      language: body.language ?? 'en',
      embedding,
    };

    const createResponse = await fetch('https://api.cartesia.ai/voices', {
      method: 'POST',
      headers: {
        'X-API-Key': apiKey,
        'Cartesia-Version': apiVersion,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(createBody),
    });

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      let errorMessage = `Create API error: ${createResponse.statusText}`;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error?.message || errorData.message || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }
      return NextResponse.json(
        { error: errorMessage },
        { status: createResponse.status }
      );
    }

    const createData = await createResponse.json();
    const voiceId = createData.id || createData.voice_id;

    if (!voiceId) {
      return NextResponse.json(
        { error: 'No voice ID returned from create API' },
        { status: 500 }
      );
    }

    return NextResponse.json({ voiceId });
  } catch (error: any) {
    console.error('Error creating voice:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

