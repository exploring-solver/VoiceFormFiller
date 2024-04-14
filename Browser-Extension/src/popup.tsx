import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const Popup = () => {
    const [inputValue, setInputValue] = useState('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value);
  
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const activeTab = tabs[0];
          if (activeTab && activeTab.id) {
              chrome.tabs.executeScript(activeTab.id, {
                  code: `
                      var inputs = document.querySelectorAll('input[name="${event.target.name}"]');
                      inputs.forEach(input => input.value = "${event.target.value}");
                  `
              });
          }
      });
  };
  

    return (
        <div style={{ width: '300px' }}>
            <h2>Change Input Value</h2>
            <form>
                <label htmlFor="inputName">Input Name:</label>
                <input
                    type="text"
                    id="inputName"
                    name="inputName"
                    value={inputValue}
                    onChange={handleChange}
                />
            </form>
        </div>
    );
};

ReactDOM.render(<Popup />, document.getElementById('root'));
