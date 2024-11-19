import React, { useState } from "react";

const Popup = (props) => {
  const { wordapi, wordhost, host, api } = props.prop;
  const [word, setWord] = useState("");
  const [phrase, setPhrase] = useState("");
  const [result, setResults] = useState([]);
  const [tab, setTab] = useState("");
  const [loader, setLoader] = useState("");
  const [ailoader, setAiloader] = useState("");
  const [cross, setCross] = useState(false);
  const [aicross, setAicross] = useState(false);
  const [ai, setAi] = useState(false);
  const [airesult, setAiresult] = useState(true);
  const [btn, setBtn] = useState(true);
  const [btns, setBtns] = useState(true);

  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": wordapi,
      "x-rapidapi-host": wordhost,
    },
  };

  const handleSearch = async (e, ep) => {
    e.preventDefault();
    const url = `${api}/${word}/${ep}`;
    setLoader("spinner-border spinner-border-sm");
    setResults([]);
    setTab("");
    setBtns(false);
    try {
      const resp = await fetch(url, options);
      const res = await resp.json();
      const normalizedData = Array.isArray(res[ep])
        ? res[ep].map((item) =>
            typeof item === "string" ? item : item.definition
          )
        : ["No data available"];
      setTab(ep.charAt(0).toUpperCase() + ep.slice(1));
      setResults(normalizedData);
      setLoader("");
      setCross(true);
      setBtns(true);
    } catch (error) {
      setLoader("");
      setResults(["some error occured"]);
      setBtns(true);
    }
  };
  const handleRhymes = async (e) => {
    e.preventDefault();
    const url = `${api}/${word}/rhymes`;
    setLoader("spinner-border spinner-border-sm");
    setResults([]);
    setTab("");
    setBtns(false);
    try {
      const resp = await fetch(url, options);
      const res = await resp.json();
      setTab("Rhymes");
      setResults(res.rhymes.all);
      setLoader("");
      setCross(true);
      setBtns(true);
    } catch (error) {
      setLoader("");
      setResults(["some error occured"]);
      setBtns(true);
    }
  };
  const clear = (e) => {
    e.preventDefault();
    if (!ai) {
      setTab("");
      setResults([]);
      setCross(false);
    } else {
      setAiresult("");
      setAicross(false);
    }
  };
  const handleBack = (e) => {
    e.preventDefault();
    setAi(false);
    setAiresult("");
    setBtn(true);
    setPhrase("");
    setAicross(false);
  };
  const handleAI = async (e) => {
    e.preventDefault();
    setAiloader("spinner-border spinner-border-sm");
    setBtn(false);
    const aires = await fetch(`${host}/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: phrase }),
    });
    const res = await aires.json();
    setAiresult(res.result);
    setAicross(true);
    setAiloader("");
    setBtn(true);
  };

  return (
    <div className="container p-4" style={{ width: "350px" }}>
      <h2
        style={{ fontFamily: "Bradley Hand, cursive" }}
        className="text-center"
      >
        LexiClick
      </h2>
      <hr />
      {!ai ? (
        <div>
          <input
            type="text"
            className="form-control my-4"
            placeholder="Type a word..."
            value={word}
            onChange={(e) => setWord(e.target.value)}
          />
          <div
            className="tabs"
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "10px",
              flexFlow: "row wrap",
              justifyContent: "center",
            }}
          >
            <button
              className="btn btn-warning btn-sm"
              style={{ borderRadius: "10px" }}
              onClick={(e) => handleSearch(e, "definitions")}
              disabled={word.length === 0 || btns === false}
            >
              Meaning
            </button>
            <button
              className="btn btn-warning btn-sm"
              style={{ borderRadius: "10px" }}
              onClick={(e) => handleSearch(e, "synonyms")}
              disabled={word.length === 0 || btns === false}
            >
              Synonyms
            </button>
            <button
              className="btn btn-warning btn-sm"
              style={{ borderRadius: "10px" }}
              onClick={(e) => handleSearch(e, "examples")}
              disabled={word.length === 0 || btns === false}
            >
              Examples
            </button>
            <button
              className="btn btn-warning btn-sm"
              style={{ borderRadius: "10px" }}
              onClick={(e) => handleSearch(e, "antonyms")}
              disabled={word.length === 0 || btns === false}
            >
              Antonyms
            </button>
            <button
              className="btn btn-warning btn-sm"
              style={{ borderRadius: "10px" }}
              onClick={handleRhymes}
              disabled={word.length === 0 || btns === false}
            >
              Rhymes
            </button>
          </div>
          <div className="content my-4">
            <span className={loader}></span>
            <h4 className="d-inline mb-3">{tab}</h4>
            {cross && (
              <button
                className="btn btn-default btn-sm d-inline"
                style={{ float: "right" }}
                onClick={clear}
              >
                ✕
              </button>
            )}
            <div className="p-2">
              {result.length > 0 &&
                result.map((item, index) => {
                  return (
                    <div>
                      <p
                        style={{
                          textAlign: "justify",
                          marginBottom: "-0.8%",
                          fontSize: "14px",
                        }}
                      >
                        <span className="me-2">{index + 1}.</span>
                        {item}
                      </p>
                    </div>
                  );
                })}
            </div>
          </div>
          <hr />
          <button
            className="btn btn-primary btn-sm"
            style={{ width: "100px", borderRadius: "10px" }}
            onClick={() => setAi(true)}
          >
            ask AI
          </button>
        </div>
      ) : (
        <div>
          <button className="btn btn-defaault btn-sm" onClick={handleBack}>
            {" "}
            ← back
          </button>
          <br />
          <center>
            <label
              for="ainput"
              className="form-label text-muted"
              style={{ fontSize: "14px" }}
            >
              Ask AI
            </label>
          </center>
          <input
            type="text"
            id="ainput"
            className="form-control mb-4"
            placeholder="Type a word or phrase..."
            value={phrase}
            onChange={(e) => setPhrase(e.target.value)}
          />
          <button
            className="btn btn-warning btn-sm me-3"
            style={{ borderRadius: "10px", width: "100px" }}
            onClick={handleAI}
            disabled={phrase.length === 0 || btn === false}
          >
            Search
          </button>
          <span className={ailoader}></span>
          <div
            className="p-2"
            style={{ display: "flex", flexDirection: "column" }}
          >
            {aicross && (
              <button
                className="btn btn-default btn-sm"
                style={{ alignSelf: "flex-end" }}
                onClick={clear}
              >
                ✕
              </button>
            )}
            <p style={{ textAlign: "justify", fontSize: "14px" }}>{airesult}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Popup;
