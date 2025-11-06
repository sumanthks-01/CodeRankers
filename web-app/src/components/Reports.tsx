import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Reports.css';

interface ReportItem {
  item_name: string;
  count: number;
}

interface ReportData {
  date: string;
  total_employees: number;
  report: {
    breakfast: ReportItem[];
    lunch: ReportItem[];
    snacks: ReportItem[];
  };
}

const Reports: React.FC = () => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReport();
  }, [selectedDate]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/admin/reports/daily/?date=${selectedDate}`);
      setReportData(response.data);
    } catch (error) {
      console.error('Error fetching report:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTotalCount = () => {
    if (!reportData) return 0;
    
    const breakfastTotal = reportData.report.breakfast.reduce((sum, item) => sum + item.count, 0);
    const lunchTotal = reportData.report.lunch.reduce((sum, item) => sum + item.count, 0);
    const snacksTotal = reportData.report.snacks.reduce((sum, item) => sum + item.count, 0);
    
    return breakfastTotal + lunchTotal + snacksTotal;
  };

  const renderMealSection = (mealType: string, items: ReportItem[]) => (
    <div className="meal-section" key={mealType}>
      <h4>{mealType.toUpperCase()}</h4>
      {items.length === 0 ? (
        <p className="no-items">No items for this meal</p>
      ) : (
        <table className="report-table">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td>{item.item_name}</td>
                <td>{item.count} portions</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  return (
    <div className="reports">
      <h2>Daily Reports</h2>
      
      <div className="navigation">
        <Link to="/admin">← Back to Dashboard</Link>
      </div>

      <div className="date-selector">
        <label>Select Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        <button onClick={fetchReport} className="refresh-btn">Refresh</button>
      </div>

      {loading && <div className="loading">Loading report...</div>}

      {reportData && (
        <div className="report-content">
          <div className="summary-card">
            <h3>Summary for {reportData.date}</h3>
            <div className="summary-stats">
              <div className="stat">
                <span className="stat-label">Total Employees:</span>
                <span className="stat-value">{reportData.total_employees}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Total Meal Portions:</span>
                <span className="stat-value">{getTotalCount()}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Participation Rate:</span>
                <span className="stat-value">
                  {Math.round((getTotalCount() / (reportData.total_employees * 3)) * 100)}%
                </span>
              </div>
            </div>
          </div>

          <div className="meals-report">
            {renderMealSection('breakfast', reportData.report.breakfast)}
            {renderMealSection('lunch', reportData.report.lunch)}
            {renderMealSection('snacks', reportData.report.snacks)}
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;