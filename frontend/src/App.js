import React, { useState } from "react";
import axios from "axios";

const API_BASE_URL = "https://ai-cover-letter-5meq.onrender.com";

function App() {

  const [jobDescription, setJobDescription] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const uploadResume = async (file) => {

    const formData = new FormData();
    formData.append("file", file);

    await axios.post(
      `${API_BASE_URL}/upload-resume`,
      formData
    );

    setUploaded(true);
  };

  const generateLetter = async () => {

    if (!jobDescription) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("job_description", jobDescription);

    const res = await axios.post(
      `${API_BASE_URL}/generate-cover-letter`,
      formData
    );

    setCoverLetter(res.data.cover_letter);
    setLoading(false);
  };

  const copyText = () => {

    navigator.clipboard.writeText(coverLetter);

    alert("Copied");
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white p-4">

      <div className="max-w-3xl mx-auto">

        <h1 className="text-3xl font-bold text-center text-gray-800">

          AI Cover Letter Generator

        </h1>

        <p className="text-center text-gray-500 mt-2 mb-6">

          Generate personalized, ATS-friendly cover letters in seconds.

        </p>

        <p className="text-center text-sm text-gray-400 -mt-4 mb-6">

          No signup required • Instant generation • Free tool

        </p>


        {/* guide */}

        <div className="bg-indigo-100 border border-indigo-200 rounded-xl p-4 mb-6">

          <h3 className="font-semibold mb-2 text-indigo-800">

            How it works

          </h3>

          <ol className="list-decimal ml-5 text-sm text-gray-700 space-y-1">

            <li>Upload your resume</li>

            <li>Paste job description</li>

            <li>Generate cover letter</li>

            <li>Copy and apply</li>

          </ol>

        </div>


        {/* upload */}

        <div className="bg-white p-6 rounded-2xl shadow-sm mb-6">

          <label className="font-medium">

            Upload Resume

          </label>

          <input
            type="file"
            accept=".pdf,.docx"
            onChange={(e) =>
              uploadResume(e.target.files[0])
            }
            className="mt-2 w-full border rounded-lg p-2"
          />

          {uploaded && (

            <p className="text-green-600 text-sm mt-2">

              Resume uploaded successfully ✓

            </p>

          )}

        </div>


        {/* job description */}

        <div className="bg-white p-6 rounded-2xl shadow-sm mb-6">

          <label className="font-medium">

            Job Description

          </label>

          <textarea
            rows="7"
            placeholder="Paste job description here..."
            value={jobDescription}
            onChange={(e) =>
              setJobDescription(e.target.value)
            }
            className="mt-2 w-full border rounded-lg p-3"
          />

          <button
            onClick={generateLetter}
            className="mt-4 w-full bg-primary text-white py-3 rounded-xl hover:bg-secondary transition"
          >

            {loading
              ? "Generating..."
              : "Generate Cover Letter"}

          </button>

        </div>


        {/* result */}

        {coverLetter && (

          <div className="bg-white p-6 rounded-2xl shadow-sm">

            <div className="flex justify-between items-center mb-3">

              <h3 className="font-semibold text-gray-700">

                Cover Letter

              </h3>

              <button
                onClick={copyText}
                className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm"
              >

                Copy

              </button>

            </div>

            <textarea
              value={coverLetter}
              readOnly
              rows="12"
              className="w-full border rounded-lg p-3 text-sm"
            />

          </div>

        )}

      </div>

    </div>

  );

}

export default App;
