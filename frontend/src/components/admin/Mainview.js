import { useState } from 'react';


import Navbar from './Navbar';
import Todoview from './Todoview';
import Groupview from './Groupview';


const Mainview = ({todoView}) => {
    const xsize = ['smallestCol', 'smallerCol', 'mediumCol', 'largestCol'];
    const ysize = ['smallestRow', 'smallerRow', 'mediumRow', 'largestRow'];
  
    const [sizeNumber, setSizeNumber] = useState(2);
    const [rowSize, setRowSize] = useState(ysize[sizeNumber]);
    const [widthSize, setWidthSize] = useState(xsize[sizeNumber]);
    const [search, setSearch] = useState("");

    const handleSearchInput = (e) => setSearch(e.target.value);
  
    const makeLarger = () =>  {
        if(sizeNumber < 3) {
            const newSize = sizeNumber + 1;
            setSizeNumber(newSize);
            setRowSize(ysize[newSize]);
            setWidthSize(xsize[newSize]);
        }
    }

    const makeSmaller = () => {
        if(sizeNumber > 0) {
            const newSize = sizeNumber - 1;
            setSizeNumber(newSize);
            setRowSize(ysize[newSize]);
            setWidthSize(xsize[newSize])
        }
    }

    const handleResize = (size) => {
        if (size === 'smaller') {
            makeSmaller();
        } else {
            makeLarger();
        }
    }
    
  
    return (
        <div className="full-container relative">
            <Navbar viewStatus={todoView} handleResize={handleResize} search={search} handleSearchInput={handleSearchInput}/>
            {todoView ? <Todoview rowSize={rowSize} widthSize={widthSize} search={search}/> : <Groupview rowSize={rowSize} widthSize={widthSize} search={search}/>}
        </div>
    );
}

export default Mainview;