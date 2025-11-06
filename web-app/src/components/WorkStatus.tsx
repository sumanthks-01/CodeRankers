import React, { useState, useEffect } from 'react';
import './WorkStatus.css';

interface WorkStatusData {
  status: string;
  status_display: string;
  date: string;
  reason: string;
}

const WorkStatus: React.FC = () => {
  const [currentStatus, setCurrentStatus] = useState<WorkStatusData | null>(null);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const statusOptions = [
    { value: 'office', label: 'Working from Office', icon: '🏢', color: '#10b981' },
    { value: 'wfh', label: 'Work from Home', icon: '🏠', color: '#3b82f6' },
    { value: 'sick', label: 'Sick Leave', icon: '🤒', color: '#ef4444' },
    { value: 'leave', label: 'On Leave', icon: '🏖️', color: '#f59e0b' },
  ];

  useEffect(() => {
    fetchCurrentStatus();
  }, []);

  const fetchCurrentStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/employee/work-status/', {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentStatus(data.status);
        setReason(data.status.reason || '');
      }
    } catch (error) {
      console.error('Error fetching work status:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    setUpdating(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/employee/work-status/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          reason: reason
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentStatus(data.status);
        
        if (newStatus !== 'office') {
          alert('You will not receive meal notifications while not working from office.');
        } else {
          alert('Work status updated successfully!');
        }
      } else {
        alert('Failed to update work status');
      }
    } catch (error) {
      console.error('Error updating work status:', error);
      alert('Error updating work status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusInfo = (status: string) => {
    return statusOptions.find(option => option.value === status);
  };

  if (loading) {
    return (
      <div className="work-status-container">
        <div className="loading">Loading work status...</div>
      </div>
    );
  }

  return (
    <div className="work-status-container">
      <div className="work-status-header">
        <h2>Work Status</h2>
        <p>Set your work location for today</p>
      </div>

      {currentStatus && (
        <div className="current-status-card">
          <h3>Current Status</h3>
          <div className="current-status-display">
            <span className="status-icon">
              {getStatusInfo(currentStatus.status)?.icon}
            </span>
            <span className="status-text">
              {getStatusInfo(currentStatus.status)?.label}
            </span>
          </div>
        </div>
      )}

      <div className="status-options">
        <h3>Update Status</h3>
        <div className="status-grid">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              className={`status-option ${currentStatus?.status === option.value ? 'selected' : ''}`}
              onClick={() => updateStatus(option.value)}
              disabled={updating}
              style={{
                borderColor: currentStatus?.status === option.value ? option.color : '#e5e7eb'
              }}
            >
              <div className="option-content">
                <span className="option-icon">{option.icon}</span>
                <div className="option-text">
                  <div className="option-label">{option.label}</div>
                  {option.value !== 'office' && (
                    <div className="option-subtext">No meal notifications</div>
                  )}
                </div>
              </div>
              {currentStatus?.status === option.value && (
                <div 
                  className="selected-indicator"
                  style={{ backgroundColor: option.color }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="reason-section">
        <h3>Reason (Optional)</h3>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Add a reason for your status..."
          rows={3}
          className="reason-input"
        />
        <button
          onClick={() => currentStatus && updateStatus(currentStatus.status)}
          disabled={updating}
          className="update-reason-btn"
        >
          {updating ? 'Updating...' : 'Update Reason'}
        </button>
      </div>

      <div className="info-card">
        <h3>📱 Notification Info</h3>
        <ul>
          <li>Office workers receive meal notifications</li>
          <li>WFH/Sick/Leave status disables notifications</li>
          <li>Status resets daily - update as needed</li>
        </ul>
      </div>
    </div>
  );
};

export default WorkStatus;