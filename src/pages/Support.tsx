import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Send, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import type {Message,Department,ChatTicket} from '../types/index'


const Support: React.FC = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [tickets, setTickets] = useState<ChatTicket[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedTicket, setSelectedTicket] = useState<string>('');
  const [newMessage, setNewMessage] = useState('');

  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchDepartments();
    fetchTickets();
  }, []);

  useEffect(() => {
    if (selectedTicket) {
      fetchMessages(selectedTicket);
    }
  }, [selectedTicket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchDepartments = async () => {
    try {
      const response = await fetch('http://localhost:3001/supportDepartments');
      const data = await response.json();
      setDepartments(data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchTickets = async () => {
    try {
      const response = await fetch('http://localhost:3001/chatTickets?userId=1');
      const data = await response.json();
      setTickets(data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  const fetchMessages = async (ticketId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/chatMessages?ticketId=${ticketId}`);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedTicket) return;

    const message: Message = {
      id: Date.now().toString(),
      ticketId: selectedTicket,
      userId: '1',
      departmentId: selectedDepartment,
      sender: 'user',
      message: newMessage,
      timestamp: new Date().toISOString(),
      status: 'sent',
    };

    try {
      const response = await fetch('http://localhost:3001/chatMessages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message),
      });

      if (response.ok) {
        setMessages([...messages, message]);
        setNewMessage('');
        
        // Update ticket last activity
        const updatedTickets = tickets.map(ticket =>
          ticket.id === selectedTicket
            ? { ...ticket, lastActivity: new Date().toISOString() }
            : ticket
        );
        setTickets(updatedTickets);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'closed':
        return <CheckCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const selectedDept = departments.find(dept => dept.id === selectedDepartment);
  const selectedTicketData = tickets.find(ticket => ticket.id === selectedTicket);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Support Center</h1>
          <p className="text-gray-600">Get help from our support team</p>
        </div>
        <Button 
          onClick={() => navigate('/dashboard/support/create-ticket')}
          className="bg-green-600 hover:bg-green-700"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          New Support Ticket
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Departments & Tickets */}
        <div className="lg:col-span-1 space-y-4">
          {/* Departments */}
          <Card className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Departments</h3>
            <div className="space-y-2">
              {departments.map((dept) => (
                <button
                  key={dept.id}
                  onClick={() => setSelectedDepartment(dept.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedDepartment === dept.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{dept.name}</span>
                    <span className={`w-2 h-2 rounded-full ${
                      dept.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                    }`} />
                  </div>
                  <p className="text-xs text-gray-600 mb-1">{dept.description}</p>
                  <p className="text-xs text-gray-500">
                    <Clock className="w-3 h-3 inline mr-1" />
                    {dept.responseTime}
                  </p>
                </button>
              ))}
            </div>
          </Card>

          {/* My Tickets */}
          <Card className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3">My Tickets</h3>
            <div className="space-y-2">
              {tickets.map((ticket) => (
                <button
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedTicket === ticket.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm truncate">{ticket.subject}</span>
                    {getStatusIcon(ticket.status)}
                  </div>
                  <p className="text-xs text-gray-600">{ticket.id}</p>
                  <p className="text-xs text-gray-500">
                    {formatTime(ticket.lastActivity)}
                  </p>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-3">
          <Card className="h-[600px] flex flex-col">
            {selectedTicket ? (
              <>
                {/* Chat Header */}
                <div className="border-b border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {selectedTicketData?.subject}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {selectedDept?.name} • Ticket {selectedTicketData?.id}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(selectedTicketData?.status || '')}
                      <span className="text-sm font-medium capitalize">
                        {selectedTicketData?.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender === 'user'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        {message.sender === 'agent' && (
                          <p className="text-xs font-medium mb-1">
                            {message.agentName || 'Support Agent'}
                          </p>
                        )}
                        <p className="text-sm">{message.message}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'user' ? 'text-green-100' : 'text-gray-500'
                        }`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="border-t border-gray-200 p-4">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Type your message..."
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Select a ticket to start chatting
                  </h3>
                  <p className="text-gray-600">
                    Choose an existing ticket or create a new one
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

     
    </div>
  );
};

export default Support;
