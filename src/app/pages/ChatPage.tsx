'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { ArrowLeft, Search, Send } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { ScrollArea } from '../components/ui/scroll-area';
import { useApp } from '../context/AppContext';
import { format } from 'date-fns';

export function ChatPage() {
  const router = useRouter();
  const params = useParams();
  const userId = Array.isArray(params.userId) ? params.userId[0] : params.userId;
  const { conversations, messages, sendMessage, user } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [messageText, setMessageText] = useState('');

  const selectedConversation = userId
    ? conversations.find(c => c.userId === userId)
    : null;

  const conversationMessages = messages.filter(
    m => (m.senderId === userId && m.receiverId === user?.id) ||
         (m.senderId === user?.id && m.receiverId === userId)
  );

  const filteredConversations = conversations.filter(c =>
    c.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (messageText.trim() && userId) {
      sendMessage(userId, messageText);
      setMessageText('');
    }
  };

  if (userId && selectedConversation) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white border-b">
          <div className="max-w-2xl mx-auto px-4 py-3">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.push('/chat')}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <Avatar className="w-10 h-10">
                <AvatarImage src={selectedConversation.userAvatar} />
                <AvatarFallback>{selectedConversation.userName[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="font-semibold">{selectedConversation.userName}</h1>
              </div>
            </div>
          </div>
        </header>

        <ScrollArea className="flex-1 max-w-2xl w-full mx-auto px-4 py-6">
          <div className="space-y-4">
            {conversationMessages.length > 0 ? (
              conversationMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg px-4 py-2 ${
                      msg.senderId === user?.id
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                        : 'bg-white'
                    }`}
                  >
                    <p>{msg.message}</p>
                    <span className={`text-xs ${msg.senderId === user?.id ? 'text-purple-100' : 'text-gray-500'}`}>
                      {format(msg.timestamp, 'h:mm a')}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>No messages yet. Start the conversation!</p>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="bg-white border-t">
          <div className="max-w-2xl mx-auto px-4 py-3">
            <div className="flex gap-2">
              <Input
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type a message..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button
                onClick={handleSendMessage}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push('/home')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-semibold">Messages</h1>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="space-y-2">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.userId}
                onClick={() => router.push(`/chat/${conversation.userId}`)}
                className="bg-white p-4 rounded-lg cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={conversation.userAvatar} />
                    <AvatarFallback>{conversation.userName[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold truncate">{conversation.userName}</h3>
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                        {format(conversation.lastMessageTime, 'h:mm a')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                  </div>
                  {conversation.unreadCount > 0 && (
                    <div className="bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {conversation.unreadCount}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No conversations yet</p>
              <p className="text-sm text-gray-400 mt-2">Start chatting with barbers and stylists</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
