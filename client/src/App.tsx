import React from "react";
import axios from "axios";

const App = () => {
  const [url, setUrl] = React.useState<string>("");
  const [input, setInput] = React.useState<string>("");
  const [error,setError] = React.useState<string>("");

  async function handleShortenUrl(longURL: string) {
    try {
      const res = await axios.post("http://localhost:3000/api/url/shorten", {
        longURL,
      });
      setUrl(res.data.shortURL);
    } catch (error) {
      console.error("Error shortening URL:", error);
      if (axios.isAxiosError(error) && error.response?.status==429) {
        setError(error.response.data.error);
        setTimeout(() => {
          setError("");
        }, 5000);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  }
  const handleRedirect = (shortURL: string) => {
    try {
      window.location.href = `http://localhost:3000/api/url/${shortURL}`;
    } catch (error) {
      console.log("error in handleRedirect", error);
    }
  };
  return (
    <div className="flex flex-col items-center mx-auto justify-center mt-30 h-100 w-100 bg-gray-100 border rounded-xl p-10">
      <div className="mb-4">
        <label htmlFor="url">URL:</label>
        <input
          className="ml-5 pl-4 border rounded-xl"
          type="text"
          id="url"
          placeholder="Enter the URL"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>
      {/* change the onClick function to the API call */}
      <button
        onClick={() => {
          handleShortenUrl(input);
        }}
        className="border w-50 rounded-xl hover:bg-neutral-200"
      >
        Shorten
      </button>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      <p className="mt-4">{url}</p>
      <button
        className="border rounded-xl w-20 mt-4"
        onClick={() => handleRedirect(url)}
      >
        Redirect
      </button>
    </div>
  );
};

export default App;
