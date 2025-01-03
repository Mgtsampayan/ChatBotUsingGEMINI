interface ErrorMessageProps {
    message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
    return (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
            {message}
        </div>
    );
}