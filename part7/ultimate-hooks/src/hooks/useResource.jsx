//part7/ultimate-hooks/src/hooks/useResource.jsx

import { useState, useEffect } from "react";
import axios from "axios";

const useResource = (baseUrl) => {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axios.get(baseUrl);
        setResources(response.data);
      } catch (error) {
        console.error("Failed to fetch resources:", error);
      }
    };

    fetchResources();
  }, [baseUrl]);

  const create = async (resource) => {
    try {
      const response = await axios.post(baseUrl, resource);
      setResources([...resources, response.data]);
    } catch (error) {
      console.error("Failed to create resource:", error);
    }
  };

  // The service object can be expanded with more methods like `update` and `delete`
  const service = {
    create,
  };

  return [resources, service];
};

export default useResource;
