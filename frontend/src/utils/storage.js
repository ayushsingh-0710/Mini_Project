export const getUserData = () => {
  const raw = localStorage.getItem("easyinsure_user_data");

  if (raw) {
    const parsed = JSON.parse(raw);

    return {
      profile: parsed.profile || {
        name: "Sneha Tripathi",
        email: "sneha@example.com",
        phone: "+91 9876543210",
        address: "Mathura, Uttar Pradesh"
      },
      policies: parsed.policies || [],
      claims: parsed.claims || [],
      notifications: parsed.notifications || []
    };
  }

  const defaultData = {
    profile: {
      name: "Sneha Tripathi",
      email: "sneha@example.com",
      phone: "+91 9876543210",
      address: "Mathura, Uttar Pradesh"
    },
    policies: [],
    claims: [],
    notifications: []
  };

  localStorage.setItem("easyinsure_user_data", JSON.stringify(defaultData));
  return defaultData;
};

export const saveUserData = (data) => {
  localStorage.setItem("easyinsure_user_data", JSON.stringify(data));
};