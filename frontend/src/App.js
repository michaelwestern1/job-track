import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'https://job-track-1-1zl2.onrender.com';

function App() {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({
    title: '',
    company: '',
    date_applied: '',
    status: 'Applied',
  });
  const [loading, setLoading] = useState(false); // <-- Spinner state

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/jobs`);
      setJobs(res.data);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/jobs`, form);
      setJobs((prev) => [...prev, res.data]);
      setForm({
        title: '',
        company: '',
        date_applied: '',
        status: 'Applied',
      });
    } catch (err) {
      console.error('Error adding job:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    const jobToUpdate = jobs.find((job) => job.id === id);
    if (!jobToUpdate) return;

    setLoading(true);
    try {
      await axios.put(`${API_URL}/api/jobs/${id}`, {
        ...jobToUpdate,
        status: newStatus,
      });
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job.id === id ? { ...job, status: newStatus } : job
        )
      );
    } catch (err) {
      console.error('Error updating job:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/api/jobs/${id}`);
      setJobs((prevJobs) => prevJobs.filter((job) => job.id !== id));
    } catch (err) {
      console.error('Error deleting job:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App" style={{ maxWidth: '600px', margin: 'auto', padding: '2rem' }}>
      <h1>📋 Job Application Tracker</h1>

      {loading && <div className="spinner"></div>}

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Job Title"
          required
          disabled={loading}
          style={{ width: '100%', marginBottom: '8px', padding: '8px' }}
        />
        <input
          type="text"
          name="company"
          value={form.company}
          onChange={handleChange}
          placeholder="Company"
          required
          disabled={loading}
          style={{ width: '100%', marginBottom: '8px', padding: '8px' }}
        />
        <input
          type="date"
          name="date_applied"
          value={form.date_applied}
          onChange={handleChange}
          required
          disabled={loading}
          style={{ width: '100%', marginBottom: '8px', padding: '8px' }}
        />
        <button type="submit" style={{ padding: '10px 16px' }} disabled={loading}>
          Add Job
        </button>
      </form>

      <h2>📝 Tracked Jobs</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {jobs.map((job) => (
          <li key={job.id} style={{ borderBottom: '1px solid #ccc', paddingBottom: '1rem', marginBottom: '1rem' }}>
            <strong>{job.title}</strong> at <em>{job.company}</em><br />
            Applied on: {job.date_applied}<br />
            <label>
              Status:
              <select
                value={job.status}
                onChange={(e) => handleStatusChange(job.id, e.target.value)}
                disabled={loading}
                style={{ marginLeft: '0.5rem' }}
              >
                <option value="Applied">Applied</option>
                <option value="Denied">Denied</option>
                <option value="Hired">Hired</option>
              </select>
            </label>
            <br />
            <button
              onClick={() => handleDelete(job.id)}
              disabled={loading}
              style={{
                marginTop: '8px',
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                padding: '6px 12px',
                cursor: 'pointer'
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
