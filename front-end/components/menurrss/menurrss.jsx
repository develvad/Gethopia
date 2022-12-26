import React, { useState } from 'react';

function DropUpMenu() {
  const [isMenuVisible, setMenuVisibility] = useState(false);

  const toggleMenu = () => {
    setMenuVisibility(!isMenuVisible);
  };

  return (
    <div>
      <button onClick={toggleMenu}>
        <i className="fas fa-ellipsis-v"></i>
      </button>
      {isMenuVisible && (
        <ul className="drop-up-menu">
          <li>Menu item 1</li>
          <li>Menu item 2</li>
          <li>Menu item 3</li>
        </ul>
      )}
        <div>
            <Outlet/>
        </div>    
    </div> 
  );
}

export default DropUpMenu;