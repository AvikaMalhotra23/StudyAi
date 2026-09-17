import React, { useState, useEffect, useRef } from 'react';
import { StudentUser } from '../types';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from '../utils/firebase';
import { 
  X, 
  Send, 
  Paperclip, 
  FileText, 
  Link as LinkIcon,
  MessageSquare,
  FolderOpen
} from 'lucide-react';

interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

interface SharedResource {
  id: string;
  title: string;
  type: 'link' | 'document';
  url: string;
  addedBy: string;
}

interface StudyWorkspaceModalProps {
  currentUser: StudentUser;
  buddy: StudentUser;
  onClose: () => void;
}

export const StudyWorkspaceModal: React.FC<StudyWorkspaceModalProps> = ({
  currentUser,
  buddy,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'resources'>('chat');
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [resources, setResources] = useState<SharedResource[]>([]);
  
  const [newResourceTitle, setNewResourceTitle] = useState('');
  const [newResourceUrl, setNewResourceUrl] = useState('');
  const [newResourceType, setNewResourceType] = useState<'link' | 'document'>('link');
  const [isAddingResource, setIsAddingResource] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Generate a unique workspace ID for these two users
  const workspaceId = `workspace_${[currentUser.id, buddy.id].sort().join('_')}`;

  useEffect(() => {
    // Listen to messages
    const messagesRef = collection(db, 'workspaces', workspaceId, 'messages');
    const qMessages = query(messagesRef, orderBy('timestamp', 'asc'));
    const unsubMessages = onSnapshot(qMessages, (snapshot) => {
      const msgs = snapshot.docs.map(doc => doc.data() as ChatMessage);
      setMessages(msgs);
    });

    // Listen to resources
    const resourcesRef = collection(db, 'workspaces', workspaceId, 'resources');
    const unsubResources = onSnapshot(resourcesRef, (snapshot) => {
      const res = snapshot.docs.map(doc => doc.data() as SharedResource);
      setResources(res);
    });

    return () => {
      unsubMessages();
      unsubResources();
    };
  }, [workspaceId]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeTab]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      text: messageText.trim(),
      timestamp: new Date().toISOString()
    };

    setMessageText('');
    
    // Save to Firestore
    setDoc(doc(db, 'workspaces', workspaceId, 'messages', newMessage.id), newMessage)
      .catch(e => console.error('Error saving message', e));
  };

  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResourceTitle.trim() || !newResourceUrl.trim()) return;

    const newRes: SharedResource = {
      id: Date.now().toString(),
      title: newResourceTitle.trim(),
      type: newResourceType,
      url: newResourceUrl.trim(),
      addedBy: currentUser.id
    };

    setNewResourceTitle('');
    setNewResourceUrl('');
    setIsAddingResource(false);

    // Save to Firestore
    setDoc(doc(db, 'workspaces', workspaceId, 'resources', newRes.id), newRes)
      .catch(e => console.error('Error saving resource', e));
  };

  const formatTime = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img src={buddy.avatar} alt={buddy.name} className="w-12 h-12 rounded-xl object-cover ring-2 ring-indigo-500/30" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full"></div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                {buddy.name}
                <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] uppercase font-bold tracking-wider">
                  Study Group
                </span>
              </h2>
              <p className="text-sm text-slate-400 font-medium">Targeting {buddy.target_exam}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 px-6">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'chat' 
                ? 'border-indigo-500 text-indigo-400' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Discussion
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'resources' 
                ? 'border-indigo-500 text-indigo-400' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            Shared Resources ({resources.length})
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative">
          
          {/* Chat View */}
          {activeTab === 'chat' && (
            <div className="absolute inset-0 flex flex-col bg-slate-950/50">
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
                    <MessageSquare className="w-12 h-12 text-slate-500 mb-4" />
                    <p className="text-slate-300 font-medium">No messages yet.</p>
                    <p className="text-slate-500 text-sm mt-1">Say hi to start collaborating with {buddy.name}!</p>
                  </div>
                ) : (
                  messages.map(msg => {
                    const isMe = msg.senderId === currentUser.id;
                    return (
                      <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                          isMe 
                            ? 'bg-indigo-600 text-white rounded-tr-sm' 
                            : 'bg-slate-800 text-slate-200 rounded-tl-sm'
                        }`}>
                          <p className="text-sm">{msg.text}</p>
                          <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-indigo-200' : 'text-slate-400'}`}>
                            {formatTime(msg.timestamp)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>
              
              <div className="p-4 bg-slate-900 border-t border-slate-800">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition placeholder-slate-500"
                  />
                  <button
                    type="submit"
                    disabled={!messageText.trim()}
                    className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white rounded-xl px-5 py-3 transition flex items-center justify-center"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Resources View */}
          {activeTab === 'resources' && (
            <div className="absolute inset-0 flex flex-col bg-slate-950/50 p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">Shared Workspace Resources</h3>
                <button
                  onClick={() => setIsAddingResource(!isAddingResource)}
                  className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                >
                  {isAddingResource ? 'Cancel' : '+ Add Resource'}
                </button>
              </div>

              {isAddingResource && (
                <form onSubmit={handleAddResource} className="bg-slate-900 border border-indigo-500/30 rounded-xl p-4 mb-6 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Resource Title</label>
                    <input 
                      type="text" 
                      value={newResourceTitle}
                      onChange={e => setNewResourceTitle(e.target.value)}
                      placeholder="e.g. HC Verma Solutions PDF"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">URL / Link</label>
                    <input 
                      type="url" 
                      value={newResourceUrl}
                      onChange={e => setNewResourceUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                        <input 
                          type="radio" 
                          name="resourceType" 
                          checked={newResourceType === 'link'} 
                          onChange={() => setNewResourceType('link')}
                          className="accent-indigo-500"
                        />
                        <LinkIcon className="w-4 h-4 text-slate-400" /> Web Link
                      </label>
                      <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                        <input 
                          type="radio" 
                          name="resourceType" 
                          checked={newResourceType === 'document'} 
                          onChange={() => setNewResourceType('document')}
                          className="accent-indigo-500"
                        />
                        <FileText className="w-4 h-4 text-slate-400" /> Document / Drive
                      </label>
                    </div>
                    <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-lg text-sm font-bold transition">
                      Save Resource
                    </button>
                  </div>
                </form>
              )}

              {resources.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-16 opacity-60">
                  <FolderOpen className="w-16 h-16 text-slate-600 mb-4" />
                  <p className="text-slate-300 font-medium text-lg">No shared resources</p>
                  <p className="text-slate-500 text-sm mt-2 max-w-sm mx-auto">
                    Share links to study materials, syllabus PDFs, or drive folders to collaborate effectively.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {resources.map(res => (
                    <a 
                      key={res.id} 
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-xl p-4 flex items-start gap-4 transition group"
                    >
                      <div className="bg-slate-800 p-3 rounded-lg group-hover:bg-slate-700 transition">
                        {res.type === 'document' ? (
                          <FileText className="w-6 h-6 text-indigo-400" />
                        ) : (
                          <LinkIcon className="w-6 h-6 text-emerald-400" />
                        )}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <h4 className="font-bold text-white truncate">{res.title}</h4>
                        <p className="text-xs text-slate-500 mt-1 truncate">{res.url}</p>
                        <p className="text-[10px] text-slate-600 mt-2 font-medium">
                          Added by {res.addedBy === currentUser.id ? 'You' : buddy.name}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
