import React from "react";

const App = () => {
  const [shorten,setShorten] = React.useState<string>("");
  return (
    <div className="flex flex-col items-center mx-auto justify-center mt-30 h-100 w-100 bg-gray-100 border rounded-xl p-10">
      <div className="mb-4">
        <label htmlFor="url">URL:</label>
        <input className="ml-5 pl-4 border rounded-xl" type="text" id="url" placeholder="Enter the URL"/>
      </div>
      <button className="border w-50 rounded-xl hover:bg-neutral-200">Shorten</button>
    </div>
  );
};

export default App;
