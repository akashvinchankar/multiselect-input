import { useEffect, useRef, useState } from "react";
import "./App.css";
import Pill from "./components/Pill";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUserSet, setSelectedUserSet] = useState(new Set());

  const inputRef = useRef(null);

  useEffect(() => {
    function fetchUsers() {
      if (searchTerm.trim() === "") {
        setSuggestions([]);
        return;
      }

      fetch(`https://dummyjson.com/users/search?q=${searchTerm}`).then((res) =>
        res
          .json()
          .then((data) => setSuggestions(data))
          .catch(console.error)
      );
    }

    const debouncedFetch = setTimeout(fetchUsers, 500);

    return () => clearTimeout(debouncedFetch);
  }, [searchTerm]);

  const handleSelectUser = (user) => {
    setSelectedUsers([...selectedUsers, user]);
    setSelectedUserSet(new Set([...selectedUserSet, user.email]));
    setSearchTerm("");
    setSuggestions([]);
    inputRef.current.focus();
  };

  const handleRemoveUser = (user) => {
    setSelectedUsers(selectedUsers.filter((u) => u.email !== user.email));
    setSelectedUserSet(
      new Set([...selectedUserSet].filter((u) => u !== user.email))
    );
  };

  const handleKeyDown = (e) => {
    if (
      e.key === "Backspace" &&
      searchTerm === "" &&
      selectedUsers.length > 0
    ) {
      const lastUser = selectedUsers[selectedUsers.length - 1];
      handleRemoveUser(lastUser);
      setSuggestions([]);
    }
  };

  return (
    <div className="user-search-container">
      <div className="user-search-input">
        {/* Pills */}
        {selectedUsers.map((user) => (
          <Pill
            key={user.email}
            image={user.image}
            text={`${user.firstName} ${user.lastName}`}
            onClick={() => {
              handleRemoveUser(user);
            }}
          />
        ))}
        {/* input field and search suggestions */}
        <div>
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for a user..."
            onKeyDown={handleKeyDown}
          />
          {/* Search Suggestions */}
          <ul className="suggestions-list">
            {suggestions?.users?.map((user) => {
              return !selectedUserSet.has(user.email) ? (
                <li key={user.email} onClick={() => handleSelectUser(user)}>
                  <img
                    src={user.image}
                    alt={`${user.firstName} ${user.lastName}`}
                  />
                  <div>
                    <h4>{`${user.firstName} ${user.lastName}`}</h4>
                  </div>
                </li>
              ) : (
                <></>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
