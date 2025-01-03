export default function LoadingDots() {
    return (
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-150" />
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-300" />
        </div>
    );
}