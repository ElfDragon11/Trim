import { useState } from 'react';

export default function UserProfile() {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex items-center gap-4 mb-8">
        <img
          src="https://example.com/placeholder.jpg"
          alt="Profile"
          className="w-20 h-20 rounded-full"
        />
        <div>
          <h1 className="text-2xl font-bold">Alex Johnson</h1>
          <p className="text-gray-400">alex.johnson@example.com</p>
        </div>
      </div>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Preferences</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span>Push Notifications</span>
            <button
              className={`w-12 h-6 rounded-full p-1 transition-colors ${
                pushNotifications ? 'bg-accent' : 'bg-gray-600'
              }`}
              onClick={() => setPushNotifications(!pushNotifications)}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full transition-transform ${
                  pushNotifications ? 'translate-x-6' : ''
                }`}
              />
            </button>
          </div>
          <div className="flex justify-between items-center">
            <span>Dark Mode</span>
            <button
              className={`w-12 h-6 rounded-full p-1 transition-colors ${
                darkMode ? 'bg-accent' : 'bg-gray-600'
              }`}
              onClick={() => setDarkMode(!darkMode)}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full transition-transform ${
                  darkMode ? 'translate-x-6' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold mb-4">Account</h2>
        <button className="btn btn-primary w-full">Edit Profile</button>
        <button className="btn btn-secondary w-full">Change Password</button>
        <button className="btn btn-danger w-full">Log Out</button>
      </section>
    </div>
  );
}