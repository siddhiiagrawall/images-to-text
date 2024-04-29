// App.js
import React from "react";
import Tesseract from 'tesseract.js';

import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import './App.css';

const App = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [image, setImage] = React.useState('');
  const [text, setText] = React.useState('');
  const [progress, setProgress] = React.useState(0);
  const [error, setError] = React.useState(null);

  const handleSubmit = () => {
    setIsLoading(true);
    setError(null);
    Tesseract.recognize(image, 'eng', {
      logger: (m) => {
        console.log(m);
        if (m.status === 'recognizing text') {
          setProgress(parseInt(m.progress * 100));
        }
      },
    })
      .catch((err) => {
        console.error(err);
        setError("Error converting image. Please try again.");
      })
      .then((result) => {
        console.log(result.data);
        setText(result.data.text);
        setIsLoading(false);
      });
  };

  const handleClear = () => {
    setImage('');
    setText('');
    setProgress(0);
    setError(null);
  };

  return (
    <div className="container-fluid main-container">
      <div className="row h-100">
        <div className="col-md-6 mx-auto my-auto text-center">
          <h1 className="display-4">Image To Text</h1>
          {!isLoading && (
            <>
              <p className="lead">Upload an image and convert it to text</p>
            </>
          )}
          {isLoading && (
            <>
              <div className="progress-container">
                <progress className="progress-bar" value={progress} max="100"></progress>
                <p className="progress-text">Converting: {progress}%</p>
              </div>
            </>
          )}
          {error && (
            <p className="text-danger">{error}</p>
          )}
          {!isLoading && !text && (
            <>
              <input
                type="file"
                onChange={(e) =>
                  setImage(URL.createObjectURL(e.target.files[0]))
                }
                className="form-control file-input"
              />
              <button
                onClick={handleSubmit}
                className="btn btn-primary mt-3"
              >
                Convert
              </button>
            </>
          )}
          {!isLoading && text && (
            <>
              <textarea
                className="form-control result-text"
                rows="10"
                value={text}
                readOnly
              ></textarea>
              <button
                onClick={handleClear}
                className="btn btn-secondary mt-3"
              >
                Clear
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
