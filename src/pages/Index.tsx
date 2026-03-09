import { useState } from 'react';
import Sidebar from '@/components/messenger/Sidebar';
import ChatList from '@/components/messenger/ChatList';
import ChatWindow from '@/components/messenger/ChatWindow';
import ContactsPanel from '@/components/messenger/ContactsPanel';
import NotificationsPanel from '@/components/messenger/NotificationsPanel';
import SearchPanel from '@/components/messenger/SearchPanel';
import ProfilePanel from '@/components/messenger/ProfilePanel';
import SettingsPanel from '@/components/messenger/SettingsPanel';
import CallModal from '@/components/messenger/CallModal';
import { chats, notifications } from '@/components/messenger/data';

type Tab = 'chats' | 'contacts' | 'notifications' | 'search' | 'profile' | 'settings';

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>('chats');
  const [activeChatId, setActiveChatId] = useState<string | null>('c1');
  const [callState, setCallState] = useState<{ type: 'audio' | 'video'; contactId: string } | null>(null);

  const unreadChats = chats.reduce((sum, c) => sum + c.unread, 0);
  const unreadNotifications = notifications.filter(n => !n.read).length;

  const handleContactSelect = (contactId: string) => {
    const chat = chats.find(c => c.contactId === contactId);
    if (chat) {
      setActiveChatId(chat.id);
      setActiveTab('chats');
    }
  };

  const renderLeftPanel = () => {
    if (activeTab === 'chats') {
      return (
        <ChatList
          activeChatId={activeChatId}
          onChatSelect={(id) => setActiveChatId(id)}
        />
      );
    }
    if (activeTab === 'contacts') {
      return (
        <ContactsPanel
          onCall={(type, id) => setCallState({ type, contactId: id })}
          onMessage={handleContactSelect}
        />
      );
    }
    if (activeTab === 'notifications') return <NotificationsPanel />;
    if (activeTab === 'search') {
      return (
        <SearchPanel
          onChatSelect={(id) => { setActiveChatId(id); setActiveTab('chats'); }}
          onContactSelect={handleContactSelect}
        />
      );
    }
    if (activeTab === 'profile') return <ProfilePanel />;
    if (activeTab === 'settings') return <SettingsPanel />;
    return null;
  };

  const showChatWindow = activeTab === 'chats';
  const isFullWidth = ['notifications', 'profile', 'settings', 'search'].includes(activeTab);

  return (
    <div className="flex h-screen w-screen overflow-hidden mesh-bg">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        unreadChats={unreadChats}
        unreadNotifications={unreadNotifications}
      />

      <div className="flex flex-1 overflow-hidden">
        <div className={`flex flex-col border-r border-white/5 bg-background/40 backdrop-blur-sm overflow-hidden transition-all duration-300 ${
          showChatWindow ? 'w-72 flex-shrink-0' :
          activeTab === 'contacts' ? 'flex-1' :
          isFullWidth ? 'w-full max-w-2xl' : 'flex-1'
        }`}>
          {renderLeftPanel()}
        </div>

        {showChatWindow && (
          <div className="flex-1 flex overflow-hidden">
            <ChatWindow
              chatId={activeChatId}
              onCall={(type, id) => setCallState({ type, contactId: id })}
            />
          </div>
        )}
      </div>

      {callState && (
        <CallModal
          type={callState.type}
          contactId={callState.contactId}
          onClose={() => setCallState(null)}
        />
      )}
    </div>
  );
};

export default Index;
