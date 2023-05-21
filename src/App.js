import React, { useState } from "react";
import Papa from "papaparse";
import "./App.css";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [csvData, setCSVData] = useState([]);
  const [searchVal, setSearchVal] = useState("");
  const [searchType, setSearchType] = useState("storeID");
  const [mainData, setMainData] = useState([]);
  const [messageTodisplay, setMessageTodisplay] = useState('Upload CSV');
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (selectedFile) {
      Papa.parse(selectedFile, {
        complete: (results) => {
          setMessageTodisplay('')
          setMainData(results.data);
          setCSVData(results.data);
        },
        header: true,
      });
    }
  };

  const handleCellValueChange = (id, field, value) => {
    const updatedData = csvData.map((row) => {
      if (row.storeID === id) {
        return { ...row, [field]: value };
      }
      return row;
    });
    setCSVData(updatedData);
    //updating same state with updated date same can be updated in api in post call or put call
  };
  const handleSearch = () => {
    console.log(searchVal, searchType);
    const backupCsv = mainData;
    const filteredData = backupCsv.filter((row) => {
      console.log(row[searchType]);
      if (row[searchType] === searchVal) {
        return row;
      }
    });
    console.log(searchVal, filteredData);
    filteredData.length ? setCSVData(filteredData) : setMessageTodisplay('no result found');
  };
  const handleReset = () => {
    setCSVData(mainData);
    setMessageTodisplay('')
  };
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
          >
            {csvData.length &&
              Object.keys(csvData[0]).map((header, index) => (
                <option value={header} key={index}>
                  {header}
                </option>
              ))}
          </select>
          <input onChange={(e) => setSearchVal(e.target.value)}></input>
          <button onClick={handleSearch}>search</button>
          <button onClick={handleReset}>reset</button>
          {<p>{messageTodisplay}</p>}
        </div>
        <div>
          <input type="file" accept=".csv" onChange={handleFileChange} />
          <button onClick={handleUpload} disabled={!selectedFile}>
            Upload
          </button>

          {csvData.length > 0 && (
            <table>
              <thead>
                <tr>
                  {Object.keys(csvData[0]).map((header, index) => (
                    <th key={index}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {csvData.map((row, index) => (
                  <tr key={index}>
                    <td>{row.storeID}</td>
                    <td>
                      <input
                        type="text"
                        value={row.sku}
                        onChange={(e) =>
                          handleCellValueChange(
                            row.storeID,
                            "sku",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={row.productName}
                        onChange={(e) =>
                          handleCellValueChange(
                            row.storeID,
                            "productName",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={row.price}
                        onChange={(e) =>
                          handleCellValueChange(
                            row.storeID,
                            "price",
                            parseInt(e.target.value)
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={row.date}
                        onChange={(e) =>
                          handleCellValueChange(
                            row.storeID,
                            "date",
                            e.target.value
                          )
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
