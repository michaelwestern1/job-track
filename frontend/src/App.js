import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({
    title: '',
    company: '',
    date_applied: '',
    status: 'Applied',
  });

  const fetchJobs = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/jobs');
      setJobs(res.data);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/jobs', form);
      setForm({
        title: '',
        company: '',
        date_applied: '',
        status: 'Applied',
      });
      fetchJobs();
    } catch (err) {
      console.error('Error adding job:', err);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    const jobToUpdate = jobs.find((job) => job.id === id);
    if (!jobToUpdate) return;

    try {
      await axios.put(`http://localhost:8000/api/jobs/${id}`, {
        ...jobToUpdate,
        status: newStatus,
      });
      fetchJobs();
    } catch (err) {
      console.error('Error updating job:', err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="App" style={{ maxWidth: '600px', margin: 'auto', padding: '2rem' }}>
      <h1>📋 Job Application Tracker</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Job Title"
          required
          style={{ width: '100%', marginBottom: '8px', padding: '8px' }}
        />
        <input
          type="text"
          name="company"
          value={form.company}
          onChange={handleChange}
          placeholder="Company"
          required
          style={{ width: '100%', marginBottom: '8px', padding: '8px' }}
        />
        <input
          type="date"
          name="date_applied"
          value={form.date_applied}
          onChange={handleChange}
          required
          style={{ width: '100%', marginBottom: '8px', padding: '8px' }}
        />
        <button type="submit" style={{ padding: '10px 16px' }}>Add Job</button>
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
                style={{ marginLeft: '0.5rem' }}
              >
                <option value="Applied">Applied</option>
                <option value="Denied">Denied</option>
                <option value="Hired">Hired</option>
              </select>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
