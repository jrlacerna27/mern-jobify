import React, { useState, useEffect } from 'react';
import { Logo, FormRow, Alert } from '../components';
import Wrapper from '../assets/wrappers/RegisterPage';
import { useAppContext } from '../context/appContext';
import { useNavigate } from 'react-router-dom';

const initialState = {
  name: '',
  lastName: '',
  email: '',
  password: '',
  isMember: true,
};

const Register = () => {
  // global state and useNavigate
  const navigate = useNavigate();

  const [values, setValues] = useState(initialState);

  const { user, isLoading, showAlert, displayAlert, registerUser, loginUser, setupUser } =
    useAppContext();

  const toggleMember = () => {
    setValues({ ...values, isMember: !values.isMember });
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, lastName, email, password, isMember } = values;

    if (!email || !password || (!isMember && !name)) {
      displayAlert();
      return;
    }

    const currentUser = { name, lastName, email, password };
    if (isMember) {
      // loginUser(currentUser);
      setupUser({ currentUser, endPoint: 'login', alertText: 'Login Successful! Redirecting...' });
    } else {
      // registerUser(currentUser);
      setupUser({ currentUser, endPoint: 'register', alertText: 'User Created! Redirecting...' });
    }
  };

  useEffect(() => {
    // if user exists navigate to dashboard
    if (user) {
      setTimeout(() => {
        navigate('/');
      }, 3000);
    }
  }, [user, navigate]);

  return (
    <Wrapper className="full-page">
      <form className="form" onSubmit={handleSubmit}>
        <Logo />
        <h3>{values.isMember ? 'Login' : 'Register'}</h3>
        {showAlert && <Alert />}
        {/* name input */}
        {!values.isMember && (
          <>
            <FormRow type="text" name="name" value={values.name} handleChange={handleChange} />
            <FormRow
              type="text"
              name="lastName"
              value={values.lastName}
              handleChange={handleChange}
            />
          </>
        )}

        {/* email input */}
        <FormRow type="email" name="email" value={values.email} handleChange={handleChange} />
        {/* password input */}
        <FormRow
          type="password"
          name="password"
          value={values.password}
          handleChange={handleChange}
        />
        <button type="submit" className="btn btn-block" disabled={isLoading}>
          Submit
        </button>
        <button
          type="button"
          className="btn btn-block btn-hipster"
          disabled={isLoading}
          onClick={() => {
            setupUser({
              currentUser: { email: 'test@gmail.com', password: 'test123' },
              endPoint: 'login',
              alertText: 'Login Successful! Redirecting...',
            });
          }}
        >
          {isLoading ? 'Loading...' : 'demo app'}
        </button>
        <p>
          {values.isMember ? 'Not a member yet?' : 'Already a member?'}
          <button type="button" onClick={toggleMember} className="member-btn">
            {values.isMember ? 'Register' : 'Login'}
          </button>
        </p>
      </form>
    </Wrapper>
  );
};

export default Register;
