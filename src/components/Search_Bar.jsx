import { useEffect, useRef, useState } from "react";

const STATE = {
  LOADING: "LOADING",
  ERROR: "ERROR",
  SUCCESS: "SUCCESS",
};
const Search_Bar = () => {
  const [query, setQuery] = useState("");
  const [lists, setList] = useState([]);
  const [status, setStatus] = useState(STATE.LOADING);
  const cache = useRef({});

  useEffect(() => {
    const abortController = new AbortController();
    const fetchData = async () => {
      try {
        setStatus(STATE.LOADING);
        if (cache.current[query]) {
          console.log("Cache hit");
          setList(cache.current[query]);
          setStatus(STATE.SUCCESS);
          return;
        }
        console.log("API call");
        setStatus(STATE.LOADING);
        const res = await fetch(
          `https://dummyjson.com/products/search?q=${query}&limit=10`,
          { signal: abortController.signal }
        );
        const data = await res.json();
        setList(data.products);
        cache.current[query] = data.products;
        setStatus(STATE.SUCCESS);
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("Aborted");
          setStatus(STATE.ERROR);
        }
      }
    };

    const timerId = setTimeout(fetchData, 1000);
    return () => {
      clearInterval(timerId);
      abortController.abort();
    };
  }, [query]);
  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {status === STATE.LOADING && <p>Loading...</p>}
      {status === STATE.ERROR && <p>Error....</p>}
      {status === STATE.SUCCESS && (
        <ul>
          {lists.map((list) => {
            return <li key={list.id}>{list.title}</li>;
          })}
        </ul>
      )}
    </div>
  );
};

export default Search_Bar;
