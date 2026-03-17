import './email-list.css';
import { useEffect, useState } from 'react';

const EmailList = () => {
  const [data, setEmailData] = useState([]);
  const [selectedEmails, setSelectedEmails] = useState([]);

  const toggleSelect = (id) => {
    setSelectedEmails((prev) =>
      prev.includes(id) ? prev.filter((emailId) => emailId !== id) : [...prev, id],
    );
  };

  const toggleAll = () => {
    if (selectedEmails.length === data.length) {
      setSelectedEmails([]);
    } else {
      setSelectedEmails(data.map((e) => e._id));
    }
  };

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const res = await fetch('http://localhost:8080/getemails');
        const data = await res.json();
        setEmailData(data);
      } catch {
        console.log('Failed to fetch data...');
      }
    };
    fetchEmails();
  }, []);

  const deleteEmails = async () => {
    try {
      await fetch('http://localhost:8080/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedEmails }),
      });

      const res = await fetch('http://localhost:8080/getemails');
      const data = await res.json();
      setEmailData(data);
      setSelectedEmails([]);
    } catch {
      console.log('Error deleting emails');
    }
  };

  const allSelected = data.length > 0 && selectedEmails.length === data.length;

  return (
    <div className="list-page">
      <div className="list-card">
        <div className="list-card-header">
          <div>
            <h2 className="list-card-title">Email List</h2>
            <p className="list-card-subtitle">
              {data.length === 0
                ? 'No active reminders'
                : `${data.length} active reminder${data.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          {data.length > 0 && (
            <button className="select-all-btn" type="button" onClick={toggleAll}>
              {allSelected ? 'Deselect all' : 'Select all'}
            </button>
          )}
        </div>

        <div className="list-body">
          {data.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">✉</span>
              <p>No reminders scheduled yet.</p>
            </div>
          ) : (
            data.map((email) => {
              const isSelected = selectedEmails.includes(email._id);
              return (
                <div
                  key={email._id}
                  className={`list-item${isSelected ? ' list-item--selected' : ''}`}
                  onClick={() => toggleSelect(email._id)}
                >
                  <div className="list-item-check">
                    <input
                      className="item-checkbox"
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(email._id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div className="list-item-body">
                    <div className="item-address">{email.emailAddress}</div>
                    <div className="item-meta">
                      <span className="meta-tag">{email.course}</span>
                      <span className="meta-divider">·</span>
                      <span>{email.date}</span>
                      <span className="meta-divider">·</span>
                      <span>
                        {email.repeat === 0
                          ? 'One-time'
                          : `Every ${email.repeat} day${email.repeat !== 1 ? 's' : ''}`}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {selectedEmails.length > 0 && (
        <div className="delete-bar">
          <span className="delete-bar-count">{selectedEmails.length} selected</span>
          <button className="delete-bar-btn" type="button" onClick={deleteEmails}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default EmailList;
