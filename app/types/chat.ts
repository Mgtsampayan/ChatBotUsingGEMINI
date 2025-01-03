export interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

export interface ChatResponse {
    message: string;
    status?: 'success' | 'error'; // Backend might not always send status
}