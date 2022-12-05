import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { FaBriefcase, FaCalendarAlt, FaHive } from 'react-icons/fa';
import { useAppContext } from '../context/appContext';
import Wrapper from '../assets/wrappers/Job';
import JobInfo from './JobInfo';

const Job = ({ _id, company, position, jobType, status, createdAt }) => {
  const { setEditJob, deleteJob } = useAppContext();

  let date = moment(createdAt);
  date = date.format('MMM Do, YYYY, h:mm:ss a');

  return (
    <Wrapper>
      <header>
        <div className="main-icon">{company.charAt(0)}</div>

        <div className="info">
          <h5>{position}</h5>
          <p>{company}</p>
        </div>
      </header>
      <div className="content">
        {/* content center later */}
        <div className="content-center">
          <JobInfo icon={<FaHive />} text={company} />
          <JobInfo icon={<FaCalendarAlt />} text={date} />
          <JobInfo icon={<FaBriefcase />} text={jobType} />
          <div className={`status ${status}`}>{status}</div>
        </div>
        <footer>
          <div className="actions">
            <Link to="/add-job" className="btn edit-btn" onClick={() => setEditJob(_id)}>
              Edit
            </Link>
            <button className="btn delete-btn" type="button" onClick={() => deleteJob(_id)}>
              Delete
            </button>
          </div>
        </footer>
      </div>
    </Wrapper>
  );
};

export default Job;
