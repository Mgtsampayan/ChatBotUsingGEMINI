import { Message } from '../types/chat';

interface ChatMessageProps {
    message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
    return (
        <div
            className={`mb-4 p-3 rounded-lg max-w-[80%] ${message.sender === 'user'
                    ? 'ml-auto bg-blue-500 text-white'
                    : 'mr-auto bg-gray-100 text-gray-800'
                }`}
        >
            <p className="break-words">{message.text}</p>
            <span className="text-xs opacity-75 mt-1 block">
                {new Date(message.timestamp).toLocaleTimeString()}
            </span>
        </div>
    );
}