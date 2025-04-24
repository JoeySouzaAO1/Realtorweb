// components/InterestForm.tsx
"use client";

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import validator from 'validator';
import tlds from 'tlds';



function isValidEmailStrict(email) {
    if (typeof email !== 'string' || !email.trim()) return false;
    if (!validator.isEmail(email)) return false;
    const parts = email.trim().split('.');
    if (parts.length < 2) return false;
    const tld = parts.pop();
    if (!tld) return false;
    return tlds.includes(tld.toLowerCase());
  }
  

function formatPhone(value) {
  // Remove all non-digits
  const digits = value.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
}

const InterestForm = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  // For validation errors
  const [fieldErrors, setFieldErrors] = useState({});

  const supabase = createClient();
  const realtorProfileId = process.env.NEXT_PUBLIC_REALTOR_ID;

  // Validate all fields before submit
  const validate = () => {
    const errors = {};
    if (!firstName.trim()) errors.firstName = "First name is required.";
    else if (!/^[A-Za-z\s'-]{1,30}$/.test(firstName)) errors.firstName = "First name must be letters only, max 30 characters.";
    if (!lastName.trim()) errors.lastName = "Last name is required.";
    else if (!/^[A-Za-z\s'-]{1,30}$/.test(lastName)) errors.lastName = "Last name must be letters only, max 30 characters.";
    if (!email.trim()) errors.email = "Email is required.";
    else if (!isValidEmailStrict(email)) errors.email = "Enter a valid email address.";
    if (phone && phone.replace(/\D/g, '').length !== 10) errors.phone = "Phone must be 10 digits.";
    if (message.length > 300) errors.message = "Message must be 300 characters or less.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);

    if (!validate()) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('interest_form')
        .insert([
          {
            realtor_profile_id: realtorProfileId,
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            email: email.trim(),
            phone: phone.trim(),
            message: message.trim(),
            source: 'Website Form',
          },
        ]);
      if (error) {
        setError('Failed to submit the form. Please try again.');
      } else {
        setSuccess('Thank you! We will contact you soon.');
        setFirstName('');
        setLastName('');
        setEmail('');
        setPhone('');
        setMessage('');
        setFieldErrors({});
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">
          <strong className="font-bold">Success! </strong>
          <span>{success}</span>
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <strong className="font-bold">Error! </strong>
          <span>{error}</span>
        </div>
      )}
      <div className="mb-4">
        <label htmlFor="firstName" className="block text-gray-700 text-sm font-bold mb-2">
          First Name
        </label>
        <input
          type="text"
          id="firstName"
          maxLength={30}
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${fieldErrors.firstName ? 'border-red-500' : ''}`}
          value={firstName}
          onChange={(e) => setFirstName(e.target.value.replace(/[^A-Za-z\s'-]/g, '').slice(0, 30))}
          required
        />
        {fieldErrors.firstName && <p className="text-red-500 text-xs mt-1">{fieldErrors.firstName}</p>}
      </div>
      <div className="mb-4">
        <label htmlFor="lastName" className="block text-gray-700 text-sm font-bold mb-2">
          Last Name
        </label>
        <input
          type="text"
          id="lastName"
          maxLength={30}
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${fieldErrors.lastName ? 'border-red-500' : ''}`}
          value={lastName}
          onChange={(e) => setLastName(e.target.value.replace(/[^A-Za-z\s'-]/g, '').slice(0, 30))}
          required
        />
        {fieldErrors.lastName && <p className="text-red-500 text-xs mt-1">{fieldErrors.lastName}</p>}
      </div>
      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${fieldErrors.email ? 'border-red-500' : ''}`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {fieldErrors.email && <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>}
      </div>
      <div className="mb-4">
        <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          maxLength={12}
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${fieldErrors.phone ? 'border-red-500' : ''}`}
          value={phone}
          onChange={(e) => setPhone(formatPhone(e.target.value))}
          placeholder="123-456-7890"
        />
        {fieldErrors.phone && <p className="text-red-500 text-xs mt-1">{fieldErrors.phone}</p>}
      </div>
      <div className="mb-6">
        <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2">
          Message <span className="text-gray-400 text-xs">({message.length}/300)</span>
        </label>
        <textarea
          id="message"
          maxLength={300}
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${fieldErrors.message ? 'border-red-500' : ''}`}
          value={message}
          onChange={(e) => setMessage(e.target.value.slice(0, 300))}
          rows={4}
        />
        {fieldErrors.message && <p className="text-red-500 text-xs mt-1">{fieldErrors.message}</p>}
      </div>
      <div className="flex justify-center">
        <button
          className="bg-red-500 hover:bg-red-700 text-white text-center font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </form>
  );
};

export default InterestForm;
