import React, { useEffect, useState } from 'react';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';
import './App.css';
import { Amplify } from 'aws-amplify';
Amplify.configure(config);

function SponsorApplications() {

  const [headers, setHeaders] = useState([]);
  const [rows, setRows] = useState([]);
  const [applicationData, setApplicationData] = useState([]);

  useEffect(() => {
    fetch('/api/getUserApplication')
      .then(response => response.json())
      .then(data => {
        setApplicationData(data);
        setHeaders(Object.keys(data[0]));
        setRows(data.map(item => Object.values(item)));
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  console.log("rows and headers");
  console.log(rows);
  console.log(headers);

  return (
    <div>
      <div className="container">
        <h1>Application List</h1>
        <table>
        <thead>
            <tr>
            {headers.map(header => <th key={header}>{header}</th>)}
            </tr>
        </thead>
        <tbody>
            {rows.map((row, index) => (
            <tr key={index}>
                {row.map((cell, index) => <td key={index}>{cell}</td>)}
            </tr>
            ))}
        </tbody>
        </table>
      </div>
    </div>
  );
}

export default SponsorApplications;
