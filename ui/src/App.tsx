import React, { useEffect, useState } from "react";

import axios from "axios";

const healthCheckPing = async (
  setMessage: React.Dispatch<React.SetStateAction<string>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  try {
    const response = await axios.get("/_health");
    const message = response.data;
    setMessage(message);
  } catch (error) {
    setMessage(
      "Unable to check health of server. Please check that the server is started and that the proxy port matches the server port"
    );
  }
};



function App() {
  const [loading, setLoading] = useState(false);
  const [healthCheckMessage, setHealthCheckMessage] = useState("Loading...");

  useEffect(() => {
    healthCheckPing(setHealthCheckMessage, setLoading);
  }, []);

  return (
    <div>
      Successfuly started Client
      <div>
        Health Check from server: {loading ? "Loading..." : healthCheckMessage}
      </div>
    </div>
  );
}

export default App;
