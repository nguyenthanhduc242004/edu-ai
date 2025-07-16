import { useEffect, useRef, useState } from 'react';

export default function ChatbotModal({ show, onClose, products }) {
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [isChatLoading, setIsChatLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Scroll to bottom of chat messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    const handleChatSubmit = async (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;

        const userMessage = { role: 'user', text: chatInput };
        setChatMessages((prev) => [...prev, userMessage]);
        setChatInput('');
        setIsChatLoading(true);

        try {
            const prompt = `Bạn là một trợ lý AI tư vấn khóa học và sản phẩm giáo dục. Dựa trên câu hỏi sau của người dùng, hãy gợi ý các khóa học hoặc sản phẩm phù hợp. Nếu có thể, hãy tham khảo các sản phẩm sau đây (nếu phù hợp): ${JSON.stringify(
                products.map((p) => ({ id: p.id, name: p.name, shortDescription: p.shortDescription })),
            )}. Nếu không có sản phẩm nào phù hợp, hãy đưa ra gợi ý chung hoặc ý tưởng sản phẩm mới. Trả lời bằng tiếng Việt.
      
      Câu hỏi của người dùng: "${chatInput}"`;

            let chatHistory = [];
            chatHistory.push({ role: 'user', parts: [{ text: prompt }] });
            const payload = { contents: chatHistory };
            const apiKey = ''; // Leave this as-is. Canvas will provide the key.
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (
                result.candidates &&
                result.candidates.length > 0 &&
                result.candidates[0].content &&
                result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0
            ) {
                const aiResponseText = result.candidates[0].content.parts[0].text;
                setChatMessages((prev) => [...prev, { role: 'ai', text: aiResponseText }]);
            } else {
                setChatMessages((prev) => [
                    ...prev,
                    { role: 'ai', text: 'Xin lỗi, tôi không thể tạo ra phản hồi lúc này. Vui lòng thử lại.' },
                ]);
            }
        } catch (error) {
            console.error('Error calling Gemini API for chatbot:', error);
            setChatMessages((prev) => [
                ...prev,
                { role: 'ai', text: 'Đã xảy ra lỗi khi kết nối với AI. Vui lòng thử lại sau.' },
            ]);
        } finally {
            setIsChatLoading(false);
        }
    };

    if (!show) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl shadow-2xl max-w-lg w-full h-[80vh] flex flex-col transform transition-all duration-300 scale-100 opacity-100"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800">Chatbot AI Tư vấn</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 focus:outline-none">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="flex-grow p-4 overflow-y-auto bg-gray-50">
                    {chatMessages.length === 0 && (
                        <p className="text-gray-500 text-center mt-4">Chào bạn! Tôi có thể giúp gì cho bạn hôm nay?</p>
                    )}
                    {chatMessages.map((msg, index) => (
                        <div
                            key={index}
                            className={`mb-3 p-3 rounded-lg max-w-[80%] ${
                                msg.role === 'user'
                                    ? 'bg-blue-500 text-white ml-auto rounded-br-none'
                                    : 'bg-gray-200 text-gray-800 mr-auto rounded-bl-none'
                            }`}
                        >
                            {msg.text}
                        </div>
                    ))}
                    {isChatLoading && (
                        <div className="mb-3 p-3 rounded-lg max-w-[80%] bg-gray-200 text-gray-800 mr-auto rounded-bl-none animate-pulse">
                            Đang gõ...
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleChatSubmit} className="p-4 border-t border-gray-200 flex">
                    <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Nhập tin nhắn của bạn..."
                        className="flex-grow p-2 rounded-l-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                        disabled={isChatLoading}
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        disabled={isChatLoading}
                    >
                        Gửi
                    </button>
                </form>
            </div>
        </div>
    );
}
