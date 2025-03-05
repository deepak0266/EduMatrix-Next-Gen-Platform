import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock, Video, Phone, User, MoreVertical, Plus, Search, Filter } from 'lucide-react';

const InterviewPage = () => {
  const [interviews, setInterviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('upcoming'); // 'upcoming', 'past', 'all'
  const [searchQuery, setSearchQuery] = useState('');
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    // Simulate fetching interview data
    const fetchInterviewsData = () => {
      setTimeout(() => {
        const sampleInterviews = [
          {
            id: 1,
            company: 'TechCorp',
            position: 'Senior Software Engineer',
            date: '2025-03-15T14:00:00',
            duration: 60,
            type: 'video',
            status: 'upcoming',
            contact: 'Sarah Johnson',
            contactRole: 'HR Manager',
            notes: 'Prepare to discuss system design and leadership experience',
            location: 'Zoom Meeting',
            meetingLink: 'https://zoom.us/j/123456789'
          },
          {
            id: 2,
            company: 'Innovate Inc',
            position: 'Product Manager',
            date: '2025-03-10T10:30:00',
            duration: 45,
            type: 'phone',
            status: 'upcoming',
            contact: 'Mark Davis',
            contactRole: 'Technical Lead',
            notes: 'This is a technical screening call',
            location: 'Phone Call',
            phoneNumber: '+1-555-123-4567'
          },
          {
            id: 3,
            company: 'Data Systems',
            position: 'Data Scientist',
            date: '2025-03-05T16:00:00',
            duration: 90,
            type: 'in-person',
            status: 'upcoming',
            contact: 'Jennifer Lee',
            contactRole: 'Hiring Manager',
            notes: 'Bring copies of resume and portfolio',
            location: '123 Main Street, Suite 400, San Francisco, CA'
          },
          {
            id: 4,
            company: 'Growth Startup',
            position: 'Frontend Developer',
            date: '2025-02-28T13:00:00',
            duration: 60,
            type: 'video',
            status: 'past',
            contact: 'Michael Wong',
            contactRole: 'CTO',
            notes: 'Coding challenge and portfolio review',
            location: 'Google Meet',
            meetingLink: 'https://meet.google.com/abc-defg-hij',
            feedback: 'Positive feedback on technical skills. Moving to next round.'
          },
          {
            id: 5,
            company: 'Enterprise Solutions',
            position: 'DevOps Engineer',
            date: '2025-02-20T11:00:00',
            duration: 45,
            type: 'phone',
            status: 'past',
            contact: 'Robert Chen',
            contactRole: 'Team Lead',
            notes: 'Discussion about CI/CD pipelines and AWS experience',
            location: 'Phone Call',
            phoneNumber: '+1-555-987-6543',
            feedback: 'Good conversation. Recommended for technical assessment.'
          }
        ];
        
        setInterviews(sampleInterviews);
        setIsLoading(false);
      }, 1000);
    };
    
    fetchInterviewsData();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const openInterviewDetails = (interview) => {
    setSelectedInterview(interview);
    setShowInterviewModal(true);
  };

  const closeInterviewModal = () => {
    setShowInterviewModal(false);
    setSelectedInterview(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'video':
        return <Video size={20} className="text-blue-500" />;
      case 'phone':
        return <Phone size={20} className="text-green-500" />;
      case 'in-person':
        return <User size={20} className="text-purple-500" />;
      default:
        return <Calendar size={20} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status, date) => {
    if (status === 'past') {
      return 'bg-gray-100 text-gray-600';
    }
    
    const interviewDate = new Date(date);
    const today = new Date();
    const diffDays = Math.ceil((interviewDate - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 2) {
      return 'bg-red-100 text-red-600';
    } else if (diffDays <= 7) {
      return 'bg-yellow-100 text-yellow-700';
    } else {
      return 'bg-green-100 text-green-600';
    }
  };

  // Filter interviews based on view mode and search query
  const filteredInterviews = interviews.filter(interview => {
    // Filter by view mode
    if (viewMode === 'upcoming' && interview.status !== 'upcoming') return false;
    if (viewMode === 'past' && interview.status !== 'past') return false;
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        interview.company.toLowerCase().includes(query) ||
        interview.position.toLowerCase().includes(query) ||
        interview.contact.toLowerCase().includes(query) ||
        interview.notes.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  // Sort by date (upcoming first, then past)
  const sortedInterviews = [...filteredInterviews].sort((a, b) => {
    if (a.status === 'upcoming' && b.status === 'past') return -1;
    if (a.status === 'past' && b.status === 'upcoming') return 1;
    return new Date(a.date) - new Date(b.date);
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <header className="bg-white p-4 shadow">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <h1 className="text-2xl font-bold text-gray-800">Interviews</h1>
            <div className="mt-4 sm:mt-0 relative">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search interviews..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10 pr-4 py-2 w-full sm:w-64 rounded-full bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="max-w-6xl mx-auto p-4">
        {/* Controls */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <button
                onClick={() => handleViewModeChange('upcoming')}
                className={`px-4 py-2 rounded-md ${
                  viewMode === 'upcoming' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => handleViewModeChange('past')}
                className={`px-4 py-2 rounded-md ${
                  viewMode === 'past' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Past
              </button>
              <button
                onClick={() => handleViewModeChange('all')}
                className={`px-4 py-2 rounded-md ${
                  viewMode === 'all' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All
              </button>
            </div>
            
            <button 
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              onClick={() => setShowInterviewModal(true)}
            >
              <Plus size={18} className="mr-2" />
              Add Interview
            </button>
          </div>
        </div>
        
        {/* Calendar view (simplified) */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <ChevronLeft size={20} />
            </button>
            <h3 className="text-lg font-medium">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h3>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <ChevronRight size={20} />
            </button>
          </div>
          
          <div className="text-center text-sm text-gray-500 mb-2">
            Calendar view can be expanded in future versions
          </div>
        </div>
        
        {/* Interview list */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium">
              {viewMode === 'upcoming' && 'Upcoming Interviews'}
              {viewMode === 'past' && 'Past Interviews'}
              {viewMode === 'all' && 'All Interviews'}
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({sortedInterviews.length} {sortedInterviews.length === 1 ? 'interview' : 'interviews'})
              </span>
            </h2>
          </div>
          
          {sortedInterviews.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No interviews found. {searchQuery ? 'Try a different search term.' : viewMode !== 'all' ? 'Try a different view mode.' : 'Add your first interview.'}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {sortedInterviews.map(interview => (
                <div 
                  key={interview.id}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition"
                  onClick={() => openInterviewDetails(interview)}
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        {getTypeIcon(interview.type)}
                        <h3 className="text-lg font-medium ml-2">{interview.company}</h3>
                        <span className={`ml-3 px-2 py-1 text-xs rounded-full ${getStatusColor(interview.status, interview.date)}`}>
                          {interview.status === 'upcoming' ? 'Upcoming' : 'Past'}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-1">{interview.position}</p>
                      
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar size={16} className="mr-1" />
                        <span className="mr-3">{formatDate(interview.date)}</span>
                        <Clock size={16} className="mr-1" />
                        <span>{formatTime(interview.date)}</span>
                        <span className="mx-1">•</span>
                        <span>{interview.duration} min</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 md:mt-0 flex items-center">
                      <button className="p-2 rounded-full hover:bg-gray-200">
                        <MoreVertical size={20} className="text-gray-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      
      {/* Interview Details Modal */}
      {showInterviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">
                  {selectedInterview ? `${selectedInterview.company} - ${selectedInterview.position}` : 'Add New Interview'}
                </h2>
                <button 
                  onClick={closeInterviewModal}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {selectedInterview ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 mb-1">Company</h3>
                      <p className="text-lg">{selectedInterview.company}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 mb-1">Position</h3>
                      <p className="text-lg">{selectedInterview.position}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 mb-1">Date & Time</h3>
                      <p className="text-lg">{formatDate(selectedInterview.date)} at {formatTime(selectedInterview.date)}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 mb-1">Duration</h3>
                      <p className="text-lg">{selectedInterview.duration} minutes</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 mb-1">Interview Type</h3>
                      <div className="flex items-center">
                        {getTypeIcon(selectedInterview.type)}
                        <span className="ml-2 capitalize">{selectedInterview.type}</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 mb-1">Contact</h3>
                      <p className="text-lg">{selectedInterview.contact} ({selectedInterview.contactRole})</p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-500 mb-1">Location</h3>
                    <p className="text-lg">{selectedInterview.location}</p>
                    {selectedInterview.meetingLink && (
                      <a href={selectedInterview.meetingLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        {selectedInterview.meetingLink}
                      </a>
                    )}
                    {selectedInterview.phoneNumber && (
                      <p className="text-blue-500">{selectedInterview.phoneNumber}</p>
                    )}
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-500 mb-1">Notes</h3>
                    <p className="text-lg whitespace-pre-line">{selectedInterview.notes}</p>
                  </div>
                  
                  {selectedInterview.feedback && (
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-gray-500 mb-1">Feedback</h3>
                      <p className="text-lg whitespace-pre-line">{selectedInterview.feedback}</p>
                    </div>
                  )}
                  
                  <div className="flex justify-end space-x-4 mt-6">
                    {selectedInterview.status === 'upcoming' && (
                      <>
                        <button className="px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50">
                          Reschedule
                        </button>
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                          Set Reminder
                        </button>
                      </>
                    )}
                    {selectedInterview.status === 'past' && !selectedInterview.feedback && (
                      <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                        Add Feedback
                      </button>
                    )}
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                      Edit
                    </button>
                  </div>
                </>
              ) : (
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                      <input 
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter company name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                      <input 
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter position title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <input 
                        type="date"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                      <input 
                        type="time"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                      <input 
                        type="number"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="60"
                        min="15"
                        step="15"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Interview Type</label>
                      <select className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="video">Video</option>
                        <option value="phone">Phone</option>
                        <option value="in-person">In-person</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                      <input 
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter contact name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contact Role</label>
                      <input 
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. HR Manager, CTO"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location/Meeting Link</label>
                    <input 
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter location or meeting link"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      rows="4"
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter any notes or preparation information"
                    ></textarea>
                  </div>
                  
                  <div className="flex justify-end space-x-4 pt-4">
                    <button 
                      type="button"
                      onClick={closeInterviewModal}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      Save Interview
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewPage;