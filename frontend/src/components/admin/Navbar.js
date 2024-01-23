import { useState } from "react";


const Navbar = ({viewStatus, handleResize, search, handleSearchInput}) => {

    const [showSearch, setShowSearch] = useState(false);

    const handleSearch = () => {
        setShowSearch(!showSearch);

    }

    return (
        <div className="full-width navbar">
            <button className="resize-button minus" onClick={() => handleResize("smaller")}>-</button>
            <p className="navtext">{viewStatus ? 'ToDo View': 'Group View'}</p>
            <button className="resize-button plus" onClick={() => handleResize("larger")}>+</button>
            <div className="search-container">
                <button className="search" onClick={handleSearch}><ion-icon name="search-outline"></ion-icon></button>
                {showSearch ?
                    <input className="search-bar"
                    value={search}
                    onChange={handleSearchInput}
                    />
                    :
                    null
                }
            </div>
        </div>
    );
}

export default Navbar;