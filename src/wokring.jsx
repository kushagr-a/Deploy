import { useState } from "react";
import axios from "axios";
import Select from "react-select";
import "./App.css";

const App = () => {
  const [jsonInput, setJsonInput] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [filteredData, setFilteredData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const parsedData = JSON.parse(jsonInput);
      const response = await axios.post("http://localhost:3000/bfhl", parsedData);
      setResponseData(response.data);
      setFilteredData(response.data); // Initially show full response
    } catch (error) {
      alert(error.response?.data?.message || "Invalid JSON format or API error.");
    }
  };

  const filterOptions = [
    { value: "alphabets", label: "Alphabets" },
    { value: "numbers", label: "Numbers" },
    { value: "highest_alphabet", label: "Highest Alphabet" },
  ];

  const handleFilterChange = (selectedOptions) => {
    setSelectedFilters(selectedOptions);
    if (!responseData) return;

    let result = {};
    if (selectedOptions.some((f) => f.value === "alphabets")) {
      result.alphabets = responseData.alphabets;
    }
    if (selectedOptions.some((f) => f.value === "numbers")) {
      result.numbers = responseData.numbers;
    }
    if (selectedOptions.some((f) => f.value === "highest_alphabet")) {
      result.highest_alphabet = responseData.alphabets?.length
        ? [...responseData.alphabets].sort().reverse()[0]
        : null;
    }
    setFilteredData(result);
  };

  return (
    <div className="container">
      <h2>Frontend Filtered JSON Processor</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder='{"name":"John Doe","dob":"2000-01-01","email":"john@example.com","roll_number":"12345","data":["A","B",1,2]}'
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
      </form>

      {responseData && (
        <div className="dropdown-container">
          <Select options={filterOptions} isMulti placeholder="Select Filters" onChange={handleFilterChange} />
        </div>
      )}

      {filteredData && selectedFilters.length > 0 && (
        <div className="response-box">
          <h3>Filtered Response:</h3>
          <pre>{JSON.stringify(filteredData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default App;