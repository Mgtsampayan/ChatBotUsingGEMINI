export class ChatError extends Error {
    constructor(
        message: string,
        public statusCode: number = 500
    ) {
        super(message);
        this.name = 'ChatError';
    }
}

export async function sendChatMessage(message: string) {
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new ChatError(
                data.error || 'Failed to send message',
                response.status
            );
        }

        return data;
    } catch (error) {
        if (error instanceof ChatError) {
            throw error;
        }

        if (error instanceof TypeError && error.message === 'Failed to fetch') {
            throw new ChatError('Network error. Please check your connection.', 503);
        }

        throw new ChatError('An unexpected error occurred', 500);
    }
}