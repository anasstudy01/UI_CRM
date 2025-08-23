import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import type{Message,Ticket,User,Department} from '../types/index';
import { 
  MessageCircle, 
  Clock, 
 
  Send, 
  Filter,
  CheckCircle,
  AlertCircle,
  Inbox,
  UserCheck
} from 'lucide-react';




const AdminSupport: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [ticketMessages, setTicketMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [loading, setLoading] = useState(true);
  const [agentName] = useState('Admin Agent'); // This would come from agent auth

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedTicket) {
      fetchTicketMessages(selectedTicket.id);
    }
  }, [selectedTicket]);

  const fetchData = async () => {
    try {
      const [ticketsRes, departmentsRes, usersRes] = await Promise.all([
        fetch('http://localhost:3001/chatTickets'),
        fetch('http://localhost:3001/supportDepartments'),
        fetch('http://localhost:3001/users')
      ]);

      const [ticketsData, departmentsData, usersData] = await Promise.all([
        ticketsRes.json(),
        departmentsRes.json(),
        usersRes.json()
      ]);

      setTickets(ticketsData);
      setDepartments(departmentsData);
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTicketMessages = async (ticketId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/chatMessages?ticketId=${ticketId}`);
      const data = await response.json();
      setTicketMessages(data.sort((a: Message, b: Message) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      ));
    } catch (error) {
      console.error('Error fetching ticket messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedTicket) return;

    const messageData = {
      id: Date.now().toString(),
      ticketId: selectedTicket.id,
      userId: selectedTicket.userId,
      departmentId: selectedTicket.departmentId,
      sender: 'agent',
      agentName: agentName,
      message: newMessage.trim(),
      timestamp: new Date().toISOString(),
      status: 'delivered'
    };

    try {
      await fetch('http://localhost:3001/chatMessages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData)
      });

      // Update ticket's last activity
      await fetch(`http://localhost:3001/chatTickets/${selectedTicket.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lastActivity: new Date().toISOString(),
          assignedAgent: agentName
        })
      });

      setNewMessage('');
      fetchTicketMessages(selectedTicket.id);
      fetchData(); // Refresh tickets list
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const updateTicketStatus = async (ticketId: string, status: string) => {
    try {
      await fetch(`http://localhost:3001/chatTickets/${ticketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      fetchData();
    } catch (error) {
      console.error('Error updating ticket status:', error);
    }
  };

  const assignTicket = async (ticketId: string, agent: string) => {
    try {
      await fetch(`http://localhost:3001/chatTickets/${ticketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignedAgent: agent })
      });
      fetchData();
    } catch (error) {
      console.error('Error assigning ticket:', error);
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const statusMatch = filterStatus === 'all' || ticket.status === filterStatus;
    const departmentMatch = filterDepartment === 'all' || ticket.departmentId === filterDepartment;
    return statusMatch && departmentMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-green-600 bg-green-100';
      case 'in-progress': return 'text-yellow-600 bg-yellow-100';
      case 'closed': return 'text-gray-600 bg-gray-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? `${user.firstName} ${user.lastName}` : 'Unknown User';
  };

  const getDepartmentName = (departmentId: string) => {
    const department = departments.find(d => d.id === departmentId);
    return department ? department.name : 'Unknown Department';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading support dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Support Dashboard</h1>
        <p className="text-gray-600">Manage and respond to customer support tickets</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center">
            <Inbox className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total Tickets</p>
              <p className="text-2xl font-bold">{tickets.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <AlertCircle className="h-8 w-8 text-yellow-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Open Tickets</p>
              <p className="text-2xl font-bold">{tickets.filter(t => t.status === 'open').length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold">{tickets.filter(t => t.status === 'in-progress').length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Closed Today</p>
              <p className="text-2xl font-bold">{tickets.filter(t => 
                t.status === 'closed' && 
                new Date(t.lastActivity).toDateString() === new Date().toDateString()
              ).length}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tickets List */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center">
              <MessageCircle className="mr-2 h-5 w-5" />
              Support Tickets
            </h2>
            <Filter className="h-4 w-4 text-gray-400" />
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-4">
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1 border rounded-md text-sm"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="closed">Closed</option>
            </select>
            <select 
              value={filterDepartment} 
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="px-3 py-1 border rounded-md text-sm"
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredTickets.map(ticket => (
              <div 
                key={ticket.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedTicket?.id === ticket.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedTicket(ticket)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="font-medium text-sm text-gray-900 truncate">{ticket.subject}</p>
                    <p className="text-xs text-gray-600">By: {getUserName(ticket.userId)}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{getDepartmentName(ticket.departmentId)}</span>
                  <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                </div>
                {ticket.assignedAgent && (
                  <div className="flex items-center mt-1 text-xs text-blue-600">
                    <UserCheck className="h-3 w-3 mr-1" />
                    Assigned to: {ticket.assignedAgent}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Chat Interface */}
        <Card className="p-6">
          {selectedTicket ? (
            <>
              <div className="flex items-center justify-between mb-4 pb-4 border-b">
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedTicket.subject}</h3>
                  <p className="text-sm text-gray-600">
                    {getUserName(selectedTicket.userId)} • {getDepartmentName(selectedTicket.departmentId)}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant={selectedTicket.status === 'in-progress' ? 'primary' : 'outline'}
                    onClick={() => updateTicketStatus(selectedTicket.id, 'in-progress')}
                  >
                    In Progress
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedTicket.status === 'closed' ? 'primary' : 'outline'}
                    onClick={() => updateTicketStatus(selectedTicket.id, 'closed')}
                  >
                    Close
                  </Button>
                  {!selectedTicket.assignedAgent && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => assignTicket(selectedTicket.id, agentName)}
                    >
                      Assign to Me
                    </Button>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div className="h-80 overflow-y-auto mb-4 space-y-3">
                {ticketMessages.map(message => (
                  <div key={message.id} className={`flex ${message.sender === 'agent' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === 'agent' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      {message.sender === 'agent' && message.agentName && (
                        <p className="text-xs opacity-80 mb-1">{message.agentName}</p>
                      )}
                      <p className="text-sm">{message.message}</p>
                      <p className={`text-xs mt-1 ${message.sender === 'agent' ? 'text-blue-100' : 'text-gray-500'}`}>
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="flex items-center space-x-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your response..."
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1"
                />
                <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-96 text-gray-500">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a ticket to view conversation</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AdminSupport;
