import { useEffect, useState } from "react";

export default function Main() {
  const [shortURL, setShortURL] = useState("");
  const [url, setURL] = useState("");
  const [copy,setCopy]=useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://server-production-385f.up.railway.app/create/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originalURL: url,
        }),
      });

      const {shortUrl} = await res.json();
      // console.log(data);
      setShortURL(shortUrl);
    } catch (err) {
      console.log(err.message);
    }
  };


  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="h-[30rem] w-[40rem] text-white rounded-2xl flex justify-evenly items-center flex-col  bg-neutral-900/50 backdrop-blur-sm border-2 shadow-xl border-white/10">
          <h2 className="text-[50px] font-bold font-serif">URL Shortner</h2>
          <input
            value={url}
            onChange={(e) => setURL(e.target.value)}
            placeholder="Enter the URL here"
            className="w-[90%] outline-none h-15 p-5 border-2 border-black rounded-2xl"
          ></input>
          <button
            type="submit"
            className="w-40 border-2 border-black bg-black h-15 cursor-pointer rounded-xl"
          >
            Shorten URL
          </button>
          {shortURL && (
            <div className="w-[90%] h-15 border-2 border-black rounded-2xl p-5 flex justify-between items-center">
              <a
                href={`https://server-production-385f.up.railway.app/get/${shortURL}`}
                target="_blank"
                rel="noopener noreferrer"
              >{`https://server-production-385f.up.railway.app/get/${shortURL}`}</a>
              <button
              type="button" 
              className="border-2 border-black cursor-pointer"
                onClick={() =>{
                  navigator.clipboard.writeText(`https://server-production-385f.up.railway.app/get/${shortURL}`);
                  setCopy(false);
                }
                }
              
              >
                {copy?"Copy":"Copied"}
              </button>
            </div>
          )}
        </div>
      </form>
    </>
  );
}
