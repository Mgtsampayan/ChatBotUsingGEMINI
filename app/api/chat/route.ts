import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

if (!GOOGLE_API_KEY) {
    throw new Error('GOOGLE_API_KEY is not defined in environment variables');
}

const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        if (!body?.message || typeof body.message !== 'string') {
            return NextResponse.json(
                {
                    status: 'error',
                    error: 'Message is required and must be a string'
                },
                { status: 400 }
            );
        }

        const message = body.message.trim();

        if (!message) {
            return NextResponse.json(
                {
                    status: 'error',
                    error: 'Message cannot be empty'
                },
                { status: 400 }
            );
        }

        const chat = await model.startChat({
            safetySettings: [
                {
                    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
            ],
        });

        const result = await chat.sendMessage(message);

        if (!result.response) {
            throw new Error('No response received from AI model');
        }

        return NextResponse.json({
            status: 'success',
            message: result.response.text(),
        });

    } catch (error: unknown) {
        console.error('API Error:', error);

        if (error instanceof Error && error.message.includes('API key')) {
            return NextResponse.json(
                {
                    status: 'error',
                    error: 'Invalid API key configuration'
                },
                { status: 401 }
            );
        }

        if (error instanceof Error && error.message.includes('Rate limit')) {
            return NextResponse.json(
                {
                    status: 'error',
                    error: 'Too many requests. Please try again later.'
                },
                { status: 429 }
            );
        }

        return NextResponse.json(
            {
                status: 'error',
                error: 'An unexpected error occurred'
            },
            { status: 500 }
        );
    }
}
